# 月影决策屋 API 文档

## 概述

月影决策屋是一个纯前端应用，通过 DeepSeek API 实现塔罗占卜解读和智能转盘生成。本文档描述了应用使用的所有 API 接口。

---

## 1. DeepSeek Chat Completions API

### 端点

```
POST {apiUrl}/chat/completions
```

默认 `apiUrl` 为 `https://api.deepseek.com`

### 请求头

```
Content-Type: application/json
Authorization: Bearer {apiKey}
```

### 请求体

```json
{
  "model": "deepseek-v4-flash",
  "messages": [
    {"role": "system", "content": "系统提示词"},
    {"role": "user", "content": "用户消息"}
  ],
  "stream": false,
  "thinking": {"type": "enabled"},
  "reasoning_effort": "high"
}
```

#### 参数说明

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| model | string | 是 | 模型名称，如 `deepseek-v4-flash` |
| messages | array | 是 | 消息数组 |
| stream | boolean | 否 | 是否流式输出，默认 `false` |
| thinking | object | 否 | 思考模式配置，`{"type": "enabled"}` 或 `{"type": "disabled"}` |
| reasoning_effort | string | 否 | 思考强度，`"high"` 或 `"max"` |

> **注意**：思考模式不支持 `temperature`、`top_p`、`presence_penalty`、`frequency_penalty` 参数。

### 响应体

```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "deepseek-v4-flash",
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

#### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| choices[0].message.content | string | 模型的最终回答 |
| choices[0].message.reasoning_content | string | 思考过程（仅开启思考模式时返回） |
| usage | object | token 使用量 |

---

## 2. 塔罗占卜接口调用

### 2.1 占卜解读

**触发时机**：用户选牌并补充细节后

**系统提示词**：包含完整的牌义参考、牌阵信息、用户问题和细节

**调用方式**：

```javascript
const result = await MoonAPI.chatSingle(systemPrompt, userMessage, { thinking: true });
// result.content - 解读文本
// result.thinking - 思考过程
```

**输入内容**：
- 用户问题
- 问题分类（情感/事业/财运等）
- 牌阵类型和各位置含义
- 每张牌的名称、正逆位、关键词
- 用户补充的细节

**输出内容**：
- 逐张牌解读（牌面意象、位置含义、结合细节的解读）
- 整体综合解读
- 关键启示（3个要点）
- 建议与指引
- 月影寄语

### 2.2 追问功能

**触发时机**：用户在结果页输入追问

**调用方式**：

```javascript
const messages = [
  { role: 'system', content: followupPrompt },
  ...conversationHistory,
  { role: 'user', content: userQuestion }
];
const result = await MoonAPI.chat(messages);
```

**上下文维护**：通过 `conversationHistory` 数组维护多轮对话

---

## 3. 转盘 AI 生成接口

### 3.1 一句话生成转盘

**触发时机**：用户输入一句话描述并点击"AI生成"

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
3. 截取前12个选项

**调用方式**：

```javascript
const result = await WheelAIGenerator.generateFromText(userInput);
if (result.success) {
  // result.data.name - 转盘名称
  // result.data.icon - 图标
  // result.data.options - 选项数组
}
```

---

## 4. 高级功能 API

### 4.1 OCR 截图识别

**用途**：从截图中识别文字，自动生成转盘选项

**实现方式**：Tesseract.js 浏览器端 OCR，无需后端服务

**调用方式**：

```javascript
const result = await WheelAIGenerator.fromOCR(imageFile);
// 参数：imageFile - File 对象（来自 <input type="file">）
// 返回：
// 成功: { success: true, data: { name, icon, options } }
// 失败: { success: false, error: string, rawText?: string }
```

**流程**：
1. 按需从 CDN 加载 Tesseract.js（首次约 2MB）
2. 使用 `chi_sim+eng` 语言包识别中英文
3. 多策略提取选项：行分割 → 去行号前缀 → 逗号分割
4. 返回 2-12 个选项

### 4.2 附近美食双转盘

**用途**：基于用户位置推荐附近餐厅，双转盘级联选择

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
2. 坐标发送给 DeepSeek，AI 推荐当地菜系（转盘1）
3. 用户选择菜系后，再次调用 AI 推荐具体餐厅（转盘2）
4. 定位被拒绝时，降级为通用美食推荐

### 4.3 电影推荐

**用途**：AI 生成热门/经典电影推荐转盘

**调用方式**：

```javascript
const result = await WheelAIGenerator.getMovies(genre);
// 参数：genre - 可选，电影类型（如"科幻"、"喜剧"）
// 返回：{ success: true, data: { name, icon, options } }
```

### 4.4 转盘结果 AI 解读

**用途**：转盘出结果后，调用 AI 做趣味解读

**调用方式**：

```javascript
const result = await WheelAIGenerator.interpretResult(wheelName, resultOption);
// 参数：wheelName - 转盘名称, resultOption - 命运选择的结果
// 返回：{ success: true, content: string }
```

**触发条件**：配置项 `wheelResultAI` 为 `true` 时自动调用

---

## 5. 错误处理

### HTTP 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | API Key 无效 |
| 429 | 请求频率超限 |
| 500 | 服务器内部错误 |

### 错误响应格式

```json
{
  "error": {
    "message": "错误描述",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}
```

### 前端错误处理

```javascript
try {
  const result = await MoonAPI.chat(messages);
} catch (error) {
  if (error.message.includes('401')) {
    // API Key 无效
  } else if (error.message.includes('429')) {
    // 请求过于频繁
  } else if (error.name === 'AbortError') {
    // 请求超时或被取消
  }
}
```

---

## 6. 配置项说明

所有配置存储在 `localStorage` 的 `moon_oracle_config` 键中。

```json
{
  "apiUrl": "https://api.deepseek.com",
  "apiKey": "sk-xxx",
  "model": "deepseek-v4-flash",
  "thinkingEnabled": true,
  "thinkingEffort": "high",
  "showThinking": false,
  "typingSpeed": 30,
  "soundEnabled": true,
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
  }
}
```

---

## 7. 调用频率与限制

| 功能 | 调用频率 | 思考模式 | 说明 |
|------|---------|---------|------|
| 塔罗占卜 | 1 次 | ✅ | 含完整牌义上下文 |
| 塔罗追问 | 每次 1 次 | ✅ | 保持占卜上下文 |
| 转盘 AI 生成 | 1 次 | ❌ | 响应较快 |
| OCR 识别 | 0 次 | — | Tesseract.js 浏览器端 |
| 附近美食 | 2 次 | ❌ | 菜系 + 餐厅 |
| 电影推荐 | 1 次 | ❌ | AI 生成电影列表 |
| 结果 AI 解读 | 1 次 | ❌ | 需开启 wheelResultAI |
| 预设/自定义转盘 | 0 次 | — | 纯前端 |

**建议**：
- 添加请求频率限制（如 10 次/分钟）
- 对长时间请求添加超时处理（建议 120 秒）
- 使用 AbortController 支持请求取消

---

## 8. 安全注意事项

1. **API Key 存储**：当前存储在 localStorage，可被 XSS 攻击窃取。生产环境建议通过后端代理。
2. **输入校验**：用户输入应做长度限制，防止超长 prompt。
3. **HTTPS**：API 请求必须使用 HTTPS。
4. **CORS**：DeepSeek API 支持跨域请求，但需确保域名白名单配置正确。
