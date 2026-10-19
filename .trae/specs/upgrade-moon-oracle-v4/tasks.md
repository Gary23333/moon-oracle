# Tasks

- [x] Task 1: 后端代理层 — Node 零依赖服务（`POST /api/chat` 流式转发 + 多厂商 provider + 服务端密钥注入 + 生产托管 dist）
  - [x] SubTask 1.1: 新增 `server/providers.js`：厂商注册表（`deepseek` 预设：baseUrl `https://api.deepseek.com`、模型 `deepseek-flash`/`deepseek-v4-pro`、各厂商对应环境变量密钥名；`custom` OpenAI 兼容端点）；导出 `resolveProvider(providerId, override)` 返回 `{baseUrl, apiKey, models, supportsVision}`，缺失密钥时返回结构化错误
  - [x] SubTask 1.2: 新增 `server/app.js`：框架无关请求处理器 `handleChat(req, res)` —— 解析请求体（messages/provider/model/thinking/reasoning_effort/stream）、服务端注入密钥、用全局 `fetch` 转发上游 `/chat/completions`、上游 stream 时逐块以 `text/event-stream` 回传（含 `reasoning_content` 分片），非 stream 时透传 JSON；统一错误包装（401/403/404/429/5xx 分类，不泄露密钥）
  - [x] SubTask 1.3: 新增 `server/index.js`：Node 原生 http 服务器，挂载 `/api/chat` → `handleChat`，其余请求以 `dist/` 静态资源响应（含 SPA/多页 fallback 与正确 MIME）；支持 `PORT` 环境变量
  - [x] SubTask 1.4: `vite.config.js` 增加开发中间件：dev 模式下把 `/api` 请求交给 `server/app.js` 的 `handleChat`（确保 `npm run dev` 单命令即可跑通流式），并移除对 tesseract 的特殊处理
  - [x] SubTask 1.5: 新增 `.env.example`（`DEEPSEEK_API_KEY` 等）与 `.gitignore` 补充 `.env`；`package.json` scripts 增加 `start`（生产：`node server/index.js`）与 `build`（vite build，产物供 server 托管）
  - [x] SubTask 1.6: 手动验证：`node server/index.js` 后 curl `POST /api/chat`（stream:true）可见分片；`GET /` 返回静态页

- [x] Task 2: 前端 API 客户端重构 — `js/common/api.js` 支持流式 / 多厂商 / Vision / 错误分类
  - [x] SubTask 2.1: 新增统一入口 `MoonAPI.streamChat(messages, options, {onDelta, onReasoning, onDone})`：默认经 `POST /api/chat` 发起（同源），解析 SSE 分片（`data:` 行、`[DONE]` 结束、`reasoning_content` 分流）；保留 AbortController + 超时清理
  - [x] SubTask 2.2: 保留并升级非流式 `MoonAPI.chat(messages, options)`（走同一代理，默认 `stream:false`），供结构化 JSON 任务使用；两者共享 provider/model/thinking 组装逻辑
  - [x] SubTask 2.3: 支持 Vision 消息：新增工具 `buildVisionMessage(text, imageDataUrl, detail)` 产出 `content` 数组（`text` + `image_url` content part）
  - [x] SubTask 2.4: 错误分类与可选中继重试（网络类错误有限次退避重试，4xx 不重试）；`_getHttpErrorMessage` 扩展覆盖代理层错误码
  - [x] SubTask 2.5: 读取 provider/model 由配置驱动；`abort()` 统一清理；保持 `chatSingle`/`chatWithHistory` 兼容签名

- [x] Task 3: 配置系统与统一配置面板 — 多厂商/模型选择 + 旧配置迁移 + 6 页共享面板
  - [x] SubTask 3.1: `js/common/config.js` 新增字段：`provider`（默认 `deepseek`）、`models`（`{reading:'deepseek-v4-pro', generate:'deepseek-flash', vision:'deepseek-flash', quick:'deepseek-flash', followup:'deepseek-v4-pro', daily:'deepseek-flash'}`）、`streaming`（默认 true）、`thinkingByTask`（按任务档位）、`providers` 自定义端点（baseUrl/model/apiKey 兜底）；`load()` 实现 v3→v4 迁移（`deepseek-v4-flash`→`deepseek-flash`、补默认、保留自定义提示词）
  - [x] SubTask 3.2: 新增 `js/common/config-panel.js`：把原 `js/index.js` 内联配置面板逻辑抽取为可复用组件 `MountConfigPanel()`，字段含厂商下拉、模型下拉（可切自定义）、API 地址/Key（BYOK 兜底）、思考开关与强度、流式开关、人格、提示词模板；保存/重置；`css/base.css` 补样式
  - [x] SubTask 3.3: 6 个 HTML 页面统一挂载配置面板（`index/tarot/wheel/daily/quick/history`），`js/index.js` 改为调用共享组件

- [x] Task 4: 提示词体系重构 — 稳定前缀（缓存友好）+ 按牌精简
  - [x] SubTask 4.1: `js/common/prompts.js`：把人格设定 + 通用格式/角色约束抽为「稳定前缀」`getStablePrefix(persona)`，跨请求逐字节一致
  - [x] SubTask 4.2: `js/tarot/prompts.js`：重构 `getReading/getFollowup/getDetailQuestion` 为「稳定前缀 + 动态片段」装配；移除全量 78 张牌义表，改为仅注入本次 `context.cards` 对应的牌义（从 `cards-data.js` 取）；问候/追问模板精简
  - [x] SubTask 4.3: `js/tarot/app.js` / `js/daily/app.js` / `js/quick/app.js` 改为调用两段式装配（前缀固定、动态在后），保证缓存命中且不破坏个性化提示词

- [x] Task 5: 模型分级路由 — 各功能按任务选 provider/model/thinking
  - [x] SubTask 5.1: 新增路由解析工具（如 `js/common/routing.js` 或并入 config）：`resolveTaskRoute(taskKey)` 依据 `provider/models/thinkingByTask` 返回 `{provider, model, thinking, reasoningEffort}`，支持配置覆盖
  - [x] SubTask 5.2: 接入各调用点：塔罗完整解读/追问（强模型 + 思考）、转盘生成/结果解读/细节追问/每日增强/快占增强（快模型 + 免思考）、OCR（Vision 模型）
  - [x] SubTask 5.3: 验证：简单任务确实不带 `thinking` 且走快模型；深度任务按配置走 `deepseek-v4-pro`

- [x] Task 6: 流式 UI 渲染接入 — 全部 AI 场景改为增量渲染
  - [x] SubTask 6.1: `js/common/utils.js` 新增流式渲染助手（如 `createStreamRenderer(element)` 支持追加正文与思考块，替代"全文到达后打字机"路径）；保留 `formatText` 转义
  - [x] SubTask 6.2: `js/tarot/app.js`：完整解读与追问改为 `streamChat` 增量渲染（思考链开启时同步流式）；取消/错误处理
  - [x] SubTask 6.3: `js/daily/app.js`、`js/quick/app.js`、`js/wheel/app.js`（结果解读）：改为流式增量渲染
  - [x] SubTask 6.4: 回归：任一场景首 token 即显、可取消、无重复渲染残留

- [x] Task 7: 转盘识别升级为 DeepSeek Vision — 移除 Tesseract
  - [x] SubTask 7.1: `js/wheel/ai-generator.js`：`fromOCR(imageFile)` 改为读图 → base64 data URL → `buildVisionMessage` + 结构化提示词（要求输出转盘 JSON），复用 `_parseWheelFromAI` 解析；保留类型/大小校验与错误分类
  - [x] SubTask 7.2: 移除 `_loadTesseract` 与 `tesseract.js` 依赖引用；无视觉能力模型时给出明确提示
  - [x] SubTask 7.3: `js/wheel/app.js` 的 `_handleOCRFile` 提示文案与 loading 状态更新；`package.json` 移除 `tesseract.js`

- [x] Task 8: 工程清理与文档版本 — v4.0.0
  - [x] SubTask 8.1: `package.json` 版本 → `4.0.0`，依赖仅保留开发期（vite/puppeteer），清理不再使用的依赖
  - [x] SubTask 8.2: `README.md` 更新：新增后端代理与部署方式（Node 托管）说明、多厂商/模型、提速特性、Vision OCR；Quick Start 增补 `.env` 与 `npm run dev`/`npm start`
  - [x] SubTask 8.3: `CHANGELOG.md` 新增 v4.0.0 条目；`api-docs/README.md` 更新为「前端 → `/api/chat` 代理 → 上游」的接口与参数（provider/model/thinking/stream/vision）说明

- [x] Task 9: 端到端验证
  - [x] SubTask 9.1: `npm run build` 成功；`npm start` 后 6 页可访问、`/api/chat` 流式正常
  - [x] SubTask 9.2: 多厂商切换、模型切换、Vision OCR、流式渲染、缓存前缀一致性、分级路由逐项回归
  - [x] SubTask 9.3: 无服务端密钥时错误提示正确；旧 v3 配置迁移后功能正常

- [x] Task 10: 修复路由默认思考档位（验证 #17 发现）— vision/detail 默认应为免思考
  - [x] SubTask 10.1: `js/common/config.js` 的 `thinkingByTask` 默认对象补充 `vision:false`、`detail:false`；`load()` 迁移逻辑补齐缺失键
  - [x] SubTask 10.2: 验证 `resolveTaskRoute('vision')` 与 `resolveTaskRoute('detail')` 在无 override 时返回 `thinking:false`，其余任务键不回归

# Task Dependencies
- [Task 2] depends on [Task 1]（先定 `/api/chat` 请求/响应契约）
- [Task 3] [Task 4] [Task 6] [Task 7] depend on [Task 2]，四者之间无依赖、可并行
- [Task 5] depends on [Task 3] [Task 4]（路由需 provider/model 字段与提示词装配就绪）
- [Task 8] depends on [Task 7]（确认 tesseract 已彻底移除后再更新依赖/文档）
- [Task 9] depends on 全部任务
