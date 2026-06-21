// host/webpack.config.js
// Host 应用：通过 ModuleFederationPlugin 引用 remote 暴露的模块
//
// 关键字段：
//   remotes —— 远程容器映射，格式为
//     { 本地别名: '远程容器名@远程 remoteEntry.js 地址' }

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  mode: "development",
  entry: "./host/src/index.js",
  output: {
    path: path.resolve(__dirname, "../dist/host"),
    filename: "[name].js",
    publicPath: "http://localhost:3000/",
    clean: true,
  },
  devServer: {
    port: 3000,
    static: path.resolve(__dirname, "../dist/host"),
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "host_app",
      remotes: {
        // import xxx from 'remote_app/Button'
        remote_app: "remote_app@http://localhost:3001/remoteEntry.js",
      },
    }),
    new HtmlWebpackPlugin({
      template: "./host/index.html",
    }),
  ],
};
