# 智能汇率兑换工具

这是一个基于纯 HTML、CSS 和 JavaScript 实现的智能汇率兑换工具。它提供了实时汇率查询、历史走势分析以及多币种兑换功能，并采用了现代化的暗色玻璃拟物化设计。

## ✨ 功能特性

- **实时汇率查询**: 通过 Frankfurter API 获取最新的货币汇率。
- **历史走势分析**: 显示过去30天的汇率走势图，帮助用户了解趋势。
- **多币种支持**: 支持多种主流货币之间的兑换。
- **现代化UI设计**: 
  - 🎨 精美的玻璃拟物化设计（Glassmorphism）
  - 🌙 优雅的暗色主题配色
  - ✨ 丰富的动画效果和微交互
  - 📱 完全响应式设计，支持各种设备
  - 🎯 优秀的可访问性和用户体验
- **视觉增强**: 
  - 渐变背景和阴影效果
  - 流畅的过渡动画
  - 交互式按钮效果
  - 优化的图表样式

## 🚀 技术栈

- **HTML5**: 页面结构。
- **CSS3**: 样式设计，包括玻璃拟物化效果和响应式布局。
- **JavaScript (ES6+)**: 核心逻辑，包括 API 调用、数据处理和 DOM 操作。
- **Chart.js**: 用于绘制历史汇率走势图。
- **Font Awesome**: 提供图标支持。
- **Google Fonts**: 引入 Inter 和 JetBrains Mono 字体，提升视觉效果。
- **Frankfurter API**: 免费的汇率数据 API。

## 📦 如何使用

1. **克隆仓库** (如果适用，对于纯HTML项目，可以直接下载 `index.html` 文件):
   ```bash
   git clone <仓库地址>
   cd <项目目录>
   ```

2. **打开 `index.html`**: 
   直接在任何现代浏览器中打开 `index.html` 文件即可使用。
   ```bash
   # 例如 (Windows)
   start index.html
   # 例如 (macOS/Linux)
   open index.html
   ```

## 部署

本项目已部署到 EdgeOne Pages，您可以通过以下临时链接访问：

[https://mcp.edgeone.site/share/xdVET9CubTtV4VwdQYl9F](https://mcp.edgeone.site/share/xdVET9CubTtV4VwdQYl9F)

请注意，这是一个临时 URL。如需永久访问，请在 EdgeOne 控制台中绑定自定义域名。

### 其他免费部署选项

由于本项目是纯静态 HTML 页面，您可以轻松将其部署到各种免费的静态网站托管服务上，例如：

#### Cloudflare Pages

1. 将您的项目代码推送到 GitHub、GitLab 或 Bitbucket 仓库。
2. 登录 Cloudflare 仪表板，选择您的账户，然后导航到 Pages。
3. 点击“创建项目”，选择“连接到 Git 提供商”，并授权 Cloudflare 访问您的仓库。
4. 选择您的项目仓库，然后配置构建设置（通常对于纯 HTML 项目，默认设置即可，或者将“构建命令”留空，“输出目录”设置为 `.`）。
5. 点击“部署站点”。

#### GitHub Pages

1. 将您的项目代码推送到 GitHub 仓库。
2. 在您的 GitHub 仓库中，导航到“Settings”（设置）选项卡。
3. 在左侧菜单中选择“Pages”。
4. 在“Source”（来源）部分，选择您希望部署的分支（通常是 `main` 或 `master`），然后点击“Save”（保存）。
5. GitHub Pages 将自动部署您的站点，并在几分钟内提供一个 URL（通常是 `https://<your-username>.github.io/<your-repository-name>/`）。

## 🤝 贡献

欢迎任何形式的贡献！如果您有任何建议或发现 Bug，请随时提交 Issue 或 Pull Request。

## 📄 许可证

本项目采用 MIT 许可证。详情请参阅 `LICENSE` 文件 (如果存在)。
