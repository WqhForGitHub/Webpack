# 29. postcss-loader + autoprefixer

使用 PostCSS 在 webpack 流水线中处理 CSS，并通过 `autoprefixer` 自动添加浏览器前缀。

## 关键文件

- `postcss.config.js`：声明 PostCSS 插件列表
- `package.json` 中的 `browserslist`：决定 autoprefixer 的目标浏览器
- `webpack.config.js`：在 css 规则中插入 `postcss-loader`

## 运行

```bash
npm install
npm run build
```

打包后查看 `dist` 中的 CSS（或在 DevTools Elements 面板查看 `<style>` 内容），可以看到 `display: flex` / `user-select` / `linear-gradient` 已被加上 `-webkit-` 等前缀。
