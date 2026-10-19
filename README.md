<div align="center">

<img alt="Moon Oracle" width="120" src="https://img.shields.io/badge/🔮-Moon_Oracle-8b5cf6?style=for-the-badge&labelColor=0a0612&color=d4a843">

# 🔮 月影决策屋 · Moon Oracle

**AI 驱动的塔罗占卜 & 命运转盘 · 原生 JS · 轻量 Node 代理 · 支持多厂商最新模型**

<sub><i>在星辰与烛火之间，让命运为你指引方向</i></sub>

<br>

<a href="https://gary23333.github.io/moon-oracle/"><img alt="Demo" src="https://img.shields.io/badge/🌐_在线_Demo-Visit-d4a843?style=for-the-badge"></a>
<a href="#-快速开始"><img alt="Quick Start" src="https://img.shields.io/badge/🚀_快速开始-5_min-2dd4bf?style=for-the-badge"></a>
<a href="https://github.com/Gary23333/moon-oracle/blob/main/CHANGELOG.md"><img alt="v4.0.0" src="https://img.shields.io/badge/version-v4.0.0-8b5cf6?style=for-the-badge"></a>
<a href="LICENSE"><img alt="MIT" src="https://img.shields.io/badge/license-MIT-d4a843?style=for-the-badge"></a>

<br><br>

<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5">
<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript">
<img src="https://img.shields.io/badge/Canvas_2D-4ade80?style=flat-square" alt="Canvas 2D">
<img src="https://img.shields.io/badge/AI-DeepSeek-8b5cf6?style=flat-square" alt="DeepSeek">
<img src="https://img.shields.io/badge/Vision-DeepSeek_V4.1_Flash-2dd4bf?style=flat-square" alt="DeepSeek Vision">
<img src="https://img.shields.io/badge/Backend-Node_Proxy-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node Proxy">
<img src="https://img.shields.io/badge/Build-Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite">
<img src="https://img.shields.io/badge/PRs-Welcome-2dd4bf?style=flat-square" alt="PRs Welcome">

</div>

---

## 🖼 页面预览

> 实际页面截图（桌面 1440×900 · 移动 390×844），从左至右依次为首页、塔罗占卜、命运转盘、每日塔罗、快占·答案之书、占卜历史。

| | | |
|:---:|:---:|:---:|
| ![首页](screenshots/desktop-index.png) | ![塔罗](screenshots/desktop-tarot.png) | ![转盘](screenshots/desktop-wheel.png) |
| **🏠 命运指引之门** 五入口矩阵 | **🔮 塔罗占卜** 78 张牌 · 8 种牌阵 | **🎡 命运转盘** 10 预设 · AI 生成 |
| ![每日](screenshots/desktop-daily.png) | ![快占](screenshots/desktop-quick.png) | ![历史](screenshots/desktop-history.png) |
| **✨ 每日塔罗** 连续打卡 · 40 语录 | **📖 快占·答案之书** Yes/No + 193 答案 | **📜 占卜历史** 50 条 · 分享卡片 |

<details>
<summary>📱 移动端预览（点击展开）</summary>

| | |
|:---:|:---:|
| ![首页-移动](screenshots/mobile-index.png) | |
| **🏠 首页 · iPhone 14 视口** | 完美适配移动端 · 768px 断点 |

</details>

---

## ✨ 核心特色

<table>
<tr>
<td width="50%" valign="top">

### 🔮 塔罗占卜
完整 **78 张 Rider-Waite-Smith** 塔罗牌（22 大阿卡纳 + 56 小阿卡纳），**8 种牌阵**（1~10 张牌全覆盖），**8 大问题分类**自动推荐牌阵，**DeepSeek 深度推理 + SSE 流式输出**（首字即时呈现、可随时取消），3D 翻牌动画 + 金色光效，解读前追问细节、解读后多轮追问。

</td>
<td width="50%" valign="top">

### 🎡 命运转盘
**10 个预设转盘**（美食·感情·决策·娱乐·生活·健康·学习），**AI 一句话生成**（自然语言 → JSON），**OCR 截图识别**（DeepSeek Vision 多模态），**附近美食双转盘**（定位→菜系→餐厅），**电影推荐**，**加权渲染**（`选项:权重` 格式）。

</td>
</tr>
<tr>
<td width="50%" valign="top">

### ✨ 每日塔罗
日期种子算法（每日一牌不变），**Streak 连续打卡**统计，**40 条神秘主题日签**，可选 AI 深度解读。

</td>
<td width="50%" valign="top">

### 📖 快占·答案之书
**Yes/No 二元快占**（牌义加权算法），**193 条神秘学答案之书**，即时反馈，零 API 也能用。

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 📜 占卜历史 & 分享
**50 条 localStorage 持久化**，类型筛选、详情查看、删除管理；**Canvas 生成 PNG 分享卡**，精美神秘主题。

</td>
<td width="50%" valign="top">

### 👤 AI 解牌人格
**🔮 严肃智者**（正统神秘学）· **💫 温柔疗愈**（温暖关怀）· **🔥 毒舌好友**（幽默犀利），一秒钟切换解牌风格。

</td>
</tr>
</table>

---

## 🚀 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/Gary23333/moon-oracle.git
cd moon-oracle

# 2. 安装依赖
npm install

# 3. 配置服务端 API Key（推荐）
cp .env.example .env
# 编辑 .env，填入 DEEPSEEK_API_KEY=sk-...

# 4. 启动开发服务器（Vite + /api 代理，一条命令即可）
npm run dev
# 默认运行在 http://localhost:5173/
```

<details>
<summary><b>🛠 配置 API Key（点击展开）</b></summary>

**方式一（推荐）：服务端环境变量** — 复制 `.env.example` 为 `.env`，填入 `DEEPSEEK_API_KEY=sk-...`。密钥仅存于服务端，由代理在转发时注入，不会下发到浏览器。

**方式二（本地调试备用，BYOK）：浏览器端填写** — 打开任意页面 → 右上角 ⚙️ 齿轮图标 → 填入 API Key → 保存。仅在服务端未配置密钥时作为兜底使用（存储于浏览器 `localStorage`）。

1. 访问 [platform.deepseek.com](https://platform.deepseek.com/) 获取 API Key
2. 在配置面板中选择厂商（内置 DeepSeek 或自定义 OpenAI 兼容端点）与模型
3. 保存后立即生效

> 💡 **没有 API Key？** 预设转盘、自定义转盘、每日塔罗、答案之书均可**独立使用**，不影响核心体验；需联网的功能（塔罗解读、AI 生成、Vision OCR 等）才需要密钥。

</details>

<details>
<summary><b>📦 生产构建与部署（点击展开）</b></summary>

```bash
npm run build     # 输出到 dist/
npm start         # 启动 Node 服务器：托管 dist/ 静态资源 + 挂载 POST /api/chat
```

> ⚠️ **部署方式变更（v4.0.0 BREAKING）**：应用不再是可以直接托管到 GitHub Pages 的纯静态站点。因为 API Key 改为服务端注入、并新增 `/api/chat` 代理，运行时需要一个 **Node 环境**（如 Render / Railway / Fly.io / VPS）。启动流程为 `npm run build && npm start`，并通过环境变量 `DEEPSEEK_API_KEY` 注入密钥（端口可用 `PORT` 指定，默认 3000）。

</details>

---

## 📚 详细功能

### 🔮 塔罗占卜

- **78 张完整牌组** — 22 大阿卡纳 + 56 小阿卡纳，含完整正逆位牌义
- **8 种牌阵** — 单牌 → 凯尔特十字，1~10 张牌全覆盖
- **8 大问题分类** — 情感 · 事业 · 财运 · 学业 · 健康 · 抉择 · 日常 · 自定义
- **智能牌阵推荐** — 根据问题类型自动匹配最佳牌阵
- **DeepSeek 思考模式** — 深度推理驱动的结构化解读（可显示推理链）
- **3D 翻牌动画** — Y 轴 180° 旋转 + 金色光效
- **细节追问** — 解读前收集补充信息，解读后多轮追问
- **自定义提示词** — 完全可调的系统提示词模板

### 🎡 命运转盘

- **10 个预设转盘** — 涵盖美食 · 感情 · 决策 · 娱乐 · 生活 · 健康 · 学习
- **AI 一句话生成** — 输入自然语言，自动解析为转盘选项
- **📷 OCR 截图识别** — DeepSeek Vision 多模态，图片文字自动提取为转盘选项
- **📍 附近美食双转盘** — Geolocation 定位 → AI 菜系推荐 → AI 餐厅推荐
- **🎬 电影推荐** — AI 生成热门/经典电影选择转盘
- **✨ AI 结果解读** — 转盘出结果后 AI 趣味解读命运的选择
- **⚖️ 自定义权重** — 支持 `选项:权重` 格式，控制每个选项的扇区大小
- **Canvas 加权渲染** — 物理旋转引擎 + cubic easing 缓动动画

### ✨ 每日塔罗

- **日期种子算法** — 每天一牌不变
- **Streak 连续天数统计** — 记录连续打卡天数
- **40 条每日语录** — 精选神秘主题日签文案
- **可选 AI 解读** — 纯前端日期种子，AI 解读为可选项

### 📖 快占·答案之书

- **Yes/No 二元快占** — 牌义加权算法结合正逆位概率
- **193 条答案之书** — 丰富的神秘学风格回复
- **即时反馈** — 无需等待，零 API 也能用
- **可选 AI 增强** — 启用 API 后可获得更深的解读

### 📜 占卜历史

- **50 条上限存储** — localStorage 持久化
- **类型筛选** — 支持按类型过滤记录
- **详情查看与删除** — 完整历史管理
- **Canvas 分享卡** — 一键生成分享 PNG

### 👤 AI 解牌人格

| 人格 | 风格 | 适合场景 |
|:---|:---|:---|
| 🔮 **严肃智者** | 严谨、专业、深度分析 | 重要决策 · 正式场合 |
| 💫 **温柔疗愈**（默认） | 温暖、鼓励、安抚 | 情绪低落 · 需要鼓励 |
| 🔥 **毒舌好友** | 幽默、直白、一针见血 | 想要真相 · 不怕扎心 |

### 🔧 共享能力

| 能力 | 说明 |
|:---|:---|
| DeepSeek API | 经后端代理调用 · OpenAI 兼容格式 · SSE 流式输出 · 多厂商支持 · 120 秒超时 · AbortController 取消 |
| 配置系统 | localStorage 持久化 · deepMerge 递归合并 · v3→v4 自动迁移 · 可自定义全部提示词模板 |
| 视觉系统 | 150 颗闪烁星星 · 月亮光晕 · 粒子爆发 · 屏幕闪光 |
| 无障碍 | ARIA 属性 · 键盘导航 · 焦点管理 · `prefers-reduced-motion` |
| 响应式 | 完美适配移动端 · 768px 断点 |

---

## 🛠 技术栈

| 类别 | 选型 | 用途 |
|:---|:---|:---|
| 构建工具 | **Vite 8** | 多页应用 · ES Module · 零配置开发 |
| 前端三件套 | HTML5 + CSS3 + Vanilla JS | 零框架依赖 |
| 渲染 | **Canvas 2D** | 塔罗 3D 翻转 · 转盘加权渲染 · 分享卡片 |
| 后端代理 | **Node 原生 http**（零第三方依赖） | 托管 `dist/` 静态资源 · `POST /api/chat` 转发 · 服务端注入密钥 |
| AI | **DeepSeek API（OpenAI 兼容）** | 多厂商支持 · SSE 流式输出 · 按任务分级路由 |
| Vision | **DeepSeek V4.1 Flash 多模态** | 截图文字识别（图像 content part） |
| 字体 | Google Fonts (Cinzel + Noto Serif SC + Ma Shan Zheng) | 神秘主题排版 |
| 存储 | `localStorage` | 配置 · 历史 · 连续打卡 |
| 定位 | Geolocation API | 附近美食推荐 |
| 网络 | SSE + AbortController + 120s 超时 | 流式渲染 · 请求可取消 |

---

## 📁 项目结构

```
moon-oracle/
├── index.html                         # 🏠 首页 — 五入口矩阵
├── tarot.html                         # 🔮 塔罗占卜
├── wheel.html                         # 🎡 命运转盘
├── daily.html                         # ✨ 每日塔罗
├── quick.html                         # 📖 快占·答案之书
├── history.html                       # 📜 占卜历史
├── screenshots/                       # 🖼 README 页面截图
├── scripts/
│   └── screenshot.mjs                 # Puppeteer 截图脚本
├── css/
│   ├── base.css                       # 基础样式 · 星空 · 配置面板
│   ├── tarot.css                      # 塔罗样式 · 选牌 · 3D 翻转
│   └── wheel.css                      # 转盘样式 · Canvas · 结果展示
├── js/
│   ├── common/                        # 🔧 共享模块
│   │   ├── config.js                  #   配置管理 (deepMerge + v3→v4 迁移)
│   │   ├── config-panel.js            #   统一配置面板（6 个页面自动挂载）
│   │   ├── routing.js                 #   按任务分级的模型路由
│   │   ├── api.js                     #   /api/chat 代理封装 (SSE/Vision/超时/取消)
│   │   ├── utils.js                   #   工具函数 (Toast/XSS/打字机)
│   │   ├── effects.js                 #   视觉效果 (星空/粒子/闪光)
│   │   └── prompts.js                 #   共享提示词模板
│   ├── tarot/                         # 🔮 塔罗模块
│   │   ├── app.js                     #   主控制器 (5 视图流转)
│   │   ├── cards-data.js              #   78 张牌完整数据
│   │   ├── spreads.js                 #   8 种牌阵定义
│   │   ├── classifier.js              #   问题分类器
│   │   └── prompts.js                 #   提示词模板
│   ├── wheel/                         # 🎡 转盘模块
│   │   ├── app.js                     #   主控制器 (预设/自定义/AI/双转盘)
│   │   ├── presets.js                 #   10 个预设转盘
│   │   ├── ai-generator.js            #   AI 生成器 (OCR/位置/电影/解读)
│   │   └── wheel-renderer.js          #   Canvas 渲染引擎
│   ├── daily/                         # ✨ 每日塔罗模块
│   │   ├── app.js                     #   主控制器
│   │   └── quotes.js                  #   40 条每日语录
│   ├── quick/                         # 📖 快占模块
│   │   ├── app.js                     #   主控制器
│   │   ├── answers.js                 #   193 条答案之书
│   │   └── oracle.js                  #   牌义加权算法
│   └── history/                       # 📜 历史模块
│       ├── app.js                     #   主控制器
│       └── store.js                   #   localStorage 存储管理
├── server/                            # 🌐 轻量后端代理（Node 原生，零第三方依赖）
│   ├── index.js                       #   生产服务器：托管 dist/ + 挂载 POST /api/chat + 加载 .env
│   ├── app.js                         #   框架无关处理器：转发上游 + SSE 透传 + 错误映射
│   └── providers.js                   #   厂商注册表：内置 deepseek / 自定义 OpenAI 兼容
├── api-docs/
│   └── README.md                      # 📖 API 接口文档
├── .env.example                       # 🔑 环境变量示例（复制为 .env 使用）
├── vite.config.js                     # Vite 配置（开发时挂载 /api）
├── package.json
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

---

## 📊 速查表

### ⚙️ 配置项

| 字段 | 默认值 | 说明 |
|:---|:---|:---|
| `provider` | `deepseek` | 厂商 id：`deepseek`（内置）或 `custom`（OpenAI 兼容） |
| `model` | `deepseek-flash` | 全局默认模型（旧别名 `deepseek-v4-flash` 已废弃，自动迁移） |
| `customBaseUrl` | _(空)_ | `provider === 'custom'` 时的自定义 OpenAI 兼容地址 |
| `apiUrl` | `https://api.deepseek.com` | 兼容保留字段（新流程由 `provider` / `customBaseUrl` 解析） |
| `apiKey` | _(空)_ | BYOK API 密钥（仅在服务端未配置时兜底，优先级低于环境变量） |
| `streaming` | `true` | 是否启用 SSE 流式输出（首字即时呈现） |
| `models` | 见下 | 按任务分级的模型映射（`reading`/`followup`→`deepseek-v4-pro`，`generate`/`vision`/`quick`/`daily`→`deepseek-flash`） |
| `thinkingByTask` | 见下 | 按任务分级的思考开关（`reading`/`followup` 为 `true`，其余为 `false`） |
| `thinkingEnabled` | `true` | 全局思考模式默认值 |
| `thinkingEffort` | `high` | 思考强度（`high` 标准 / `max` 最强） |
| `showThinking` | `false` | 是否在 UI 中显示 AI 推理链 |
| `typingSpeed` | `30` | 打字机效果速度（ms/字） |
| `wheelResultAI` | `false` | 转盘结果是否自动调用 AI 解读 |
| `readerPersona` | `gentle` | 解牌人格（`serious` / `gentle` / `blunt`） |
| `tarotPrompts` | 预设模板 | 塔罗系统提示词（可自定义） |
| `wheelPrompts` | 预设模板 | 转盘系统提示词（可自定义） |

### 🎴 牌阵一览

| 牌阵 | 牌数 | 适用场景 | 位置含义 |
|:---|:---:|:---|:---|
| 单牌占卜 🔮 | 1 | 简单问题 · 每日指引 | 核心答案 |
| 三牌占卜 🌙✨☀️ | 3 | 时间脉络 · 发展走向 | 过去 · 现在 · 未来 |
| 爱情十字 💕 | 5 | 感情问题 | 你的感受 · 对方感受 · 关系现状 · 障碍 · 结果 |
| 事业金字塔 💼 | 5 | 事业发展 | 现状基础 · 面临挑战 · 你的优势 · 环境影响 · 最终结果 |
| 二选一 ⚖️ | 5 | 决策 · 两难抉择 | 当前状况 · 选项A · 选项B · 阻碍因素 · 最终建议 |
| 凯尔特十字 ✦ | 10 | 重大问题 · 最全面 | 10 个维度全方位解析 |
| 四季牌阵 🌸🌻🍂❄️ | 4 | 年度运势 | 春 · 夏 · 秋 · 冬 |
| 生命之树 🌳 | 10 | 人生深层意义 | 卡巴拉 10 个质点 |

### 🎡 预设转盘

| 转盘 | 图标 | 分类 | 选项数 |
|:---|:---:|:---:|:---:|
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

### 🤖 LLM 调用策略

| 场景 | 调用次数 | 模型 | 思考模式 | 流式 | 说明 |
|:---|:---:|:---:|:---:|:---:|:---|
| 塔罗完整占卜 | 1 次 | `deepseek-v4-pro` | ✅ | ✅ SSE | 深度推理 · 仅注入所抽牌义（提示词瘦身） |
| 塔罗追问 | 每次 1 次 | `deepseek-v4-pro` | ✅ | ✅ SSE | 保持占卜上下文 |
| 每日塔罗 | 0~1 次 | `deepseek-flash` | ❌ | ✅ SSE | 纯前端日期种子，可选 AI 解读 |
| 快占·答案之书 | 0~1 次 | `deepseek-flash` | ❌ | ✅ SSE | 纯前端牌义加权，可选 AI 增强 |
| 转盘 AI 生成 | 1 次 | `deepseek-flash` | ❌ | ❌ | 自然语言 → 结构化 JSON |
| OCR 识别 | 1 次 | `deepseek-flash` | ❌ | ❌ | DeepSeek Vision 多模态（图像 content part） |
| 附近美食 | 2 次 | `deepseek-flash` | ❌ | ❌ | 菜系推荐 + 餐厅推荐（结构化 JSON） |
| 电影推荐 | 1 次 | `deepseek-flash` | ❌ | ❌ | AI 生成电影列表（结构化 JSON） |
| 结果 AI 解读 | 1 次 | `deepseek-flash` | ❌ | ✅ SSE | 可选，需开启 `wheelResultAI` |
| 预设/自定义转盘 | 0 次 | — | — | — | 纯前端 |

---

## 🔒 安全说明

- **API Key 安全** — 生产环境由服务端（`server/`）读取环境变量并在转发时注入，密钥**不会下发到浏览器**；浏览器端 BYOK 仅在本地开发/服务端未配置时作为兜底，存储于 `localStorage`
- **HTTPS 加密** — 所有 API 请求通过 HTTPS 加密传输
- **XSS 防护** — 用户输入先 HTML 转义再应用 Markdown 渲染
- **请求控制** — 120 秒超时 + `AbortController` 主动取消
- **代码安全** — 内联事件处理器已全部替换为 `addEventListener`
- **依赖最小化** — 后端代理零第三方依赖（仅 Node 内置模块）；运行时不再有 Tesseract.js 等浏览器依赖

---

## 🤝 贡献

欢迎贡献！请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

- [🐛 报告 Bug](https://github.com/Gary23333/moon-oracle/issues/new?template=bug_report.md)
- [💡 功能建议](https://github.com/Gary23333/moon-oracle/issues/new?template=feature_request.md)
- [🔀 提交 PR](https://github.com/Gary23333/moon-oracle/pulls)

---

## 📝 版本历史

| 版本 | 日期 | 亮点 |
|:---|:---|:---|
| **v4.0.0** | 2026-10-20 | 🆕 轻量 Node 后端代理 · 服务端注入密钥 · 多厂商 OpenAI 兼容 · SSE 流式提速 · DeepSeek Vision OCR · 统一配置面板 · 模型分级路由 |
| **v3.0.0** | 2026-07-27 | 🆕 每日塔罗 · 快占·答案之书 · 占卜历史 · 分享卡片 · AI 解牌人格 · Vite 多页应用重构 |
| **v2.1.0** | 2026-06-01 | 🆕 OCR 截图识别 · 附近美食双转盘 · 电影推荐 · AI 结果解读 · 自定义权重 |
| **v2.0.0** | 2026-06-01 | 🐛 修复 · 无障碍 · 性能优化 · SEO |
| **v1.0.0** | 2026-05-27 | 🎉 初始发布 · 塔罗占卜 · 命运转盘 · DeepSeek 集成 |

详见 [CHANGELOG.md](CHANGELOG.md)。

---

## 📄 License

[MIT License](LICENSE) © 2026 Moon Oracle

塔罗牌图像来自 [Wikimedia Commons](https://commons.wikimedia.org/)，属于**公共领域**。

---

<div align="center">

**✦ 月影决策屋 · 让命运为你指引方向 ✦**

<sub>Built with 🔮 and ✨</sub>

<br><br>

<sub>如果这个项目对你有帮助，请给一个 ⭐ Star！</sub>

<br>

<sub><a href="#-月影决策屋--moon-oracle">⬆ 回到顶部</a></sub>

</div>
