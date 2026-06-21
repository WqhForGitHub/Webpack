// webpack.config.js
// DefinePlugin：在编译时把代码里出现的标识符替换成对应的字面量
// 注意：value 必须是「JS 表达式的字符串形式」
//   - 想注入字符串 "production"，需要写成 JSON.stringify('production')，否则会被当成变量名
//   - 想注入对象，需要 JSON.stringify(obj)
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
  const mode = argv.mode || "development";
  const isProd = mode === "production";

  return {
    mode,
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "js/bundle.[contenthash:8].js",
      clean: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "DefinePlugin Demo",
      }),
      new webpack.DefinePlugin({
        // 字符串：必须用 JSON.stringify 包一层
        "process.env.NODE_ENV": JSON.stringify(mode),
        __APP_VERSION__: JSON.stringify(require("./package.json").version),
        __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
        // 布尔/数字可以直接写
        __IS_PROD__: JSON.stringify(isProd),
        __FEATURE_FLAGS__: JSON.stringify({
          enableNewUI: true,
          enableBeta: !isProd,
        }),
      }),
    ],
    devServer: {
      port: 8090,
      open: true,
      hot: true,
    },
  };
};
