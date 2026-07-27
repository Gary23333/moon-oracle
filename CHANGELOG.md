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

## [Unreleased]

### 🗺 计划中 (Planned)
- 多语言支持（英文界面）
- PWA 离线支持
- 更多牌阵和主题皮肤

[3.0.0]: https://github.com/Gary23333/moon-oracle/compare/v2.1.0...v3.0.0
[2.1.0]: https://github.com/Gary23333/moon-oracle/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/Gary23333/moon-oracle/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/Gary23333/moon-oracle/releases/tag/v1.0.0
