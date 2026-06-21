# 92. webpack runtime 分析

## 什么是 webpack runtime？

webpack 把开发者代码包裹起来后，需要一段**运行时代码**来：

1. 维护模块缓存 `__webpack_module_cache__`
2. 实现 `__webpack_require__(moduleId)`
3. 异步 chunk 加载 `__webpack_require__.e`
4. 定义 ESM/CJS 互操作 `__webpack_require__.r` / `__webpack_require__.n`
5. 暴露 hash、publicPath 等 `__webpack_require__.h`、`__webpack_require__.p`

这段代码会被打包进 entry chunk（默认）或抽离为单独 `runtime.js`。

## 三套配置对比

```bash
npm install
npm run build:all
```

| 配置 | 产物 | runtime 特点 |
|------|------|--------------|
| `webpack.single.js`（仅同步） | `dist/single/bundle.js` | 最小 runtime：只有 `__webpack_require__` + module cache |
| `webpack.async.js`（含 import()） | `dist/async/bundle.js` + `lazy.chunk.js` | 增加 `__webpack_require__.e`、`f.j`（jsonp loading）、`l`、`o`、`p` 等 |
| `webpack.split.js`（runtimeChunk:single） | `dist/split/runtime.js` + `main.js` + chunks | runtime **独立成文件**，便于长缓存 |

## 阅读要点

打开 `dist/async/bundle.js` 找以下片段：

```js
// 模块缓存
var __webpack_module_cache__ = {};

// require 函数本体
function __webpack_require__(moduleId) {
  var cachedModule = __webpack_module_cache__[moduleId];
  if (cachedModule !== undefined) return cachedModule.exports;
  var module = __webpack_module_cache__[moduleId] = {
    exports: {}
  };
  __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
  return module.exports;
}

// 异步加载入口（chunk loading）
__webpack_require__.e = function (chunkId) {
  return Promise.all(...);
};

// jsonp 实现
__webpack_require__.f.j = function (chunkId, promises) { ... };

// 自定义脚本插入
__webpack_require__.l = function (url, done, key, chunkId) { ... };

// ESM marker
__webpack_require__.r = function (exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
};
```

## 为什么 runtimeChunk: 'single' 重要

业务代码改动会让 entry hash 变化，但若 runtime 与 entry 在一起，
runtime 也会变 hash，导致缓存全部失效。

抽离后：

- `runtime.js` 内容稳定（只在 webpack 升级时变化）
- `main.<contenthash>.js` 变更不影响 runtime 缓存
- 多入口共享同一份 runtime，避免重复

## 进一步研究

webpack 5 把 runtime 拆成了多个 RuntimeModule（在 `lib/runtime/`），
按需注入。可以执行 `webpack --stats-runtime` 查看启用了哪些 runtime 模块。
