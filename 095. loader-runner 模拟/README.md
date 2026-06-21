# 95. loader-runner 模拟

手写一个简化版 `loader-runner`，理解 webpack 调用 loader 链的真实流程：

> pitch 阶段（左 → 右） → 读文件 → normal 阶段（右 → 左）

## 目录结构

```
95. loader-runner 模拟/
├── loader-runner-mini/
│   ├── runner.js     # 我们自己的 runLoaders 实现
│   └── demo.js       # 不用 webpack，直接跑 loader 链
├── loaders/
│   ├── upper-loader.js     # 同步：转大写
│   ├── banner-loader.js    # 同步：加横幅
│   ├── async-loader.js     # 异步：this.async()
│   ├── pitch-loader.js     # 演示 pitch 短路
│   └── to-module-loader.js # 把 txt 包装成 JS 模块（webpack 用）
├── src/
│   ├── source.txt
│   └── index.js
├── webpack.config.js
└── package.json
```

## 运行

```bash
npm install

# 1) 跑我们自己的 mini-runner
npm run demo

# 2) 跑 webpack 真实 loader-runner（同一组 loader）
npm run build
```

把两次输出对比，会发现日志顺序、最终结果完全一致。

## 流程图

```
loaders = [A, B, C, D]      // 配置时 A 最先写

pitch 阶段（从左到右）：
  A.pitch -> B.pitch -> C.pitch -> D.pitch
  若任一 pitch 返回非 undefined，立即 "回头" 进入 normal

读取文件：fs.readFileSync(resource)

normal 阶段（从右到左）：
  D.normal -> C.normal -> B.normal -> A.normal
```

## 关键点

- 一个 loader 文件就是一个 `function (content) { ... return result }`
- `module.exports.pitch` 可以"抢先"返回结果以跳过后续 loader
- `this.async()` 取得异步回调；返回 `undefined` 表示这是异步 loader
- webpack 内部用的是 `loader-runner` 这个 npm 包，原理和本 demo 一致，只是支持更复杂的 raw、pitch、normal 选项与错误处理
