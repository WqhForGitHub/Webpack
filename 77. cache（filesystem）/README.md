# 77. cache（filesystem）

纯 webpack 5 演示持久化缓存：`cache: { type: 'filesystem' }`。

## 核心配置

```js
cache: {
  type: 'filesystem',
  cacheDirectory: path.resolve(__dirname, '.webpack-cache'),
  name: 'prod-cache',
  version: '1.0.0',
  buildDependencies: { config: [__filename] },
}
```

## 实验

```bash
npm install
npm run clean      # 清除缓存 + dist
npm run build      # 第一次：写缓存，较慢
npm run build      # 第二次：命中缓存，明显加速
```

注意终端 stats 中的 `compile time`：第二次通常能减少 50%~90%。

## 缓存失效条件

- 修改 `webpack.config.js`（被 `buildDependencies.config` 监听）
- 修改 `cache.version`
- 修改 `cache.name`
- 删除 `.webpack-cache` 目录

## 注意

- 缓存目录会越来越大，CI 环境可定期清理
- 如果配置依赖了其他文件（例如 `.env`），把它们也加到 `buildDependencies` 里
