# 89. 减少 chunk 数量

太多小 chunk 会导致：

- 浏览器并发请求多
- HTTP 头开销大
- 缓存命中率下降（每个 chunk 都有 hash）

## 三种减少 chunk 的策略

| 策略 | 配置 | 适用场景 |
|------|------|----------|
| `LimitChunkCountPlugin` | `maxChunks: 2` | 强制限制 chunk 总数 |
| `MinChunkSizePlugin` | `minChunkSize: 10240` | 合并过小的 chunk |
| `splitChunks` | 调整 `minSize`/`maxSize` | 按尺寸自动分包 |

## 运行

```bash
npm install
npm run build:all
```

对比：

- `dist/default/`：5 个动态 import → 5 个 chunk + 1 个 entry = 6 个文件
- `dist/limit/`：被合并到 2 个文件
- `dist/min/`：小 chunk 被合并

## 4 种额外手法

```js
// 1. 关闭异步 chunk 拆分（合并到入口）
optimization: { splitChunks: false }

// 2. magic comment：多个 import 共用同一 chunk
import(/* webpackChunkName: "shared" */ "./a")
import(/* webpackChunkName: "shared" */ "./b")  // 合并到 shared.chunk.js

// 3. webpackMode: eager（不创建额外 chunk，编译时同步加载）
import(/* webpackMode: "eager" */ "./a")

// 4. require.context 在 entry 内同步引入
const ctx = require.context("./pages", false, /\.js$/);
```

## 注意

减少 chunk 数量 ≠ 越好。要在 **首屏 size** 与 **请求数** 之间平衡：
HTTP/2 多路复用下，多个小 chunk 的负担已大幅降低。
