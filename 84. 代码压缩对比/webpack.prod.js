// webpack.prod.js —— mode: production，自动启用 TerserPlugin 压缩 + tree shaking
const path = require("path");
module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist/prod"),
    filename: "bundle.js",
    clean: true,
  },
};
