# 74. ESModule vs CommonJS tree shaking

纯 webpack 对比两种模块系统在 tree shaking 下的差异。

## 运行

```bash
npm install
npm run build:esm   # 输出到 dist/esm/bundle.js
npm run build:cjs   # 输出到 dist/cjs/bundle.js
```

## 观察

- 对比 `dist/esm/bundle.js` 与 `dist/cjs/bundle.js` 的体积
- ESM 版本中 `subtract`、`multiply`、`bigUnused` 应被删除
- CJS 版本中由于 `module.exports = {...}` 是运行时行为，webpack 通常会保留全部内容

## 结论

- 写库或业务代码，优先 ESM (`import/export`)，才能享受完整 tree shaking。
- 如果依赖只发布了 CJS 版本，效果会打折扣。
