# 📦 Webpack 核心概念整理

## 🧠 什么是 Webpack

> 本质：**静态模块打包工具（module bundler）**

- 用于现代 JavaScript 应用
- 从入口开始构建 **依赖图（dependency graph）**
- 将所有模块打包成一个或多个 **bundle（静态资源）**

👉 核心流程：

```
入口 → 构建依赖图 → 打包输出 bundle
```

📌 特点：

- 支持模块化（ESM / CommonJS）
- 高度可配置
- 从 v4 开始可以“零配置”运行 ([webpack][1])

---

## 🧩 核心概念总览

Webpack 核心包括：

- 入口（entry）
- 输出（output）
- loader
- 插件（plugin）
- 模式（mode）
- 浏览器兼容性（browser compatibility）
- 环境（environment）

---

## 🚪 1. 入口（Entry）

### 概念

入口用于指定：

> 👉 从哪个文件开始构建依赖图

### 默认值

```js
./src/index.js
```

### 示例

```js
module.exports = {
  entry: "./path/to/my/entry/file.js",
};
```

### 作用

- Webpack 从入口开始
- 递归解析所有依赖（import / require）

---

## 📤 2. 输出（Output）

### 概念

> 👉 指定打包后的文件输出位置和命名方式

### 默认值

```bash
./dist/main.js
```

### 示例

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
};
```

### 核心字段

| 字段     | 作用       |
| -------- | ---------- |
| path     | 输出目录   |
| filename | 输出文件名 |

---

## 🔄 3. Loader

### 概念

> 👉 让 webpack 能处理 **非 JS 文件**

Webpack 默认只能处理：

- `.js`
- `.json`

### Loader 作用

👉 把其他文件转换成模块：

- `.css` → JS 模块
- `.vue` → JS 模块
- `.ts` → JS

### 示例

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.txt$/,
        use: "raw-loader",
      },
    ],
  },
};
```

### 核心配置

| 字段 | 作用            |
| ---- | --------------- |
| test | 匹配文件        |
| use  | 使用哪个 loader |

📌 本质：

```
文件 → loader → JS模块 → 加入依赖图
```

---

## 🔌 4. 插件（Plugin）

### 概念

> 👉 用于扩展 webpack 能力（更广泛的任务）

### 与 Loader 区别

| Loader       | Plugin           |
| ------------ | ---------------- |
| 处理文件     | 处理整个打包流程 |
| 单个模块转换 | 全局优化/增强    |

📌 常见功能：

- 打包优化
- 资源管理
- 注入环境变量
- 生成 HTML

### 示例

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};
```

📌 作用：

👉 自动生成 HTML 并注入 bundle

---

## ⚙️ 5. 模式（Mode）

### 概念

> 👉 设置打包环境，启用不同优化策略

### 可选值

```js
module.exports = {
  mode: "production", // development | production | none
};
```

### 区别

| 模式        | 特点              |
| ----------- | ----------------- |
| development | 快速构建 + 调试   |
| production  | 压缩优化 + 体积小 |
| none        | 无默认优化        |

📌 默认值：`production` ([webpack][1])

---

## 🌐 6. 浏览器兼容性

### 支持范围

- 支持 **ES5 浏览器**
- ❌ 不支持 IE8 及以下

### 注意点

- `import()` 依赖 `Promise`
- 老浏览器需要 **polyfill**

---

## 🖥️ 7. 环境（Environment）

### 要求

- Webpack 5 需要：

```bash
Node.js >= 10.13.0
```

---

## 🧠 总结（面试版）

👉 一句话总结：

> Webpack = 从入口出发 → 构建依赖图 → 通过 loader 转换模块 → 通过 plugin 扩展能力 → 输出 bundle

---

## 🧭 一张脑图式理解

```
             ┌──────────┐
             │  Entry   │
             └────┬─────┘
                  ↓
        构建 Dependency Graph
                  ↓
        ┌───────────────────┐
        │ Loader 处理模块    │
        └───────────────────┘
                  ↓
        ┌───────────────────┐
        │ Plugin 扩展能力    │
        └───────────────────┘
                  ↓
             ┌──────────┐
             │ Output   │
             └──────────┘
```
