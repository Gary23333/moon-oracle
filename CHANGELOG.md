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

## [Unreleased]

### 🗺 计划中 (Planned)
- OCR 截图识别转盘生成
- 基于地理位置的双转盘餐厅推荐
- 电影选择器（接入实时上映数据）
- 转盘结果 AI 解读
- 多语言支持（英文界面）
- PWA 离线支持
- 更多牌阵和主题皮肤

[2.0.0]: https://github.com/Gary23333/moon-oracle/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/Gary23333/moon-oracle/releases/tag/v1.0.0
