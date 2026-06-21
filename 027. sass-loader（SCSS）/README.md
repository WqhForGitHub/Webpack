# 27. sass-loader（SCSS）

使用 `sass-loader` + `sass` 把 SCSS 编译为 CSS。

loader 链：

```
sass-loader  ->  css-loader  ->  style-loader
```

- sass-loader 负责把 SCSS 文本交给 `sass` 编译为 CSS
- css-loader 解析 CSS 中的 `@import` 与 `url()`
- style-loader 把 CSS 注入到 `<style>` 中

## 运行

```bash
npm install
npm start
```
