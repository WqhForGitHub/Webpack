# 82. gzip, brotli 压缩

纯 webpack 演示用 `compression-webpack-plugin` 在构建期生成 `.gz` 与 `.br` 静态预压缩文件。

## 运行

```bash
npm install
npm run build:prod
```

构建产物：

```
dist/
├── index.html
├── index.html.gz
├── index.html.br
├── js/
│   ├── main.xxx.js
│   ├── main.xxx.js.gz       # gzip 版本
│   └── main.xxx.js.br       # brotli 版本
└── css/
    ├── main.xxx.css
    ├── main.xxx.css.gz
    └── main.xxx.css.br
```

## 体积对比

通常对于 lodash + 业务代码这类内容：

| 文件        | 体积比例（粗略）  |
| ----------- | ----------------- |
| 原始        | 100%              |
| gzip        | ~30%              |
| brotli      | ~25%              |

## 在服务端启用

只压缩好文件不够，还需要服务器返回正确的 `Content-Encoding`。

### nginx

```nginx
gzip_static on;       # 自动返回同名 .gz
brotli_static on;     # 自动返回同名 .br
```

### Express

```js
app.use(require("express-static-gzip")(path.join(__dirname, "dist"), {
  enableBrotli: true,
  orderPreference: ["br", "gz"],
}));
```

## 关键参数

| 参数                 | 说明                                              |
| -------------------- | ------------------------------------------------- |
| `algorithm`          | `'gzip'` 或 `'brotliCompress'`                    |
| `test`               | 哪些文件参与压缩（`/\.(js\|css\|html\|svg)$/`）   |
| `threshold`          | 文件大于多少字节才压缩（默认 0）                   |
| `minRatio`           | 压缩比小于多少才保留（避免压缩后反而变大）         |
| `filename`           | 输出文件名模板，默认 `[path][base].gz`            |
| `deleteOriginalAssets` | 是否删除原文件（一般保持 false，按需双投递）       |
