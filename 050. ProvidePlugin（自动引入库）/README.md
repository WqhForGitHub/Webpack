# 50. ProvidePlugin（自动引入库）

`webpack.ProvidePlugin` 让你在不写 `import` 的情况下，全局使用某些模块（webpack 自动帮你 `require`）。

## 配置
```js
new webpack.ProvidePlugin({
  $: "jquery",
  jQuery: "jquery",
  _: "lodash",
  // 指向模块某个成员
  join: ["lodash", "join"],
})
```

## 适用场景
- 老旧代码大量使用 `$` / `jQuery`，避免每个文件 `import`
- 在多个文件中频繁使用 `_.xxx`，统一注入
- polyfill：`Buffer: ['buffer', 'Buffer']`、`process: 'process/browser'` 等

## 注意
- 它本质是按需 `require`，**只有真正用到才会被打包**
- 不会自动注入到 `window`，仅在模块作用域内可用
- 比 `expose-loader` / `imports-loader` 更轻量

## 运行
```bash
npm install
npm run build
```
