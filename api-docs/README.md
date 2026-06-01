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

## 4. 占位 API（后续接入）

### 4.1 OCR 截图识别

**用途**：从截图中识别文字，自动生成转盘选项

**预留接口**：

```javascript
WheelAIGenerator.fromOCR(imageFile)
// 参数：imageFile - 用户上传的图片文件
// 返回：{ success: false, error: '功能即将上线' }
```

**后续接入方案**：
- 腾讯云 OCR API
- 百度 OCR API
- 阿里云 OCR API

### 4.2 地理位置美食

**用途**：基于用户位置推荐附近餐厅，支持双转盘（菜系→餐厅）

**预留接口**：

```javascript
WheelAIGenerator.fromLocation(cuisine)
// 参数：cuisine - 可选，菜系名称
// 返回：{ success: true/false, data/fallback }
```

**后续接入方案**：
- 高德地图 POI 搜索 API
- 百度地图周边搜索 API
- 腾讯地图地点搜索 API

**双转盘流程**：
1. 第一个转盘：选择菜系（火锅/烧烤/日料/...）
2. 根据选中的菜系，调用地图 API 查询附近该类型餐厅
3. 第二个转盘：选择具体餐厅

### 4.3 电影选择器

**用途**：获取当前上映电影，生成电影选择转盘

**预留接口**：

```javascript
WheelAIGenerator.getMovies()
// 返回：{ success: false, error: '功能即将上线', fallback: {...} }
```

**后续接入方案**：
- 豆瓣电影 API
- 猫眼电影 API
- 淘票票 API

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
    "generate": "转盘生成提示词"
  }
}
```

---

## 7. 调用频率与限制

| 功能 | 调用频率 | 说明 |
|------|---------|------|
| 塔罗占卜 | 每次占卜 1 次 | 含思考模式，耗时较长 |
| 塔罗追问 | 每次追问 1 次 | 按需调用 |
| 转盘 AI 生成 | 每次生成 1 次 | 无思考模式，响应较快 |
| 转盘结果解读 | 可选 | 当前版本不调用 |

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
