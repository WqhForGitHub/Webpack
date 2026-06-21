// webpack.config.js
// 演示「Dead Code Elimination」(DCE)
//
// DCE 与 Tree Shaking 的关系：
//   - Tree Shaking：基于 ES Module 静态分析，删除「未被引用的 export」。
//   - Dead Code Elimination：由压缩工具（terser）执行，删除「永远不会被执行的代码」，
//     例如：if(false){...}、process.env.NODE_ENV !== 'production' 块、unreachable 分支等。
//
// 二者协作：
//   webpack 先标记 unused exports + DefinePlugin 把常量替换进代码，
//   terser 再删除死代码 → 最终产物极小。

const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            // 默认就是 true，这里显式声明便于教学
            dead_code: true,
            unused: true,
            // 把 if(false) / if(true) 等条件分支折叠
            conditionals: true,
            // 删除 console.log
            drop_console: false,
            // 把已知常量内联
            evaluate: true,
          },
        },
      }),
    ],
  },
  plugins: [
    // 配合 DCE：把 __DEV__ 替换为 false，再由 terser 删除整个 if (__DEV__) { ... }
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(false),
      "process.env.FEATURE_X": JSON.stringify(false),
    }),
  ],
};
