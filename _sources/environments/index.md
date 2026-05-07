# 实验环境与系统

本章节涵盖实验室常用的操作系统环境配置，包括Ubuntu和Windows平台的系统设置、软件安装、环境搭建等内容。

---

## Ubuntu系统

Ubuntu是实验室主要的服务器和工作站操作系统，本节包含系统配置、用户管理、软件安装等实用指南。

### 内容导航

- [系统基础与配置](ubuntu/system-basics.md) - 硬件查看、驱动配置、系统优化
- [用户与权限管理](ubuntu/user-permissions.md) - 账户创建、权限分配、sudo配置
- [软件安装与管理](ubuntu/software-management.md) - 包管理、开发环境、第三方软件
- [文件系统与存储](ubuntu/filesystem-storage.md) - 磁盘管理、NAS挂载、跨系统访问

---

## Windows系统

Windows作为实验室常用的桌面操作系统，本节记录Windows环境下的系统配置和软件使用经验。

### 内容导航

- [系统配置](windows/system-config.md) - 系统设置、优化配置
- [软件环境](windows/software-env.md) - 开发环境、工具软件

---

## 快速命令参考

### Ubuntu

```bash
# 系统更新
sudo apt update && sudo apt upgrade

# 查看系统信息
uname -a
lsb_release -a

# 查看硬件信息
lscpu
free -h
lspci
```

### Windows

```powershell
# 系统信息
systeminfo
winver

# 查看硬件
Get-ComputerInfo
Get-Process
```
