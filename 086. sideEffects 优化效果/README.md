# 86. sideEffects 优化效果

`package.json` 中的 `sideEffects` 字段告诉 webpack 哪些模块**没有副作用**，可被 tree shake。

## 三种取值

```jsonc
"sideEffects": false              // 整个包都无副作用
"sideEffects": true               // 全部保留（默认行为）
"sideEffects": ["./src/polyfill.js", "*.css"]  // 只有这些有副作用
```

## 项目结构

```
src/
  index.js                只引用 utils 里的 add
  utils/
    index.js              桶文件 + import "./side-effect"
    add.js
    mul.js                未使用
    sub.js                未使用
    side-effect.js        修改 globalThis 的副作用模块
```

## 运行

```bash
npm install
npm run build:all
```

## 对比

- `dist/on/bundle.js`：只保留 `add` 与对 `1+2` 的调用，体积最小，`mul`/`sub`/`side-effect.js` 全部被剔除
- `dist/off/bundle.js`：保留所有模块（即使没用到），因为 webpack 不敢确定它们没副作用

## 实战注意

1. 第三方库若标记 `sideEffects: false`，桶文件 `import { x } from 'lib'` 才能成功摇掉其他导出
2. CSS 文件、polyfill 必须列入 `sideEffects` 数组，否则会被误删
3. webpack 5 production 默认 `optimization.sideEffects: true`
