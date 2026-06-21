// webpack.config.js
// 三种缓存方式叠加演示：
//   1) cache-loader：把上一道 loader 的结果缓存到磁盘
//   2) babel-loader 自带 cacheDirectory：babel 转译结果缓存
//   3) webpack5 内置 cache: { type: 'filesystem' }：模块构建图缓存
//
// 实际项目通常 webpack5 自带 filesystem cache 已经够用，
// 这里把它们叠在一起方便理解三层缓存的位置。
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
  const mode = argv.mode || "development";
  return {
    mode,
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "js/bundle.[contenthash:8].js",
      clean: true,
    },
    // 1) webpack5 filesystem cache：构建模块图缓存
    cache: {
      type: "filesystem",
      buildDependencies: {
        // 配置文件变化会导致缓存失效
        config: [__filename],
      },
      cacheDirectory: path.resolve(__dirname, "node_modules/.cache/webpack"),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.resolve(__dirname, "src"),
          // 2) cache-loader：放在最前面，缓存后续 loader 的结果
          // 3) babel-loader cacheDirectory：缓存 babel 转译结果
          use: [
            {
              loader: "cache-loader",
              options: {
                cacheDirectory: path.resolve(
                  __dirname,
                  "node_modules/.cache/cache-loader"
                ),
              },
            },
            {
              loader: "babel-loader",
              options: {
                cacheDirectory: path.resolve(
                  __dirname,
                  "node_modules/.cache/babel-loader"
                ),
                cacheCompression: false,
                presets: [["@babel/preset-env", { targets: "> 0.25%, not dead" }]],
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "Cache Demo",
      }),
    ],
    devServer: {
      port: 8110,
      open: true,
      hot: true,
    },
    stats: "minimal",
  };
};
