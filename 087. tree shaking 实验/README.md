# 87. tree shaking 实验

## Tree Shaking 两阶段

webpack 的 tree shaking = **标记** + **删除**：

1. **标记阶段**：`optimization.usedExports: true`，给未使用的 export 打 `unused harmony export` 注释
2. **删除阶段**：`optimization.minimize: true`（Terser），真正把被标记的死代码删除

## 三套配置对比

| 配置 | 阶段 | 现象 |
|------|------|------|
| `webpack.dev.js` | development | 不进行任何 tree shaking 标记，全部保留 |
| `webpack.used.js` | 仅标记 | 产物中可看到 `/* unused harmony export unusedA */`，但代码仍存在 |
| `webpack.full.js` | 标记+删除 | 未使用的 ESM 导出被完全删除 |

## ESM vs CJS

实验关键点：

- `esm-module.js`（ESM）：`unusedA`/`unusedB`/`unusedConstant` 在 full 模式下**被剔除**
- `cjs-module.js`（CommonJS）：`unusedA`/`unusedB` **始终保留**，因为 CJS 动态特性 webpack 无法静态分析

## 运行

```bash
npm install
npm run build:all
```

依次查看：
- `dist/dev/bundle.js`：含全部 ESM/CJS 代码 + dev 注释
- `dist/used/bundle.js`：注意 `/* unused harmony export */` 注释
- `dist/full/bundle.js`：ESM unused 已删除，CJS unused 仍在

## 启用条件清单

- 必须使用 ESM（`import`/`export`）
- `mode: 'production'` 或显式 `optimization.usedExports: true`
- `package.json` 标记 `sideEffects: false` 或具体白名单
- Babel 不要把 ESM 转成 CJS（`@babel/preset-env` 设置 `modules: false`）
