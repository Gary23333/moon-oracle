# Checklist

## 后端代理层
- [x] `server/providers.js` 提供 DeepSeek 预设（`deepseek-flash`、`deepseek-v4-pro`）与自定义 OpenAI 兼容端点解析
- [x] `POST /api/chat` 支持 `stream:true` 的 SSE 逐块回传，且正确分流 `reasoning_content`
- [x] 服务端可从环境变量注入 API Key；未配置且客户端未提供时返回结构化错误，不泄露密钥
- [x] `node server/index.js` 可托管 `dist/` 静态资源，`GET /` 返回页面无 404
- [x] `npm run dev` 单命令下 Vite 开发服务器 `/api` 中间件可正常流式响应
- [x] 存在 `.env.example`，`.gitignore` 已忽略 `.env`

## 多厂商与模型
- [x] 配置面板提供「厂商 + 模型」选择（DeepSeek 预设 + 自定义 baseUrl/model）
- [x] 默认模型已由 `deepseek-v4-flash` 迁移为 `deepseek-flash`；旧别名仍可用
- [x] 自定义 OpenAI 兼容端点保存后请求按其 baseUrl/model 发起

## 流式输出
- [x] 塔罗完整解读首 token 到达即开始渲染，不再等待全文
- [x] 塔罗追问、每日 AI 解读、快占 AI 增强、转盘结果解读均为流式增量渲染
- [x] 显示思考过程开启时，思考链同样流式呈现
- [x] 流式中途取消（AbortController）可中止请求且不再追加内容

## 缓存与精简
- [x] 系统提示词固定前缀在多次不同占卜间逐字节一致（缓存友好）
- [x] 塔罗解读提示词仅注入本次抽到的牌的牌义，不再包含全量 78 张牌义表
- [x] 用户自定义提示词仍生效，且其稳定部分参与前缀

## 模型分级路由
- [x] 转盘生成 / OCR / 快占增强 / 结果解读 / 细节追问走快模型且默认无思考
- [x] 塔罗完整解读与追问按配置走 `deepseek-v4-pro` 与 `reasoning_effort`
- [x] 路由策略可被配置覆盖且生效

## Vision OCR
- [x] 上传含选项的截图可返回可用转盘选项，中文识别可用
- [x] `tesseract.js` 依赖与动态加载代码已彻底移除，构建产物不含其语言包
- [x] 无视觉能力模型时给出明确提示

## 配置系统
- [x] 新增 `provider`/`models`/`streaming`/`thinkingByTask` 字段并持久化
- [x] v3 旧配置可迁移（旧模型名映射、补齐新字段、保留自定义提示词）
- [x] 6 个页面均可打开并保存统一配置面板

## 工程与文档
- [x] `npm run build` 成功，产物可被 Node 服务托管
- [x] `package.json` 版本为 `4.0.0`，不再包含 `tesseract.js`
- [x] README 说明新增后端代理与 Node 部署方式、多厂商/模型、提速特性、Vision OCR
- [x] CHANGELOG 新增 v4.0.0 条目；api-docs 更新为「前端 → `/api/chat` → 上游」契约

## 回归
- [x] 6 个页面功能均正常，控制台无运行时错误
- [x] 多厂商切换 / 模型切换 / Vision / 流式 / 缓存前缀 / 分级路由逐项验证通过
