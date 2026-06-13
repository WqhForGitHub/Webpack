# 72. Tree Shaking（副作用）

## 演示要点

Tree Shaking = **静态分析 + DCE**：webpack 标记未使用的 ES Module 导出，由 Terser 删除。

### 三个必要条件

1. ES Modules 静态 `import/export`（不要用 CommonJS）
2. `mode: "production"`（自动 `usedExports + minimize`）
3. `package.json` 中正确声明 `sideEffects`

### sideEffects 字段

```json
{
  "sideEffects": false                       // 整包无副作用，最激进
}
{
  "sideEffects": ["*.css", "./src/polyfill.js"]  // 仅这些文件有副作用
}
```

> 标记为「无副作用」后，**未被使用的整个模块**也能被删掉，否则 webpack 即使知道导出未用，也会保留 import 语句以执行其副作用。

## 本 demo 设置

`package.json`：
```json
"sideEffects": ["*.css", "./src/polyfill.js"]
```

`src/index.js`：只 import `add` 和有副作用的 `polyfill.js`

期望结果：
- ✅ `add` 保留
- ✅ `polyfill.js` 整段保留（修改 window 全局）
- ❌ `sub` / `mul` / `heavyButUnused` 删除
- ❌ 整个 `utils/log.js` 删除

## 运行

```bash
npm install
npm run build
```

打开 `dist/main.[hash].js`，搜索：
- `heavyButUnused` → 找不到 ✅
- `__APP_POLYFILL_LOADED__` → 仍存在 ✅

## 对比实验

把 `package.json` 中 `sideEffects` 删除，再次打包，会发现：
- `heavyButUnused` 仍然被删（usedExports 起作用）
- 但如果 `utils/log.js` 顶层有副作用代码（如 `console.log`），它会被保留

而声明 `sideEffects: false` 后，webpack 才能放心删除整个模块的 import 语句。
