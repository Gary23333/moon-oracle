# Checklist

## 工程化
- [x] `npm install && npm run dev` 可启动，index / tarot / wheel / daily / quick / history 六页均可访问
- [x] `npm run build` 成功，dist 为纯静态产物，无 404 资源引用
- [x] 源码无 window.MoonConfig / MoonUtils / MoonEffects 等全局挂载残留，全部 ES Module 化
- [x] Tesseract.js 通过 npm 依赖引入，OCR 功能在构建产物中可用

## BUG 修复
- [x] 转盘非法权重（NaN/负数/数量不匹配）被拦截并给出明确提示
- [x] OCR 各类失败（网络/图片加载/无文字/超大图片）均有具体错误提示
- [x] API 层：超时正确清理、连续请求取消正常、HTTP 错误码分类提示
- [x] soundEnabled 有真实音效实现，或字段与 UI 已移除（已移除）
- [x] 塔罗空选牌有拦截提示；抽牌确认已洗牌；追问历史有长度上限
- [x] 全部 innerHTML 使用点审计通过，用户输入先转义再渲染
- [x] 各页面 JS 绑定的 DOM ID 全部存在或有判空保护，控制台无运行时错误
- [x] 长选项文本在转盘中不溢出；极端权重渲染正确

## 新功能
- [x] 每日塔罗：当日结果固定、0 点重置、streak 连续计数、断签重置为 1、每日语录展示
- [x] Yes/No 快占：无 API Key 时本地给出 是/否/待定 + 简评不报错；答案之书返回启示语录
- [x] 占卜历史：塔罗/快占/每日塔罗自动入库，上限 50 条 LRU 淘汰；支持详情/单删/清空
- [x] 分享卡片：Canvas 生成含牌面/结果/日期的卡片并可下载 PNG
- [x] 解牌人格：三种人格可选并持久化，注入塔罗与快占 AI 提示词，自定义提示词优先

## 首页与文档
- [x] 首页五入口功能矩阵，移动端单列响应式正常
- [x] README / CHANGELOG / api-docs 更新至 v3.0.0，Quick Start 为 Vite 流程
- [x] .gitignore 包含 node_modules 与 dist

## 发布
- [x] git commit 信息符合仓库 conventional commits 风格
- [ ] 成功 push 到 origin（github.com/Gary23333/moon-oracle）—— 因 GitHub 凭证未配置暂未成功，需用户手动执行
