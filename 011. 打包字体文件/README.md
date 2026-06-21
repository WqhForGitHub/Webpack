# 11. 打包字体文件

演示如何用 webpack 5 打包字体文件（`woff` / `woff2` / `ttf` / `eot` / `otf`）。

## 思路

字体文件通常体积较大（几十 KB ~ 数百 KB），且应该被浏览器缓存复用，**不建议内联**。
所以使用 `asset/resource`，把字体输出到独立文件：

```js
{
  test: /\.(woff2?|ttf|eot|otf)$/i,
  type: 'asset/resource',
  generator: { filename: 'fonts/[name].[hash:8][ext]' }
}
```

CSS 中的 `@font-face` 引用：

```css
@font-face {
  font-family: "MyCustomFont";
  src:
    url("./fonts/MyFont.woff2") format("woff2"),
    url("./fonts/MyFont.woff") format("woff"),
    url("./fonts/MyFont.ttf") format("truetype");
  font-display: swap;
}
```

webpack 会把这里的 `url(...)` 路径转换成产物中实际的字体 URL（`fonts/MyFont.xxxxxxxx.woff2`）。

## 用法

```bash
npm install
npm start          # dev server
npm run build      # 产物会包含 css/、js/、fonts/ 三个目录
```

## 注意

- `src/fonts/` 下的字体文件是**占位空文件**，仅用于演示 webpack 的打包链路。
  在真实项目中请用真实的字体文件替换它们（如 [Google Fonts 下载](https://fonts.google.com/) 或 iconfont.cn 导出）。
- 字体格式优先级：`woff2 > woff > ttf > eot`，CSS 中按支持度从高到低书写。
- 加 `font-display: swap` 可避免字体加载阻塞文字渲染。
