<div align="center">

<img src="https://img.shields.io/badge/🔮_Moon_Oracle-v2.1.0-8b5cf6?style=for-the-badge&labelColor=0a0612&color=d4a843" alt="Moon Oracle v2.1.0">

# 🔮 Moon Oracle · 月影决策屋

**AI-Powered Tarot & Decision Wheel**

<em>在星辰与烛火之间，让命运为你指引方向</em>

[English](#-features) · [中文](#-功能特性) · [Quick Start](#-quick-start) · [Demo](https://gary23333.github.io/moon-oracle/)

<br>

<img src="https://img.shields.io/badge/license-MIT-d4a843?style=flat-square" alt="MIT License">
<img src="https://img.shields.io/badge/version-v2.1.0-8b5cf6?style=flat-square" alt="Version">
<img src="https://img.shields.io/badge/PRs-Welcome-2dd4bf?style=flat-square" alt="PRs Welcome">
<img src="https://img.shields.io/badge/zero--dependencies-✓-4ade80?style=flat-square" alt="Zero Dependencies">
<br>
<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5">
<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript">
<img src="https://img.shields.io/badge/Canvas_2D-4ade80?style=flat-square" alt="Canvas 2D">
<img src="https://img.shields.io/badge/AI-DeepSeek-8b5cf6?style=flat-square" alt="DeepSeek AI">

</div>

---

## 📖 项目简介

**Moon Oracle** 是一款纯前端 AI 神秘主题 Web 应用，包含 **🔮 塔罗占卜** 和 **🎡 命运转盘** 两大核心模块。

**零依赖 · 零构建 · 零服务器** — 打开 `index.html` 即可运行。通过 DeepSeek API 实现 AI 智能解读，支持思考模式深度推理。内置 Tesseract.js 浏览器端 OCR、Geolocation 定位美食推荐、AI 电影选择器等高级功能。

---

## ✨ 功能特性

<table>
<tr>
<td width="50%" valign="top">

### 🔮 塔罗占卜

- **78 张完整塔罗牌** — 22 大阿卡纳 + 56 小阿卡纳，含完整正逆位牌义
- **8 种牌阵** — 单牌 → 凯尔特十字，1~10 张牌全覆盖
- **8 大问题分类** — 情感 · 事业 · 财运 · 学业 · 健康 · 抉择 · 日常 · 自由
- **智能牌阵推荐** — 根据问题类型自动推荐最佳牌阵
- **DeepSeek 思考模式** — 深度推理驱动的结构化解读
- **翻牌 3D 动画** — Y 轴 180° 旋转 + 金色光效
- **细节追问** — 解读前收集补充信息，解读后多轮追问
- **自定义提示词** — 完全可调的系统提示词模板

</td>
<td width="50%" valign="top">

### 🎡 命运转盘

- **10 个预设转盘** — 涵盖美食 · 感情 · 决策 · 娱乐 · 生活 · 健康 · 学习
- **📷 OCR 截图识别** — Tesseract.js 浏览器端 OCR，图片文字自动提取为转盘选项
- **📍 附近美食双转盘** — Geolocation 定位 → AI 菜系推荐 → AI 餐厅推荐
- **🎬 电影推荐** — AI 生成热门/经典电影选择转盘
- **✨ AI 结果解读** — 转盘出结果后 AI 趣味解读命运的选择
- **⚖️ 自定义权重** — 支持 `选项:权重` 格式，控制每个选项的扇区大小
- **AI 一句话生成** — 输入自然语言描述，自动解析为转盘
- **Canvas 加权渲染** — 物理旋转引擎 + cubic easing 缓动动画

</td>
</tr>
</table>

### 🔧 共享能力

| 能力 | 说明 |
|:---|:---|
| DeepSeek API | OpenAI 兼容格式 · 思考模式 · 120 秒超时 · AbortController 取消 |
| 配置系统 | localStorage 持久化 · 深合并 · 可自定义全部提示词模板 |
| 视觉系统 | 150 颗闪烁星星 · 月亮光晕 · 粒子爆发 · 屏幕闪光 |
| 无障碍 | ARIA 属性 · 键盘导航 · 焦点管理 · prefers-reduced-motion |
| 响应式 | 完美适配移动端 · 768px 断点 |

---

## 🚀 Quick Start

```bash
# 克隆仓库
git clone https://github.com/Gary23333/moon-oracle.git
cd moon-oracle

# 直接用浏览器打开
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

**配置 DeepSeek API Key：**

1. 访问 [platform.deepseek.com](https://platform.deepseek.com/) 获取 API Key
2. 打开页面右上角 ⚙️ 齿轮图标
3. 填入 API Key → 保存

> 💡 **没有 API Key？** 预设转盘、自定义转盘、OCR 识别均可独立使用。

---

## 📁 项目结构

```
moon-oracle/
├── index.html                         # 🏠 首页 — 双入口
├── tarot.html                         # 🔮 塔罗占卜
├── wheel.html                         # 🎡 命运转盘
├── css/
│   ├── base.css                       # 基础样式 · 星空 · 配置面板
│   ├── tarot.css                      # 塔罗样式 · 选牌 · 3D 翻转
│   └── wheel.css                      # 转盘样式 · Canvas · 结果展示
├── js/
│   ├── common/                        # 🔧 共享模块
│   │   ├── config.js                  #   配置管理 (deepMerge)
│   │   ├── api.js                     #   DeepSeek API 封装
│   │   ├── utils.js                   #   工具函数 (Toast/XSS防护/打字动画)
│   │   └── effects.js                 #   视觉效果 (星空/粒子/闪光)
│   ├── tarot/                         # 🔮 塔罗模块
│   │   ├── app.js                     #   主控制器 (5 视图流转)
│   │   ├── cards-data.js              #   78 张牌完整数据
│   │   ├── spreads.js                 #   8 种牌阵定义
│   │   ├── classifier.js              #   问题分类器
│   │   └── prompts.js                 #   提示词模板
│   └── wheel/                         # 🎡 转盘模块
│       ├── app.js                     #   主控制器 (预设/自定义/AI/双转盘)
│       ├── presets.js                 #   10 个预设转盘
│       ├── ai-generator.js            #   AI 生成器 (OCR/位置/电影/解读)
│       └── wheel-renderer.js          #   Canvas 渲染引擎
└── api-docs/
    └── README.md                      # 📖 API 接口文档
```

---

## ⚙️ 配置说明

| 配置项 | 说明 | 默认值 |
|:---|:---|:---|
| API 地址 | DeepSeek API 端点 | `https://api.deepseek.com` |
| API Key | DeepSeek API 密钥 | _(需填写)_ |
| 模型名称 | AI 模型 | `deepseek-v4-flash` |
| 思考模式 | DeepSeek 深度推理 | ✅ 开启 |
| 思考强度 | 推理深度 | `high` |
| 转盘 AI 解读 | 转盘结果趣味解读 | ❌ 关闭 |
| 提示词模板 | 塔罗/转盘/OCR/位置/电影/解读 | 预设模板 |

---

## 🎴 牌阵一览

| 牌阵 | 牌数 | 适用场景 | 位置含义 |
|:---|:---:|:---|:---|
| 单牌占卜 | 1 | 每日指引 | 核心答案 |
| 三牌占卜 | 3 | 时间线分析 | 过去 · 现在 · 未来 |
| 爱情十字 | 5 | 情感问题 | 你的感受 · 对方感受 · 现状 · 障碍 · 结果 |
| 事业金字塔 | 5 | 事业问题 | 现状 · 挑战 · 优势 · 环境 · 结果 |
| 二选一 | 5 | 抉择问题 | 现状 · 选项A · 选项B · 阻碍 · 建议 |
| 凯尔特十字 | 10 | 深度分析 | 全方位 10 个维度 |
| 四季牌阵 | 4 | 年度运势 | 春 · 夏 · 秋 · 冬 |
| 生命之树 | 10 | 人生探索 | 卡巴拉 10 个质点 |

---

## 🎡 预设转盘

| 转盘 | 图标 | 分类 | 选项数 |
|:---|:---:|:---|:---:|
| 中午吃什么 | 🍜 | 美食 | 12 |
| TA 喜不喜欢我 | 💕 | 感情 | 8 |
| 是还是否 | ✅ | 决策 | 6 |
| 看啥电影 | 🎬 | 娱乐 | 8 |
| 喝什么奶茶 | 🧋 | 美食 | 8 |
| 今天运动啥 | 🏃 | 健康 | 8 |
| 周末去哪玩 | 🎉 | 生活 | 8 |
| 先学什么 | 📚 | 学习 | 8 |
| 去哪旅行 | ✈️ | 生活 | 8 |
| 今天心情如何 | 🌈 | 生活 | 8 |

---

## 🎯 LLM 调用策略

| 场景 | 调用次数 | 思考模式 | 说明 |
|:---|:---:|:---:|:---|
| 塔罗完整占卜 | 1 次 | ✅ | 含完整牌义上下文 |
| 塔罗追问 | 每次 1 次 | ✅ | 保持占卜上下文 |
| 转盘 AI 生成 | 1 次 | ❌ | 自然语言 → JSON |
| OCR 识别 | 0 次 | — | Tesseract.js 浏览器端 |
| 附近美食 | 2 次 | ❌ | 菜系推荐 + 餐厅推荐 |
| 电影推荐 | 1 次 | ❌ | AI 生成电影列表 |
| 结果 AI 解读 | 1 次 | ❌ | 可选，需开启配置 |
| 预设/自定义转盘 | 0 次 | — | 纯前端 |

---

## 🔒 安全说明

- API Key 仅存储在浏览器 `localStorage`，不会发送到第三方
- 所有 API 请求通过 HTTPS 加密传输
- 用户输入经过 XSS 防护处理（先 HTML 转义再应用 Markdown）
- 请求支持 120 秒超时和主动取消
- 内联事件处理器已全部替换为 addEventListener

---

## 🤝 Contributing

欢迎贡献！请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

[🐛 报告 Bug](https://github.com/Gary23333/moon-oracle/issues/new?template=bug_report.md) · [💡 功能建议](https://github.com/Gary23333/moon-oracle/issues/new?template=feature_request.md) · [🔀 提交 PR](https://github.com/Gary23333/moon-oracle/pulls)

---

## 📝 Changelog

详见 [CHANGELOG.md](CHANGELOG.md)

| 版本 | 日期 | 亮点 |
|:---|:---|:---|
| **v2.1.0** | 2026-06-01 | OCR 截图识别 · 附近美食双转盘 · 电影推荐 · AI 结果解读 · 自定义权重 |
| **v2.0.0** | 2026-06-01 | Bug 修复 · 无障碍 · 性能优化 · SEO |
| **v1.0.0** | 2026-05-27 | 初始发布 · 塔罗占卜 · 命运转盘 · DeepSeek 集成 |

---

## 📄 License

[MIT License](LICENSE) © 2026 Moon Oracle

塔罗牌图像来自 [Wikimedia Commons](https://commons.wikimedia.org/)，属于公共领域。

---

<div align="center">

**✦ 月影决策屋 · 让命运为你指引方向 ✦**

<sub>Built with 🔮 and ✨</sub>

<br>

<sub>如果这个项目对你有帮助，请给一个 ⭐ Star！</sub>

</div>
