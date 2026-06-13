// webpack.config.js
// HtmlWebpackPlugin 提供了 5 个核心 hooks，
// 允许其他插件在 HTML 生成的不同阶段介入修改：
//   1. beforeAssetTagGeneration  - asset 标签生成前
//   2. alterAssetTags            - 修改 asset 标签的属性
//   3. alterAssetTagGroups       - 修改 asset 标签分组（head / body）
//   4. afterTemplateExecution    - 模板渲染后
//   5. beforeEmit                - HTML 写入前（可改 html 字符串）
//   6. afterEmit                 - HTML 写入后

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// 自定义插件：演示如何监听 HtmlWebpackPlugin 的 hooks
class HtmlHooksDemoPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("HtmlHooksDemoPlugin", (compilation) => {
      const hooks = HtmlWebpackPlugin.getHooks(compilation);

      // 1. alterAssetTags - 给所有 script 标签加 defer
      hooks.alterAssetTags.tapAsync(
        "HtmlHooksDemoPlugin",
        (data, cb) => {
          data.assetTags.scripts.forEach((tag) => {
            tag.attributes.defer = true;
          });
          cb(null, data);
        }
      );

      // 2. beforeEmit - 在 HTML 字符串里追加注释
      hooks.beforeEmit.tapAsync(
        "HtmlHooksDemoPlugin",
        (data, cb) => {
          data.html = data.html.replace(
            "</body>",
            "<!-- Injected by HtmlHooksDemoPlugin -->\n</body>"
          );
          cb(null, data);
        }
      );

      // 3. afterEmit - 输出日志
      hooks.afterEmit.tapAsync(
        "HtmlHooksDemoPlugin",
        (data, cb) => {
          console.log("[HtmlHooksDemoPlugin] HTML emitted:", data.outputName);
          cb(null, data);
        }
      );
    });
  }
}

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "HtmlWebpackPlugin Hooks Demo",
      template: "./src/index.html",
    }),
    new HtmlHooksDemoPlugin(),
  ],
};
