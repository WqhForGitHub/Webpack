# 94. tapable 原理（简化实现）

手写一个简化版 `tapable`，并把它接入 webpack 流程，理解 webpack 插件机制的"心脏"。

## 目录结构

```
94. tapable 原理（简化实现）/
├── tapable-mini/
│   ├── SyncHook.js
│   ├── SyncBailHook.js
│   ├── SyncWaterfallHook.js
│   ├── AsyncSeriesHook.js
│   ├── AsyncParallelHook.js
│   ├── index.js
│   └── demo.js              # 5 种 hook 的纯 Node 演示
├── plugins/
│   └── use-mini-tapable-plugin.js  # 在 webpack 中使用我们手写的 tapable
├── src/index.js
├── webpack.config.js
└── package.json
```

## tapable 简化模型

| Hook                  | 行为                                                  |
| --------------------- | ----------------------------------------------------- |
| `SyncHook`            | 同步串行，按注册顺序依次调用                          |
| `SyncBailHook`        | 任一 tap 返回非 undefined 即终止后续                  |
| `SyncWaterfallHook`   | 上一个 tap 的返回值传给下一个 tap                     |
| `AsyncSeriesHook`     | 异步串行，必须 `cb()` 后下一个才执行                  |
| `AsyncParallelHook`   | 异步并行，所有 tap 全部 `cb()` 后才完成               |

核心思想：**Hook 就是一个带顺序的回调数组 + 一种"调度策略"**。

## 运行

### 1) 单纯运行 mini-tapable

```bash
npm install
npm run demo
```

输出展示了 5 种 hook 的不同执行流程。

### 2) 在 webpack 中使用

```bash
npm run build
```

`UseMiniTapablePlugin` 内部维护一组用我们自己手写 `SyncHook` / `AsyncSeriesHook` 创建的钩子，并把它们嫁接到 webpack 真实的 `compiler.hooks.emit` / `compiler.hooks.done` 上。

## 关键点

- webpack 自身的所有插件机制都建立在 tapable 上
- "tap"：注册回调；"call"：触发回调
- 不同 Hook 的差别只在于"如何调度回调数组"
- 真正的 tapable 还有 interceptor、HookCodeFactory（动态生成调用函数）、HookMap 等高级特性，本 demo 只保留最核心的部分
