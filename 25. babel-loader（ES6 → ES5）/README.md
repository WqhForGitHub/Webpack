# 25. babel-loader（ES6 → ES5）

使用 `babel-loader` + `@babel/preset-env` 把 ES6+ 语法降级为 ES5。

## 安装

```bash
npm install
```

## 运行

```bash
npm start         # 开发模式
npm run build     # 生产打包，可在 dist 中查看转换后的产物
```

## 关键点

- `babel-loader` 调用 Babel 完成 JS 转换。
- `@babel/preset-env` 根据 `targets` 自动决定需要转换的语法集合。
- `exclude: /node_modules/` 避免对第三方包重复转换，加快构建。
