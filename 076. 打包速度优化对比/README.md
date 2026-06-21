# 76. 打包速度优化对比

纯 webpack 对比 4 种打包速度优化策略，借助 `speed-measure-webpack-plugin` 输出耗时。

## 4 种场景

| 场景        | 命令                       | 关键策略                                           |
| ----------- | -------------------------- | -------------------------------------------------- |
| baseline    | `npm run build:baseline`   | 无任何优化                                         |
| cache       | `npm run build:cache`      | `cache: { type: 'filesystem' }` + babel cacheDirectory |
| exclude     | `npm run build:exclude`    | `exclude: /node_modules/` + `include: src`         |
| thread      | `npm run build:thread`     | `babel-loader` 前置 `thread-loader` 多线程         |

## 推荐对比方法

```bash
npm install
npm run build:baseline   # 第一次基线
npm run build:cache      # 第一次（写缓存，可能更慢）
npm run build:cache      # 第二次（命中缓存，应当显著加速）
npm run build:exclude
npm run build:thread
```

终端会打印每个 loader 的耗时，可看到 `babel-loader` 是大头。

## 经验总结

- 项目越大，cache（第二次）和 exclude 收益越明显
- thread-loader 仅在 loader 本身耗时较大（如 babel/ts）时有效，小项目反而慢
- 真实项目里通常组合使用：exclude + cache + 必要时 thread
