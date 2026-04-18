# 实验室知识库

实验室综合技术知识库，涵盖系统配置、软件开发、AI深度学习、实验技能等。

---

## 目录结构

```
实验室知识库/
├── docs/                      # 知识文档内容
│   ├── index.md              # 首页
│   ├── environments/         # 实验环境与系统
│   │   ├── index.md
│   │   └── ubuntu/          # Ubuntu相关内容
│   │       ├── system-basics.md
│   │       ├── user-permissions.md
│   │       ├── software-management.md
│   │       └── filesystem-storage.md
│   ├── development/          # 软件开发与工具
│   ├── ai-deep-learning/     # AI与深度学习
│   ├── lab-skills/           # 实验技能与方法
│   ├── hardware/             # 实验系统与硬件
│   └── appendix/             # 附录
│       ├── command-cheatsheet.md
│       └── index.md
├── overrides/                # MkDocs主题自定义
│   ├── main.html            # 无顶栏主模板
│   ├── extra.css            # 自定义样式
│   ├── extra.js             # 交互脚本
│   └── partials/            # 模板部件
│       ├── logo.html
│       └── lab-nav.html     # 可折叠导航
├── mkdocs.yml               # MkDocs配置文件
└── README.md                # 本文件
```

---

## 快速开始

### 安装依赖

```bash
pip install mkdocs-material
```

### 本地预览

```bash
cd 实验室知识库
mkdocs serve
```

访问 http://127.0.0.1:8000

### 构建站点

```bash
mkdocs build
```

### 部署到GitHub Pages

```bash
mkdocs gh-deploy
```

---

## 文档规范

每篇文档包含：
- **标题**
- **摘要** - 简要描述内容
- **关键词** - 便于搜索
- **详细正文** - 结构化内容
- **参考文档** - 相关链接
- **更新日期**

---

## 界面特点

- **无顶栏设计**：标题、搜索、导航全部在左侧
- **可折叠目录**：点击箭头展开/收起子目录
- **全文搜索**：支持中文搜索
- **深色/浅色模式**：自动适配

---

## 更新记录

| 日期 | 更新内容 |
|------|---------|
| 2026-04-17 | 初始整理，完成Ubuntu知识文档 |

---

*实验室知识库 - 持续更新中*
