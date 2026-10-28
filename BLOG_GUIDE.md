# 小站维护说明

## 本地预览

在项目目录运行 `npm run dev -- --host 127.0.0.1`，打开终端显示的本机地址。localhost / 127.0.0.1 只指向运行服务器的电脑，其他设备不能直接用它访问。

检查命令：`npm test`、`npm run build`。构建后可运行 `npm run preview -- --host 127.0.0.1` 查看生产版本。

## 新增文章或短记

在 `src/data/logs/` 新建一个 UTF-8 编码的 `.mdx` 文件，文件名会成为 `/articles/文件名` 的地址，因此发布后不要随意改名。长文和短记使用同一种格式，不必填写不存在的信息。

```mdx
---
title: "填写真实标题"
date: "2026-10-28"
time: "10:00"
category: "学习笔记"
tags: ["你的标签"]
description: "用一句话介绍这篇文章，也可以省略"
hidden: true
---

在这里写正文。
```

`category` 可选：学习笔记、折腾记录、生活随想。未填写时显示未分类，既有文章分类补充在 `src/data/blog.js`。文章按日期和时间从新到旧混排，不再按旧的 `pinned` 排序。

确认内容可以公开后将 `hidden` 改为 `false`。隐藏文章不会出现在列表或阅读路由，但这是静态站点的展示开关，不是访问权限；不要把秘密放进源码或静态资源。

图片放在 `public/Blog/`，正文使用 `![图片说明](/Blog/文件名.png)`。支持 Markdown 代码围栏、表格、数学公式、链接，以及已有 MDX 组件。可继续使用 `<BoxWithTag tag="提示">内容</BoxWithTag>`；其他交互组件按原方式在 MDX 中 import 后使用。原课件和可视化文件无需迁移。

## 可选：边读边消化的短笔记

不必一次写完整，先写触动自己的一个点即可。保留 `date` 作为首发日期（新文章也支持 `created`；两者同时存在时以 `date` 为准），后续补记时只更新 `updated`。列表仍按首发时间排序，不会把旧文章伪装成新文章。阅读页会同时显示首发和更新日期。

以下是可复制的空白模板，先保持 `hidden: true`，填写真实内容后再公开；不需要的段落直接省略：

```mdx
---
title: "填写这次思考的标题"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
category: "学习笔记"
tags: []
sourceTitle: "原分享的标题或作者"
sourceUrl: "https://原文地址"
hidden: true
---

## 触动我的话 / 来源

记录触动自己的意思，并保留来源链接；如直接引用，标明引文。

## 当下理解

## 与自身实践的联系

## 还没想明白的疑问

## 后续补记 · YYYY-MM-DD

写下这次新的理解；可以保留之前的疑问，继续追加带日期的小节。
```

`sourceUrl` / `sourceTitle` 是可选字段，也可直接在正文里用 Markdown 链接引用多个来源。没有补记时省略 `updated`。不需要专门的栏目或后台。

## 更新“最近在忙”的数据

编辑 `src/data/blog.js` 中的 `blog.now`，每项形如 `{ text: '真实近况', href: '/articles/文件名' }`，不需要链接时省略 `href`。`nowUpdated` 填写实际更新日期。数组留空时显示诚实的空状态。

## 路由与内容

新入口为 `/`、`/articles`、`/algorithms`、`/about`。旧 `/logs` 保留为文章列表入口；`/courseware`、`/courseware/:id`、`/knowledge-graph`、`/visualizations`、`/visualizations/:slug` 不变。现有文章原文、图片、PDF、隐藏状态均保留。

此版本不包含登录、评论或后台，也未执行发布。部署时服务器仍需将前端路由回退到 `index.html`（现有 `vercel.json` 已有规则）。
