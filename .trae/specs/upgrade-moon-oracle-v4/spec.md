# 月影决策屋 v4.0 全栈升级 Spec

## Why
项目 v3.0 是纯前端静态站点，AI 能力受限于浏览器直连 DeepSeek：API Key 暴露在前端、无法流式输出、默认模型名仍是已弃用旧别名 `deepseek-v4-flash`、所有任务共用同一模型与同一套超长提示词，导致首字延迟高、成本高、模型能力未被针对性利用。本次升级在保持原有六大功能不变的前提下，新增轻量后端代理层、接入多家 OpenAI 兼容厂商与最新模型，并系统性提速（流式、缓存、分级路由、精简提示词），同时把转盘 OCR 升级为多模态视觉识别。

已核实的"最新模型"事实（2026-10，DeepSeek 官方文档）：
- `deepseek-flash` → DeepSeek-V4.1-Flash-1017（原生多模态，更快更省），旧名 `deepseek-v4-flash` / `deepseek-v4-flash-vision-exp` 仍被接受但对应旧模型已下线，请求由 V4.1-Flash 承接。
- `deepseek-v4-pro` → DeepSeek-V4-Pro-0813（深度推理）。
- 两者：1M 上下文、384K 最大输出；默认非思考模式，`thinking:{type:enabled}` + `reasoning_effort`(high/max) 开启思考。
- `deepseek-chat` / `deepseek-reasoner` 已于 2026-07-24 弃用。
- 支持 `stream:true`（SSE）、上下文缓存（缓存命中输入价格约为未命中的 1/50）、Vision（图片 content part）、OpenAI/Anthropic 双格式。

## What Changes
- **BREAKING** 新增轻量后端代理层（Node，零第三方依赖）：对外暴露 `POST /api/chat`，服务端转发上游并 **SSE 流式回传**；API Key 由服务端环境变量注入（不再存在浏览器）；内置多厂商 provider 注册表；生产环境由该 Node 服务同时托管 `dist/` 静态资源。
- **BREAKING** 部署方式变更：由"纯静态托管（GitHub Pages）"改为"Node 服务托管（静态 + 代理）"；README / api-docs 同步说明；开发模式下 Vite dev server 直接挂载 `/api` 中间件，保持 `npm run dev` 单命令可用。
- 多厂商 OpenAI 兼容接入：内置 DeepSeek 预设（`deepseek-flash`、`deepseek-v4-pro`）+ 自定义 OpenAI 兼容端点（baseUrl + model 手填）；配置面板提供「厂商 + 模型」选择。
- 模型名迁移：默认模型由旧别名 `deepseek-v4-flash` → `deepseek-flash`；旧名与新名双向兼容；已弃用名做映射兼容。
- 提速（四项并存，见 Why 的依据）：
  1. **SSE 流式输出** — 全部 AI 场景 `stream:true`，逐字增量渲染（含思考链）。
  2. **提示词缓存优化** — 把固定不变内容（人格设定、牌义、格式模板）作为系统提示词**前缀前置且跨请求完全一致**，命中上下文缓存。
  3. **模型分级路由** — 简单任务（转盘生成/OCR-Vision/快占/结果解读/细节追问/每日语录增强）用 `deepseek-flash` 且免思考；深度塔罗解读/追问用可配置的思考模型（默认 `deepseek-v4-pro` + `reasoning_effort`）。
  4. **精简提示词** — 塔罗解读不再全量注入 78 张牌义表，仅注入本次抽到的牌；缩短问候/追问模板。
- OCR 升级：**移除 Tesseract.js 依赖**，改用 DeepSeek Vision 多模态识别转盘截图（`image_url` content part + base64 data URL），中文准确率更高、无需下载 ~2MB 语言包。
- 配置面板统一：抽取为共享组件，注入全部 6 个页面（此前仅 index.html 有）；新增字段持久化并做旧配置迁移。
- 文档与版本：README / CHANGELOG / api-docs / package.json 升至 v4.0.0。

## Impact
- Affected specs: LLM/API 接入层、配置系统、提示词体系、塔罗占卜、命运转盘（OCR）、每日塔罗、快占、分享/历史、构建与部署
- Affected code:
  - 新增 `server/`（`index.js` 生产静态+API、`app.js` 核心请求处理器、`providers.js` 厂商注册表）
  - 重写 `js/common/api.js`（流式解析、多厂商、Vision、错误分类）
  - `js/common/config.js`（新增 provider/model/streaming/路由字段 + 旧配置迁移）
  - 新增 `js/common/config-panel.js`（共享配置面板）+ `css/base.css` 样式补充
  - `js/common/prompts.js`、`js/tarot/prompts.js`（静态前缀/动态部分拆分、按牌精简）
  - `js/tarot/app.js`、`js/wheel/app.js`、`js/wheel/ai-generator.js`、`js/daily/app.js`、`js/quick/app.js`、`js/index.js`（流式渲染 + 分级路由 + Vision）
  - 全部 `*.html`（挂载共享配置面板）、`vite.config.js`、`package.json`、新增 `.env.example`
  - `README.md`、`CHANGELOG.md`、`api-docs/README.md`

## ADDED Requirements

### Requirement: 轻量后端代理层
The system SHALL 提供一个 Node 运行时、零第三方依赖的后端代理服务，暴露 `POST /api/chat`，接收前端请求体（消息、provider、model、thinking 等），在服务端注入对应厂商的 API Key 后转发至上游 OpenAI 兼容 `/chat/completions`，并以 SSE 逐块回传上游响应；服务 SHALL 在生产模式下同时托管 `dist/` 静态资源。

#### Scenario: 流式转发
- **WHEN** 前端携带 `stream:true` 调用 `POST /api/chat`
- **THEN** 服务端以 `Content-Type: text/event-stream` 逐块回传上游分片，前端可增量渲染

#### Scenario: 服务端注入密钥
- **WHEN** 客户端未携带 API Key，但服务端环境变量已配置该厂商密钥
- **THEN** 请求成功，密钥不出现在浏览器侧

#### Scenario: 密钥缺失
- **WHEN** 目标厂商在服务端未配置密钥且客户端也未提供
- **THEN** 服务端返回结构化错误（如 401 + 明确 message），不泄露内部细节

### Requirement: 多厂商 OpenAI 兼容接入
The system SHALL 支持多家 OpenAI 兼容厂商：内置 DeepSeek 预设（baseUrl `https://api.deepseek.com`，模型 `deepseek-flash`、`deepseek-v4-pro`），并支持用户自定义任意 OpenAI 兼容端点（baseUrl + model 名称手填）；配置面板 SHALL 提供「厂商 + 模型」选择控件，选择结果持久化到配置。

#### Scenario: 选择 DeepSeek 最新模型
- **WHEN** 用户在配置面板选择厂商 DeepSeek、模型 `deepseek-flash`
- **THEN** 后续请求使用 `deepseek-flash` 调用，且界面对思考模式、视觉能力做对应处理

#### Scenario: 自定义厂商
- **WHEN** 用户填写自定义 baseUrl 与 model 并保存
- **THEN** 请求按该端点与模型发起，无需改动代码

### Requirement: 流式增量渲染
The system SHALL 在所有 AI 场景（塔罗解读、塔罗追问、每日塔罗 AI 解读、快占 AI 增强、转盘结果解读）采用流式渲染：收到首个分片即开始显示，正文与思考链（若开启显示）分别增量更新，直至流结束；用户可中途取消。

#### Scenario: 首字即显
- **WHEN** 用户发起塔罗解读
- **THEN** 首个 token 到达后立即开始渲染，不再等待全文返回

#### Scenario: 中途取消
- **WHEN** 流式进行中用户点击取消或离开页面
- **THEN** 请求被 AbortController 中止，不再追加内容

### Requirement: 提示词缓存优化
The system SHALL 将跨请求固定不变的系统提示词内容（人格设定、格式模板、牌义等）置于消息最前部作为稳定前缀，使同一前缀在多次请求间保持一致以命中服务商上下文缓存；可变内容（用户问题、本次抽牌、细节）置于其后。

#### Scenario: 前缀稳定
- **WHEN** 用户连续进行多次塔罗解读（抽牌不同、问题不同）
- **THEN** 系统提示词的固定前缀部分逐字节一致，仅动态部分变化

### Requirement: 模型分级路由
The system SHALL 按任务复杂度选择模型与思考档位：简单/结构化输出任务（转盘生成、Vision OCR、快占增强、转盘结果解读、细节追问）使用快模型并默认关闭思考；深度解读任务（塔罗完整解读、追问）使用可配置的思考模型（默认 `deepseek-v4-pro`）与思考强度；路由策略可被配置覆盖。

#### Scenario: 简单任务走快模型
- **WHEN** 用户使用「AI 生成转盘」
- **THEN** 请求使用快模型且无思考链，响应明显快于深度模型

#### Scenario: 深度任务走强模型
- **WHEN** 用户提交塔罗完整解读
- **THEN** 按配置使用 `deepseek-v4-pro` 与 `reasoning_effort`（默认 high）

### Requirement: 精简提示词
The system SHALL 在塔罗解读提示词中仅注入本次实际抽到的牌的名称/正逆位/对应牌义，不再全量注入 78 张牌义总表；问候与追问模板 SHALL 精简至必要信息。

#### Scenario: 按牌注入
- **WHEN** 用户使用 3 张牌阵
- **THEN** 提示词只包含这 3 张牌的相关牌义，token 量显著小于原实现且不影响解读质量

### Requirement: DeepSeek Vision 转盘识别
The system SHALL 以 DeepSeek 多模态视觉能力识别转盘截图：将图片编码为 base64 data URL 作为 `image_url` content part 发送给支持视觉的模型（如 `deepseek-flash`），由模型直接输出转盘选项 JSON；原有图片类型/大小校验与错误分类提示保留。

#### Scenario: 截图转盘
- **WHEN** 用户上传一张含选项列表的截图
- **THEN** 系统返回可用的转盘选项集合，中文识别准确率优于原 Tesseract 方案

#### Scenario: 无视觉能力模型
- **WHEN** 当前所选模型不支持视觉
- **THEN** 给出明确提示，引导切换到支持视觉的模型

### Requirement: 统一配置面板
The system SHALL 将配置面板抽取为可复用组件并注入全部 6 个页面（index / tarot / wheel / daily / quick / history），任一页面右上角齿轮均可打开并保存配置。

#### Scenario: 任意页面配置
- **WHEN** 用户在 history 页面打开配置面板并保存
- **THEN** 配置即刻在其余页面生效

## MODIFIED Requirements

### Requirement: API 客户端
原 `MoonAPI.chat`（单一 baseUrl、非流式、仅 DeepSeek）SHALL 改造为：支持 provider 解析与 baseUrl 选择、支持 SSE 流式解析（正文与 reasoning 分片）、支持 Vision 图片消息、保留/增强超时与 AbortController、HTTP 错误分类、可选的轻量重试；请求默认经由后端代理 `/api/chat` 发起。

### Requirement: 配置系统
原 localStorage 配置 SHALL 新增 `provider`（厂商 id）、`models`（各场景模型映射，如 reading/generate/vision）、`streaming`（默认 true）、`thinkingByTask`（按任务思考档位）；`model` 字段升级为「当前厂商下的当前模型」；`load()` SHALL 对 v3 旧配置执行迁移（旧 `model: 'deepseek-v4-flash'` 映射为 `deepseek-flash`，补齐新字段默认值，保留用户自定义提示词）。

### Requirement: 提示词模板
原 `tarotPrompts` / `wheelPrompts` SHALL 重构为「稳定前缀 + 动态片段」两段式装配；保持用户自定义提示词能力（自定义优先于默认模板，且自定义部分也参与前缀以命中缓存）。

### Requirement: 命运转盘 OCR 流程
原基于 Tesseract.js 的 `WheelAIGenerator.fromOCR` SHALL 改为基于 DeepSeek Vision 的实现；保留入参（File）、返回值结构与多策略选项提取/去噪逻辑。

## REMOVED Requirements

### Requirement: Tesseract.js 浏览器端 OCR
**Reason**: 中文识别准确率一般且需下载 ~2MB 语言包；DeepSeek V4.1-Flash 原生多模态可更准更快地识别截图。
**Migration**: 移除 `tesseract.js` 依赖与动态加载逻辑；转盘 OCR 入口改调 Vision 接口；README/api-docs 更新说明。

### Requirement: 浏览器端直连 DeepSeek
**Reason**: API Key 暴露在前端存在窃取风险，且无法服务端流式转发与缓存。
**Migration**: 前端统一改走 `POST /api/chat` 后端代理；保留本地开发时的 BYOK 兜底路径（可选）。
