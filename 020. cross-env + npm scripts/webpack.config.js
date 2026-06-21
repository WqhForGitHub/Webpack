// webpack.config.js
// 通过 cross-env 在 npm scripts 中设置 process.env.APP_ENV 与 NODE_ENV
// webpack 配置在 Node.js 环境运行，可以直接读取 process.env
// 再用 DefinePlugin 把这些值注入到浏览器代码中
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// 简易环境配置表，根据 APP_ENV 输出不同接口地址
const ENV_CONFIG = {
  local: { API_BASE: "http://localhost:3000/api", DEBUG: true },
  dev: { API_BASE: "https://dev.example.com/api", DEBUG: true },
  test: { API_BASE: "https://test.example.com/api", DEBUG: false },
  prod: { API_BASE: "https://api.example.com", DEBUG: false },
};

module.exports = (env, argv) => {
  const mode = argv.mode || "development";
  const appEnv = process.env.APP_ENV || "local";
  const conf = ENV_CONFIG[appEnv] || ENV_CONFIG.local;

  console.log(
    `[build] mode=${mode}, APP_ENV=${appEnv}, API_BASE=${conf.API_BASE}`,
  );

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
        title: `cross-env Demo (${appEnv})`,
      }),
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || mode),
        "process.env.APP_ENV": JSON.stringify(appEnv),
        __API_BASE__: JSON.stringify(conf.API_BASE),
        __DEBUG__: JSON.stringify(conf.DEBUG),
      }),
    ],
    devServer: {
      port: 8092,
      open: true,
      hot: true,
    },
  };
};
