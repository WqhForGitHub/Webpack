# 30. px → rem 转换

通过 `postcss-loader` + `postcss-pxtorem` 在打包阶段把 CSS 中的 `px` 自动换算为 `rem`，常用于移动端适配。

## 关键配置

`postcss.config.js`

```js
require('postcss-pxtorem')({
  rootValue: 75,        // 设计稿基准：1rem = 75px
  propList: ['*'],
  minPixelValue: 2,     // 1px 不转换（保留边框）
})
```

`src/index.js` 中通过 JS 把 `html` 根字号设为 `屏宽 / 10`，与 `rootValue` 配合实现等比缩放。

## 运行

```bash
npm install
npm start
```
