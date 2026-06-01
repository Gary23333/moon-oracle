# 🤝 Contributing to Moon Oracle

感谢你对 **月影决策屋** 的兴趣！我们欢迎任何形式的贡献。

---

## 📋 目录

- [如何贡献](#如何贡献)
- [报告 Bug](#报告-bug)
- [功能建议](#功能建议)
- [提交代码](#提交代码)
- [代码规范](#代码规范)
- [提交信息规范](#提交信息规范)

---

## 如何贡献

### 报告 Bug

如果你发现了 Bug，请通过 [Bug Report](https://github.com/Gary23333/moon-oracle/issues/new?template=bug_report.md) 模板提交 Issue，并包含：

- 清晰的标题和描述
- 复现步骤
- 期望行为 vs 实际行为
- 浏览器版本和操作系统
- 截图（如果适用）

### 功能建议

有新想法？通过 [Feature Request](https://github.com/Gary23333/moon-oracle/issues/new?template=feature_request.md) 模板提交，请描述：

- 你希望添加的功能
- 使用场景
- 可能的实现方案（可选）

---

## 提交代码

### 1. Fork & Clone

```bash
# Fork 项目到你的 GitHub
# 然后克隆
git clone https://github.com/Gary23333/moon-oracle.git
cd moon-oracle
```

### 2. 创建分支

```bash
git checkout -b feature/你的功能名
# 或
git checkout -b fix/你的修复名
```

### 3. 开发 & 测试

- 用浏览器直接打开 `index.html` 进行测试
- 确保在 Chrome、Firefox、Safari 上均正常运行
- 移动端也需要测试（响应式）

### 4. 提交 PR

```bash
git add .
git commit -m "feat: 添加xxx功能"
git push origin feature/你的功能名
```

然后在 GitHub 上创建 Pull Request。

---

## 代码规范

### JavaScript

- 使用 Vanilla JavaScript，不引入任何框架
- 使用 `const` / `let`，禁止 `var`
- 函数和变量使用驼峰命名 (`camelCase`)
- 对象使用大驼峰 (`MoonConfig`, `TarotApp`)
- 使用单引号字符串
- 每个模块使用 IIFE 或对象字面量封装
- 添加必要的注释说明逻辑

### CSS

- 使用 CSS 变量（定义在 `base.css`）
- BEM 命名风格（可选，当前项目未严格使用）
- 响应式断点：`768px`
- 遵循现有的紫色/金色主题配色

### HTML

- 语义化标签
- 中文内容使用 `lang="zh-CN"`
- 保持无障碍属性 (`aria-*`, `role`)

---

## 提交信息规范

使用语义化提交信息：

| 前缀 | 说明 |
|:---|:---|
| `feat:` | 新功能 |
| `fix:` | Bug 修复 |
| `docs:` | 文档更新 |
| `style:` | 代码格式（不影响逻辑） |
| `refactor:` | 重构 |
| `perf:` | 性能优化 |
| `test:` | 测试相关 |
| `chore:` | 构建/工具 |

示例：
```
feat: 添加OCR截图识别转盘功能
fix: 修复移动端转盘触摸事件冲突
docs: 更新API文档
```

---

## 🙏 致谢

感谢每一位贡献者！你们的帮助让月影决策屋变得更好。

---

<div align="center">

✦ 让命运为你指引方向 ✦

</div>
