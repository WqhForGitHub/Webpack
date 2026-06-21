# 65. cacheGroups 配置

## 演示要点

`splitChunks.cacheGroups` 是 splitChunks 的核心：所有拆包规则都是缓存组。

### 关键属性

| 属性 | 说明 |
| ---- | ---- |
| `test` | 匹配模块路径（正则/函数） |
| `name` | 拆出的 chunk 名 |
| `priority` | 优先级（多个组同时匹配时取最大） |
| `chunks` | `'all'` / `'async'` / `'initial'` |
| `minChunks` | 至少被多少 chunk 引用 |
| `reuseExistingChunk` | 复用已有 chunk |
| `enforce` | 忽略 minSize/minChunks 限制 |

## 本 demo 的拆包策略

| 缓存组 | priority | 内容 |
| ----- | --- | --- |
| `lodash` | 30 | 单独拆 lodash |
| `jquery` | 30 | 单独拆 jquery |
| `vendors` | 10 | 其他 node_modules（如 axios） |
| `common` | 5  | 业务公共模块（≥2 处引用） |

## 运行

```bash
npm install
npm run build
```

## dist 输出

```
dist/
├── lodash.[hash].js
├── jquery.[hash].js
├── vendors.[hash].js   (axios)
├── main.[hash].js      (业务代码)
└── index.html
```
