// webpack.terser.js —— production + 自定义 terser 选项（更激进压缩）
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist/terser"),
    filename: "bundle.js",
    clean: true,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true, // 删除 console.*
            drop_debugger: true,
            pure_funcs: ["console.log"],
            passes: 2, // 多次压缩
          },
          mangle: {
            toplevel: true, // 顶层变量名也压缩
          },
          format: {
            comments: false, // 去除所有注释
          },
        },
        extractComments: false,
      }),
    ],
  },
};
