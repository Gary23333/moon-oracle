# 月影决策屋 API 文档

## 概述

月影决策屋由「前端应用 + 轻量后端代理」两部分组成：

- **前端**：原生 JS 多页应用（`*.html` + `js/**`），所有 AI 调用统一走 **`POST /api/chat`** 代理。
- **后端代理**（`server/`，Node 原生 http，**零第三方依赖**）：托管构建后的 `dist/` 静态资源，并暴露 `/api/chat`，负责转发至上游 OpenAI 兼容端点、以 SSE 流式回传、**在服务端注入 API Key**、并把上游错误码映射为友好中文提示。

前端不再直接持有密钥发起跨域请求；密钥由服务端（环境变量）注入，浏览器端 BYOK 仅作本地开发兜底。

---

## 1. 后端代理接口 `POST /api/chat`

### 端点

```
POST /api/chat
```

- 生产：由 `server/index.js`（`npm start`）提供。
- 开发：由 `vite.config.js` 在 `/api` 挂载同一处理器（`npm run dev`）。

### 请求头

```
Content-Type: application/json
```

> 代理自身的鉴权在服务端完成，无需在请求头中携带 `Authorization`。

### 请求体

```json
{
  "provider": "deepseek",
  "baseUrl": "",
  "apiKey": "sk-xxx",
  "model": "deepseek-flash",
  "messages": [
    {"role": "system", "content": "系统提示词"},
    {"role": "user", "content": "用户消息"}
  ],
  "stream": true,
  "thinking": true,
  "reasoning_effort": "high",
  "timeout": 120000
}
```

#### 参数说明

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `provider` | string | 否 | 厂商 id：`deepseek`（默认，内置）或 `custom`（OpenAI 兼容） |
| `baseUrl` | string | 条件 | `provider === "custom"` 时的上游基址；内置厂商不必传 |
| `apiKey` | string | 否 | 客户端自带密钥（BYOK 兜底）；**服务端优先使用环境变量**，浏览器端仅作为本地开发兜底 |
| `model` | string | 否 | 模型名，缺省取该厂商首个模型（`deepseek-flash`） |
| `messages` | array | 是 | 消息数组；支持纯文本，也支持 Vision 图文（`content` 为数组） |
| `stream` | boolean | 否 | 是否以 SSE 流式返回，默认 `false` |
| `thinking` | boolean | 否 | 是否开启思考模式；仅当为 `true` 时上游附加 `thinking:{"type":"enabled"}` 与 `reasoning_effort` |
| `reasoning_effort` | string | 否 | 思考强度，`"high"`（默认）或 `"max"` |
| `timeout` | number | 否 | 上游请求超时毫秒数（如 `120000`）。超时或客户端断开都会中止上游请求 |

> **注意**：思考模式不支持 `temperature`、`top_p`、`presence_penalty`、`frequency_penalty` 参数。
>
> ---
>
> ### 厂商（provider）解析与服务端密钥
>
> 服务端通过 `server/providers.js` 解析厂商信息，密钥解析顺序为：
>
> 1. **客户端自带 `apiKey`（BYOK 兜底）**
> 2. **服务端环境变量**：内置 `deepseek` 读取 `DEEPSEEK_API_KEY`；`custom` 默认读取 `OPENAI_API_KEY`（未设置时可用任意匹配变量名）
>
> 两者均缺失时返回结构化 `401`（`code: "missing_api_key"`）。上游请求头 `Authorization: Bearer <key>` 由**服务端**组装，密钥不会下发到浏览器，且错误信息中的密钥会被掩码为 `***`。
>
> 内置厂商：`deepseek`（`https://api.deepseek.com`，模型 `deepseek-flash` / `deepseek-v4-pro`）。

### 响应体

#### 非流式（`stream: false`）

原样透传上游 JSON：

```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "deepseek-flash",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "最终回答内容",
        "reasoning_content": "思考过程内容（仅思考模式）"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 100,
    "completion_tokens": 200,
    "total_tokens": 300
  }
}
```

#### 流式（`stream: true`）

响应头：

```
Content-Type: text/event-stream; charset=utf-8
Cache-Control: no-cache
Connection: keep-alive
```

代理以 SSE 原样透传上游分片，每个事件形如：

```
data: {"choices":[{"delta":{"content":"逐字内容"}}]}

data: {"choices":[{"delta":{"reasoning_content":"思考过程分片"}}]}

data: [DONE]
```

- `choices[0].delta.content` — 正文增量
- `choices[0].delta.reasoning_content` — 思考过程增量（仅思考模式）
- 末帧固定为 `data: [DONE]`

#### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `choices[0].message.content` | string | 非流式：模型的最终回答 |
| `choices[0].message.reasoning_content` | string | 非流式：思考过程（仅开启思考模式时返回） |
| `choices[0].delta.content` | string | 流式：正文增量 |
| `choices[0].delta.reasoning_content` | string | 流式：思考过程增量 |
| `usage` | object | token 使用量 |

### 错误响应

统一格式：

```json
{
  "error": {
    "message": "错误描述",
    "code": "missing_api_key"
  }
}
```

常见 `code`：`missing_api_key`、`missing_base_url`、`missing_model`、`invalid_messages`、`invalid_json`、`method_not_allowed`、`bad_request`（含请求体过大）、`upstream_error`、`upstream_unreachable`、`upstream_timeout`、`internal_error`。

---

## 2. 各功能调用方式

所有调用均通过 `js/common/api.js` 的 `MoonAPI`（`chat` / `streamChat` / `chatSingle`）发起，最终都落到 `POST /api/chat`。模型与思考开关由 `js/common/routing.js` 按任务分级解析。

### 2.1 塔罗占卜解读（流式）

**触发时机**：用户选牌并补充细节后

**路由**：模型 `deepseek-v4-pro`，思考开启，流式

**系统提示词**：包含所抽牌面的牌义、牌阵信息、用户问题和细节（提示词已瘦身：不再注入完整 78 张牌义表，仅注入所抽牌义）

**调用方式**：

```javascript
const result = await MoonAPI.streamChat(messages, { model: 'deepseek-v4-pro', thinking: true }, {
  onDelta: (text) => { /* 增量渲染正文 */ },
  onReasoning: (text) => { /* 增量渲染思考过程 */ }
});
// result.content  - 解读文本
// result.thinking - 思考过程
```

**输入内容**：用户问题、问题分类、牌阵类型与各位置含义、每张牌的名称/正逆位/关键词、用户补充细节

**输出内容**：逐张牌解读、整体综合解读、关键启示（3 点）、建议与指引、月影寄语

### 2.2 塔罗追问（流式）

**触发时机**：用户在结果页输入追问

**路由**：模型 `deepseek-v4-pro`，思考开启，流式

**调用方式**：

```javascript
const messages = [
  { role: 'system', content: followupPrompt },
  ...conversationHistory,
  { role: 'user', content: userQuestion }
];
const result = await MoonAPI.streamChat(messages, { model: 'deepseek-v4-pro', thinking: true }, { onDelta });
```

**上下文维护**：通过 `conversationHistory` 数组维护多轮对话

### 2.3 转盘 AI 生成（结构化 JSON，非流式）

**触发时机**：用户输入一句话描述并点击"AI生成"

**路由**：模型 `deepseek-flash`，思考关闭，**非流式**（需解析完整 JSON）

**系统提示词**：

```
你是转盘生成器。从用户输入中提取转盘名称、图标和选项列表。
返回JSON格式，选项4-12个，每个2-6个字。
示例输出：{"name":"晚上吃什么","icon":"🍽️","options":["火锅","烧烤","寿司","麻辣烫","炒饭","面条","饺子","披萨"]}
```

**用户消息**：`用户输入：{用户输入的文本}`

**响应解析**：
1. 从响应中提取 JSON 对象（正则匹配 `{...}`）
2. 验证 `options` 数组存在且长度 >= 2
3. 截取前 12 个选项

**调用方式**：

```javascript
const result = await WheelAIGenerator.generateFromText(userInput);
if (result.success) {
  // result.data.name - 转盘名称
  // result.data.icon - 图标
  // result.data.options - 选项数组
}
```

### 2.4 OCR 截图识别（DeepSeek Vision 多模态，非流式）

**用途**：从截图中识别文字，自动生成转盘选项

**实现方式**：向视觉模型（`deepseek-flash`）发送 **base64 图像的 content part**，由多模态模型直接读数；保留图片类型/尺寸校验与友好错误提示，并保留文本提取兜底。**已移除 Tesseract.js，无 CDN 依赖。**

**路由**：模型 `deepseek-flash`，思考关闭，非流式

**调用方式**：

```javascript
const result = await WheelAIGenerator.fromOCR(imageFile);
// 参数：imageFile - File 对象（来自 <input type="file">）
// 返回：
// 成功: { success: true, data: { name, icon, options } }
// 失败: { success: false, error: string, rawText?: string }
```

**图文消息构造**（`MoonAPI.buildVisionMessage`）：

```javascript
{
  role: 'user',
  content: [
    { type: 'text', text: '请从图中提取选项...' },
    { type: 'image_url', image_url: { url: '<base64 data URL>', detail: 'auto' } }
  ]
}
```

**流程**：类型/尺寸校验 → 转 base64 data URL → 构造 Vision 消息 → 提取/清洗选项（去行号前缀、逗号分割）→ 返回 2-12 个选项

### 2.5 附近美食双转盘（结构化 JSON，非流式）

**用途**：基于用户位置推荐附近餐厅，双转盘级联选择

**路由**：模型 `deepseek-flash`，思考关闭，非流式

**调用方式**：

```javascript
// 第一步：获取菜系转盘
const result = await WheelAIGenerator.fromLocation();
// 返回：{ success: true, data: { name, icon, options }, isDual: true, location: { lat, lng } }

// 第二步：根据选中菜系获取餐厅转盘
const detail = await WheelAIGenerator.fromLocationDetail(cuisine, coords);
// 参数：cuisine - 选中的菜系名称, coords - { lat, lng }
// 返回：{ success: true, data: { name, icon, options } }
```

**流程**：
1. `navigator.geolocation.getCurrentPosition()` 获取坐标
2. 坐标发送给 AI，推荐当地菜系（转盘1）
3. 用户选择菜系后，再次调用 AI 推荐具体餐厅（转盘2）
4. 定位被拒绝时，降级为通用美食推荐

### 2.6 电影推荐（结构化 JSON，非流式）

**用途**：AI 生成热门/经典电影推荐转盘

**路由**：模型 `deepseek-flash`，思考关闭，非流式

**调用方式**：

```javascript
const result = await WheelAIGenerator.getMovies(genre);
// 参数：genre - 可选，电影类型（如"科幻"、"喜剧"）
// 返回：{ success: true, data: { name, icon, options } }
```

### 2.7 转盘结果 AI 解读（流式）

**用途**：转盘出结果后，调用 AI 做趣味解读

**路由**：模型 `deepseek-flash`，思考关闭，流式

**调用方式**：

```javascript
const result = await WheelAIGenerator.interpretResult(wheelName, resultOption, { onDelta });
// 参数：wheelName - 转盘名称, resultOption - 命运选择的结果
// 返回：{ success: true, content: string }
```

**触发条件**：配置项 `wheelResultAI` 为 `true` 时自动调用

### 2.8 每日塔罗（流式）

**日期种子算法**：根据日期生成固定牌面，无需 API 调用

```javascript
const seed = Date.now() / (1000 * 60 * 60 * 24) | 0;
const cardIndex = seed % 78;
const isReversed = (seed % 10) >= 5;
```

**AI 解读（可选，流式）**：用户点击"AI 解读"按钮时，模型 `deepseek-flash`、思考关闭、流式；输入为当前日期、牌面名称/正逆位、关键词与当日语录；输出为今日运势概述、牌面解读、行动建议、能量指引。

```javascript
const result = await MoonAPI.streamChat(messages, { model: 'deepseek-flash', thinking: false }, { onDelta });
```

### 2.9 快占·答案之书（流式增强）

**牌义加权算法**：根据牌义倾向计算 Yes/No 概率，无需 API 调用

```javascript
const card = drawRandomCard();
const weight = card.reversed ? card.reverseWeight : card.uprightWeight;
const answer = selectAnswer(weight);
```

**AI 增强（可选，流式）**：用户点击"AI 深度解读"按钮时，模型 `deepseek-flash`、思考关闭、流式；输入为用户问题、牌面名称/正逆位、答案文本与关键词；输出为深度解读、结合问题的分析与建议指引。

```javascript
const result = await MoonAPI.streamChat(messages, { model: 'deepseek-flash', thinking: false }, { onDelta });
```

---

## 3. 错误处理

### HTTP 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误（JSON 非法、缺少 messages 等） |
| 401 | API Key 缺失或无效 |
| 403 | 上游额度不足 / 权限受限 |
| 404 | 上游接口不存在（API 地址配置错误） |
| 405 | 仅支持 POST |
| 413 | 请求体过大 |
| 429 | 请求频率超限 |
| 500 | 服务器内部错误 |
| 502 / 504 | 无法连接上游 / 上游超时或已取消 |

### 错误响应格式

```json
{
  "error": {
    "message": "错误描述",
    "code": "missing_api_key"
  }
}
```

### 前端错误处理

```javascript
try {
  const result = await MoonAPI.streamChat(messages, { thinking: true }, { onDelta });
} catch (error) {
  if (error.message.includes('401')) {
    // API Key 无效
  } else if (error.message.includes('429')) {
    // 请求过于频繁
  } else if (error.message.includes('取消') || error.message.includes('超时')) {
    // 请求超时或被取消（AbortController）
  }
}
```

---

## 4. 配置项说明

所有配置存储在 `localStorage` 的 `moon_oracle_config` 键中。

```json
{
  "provider": "deepseek",
  "model": "deepseek-flash",
  "customBaseUrl": "",
  "apiUrl": "https://api.deepseek.com",
  "apiKey": "sk-xxx",
  "streaming": true,
  "models": {
    "reading": "deepseek-v4-pro",
    "followup": "deepseek-v4-pro",
    "generate": "deepseek-flash",
    "vision": "deepseek-flash",
    "quick": "deepseek-flash",
    "daily": "deepseek-flash"
  },
  "thinkingByTask": {
    "reading": true,
    "followup": true,
    "generate": false,
    "quick": false,
    "daily": false,
    "interpret": false
  },
  "thinkingEnabled": true,
  "thinkingEffort": "high",
  "showThinking": false,
  "typingSpeed": 30,
  "readerPersona": "gentle",
  "wheelResultAI": false,
  "tarotPrompts": {
    "greeting": "问候提示词",
    "reading": "解读提示词",
    "followup": "追问提示词",
    "detailQuestion": "细节追问词"
  },
  "wheelPrompts": {
    "generate": "转盘生成提示词",
    "location": "菜系推荐提示词",
    "locationDetail": "餐厅推荐提示词",
    "movie": "电影推荐提示词",
    "resultInterpret": "结果解读提示词"
  },
  "dailyPrompts": {
    "reading": "每日塔罗解读提示词"
  },
  "quickPrompts": {
    "enhance": "快占 AI 增强提示词"
  }
}
```

> `apiKey` 为浏览器端 BYOK 兜底项：服务端已配置环境变量时不会使用。`models` / `thinkingByTask` 为按任务分级的路由配置。

---

## 5. 调用频率与限制

| 功能 | 调用频率 | 模型 | 思考模式 | 流式 | 说明 |
|------|---------|------|---------|------|------|
| 塔罗占卜 | 1 次 | `deepseek-v4-pro` | ✅ | ✅ | 仅注入所抽牌义 |
| 塔罗追问 | 每次 1 次 | `deepseek-v4-pro` | ✅ | ✅ | 保持占卜上下文 |
| 每日塔罗 | 0~1 次 | `deepseek-flash` | ❌ | ✅ | 纯前端日期种子，可选 AI 解读 |
| 快占·答案之书 | 0~1 次 | `deepseek-flash` | ❌ | ✅ | 纯前端牌义加权，可选 AI 增强 |
| 转盘 AI 生成 | 1 次 | `deepseek-flash` | ❌ | ❌ | 结构化 JSON |
| OCR 识别 | 1 次 | `deepseek-flash` | ❌ | ❌ | Vision 多模态（图像 content part） |
| 附近美食 | 2 次 | `deepseek-flash` | ❌ | ❌ | 菜系 + 餐厅（结构化 JSON） |
| 电影推荐 | 1 次 | `deepseek-flash` | ❌ | ❌ | AI 生成电影列表 |
| 结果 AI 解读 | 1 次 | `deepseek-flash` | ❌ | ✅ | 需开启 `wheelResultAI` |
| 预设/自定义转盘 | 0 次 | — | — | — | 纯前端 |

**建议**：
- 添加请求频率限制（如 10 次/分钟）
- 上游超时建议 120 秒（前端 `timeout` 默认 120000）
- 使用 `AbortController` 支持请求取消；前端已做网络级失败有限重试

---

## 6. 安全注意事项

1. **API Key 注入**：生产环境由服务端读取环境变量（如 `DEEPSEEK_API_KEY`）并在转发时注入，密钥不下发到浏览器；浏览器端 BYOK 仅作本地开发兜底。代理对错误信息中的密钥掩码为 `***`。
2. **输入校验**：用户输入应做长度限制，防止超长 prompt；上传图片做类型/尺寸校验。
3. **HTTPS**：所有 API 请求必须使用 HTTPS。
4. **代理边界**：前端只与自身 `/api/chat` 通信；上游地址与密钥均由服务端掌控。
