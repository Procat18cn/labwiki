# Codex 远程连接 SSH 使用教程

## 摘要

本文整理 Codex App 通过 SSH 连接远程主机的配置方法，适用于代码仓库、编译环境、凭据或服务主要位于远程服务器上的开发场景。Codex 远程连接目前仍属于 alpha 功能，需要在本地配置文件中手动启用；启用后，Codex App 可以通过 SSH 在远程文件系统和远程 shell 中启动线程、读取文件、运行命令并写入代码改动。

## 关键词

Codex, Codex App, SSH, remote connections, 远程开发, OpenSSH, app server, config.toml, 远程主机

## 正文

### 一、功能背景

Codex 远程连接的核心作用是：让本地 Codex App 操作远程服务器上的项目，而不是把项目同步到本地再开发。

适合使用的场景包括：

- 项目仓库只放在远程开发机或实验室服务器上。
- 依赖的 GPU、编译工具链、数据库、容器环境只在远程主机上可用。
- 本地机器性能不足，只希望作为 Codex App 的交互入口。
- 希望 Codex 的命令执行、文件读取和代码修改都发生在远程主机上。

需要注意的是，该功能仍处于 alpha 阶段，设置流程、可用性和支持环境可能随 Codex 版本变化。遇到问题时，应优先确认本地 Codex App、远程 Codex CLI、SSH 配置和认证状态是否一致。

### 二、前置条件

准备工作分为本地机器和远程主机两部分。

本地机器需要满足：

- 已安装 Codex App。
- 已配置可用的 OpenSSH 客户端。
- 可以通过 `ssh <HostAlias>` 正常登录远程主机。
- `~/.codex/config.toml` 可以正常编辑。

远程主机需要满足：

- 已安装 Codex CLI。
- 远程用户的登录 shell 中可以找到 `codex` 命令。
- Codex CLI 已完成认证，或已按你的模型服务商配置好 API 访问方式。
- 项目目录对远程用户具有合适的读写权限。

社区反馈中提到，远程机 Codex CLI 版本建议不低于 `0.121.0`。如果功能入口存在但远程线程启动失败，建议先升级本地 App 和远程 CLI。

### 三、配置 SSH 主机别名

Codex App 会从本地 `~/.ssh/config` 读取具体的 SSH host alias，并通过 OpenSSH 解析连接参数。因此建议先为远程主机配置一个稳定别名。

编辑本地 `~/.ssh/config`：

```sshconfig
Host devbox
    HostName devbox.example.com
    User <USERNAME>
    IdentityFile ~/.ssh/id_ed25519
    Port 22
```

配置说明：

| 字段 | 作用 |
|------|------|
| `Host` | 本地使用的连接别名，例如 `devbox` |
| `HostName` | 远程主机域名或 IP 地址 |
| `User` | 远程登录用户 |
| `IdentityFile` | SSH 私钥路径 |
| `Port` | SSH 端口，默认是 `22` |

完成后先在终端验证 SSH 是否可用：

```bash
ssh devbox
```

如果这里无法正常登录，应先修复 SSH 连接问题，再继续配置 Codex。

### 四、在远程主机安装并验证 Codex CLI

登录远程主机后，确认 `codex` 命令在远程用户的登录 shell 中可用：

```bash
which codex
codex --version
```

如果 `which codex` 没有输出，说明 Codex App 通过 SSH 启动远程 app server 时也很可能找不到 `codex`。需要把 Codex CLI 所在目录加入远程用户 shell 的 `PATH`，例如写入 `~/.bashrc`、`~/.zshrc` 或系统环境配置。

然后在远程主机上单独运行一次 Codex CLI，确认认证和模型配置正常：

```bash
codex
```

如果远程 CLI 本身不能正常对话，Codex App 的远程连接通常也无法正常工作。

### 五、启用 Codex 远程连接功能

在运行 Codex App 的本地机器上，编辑 `~/.codex/config.toml`，加入功能开关：

```toml
[features]
remote_connections = true
```

保存后重启 Codex App。正常情况下，可以在设置中看到 `Settings > Connections` 或类似的“连接”配置项。

![Codex App Connections 设置页面](assets/codex-remote-ssh-connections.webp){ loading=lazy }

*图 1：启用 `remote_connections` 后，Codex App 设置中的 Connections 页面会显示可用的 SSH 连接。*

如果没有看到入口，按以下顺序检查：

1. 确认 Codex App 已更新到较新版本。
2. 确认修改的是本地机器的 `~/.codex/config.toml`。
3. 确认 TOML 语法没有错误。
4. 完全退出并重新打开 Codex App。

### 六、在 Codex App 中添加远程项目

启用功能后，进入 Codex App：

1. 打开 `Settings > Connections`。
2. 添加或启用 SSH 主机，例如前面配置的 `devbox`。
3. 选择远程主机上的项目文件夹。
4. 在该远程目录中创建或打开 Codex thread。

远程 thread 的执行位置在远程主机上。也就是说，Codex 读取的是远程项目文件，运行的是远程 shell 命令，写入的也是远程文件系统。

可以让 Codex 在远程 thread 中执行以下命令验证位置：

```bash
hostname
pwd
whoami
git status --short
```

如果输出对应远程主机、远程项目目录和预期用户，说明远程连接基本正常。

### 七、第三方 API 或自定义模型服务配置

如果本地和远程都使用第三方 API 或自定义模型服务，需要分别确认本地 Codex App、远程 Codex CLI 都能单独工作。

一个常见配置思路如下，具体字段应以当前 Codex 版本和服务商要求为准：

```toml
model_provider = "custom"
model = "gpt-5.4"
disable_response_storage = true
model_reasoning_effort = "medium"

[model_providers.custom]
name = "custom"
wire_api = "responses"
base_url = "https://<PROVIDER_BASE_URL>"
```

如果服务商仍要求 OpenAI 形式的 API key，可以在 `~/.codex/auth.json` 中使用占位符形式记录：

```json
{
  "OPENAI_API_KEY": "<YOUR_API_KEY>"
}
```

安全注意事项：

- 不要把真实 API key 写入公开文档、截图或仓库。
- `auth.json` 应只允许当前用户读取，建议权限设置为 `600`。
- 本地和远程如果都需要访问模型服务，应分别配置，不要假设本地配置会自动传到远程。

设置权限：

```bash
chmod 600 ~/.codex/auth.json
```

### 八、常见问题排查

#### 1. 设置中没有 Connections 入口

可能原因：

- 没有启用 `[features] remote_connections = true`。
- Codex App 没有重启。
- App 版本较旧。
- 配置文件路径写错，尤其是在 Windows、WSL、多用户环境中。

处理方法：

```toml
[features]
remote_connections = true
```

保存后完全重启 Codex App，并确认使用的是当前系统用户的 `~/.codex/config.toml`。

#### 2. SSH 主机没有被识别

Codex 依赖本地 `~/.ssh/config` 中的具体 host alias。只包含通配模式的配置可能被忽略。

建议保留明确的主机配置：

```sshconfig
Host devbox
    HostName devbox.example.com
    User <USERNAME>
    IdentityFile ~/.ssh/id_ed25519
```

并用以下命令验证：

```bash
ssh devbox
```

#### 3. 远程 thread 能创建但无法对话

可能原因：

- 远程主机上找不到 `codex` 命令。
- 远程 Codex CLI 没有完成认证。
- 远程 shell 的 `PATH` 与交互式终端不同。
- 自定义模型服务配置只在本地存在，远程没有配置。
- API key、base URL 或 provider 名称不一致。

建议在远程主机执行：

```bash
which codex
codex --version
codex
```

如果远程 CLI 单独不可用，应先修复远程 CLI。

#### 4. 提示 access token 无法刷新

社区反馈中有人遇到过类似报错：

```text
Your access token could not be refreshed because you have since logged out or signed in to another account. Please sign in again.
```

排查方向：

- 本地 App 与远程 CLI 是否登录了不同账号。
- 本地和远程是否都使用了第三方 API，但 provider 配置不一致。
- `model_provider` 是否在配置文件顶层正确指向已定义的 provider。
- 是否误用了当前服务商不需要的认证字段。

如果使用自定义服务，建议先分别验证：

```bash
codex
```

本地和远程都能单独工作后，再测试远程连接。

#### 5. API key 没有被远程 Codex 正确读取

社区经验中提到，某些组合下远程 Codex 可能没有按预期读取远程 `~/.codex/auth.json` 中的 `OPENAI_API_KEY`。这种情况与系统、shell、Codex 版本或自定义服务配置有关。

建议排查：

- `~/.codex/auth.json` 是否位于远程用户家目录。
- 文件权限是否正确。
- 远程 shell 是否能读取相关环境变量或配置文件。
- provider 配置中的 `base_url`、`wire_api`、认证要求是否与服务商一致。

### 九、安全建议

远程连接本质上会让 Codex 在远程主机上读取文件、执行命令和修改代码，应按照普通 SSH 远程开发的安全标准管理。

建议：

- 使用 SSH key 登录，不要暴露密码登录。
- 为 Codex 使用最小权限账户，不要直接使用 `root`。
- 不要把未认证的 app server 监听器暴露到公网或共享网络。
- 跨网络访问优先使用 VPN、Tailscale 等安全通道。
- 项目中的密钥、Token、Cookie 和内部地址不要放入公开仓库。
- 对远程改动保持 Git 版本管理，重要操作前先查看 `git status --short`。

### 十、回滚与关闭

如果需要关闭 Codex 远程连接功能，在本地 `~/.codex/config.toml` 中删除或注释功能开关：

```toml
# [features]
# remote_connections = true
```

然后重启 Codex App。

如果需要撤销远程项目改动，应在远程项目目录中通过 Git 检查并按需回滚：

```bash
git status --short
git diff
```

谨慎使用破坏性命令。只有确认需要丢弃改动时，才执行对应的 Git 回滚操作。

## 参考文档

- [Codex Remote SSH | 项目与开发环境](https://www.codex-docs.com/administration/remote-connections/)
- [以防你不知道 Codex App 偷偷加了 SSH 远程开发功能 - V2EX](https://www.v2ex.com/t/1207253)

---

*更新日期: 2026-05-06*
