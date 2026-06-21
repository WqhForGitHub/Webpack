# 35. csv-loader

纯 webpack 自定义 csv-loader：把 `.csv` 文件解析为对象数组导入。

## 安装

```bash
npm install
```

## 运行

```bash
npm start
npm run build
```

## 关键点

- 自定义 loader：`loaders/csv-loader.js`，用 papaparse 进行 `header + dynamicTyping` 解析。
- 输出 `module.exports = [{...}, ...]`。
- `import users from './users.csv'` 拿到的是数组，可以直接渲染为表格。
