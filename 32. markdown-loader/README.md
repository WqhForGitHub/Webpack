# 32. markdown-loader

自定义一个 `markdown-loader`：把 `.md` 文件在打包阶段转换成 HTML 字符串，业务代码可以直接 `import html from './doc.md'`。

## 实现

`loaders/markdown-loader.js`

```js
const { marked } = require('marked');

module.exports = function (source) {
  const html = marked.parse(source);
  return `module.exports = ${JSON.stringify(html)};`;
};
```

## 关键点

- loader 本质是函数：输入源文本，输出合法 JS
- 链中最后一个执行的 loader 必须返回 JS 代码字符串
- 这里用 `marked` 完成 markdown -> html 的解析

## 运行

```bash
npm install
npm start
```
