# 实验室知识库 - 部署说明

本文档详细介绍知识库的本地开发调试和 GitHub Pages 线上部署的完整流程。

---

## 一、项目结构

```
labwiki/
├── docs/                          # 文档内容目录（所有知识文档放在这里）
│   ├── index.md                   # 首页
│   ├── environments/              # 实验环境与系统
│   │   ├── index.md
│   │   ├── ubuntu/                # Ubuntu相关文档
│   │   └── windows/               # Windows相关文档
│   ├── development/               # 软件开发与工具
│   ├── ai-deep-learning/          # AI与深度学习
│   ├── lab-skills/                # 实验技能与方法
│   ├── hardware/                  # 实验系统与硬件
│   └── appendix/                  # 附录（速查表、索引）
├── overrides/                     # 主题自定义（模板、样式、脚本）
│   ├── main.html                  # 主模板（无顶栏布局）
│   ├── extra.css                  # 自定义样式
│   ├── extra.js                   # 自定义脚本
│   └── partials/
│       ├── lab-nav.html           # 自定义导航组件
│       └── logo.html              # Logo图标
├── mkdocs.yml                     # MkDocs核心配置文件
├── environment.yml                # Conda环境配置（用于一键还原开发环境）
└── README.md                      # 项目说明
```

---

## 二、本地开发环境搭建

### 2.1 前提条件

- 已安装 [Anaconda](https://www.anaconda.com/download) 或 [Miniconda](https://docs.conda.io/en/latest/miniconda.html)
- 已安装 [Git](https://git-scm.com/downloads)

### 2.2 方式一：使用 environment.yml 一键创建环境（推荐）

项目根目录提供了 `environment.yml`，可一键还原开发环境：

```bash
# 进入项目目录
cd labwiki

# 创建conda环境（首次）
conda env create -f environment.yml

# 激活环境
conda activate mydocs
```

如果环境已存在需要更新：

```bash
conda env update -f environment.yml --prune
```

### 2.3 方式二：手动创建环境

```bash
# 创建Python 3.11环境
conda create -n mydocs python=3.11 -y

# 激活环境
conda activate mydocs

# 安装依赖
pip install mkdocs-material mkdocs-minify-plugin
```

### 2.4 本地预览

```bash
# 确保在项目根目录且已激活mydocs环境
conda activate mydocs

# 启动本地开发服务器
mkdocs serve

# 浏览器访问 http://127.0.0.1:8000
```

`mkdocs serve` 会实时监听文件变化并自动刷新页面，适合边编辑边预览。

### 2.5 构建静态文件

```bash
mkdocs build
```

构建产物位于 `site/` 目录，可直接用于静态服务器部署。

---

## 三、GitHub Pages 部署（详细）

GitHub Pages 是 GitHub 提供的免费静态网站托管服务，非常适合托管文档类网站。

### 3.1 基础概念

| 概念 | 说明 |
|------|------|
| **GitHub Pages** | GitHub 内置的静态网站服务，每个仓库都可以开启 |
| **gh-pages 分支** | 一个特殊的 Git 分支，GitHub Pages 默认从这个分支读取网站文件 |
| **GitHub Actions** | GitHub 提供的 CI/CD 自动化服务，用于自动构建和部署 |
| **部署流程** | 代码推送到 main 分支 → 自动构建 → 产物发布到 gh-pages 分支 → 网站自动更新 |

### 3.2 第一步：创建 GitHub 仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角 **"+"** → **"New repository"**
3. 填写仓库信息：
   - **Repository name**: `labwiki`（或你想要的名字）
   - **Description**: 实验室知识库
   - **Visibility**: 选择 Public（公开）或 Private（私有）
   - **不要**勾选 "Add a README file"（项目已有）
4. 点击 **"Create repository"**

### 3.3 第二步：将本地项目推送到 GitHub

在项目根目录执行：

```bash
# 如果还未初始化git仓库
git init
git add .
git commit -m "初始化知识库项目"

# 关联远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/labwiki.git

# 推送到main分支
git branch -M main
git push -u origin main
```

### 3.4 第三步：配置 GitHub Actions 自动部署

在项目中创建 GitHub Actions 工作流文件：

```bash
# 创建目录
mkdir -p .github/workflows
```

在 `.github/workflows/deploy.yml` 中写入以下内容：

```yaml
name: 部署知识库到GitHub Pages

# 触发条件：当 main 分支有代码推送时自动执行
on:
  push:
    branches:
      - main

# 权限：允许写入仓库内容（用于部署到 gh-pages 分支）
permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      # 第1步：拉取代码
      - name: 检出仓库代码
        uses: actions/checkout@v4

      # 第2步：安装Python环境
      - name: 配置Python环境
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      # 第3步：缓存pip依赖（加速后续构建）
      - name: 缓存pip依赖
        uses: actions/cache@v4
        with:
          path: ~/.cache/pip
          key: ${{ runner.os }}-pip-${{ hashFiles('environment.yml') }}
          restore-keys: |
            ${{ runner.os }}-pip-

      # 第4步：安装MkDocs及依赖
      - name: 安装依赖
        run: pip install mkdocs-material mkdocs-minify-plugin

      # 第5步：构建并部署到gh-pages分支
      - name: 构建并部署
        run: mkdocs gh-deploy --force
```

提交并推送：

```bash
git add .github/workflows/deploy.yml
git commit -m "添加GitHub Actions自动部署配置"
git push
```

### 3.5 第四步：启用 GitHub Pages

1. 打开仓库页面，点击上方 **"Settings"（设置）**
2. 左侧菜单找到 **"Pages"**
3. 在 **"Build and deployment"** 下：
   - **Source**: 选择 **"Deploy from a branch"**
   - **Branch**: 选择 **"gh-pages"** / **"/(root)"**
4. 点击 **"Save"**

> 注意：`gh-pages` 分支是在第一次 GitHub Actions 运行成功后自动创建的。
> 如果还没有这个分支，先等第一次 Actions 执行完成。

### 3.6 第五步：访问你的网站

部署成功后，网站地址为：

```
https://你的用户名.github.io/labwiki/
```

你可以在仓库 Settings → Pages 页面的顶部看到实际的访问地址。

### 3.7 后续更新流程

每次更新文档后，只需：

```bash
# 提交修改
git add .
git commit -m "更新XXX文档"

# 推送到GitHub
git push

# GitHub Actions 会自动构建并部署，通常1-2分钟内完成
```

可以在仓库的 **"Actions"** 标签页查看部署进度和日志。

### 3.8 配置仓库地址（可选）

如果想在网站上显示"在GitHub上编辑此页"按钮，编辑 `mkdocs.yml`：

```yaml
# 取消注释并填入你的仓库地址
repo_url: https://github.com/你的用户名/labwiki
repo_name: GitHub
```

---

## 四、手动部署（不使用GitHub Actions）

如果不想配置 Actions，也可以在本地直接部署：

```bash
# 确保已激活mydocs环境
conda activate mydocs

# 一键部署到GitHub Pages（需要已配置远程仓库）
mkdocs gh-deploy
```

该命令会：
1. 在本地构建静态文件
2. 自动创建/更新 `gh-pages` 分支
3. 将构建产物推送到该分支

---

## 五、Private仓库使用GitHub Pages的说明

- **GitHub Free 账户**：只有 Public 仓库可以使用 GitHub Pages
- **GitHub Pro / Team / Enterprise 账户**：Private 仓库也可以使用 GitHub Pages
- 如果需要私有仓库 + 免费方案，可以考虑将仓库设为 Public（文档内容通常无需保密）

---

## 六、常见问题

### Q1: 推送后网站没有更新？

1. 检查 Actions 标签页是否有执行记录
2. 确认 Settings → Pages 中的 Branch 已设置为 `gh-pages`
3. 清除浏览器缓存后刷新

### Q2: Actions 构建失败？

检查 Actions 日志中的错误信息，常见原因：
- `mkdocs.yml` 配置语法错误
- 文档中引用了不存在的文件
- pip安装超时（重新运行即可）

### Q3: 如何使用自定义域名？

1. 在 Settings → Pages → Custom domain 中填入你的域名
2. 在域名的 DNS 设置中添加 CNAME 记录指向 `你的用户名.github.io`
3. 在 `docs/` 目录下创建 `CNAME` 文件，内容为你的域名

### Q4: 如何在不同电脑上开发？

```bash
# 克隆仓库
git clone https://github.com/你的用户名/labwiki.git
cd labwiki

# 还原conda环境
conda env create -f environment.yml

# 激活环境并预览
conda activate mydocs
mkdocs serve
```

---

## 七、添加新文档的标准流程

1. 在 `docs/` 下对应分类目录中创建 `.md` 文件
2. 在 `mkdocs.yml` 的 `nav` 部分添加导航项
3. 运行 `mkdocs serve` 本地预览确认效果
4. 提交并推送到 GitHub

---

*最后更新：2026-04-18*
