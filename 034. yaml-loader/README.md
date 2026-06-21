# 34. yaml-loader

纯 webpack 自定义 yaml-loader：把 `.yaml` / `.yml` 文件解析成 JS 对象导入。

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

- 自定义 loader：`loaders/yaml-loader.js`，使用 `js-yaml.load` 解析。
- 通过 `JSON.stringify(data)` 把对象序列化为 JS 字面量再 `module.exports`。
- `import config from './config.yaml'` 拿到的就是普通 JS 对象。
