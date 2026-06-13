# 97. 手写简易 webpack（mini-pack）

从零实现一个能跑的"迷你 webpack"，覆盖：

- 模块依赖图构建（递归 build）
- ESM 语法 → CommonJS 改写（极简版）
- 模块缓存 + 运行时（自带 `require`）
- 输出可执行的 `bundle.js`

## 目录结构

```
97. 手写简易 webpack/
├── mini-pack/
│   ├── cli.js           # 入口（相当于 webpack-cli）
│   └── compiler.js      # Compiler：build → emit
├── src/
│   ├── index.js
│   ├── math.js
│   ├── const.js
│   └── name.js
├── mini.config.js       # 用户配置（相当于 webpack.config.js）
├── webpack.config.js    # 同样配置，方便用真实 webpack 对照
└── package.json
```

## 运行

```bash
npm install

# 1) 用我们手写的 mini-pack 打包
npm run build
# -> dist/bundle.js

# 2) 直接执行 bundle 验证
npm run run:dist

# 3) 用真实 webpack 打包同一份源码做对比
npm run build:webpack
# -> dist-webpack/bundle.js
```

输出示例：

```
[mini-pack] build: src/index.js
[mini-pack] build: src/math.js
[mini-pack] build: src/const.js
[mini-pack] build: src/name.js
[mini-pack] done.
  modules: 4
  output : .../dist/bundle.js
```

执行 `node dist/bundle.js` 应输出：

```
[mini-pack demo] add(1,2)=[sum]=3, name=mini-pack
```

## 核心思路

`Compiler.run()`：

1. **buildModule(entry)** —— 递归
   - 读取源码
   - 用正则匹配所有 `import`/`require`，得到依赖列表
   - 把 ESM 关键字改写成 CommonJS（webpack 通过 AST 改写得更精细）
   - 把绝对路径作为模块 id
2. **emit()** —— 把所有模块塞进一个对象，附上 mini-runtime：

```js
(function (modules) {
  const cache = {};
  function require(id) {
    if (cache[id]) return cache[id].exports;
    const module = (cache[id] = { exports: {} });
    modules[id](module, module.exports, require);
    return module.exports;
  }
  return require(ENTRY);
})({ "/abs/path/index.js": fn, "/abs/path/math.js": fn, ... });
```

这就是 webpack 输出 bundle 的本质结构。

## 与真实 webpack 的差异

| 能力                       | mini-pack | webpack |
| -------------------------- | --------- | ------- |
| 模块依赖图                 | ✅        | ✅      |
| 多种模块类型 (cjs/esm/...)  | 简化      | 完整    |
| AST 解析                   | ❌（用正则） | ✅ acorn |
| loader / plugin            | ❌        | ✅       |
| chunk / 异步 import         | ❌        | ✅       |
| tree shaking / 压缩         | ❌        | ✅       |
| source-map                 | ❌        | ✅       |

但**主流程完全一致**：构建依赖图 → 包装模块 → 输出 IIFE。
