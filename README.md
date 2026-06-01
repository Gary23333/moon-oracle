<div align="center">

# 🔮 Moon Oracle · 月影决策屋

### ✦ 命运指引之门 ✦

<p>
  <em>在星辰与烛火之间，让命运为你指引方向</em>
</p>

<p>
  <a href="#-quick-start">Quick Start</a> ·
  <a href="#-功能特性">Features</a> ·
  <a href="#-技术栈">Tech Stack</a> ·
  <a href="#-contributing">Contributing</a>
</p>

<p>
  <img src="https://img.shields.io/badge/version-v1.0.0-8b5cf6?style=flat-square&logo=data:image/svg+xml;base64,..." alt="version">
  <img src="https://img.shields.io/badge/license-MIT-d4a843?style=flat-square" alt="license">
  <img src="https://img.shields.io/badge/PRs-Welcome-2dd4bf?style=flat-square" alt="PRs welcome">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/AI-DeepSeek-8b5cf6?style=flat-square" alt="DeepSeek AI">
</p>

<br>

```
    ✦   ·  ˚  ✧  ·  ˚  ✦
  ˚    🌙  ·  ✦  ·    ˚
    ·  ✦  ˚  ·  ✧  ˚  ·
  ✧   ·  ˚  ✦  ·  ˚   ✧
    ˚  ·  ✧  🌟  ·  ˚
      ✦  ˚  ·  ˚  ✦
```

**Moon Oracle** is a mystical-themed web application that combines **Tarot Card Reading** with an AI-powered **Fate Wheel (Decision Spinner)**. Built as a zero-dependency, pure frontend app — just open `index.html` and let the stars guide you.

**月影决策屋** 是一款神秘主题的 Web 应用，将 **塔罗占卜** 与 AI 驱动的 **命运转盘** 完美融合。纯前端实现，零依赖，打开 `index.html` 即可开启命运之旅。

</div>

---

## 🌟 功能特性

<table>
<tr>
<td width="50%" valign="top">

### 🔮 塔罗占卜

- **78 张完整塔罗牌** — 22 张大阿卡纳 + 56 张小阿卡纳，每张含完整正逆位牌义
- **8 种牌阵** — 从单牌到凯尔特十字，覆盖所有占卜场景
- **8 大问题分类** — 情感、事业、财运、学业、健康、抉择、日常、自由提问
- **智能牌阵推荐** — 根据问题类型自动推荐最佳牌阵
- **AI 深度解读** — DeepSeek 思考模式驱动，结构化输出解读文本
- **翻牌 3D 动画** — 精致的 Y 轴 180° 翻转，配合金色光效
- **细节追问** — 解读前收集补充信息，解读后支持多轮追问
- **自定义提示词** — 完全可调的系统提示词模板

</td>
<td width="50%" valign="top">

### 🎡 命运转盘

- **10 个预设转盘** — 涵盖吃什么、看什么、做什么等日常决策场景
- **Canvas 加权渲染** — 每个选项可设置不同权重，转盘面积按权重分配
- **分类筛选** — 按美食、感情、决策、娱乐、生活、健康、学习筛选
- **自定义转盘** — 手动输入选项，2-12 个均可
- **AI 一句话生成** — 输入自然语言描述，自动解析为转盘
- **物理旋转引擎** — requestAnimationFrame 驱动，cubic easing 缓动动画
- **双转盘联动** — （规划中）菜系转盘 → 餐厅转盘的级联选择
- **OCR / 地理位置** — （规划中）更多智能入口

</td>
</tr>
</table>

---

## 🚀 Quick Start

> **零安装，零构建，零依赖。** 需要一个现代浏览器和 DeepSeek API Key。

```bash
# 1. 克隆仓库
git clone https://github.com/Gary23333/moon-oracle.git
cd moon-oracle

# 2. 直接用浏览器打开
open index.html          # macOS
# 或
start index.html         # Windows
# 或
xdg-open index.html      # Linux
```

**配置 API Key：**

1. 打开页面后，点击右上角 ⚙️ 齿轮图标
2. 填入你的 [DeepSeek API Key](https://platform.deepseek.com/)
3. 保存配置，即可开始使用

> 💡 **没有 API Key？** 预设转盘和自定义转盘功能无需 API Key 即可使用。

---

## 🛠 技术栈

<table>
<tr>
<td align="center"><strong>前端</strong></td>
<td>纯 HTML5 / CSS3 / Vanilla JavaScript — 零框架，零构建工具</td>
</tr>
<tr>
<td align="center"><strong>样式</strong></td>
<td>CSS3 Custom Properties · Grid · Flexbox · Keyframe Animations</td>
</tr>
<tr>
<td align="center"><strong>图形</strong></td>
<td>Canvas 2D API — 加权转盘渲染引擎</td>
</tr>
<tr>
<td align="center"><strong>AI</strong></td>
<td>DeepSeek Chat Completions API · 思考模式（Reasoning） · OpenAI 兼容格式</td>
</tr>
<tr>
<td align="center"><strong>存储</strong></td>
<td>浏览器 localStorage — 配置持久化</td>
</tr>
<tr>
<td align="center"><strong>字体</strong></td>
<td>Google Fonts — Cinzel Decorative · Noto Serif SC · Ma Shan Zheng</td>
</tr>
<tr>
<td align="center"><strong>卡面</strong></td>
<td>Wikimedia Commons — Rider-Waite-Smith 公共领域塔罗牌图像</td>
</tr>
</table>

---

## 📁 项目结构

```
moon-oracle/
├── index.html                     # 🏠 首页 — 双入口选择
├── tarot.html                     # 🔮 塔罗占卜页面
├── wheel.html                     # 🎡 命运转盘页面
├── css/
│   ├── base.css                   # 共享基础样式 · CSS 变量 · 星空 · 配置面板
│   ├── tarot.css                  # 塔罗样式 · 选牌 · 3D 翻转 · 结果展示
│   └── wheel.css                  # 转盘样式 · 预设网格 · Canvas · 结果展示
├── js/
│   ├── common/                    # 🔧 共享模块
│   │   ├── config.js              #   配置管理 (localStorage)
│   │   ├── api.js                 #   DeepSeek API 封装 (超时/取消/思考模式)
│   │   ├── utils.js               #   工具函数 (Toast/XSS防护/打字动画)
│   │   └── effects.js             #   视觉效果 (星空/粒子/闪光)
│   ├── tarot/                     # 🔮 塔罗模块
│   │   ├── app.js                 #   主控制器 (5 视图流转)
│   │   ├── cards-data.js          #   78 张牌完整数据
│   │   ├── spreads.js             #   8 种牌阵定义
│   │   ├── classifier.js          #   问题分类器 (8 类)
│   │   └── prompts.js             #   提示词模板
│   └── wheel/                     # 🎡 转盘模块
│       ├── app.js                 #   主控制器 (预设/自定义/AI)
│       ├── presets.js             #   10 个预设转盘
│       ├── ai-generator.js        #   AI 转盘生成器
│       └── wheel-renderer.js      #   Canvas 渲染引擎
└── api-docs/
    └── README.md                  # 📖 API 接口文档
```

---

## ⚙️ 配置说明

打开页面右上角齿轮 ⚙️ 即可配置：

| 配置项 | 说明 | 默认值 |
|:---|:---|:---|
| API 地址 | DeepSeek API 端点 | `https://api.deepseek.com` |
| API Key | DeepSeek API 密钥 | _(需用户填写)_ |
| 模型名称 | 使用的 AI 模型 | `deepseek-v4-flash` |
| 思考模式 | 启用 DeepSeek 深度推理 | ✅ 开启 |
| 思考强度 | 推理深度 | `high` |
| 显示思考过程 | 在界面上展示 AI 推理链 | ❌ 关闭 |
| 提示词模板 | 完全可自定义的系统提示词 | 预设模板 |

> 💡 所有配置存储在浏览器 localStorage 中，清除浏览器数据会重置配置。

---

## 🎴 牌阵一览

| 牌阵 | 牌数 | 适用场景 | 位置含义 |
|:---|:---:|:---|:---|
| 单牌占卜 | 1 | 每日指引、简单问题 | 核心答案 |
| 三牌占卜 | 3 | 时间线分析 | 过去 · 现在 · 未来 |
| 爱情十字 | 5 | 情感问题 | 你的感受 · 对方感受 · 现状 · 障碍 · 结果 |
| 事业金字塔 | 5 | 事业问题 | 现状 · 挑战 · 优势 · 环境 · 结果 |
| 二选一 | 5 | 抉择问题 | 现状 · 选项A · 选项B · 阻碍 · 建议 |
| 凯尔特十字 | 10 | 深度分析 | 全方位 10 个维度 |
| 四季牌阵 | 4 | 年度运势 | 春 · 夏 · 秋 · 冬 |
| 生命之树 | 10 | 人生探索 | 卡巴拉 10 个质点 |

---

## 🎯 LLM 调用策略

| 场景 | 调用次数 | 思考模式 | 说明 |
|:---|:---:|:---:|:---|
| 塔罗完整占卜 | 1 次 | ✅ | 翻牌 + 解读一次完成，耗时较长 |
| 塔罗追问 | 每次 1 次 | ❌ | 按需调用，多轮对话 |
| 转盘 AI 生成 | 1 次 | ❌ | 无思考模式，响应较快 |
| 预设/自定义转盘 | 0 次 | — | 纯前端实现，无需 API |

---

## 🎨 视觉特性

- 🌌 **深色神秘主题** — 紫/金配色，沉浸式占卜氛围
- ⭐ **星空背景动画** — 150 颗闪烁星星 + 月亮光晕
- ✨ **金色光效** — 选牌描边、粒子爆发、屏幕闪光
- 🃏 **3D 翻牌动画** — Y 轴 180° 旋转 + 正逆位判定
- 🎡 **物理转盘** — Canvas 2D 加权渲染 + 缓动旋转
- 📱 **响应式设计** — 完美适配移动端
- ♿ **无障碍支持** — 尊重 `prefers-reduced-motion`

---

## 📸 截图

> _TODO: 添加项目截图_

| 首页 | 塔罗占卜 | 命运转盘 |
|:---:|:---:|:---:|
| ![首页](screenshots/home.png) | ![塔罗](screenshots/tarot.png) | ![转盘](screenshots/wheel.png) |

---

## 🔒 安全说明

- API Key 仅存储在浏览器本地 `localStorage`，不会发送到第三方
- 所有 API 请求通过 HTTPS 加密传输
- 用户输入经过 XSS 防护处理
- 请求支持 120 秒超时和主动取消

---

## 🗺 Roadmap

- [ ] OCR 截图识别 — 从截图中提取文字生成转盘
- [ ] 地理位置美食 — 基于定位的双转盘餐厅推荐
- [ ] 电影选择器 — 接入当前上映电影数据
- [ ] 转盘结果 AI 解读 — 为转盘结果提供智能分析
- [ ] 多语言支持 — 英文界面
- [ ] PWA 支持 — 离线使用
- [ ] 更多牌阵和主题

---

## 🤝 Contributing

欢迎贡献！请阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详情。

<p>
  <a href="https://github.com/Gary23333/moon-oracle/issues/new?template=bug_report.md">🐛 报告 Bug</a> ·
  <a href="https://github.com/Gary23333/moon-oracle/issues/new?template=feature_request.md">💡 功能建议</a> ·
  <a href="https://github.com/Gary23333/moon-oracle/pulls">🔀 提交 PR</a>
</p>

---

## 📝 Changelog

详见 [CHANGELOG.md](CHANGELOG.md)

---

## 📄 License

本项目基于 [MIT License](LICENSE) 开源。

塔罗牌图像来自 [Wikimedia Commons](https://commons.wikimedia.org/)，属于公共领域。

---

<div align="center">

### ✦ 月影决策屋 · 让命运为你指引方向 ✦

<p>
  <sub>Built with 🔮 and ✨</sub>
</p>

<p>
  <sub>如果这个项目对你有帮助，请给一个 ⭐ Star 支持一下！</sub>
</p>

</div>
