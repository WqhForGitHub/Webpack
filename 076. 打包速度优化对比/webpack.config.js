// webpack.config.js
// 演示「打包速度优化对比」 —— 纯 webpack
//
// 通过 --env scenario=xxx 选择 4 种场景，并使用 speed-measure-webpack-plugin
// 输出每个 loader/plugin 的耗时，便于对比：
//
//   1. baseline    —— 无任何优化
//   2. cache       —— 开启 filesystem cache
//   3. exclude     —— exclude: /node_modules/ + include: src
//   4. thread      —— babel-loader 前置 thread-loader 多线程
//
// 运行：
//   npm run build:baseline
//   npm run build:cache    （首次和第二次对比！）
//   npm run build:exclude
//   npm run build:thread

const path = require("path");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

module.exports = (env = {}) => {
  const scenario = env.scenario || "baseline";
  const smp = new SpeedMeasurePlugin();

  const useThread = scenario === "thread";
  const useCache = scenario === "cache";
  const useExclude = scenario === "exclude";

  const babelUse = [
    ...(useThread
      ? [
          {
            loader: "thread-loader",
            options: { workers: 2 },
          },
        ]
      : []),
    {
      loader: "babel-loader",
      options: {
        presets: [["@babel/preset-env", { targets: "defaults" }]],
        // 仅在 cache 场景开启 babel cache
        cacheDirectory: useCache,
      },
    },
  ];

  const config = {
    mode: "development",
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, `dist/${scenario}`),
      filename: "bundle.js",
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          ...(useExclude
            ? { include: path.resolve(__dirname, "src"), exclude: /node_modules/ }
            : {}),
          use: babelUse,
        },
      ],
    },
    cache: useCache
      ? {
          type: "filesystem",
          buildDependencies: { config: [__filename] },
          cacheDirectory: path.resolve(__dirname, `.cache/${scenario}`),
        }
      : false,
  };

  return smp.wrap(config);
};
