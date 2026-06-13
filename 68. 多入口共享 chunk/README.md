# 68. 多入口共享 chunk

## 演示要点

多入口情况下，让多个 entry 共用同一个 vendor/工具 chunk：

### 方式一：`splitChunks.chunks: 'all'`（最常用）

webpack 自动识别多个 chunk 共同引用的模块，抽到 `vendors.js` / `common.js`。

### 方式二：`entry.dependOn`（webpack 5 新特性）

显式声明 entry 依赖另一个 entry：

```js
entry: {
  shared: ["lodash", "jquery"],
  pageA: { import: "./src/pageA.js", dependOn: "shared" },
  pageB: { import: "./src/pageB.js", dependOn: "shared" },
}
```

> 使用 `dependOn` **必须**配合 `optimization.runtimeChunk: "single"`，否则会出现"shared module is not allowed"错误。

## 运行

```bash
npm install
npm run build
```

## dist 输出

```
dist/
├── runtime.[hash].js
├── shared.[hash].js     ← lodash + jquery
├── pageA.[hash].js
├── pageB.[hash].js
├── pageA.html
└── pageB.html
```

`pageA.html` / `pageB.html` 都会注入 `runtime + shared + 自身 chunk`。
