# 33. raw-loader（加载字符串）

纯 webpack 自定义 raw-loader：把任意文本文件原样作为字符串导入到 JS 中。

## 安装

```bash
npm install
```

## 运行

```bash
# 开发模式
npm start
# 生产构建
npm run build
```

## 关键点

- `resolveLoader.modules` 指向本地 `loaders/`，使得 `use: ["raw-loader"]` 能解析到本目录下的 `loaders/raw-loader.js`。
- `raw-loader` 把源内容用 `JSON.stringify` 包装为合法 JS 字符串。
- `import txt from './hello.txt'` 拿到的就是字符串。
