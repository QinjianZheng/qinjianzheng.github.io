---
layout: post
title: Setting up FTP sharing in Windows 11/10
---

## 启用 IIS 功能

在搜索框中搜索 功能/features，找到“启用或关闭 Windows 功能” -- Internet Information Services，勾选 FTP 服务器，Web 管理工具 -- IIS 6 WMI 兼容性 -- IIS 元数据库和 IIS 6 配置兼容性和 Web 管理工具 -- IIS 管理控制台。点击确定，完成服务安装后，重启电脑。

## 添加本地帐户

为了方便管理多用户对 FTP 服务器不同文件的权限，需要添加多个本地帐户。

例如：添加本地帐户 ftp_user，设置密码，帐户类型为标准用户。

## 文件夹目录结构

FTP 分享的文件夹

.
|-- LocalUser
    └── \<username>
        └── \<files>

## IIS 设置

1. 在“网站”下添加 FTP 站点，设置站点名称和内容目录
2. 绑定 IP 地址，局域网设备 IP，端口默认为 21。无需 SSL
3. 身份验证勾选“基本”，授权“所有用户”读取权限。

## FTP 用户隔离

选择按照用户目录隔离

## 文件夹共享

在上面选定的 FTP 服务器根目录的共享属性中，开启共享功能，并添加共享的用户。