# Ubuntu系统基础与配置

---

## 摘要

本文档介绍Ubuntu系统中查看硬件信息、配置显卡驱动、解决显示问题等基础操作，涵盖常用命令和实际问题的解决方案。

---

## 关键词

`lscpu`, `lshw`, `lspci`, `nvidia-smi`, `ast驱动`, `幽灵显示器`, `IPMI`, `GRUB`

---

## 一、硬件信息查看

### 1.1 CPU信息

```bash
# 查看CPU详细信息
lscpu

# 仅查看CPU型号
cat /proc/cpuinfo | grep "model name"

# 查看CPU核心数
nproc
```

### 1.2 内存信息

```bash
# 查看内存使用情况
free -h

# 查看内存硬件信息（需sudo）
sudo dmidecode -t memory
```

### 1.3 磁盘信息

```bash
# 查看块设备列表
lsblk

# 查看磁盘使用情况
df -h

# 查看分区表（需sudo）
sudo fdisk -l
```

### 1.4 显卡信息

```bash
# 查看显卡型号
lspci | grep -i vga

# NVIDIA显卡状态
nvidia-smi

# 实时刷新显示（每秒）
watch -n 1 nvidia-smi
```

### 1.5 综合信息工具

```bash
# 完整硬件信息（需sudo）
sudo lshw

# 系统综合信息（需安装）
sudo apt install inxi
inxi -F

# 美观的系统信息（需安装）
sudo apt install neofetch
neofetch
```

---

## 二、显卡与显示配置

### 2.1 问题现象：幽灵显示器

**场景**：服务器主板（如带IPMI的Aspeed芯片）与独立显卡（如RTX 4090）共存时，系统会识别出一个不存在的显示器。

**症状**：
- 桌面设置中出现"未知显示器"
- 鼠标可移动到不存在的屏幕区域
- 登录界面右侧有多余空间

**原因**：Linux内核默认加载了`ast`驱动（Aspeed显示芯片），将板载显示识别为独立显示器。

### 2.2 解决方案：屏蔽ast驱动

**步骤1：编辑GRUB配置**

```bash
sudo nano /etc/default/grub
```

找到`GRUB_CMDLINE_LINUX_DEFAULT`行，添加`modprobe.blacklist=ast`：

```bash
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash modprobe.blacklist=ast"
```

**步骤2：更新GRUB**

```bash
sudo update-grub
```

**步骤3：（可选）创建黑名单文件**

```bash
echo "blacklist ast" | sudo tee /etc/modprobe.d/blacklist-ast.conf
sudo update-initramfs -u
```

**步骤4：重启系统**

```bash
sudo reboot
```

### 2.3 验证结果

```bash
# 确认ast驱动未加载
lsmod | grep ast
# 应无输出

# 查看显示设备
xrandr --listmonitors
# 应只显示物理连接的显示器
```

### 2.4 恢复方法

如需重新启用IPMI KVM功能：

```bash
# 1. 编辑GRUB，移除modprobe.blacklist=ast
sudo nano /etc/default/grub

# 2. 删除黑名单文件
sudo rm /etc/modprobe.d/blacklist-ast.conf

# 3. 更新配置
sudo update-grub
sudo update-initramfs -u

# 4. 重启
sudo reboot
```

---

## 三、系统启动与内核

### 3.1 GRUB配置

```bash
# 更新GRUB配置
sudo update-grub

# 编辑GRUB默认配置
sudo nano /etc/default/grub
```

常用配置项：
- `GRUB_DEFAULT`：默认启动项
- `GRUB_TIMEOUT`：启动菜单等待时间
- `GRUB_CMDLINE_LINUX_DEFAULT`：内核启动参数

### 3.2 内核模块管理

```bash
# 查看已加载模块
lsmod

# 加载模块
sudo modprobe 模块名

# 卸载模块
sudo modprobe -r 模块名

# 查看模块信息
modinfo 模块名
```

### 3.3 屏蔽驱动模块

```bash
# 创建黑名单文件
echo "blacklist 驱动名" | sudo tee /etc/modprobe.d/blacklist-自定义名.conf

# 更新initramfs
sudo update-initramfs -u
```

---

## 四、实用技巧

### 4.1 实时监控系统资源

```bash
# 综合监控
htop

# GPU监控
nvidia-smi -l 1

# 或
watch -n 1 nvidia-smi

# 磁盘IO监控
iotop
```

### 4.2 快速查看系统概况

```bash
# 一行命令查看核心信息
echo "=== CPU ===" && lscpu | grep "Model name" && \
echo "=== 内存 ===" && free -h | grep "Mem:" && \
echo "=== 磁盘 ===" && lsblk | grep disk && \
echo "=== 显卡 ===" && lspci | grep -i vga
```

---

## 五、常见问题

### Q1: nvidia-smi显示静止，如何实时刷新？

**A**: 使用`watch`命令：
```bash
watch -n 1 nvidia-smi
```
或安装`gpustat`：
```bash
pip3 install gpustat
gpustat -i 1
```

### Q2: 如何查看具体的GPU型号和计算能力？

**A**: 
```bash
nvidia-smi -q | grep "Product Name"
nvidia-smi -q | grep "CUDA Version"
```

### Q3: 服务器IPMI KVM黑屏怎么办？

**A**: 这是正常现象。当系统启用独立显卡驱动后，IPMI无法捕获其输出。BIOS/GRUB阶段KVM仍可用，进入系统后需通过SSH或物理显示器访问。

---

## 参考文档

- [Ubuntu官方文档](https://help.ubuntu.com/)
- [NVIDIA驱动文档](https://docs.nvidia.com/datacenter/tesla/driver-installation-guide/)
- [Linux内核文档](https://www.kernel.org/doc/html/latest/)

---

*最后更新：2026-04-17*
