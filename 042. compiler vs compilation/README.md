# 42. compiler vs compilation

通过自定义 `InspectPlugin` 在控制台直观对比 webpack 中两个最核心的对象。

## 概念

| 概念 | 何时创建 | 持有什么 |
| --- | --- | --- |
| `compiler` | 整个 webpack 进程**只创建一次** | 全局配置 `options`、文件系统、运行环境、钩子定义 |
| `compilation` | **每次编译**都新建一次（watch/HMR 会反复创建） | 本次 modules / chunks / assets / hash / entrypoints |

一句话总结：
> compiler 是"工厂"（只有一个），compilation 是工厂里每次开工产出的一批"半成品 + 成品"（可以多次）。

## 实操观察

```bash
npm install
npm start          # 启动 dev-server
# 然后修改 src/index.js，观察终端日志：
#   [compiler] environment 只打印 1 次
#   [compilation] 第 N 次创建 ... 会随每次重编译累加
```

或者：

```bash
npm run build      # 一次性构建：environment 1 次、compilation 1 次
```

## 关键代码

```js
compiler.hooks.environment.tap("Inspect", () => { /* 只一次 */ });
compiler.hooks.compilation.tap("Inspect", (compilation) => {
  // 每次编译都进来一次；可以继续 tap compilation 内部钩子
});
```
