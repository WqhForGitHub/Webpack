# 88. bundle 体积分析

提供 3 种 bundle 体积分析方式。

## 1. CLI stats（最快）

```bash
npm run build
```

输出表格按 size 倒序，列出所有 asset、chunk、entrypoint 体积。
配合 `performance` 配置，可在打包时 warning 超大 asset。

## 2. webpack-bundle-analyzer 可视化（推荐）

```bash
npm run analyze
```

构建后 `dist/bundle-report.html` 自动生成，浏览器打开可查看：

- **stat size**：原始体积（未压缩）
- **parsed size**：webpack 处理后体积
- **gzipped size**：gzip 压缩后体积

支持：搜索模块、查看模块嵌套、识别哪个第三方库占比大。

## 3. 离线 stats.json（CI 友好）

```bash
npm run build:stats        # 输出 stats.json
npm run analyze:json       # 用 analyzer CLI 离线分析 stats.json
```

## 关键配置说明

```js
performance: {
  hints: "warning",          // error / warning / false
  maxAssetSize: 250 * 1024,  // 单个 asset 上限
  maxEntrypointSize: 400 * 1024,
}

stats: {
  assets: true,
  assetsSort: "size",        // 按体积倒序
}
```

## 优化思路（看到大 chunk 后做什么）

1. 第三方库占比大 → splitChunks 抽离 vendor / 用 CDN
2. 重复打包 → 检查 alias、resolve.modules
3. 业务代码大 → 拆分路由/动态 import
4. 图片/字体在 JS 中 → asset modules + maxSize 阈值
5. moment/lodash 大 → IgnorePlugin / lodash-es + tree shaking
