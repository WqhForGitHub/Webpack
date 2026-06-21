# 66. 公共模块抽离

## 演示要点

业务代码中，多个入口（home / about / contact）都引用了 `src/utils/format.js`。

通过 `cacheGroups.common` 配置 `minChunks: 2`，让 webpack 把它单独抽到 `common.js`，避免重复打包。

```js
cacheGroups: {
  common: {
    name: "common",
    minChunks: 2,        // 至少被 2 个 chunk 引用才抽出
    priority: 5,
    chunks: "all",
    reuseExistingChunk: true,
  },
},
```

## 运行

```bash
npm install
npm run build
```

## dist 输出

```
dist/
├── home.[hash].js
├── about.[hash].js
├── contact.[hash].js
├── common.[hash].js   ← format.js 在这里
├── home.html
├── about.html
└── contact.html
```

每个 HTML 通过 `chunks: ["common", "xxx"]` 同时注入 `common` 与对应业务 chunk。
