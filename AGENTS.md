# AGENTS.md

本文件是本仓库的协作与维护指南，适用于整个仓库。后续由 Codex、其他 AI 代理或人工维护者修改本项目时，应优先遵守本文规则；若某个子目录将来需要更细的约束，可在该子目录新增局部 `AGENTS.md`。

## 项目定位

本仓库是一个基于 MkDocs + Material for MkDocs 构建的实验室技术知识库，用于集中存储、维护和分享技术教程、实验经验、系统配置、软件开发、AI 深度学习、实验技能和硬件相关知识。

维护目标是让知识内容清晰、可检索、可下载、可持续迭代，并保证本地预览和 GitHub Pages 部署结果尽量一致。

## 目录职责

- `docs/`：公开知识文章目录。放入这里的 Markdown 文件会参与站点构建，并可能被复制到下载源文件目录。
- `mkdocs.yml`：MkDocs 核心配置，负责站点信息、主题、插件、Markdown 扩展和导航结构。
- `overrides/`：Material 主题自定义层，包括模板、样式和交互脚本。
- `hooks/`：MkDocs 构建钩子，目前用于复制 Markdown 源文件以支持文档下载。
- `.github/workflows/`：GitHub Actions 自动构建和部署配置。
- `environment.yml`：本地 Conda 环境和固定依赖版本。
- `README.md`、`README-部署说明.md`、`开发描述_需求.md`：项目说明、部署教程、开发需求和版本记录。
- `Temp_Examples/`：临时示例或预览参考，不应作为正式站点内容来源。

## 内容维护规范

新增或修改知识文章时，优先保持现有中文教程式写作风格：说明问题背景，给出可执行步骤，并补充必要的验证方法和注意事项。

普通知识文章建议包含以下结构：

```markdown
# 文档标题

## 摘要

简要说明本文档解决什么问题、适用什么场景。

## 关键词

关键词1, 关键词2, 关键词3

## 正文

### 具体小节

内容...

## 参考文档

- [参考链接](https://example.com)

---

*更新日期: YYYY-MM-DD*
```

命令、配置片段和代码示例必须使用 fenced code block，并尽量标注语言类型，例如 `bash`、`yaml`、`markdown`。涉及危险操作、权限变更、磁盘格式化、服务重启等内容时，应明确写出风险和回滚方法。

## 导航与链接规范

新增、移动、重命名或删除 `docs/` 下的页面时，必须同步检查并更新：

- `mkdocs.yml` 的 `nav`。
- `docs/index.md` 的首页入口。
- 对应分类目录下的 `index.md`。
- `docs/appendix/index.md` 等索引页。
- 其他文档中的相对链接引用。

大规模移动文件时优先使用 `git mv`，以保留 Git 历史。修改链接时使用相对路径，并在本地预览或构建后检查是否出现 404、未进入导航的公开页面或失效引用。

## 公开边界与下载行为

当前 `hooks/copy_sources.py` 会在构建后把 `docs/` 下所有 `.md` 文件复制到 `site/_sources/`，用于支持“下载当前文档”功能。因此：

- 不要把草稿、内部备忘、临时说明、未清理内容放入 `docs/`。
- 不要在 `docs/` 中保存密码、Token、API key、内网 IP、个人隐私或未经确认可公开的实验室内部信息。
- 维护类文件如果不打算公开，应优先放在仓库根目录或其他非 `docs/` 目录。
- 如果必须在公开文档中展示敏感配置示例，应使用占位符，例如 `<YOUR_API_KEY>`、`<SERVER_HOST>`、`<USERNAME>`。

## 草稿与知识整理 Skill

当用户要求把零散技术材料、聊天记录、网页、PDF、笔记或故障排查过程整理为知识库文章时，优先使用 `organize-tech-knowledge-doc` skill。该 skill 的来源仓库为 `https://github.com/Procat18cn/skills`，路径为 `skills/organize-tech-knowledge-doc`。

使用该 skill 生成的初稿默认先放入根目录 `drafts/`，不要直接写入 `docs/`。进入 `docs/` 前必须完成事实核查、公开性审查、格式整理和导航同步。

`drafts/` 不是私密区：如果仓库是公开仓库，提交到 `drafts/` 的内容同样可以被外部看到。敏感原始材料、内部配置、未经清理的聊天记录、密钥、内网地址和个人信息不得提交到仓库。

草稿转为正式知识文章前，应确保：

- 文章结构符合本库规范：标题、摘要、关键词、结构化正文、参考文档和更新日期。
- 外部资料来源真实、可信，优先使用官方文档或可靠社区资料，不编造链接。
- 系统级操作包含风险说明、验证方法和回滚步骤。
- 目标页面移动到 `docs/` 后，同步更新 `mkdocs.yml`、首页入口、分类索引和必要的附录索引。

## 前端定制规范

前端自定义主要集中在 `overrides/main.html`、`overrides/extra.css` 和 `overrides/extra.js`。修改这些文件时，要保持现有核心交互：

- 顶栏包含侧栏开关、居中搜索框、文档下载按钮和深浅色模式切换。
- 左侧导航支持多级折叠、当前页面高亮和手动隐藏/展开。
- 搜索框支持聚焦激活、点击外部关闭和 `Escape` 关闭。
- 明亮/深色模式下按钮、搜索框、导航文字都应保持可见和可读。
- 移动端或窄屏布局不能遮挡正文、导航、搜索结果或工具按钮。

优先做小范围、可验证的修改。避免无必要地重写 Material 主题默认结构；如确实需要覆盖默认行为，应在相关 CSS/JS 附近保留简短注释说明原因。

## 构建与验证

本地执行 MkDocs 相关命令时，应优先使用 Conda 环境 `mydocs`。该环境由 `environment.yml` 管理，用于在本机复现 MkDocs 及主题插件版本。

纯文本编辑或只读检查不强制激活 `mydocs`；但运行 `mkdocs serve`、`mkdocs build`、验证主题样式、搜索、导航、下载按钮或插件行为时，应先执行 `conda activate mydocs`。

GitHub Pages 自动部署不依赖本地 Conda 环境。线上部署由 `.github/workflows/deploy.yml` 在 GitHub Actions runner 中配置 Python 3.11，并通过 `pip` 安装固定版本依赖后执行部署。

本地与线上应保持依赖版本一致：`environment.yml` 和 `.github/workflows/deploy.yml` 中的 MkDocs、Material 主题和插件版本需要同步维护，避免本地预览与线上构建结果不一致。

常用命令：

```bash
conda activate mydocs
mkdocs serve
mkdocs build --strict
conda env create -f environment.yml
conda env update -f environment.yml --prune
```

修改文档内容后，至少检查页面渲染、导航位置、内部链接和搜索结果。修改 `mkdocs.yml`、`hooks/`、`overrides/` 或部署配置后，应运行 `mkdocs build --strict`；涉及界面交互时，还应本地预览并手动检查搜索、侧栏折叠、深浅色切换、下载按钮和移动端布局。

如果 `mydocs` 不存在、`mkdocs` 不可用，或实际依赖版本与 `environment.yml` 不一致，应停止相关 MkDocs 验证并向用户反馈，建议其创建、更新或修复环境。不要因为本地环境未激活或异常就随意修改依赖版本、部署流程，或改用未确认版本完成验证。若最终无法完成构建验证，应在回复中明确说明原因。

## 安全规范

禁止提交以下内容：

- 密码、Token、API key、SSH 私钥、Cookie、会话信息。
- 内网服务器地址、实验室未公开资产信息或个人隐私。
- 未确认授权的第三方大段内容、截图或资料。
- 构建产物、缓存文件或本地临时文件。

示例中的敏感值统一替换为占位符。涉及权限、账户、NAS、远程登录、凭据文件等主题时，优先提醒读者使用最小权限和安全文件权限，例如凭据文件设置为 `600`。

## Git 与协作

提交前检查：

```bash
git status --short
```

不要提交 `site/`、`__pycache__/` 等生成物或缓存文件。当前 `.gitignore` 已忽略 `site/`、`nul` 和 Python 缓存，如新增工具产生其他构建目录，应同步评估是否需要忽略。

提交信息应简洁说明目的，可沿用现有中文风格，例如：

- `新增: Ubuntu网络配置文档`
- `更新: 维护指南 - 补充导航规则`
- `修复: 搜索框点击外部关闭行为`
- `ci/docs: 固定MkDocs依赖版本`

修改 `开发描述_需求.md` 时，应保留其按日期和版本记录的形式。完成某个需求后，在对应条目中更新完成状态，并补充开发或维护日志。
