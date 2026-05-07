# Cursor 插件市场修改

## 摘要

cursor虽然是基于vscode开发的，但二者的插件市场并不一样，这导致有些vscode市场的插件在cursor中搜索不到。因此，需要修改相关设置 cursor的插件市场地址

## 关键词

Cursor, VScode, 插件

## 方法

- 找到Cursor安装目录下的 `\resources\app\product.json` 并打开。找到以下内容：

```
"extensionsGallery": {
    "galleryId": "cursor",
    "serviceUrl": "https://marketplace.cursorapi.com/_apis/public/gallery",
    "itemUrl": "https://marketplace.cursorapi.com/items",
    "resourceUrlTemplate": "https://marketplace.cursorapi.com/{publisher}/{name}/{version}/{path}",
    "controlUrl": "https://api2.cursor.sh/extensions-control",
    "recommendationsUrl": "",
    "nlsBaseUrl": "",
    "publisherUrl": ""
},
```

- 替换其中的4行：

```
"extensionsGallery": {
    "galleryId": "cursor",
    "serviceUrl": "https://marketplace.visualstudio.com/_apis/public/gallery",
    "itemUrl": "https://marketplace.visualstudio.com/items",
    "resourceUrlTemplate": "https://{publisher}.vscode-unpkg.net/{publisher}/{name}/{version}/{path}",
    "controlUrl": "https://main.vscode-cdn.net/extensions/marketplace.json",
    "recommendationsUrl": "",
    "nlsBaseUrl": "",
    "publisherUrl": ""
},
```

- 保存（通常需要管理员权限）



*更新日期：2026.04.27*

