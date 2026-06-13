# 51. BannerPlugin（版权声明）

`webpack.BannerPlugin` 用于在打包后的每个 chunk 头部插入注释，常见用途：
- 版权声明 / 公司信息 / License
- 注入版本号、构建时间、git commit
- 给某些 hash 文件标记来源

## 配置
```js
new webpack.BannerPlugin({
  banner: "your text",
  entryOnly: true,    // 只对入口文件
  include: /\.js$/,
  exclude: /vendor/,
  raw: false,         // false 时自动包 /* ... */；true 时原样输出
})
```

## 运行
```bash
npm install
npm run build
```

打开 `dist/bundle.js`，最顶部就能看到一段块注释，包含 name / version / 构建时间 / 版权信息。
