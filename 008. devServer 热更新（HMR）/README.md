# 08. devServer 热更新（HMR）

演示 webpack-dev-server 的 **HMR（Hot Module Replacement）**：

- CSS 修改：通过 `style-loader` 自动热替换，无刷新立即生效。
- JS 修改：在入口中通过 `module.hot.accept('./counter', ...)` 接收子模块更新，
  从而保留页面状态（计数器的值）。

## 用法

```bash
npm install
npm start
```

打开 http://localhost:8080，按以下步骤体验：

1. 点击 “+1” 几次，观察 count 变化。
2. 修改 `src/style.css`（比如把 `background` 换个颜色）保存 —— 页面**不刷新**，样式立即更新。
3. 修改 `src/counter.js`（比如把按钮文案 `+1` 改成 `加一`）保存 —— 页面**不刷新**，
   但按钮文案更新；count 的值在重新挂载后从 0 开始（因为模块被替换了，闭包中的 `count` 重置）。
4. 修改 `src/index.js`（HMR 边界外）保存 —— 由于 `liveReload: true`，会回退到整页刷新。

## 关键点

- `devServer.hot: true` 开启 HMR 运行时
- 入口模块用 `if (module.hot) { module.hot.accept(...) }` 声明接受边界
- `style-loader` 自带 HMR，CSS 不需要手动 accept
