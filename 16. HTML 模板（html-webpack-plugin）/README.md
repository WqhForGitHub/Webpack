# 16. HTML 模板（html-webpack-plugin）

## 简介

通过 `html-webpack-plugin`：

- 自动注入 `<script>` 标签
- 使用模板（EJS 语法）插值标题、变量
- 多入口生成多页面（multi-page）

## 启动

```bash
npm install
npm start
npm run build
```

## 核心要点

1. `template` 指定模板，`filename` 指定输出 HTML 名称；
2. `chunks` 控制注入哪些 chunk（多页面必备）；
3. 模板里通过 `<%= htmlWebpackPlugin.options.xxx %>` 读取实例配置；
4. 生产模式可以通过 `minify` 选项压缩 HTML 输出。
