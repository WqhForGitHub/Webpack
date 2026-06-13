# 96. webpack 打包流程源码解析

通过一个"上帝视角"的插件订阅 webpack 几乎所有关键 hook，把真实的打包流程按顺序打印出来，对照源码来理解 webpack 内部到底发生了什么。

## 整体流程（与源码对照）

```
webpack(options, callback)        ← lib/webpack.js
  │
  ├─ createCompiler()
  │    ├─ new Compiler(context)              ← lib/Compiler.js
  │    ├─ NodeEnvironmentPlugin               // 注入 fs / inputFileSystem 等
  │    ├─ environment / afterEnvironment      // hooks
  │    ├─ 应用用户 plugins
  │    └─ WebpackOptionsApply.process()       ← lib/WebpackOptionsApply.js
  │         (内部插件：EntryOptionPlugin / JavascriptModulesPlugin /
  │          ImportPlugin / SplitChunksPlugin / SourceMapDevToolPlugin ...)
  │
  └─ compiler.run(callback)
       │
       ├─ beforeRun → run
       ├─ 创建 NormalModuleFactory / ContextModuleFactory
       ├─ beforeCompile → compile
       ├─ newCompilation()                ← Compilation 实例化
       │     thisCompilation / compilation hooks
       │
       ├─ make 阶段：从入口开始递归构建
       │    EntryPlugin -> compilation.addEntry()
       │     └─ factorize (用 NormalModuleFactory)
       │     └─ resolve (enhanced-resolve)
       │     └─ build (loader-runner 跑 loader → parser → 收集依赖)
       │     └─ 递归 addDependency(...)
       │     hook: buildModule → succeedModule → finishModules
       │
       ├─ seal 阶段
       │    创建 chunkGraph / chunks
       │    optimize → optimizeModules → optimizeChunks
       │    codeGeneration（生成每个模块的运行时代码）
       │    createChunkAssets（合并模块代码 + runtime → asset）
       │    processAssets（压缩、生成 source-map 等）
       │
       ├─ afterCompile → shouldEmit
       ├─ emit (写文件到输出目录)
       ├─ assetEmitted → afterEmit
       └─ done
```

## 运行

```bash
npm install
npm run build
```

控制台会按真实顺序输出形如：

```
[trace] environment
[trace] afterEnvironment
[trace] entryOption
[trace] afterPlugins
[trace] afterResolvers
[trace] initialize
[trace] beforeRun
[trace] run
[trace] normalModuleFactory created
[trace] beforeCompile
[trace] compile
[trace] thisCompilation
[trace] compilation
[trace] make
[trace] compilation.buildModule src/index.js
[trace] compilation.succeedModule src/index.js
[trace] compilation.buildModule src/hello.js
[trace] compilation.succeedModule src/hello.js
[trace] compilation.finishModules
[trace] finishMake
[trace] compilation.seal
[trace] compilation.optimize
[trace] compilation.afterOptimizeChunks
[trace] compilation.processAssets (early)
[trace] compilation.afterProcessAssets
[trace] afterCompile
[trace] shouldEmit
[trace] emit
[trace] assetEmitted bundle.js
[trace] afterEmit
[trace] done (modules=2)
```

## 关键源码文件对照

| 阶段                | 源码文件                                  |
| ------------------- | ----------------------------------------- |
| 入口                | `lib/webpack.js`                          |
| Compiler            | `lib/Compiler.js`                         |
| 内部插件批量应用    | `lib/WebpackOptionsApply.js`              |
| Compilation         | `lib/Compilation.js`                      |
| 模块工厂            | `lib/NormalModuleFactory.js`              |
| 模块构建            | `lib/NormalModule.js`                     |
| 路径解析            | `enhanced-resolve` 包                     |
| loader 调度         | `loader-runner` 包                        |
| 解析 AST            | `lib/javascript/JavascriptParser.js`      |
| chunk 优化          | `lib/optimize/SplitChunksPlugin.js`       |
| 模板渲染            | `lib/javascript/JavascriptModulesPlugin.js` |

## 关键点

- 整个流程串起来就是：**初始化 → make → seal → emit → done**
- 所有阶段都通过 tapable 提供 hook，插件就是订阅这些 hook 的"观察者"
- 后续的 demo（97 手写 webpack）会从零实现一个最小流水线，与上面输出完全对得上
