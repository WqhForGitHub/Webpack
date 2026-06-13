# 67. runtimeChunk

## 演示要点

`optimization.runtimeChunk` 用于把 webpack **运行时代码**（chunk loading、module map）抽出。

### 取值

| 值 | 行为 |
| --- | --- |
| `false` | 运行时打进每个 entry chunk |
| `true` / `'multiple'` | 每个 entry 一个 `runtime~xxx.js` |
| `'single'` | 全局一个 `runtime.js` |
| `{ name: fn }` | 自定义命名 |

### 价值：长缓存

业务代码 → 改变 → 模块 id 映射变化 → 运行时 hash 变化。
不抽 runtime 时，会"传染"到 main 或 vendor，导致 vendor 的 contenthash 也变。
抽出 runtime 后，vendor.js 几乎永不失效。

## 运行

```bash
npm install
npm run build
```

## dist 输出

```
dist/
├── runtime.[hash].js     ← webpack 运行时
├── vendors.[hash].js     ← lodash
├── app.[hash].js         ← 业务
└── index.html
```

> 修改 `src/index.js` 后再次打包，对比 `vendors.[hash].js` 是否保持不变。
