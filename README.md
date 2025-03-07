# 常用的 vue.config.js 文件配置

```javascript
module.exports = {
  css: {
    loaderOptions: {
      sass: {},
      less: {},
    },
  },
  devServer: {
    proxy: "http://localhost:4000",
  },
  configureWebpack: {
    plugins: [
      // 添加插件
    ],
  },
  chainWebpack: (config) => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => {
        // 修改 vue-loader 的选项
        return options;
      });
  },
};
```

