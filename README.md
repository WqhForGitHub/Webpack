

## vue.config.js 中的 configureWebpack 配置



```javascript
const path = require('path');
const resolve = dir => path.resolve(__dirname, dir);

module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 生产环境配置
      return {
        mode: 'production',
        optimization: {
          minimize: true // 代码压缩
        },
        plugins: [
          // 生产环境的插件
          new MyProductionPlugin() // 替换成你的插件
        ]
      };
    } else {
      // 开发环境配置
      return {
        mode: 'development',
        devtool: 'cheap-module-eval-source-map', // 开发环境的 source map
        plugins: [
          // 开发环境的插件
          new MyDevelopmentPlugin() // 替换成你的插件
        ]
      };
    }
  }
};
```











