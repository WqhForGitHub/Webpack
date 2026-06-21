// webpack.config.js
const path = require("path");
const TapDemoPlugin = require("./plugins/TapDemoPlugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  plugins: [new TapDemoPlugin()],
};
