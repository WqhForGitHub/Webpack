# 18. DefinePlugin 注入环境变量

## 简介

`webpack.DefinePlugin` 在**编译期**把代码中出现的标识符替换为字面量。

## 启动

```bash
npm install
npm start
npm run build
```

## 核心要点

1. value 必须是「JS 代码字符串」：
   - 注入字符串：`JSON.stringify('production')`
   - 注入对象：`JSON.stringify({ a: 1 })`
   - 注入布尔/数字：`true` / `123` / 也可用 `JSON.stringify`
2. 替换发生在编译期，运行时性能为 0；
3. `if (__IS_PROD__) { ... }` 在生产构建中被替换成 `if (true) { ... }`，未命中分支可被 Terser 消除（dead code elimination）；
4. 与 `process.env.NODE_ENV` 配合可以让大量第三方库（如 React）走生产路径。
