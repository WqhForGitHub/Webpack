# 49. IgnorePlugin（忽略 moment locale）

`moment` 包默认会把 `moment/locale/*` 中所有语言包全部 require 进来，体积约 230KB。
通过 `webpack.IgnorePlugin` 忽略 `moment` 中对 `./locale` 的请求，体积可缩减到 ~70KB。

## 配置
```js
new webpack.IgnorePlugin({
  resourceRegExp: /^\.\/locale$/,
  contextRegExp:  /moment$/,
})
```

## 业务代码按需引入
```js
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
```

## 运行
```bash
npm install
npm run build
```

可以对比加 / 不加 IgnorePlugin 的 `dist/bundle.js` 大小。
