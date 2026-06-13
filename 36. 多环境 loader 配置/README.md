# 36. 多环境 loader 配置

同一份 `webpack.config.js`，根据 `argv.mode` 自动切换 loader 与 plugin：

| 环境 | CSS loader 链 | CSS 处理方式 |
| --- | --- | --- |
| development | `style-loader` + `css-loader` | 注入到 `<style>`，HMR 友好 |
| production  | `MiniCssExtractPlugin.loader` + `css-loader` | 抽离为独立 `.css` 文件 |

## 安装

```bash
npm install
```

## 运行

```bash
# 开发：style-loader
npm start

# 生产：抽离 css
npm run build
```

打开 `dist/` 查看：生产构建会生成 `css/main.[hash].css`，开发模式则不会。
