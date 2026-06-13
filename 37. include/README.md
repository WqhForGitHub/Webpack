# 37. include

演示 webpack 中 `include` / `exclude` 的用法，用于**限定 loader 的作用范围**，提高构建性能。

## 关键配置

```js
{
  test: /\.js$/,
  include: path.resolve(__dirname, "src"),
  exclude: /node_modules/,
  use: { loader: "babel-loader", options: { presets: ["@babel/preset-env"] } }
}
```

- `include`：白名单，仅处理 `src/` 下的 JS。
- `exclude`：黑名单，明确排除 `node_modules`。
- 同时配置时，`exclude` 的优先级高于 `include`。

## 安装 / 运行

```bash
npm install
npm start
npm run build
```
