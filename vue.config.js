module.exports = {
   // publicPath: process.env.NODE_ENV === 'production' ? '/my-app/' : '/', // 部署到子路径
  publicPath: './', // 部署到根路径，所有资源使用相对路径
  outputDir: 'dist', // 构建输出目录
  assetsDir: 'static', // 静态资源目录
  indexPath: 'index.html', // 入口html文件
  filenameHashing: true, // 文件名哈希，用于缓存
  lintOnSave: process.env.NODE_ENV !== 'production', // 开发环境启用eslint校验
  runtimeCompiler: false, // 是否使用运行时编译器
  productionSourceMap: false, // 生产环境是否生成sourceMap
  devServer: {
    port: 8080, // 开发服务器端口
    open: true, // 自动打开浏览器
    proxy: { // 代理配置，用于开发环境中访问后端接口
      '/api': {
        target: 'http://localhost:3000', // 后端接口地址
        changeOrigin: true, // 是否改变请求头中的origin
      },
    },
  },
  css: {
    sourceMap: false, // 是否生成css sourceMap
    loaderOptions: {
      sass: {
        // sass预处理器配置
        data: `@import "@/styles/variables.scss";`, // 导入全局变量
      },
    },
  },
  pwa: { // PWA配置
    name: 'My App',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
  },
  pages: { // 多页面应用配置
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: '首页',
    },
    about: {
      entry: 'src/about.js',
      template: 'public/about.html',
      filename: 'about.html',
      title: '关于',
    },
  },
  chainWebpack: config => {
    // 添加一个新的loader
    config.module
      .rule('eslint')
      .use('eslint-loader')
      .loader('eslint-loader')
      .tap(options => {
        options.fix = true; // 自动修复eslint错误
        return options;
      });

    // 修改已有的loader
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true; // 保留空格
        return options;
      });

    // 添加一个新的plugin
    config.plugin('html')
      .tap(args => {
        args[0].title = '我的应用'; // 修改html标题
        return args;
      });

    // 别名配置
    config.resolve.alias
      .set('@', resolve('src'));

    // 优化代码
    config.optimization.splitChunks({
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    });

    // 添加一个新的loader
    config.module
      .rule('my-custom-loader')
      .test(/\.myext$/) // 匹配文件扩展名
      .use('my-loader')
      .loader('path/to/my-loader') // loader 路径
      .end();

     // 添加一个新的loader
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true; // 保留空格
        return options;
      });

     // 添加一个新的loader
    const rule = config.module.rule('svg');
    rule.uses.clear(); // 清除所有已有的 loader
    rule.use('vue-svg-loader')
      .loader('vue-svg-loader');

     // 添加一个新的plugin
    config.plugin('my-plugin')
      .use(MyAwesomePlugin, [{ option1: 'value1' }]);

     // 别名配置
    config.resolve.alias
      .set('@', resolve('src')) // 设置 @ 别名
      .set('components', resolve('src/components')); // 设置 components 别名


    config.devtool('source-map'); // 设置 source-map 模式
    config.mode('production'); // 设置为生产模式 
  },
};
