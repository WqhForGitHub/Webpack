// webpack.config.js
const path = require("path");
const UseMiniTapablePlugin = require("./plugins/use-mini-tapable-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  plugins: [new UseMiniTapablePlugin()],
};
