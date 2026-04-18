# 实验室知识库 - 部署说明

## 项目结构

```
.
├── docs/                          # 文档内容目录
│   ├── index.md                   # 首页
│   ├── environments/              # 实验环境与系统
│   │   ├── index.md
│   │   ├── ubuntu/               # Ubuntu相关内容
│   │   └── windows/              # Windows相关内容
│   ├── development/              # 软件开发与工具
│   ├── ai-deep-learning/         # AI与深度学习
│   ├── lab-skills/               # 实验技能与方法
│   ├── hardware/                 # 实验系统与硬件
│   └── appendix/                 # 附录
├── overrides/                     # 主题自定义
│   ├── main.html                 # 主模板（无顶栏布局）
│   ├── extra.css                 # 自定义样式
│   └── partials/
│       └── logo.html             # Logo图标
├── mkdocs.yml                     # MkDocs配置文件
└── README.md                      # 项目说明
```

## 环境要求

- Python 3.7+
- pip

## 安装步骤

### 1. 安装MkDocs和Material主题

```bash
pip install mkdocs-material
```

### 2. 本地预览

```bash
# 进入项目目录
cd "Ubuntu记录_环境_配置_软件_技巧_教程"

# 启动本地服务器
mkdocs serve

# 访问 http://127.0.0.1:8000
```

### 3. 构建静态站点

```bash
mkdocs build
```

构建后的文件在 `site/` 目录中。

## 部署到GitHub Pages

### 方法一：使用mkdocs命令（推荐）

```bash
# 确保已配置repo_url
mkdocs gh-deploy
```

### 方法二：GitHub Actions自动部署

创建 `.github/workflows/ci.yml`：

```yaml
name: ci
on:
  push:
    branches:
      - main
permissions:
  contents: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v4
        with:
          python-version: 3.x
      - run: pip install mkdocs-material
      - run: mkdocs gh-deploy --force
```

## 自定义配置

### 修改知识库标题

编辑 `mkdocs.yml`：

```yaml
site_name: 你的新标题
```

### 修改导航结构

编辑 `mkdocs.yml` 中的 `nav` 部分：

```yaml
nav:
  - 首页: index.md
  - 新分类:
    - 概述: new-category/index.md
    - 子页面: new-category/page.md
```

### 添加新文档

1. 在 `docs/` 下创建Markdown文件
2. 在 `mkdocs.yml` 的 `nav` 中添加导航项
3. 重新运行 `mkdocs serve` 查看效果

## 界面特点

- **无顶栏设计**：标题、搜索、导航全部在左侧
- **左侧布局**：
  - 顶部：知识库标题「实验室知识库」（可修改）
  - 中部：搜索框
  - 底部：导航树
- **右侧**：当前文章的目录大纲

## 功能特性

- ✅ 全文搜索（中文支持）
- ✅ 深色/浅色模式切换
- ✅ 代码块复制按钮
- ✅ 响应式设计（移动端适配）
- ✅ 打印友好

## 文档编写规范

### 标准格式

```markdown
# 文档标题

---

## 摘要

简要描述本文档内容。

---

## 关键词

`关键词1`, `关键词2`, `关键词3`

---

## 一、章节标题

### 1.1 小节标题

内容...

```bash
代码示例
```

## 二、另一章节

...

---

## 参考文档

- [链接1](url)
- [链接2](url)

---

*最后更新：YYYY-MM-DD*
```

### 支持的Markdown扩展

- 提示框：`!!! note`, `!!! warning`, `!!! tip`
- 折叠详情：`??? note`
- 标签页：`=== "标签1"`
- 任务列表：`- [ ] 任务`

## 团队协作

1. Fork或Clone仓库
2. 在对应分类下添加/修改文档
3. 提交Pull Request或Push到主分支
4. GitHub Actions自动部署

## 常见问题

### Q: 搜索不工作？

A: 确保已安装搜索插件，且文档已构建：
```bash
pip install mkdocs-material
mkdocs build
```

### Q: 如何修改主题颜色？

A: 编辑 `mkdocs.yml` 中的 `palette` 部分。

### Q: 如何添加评论功能？

A: Material主题支持多种评论系统（如Giscus），在 `extra` 中配置即可。

---

*配置完成时间：2026-04-17*
