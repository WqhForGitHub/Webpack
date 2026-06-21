# 84. 代码压缩对比

纯 webpack 实现 4 种打包配置的代码压缩对比。

## 4 种配置

| 配置 | mode | 压缩 | tree shaking | 文件大小 |
|------|------|------|--------------|----------|
| `webpack.none.js` | `none` | ❌ | ❌ | 最大 |
| `webpack.dev.js` | `development` | ❌ | ❌ | 较大 |
| `webpack.prod.js` | `production` | ✅ Terser 默认 | ✅ | 较小 |
| `webpack.terser.js` | `production` | ✅ Terser 自定义（drop_console + mangle.toplevel + passes:2） | ✅ | 最小 |

## 运行

```bash
npm install
npm run build:all
```

构建后查看 `dist/` 子目录下 `bundle.js` 大小：

```
dist/
  none/bundle.js     <- 最大，含所有注释、空白、未压缩代码
  dev/bundle.js      <- 不压缩，但有 eval-source-map
  prod/bundle.js     <- 默认 production 压缩
  terser/bundle.js   <- 最小，最激进压缩
```

## 关键观察

1. **mode: production** 自动启用 `TerserPlugin` 与 tree shaking
2. **drop_console** 移除所有 console.log
3. **mangle.toplevel** 把顶层变量也短名化
4. **passes: 2** 多次压缩，可发现 first pass 之后的死代码
