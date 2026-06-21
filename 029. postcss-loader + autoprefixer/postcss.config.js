// postcss.config.js
// PostCSS 全局配置：postcss-loader 会自动读取此文件。
module.exports = {
  plugins: [
    // autoprefixer：根据 package.json 的 browserslist 自动加 -webkit- / -moz- 等前缀
    require("autoprefixer"),
  ],
};
