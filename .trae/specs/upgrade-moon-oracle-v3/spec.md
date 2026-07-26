# Moon Oracle v3.0 彻底升级 Spec

## Why
项目当前为 v2.1.0 零依赖纯静态站点，存在若干已识别的 BUG 与健壮性缺陷；同时对比 2025–2026 市面主流塔罗/趣味测试产品（塔罗气泡、Quin、月见、tarotap、Tarotica 等），缺少每日塔罗、Yes/No 快占、答案之书、占卜历史、分享卡片、AI 解牌人格等标配玩法。本次升级彻底修复 BUG、对齐市场主流功能，并将工程化升级为 Vite 构建。

## What Changes
- **工程化**：迁移为 Vite 多页应用（index / tarot / wheel 三个入口），全局脚本（MoonConfig/MoonUtils 等）改造为 ES Modules，Tesseract.js 由 CDN 改为 npm 依赖，构建产物仍为纯静态（可部署 GitHub Pages）。**BREAKING**（开发方式由直接打开 HTML 变为 `npm install && npm run dev/build`，产物语义不变）
- **BUG 修复**：逐项验证并修复代码审查发现的缺陷，覆盖：转盘权重解析校验、OCR 错误处理与反馈、XSS 防护完整性、配置系统深合并/缺失字段（soundEnabled 音效缺失实现）、API 超时/取消/错误码处理、塔罗抽牌洗牌与选牌校验、追问上下文长度限制、DOM ID 与事件绑定匹配、Canvas 渲染边界。
- **新功能 1 · 每日塔罗**：每日一抽（当日固定牌，localStorage 记录）、连续签到 streak 计数、每日运势语录。
- **新功能 2 · Yes/No 快占 + 答案之书**：输入问题一键获得 是/否/待定 快答与一句启示语录，无需 API Key 也可用（内置牌义随机 + 可选 AI 增强）。
- **新功能 3 · 占卜历史 + 分享卡片**：localStorage 保存塔罗/快占历史记录（时间、问题、牌面、解读摘要），历史页可查看/删除；Canvas 生成精美分享卡片图，支持下载。
- **新功能 4 · AI 解牌人格切换**：严肃智者 / 温柔疗愈 / 毒舌好友 三种解牌风格，作用于塔罗解读与快占解读的系统提示词，可配置。
- **首页升级**：首页由双入口升级为功能矩阵入口（塔罗占卜 / 命运转盘 / 每日塔罗 / 快占·答案之书 / 占卜历史）。
- **文档**：README、CHANGELOG、api-docs 更新至 v3.0.0。
- **发布**：git commit 并 push 到 `origin`（github.com/Gary23333/moon-oracle）。

## Impact
- Affected specs: 塔罗占卜、命运转盘、配置系统、首页导航、构建与部署
- Affected code:
  - 全部 `js/**`（全局命名空间 → ES Modules 改造）
  - `index.html` / `tarot.html` / `wheel.html`（脚本引用方式变更）
  - 新增 `js/daily/`、`js/quick/`、`js/history/` 模块与对应页面
  - 新增 `package.json`、`vite.config.js`
  - `README.md`、`CHANGELOG.md`、`api-docs/README.md`

## ADDED Requirements

### Requirement: Vite 工程化构建
The system SHALL 使用 Vite 作为构建工具，提供 `npm run dev`（开发）与 `npm run build`（产物输出至 `dist/`）能力，多页入口包含 index / tarot / wheel 及新增页面；构建产物为纯静态文件，可直接部署 GitHub Pages；所有跨模块共享代码 SHALL 通过 ES Module import/export 组织，不再依赖全局变量挂载。

#### Scenario: 开发模式启动
- **WHEN** 开发者执行 `npm install && npm run dev`
- **THEN** Vite 开发服务器启动，三个页面均可正常访问且功能完整

#### Scenario: 构建产物可用
- **WHEN** 执行 `npm run build` 并用任意静态服务器打开 `dist/index.html`
- **THEN** 全部页面与功能（含 OCR）正常工作，无 404 资源引用

### Requirement: 已知 BUG 全部修复
The system SHALL 逐项验证代码审查 BUG 清单（见 tasks.md Task 2），确认为真实缺陷的予以修复，确认为误报的记录原因；修复后各页面控制台无运行时错误。

#### Scenario: 转盘权重健壮性
- **WHEN** 用户输入非法权重（负数、NaN、与选项数量不匹配）
- **THEN** 系统给出明确提示并拒绝启动，不产生渲染错误

#### Scenario: OCR 失败反馈
- **WHEN** OCR 识别失败（网络错误/图片无法加载/无文字）
- **THEN** 用户看到具体失败原因提示，而非笼统的"识别失败"

### Requirement: 每日塔罗
The system SHALL 提供每日塔罗页面：每日首次访问可抽取当日牌（当日 0 点后重置，同一天结果固定）；展示连续打卡天数 streak；展示一条每日运势语录；当日已抽则直接展示结果。

#### Scenario: 首次抽取
- **WHEN** 用户当日首次进入每日塔罗并抽牌
- **THEN** 展示当日牌面与解读，streak 按连续天数 +1，结果存入 localStorage

#### Scenario: 断签重置
- **WHEN** 用户超过一天未打卡后再次抽牌
- **THEN** streak 重置为 1

### Requirement: Yes/No 快占与答案之书
The system SHALL 提供快占页面：用户输入问题后可选择「Yes/No 快占」（返回 是/否/待定 + 简评）或「答案之书」（返回一句启示语录）；无 API Key 时使用内置随机算法与本地语录库，配置 API Key 后可选 AI 增强解读。

#### Scenario: 无 Key 快占
- **WHEN** 未配置 API Key 的用户输入问题并点击快占
- **THEN** 本地随机给出 是/否/待定 结果与简评，不报错

### Requirement: 占卜历史与分享卡片
The system SHALL 将塔罗占卜、快占结果自动存入 localStorage 历史（上限 50 条，超出淘汰最旧）；历史页面支持查看详情、单条删除、清空；每条历史可生成 Canvas 分享卡片并下载为 PNG。

#### Scenario: 生成分享卡片
- **WHEN** 用户在历史记录点击「生成分享卡片」
- **THEN** Canvas 渲染包含牌面/结果/日期的精美卡片并提供 PNG 下载

### Requirement: AI 解牌人格
The system SHALL 提供 严肃智者 / 温柔疗愈 / 毒舌好友 三种解牌人格，默认温柔疗愈；人格选择持久化到配置，并注入塔罗解读与快占 AI 解读的系统提示词；用户自定义提示词优先于人格模板。

#### Scenario: 切换人格
- **WHEN** 用户在配置或解读页切换解牌人格为「毒舌好友」
- **THEN** 后续 AI 解读语气符合毒舌好友风格

### Requirement: 首页功能矩阵
The system SHALL 将首页升级为功能矩阵入口，包含：塔罗占卜、命运转盘、每日塔罗、快占·答案之书、占卜历史，并保持现有视觉风格与响应式布局。

#### Scenario: 移动端访问
- **WHEN** 移动端用户打开首页
- **THEN** 五个入口卡片单列排布，均可正常跳转

## MODIFIED Requirements

### Requirement: 配置系统
原 localStorage 配置系统 SHALL 新增 `readerPersona`（解牌人格）、`dailyTarot`（每日塔罗数据）、`history`（历史记录）三个命名空间字段；深合并逻辑对新字段兼容；`soundEnabled` 若保留则必须补齐真实音效实现，否则从配置与 UI 中移除。

### Requirement: 开发与运行方式
原「直接打开 index.html 即可运行」变更为「`npm run dev` 开发 / `npm run build` 后部署 dist」；README Quick Start 同步更新。**BREAKING**

## REMOVED Requirements

### Requirement: 全局命名空间脚本加载
**Reason**: 迁移至 ES Modules 后全局挂载（window.MoonConfig 等）不再需要。
**Migration**: 所有引用点改为 import；确保无遗漏引用（构建期即可发现）。
