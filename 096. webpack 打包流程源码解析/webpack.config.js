// webpack.config.js
const path = require("path");
const TracePlugin = require("./plugins/trace-plugin");

module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  plugins: [new TracePlugin()],
};
