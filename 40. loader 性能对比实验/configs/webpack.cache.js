// configs/webpack.cache.js
// 仅启用缓存：babel cacheDirectory + webpack5 filesystem cache
const path = require("path");
module.exports = {
  mode: "production",
  entry: "../src/index.js",
  context: path.resolve(__dirname, ".."),
  output: {
    path: path.resolve(__dirname, "../dist/cache"),
    filename: "bundle.js",
    clean: true,
  },
  cache: {
    type: "filesystem",
    cacheDirectory: path.resolve(__dirname, "../node_modules/.cache/webpack-cache"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "../src"),
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: path.resolve(
                __dirname,
                "../node_modules/.cache/babel-cache"
              ),
              cacheCompression: false,
              presets: [["@babel/preset-env", { targets: "> 0.25%, not dead" }]],
            },
          },
        ],
      },
    ],
  },
  stats: "errors-only",
};
