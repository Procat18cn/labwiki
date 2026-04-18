# Ubuntu常用命令速查表

---

## 系统信息

```bash
# 系统版本
lsb_release -a
uname -a

# 硬件信息
lscpu                    # CPU信息
free -h                  # 内存使用
lsblk                    # 块设备列表
df -h                    # 磁盘使用
lspci                    # PCI设备
lsusb                    # USB设备
dmidecode                # 详细硬件信息

# 显卡信息
lspci | grep -i vga
nvidia-smi               # NVIDIA显卡
watch -n 1 nvidia-smi    # 实时监控
```

---

## 文件操作

```bash
# 文件管理
ls -la                   # 详细列表
cp -r 源 目标            # 复制目录
mv 源 目标               # 移动/重命名
rm -rf 目录              # 删除目录（谨慎！）
find / -name "文件名"    # 查找文件
tree                     # 目录树结构

# 压缩解压
tar -xzf file.tar.gz     # 解压tar.gz
tar -cjf backup.tar.bz2 dir/   # 压缩为tar.bz2
unzip file.zip           # 解压zip
gzip file                # 压缩为gz

# 权限管理
chmod 755 file           # 修改权限
chown user:group file    # 修改所有者
chmod +x script.sh       # 添加执行权限
```

---

## 用户管理

```bash
# 用户操作
sudo adduser 用户名      # 创建用户
sudo deluser 用户名      # 删除用户
sudo passwd 用户名       # 修改密码
sudo usermod -aG sudo 用户名   # 添加sudo权限
su - 用户名              # 切换用户

# 组管理
sudo groupadd 组名       # 创建组
sudo usermod -aG 组名 用户   # 添加用户到组
groups 用户名            # 查看用户所属组
id 用户名                # 查看用户信息

# 权限
sudo visudo              # 编辑sudoers
getfacl file             # 查看ACL
setfacl -m u:user:rwx file   # 设置ACL
```

---

## 软件包管理

```bash
# apt操作
sudo apt update          # 更新源
sudo apt upgrade         # 升级软件
sudo apt install 软件    # 安装
sudo apt remove 软件     # 卸载
sudo apt purge 软件      # 彻底卸载
sudo apt search 关键词   # 搜索
apt show 软件            # 查看信息
sudo apt autoremove      # 清理依赖

# dpkg操作
sudo dpkg -i package.deb # 安装deb包
sudo dpkg -r 软件        # 卸载
sudo apt install -f      # 修复依赖
```

---

## 网络操作

```bash
# 网络配置
ip addr                  # 查看IP地址
ip link                  # 查看网络接口
ping IP/域名             # 测试连通
nslookup 域名            # DNS查询
netstat -tlnp            # 查看端口
ss -tlnp                 # 查看端口（新版）

# SSH
ssh user@host            # 远程登录
scp file user@host:/path # 复制文件到远程
scp user@host:/path/file ./   # 从远程复制
```

---

## 系统服务

```bash
# systemd
sudo systemctl status 服务    # 查看状态
sudo systemctl start 服务     # 启动
sudo systemctl stop 服务      # 停止
sudo systemctl restart 服务   # 重启
sudo systemctl enable 服务    # 开机自启
sudo systemctl disable 服务   # 禁用自启

# 日志
journalctl -u 服务       # 查看服务日志
journalctl -f            # 实时日志
tail -f /var/log/syslog  # 系统日志
```

---

## 磁盘管理

```bash
# 分区与挂载
sudo fdisk -l            # 查看分区表
sudo fdisk /dev/sdb      # 分区操作
sudo mkfs.ext4 /dev/sdb1 # 格式化
sudo mount /dev/sdb1 /mnt    # 挂载
sudo umount /mnt         # 卸载

# fstab
sudo blkid               # 查看UUID
sudo nano /etc/fstab     # 编辑开机挂载
sudo mount -a            # 测试fstab配置
```

---

## 进程管理

```bash
# 查看进程
ps aux                   # 所有进程
top                      # 动态监控
htop                     # 增强版top
pgrep 进程名             # 查找进程PID

# 控制进程
kill PID                 # 结束进程
killall 进程名           # 按名结束
pkill 进程名             # 按名结束
nohup command &          # 后台运行
```

---

## 实用技巧

```bash
# 快捷操作
history                  # 命令历史
!n                       # 执行历史第n条
sudo !!                  # 用sudo执行上条命令
cd -                     # 返回上次目录
man 命令                 # 查看手册
命令 --help              # 查看帮助

# 文本处理
grep "pattern" file      # 搜索文本
sed 's/old/new/g' file   # 替换文本
awk '{print $1}' file    # 提取字段
cat file | head -20      # 前20行
cat file | tail -20      # 后20行
wc -l file               # 统计行数

# 其他
date                     # 当前时间
cal                      # 日历
clear                  # 清屏
reset                  # 重置终端
```

---

## 快捷键

| 快捷键 | 作用 |
|--------|------|
| `Ctrl + C` | 终止当前命令 |
| `Ctrl + Z` | 暂停当前命令 |
| `Ctrl + D` | 退出终端 |
| `Ctrl + L` | 清屏 |
| `Ctrl + A` | 光标移到行首 |
| `Ctrl + E` | 光标移到行尾 |
| `Ctrl + U` | 删除光标前内容 |
| `Ctrl + K` | 删除光标后内容 |
| `Tab` | 自动补全 |
| `↑/↓` | 历史命令 |

---

*最后更新：2026-04-17*
