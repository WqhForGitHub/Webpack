// webpack.config.js
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production", // production 模式默认就启用 TerserPlugin，这里显式配置以演示参数
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,                 // 多进程压缩，加快构建
        extractComments: false,         // 不抽离注释到单独的 LICENSE 文件
        terserOptions: {
          compress: {
            drop_console: true,         // 移除所有 console.*
            drop_debugger: true,        // 移除 debugger
            pure_funcs: ["console.log"], // 视为无副作用函数，可被移除
          },
          mangle: true,                 // 变量名混淆
          format: {
            comments: false,            // 移除全部注释
          },
        },
      }),
    ],
  },
};
