// webpack.config.js
// 演示「ESModule vs CommonJS tree shaking」
//
// 结论：
//   - ESM (import/export) 在编译期就能确定依赖关系，webpack 可以做到
//     精确删除未使用的具名导出。
//   - CommonJS (require/module.exports) 是动态的、运行时的，webpack 5
//     有部分 CJS tree shaking 能力（exports info），但远不如 ESM。
//
// 通过 --env target=esm|cjs 选择入口，对比 dist 输出体积。

const path = require("path");

module.exports = (env = {}) => {
  const target = env.target || "esm";
  return {
    mode: "production",
    entry: `./src/index.${target}.js`,
    output: {
      path: path.resolve(__dirname, `dist/${target}`),
      filename: "bundle.js",
      clean: true,
    },
    optimization: {
      usedExports: true,
      minimize: true,
      // 让产物保留可读性，便于观察 tree shaking 效果
      // （注意：minimize 会压缩，下面用 concatenateModules 保留作用域）
      concatenateModules: true,
    },
  };
};
