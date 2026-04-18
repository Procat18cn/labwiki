# Ubuntu用户与权限管理

---

## 摘要

本文档详细介绍Ubuntu系统中用户账户的创建、权限分配和管理方法，涵盖系统权限（sudo）和文件权限（rwx）两大维度，以及多用户协作场景下的最佳实践。

---

## 关键词

`adduser`, `useradd`, `sudo`, `chmod`, `chown`, `usermod`, `ACL`, `权限管理`, `用户组`

---

## 一、创建账户

### 1.1 使用 adduser（推荐）

交互式创建用户，自动配置家目录和shell：

```bash
sudo adduser 用户名
```

执行后按提示设置密码和用户信息。

**示例**：
```bash
sudo adduser alice
```

### 1.2 使用 useradd（精细控制）

```bash
sudo useradd -m -s /bin/bash 用户名
sudo passwd 用户名
```

参数说明：
- `-m`：创建家目录
- `-s`：指定登录shell

### 1.3 查看用户

```bash
cat /etc/passwd
getent passwd
groups 用户名
id 用户名
```

---

## 二、系统管理权限（sudo）

### 2.1 赋予sudo权限

将用户加入sudo组：

```bash
sudo usermod -aG sudo 用户名
```

`-aG` 表示追加到附加组，避免覆盖其他组。

### 2.2 验证sudo权限

```bash
groups 用户名      # 查看用户所在组
sudo -l            # 列出可执行的sudo命令
```

### 2.3 管理员权限的相互影响

**重要**：两个同属于sudo组的管理员，**彼此都可以取消对方的权限**。

```bash
# 取消某用户的sudo权限
sudo deluser 用户名 sudo
```

谁先执行，谁就获胜。这是sudo的设计特性：拥有sudo权限意味着可以以root身份执行任何命令。

### 2.4 精细化权限控制

如需限制用户只能执行特定命令，编辑sudoers文件：

```bash
sudo visudo
```

添加规则示例：
```
# 允许用户仅使用apt安装软件
developer ALL=(ALL) /usr/bin/apt install, /usr/bin/apt-get install

# 允许免密码执行特定命令
developer ALL=(ALL) NOPASSWD: /usr/bin/apt install
```

---

## 三、文件权限管理

### 3.1 权限基础（rwx）

每个文件/目录有三组权限：

| 权限 | 对文件 | 对目录 |
|------|--------|--------|
| **r**（读） | 读取内容 | 列出目录内容（ls） |
| **w**（写） | 修改内容 | 创建/删除目录内文件 |
| **x**（执行） | 执行文件 | 进入目录（cd） |

权限表示：
```
-rwxr-xr-- 1 alice developers 1024 May 15 10:00 myfile
│└┬┘└┬┘└┬┘
│ │  │  └── 其他人权限
│ │  └───── 所属组权限
│ └──────── 所有者权限
└────────── 文件类型（-普通文件，d目录，l链接）
```

### 3.2 修改权限

**chmod命令**：

```bash
# 符号模式
chmod u+x file        # 给所有者添加执行权限
chmod g-w file        # 去掉组的写权限
chmod o=r file        # 设置其他人只读

# 数字模式（r=4, w=2, x=1）
chmod 755 file        # rwxr-xr-x
chmod 644 file        # rw-r--r--
chmod 700 file        # rwx------
```

**chown命令**：

```bash
sudo chown newowner file
sudo chown newowner:newgroup file
```

**chgrp命令**：

```bash
sudo chgrp newgroup file
```

### 3.3 特殊权限

| 权限 | 设置命令 | 作用 |
|------|---------|------|
| setuid | `chmod u+s file` | 以文件所有者身份运行 |
| setgid | `chmod g+s dir` | 目录内新建文件继承组 |
| Sticky bit | `chmod o+t dir` | 仅所有者能删除自己的文件 |

---

## 四、用户组管理

### 4.1 组的基本操作

```bash
# 创建组
sudo groupadd project_team

# 添加用户到组
sudo usermod -aG project_team alice
sudo usermod -aG project_team bob

# 设置目录属组
sudo chgrp project_team /shared_dir
sudo chmod g+rwx /shared_dir
```

### 4.2 共享目录最佳实践

```bash
# 1. 创建共享组
sudo groupadd shared_group

# 2. 添加用户到组
sudo usermod -aG shared_group user1
sudo usermod -aG shared_group user2

# 3. 创建共享目录并设置权限
sudo mkdir /shared_data
sudo chgrp shared_group /shared_data
sudo chmod 2775 /shared_data    # setgid + rwxrwxr-x

# 4. 设置默认ACL（可选）
setfacl -d -m g:shared_group:rwx /shared_data
```

---

## 五、ACL高级权限

### 5.1 安装与使用

```bash
sudo apt install acl
```

### 5.2 常用命令

```bash
# 查看ACL
getfacl file

# 给用户授权
setfacl -m u:alice:rwx file

# 给组授权
setfacl -m g:staff:rx dir

# 删除ACL
setfacl -x u:alice file

# 递归设置
setfacl -R -m g:developers:rwx dir

# 设置默认ACL（新文件继承）
setfacl -d -m g:developers:rwx dir

# 备份ACL
getfacl -R /dir > acl_backup.txt

# 恢复ACL
setfacl --restore=acl_backup.txt
```

---

## 六、临时授权与软件安装

### 6.1 场景：临时授权安装软件

**方案一：临时sudo权限**
```bash
# 1. 给用户临时sudo权限
sudo usermod -aG sudo tempuser

# 2. 用户安装软件
sudo apt install 软件名

# 3. 撤销sudo权限
sudo deluser tempuser sudo
```

**方案二：精细化sudoers规则**
```bash
# 编辑sudoers
echo "tempuser ALL=(ALL) /usr/bin/apt, /usr/bin/dpkg" | sudo tee /etc/sudoers.d/temp_install

# 使用完成后删除
sudo rm /etc/sudoers.d/temp_install
```

### 6.2 撤销权限对已安装软件的影响

| 操作 | 对已安装软件的影响 |
|------|------------------|
| 撤销sudo权限 | **无影响**，软件正常使用，只是不能再安装新软件 |
| 删除用户（不删家目录） | **无影响**，软件配置保留在/home/用户名 |
| 删除用户（删家目录） | **无影响**，仅丢失该用户的个性化配置 |

---

## 七、安全建议

1. **最小权限原则**：只给用户必要的权限
2. **定期审查**：`grep sudo /etc/group` 检查sudo组成员
3. **使用sudo而非root**：保留审计日志
4. **敏感文件权限**：如 `/etc/shadow` 应为 `rw-r-----` (640)
5. **ACL备份**：重要目录的ACL设置定期备份

---

## 八、常用命令速查

| 目的 | 命令 |
|------|------|
| 创建用户 | `sudo adduser 用户名` |
| 删除用户 | `sudo deluser 用户名` |
| 删除用户及家目录 | `sudo deluser --remove-home 用户名` |
| 修改密码 | `sudo passwd 用户名` |
| 添加到组 | `sudo usermod -aG 组名 用户名` |
| 查看用户组 | `groups 用户名` / `id 用户名` |
| 切换用户 | `su - 用户名` |
| 修改权限 | `chmod 755 文件` |
| 修改所有者 | `sudo chown 用户:组 文件` |

---

## 参考文档

- [Ubuntu官方文档 - User Management](https://help.ubuntu.com/community/UserManagement)
- [Linux Permissions Guide](https://www.linux.com/training-tutorials/understanding-linux-permissions/)

---

*最后更新：2026-04-17*
