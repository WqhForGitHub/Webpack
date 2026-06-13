# 55. 多 HTML 页面生成

适用于多页应用（MPA），每个页面有独立的 HTML 与入口 JS。

## 关键配置
1. **多入口**
   ```js
   entry: { home: ..., about: ..., contact: ... }
   ```
2. **多个 `HtmlWebpackPlugin` 实例**，每个对应一个页面
3. **`chunks` 选项**：指定该 HTML 应注入哪些入口的 chunk
   ```js
   new HtmlWebpackPlugin({
     filename: "about.html",
     chunks: ["about"],
   })
   ```

## 输出结构
```
dist/
├── home.html          (注入 js/home.[hash].js)
├── about.html         (注入 js/about.[hash].js)
├── contact.html       (注入 js/contact.[hash].js)
└── js/
    ├── home.xxx.js
    ├── about.xxx.js
    └── contact.xxx.js
```

## 优化方向
- 抽取公共代码：`optimization.splitChunks`
- 共享模板：用同一个 `template.html`，靠 `htmlWebpackPlugin.options.title` 区分

## 运行
```bash
npm install
npm run build
```
