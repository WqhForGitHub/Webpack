// postcss.config.js
// 配置 postcss-pxtorem：
//   rootValue: 设计稿基准。这里以 75 表示设计稿宽 750，1rem = 75px
//   propList:  需要转换的属性，'*' 表示全部
//   minPixelValue: 小于该 px 值不转换（通常 1px 边框保留）
module.exports = {
  plugins: [
    require("postcss-pxtorem")({
      rootValue: 75,
      propList: ["*"],
      minPixelValue: 2,
    }),
  ],
};
