// webpack.config.js
// 演示三个 resolve 选项：alias / extensions / mainFields
//
// 通过 --env mode=xxx 切换：
//   默认           -> 全部启用
//   --env mode=no-alias  -> 关闭 alias，看会发生什么
//   --env mode=cjs       -> mainFields 把 'main' 提到最前，会拿到 cjs 入口
const path = require("path");

module.exports = (env = {}) => {
  const mode = env.mode || "default";

  const alias = {};
  if (mode !== "no-alias") {
    alias["@"] = path.resolve(__dirname, "src");
    alias["@utils"] = path.resolve(__dirname, "src/utils");
    // 把 "old-lib" 包重定向到 src/shim 下
    alias["old-lib"] = path.resolve(__dirname, "src/shim/old-lib.js");
  }

  let mainFields = ["browser", "module", "main"];
  if (mode === "cjs") mainFields = ["main"]; // 强制使用 cjs 入口

  return {
    mode: "development",
    devtool: false,
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, `dist-${mode}`),
      filename: "bundle.js",
      clean: true,
    },
    resolve: {
      // extensions: 省略扩展名时按顺序尝试
      extensions: [".js", ".jsx", ".json"],
      // alias: 路径别名
      alias,
      // mainFields: 解析 npm 包时读 package.json 的字段顺序
      mainFields,
    },
  };
};
