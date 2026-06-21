# 75. Dead code elimination

纯 webpack 演示 DCE（死代码消除）。

## 与 Tree Shaking 的区别

- Tree Shaking：基于 ESM 静态分析，删除「没人用的 export」。
- DCE：由 Terser 在压缩阶段执行，删除「永远不会执行/到达的代码」。

## 运行

```bash
npm install
npm run build:prod
```

打开 `dist/bundle.js`，应观察到：

- `if (false) { ... }` 整块消失
- `if (__DEV__)` 被替换为 `if (false)` 后整块消失
- `return` 后的语句被删除
- `1 + 2 + 3` 折叠为 `6`
- `NEVER_USED` 完全不出现

## 同时构建 dev 版本对比

```bash
npm run build:dev
```

development 模式默认不压缩，因此死代码会原样保留，可以与 prod 模式对比。
