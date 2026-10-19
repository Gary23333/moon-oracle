# 📝 Changelog

所有显著变更都会记录在此文件中。

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 格式和 [语义化版本](https://semver.org/lang/zh-CN/) 规范。

---

## [1.0.0] - 2026-05-27

### ✨ 新增 (Added)

#### 塔罗占卜模块
- 78 张完整 Rider-Waite-Smith 塔罗牌数据（22 大阿卡纳 + 56 小阿卡纳）
- 每张牌包含：中英文名、正逆位关键词、详细牌义、图像描述、原型、建议
- 8 种牌阵：单牌、三牌、爱情十字、事业金字塔、二选一、凯尔特十字、四季、生命之树
- 8 大问题分类：情感、事业、财运、学业、健康、抉择、日常、自定义
- 智能牌阵推荐系统
- 解读前细节追问功能
- DeepSeek 思考模式深度解读
- 多轮追问对话功能
- 翻牌 3D 动画（Y 轴旋转 180°）
- 自定义系统提示词

#### 命运转盘模块
- 10 个预设转盘（涵盖美食、感情、决策、娱乐、生活、健康、学习）
- Canvas 2D 加权转盘渲染引擎
- 物理旋转动画（cubic easing 缓动）
- 转盘分类筛选
- 自定义转盘（2-12 个选项）
- AI 一句话生成转盘
- 占位功能入口：OCR 截图识别、地理位置美食推荐、电影选择器

#### 共享功能
- DeepSeek API 封装（超时 120 秒、AbortController 取消、思考模式支持）
- localStorage 配置管理系统
- 星空背景动画（150 颗闪烁星星 + 月亮光晕）
- 粒子爆发和屏幕闪光特效
- Toast 通知系统
- 加载动画
- Markdown 转 HTML（含 XSS 防护）
- 打字机效果文本动画
- 响应式设计（移动端适配）
- `prefers-reduced-motion` 无障碍支持
- Google Fonts 集成（Cinzel Decorative、Noto Serif SC、Ma Shan Zheng）

#### 文档
- 项目说明页面（readme.html）
- API 接口文档（api-docs/README.md）

---

## [2.0.0] - 2026-06-01

### 🐛 修复 (Fixed)
- **配置深合并** — `config.js` 浅展开导致嵌套提示词模板（tarotPrompts/wheelPrompts）部分字段丢失，改用递归 deepMerge
- **追问上下文丢失** — 追问时 AI 丢失具体抽到的牌和正逆位信息，现在保存完整系统提示词并在追问中传入
- **typeText 内存泄漏** — 打字动画 setInterval 不可取消导致内存泄漏，改为返回可取消控制器
- **stripThinking 重复正则** — 同一正则执行两次，删除冗余调用
- **getSpreadInfo 循环内调用** — 移到 forEach 外部，避免重复计算
- **内联 onerror XSS 向量** — 移除 `onerror="this.style.display='none'"`，改用 addEventListener
- **DOM null 检查** — 全站 getElementById 添加 null 安全保护
- **死代码清理** — 移除 typeText 中未使用的 `allText` 变量和 TreeWalker

### ✨ 新增 (Added)
- **ARIA 无障碍属性** — 分类按钮 aria-pressed、牌阵/塔罗牌 role+tabindex+aria-label、Canvas aria-label
- **键盘导航** — 牌阵卡片和塔罗牌支持 Enter/Space 操作
- **焦点管理** — 视图切换自动 focus 到标题，Toast 添加 role="alert" aria-live
- **细节页返回按钮** — 追问详情页可返回选牌页，无需重新开始
- **重启二次确认** — confirm 对话框防止误操作丢失占卜结果
- **追问显示思考过程** — showThinking 开启时追问也显示 AI 推理链
- **图片加载兜底** — 卡牌图片加载失败后显示卡名文字
- **占位按钮 disabled** — OCR/附近美食按钮添加禁用状态和视觉区分

### ⚡ 性能优化 (Performance)
- **粒子并发限制** — 最大 60 个活跃粒子，防止快速点击创建数百个临时 DOM
- **Canvas 指针缓存** — 指针绘制到离屏 canvas，旋转动画每帧直接 drawImage

### 🔍 SEO
- 全站添加 `<meta name="description">` 和 Open Graph 标签（og:title, og:description, og:type）

---

## [2.1.0] - 2026-06-01

### ✨ 新增 (Added)
- **OCR 截图识别** — Tesseract.js 按需加载，浏览器端 OCR 识别图片文字，自动提取选项生成转盘
- **附近美食双转盘** — Geolocation API 获取坐标，AI 推荐本地菜系（转盘1）→ 具体餐厅（转盘2）
- **电影推荐转盘** — AI 生成热门/经典电影推荐，新增快捷按钮
- **转盘结果 AI 解读** — `wheelResultAI` 配置开启后，转盘结果自动调用 DeepSeek 做趣味解读
- **自定义权重** — 支持 `选项:权重` 格式（如 `火锅:3`），混合格式兼容

---

## [3.0.0] - 2026-07-27

### 🔧 重构 (Refactored)
- **Vite 多页应用迁移** — 从纯静态 HTML 迁移到 Vite 构建，支持 ES Module 和 npm 依赖
- **ES Module 化** — 所有 JS 文件改用 `import/export`，移除全局变量污染
- **Tesseract.js npm 依赖** — 从 CDN 动态加载改为 npm 安装，构建时打包

### 🐛 修复 (Fixed)
- **转盘权重校验** — 修复负权重和零权重导致的渲染异常
- **OCR 错误处理** — 添加 Tesseract.js 初始化失败和识别超时处理
- **API 健壮性** — 统一错误处理，添加网络断开、DNS 解析失败等场景处理
- **soundEnabled 移除** — 移除未实现的声音开关配置项
- **塔罗流程校验** — 添加选牌数量校验、牌阵选择校验、问题输入校验
- **XSS 防护增强** — 所有用户输入增加 HTML 转义和长度限制
- **Canvas 边界处理** — 修复转盘边缘绘制超出画布的问题
- **预设数据校验** — 添加预设转盘数据完整性校验

### ✨ 新增 (Added)
- **每日塔罗** — 日期种子算法生成固定牌面，Streak 连续天数统计，40 条每日语录
- **Yes/No 快占** — 牌义加权算法，193 条答案之书回复，快速二元决策
- **占卜历史** — 50 条上限存储，类型筛选，详情查看，记录删除
- **分享卡片** — Canvas 生成 PNG 图片，神秘主题设计，一键分享
- **AI 解牌人格** — 严肃智者、温柔疗愈、毒舌好友三种解读风格
- **首页五入口矩阵** — 塔罗占卜、命运转盘、每日塔罗、快占·答案之书、占卜历史

## [4.0.0] - 2026-10-20

### 🔧 重构 (Refactored)
- **新增轻量后端代理（BREAKING）** — 引入 `server/`（Node 原生 http，**零第三方依赖**），托管构建后的 `dist/` 静态资源并暴露 `POST /api/chat` 代理
  - `server/index.js` — 生产服务器：加载 `.env`（尽力而为，缺失不报错），支持 `PORT` 环境变量（默认 3000）
  - `server/app.js` — 框架无关的 `handleChat(req, res)`：转发至上游 OpenAI 兼容 `/chat/completions`，以 SSE（`text/event-stream`，含 `reasoning_content` 分片）流式回传，服务端注入 API Key，将上游错误码（401/403/404/429/5xx）映射为友好中文提示，且绝不泄露密钥
  - `server/providers.js` — 厂商注册表：内置 `deepseek`（`https://api.deepseek.com`，模型 `deepseek-flash` / `deepseek-v4-pro`）+ `custom`（客户端提供的 OpenAI 兼容 baseUrl）；密钥解析顺序为「客户端 BYOK 兜底 → 厂商环境变量」，均缺失时返回结构化 `{error:{code:'missing_api_key',...}}` 401
  - 开发环境由 `vite.config.js` 挂载同一 `handleChat` 于 `/api`，`npm run dev` 一条命令即可前后端联调
- **部署方式变更（BREAKING）** — 应用不再是可以直接托管到 GitHub Pages 的纯静态站点，运行时需要一个 Node 环境（如 Render / Railway / Fly.io / VPS）来运行代理并托管 `dist`；启动流程为 `npm run build && npm start`
- **OCR 迁移至 DeepSeek Vision 多模态** — 移除 `tesseract.js` 依赖，截图识别改为向视觉模型发送 base64 图像的 content part，保留类型/尺寸校验与友好错误提示，并保留文本提取兜底
- **统一配置面板** — 抽离为 `js/common/config-panel.js`，在全部 6 个页面（index / tarot / wheel / daily / quick / history）自动挂载（此前仅 index.html 有）
- **配置迁移 v3 → v4** — 自动将废弃别名 `deepseek-v4-flash` 迁移为 `deepseek-flash`

### ✨ 新增 (Added)
- **多厂商 OpenAI 兼容支持** — DeepSeek 预设 + 自定义端点，配置面板提供厂商与模型选择器
- **新模型** — `deepseek-flash`（= DeepSeek-V4.1-Flash-1017，原生多模态，更快更省）与 `deepseek-v4-pro`（= V4-Pro-0813，深度推理）；默认模型由废弃别名 `deepseek-v4-flash` 迁移至 `deepseek-flash`（旧别名仍被接受但路由至 V4.1-Flash）；`deepseek-chat` / `deepseek-reasoner` 已废弃（2026-07-24）
- **新配置字段** — `provider`、`customBaseUrl`、`streaming`、`models`（按任务模型映射）、`thinkingByTask`（按任务思考开关），与既有 `apiKey` / `thinkingEnabled` / `thinkingEffort` / `showThinking` / `wheelResultAI` / `readerPersona` / 提示词模板并存
- **新增脚本** — `start`（`node server/index.js`），与既有 `dev` / `build` / `preview` 并存
- **环境变量** — 新增 `.env.example`（`DEEPSEEK_API_KEY=sk-...`，并说明自定义厂商密钥），`.env` 已加入 `.gitignore`

### ⚡ 性能 / 提速 (Performance)
- **SSE 流式增量渲染** — 面向用户的所有 AI 文本（塔罗解读/追问、每日 AI 解读、快占 AI 增强、转盘结果解读）改为流式渲染，首字即时呈现，并可通过 `AbortController` 取消
- **提示词缓存优化** — 将稳定且逐字节一致的 system-prompt 前缀（人格 + 格式模板）置于最前，命中厂商上下文缓存
- **模型分级路由** — 简单/结构化任务（转盘生成/位置/电影、Vision OCR、快占增强、结果解读、每日）使用快速模型并关闭思考；深度任务（塔罗完整解读 + 追问）使用 `deepseek-v4-pro` 并携带 `reasoning_effort`（默认 `high`）；路由可配置
- **提示词瘦身** — 塔罗提示词不再注入完整 78 张牌义表，仅注入所抽牌面的牌义

### 🗑 移除 (Removed)
- 移除 `tesseract.js` 依赖（OCR 改由 DeepSeek Vision 多模态承担）

### 📝 文档 (Docs)
- README 更新架构说明、快速开始、配置项、LLM 调用策略与部署方式
- API 文档改为以 `POST /api/chat` 代理为主接口

## [Unreleased]

### 🗺 计划中 (Planned)
- 多语言支持（英文界面）
- PWA 离线支持
- 更多牌阵和主题皮肤

[4.0.0]: https://github.com/Gary23333/moon-oracle/compare/v3.0.0...v4.0.0
[3.0.0]: https://github.com/Gary23333/moon-oracle/compare/v2.1.0...v3.0.0
[2.1.0]: https://github.com/Gary23333/moon-oracle/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/Gary23333/moon-oracle/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/Gary23333/moon-oracle/releases/tag/v1.0.0
