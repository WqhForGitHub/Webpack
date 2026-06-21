# 81. externals（CDN）+ 长缓存 contenthash

纯 webpack 演示「externals 引用 CDN」与「contenthash 长缓存」的组合方案。

## 文件作用

| 文件                | 作用                                             |
| ------------------- | ------------------------------------------------ |
| `webpack.config.js` | 主配置：externals + contenthash + splitChunks    |
| `index.html`        | EJS 模板，把 CDN `<script>` 注入到 head          |
| `src/index.js`      | 业务入口，照常 `import _ from 'lodash'` 等       |
| `src/style.css`     | 样式（被 `MiniCssExtractPlugin` 抽离 + contenthash）|

## 核心思路

```js
externals: {
  lodash: '_',
  jquery: 'jQuery',
}
```

- webpack 不再把 lodash / jquery 打入 bundle
- HTML 中通过 CDN `<script>` 引入这两个全局变量
- 主 bundle 大幅瘦身

```js
output: {
  filename: 'js/[name].[contenthash:8].js',
}
```

- 业务代码内容不变 → 文件名不变 → 浏览器命中长缓存
- 配合服务器响应头 `Cache-Control: max-age=31536000, immutable`

## 运行

```bash
npm install
npm run build:prod
```

打开 `dist/index.html`：

- 控制台可见 lodash 输出
- 网络面板看到 lodash/jquery 由 CDN 加载
- 多次构建（不改业务代码）应观察到 main / vendors 文件名 hash 不变

## 长缓存最佳实践（要点回顾）

1. `output.filename` / `chunkFilename` / `MiniCssExtractPlugin.filename` 全部使用 `[contenthash]`
2. `optimization.runtimeChunk: 'single'` 抽离运行时
3. `optimization.moduleIds / chunkIds: 'deterministic'`
4. `splitChunks.cacheGroups` 拆分稳定的 vendor chunk
5. 第三方库通过 `externals` 走 CDN，享受跨站缓存
