# 85. scope hoisting（模块合并）

## 原理

Scope Hoisting（作用域提升）由 webpack `ModuleConcatenationPlugin` 实现：
将多个模块按引用顺序合并到一个函数作用域，减少闭包包裹与函数声明，从而：

- 减少打包体积
- 加快 JS 引擎执行速度（更少函数创建）
- 仅对 ESM 有效（CommonJS 因动态特性无法合并）

## 控制开关

```js
optimization: {
  concatenateModules: true   // 开启（production 默认）
}
```

## 运行

```bash
npm install
npm run build:all
```

## 对比 dist/on/bundle.js 与 dist/off/bundle.js

**off**（每个模块独立函数）：

```js
/* a.js */
((__webpack_module__) => { /* ... */ })
/* b.js */
((__webpack_module__) => { /* ... */ })
/* c.js */
((__webpack_module__) => { /* ... */ })
```

**on**（合并到 entry 作用域）：

```js
;// CONCATENATED MODULE: ./src/a.js
function add(a, b) { return a + b; }
;// CONCATENATED MODULE: ./src/b.js
function mul(a, b) { return a * b; }
;// CONCATENATED MODULE: ./src/c.js
function square(x) { return mul(x, x); }
```

模块边界变为注释，函数可被 V8 直接 inline，性能更好。
