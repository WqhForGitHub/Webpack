// webpack.config.js
// 演示「图片压缩 loader」：
//   - 使用 webpack 5 内置的 asset/resource 处理图片输出
//   - 在 asset/resource 之前插入自定义 image-compress-loader
//   - image-compress-loader 借助 sharp 对图片二进制数据做有损压缩
//
// 注意：image-compress-loader 必须声明 raw=true，因为它接收的是
// 图片的 Buffer，而不是字符串。
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
  const mode = argv.mode || "development";
  return {
    mode,
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "js/bundle.[contenthash:8].js",
      assetModuleFilename: "img/[name].[contenthash:8][ext]",
      clean: true,
    },
    resolveLoader: {
      modules: ["node_modules", path.resolve(__dirname, "loaders")],
    },
    module: {
      rules: [
        {
          test: /\.(png|jpe?g)$/i,
          // 这里只在 production 下做压缩，开发时跳过加快速度
          use:
            mode === "production"
              ? [
                  {
                    loader: "image-compress-loader",
                    options: { quality: 60 },
                  },
                ]
              : [],
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "图片压缩 loader Demo",
      }),
    ],
    devServer: {
      port: 8103,
      open: true,
      hot: true,
    },
    stats: "minimal",
  };
};
