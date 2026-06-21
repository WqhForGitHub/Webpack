# 93. 模块依赖图（graph）生成

通过自定义 webpack 插件读取 `compilation.moduleGraph`，把模块依赖关系输出成 JSON 文件并打印到控制台。

## 目录结构

```
93. 模块依赖图（graph）生成/
├── plugins/
│   └── module-graph-plugin.js   # 输出依赖图的自定义插件
├── src/
│   ├── index.js                 # 入口
│   └── utils/
│       ├── math.js
│       ├── greet.js
│       └── const.js
├── webpack.config.js
└── package.json
```

## 核心思路

webpack 内部维护两张图：

- **ModuleGraph**：模块之间的引用关系（A import B）
- **ChunkGraph**：模块到 chunk 的归属关系

本 demo 的插件做了两件事：

1. 在 `compiler.hooks.emit` 阶段拿到 `compilation`；
2. 遍历 `compilation.modules`，通过 `compilation.moduleGraph.getModule(dependency)` 拿到每个 dependency 对应的 module，组装成 graph。

## 运行

```bash
npm install
npm run build
```

打包后会在 `dist/module-graph.json` 看到完整的依赖图，控制台同时输出树形结构。

## 关键点

- 一个 import 语句在 webpack 内部对应一个 `Dependency` 对象
- `moduleGraph.getModule(dep)` 把 dependency 解析成具体的 module
- 这与"手写 webpack"中我们自己 parse + traverse 出来的依赖图本质相同
