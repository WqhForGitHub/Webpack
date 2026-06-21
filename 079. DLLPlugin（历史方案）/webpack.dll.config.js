// webpack.dll.config.js
// 第一步：单独把第三方库打成 DLL（动态链接库）
//
// DLLPlugin 工作流：
//   1. 用这份配置生成 dll/vendors.dll.js + dll/vendors-manifest.json
//   2. 主构建 webpack.config.js 中通过 DllReferencePlugin 读取 manifest，
//      把这些库视为「外部已存在的模块」，不再打入 main bundle。
//
// 历史背景：
//   - 在 webpack 5 之前，DLLPlugin 是减少重复编译第三方库的常用手段。
//   - webpack 5 已自带 cache.type='filesystem' + Module Federation，
//     DLLPlugin 多用于历史项目维护。

const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: {
    vendors: ["lodash", "jquery"],
  },
  output: {
    path: path.resolve(__dirname, "dll"),
    filename: "[name].dll.js",
    // 暴露给浏览器的全局变量名，DllReferencePlugin 也要用到
    library: "[name]_dll",
    clean: true,
  },
  plugins: [
    new webpack.DllPlugin({
      // 全局变量名，和 output.library 保持一致
      name: "[name]_dll",
      // manifest 文件路径，主配置会读它
      path: path.resolve(__dirname, "dll/[name]-manifest.json"),
    }),
  ],
};
