# 100. 浏览器加载 chunk 过程（JSONP）

直观演示 webpack 在浏览器中如何通过 JSONP 加载异步 chunk。

## 核心问题

`import('./async-feature')` 在浏览器里是怎么把另一个 JS 文件拉下来并执行的？

答：**JSONP**——动态插入 `<script>` 标签 + 全局 push 回调注册模块。

## JSONP 完整流程

```
1) 主 bundle 中：
   import('./async-feature')
     |
     v
   __webpack_require__.e(chunkId)   // runtime 提供
     |
     v
   生成 Promise，记录 [resolve, reject]
     |
     v
   document.head.appendChild(
     <script src="/dist/async-feature.chunk.js" />
   )

2) async-feature.chunk.js 文件内容（webpack 生成）：
   (self.myJsonp = self.myJsonp || []).push([
     [chunkId],                // 我是哪个 chunk
     {                         // 我携带的模块
       "./src/async-feature.js": function (module, exports, require) {
         // ... 模块编译后的代码
       }
     }
   ]);

3) 在 runtime 加载时，已经把 myJsonp.push 替换成了一个函数：
   const original = Array.prototype.push;
   self.myJsonp.push = function (data) {
     // 1. 注册 modules 到 __webpack_modules__
     // 2. 找到 chunkId 的 Promise，resolve()
     // 3. original.call(this, data);
   }

4) Promise resolve -> import() 的 .then() 拿到模块导出
```

## 目录结构

```
100.  浏览器加载 chunk 过程（JSONP）/
├── src/
│   ├── index.js           # 主入口
│   └── async-feature.js   # 动态 import 的 chunk
├── dist/                  # 打包产物（构建后生成）
├── index.html
├── server.js              # 极简静态服务器
├── webpack.config.js
└── package.json
```

## 运行

```bash
npm install
npm run build      # 打包
npm run serve      # 起静态服务
# 浏览器打开 http://localhost:3000/
```

打开 DevTools：
- **Network**：点击按钮时会看到一条新的 `async-feature.chunk.js` 请求
- **Console**：会看到 `loadChunk` 的耗时日志

## 关键点

### 配置项

| 配置                        | 含义                                                    |
| --------------------------- | ------------------------------------------------------- |
| `output.chunkLoading`       | chunk 加载方式：`'jsonp'`（web 默认） / `'import'` / `false` |
| `output.chunkLoadingGlobal` | JSONP 全局数组的名字（默认 `webpackChunkXXX`），本 demo 改为 `myJsonp` |
| `output.chunkFilename`      | 异步 chunk 的文件名模板                                 |
| `output.publicPath`         | runtime 加载 chunk 时的 url 前缀                        |
| `optimization.runtimeChunk` | 是否把 runtime 抽成单独文件，便于查看 JSONP 实现        |

### 在产物里你能看到什么

- `dist/runtime.bundle.js`：包含 `__webpack_require__.e`、JSONP 安装代码（重写 `myJsonp.push`）
- `dist/main.bundle.js`：业务代码 + `import()` 编译后的 `__webpack_require__.e(123).then(...)`
- `dist/async-feature.chunk.js`：以 `(self.myJsonp = self.myJsonp || []).push([...])` 开头

打开 `runtime.bundle.js` 搜索 `myJsonp` 关键字，可以看到完整的 JSONP 安装逻辑。

### 与传统 JSONP 的差别

| 传统 JSONP（跨域取数据） | webpack JSONP（加载 chunk）        |
| ------------------------ | ---------------------------------- |
| 用 callback 接收 JSON    | 用全局数组 push 注册 chunk modules |
| 一次性                   | 多个 chunk 共用一个数组            |
| 主要解决跨域             | 主要实现"代码分割 + 异步加载"      |

### 其他 chunkLoading 模式

- `'import'`：使用原生 `import()`，输出 ESM chunk（需要 `output.module: true`）
- `'require'`：Node.js 环境用
- `false`：不支持异步 chunk
