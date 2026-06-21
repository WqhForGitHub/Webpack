# 14. CSS 抽离（mini-css-extract-plugin）

## 简介

将 CSS 从 JS bundle 中抽离为独立的 `.css` 文件，由 `<link>` 标签加载，可与 JS 并行下载。

## 启动

```bash
npm install
npm start       # 开发：用 style-loader（HMR 友好）
npm run build   # 生产：用 mini-css-extract-plugin 抽离
```

## 核心要点

1. 开发模式继续用 `style-loader`，热更新更顺畅；
2. 生产模式将 `style-loader` 替换为 `MiniCssExtractPlugin.loader`；
3. 在 `plugins` 中通过 `new MiniCssExtractPlugin({ filename: 'css/[name].[contenthash:8].css' })` 配置输出文件；
4. 抽离 CSS 的好处：浏览器可以并行加载、利用 CSS 缓存、避免 JS 阻塞渲染。
