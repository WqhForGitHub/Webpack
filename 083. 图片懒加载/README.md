# 83. 图片懒加载

纯 webpack 实现 **图片懒加载** 的 demo。

## 核心原理

1. **`IntersectionObserver`**：监听占位元素是否进入视口
2. **`import()` 动态导入**：webpack 会把每个图片切成独立 chunk，懒加载触发时才请求
3. **webpack 5 asset modules**：自动处理图片为 URL/base64

## 关键配置

```js
output: {
  chunkFilename: "chunks/[name].[contenthash:8].js",
  assetModuleFilename: "images/[name].[contenthash:8][ext]",
}
module.rules: [
  { test: /\.(png|jpe?g|gif|svg)$/i, type: "asset" }
]
```

## 运行

```bash
npm install
npm run serve
```

## 观察

- 打开 DevTools → Network
- 初次加载只请求主 bundle
- 向下滚动，每个占位进入视口时才请求对应的 image chunk
