# 15. CSS 压缩（css-minimizer-webpack-plugin）

## 简介

在生产构建中，对抽离出的 CSS 进行压缩（去除空白、注释、合并规则等），减小体积。

## 启动

```bash
npm install
npm run build
```

构建完成后查看 `dist/css/*.css`，可以看到所有内容被压缩为一行。

## 核心要点

1. `css-minimizer-webpack-plugin` 默认基于 `cssnano`；
2. 一旦自定义了 `optimization.minimizer` 数组，**必须**显式加回 `TerserPlugin`，否则 JS 不会被压缩；
3. 仅在 `mode === 'production'` 时启用压缩（`optimization.minimize: isProd`），开发环境不压缩以加快构建。
