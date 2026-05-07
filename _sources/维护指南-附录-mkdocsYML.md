# 知识库维护指南-附录：

# MkDocs.yml 配置文件详解

## 摘要

本文档详细说明 MkDocs 知识库项目中 mkdocs.yml 核心配置文件的作用、结构和修改方法，帮助开发者理解如何通过该文件控制站点外观、功能和内容组织。

## 关键词

MkDocs, 配置文件, mkdocs.yml, 站点配置, 主题设置, 导航结构

## 正文

### 一、mkdocs.yml 的核心作用

`mkdocs.yml` 是整个 MkDocs 知识库项目的**核心配置文件**，它决定了站点的结构、外观、功能和内容组织。可以将其理解为站点的"大脑"，所有关键配置都集中在此文件中。

### 二、配置文件结构详解

#### 2.1 站点基本信息

```yaml
site_name: 实验室知识库
site_description: 实验室综合技术知识库，涵盖系统配置、软件开发、AI深度学习、实验技能等
site_author: 实验室团队
```

**作用**：
- `site_name`：决定浏览器标签页标题
- `site_description`：搜索引擎显示的站点描述
- `site_author`：站点作者信息

#### 2.2 主题和外观配置

```yaml
theme:
  name: material
  custom_dir: overrides        # 自定义模板目录
  palette:                     # 颜色方案（浅色/深色切换）
    - scheme: default
      primary: indigo
      accent: indigo
    - scheme: slate
      primary: indigo
      accent: indigo
  font:                        # 字体设置
    text: Roboto
    code: Roboto Mono
  features:                    # 功能特性
    - navigation.expand
    - content.code.copy
    - search.suggest
```

**作用**：
- 使用 Material for MkDocs 主题
- 自定义目录 `overrides`：覆盖默认模板（如无顶栏设计）
- 颜色主题：支持浅色/深色模式切换
- 功能开关：代码复制、搜索建议、导航展开等

#### 2.3 插件系统

```yaml
plugins:
  - search:
      lang: zh                 # 中文搜索
  - minify:                    # HTML 压缩
```

**作用**：
- 增强站点功能（搜索、压缩、SEO 等）
- `search` 插件支持中文搜索
- `minify` 插件优化生成的 HTML 文件

#### 2.4 Markdown 扩展功能

```yaml
markdown_extensions:
  - admonition                 # 提示框（注意、警告等）
  - pymdownx.details           # 折叠详情
  - pymdownx.superfences       # 代码块高亮
  - pymdownx.tabbed            # 标签页
  - tables                     # 表格支持
  - toc:                       # 目录
      permalink: true
      toc_depth: 3
```

**作用**：
- 让 Markdown 支持更丰富的语法
- 代码高亮、折叠详情、标签页等高级功能
- 自动生成文档目录

#### 2.5 页脚配置

```yaml
copyright: Copyright &copy; 2026 实验室团队

extra:
  social:
    - icon: fontawesome/brands/github
      link: https://github.com/Procat18cn/labwiki
```

**作用**：
- `copyright`：页脚版权信息
- `extra.social`：页脚社交媒体链接（GitHub 图标和链接）

#### 2.6 导航结构

```yaml
nav:
  - 首页: index.md
  - 实验环境与系统:
    - 概述: environments/index.md
    - Ubuntu系统:
      - 系统基础与配置: environments/ubuntu/system-basics.md
      - 用户与权限管理: environments/ubuntu/user-permissions.md
```

**作用**：
- 决定左侧导航栏的层级结构
- 决定哪些 Markdown 文件会被包含在站点中
- 支持多级菜单组织（无限层级嵌套）

### 三、配置与页面效果对应关系

| mkdocs.yml 配置项 | 页面效果 |
|------------------|---------|
| `site_name` | 浏览器标签页标题 |
| `theme.palette` | 页面配色方案 |
| `nav` | 左侧导航菜单 |
| `copyright` | 页脚版权信息 |
| `extra.social` | 页脚社交图标 |
| `features` | 各种交互功能 |
| `custom_dir: overrides` | 自定义样式/布局 |

### 四、常见修改场景

#### 4.1 修改版权信息

找到 `copyright` 配置项（通常在文件末尾）：
```yaml
copyright: Copyright &copy; 2026 你的实验室名称
```

#### 4.2 修改 GitHub 链接

在 `extra.social` 中修改链接地址：
```yaml
extra:
  social:
    - icon: fontawesome/brands/github
      link: https://github.com/your-actual-org/labwiki
```

#### 4.3 隐藏 "Made with Material for MkDocs"

在 `extra` 配置中添加：
```yaml
extra:
  social:
    - icon: fontawesome/brands/github
      link: https://github.com/your-org
  generator: false  # 隐藏 "Made with..." 标注
```

#### 4.4 添加新的导航项

在 `nav` 部分添加：
```yaml
nav:
  - 首页: index.md
  - 新分类:
    - 新页面: new-page.md
```

### 五、相关配套文件

虽然 `mkdocs.yml` 是核心配置，但项目还有其他文件配合工作：

- **`docs/` 目录**：存放所有 Markdown 内容文件
- **`overrides/` 目录**：自定义 HTML 模板和 CSS/JS
  - `extra.css`：自定义样式
  - `extra.js`：自定义脚本
  - `main.html`：覆盖默认主题模板
- **`hooks/copy_sources.py`**：构建时的自定义脚本

## 参考文档

- [MkDocs 官方文档](https://www.mkdocs.org/)
- [Material for MkDocs 主题文档](https://squidfunk.github.io/mkdocs-material/)
- [MkDocs 配置指南](https://www.mkdocs.org/user-guide/configuration/)

---

*更新日期: 2026-04-20*
