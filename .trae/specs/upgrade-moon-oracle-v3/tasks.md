# Tasks

- [x] Task 1: Vite 工程化迁移 — 将零依赖静态站点改造为 Vite 多页应用
  - [x] SubTask 1.1: 初始化 `package.json`（Vite + tesseract.js 依赖，dev/build/preview 脚本）与 `vite.config.js`（多页入口：index/tarot/wheel，静态资源处理）
  - [x] SubTask 1.2: 将 `js/common/*`、`js/tarot/*`、`js/wheel/*` 由全局命名空间（MoonConfig/MoonUtils/MoonEffects 等）改造为 ES Modules（export/import），移除 window 挂载
  - [x] SubTask 1.3: 改造三个 HTML 入口为 `<script type="module">` 引用，Tesseract.js 由 CDN 改为 npm import
  - [x] SubTask 1.4: 验证 `npm run dev` 三页可用、`npm run build` 产物 dist 纯静态可部署，控制台无报错

- [ ] Task 2: 修复全部已识别 BUG — 逐项验证审查清单，真实缺陷修复，误报记录原因
  - [ ] SubTask 2.1: 转盘权重解析校验（js/wheel/ai-generator.js L382-390、app.js L377-399）：非法权重（NaN/负数/数量不匹配）给出明确提示并拒绝启动
  - [ ] SubTask 2.2: OCR 错误处理（js/wheel/ai-generator.js L203-214、L402-409）：区分网络错误/图片加载失败/无文字，给用户具体失败原因；图片大小限制校验
  - [ ] SubTask 2.3: API 层健壮性（js/common/api.js）：超时定时器清理、新请求时 AbortController 重置、HTTP 错误码分类提示、校验默认模型名是否合理
  - [ ] SubTask 2.4: 配置系统（js/common/config.js）：深合并边界、soundEnabled 字段处理（补真实音效实现或移除字段与 UI）
  - [ ] SubTask 2.5: 塔罗流程校验（js/tarot/app.js）：getFullDeck 洗牌确认、空选牌拦截提示、performReading 上下文完整性校验、追问历史长度上限防内存膨胀
  - [ ] SubTask 2.6: XSS 防护完整性（js/common/utils.js formatText 等）：审计全部 innerHTML 使用点，确认先转义再渲染
  - [ ] SubTask 2.7: DOM ID 与事件绑定匹配核查（tarot.html / wheel.html / index.html 与各自 JS）：绑定前判空或确保元素存在
  - [ ] SubTask 2.8: Canvas 渲染边界（js/wheel/wheel-renderer.js）：长选项文本截断/缩放、极端权重下扇区渲染正确
  - [ ] SubTask 2.9: 双转盘与预设数据校验（js/wheel/app.js L107-132、L115-130）：预设数据缺失/weights 长度不一致时拦截
  - [ ] SubTask 2.10: 全部修复完成后回归验证三页无控制台错误

- [ ] Task 3: 每日塔罗功能 — 新页面 daily.html + js/daily/ 模块
  - [ ] SubTask 3.1: 每日抽牌逻辑：当日结果固定（按日期种子），0 点重置；localStorage 存储
  - [ ] SubTask 3.2: streak 连续打卡计数（断签重置为 1）与展示
  - [ ] SubTask 3.3: 每日运势语录（本地语录库按日期轮换 + 可选 AI 解读当日牌）
  - [ ] SubTask 3.4: daily.html 页面与动效，复用塔罗翻牌组件

- [ ] Task 4: Yes/No 快占 + 答案之书 — 新页面 quick.html + js/quick/ 模块
  - [ ] SubTask 4.1: Yes/No 快占：输入问题 → 是/否/待定 + 简评；无 Key 走本地随机（结合牌义），有 Key 可选 AI 增强
  - [ ] SubTask 4.2: 答案之书：输入问题 → 本地语录库随机启示语录
  - [ ] SubTask 4.3: quick.html 页面与交互动效

- [ ] Task 5: 占卜历史 + 分享卡片 — 新页面 history.html + js/history/ 模块
  - [ ] SubTask 5.1: 历史记录存储层：塔罗/快占/每日塔罗结果自动入库（上限 50 条 LRU 淘汰）
  - [ ] SubTask 5.2: history.html：列表展示、详情查看、单条删除、清空
  - [ ] SubTask 5.3: Canvas 分享卡片生成器：牌面/结果/日期/品牌视觉渲染，PNG 下载

- [ ] Task 6: AI 解牌人格切换 — 配置 + 提示词注入
  - [ ] SubTask 6.1: 定义三种人格（严肃智者/温柔疗愈/毒舌好友）的系统提示词模板，默认温柔疗愈
  - [ ] SubTask 6.2: 配置面板新增人格选择（readerPersona 持久化）；塔罗解读与快占 AI 调用注入人格提示词；用户自定义提示词优先

- [ ] Task 7: 首页升级 — 功能矩阵五入口（塔罗/转盘/每日塔罗/快占/历史），保持视觉风格与移动端响应式

- [ ] Task 8: 文档与发布
  - [ ] SubTask 8.1: README.md 更新至 v3.0.0（新功能、Vite Quick Start、项目结构）
  - [ ] SubTask 8.2: CHANGELOG.md 新增 v3.0.0 条目；api-docs 同步
  - [ ] SubTask 8.3: .gitignore 补充 node_modules/dist；git commit 并 push 到 origin

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] [Task 4] [Task 5] [Task 6] depend on [Task 2]，四者之间无依赖、可并行（Task 5 的入库需被 3/4 调用，接口先行约定：history 模块先落地存储层接口）
- [Task 7] depends on [Task 3] [Task 4] [Task 5]
- [Task 8] depends on [Task 7]
