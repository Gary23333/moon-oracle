# Moon Oracle 前端 Bug 彻底修复计划

## 1. 背景与结论

用户反馈「前端存在巨大 bug」。经全量静态排查 + Vite dev server 实测（浏览器自动化，六页逐一验证），**实测确认 3 个重大 bug + 5 个次要 bug + 2 个功能缺口**。构建（`npm run build`）本身通过，问题全在运行时逻辑。

### 实测确认的重大 Bug（浏览器实证）

| # | 现象 | 根因 | 证据 |
|---|------|------|------|
| B1 | **转盘功能完全不可用**：点击任何预设转盘，页面无反应，控制台抛 `IndexSizeError: The radius provided (-30) is negative` | [app.js](file:///workspace/js/wheel/app.js#L153-L176) `startWheel()` 在 `viewWheel` 仍为 `display:none` 时就 `new WheelRenderer(canvas)`；[wheel-renderer.js](file:///workspace/js/wheel/wheel-renderer.js#L26-L34) `resize()` 用 `parentElement.clientWidth - 40` 计算，隐藏时 clientWidth=0 → size=-40 → radius=-40 → `ctx.arc` 负半径抛异常，中断后续 `showView('wheel')` | 实测：点击后 `wheelCanvas` 停在默认 300×150，`#viewWheel.active=false` |
| B2 | **转盘结果与指针指向错位 90°**：结果文本永远不是指针停下的选项 | [wheel-renderer.js](file:///workspace/js/wheel/wheel-renderer.js#L186-L205) `getResult()` 中 `pointerAngle = (2π - rotation) % 2π` 按指针在 3 点钟方向（角度 0）计算，但指针实际画在 12 点钟方向（角度 3π/2） | 实测：`options=['A','B'], weights=[1,1], rotation=0` 时指针指向 B，`getResult()` 返回 A |
| B3 | **每日塔罗 streak 永远错误**：连续打卡数最多显示 2，历史最高也一样 | [daily/app.js](file:///workspace/js/daily/app.js#L33-L78) `loadDailyData()` 只把 `data.lastDrawDate` 传给 `updateStreak()`，从不恢复已保存的 `data.streak`/`data.maxStreak`；每天加载时都从默认值 1 重新算 | 实测：注入 `streak:5, maxStreak:9, lastDrawDate=昨天`，重载后显示 2 和 2（预期 6 和 9） |

### 静态确认的次要 Bug

| # | 问题 | 位置 |
|---|------|------|
| B4 | 塔罗占卜结果未存入历史（spec Task 5.1 明确要求，history 详情页 `renderTarotDetail` 已实现对应读取，但写入端缺失） | [app.js](file:///workspace/js/tarot/app.js) 全文无 `MoonHistory` 引用 |
| B5a | 历史详情-快占：Yes/No 结果显示英文原始值 `yes/no/maybe`（应显示 `resultText` 是/否/待定）；答案之书类型无 `result`/`comment` 字段，「结果」「简评」两区块空白 | [app.js](file:///workspace/js/history/app.js#L350-L370) |
| B5b | 历史详情-每日塔罗：`data.quote` 不存在（入库时未存语录），「塔罗语录」区块空白；且该区块无条件渲染 | [app.js](file:///workspace/js/history/app.js#L372-L409)、[app.js](file:///workspace/js/daily/app.js#L169-L178) |
| B5c | 分享卡片用 `MoonUtils.sanitize(record.summary)` 处理 canvas 文本，summary 含 `&<>"` 时会显示转义符（canvas 无 XSS 风险，sanitize 多余） | [app.js](file:///workspace/js/history/app.js#L561) |
| B6 | 自定义转盘输入正则允许小数权重 `(\d+(?:\.\d+)?)`，但 `_validateWeights` 要求 `Number.isInteger`，`火锅:1.5` 被解析后被拒，提示自相矛盾 | [app.js](file:///workspace/js/wheel/app.js#L29-L47)、[app.js](file:///workspace/js/wheel/app.js#L426) |
| B7 | 快占页 AI 增强 checkbox 仅在加载时已有 API Key 才绑定 change 监听（`MoonConfig.current.apiKey && ...addEventListener`），逻辑错误且该监听本就无必要 | [app.js](file:///workspace/js/quick/app.js#L38) |

### 功能缺口（用户确认要补）

| # | 缺口 | 说明 |
|---|------|------|
| F1 | 塔罗占卜结果自动入历史 | 同 B4 |
| F2 | 配置面板仅首页有；README 宣称「任意页面右上角 ⚙️ 可配置」，塔罗/转盘/每日/快占/历史页均无 | 需抽取共享配置面板接入全部 6 页 |

---

## 2. 修复方案（逐项）

### B1+B2+B6：转盘模块（`js/wheel/`）

**B1 崩溃 — 双保险修复：**
1. [app.js](file:///workspace/js/wheel/app.js#L153-L176) `startWheel()`：调整时序，先 `showView('wheel')` 使视图可见，再取 canvas `new WheelRenderer(...)`，最后重置 resultArea/spinBtn。
2. [wheel-renderer.js](file:///workspace/js/wheel/wheel-renderer.js#L26-L34) `resize()` 兜底：`const w = this.canvas.parentElement?.clientWidth || 0; const size = w > 40 ? Math.min(w - 40, 400) : 400;`，杜绝负尺寸。

**B2 结果偏移 — 修正指针角度公式**（[wheel-renderer.js](file:///workspace/js/wheel/wheel-renderer.js#L186-L205) `getResult()`）：
```js
// 指针在 12 点钟方向 = canvas 角度 3π/2
const pointerAngle = (((3 * Math.PI / 2 - normalizedRotation) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
```
验证基准：`['A','B'],[1,1],rotation=0` → 应返回 B；`rotation=π` → 应返回 A。

**B6 小数权重**：[app.js](file:///workspace/js/wheel/app.js#L29-L47) `_validateWeights` 移除 `Number.isInteger` 检查，错误文案改「权重值必须为正数」（渲染层 `_normalizeWeights` 已有 `Math.round` 取整，行为一致）。

### B3：每日塔罗 streak（[daily/app.js](file:///workspace/js/daily/app.js#L33-L78)）

`loadDailyData()` 解析存档后先恢复 `this.state.streak = data.streak || 1`、`this.state.maxStreak = data.maxStreak || 1`，再调 `updateStreak(data.lastDrawDate)`。`updateStreak` 三个分支保持：diffDays=0 不动；=1 则 streak+1 并更新 maxStreak；>1 重置 streak=1（maxStreak 保留历史最高）。

### B4/F1：塔罗结果入库（[tarot/app.js](file:///workspace/js/tarot/app.js)）

import `MoonHistory`；`showResult()` 中渲染成功后写入：
```js
const spread = getSpreadInfo(this.state.spreadType);
MoonHistory.addRecord('tarot', {
  question: this.state.question,
  spreadName: spread.name,
  spreadPositions: spread.positions,
  revealedCards: this.state.revealedCards.map(c => ({ id: c.id, name: c.name, orientation: c.orientation })),
  readingResult: this.state.readingResult
}, `${spread.name} · ${this.state.question.slice(0, 30)}`);
```
字段与 [history/app.js](file:///workspace/js/history/app.js#L296-L348) `renderTarotDetail` 读取端完全对齐；只存必要字段避免 localStorage 膨胀。

### B5：历史详情（[history/app.js](file:///workspace/js/history/app.js)、[daily/app.js](file:///workspace/js/daily/app.js)）

- B5a `renderQuickDetail`：按 `data.type` 分支——`answer_book` 显示 `data.quote`（含 icon）；oracle 显示 `data.resultText || data.result` + `data.card?.name`，简评 `data.comment`。
- B5b [daily/app.js](file:///workspace/js/daily/app.js#L169-L178) `saveToHistory` 增加 `quote: getQuoteByDate(this.state.today)`；[history/app.js](file:///workspace/js/history/app.js#L405-L408) 语录区块改为条件渲染（旧记录无 quote 时不显示该区块）。
- B5c 分享卡片 `drawShareCardContent` 直接使用 `record.summary`，去掉 `MoonUtils.sanitize`。

### B7：快占 AI 开关（[quick/app.js](file:///workspace/js/quick/app.js#L38)）

删除 `MoonConfig.current.apiKey && ...addEventListener` 条件绑定行（该 change 监听无实际作用，`handleOracle` 内已读 `checked` 并兜底 key）。`updateAIEnhanceVisibility` 保留 init 时调用，并在配置保存回调中刷新（见 F2）。

### F2：共享配置面板（全部 6 页）

- 新建 `js/common/config-panel.js`，导出 `initConfigPanel(options?: { onSave?: () => void })`：
  - 动态创建 ⚙️ toggle 按钮 + 面板 DOM 插入 `document.body`（markup 与 id 沿用 [index.html](file:///workspace/index.html#L121-L204) 现有面板：`cfgApiUrl/cfgApiKey/cfgModel/cfgThinkingToggle/cfgThinkingEffort/cfgShowThinkingToggle/cfgWheelAIToggle/cfgPersona/cfgPromptGreeting/cfgPromptReading/cfgPromptWheel/configSave/configReset`）；
  - 迁移 [js/index.js](file:///workspace/js/index.js) 的绑定逻辑（loadConfigUI / setupToggle / 保存 / 重置 / Escape 关闭）；保存成功后调用 `options.onSave?.()`；
  - 样式全部复用 [base.css](file:///workspace/css/base.css#L94-L164) 已有类，零新增 CSS。
- [index.html](file:///workspace/index.html) 删除静态 `configToggle`/`configPanel` markup；[js/index.js](file:///workspace/js/index.js) 改为 `initConfigPanel()`。
- 其余 5 页接入：`tarot/app.js`、`wheel/app.js`、`daily/app.js`、`history/app.js` init 中各加 import + `initConfigPanel()`；`quick/app.js` 加 `initConfigPanel({ onSave: () => this.updateAIEnhanceVisibility() })`（解决配置保存后 AI 增强入口不显隐的问题）。

### 文档

- [CHANGELOG.md](file:///workspace/CHANGELOG.md) 新增 **v3.0.1** 条目：汇总上述修复（转盘崩溃/结果偏移、streak 恢复、塔罗入库、历史详情、权重小数、配置面板全页面覆盖）。

---

## 3. To-Do List（执行顺序与子 Agent 分工）

> 按用户规则：计划确认后开启子 Agent 执行。A/B/C 无文件交集可**并行**；接入与回归由主 Agent 收尾。

- [ ] **T1（子 Agent A：`js/wheel/`）** B1 时序修复 + resize 兜底、B2 getResult 公式、B6 权重校验
- [ ] **T2（子 Agent B：daily/tarot/history）** B3 streak 恢复（含 saveToHistory 加 quote）、B4 塔罗入库、B5a/B5b/B5c 历史详情
- [ ] **T3（子 Agent C：配置面板抽取）** 新建 `js/common/config-panel.js`、改造 `js/index.js` + `index.html`、B7 quick/app.js L38 修复（quick 的面板接入也由 C 完成，因同文件）
- [ ] **T4（主 Agent）** 剩余 4 页接入配置面板（tarot/wheel/daily/history 各 app.js 加 2 行）
- [ ] **T5（主 Agent）** CHANGELOG v3.0.1
- [ ] **T6（主 Agent）** 回归验证：`npm run build` + 浏览器实测六页（重点：转盘点击→渲染→结果与指针一致断言、streak 注入回归、塔罗/快占/每日→历史入库与详情字段、各页配置面板可开可存、console 零错误）

---

## 4. 决策与假设

1. **权重支持小数**（与输入正则、README 一致），渲染层取整；而非限制只能整数。
2. **配置面板 DOM 动态创建**，而非在 5 个 HTML 复制 markup —— 单点维护，index.html 静态面板随之移除。
3. streak 语义保持现状：新用户/断签显示 1，maxStreak 永不清零。
4. 塔罗入库在解读成功渲染时触发；无 API Key 走不到该步，不产生脏数据。
5. 不改动任何视觉样式与文案风格；修复全部落在 JS 逻辑层（唯二 HTML 改动：index.html 移除静态面板）。
6. `js/daily.js` 占位入口为死代码（无任何 HTML 引用），顺手删除以免误导。

## 5. 验证方案

1. `npm run build` 通过，无构建错误。
2. 浏览器自动化回归（dev server）：
   - 六页加载 console 零 error；
   - wheel：点击预设 → 转盘渲染可见；`getResult` 注入断言 `rotation=0→B`、`rotation=π→A`；完整 spin 后结果文本与几何指针一致；`火锅:1.5` 自定义可启动；
   - daily：注入 `streak:5,maxStreak:9,lastDrawDate=昨天` → 显示 6/9；抽牌后入库记录含 quote；
   - tarot：无 Key toast 正常；（有 Key 流程无法本地验证，走代码审查）；
   - quick：快占/答案之书 → 历史详情字段完整（是/否/待定、quote）；
   - history：三类记录详情渲染正确，分享卡片生成不报错；
   - 配置面板：六页均可打开、保存、重置，quick 页保存后 AI 增强入口按 Key 显隐。
3. 测试产生的 localStorage 数据全部清理。
