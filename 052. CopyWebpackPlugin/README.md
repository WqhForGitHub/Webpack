# 52. CopyWebpackPlugin

`copy-webpack-plugin` 用于把 **不需要 webpack 处理** 的静态资源直接拷贝到输出目录。常见场景：

- `public/` 中的 `robots.txt` / `manifest.json` / `favicon.ico`
- 第三方下载的库、字体文件
- 静态页面、`static/` 目录

## 目录结构
```
public/
├── manifest.json
├── robots.txt
└── static/
    └── about.html
```

打包后会被原样拷贝到 `dist/`。

## 配置要点
```js
new CopyPlugin({
  patterns: [
    {
      from: path.resolve(__dirname, "public"),
      to:   path.resolve(__dirname, "dist"),
      globOptions: { ignore: ["**/.DS_Store"] },
      noErrorOnMissing: true,
    },
  ],
})
```

## 运行
```bash
npm install
npm run build
```

查看 `dist/`，会同时存在 `bundle.js` 和 `manifest.json` / `robots.txt` / `static/about.html`。
