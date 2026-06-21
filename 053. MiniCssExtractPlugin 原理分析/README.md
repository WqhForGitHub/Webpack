# 53. MiniCssExtractPlugin 原理分析

## 核心原理
`mini-css-extract-plugin` 由两部分协同工作：

1. **Loader** (`MiniCssExtractPlugin.loader`)
   - 替代 `style-loader`，不再把 CSS 注入到 `<style>` 标签
   - 而是"标记"该模块为 CSS 模块，把内容交给 plugin

2. **Plugin** (`new MiniCssExtractPlugin()`)
   - 在 `compilation.hooks.processAssets` 阶段，遍历所有 chunk
   - 收集被 loader 标记的 CSS 内容
   - 拼接后通过 `compilation.emitAsset` 生成独立 `.css` 文件
   - 同时从 JS bundle 中"剥离"这些 CSS（不再走 style-loader 的注入）

## 与 style-loader 的区别
| 特性 | style-loader | MiniCssExtractPlugin |
|------|--------------|----------------------|
| 输出方式 | 内联到 JS，运行时注入 `<style>` | 抽离为独立 `.css` |
| 首屏体验 | 闪烁（FOUC） | 可并行加载，无闪烁 |
| 缓存 | 不可缓存 CSS | 独立缓存 |
| 适用 | 开发环境 | 生产环境 |

## 运行
```bash
npm install
npm run build
```

查看 `dist/`：会发现既有 `bundle.js`，也有 `main.css`，CSS 已被抽离。
