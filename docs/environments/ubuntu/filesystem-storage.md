# Ubuntu文件系统与存储

---

## 摘要

本文档介绍Ubuntu系统中文件系统的管理方法，包括NAS共享文件夹的挂载、跨系统文件访问（Linux/Windows）、磁盘管理等操作。

---

## 关键词

`NAS`, `SMB`, `CIFS`, `mount`, `fstab`, `ext4`, `NTFS`, `WSL2`, `网络存储`

---

## 一、NAS共享文件夹挂载

### 1.1 图形界面访问

Ubuntu文件管理器（Nautilus）支持直接访问SMB共享：

1. 打开文件管理器，点击"其他位置"
2. 在"连接到服务器"输入：
   ```
   smb://192.168.1.100/
   ```
3. 输入用户名密码即可访问

### 1.2 命令行挂载

#### 安装必要工具

```bash
sudo apt update
sudo apt install cifs-utils
```

#### 创建挂载点

```bash
sudo mkdir /mnt/nas
```

#### 临时挂载

```bash
sudo mount -t cifs //192.168.1.100/share /mnt/nas \
  -o username=nasuser,password=naspass,uid=1000,gid=1000
```

常用选项：
- `username/password`：NAS登录凭据
- `uid/gid`：挂载后文件的所属用户/组
- `workgroup=WORKGROUP`：工作组名称
- `iocharset=utf8`：支持中文文件名

#### 卸载

```bash
sudo umount /mnt/nas
```

### 1.3 开机自动挂载（fstab）

#### 创建凭据文件（安全）

```bash
sudo nano /etc/nas_credentials
```

内容：
```
username=nasuser
password=naspass
domain=WORKGROUP
```

设置权限：
```bash
sudo chmod 600 /etc/nas_credentials
```

#### 编辑fstab

```bash
sudo cp /etc/fstab /etc/fstab.backup
sudo nano /etc/fstab
```

添加行：
```
//192.168.1.100/share  /mnt/nas  cifs  credentials=/etc/nas_credentials,_netdev,uid=1000,gid=1000,iocharset=utf8  0  0
```

参数说明：
- `credentials`：凭据文件路径
- `_netdev`：表示依赖网络，网络就绪后再挂载
- `iocharset=utf8`：中文文件名支持

#### 测试配置

```bash
sudo mount -a
```

无报错则配置成功，重启后会自动挂载。

---

## 二、跨系统文件访问

### 2.1 Windows读取Linux硬盘

**问题**：Linux使用的ext4文件系统，Windows原生不支持。

**解决方案**：

| 方案 | 工具/方法 | 适用场景 |
|------|----------|---------|
| **WSL 2** | `wsl --mount` | Windows 10/11，命令行用户 |
| **第三方软件** | DiskGenius、Ext2Fsd | 图形界面，临时访问 |
| **Live USB** | Ubuntu启动盘 | 数据恢复，最安全 |

#### WSL 2挂载方法

```powershell
# 在Windows PowerShell中执行
wsl --mount \.\PHYSICALDRIVE1 --partition 1

# 进入WSL访问
wsl
cd /mnt/wsl/PHYSICALDRIVE1
```

#### 使用DiskGenius

1. 下载安装DiskGenius（免费版即可）
2. 连接Linux硬盘
3. 在DiskGenius中浏览ext4分区
4. 复制需要的文件到NTFS分区

### 2.2 Linux读取Windows硬盘

Windows使用的NTFS文件系统，Ubuntu原生支持：

```bash
# 自动挂载（插入即显示）
# 或手动挂载
sudo mount -t ntfs /dev/sdb1 /mnt/windows

# 如果提示不安全状态（快速启动导致）
sudo mount -t ntfs-3g -o remove_hiberfile /dev/sdb1 /mnt/windows
```

### 2.3 通用文件系统格式

如需双系统共享数据盘，建议使用：

| 文件系统 | 优点 | 缺点 | 建议 |
|----------|------|------|------|
| **exFAT** | 双系统原生支持 | 无日志，不适合系统盘 | **推荐用于数据交换** |
| **NTFS** | Windows原生 | Linux需额外驱动 | Windows主力用户使用 |
| **ext4** | Linux最优 | Windows需第三方工具 | Linux主力用户使用 |

#### 格式化exFAT

```bash
# 安装工具
sudo apt install exfat-fuse exfat-utils

# 格式化
sudo mkfs.exfat /dev/sdb1
```

---

## 三、磁盘管理基础

### 3.1 查看磁盘信息

```bash
# 查看块设备
lsblk

# 查看磁盘分区
sudo fdisk -l

# 查看磁盘使用情况
df -h

# 查看磁盘UUID
blkid
```

### 3.2 分区操作

```bash
# 使用fdisk分区（MBR）
sudo fdisk /dev/sdb

# 使用gdisk分区（GPT）
sudo gdisk /dev/sdb

# 图形界面工具
sudo apt install gparted
sudo gparted
```

### 3.3 格式化分区

```bash
# 格式化为ext4
sudo mkfs.ext4 /dev/sdb1

# 格式化为NTFS
sudo apt install ntfs-3g
sudo mkfs.ntfs /dev/sdb1

# 格式化为exFAT
sudo apt install exfat-utils
sudo mkfs.exfat /dev/sdb1
```

### 3.4 自动挂载分区

编辑 `/etc/fstab`：

```bash
# 使用UUID（推荐，设备名可能变化）
UUID=xxxxx-xxxxx-xxxxx  /mnt/data  ext4  defaults  0  2

# 或使用设备名
/dev/sdb1  /mnt/data  ext4  defaults  0  2
```

获取UUID：
```bash
sudo blkid /dev/sdb1
```

---

## 四、常见问题

### Q1: 挂载NAS时提示"权限拒绝"？

```bash
# 检查凭据
sudo mount -t cifs //ip/share /mnt/nas -o username=xxx,password=xxx,vers=3.0

# 尝试指定SMB版本
sudo mount -t cifs //ip/share /mnt/nas -o username=xxx,vers=2.0
```

### Q2: fstab配置错误导致系统无法启动？

```bash
# 进入恢复模式，注释掉错误的fstab行
sudo nano /etc/fstab

# 或使用noauto选项，手动挂载
//ip/share /mnt/nas cifs credentials=xxx,noauto 0 0
```

### Q3: 中文文件名乱码？

确保挂载时添加：
```bash
-o iocharset=utf8
```

### Q4: Windows快速启动导致无法挂载NTFS？

```bash
# 在Windows中关闭快速启动
# 或在Linux中强制挂载（有风险）
sudo mount -t ntfs-3g -o remove_hiberfile /dev/sdb1 /mnt/windows
```

---

## 五、最佳实践

1. **使用UUID而非设备名**：避免设备名变化导致挂载失败
2. **凭据文件权限设置为600**：保护密码安全
3. **fstab中使用`_netdev`**：确保网络就绪后再挂载网络存储
4. **定期备份fstab**：`sudo cp /etc/fstab /etc/fstab.backup`
5. **重要数据使用exFAT交换**：双系统兼容性最好

---

## 参考文档

- [Ubuntu文件系统管理](https://help.ubuntu.com/community/InstallingANewHardDrive)
- [Samba官方文档](https://www.samba.org/samba/docs/)
- [NTFS-3G文档](https://www.tuxera.com/community/open-source-ntfs-3g/)

---

*最后更新：2026-04-17*
