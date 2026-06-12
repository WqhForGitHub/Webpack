# 19. 环境区分（dev/prod 配置拆分）

## 简介

通过 `webpack-merge` 将配置拆分为：

- `build/webpack.base.js`：通用配置（entry、output、plugins、resolve、HtmlWebpackPlugin）
- `build/webpack.dev.js`：开发环境差异（style-loader、devServer、cheap source-map）
- `build/webpack.prod.js`：生产环境差异（mini-css-extract-plugin、source-map）

## 启动

```bash
npm install
npm start       # 用 build/webpack.dev.js
npm run build   # 用 build/webpack.prod.js
```

## 核心要点

1. `webpack-merge` 的 `merge()` 会智能合并 `module.rules`、`plugins` 等数组字段；
2. 公共配置只写一份，环境差异只在各自文件里维护；
3. `--config` 显式指定配置文件路径；
4. 项目变大后建议升级为 `merge.smart` 或者把 `rules` 也按文件拆分。
