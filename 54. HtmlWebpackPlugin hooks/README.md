# 54. HtmlWebpackPlugin hooks

`HtmlWebpackPlugin` 在 `compilation` 阶段暴露了一组钩子，允许其他插件介入 HTML 生成流程。

## 5 大核心 hook
| Hook | 时机 | 用途 |
|------|------|------|
| `beforeAssetTagGeneration` | 资源标签生成前 | 修改 `assets` 列表 |
| `alterAssetTags` | 资源标签生成后 | 修改 `<script>` `<link>` 的属性 |
| `alterAssetTagGroups` | 标签分组（head / body）后 | 调整标签放置位置 |
| `afterTemplateExecution` | 模板渲染完成后 | 修改 html 字符串、标签 |
| `beforeEmit` | HTML 写入磁盘前 | 最后一次修改 html 内容 |
| `afterEmit` | HTML 写入磁盘后 | 日志、通知等副作用 |

## 获取方式
```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
compiler.hooks.compilation.tap("X", (compilation) => {
  const hooks = HtmlWebpackPlugin.getHooks(compilation);
  hooks.alterAssetTags.tapAsync("X", (data, cb) => { ... });
});
```

## 本 demo 演示
- `alterAssetTags`：给所有 `<script>` 加上 `defer`
- `beforeEmit`：在 HTML 末尾插入注释
- `afterEmit`：在终端输出日志

## 运行
```bash
npm install
npm run build
```
查看 `dist/index.html`：
- `<script defer src="bundle.js">` 已加 defer
- `</body>` 上方有 `<!-- Injected by HtmlHooksDemoPlugin -->`
