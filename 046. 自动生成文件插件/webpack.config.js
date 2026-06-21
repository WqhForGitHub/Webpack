// webpack.config.js
const path = require("path");
const AutoGenerateFilePlugin = require("./plugins/AutoGenerateFilePlugin");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[contenthash:8].js",
    clean: true,
  },
  plugins: [
    new AutoGenerateFilePlugin({
      version: "2.5.0",
      author: "webpack-demo",
    }),
  ],
};
