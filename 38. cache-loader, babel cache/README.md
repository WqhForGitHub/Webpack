# 38. cache-loader + babel cache

三层缓存叠加示例：

| 层 | 来源 | 作用 |
| --- | --- | --- |
| L1 | `cache-loader` | 缓存其后所有 loader 的执行结果 |
| L2 | `babel-loader` 的 `cacheDirectory` | 缓存 babel 转译结果 |
| L3 | webpack5 内置 `cache: { type: 'filesystem' }` | 缓存整个模块图 |

> 说明：webpack5 自带 filesystem cache 已能覆盖大多数场景，`cache-loader` 在 webpack5 中通常不再必需。这里仅作教学演示。

## 安装

```bash
npm install
```

## 运行

```bash
# 第一次构建（冷启动）
npm run build:cold

# 再次构建（命中缓存，明显更快）
npm run build
```

可以观察 `node_modules/.cache/` 下生成的：
- `webpack/`（webpack5 filesystem cache）
- `cache-loader/`
- `babel-loader/`

清理缓存：
```bash
rimraf node_modules/.cache
```
