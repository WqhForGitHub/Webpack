# 73. sideEffects 配置

纯 webpack 演示 `package.json` 中的 `sideEffects` 字段如何配合 tree shaking。

## 关键点

- `package.json -> "sideEffects"` 是给 webpack 的「白名单」，告诉它哪些文件是「有副作用」的，不能因为没人用具名导出就被删除。
- 取值：
  - `false` —— 整包都没副作用，可以最大限度 tree shaking
  - `["*.css", "./src/polyfill.js"]` —— 只有这些文件是有副作用的

## 运行

```bash
npm install
npm run build
```

打开 `dist/js/main.*.js`：

- `utils.js` 中只有 `used` 函数会出现，`unused`、`big` 被摇掉
- `polyfill.js` 因为在 `sideEffects` 数组里，依旧被保留
- `style.css` 也被保留并通过 MiniCssExtractPlugin 输出
