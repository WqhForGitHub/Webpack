# 70. chunk 命名策略

## 演示要点

webpack 中三类 chunk 的命名来源：

| chunk 类型 | 配置项 | 名字来源 |
| --- | --- | --- |
| 入口 chunk | `output.filename` | entry 对象的 key |
| 异步 chunk | `output.chunkFilename` | `webpackChunkName` magic comment |
| splitChunks | `cacheGroups[x].name` | 字符串 / 函数 / `false` |

### 占位符

| 占位符 | 何时变化 | 推荐 |
| --- | --- | --- |
| `[name]` | chunk 名 | ✅ |
| `[id]` | 数字 id | ❌ 不稳定 |
| `[hash]` | 整体 build | ❌ 缓存差 |
| `[chunkhash]` | chunk 自身 + 依赖 | ⚠️ |
| `[contenthash]` | 仅内容变化 | ✅ 长缓存首选 |

### 本 demo 的命名结果

```
dist/js/
├── app.[contenthash].js              ← 入口
├── admin.[contenthash].js            ← 入口
├── vendor-lodash.[contenthash].js    ← splitChunks 命名
└── async/
    └── user-profile.[contenthash].chunk.js  ← magic comment
```

### `splitChunks.name` 函数式命名

```js
name(module) {
  const pkg = module.context.match(/node_modules[\\/](.*?)([\\/]|$)/);
  return `vendor-${pkg[1]}`;
}
```

可按 npm 包名动态生成 chunk 名，便于按包做缓存。
