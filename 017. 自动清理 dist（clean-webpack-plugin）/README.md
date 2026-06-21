# 17. 自动清理 dist（clean-webpack-plugin）

## 简介

每次构建前清理 `dist` 目录，避免旧的 hash 文件堆积。

## 启动

```bash
npm install

# 默认：使用 webpack 5 内置 output.clean = true（推荐）
npm run build

# 兼容方案：clean-webpack-plugin
npm run build:legacy
```

## 核心要点

| 方案                 | 写法                       | 特点                       |
| -------------------- | -------------------------- | -------------------------- |
| webpack 5 内置       | `output.clean: true`       | 无需额外依赖，推荐         |
| clean-webpack-plugin | `new CleanWebpackPlugin()` | 早期方案，可保留特定文件等 |

注意：两者**不要同时启用**，否则可能重复清理或冲突。本 demo 在使用 legacy 时会把 `output.clean` 设为 `false`。
