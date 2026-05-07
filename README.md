# 实验室知识库

[Repository](https://github.com/Procat18cn/labwiki) \ [Page](https://procat18cn.github.io/labwiki/)

实验室综合技术知识库，采用 MkDocs + Material 主题构建，涵盖系统配置、软件开发、AI深度学习、实验技能等领域的实用技术文档。

---

## 项目概览

| 项目属性 | 说明 |
|----------|------|
| **构建工具** | MkDocs 1.6.1 + Material 9.7.6 |
| **部署平台** | GitHub Pages |
| **自动化** | GitHub Actions 自动构建部署 |
| **环境管理** | Conda (`mydocs` 环境) |
| **当前版本** | 2026-04-28 (v1) |

---

## 功能特性

### 核心功能

- **全文搜索** - 支持中文搜索，实时显示结果
- **可折叠导航** - 多级目录支持展开/收起
- **主题切换** - 深色/浅色模式一键切换
- **文档下载** - 每篇文档支持下载原始 Markdown 文件
- **响应式布局** - 适配桌面、平板、手机访问

### 界面特点

- **顶栏设计** - 包含居中搜索框、主题切换、侧栏开关、文档下载按钮
- **左侧边栏** - 可折叠的多级导航目录，支持手动隐藏/展开
- **右侧目录** - 当前文档的章节导航
- **现代化风格** - 简洁的科研/AI风格设计

---

## 项目结构

```
labwiki/
├── docs/                          # 知识文档内容
│   ├── index.md                   # 首页
│   ├── 维护指南.md                 # 本文档的维护指南
│   ├── environments/              # 实验环境与系统
│   │   ├── index.md
│   │   ├── ubuntu/                # Ubuntu相关文档
│   │   │   ├── system-basics.md
│   │   │   ├── user-permissions.md
│   │   │   ├── software-management.md
│   │   │   └── filesystem-storage.md
│   │   └── windows/               # Windows相关文档
│   ├── development/               # 软件开发与工具
│   │   ├── index.md
│   │   ├── coding-tips.md
│   │   ├── version-control.md
│   │   └── dev-environment/      # 开发环境专题
│   │       └── 修改Cursor插件市场.md
│   ├── ai-deep-learning/          # AI与深度学习
│   ├── lab-skills/                # 实验技能与方法
│   ├── hardware/                  # 实验系统与硬件
│   └── appendix/                  # 附录（速查表、索引）
│       ├── index.md
│       └── command-cheatsheet.md
├── overrides/                     # 主题自定义
│   ├── main.html                  # 主模板（顶栏布局）
│   ├── extra.css                  # 自定义样式
│   ├── extra.js                   # 交互脚本（导航折叠、搜索增强）
│   └── partials/
│       ├── logo.html              # Logo组件
│       └── lab-nav.html           # 可折叠导航组件
├── hooks/                         # MkDocs构建钩子
│   └── copy_sources.py            # 自动复制.md源文件到_site
├── .github/workflows/             # GitHub Actions配置
│   └── deploy.yml                 # 自动部署工作流
├── mkdocs.yml                     # MkDocs核心配置
├── environment.yml                # Conda环境配置
├── README.md                      # 本文件
├── README-部署说明.md              # 详细部署教程
└── 开发描述_需求.md                # 开发需求与版本记录
```

---

## 快速开始

### 环境准备

```bash
# 克隆仓库
git clone https://github.com/你的用户名/labwiki.git
cd labwiki

# 创建conda环境（首次）
conda env create -f environment.yml

# 激活环境
conda activate mydocs
```

### 本地预览

```bash
# 启动开发服务器
mkdocs serve

# 浏览器访问 http://127.0.0.1:8000
```

> 提示：Markdown 内容修改通常会自动刷新；若修改 `extra.css`、`extra.js`、`mkdocs.yml` 或 `overrides/` 后浏览器仍显示旧样式/旧结构，请重启 `mkdocs serve` 并使用 `Ctrl+Shift+R` 强制刷新页面。

### 构建站点

```bash
mkdocs build
```

构建产物位于 `site/` 目录。

---

## 部署到 GitHub Pages

### 自动部署（推荐）

项目已配置 GitHub Actions，推送代码后自动部署：

```bash
# 提交修改
git add .
git commit -m "更新文档"
git push origin main

# 等待 Actions 完成（约1-2分钟）
# 访问 https://你的用户名.github.io/labwiki/
```

### 手动部署

```bash
mkdocs gh-deploy
```

详细部署说明请参考 [README-部署说明.md](README-部署说明.md)。

---

## 内容维护

### 添加新文档

1. 在 `docs/` 下对应目录创建 `.md` 文件
2. 编辑 `mkdocs.yml` 添加导航项
3. 本地预览验证 (`mkdocs serve`)
4. 提交并推送

详细维护指南请参考 [维护指南](docs/维护指南.md)。

### 文档规范

每篇文档建议包含：
- **标题** - 一级标题 (#)
- **摘要** - 简要描述内容
- **关键词** - 便于搜索检索
- **正文** - 结构化内容（二级/三级标题）
- **参考文档** - 相关链接
- **更新日期** - 最后更新时间

---

## 版本历史

| 日期 | 主要更新 |
|------|----------|
| 2026-04-28 (v1) | 实施改进方案1：统一 GitHub Actions 与本地 `mydocs` 环境依赖版本，固定安装 `mkdocs`、`mkdocs-material`、`mkdocs-minify-plugin`、`pymdown-extensions`，提升构建可复现性 |
| 2026-04-21 (v2) | 新增“实际改进方案清单”，补充风险说明、优先级和后续治理建议，便于版本对照和档案管理 |
| 2026-04-21 (v1) | 修复搜索框激活后点击页面空白/无关位置无法退出的问题，优化搜索框关闭交互 |
| 2026-04-18 (v5) | 修复搜索框居中、调色板按钮可见性、点击外部关闭搜索 |
| 2026-04-18 (v4) | 合并双搜索框、添加调色板切换、添加文档下载功能 |
| 2026-04-18 (v3) | 全宽布局、侧栏可隐藏、可折叠导航、顶栏设计 |
| 2026-04-18 (v2) | 修复搜索功能、优化导航样式 |
| 2026-04-18 (v1) | 添加搜索功能，细化GitHub Pages部署介绍/流程 |
| 2026-04-17 (v1) | 初始版本，基础框架搭建 |

完整版本记录见 [开发描述_需求.md](开发描述_需求.md)。

---

## 技术栈

- **静态站点生成**: [MkDocs](https://www.mkdocs.org/)
- **主题**: [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)
- **图标**: [Material Design Icons](https://materialdesignicons.com/)
- **CI/CD**: GitHub Actions
- **托管**: GitHub Pages

---

## 相关文档

- [部署说明](README-部署说明.md) - 详细的本地开发和线上部署教程
- [维护指南](docs/维护指南.md) - 内容更新、文档维护操作指南
- [开发描述_需求.md](开发描述_需求.md) - 开发需求与版本迭代记录

---

*实验室知识库 - 持续更新中*
