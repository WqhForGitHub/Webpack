# 48. 压缩 JS（terser-webpack-plugin）

`terser-webpack-plugin` 是 webpack5 默认 JS 压缩器（仅在 `mode: 'production'` 时启用）。本 demo 演示如何**显式**配置以获得更精细的控制：

- `parallel: true` 多进程加速
- `terserOptions.compress.drop_console: true` 移除所有 `console.*`
- `terserOptions.compress.drop_debugger: true` 移除 debugger
- `terserOptions.format.comments: false` 移除全部注释
- `extractComments: false` 不生成 `*.LICENSE.txt`

## 运行
```bash
npm install
npm run build
```

查看 `dist/bundle.js`，会发现：
- 已混淆变量名
- 没有注释
- 没有 `console.log` 调用
