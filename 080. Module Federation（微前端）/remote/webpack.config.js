// remote/webpack.config.js
// Remote 应用：通过 ModuleFederationPlugin 暴露模块给 Host 使用
//
// 关键字段：
//   name      —— 远程容器在全局注册的名字
//   filename  —— 远程入口清单文件名（http://localhost:3001/remoteEntry.js）
//   exposes   —— 对外暴露的模块映射

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  mode: "development",
  entry: "./remote/src/index.js",
  output: {
    path: path.resolve(__dirname, "../dist/remote"),
    filename: "[name].js",
    publicPath: "http://localhost:3001/",
    clean: true,
  },
  devServer: {
    port: 3001,
    static: path.resolve(__dirname, "../dist/remote"),
    headers: { "Access-Control-Allow-Origin": "*" },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "remote_app",
      filename: "remoteEntry.js",
      exposes: {
        "./Button": "./remote/src/Button.js",
        "./utils": "./remote/src/utils.js",
      },
    }),
    new HtmlWebpackPlugin({
      template: "./remote/index.html",
    }),
  ],
};
