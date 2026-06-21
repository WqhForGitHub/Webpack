# 06. devtool 对比实验

通过同一份源码 + 同一份 webpack 配置，仅切换 `devtool`，对比不同模式下的：

- 构建耗时
- 产物体积（bundle + 可能伴随的 .map 文件）
- 浏览器调试体验（堆栈是否能映射到源码）

## 用法

```bash
npm install
npm run build       # 一次性跑全部模式，并打印对比表
```

也可以单独构建某种模式：

```bash
npm run build:source-map
npm run build:eval
npm run build:cheap-module-source-map
# ...
```

打开 `index.html`，修改其中 `<script src>` 指向不同 `dist/<mode>/bundle.js`，
点击 “触发错误” 按钮，在 DevTools 控制台查看堆栈定位到的源码差别。

## 简要结论

| 模式                           | 是否生成独立 .map    | 调试粒度                     | 构建速度 | 适用场景           |
| ------------------------------ | -------------------- | ---------------------------- | -------- | ------------------ |
| `eval`                         | 否（嵌入 eval）      | 行级                         | 极快     | 开发调试           |
| `eval-cheap-source-map`        | 否                   | 行级（不到列）               | 快       | 开发调试           |
| `eval-cheap-module-source-map` | 否                   | 行级（含 loader 处理前源码） | 快       | 开发调试推荐       |
| `eval-source-map`              | 否                   | 行+列                        | 中       | 调试质量高         |
| `cheap-source-map`             | 是                   | 行级                         | 中       | —                  |
| `cheap-module-source-map`      | 是                   | 行级（loader 前）            | 中       | —                  |
| `source-map`                   | 是                   | 行+列，原始源码              | 慢       | 生产排错           |
| `inline-source-map`            | 否（DataURL 内嵌）   | 行+列                        | 慢       | 不推荐生产         |
| `hidden-source-map`            | 是，但 bundle 不引用 | 行+列                        | 慢       | 生产 + 错误监控    |
| `nosources-source-map`         | 是，但不含源码       | 行+列                        | 慢       | 生产，仅给堆栈映射 |
| `false` / 不设置               | 否                   | 无                           | 最快     | 不需要 sourcemap   |
