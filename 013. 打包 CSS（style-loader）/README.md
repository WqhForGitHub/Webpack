# 13. 打包 CSS（style-loader）

## 简介

演示通过 `style-loader + css-loader` 完成 CSS 打包：

- `css-loader`：解析 `@import`、`url(...)`，把 CSS 转成 JS 模块
- `style-loader`：在运行时把 CSS 插入到 `<head>` 的 `<style>` 标签里

## 启动

```bash
npm install
npm start
npm run build
```

## 核心要点

1. `use` 数组中 loader **从右往左**执行：`['style-loader', 'css-loader']` 表示先 css-loader 后 style-loader；
2. 这种方式**不会**生成单独的 `.css` 文件，所有样式打包进 JS bundle 中；
3. 适合开发环境（HMR 更新更快），生产环境通常改用 `mini-css-extract-plugin` 抽离为独立文件。
