# 69. 异步 chunk 加载流程

## 演示要点

`import('xxx')` 是 webpack 实现代码分割与按需加载的核心。

### 加载流程

```
主 chunk 执行
   ↓
import('./math') 调用
   ↓
__webpack_require__.e(chunkId)
   ↓
创建 <script> 标签 (JSONP)
   ↓
chunk 加载完成 → 注册到 webpackJsonp 全局数组
   ↓
触发 Promise resolve
   ↓
执行 .then 中的逻辑
```

### Magic Comments

| 注释 | 作用 |
| ---- | ---- |
| `webpackChunkName: "name"` | 自定义 chunk 名 |
| `webpackPrefetch: true` | 浏览器空闲时预取 |
| `webpackPreload: true` | 与父 chunk 并行加载 |
| `webpackMode: "lazy"/"eager"/"weak"` | 加载模式 |

### 关键配置

```js
output: {
  chunkFilename: "chunks/[name].[contenthash:8].js",
  publicPath: "/",  // 必须配置正确，否则异步 chunk 404
}
```

## 运行

```bash
npm install
npm run build
npm run serve   # 通过 http-server 启动 dist
```

打开 DevTools Network 面板：
- 首屏只下载 `main.js`
- 点击按钮 → 看到 `chunks/math.xxx.js` 请求
- prefetch 的 chunk 在 `<link rel="prefetch">` 中提前下载
