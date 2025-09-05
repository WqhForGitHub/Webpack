# 2. 常见的构建工具及对比

在阅读完 1.1 节后，我们一定会感叹前端技术发展之快，各种可以提高开发效率的新思想和框架层出不穷。但是它们都有一个共同点：源代码无法直接运行，必须通过转换后才可以正常运行。

构建就是做这件事情，将源代码转换成可执行的 JavaScript、CSS、HTML 代码，包括如下内容。

* 代码转换：将 TypeScript 编译成 JavaScript、将 SCSS 编译成 CSS 等。
* 文件优化：压缩 JavaScript、CSS、HTML 代码，压缩合并图片等。
* 代码分割：提取多个页面的公共代码，提取首屏不需要执行部分的代码让其异步加载。
* 模块合并：在采用模块化的项目里会有很多个模块和文件，需要通过构建功能将模块分类合并成一个文件。
* 自动刷新：监听本地源代码的变化，自动重新构建、刷新浏览器。
* 代码校验：在代码被提交到仓库前需要校验代码是否符合规范，以及单元测试是否通过。
* 自动发布：更新代码后，自动构建出线上发布代码并传输给发布系统。

构建其实是工程化、自动化思想在前端开发中的体现，将一系列流程用代码去实现，让代码自动化地执行这一系列复杂的流程。构建为前端开发注入了更大的活力，解放了我们的生产力。

历史上先后出现了一系列构建工具，它们各有优缺点。由于前端工程师很熟悉 JavaScript，Node.js 又可以胜任所有构建需求，所以大多数构建工具都是用 Node.js 开发的。下面来一一介绍它们。

## 1. Npm Script

Npm Script 是一个任务执行者。Npm 是在安装 Node.js 时附带的包管理器，Npm Script 则是 Npm 内置的一个功能，允许在 package.json 文件里面使用 scripts 字段定义任务：

```json
{
    "scripts": {
        "dev": "node dev.js",
        "pub": "node build.js"
    }
}
```

里面的 scripts 字段是一个对象，每个属性对应一段 Shell 脚本，以上代码定义了两个任务：dev 和 pub。其底层实现原理是通过调用 Shell 去运行脚本命令，例如，执行 npm run pub 命令等同于执行 node build.js 命令。

Npm Script 的优点是内置，无须安装其他依赖。其缺点是功能太简单，虽然提供了 pre 和 post 两个钩子，但不能方便地管理多个任务之间的依赖。

<br>

# 3. 安装 Webpack

在用 Webpack 执行构建任务时，需要通过 webpack 可执行文件去启动构建任务，所以需要安装 webpack 可执行文件。在安装 Webpack 前请确保我们的系统安装了 5.0.0 及以上版本的 Node.js。

在开始为项目加入构建前，需要先新建一个 Web 项目，有如下方式：

* 新建一个目录，再进入项目根目录执行 npm init 来初始化最简单的采用了模块化开发的项目。
* 用脚手架工具 Yeoman 直接、快速地生成一个最符合自己的需求的项目。

## 1. 安装 Webpack 到本项目

安装 Webpack 到本项目时，可根据自己的需求选择以下任意命令运行：

```shell
# npm i -D 是 npm install --save-dev 的简写，是指安装模块并保存到 package.json 的 devDependencies
# 安装最新的稳定版
npm i -D webpack
# 安装指定版本
npm i -D webpack@<version>
# 安装最新的体验版本
npm i -D webpack@beta
```

安装完成后，我们可以通过以下途径运行安装到本项目的 Webpack：

* 在项目根目录下对应的命令行里通过 node_modules/.bin/webpack 运行 Webpack 的可执行文件。
* 在 Npm Script 里定义的任务会优先使用本项目下的 Webpack，代码如下：

```json
{
    "scripts": {
        "start": "webpack --config webpack.config.js"
    }
}
```

## 2. 安装 Webpack 到全局

安装到全局后，我们可以在任何地方共用一个 Webpack 可执行文件，而不用各个项目重复安装，安装方式如下：

```shell
npm i -g webpack
```

虽然介绍了以上两种安装方式，但是我们推荐安装到本项目，原因是可防止不同的项目因依赖不同版本的 Webpack 而导致冲突。

## 3. 使用 Webpack

下面通过 Webpack 构建一个采用了 CommonJS 模块化编写的项目，该项目中的某个网页会通过 JavaScript 显示 Hello, Webpack。

运行构建前，先将要完成该功能的最基础的 JavaScript 文件和 HTML 建立好，需要如下文件。

页面入口文件 index.html 如下：

```html
<html>
    <head>
        <meta charset="UTF-8">
    </head>
    <body>
        <div id="app"></div>
        <!-- 导入 Webpack 输出的 JavaScript 文件 -->
        <script src="./dist/bundle.js"></script>
    </body>
</html>
```

存放工具函数的 show.js 文件的内容如下：

```javascript
// 操作 DOM 元素，将 content 显示到网页上
function show(content) {
    window.document.getElementById('app').innerText = 'Hello,' + content;
}

// 通过 CommonJS 规范导出 show 函数
module.exports = show;
```

包含执行入口的 main.js 文件的内容如下：

```javascript
// 通过 CommonJS 规范导入 show 函数
const show = require('./show.js');
// 执行 show 函数
show('Webpack');
```

Webpack 在执行构建时默认会从项目根目录下的 webpack.config.js 文件中读取配置，所以我们还需要新建它，其内容如下：

```javascript
const path = require('path');
module.exports = {
    // JavaScript 执行入口文件
    entry: './main.js',
    output: {
        // 将所有依赖的模块合并输出到一个 bundle.js 文件
        filename: 'bundle.js',
        // 将输出文件都放到 dist 目录下
        path: path.resolve(__dirname, './dist')
    }  
};
```

由于 Webpack 构建运行在 Node.js 环境下，所以该文件最后需要通过 CommonJS 规范导出一个描述如何构建的 Object 对象。

此时，项目目录如下：

|-- index.html

|-- main.js

|-- show.js

|-- webpack.config.js

一切文件就绪，在项目根目录下执行 webpack 命令运行 Webpack 构建，我们会发现目录下多出一个 dist 目录，里面有个 bundle.js 文件，bundle.js 文件是一个可执行的 JavaScript 文件，它包含页面所依赖的两个模块 main.js、show.js，以及内置的 webpackBootstrap 启动函数。这时用浏览器打开 index.html 网页，将会看到 Hello, Webpack。

Webpack 是一个打包模块化 JavaScript 的工具，它会从 main.js 出发，识别出源码中的模块化导入语句，递归地找出入口文件的所有依赖，将入口和其所有依赖打包到一个单独的文件中。从 Webpack 2 版本开始，Webpack 已经内置了对 ES6、CommonJS、AMD 模块化语句的支持。

至此我们已经学会了 Webpack 的基本功能，接下来我们将探索 Webpack 的更多功能。

<br>

# 4. 使用 Loader

在 1.3 节中使用 Webpack 构建了一个采用 CommonJS 规范的模块化项目，本节将继续优化这个网页的 UI，为项目引入 CSS 代码以让文字居中显示，main.css 的内容如下：

```css
#app {
    text-align: center;
}
```

Webpack 将一切看作模块，CSS 文件也不例外。要引入 main.css，则需要像引入 JavaScript 文件那样，修改入口文件 main.js 如下：

```javascript
// 通过 CommonJS 规范导入 CSS 模块
require('./main.css')'
// 通过 CoomonJS 规范导入 show 函数
const show = require('./show.js');
// 执行 show 函数
show('Webpack');
```

但是这样修改后去执行 Webpack 构建是会报错的，因为 Webpack 不原生支持解析 CSS 文件。要支持非 JavaScript 类型的文件，则需要使用 Webpack 的 Loader 机制。将 Webpack 的配置修改如下：

```javascript
const path = require('path');
module.exports = {
    // JavaScript 执行入口文件
    entry: './main.js',
    output: {
        // 将所有依赖的模块合并输出到一个 bundle.js 文件中
        filename: 'bundle.js',
        // 将输出文件都放到 dist 目录下
        path: path.resolve(__dirname, './dist');
    },
    module: {
        rules: [
            {
                // 用正则表达式去匹配用该 Loader 转换的 CSS 文件
                test: /\.css$/,
                use: ['style-loader', 'css-loader?minimize']
            }
        ]
    }
}
```

Loader 可以看作具有文件转换功能的翻译员，配置里的 module.rules 数组配置了一组规则，告诉 Webpack 在遇到哪些文件时使用哪些 Loader 去加载和转换。如上配置告诉 Webpack，在遇到以 .css 结尾的文件时，先使用 css-loader 读取 CSS 文件，再由 style-loader 将 CSS 的内容注入 JavaScript 里。在配置 Loader 时需要注意：

* use 属性的值需要是一个由 Loader 名称组成的数组，Loader 的执行顺序是由后到前的
* 每个 Loader 都可以通过 URL querystring 的方式传入参数，例如 css-loader?minimize 中的 minimize 告诉 css-loader 要开启 CSS 压缩。

想知道 Loader 具体支持哪些属性，则需要我们查阅文档，例如 css-loader 还有很多用法，我们可以在 css-loader 主页（https://github.com/webpack-contrib/css-loader）上查到。

在重新执行 Webpack 构建前，要先安装引入的 Loader：

```bash
npm i -D style-loader css-loader
```

安装成功后重新执行构建时，我们会发现 bundle.js 文件被更新了，里面注入了在 main.css 中写的 CSS 内容，而不会额外生成一个 CSS 文件。但是重新刷新 index.html 网页时，将会发现 "Hello, Webpack" 中了，样式生效了。也许你会对此感到奇怪，第一次看到 CSS 被写在了 JavaScript 里。这其实都是 style-loader 的功劳，它的工作原理大概是将 CSS 的内容用 JavaScript 里的字符串存储起来，在网页执行 JavaScript 时通过 DOM 操作，动态地向 HTML head 标签里插入 HTML style 标签。也许你认为这样做会导致 JavaScript 文件变大并且加载网页的时间变长，想让 Webpack 单独输出 CSS 文件，这时你可以参考 1.5 节，1.5 节将讲解如何通过 Webpack Plugin 机制来实现。

# 5. 使用 Plugin

Plugin 是用来扩展 Webpack 功能的，通过在构建流程里注入钩子实现，它为 Webpack 带来了很大的灵活性。

在 1.4 节中通过 Loader 加载了 CSS 文件，本节通过 Plugin 将注入 bundle.js 文件里的 CSS 提取到单独的文件中，配置修改如下：

```javascript
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    // JavaScript 执行入口文件
    entry: './main.js',
    output: {
        // 将所有依赖的模块合并输出到一个 bundle.js 文件中
        filename: 'bundle.js',
        // 将输出文件都放到 dist 目录下
        path: path.resolve(__dirname, './dist')
    },
    module: {
        rules: [
            {
                // 用正则去匹配要用该 loader 转换的 CSS 文件
                test: /\.css$/,
                loaders: ExtractTextPlugin.extract({
                    // 转换 .css 文件需要使用的 Loader
                    use: ['css-loader']
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            // 从 .js 文件中提取出来的 .css 文件的名称
            filename: `[name]_[contenthash:8].css`
        })
    ]
}
```

要让以上代码运行起来，需要先安装新引入的插件：

```bash
npm i -D extract-text-webpack-plugin
```

安装成功后重新执行构建，我们会发现 dist 目录下多出一个 main_1a87a56a.css 文件，bundle.js 文件里也没有 CSS 代码了，再将该 CSS 文件引入 index.html 里就完成了。

从以上代码可以看出，Webpack 是通过 plugins 属性来配置需要使用的插件列表的。plugins 属性是一个数组，里面的每一项都是插件的一个实例，在实例化与i个组件时可以通过构造函数传入这个组件支持的配置属性。

例如，ExtractTextPlugin 插件的作用是提取出 JavaScript 代码里的 CSS 到一个单独的文件中。对此我们可以通过插件的 filename 属性，告诉插件输出的 CSS 文件名称是通过 [name]_[contenthash:8].css 字符串模板生成的，里面的 [name] 代表文件的名称，[contenthash:8] 代表根据文件内容算出的 8 位 Hash 值，还有很多配置选项可以在 ExtractTextPlugin 的主页上查到。

# 6. 使用 DevServer

前面几节只是让 Webpack 正常运行起来了，但在实际开发中我们可能会需要：

* 提供 HTTP 服务而不是使用本地文件预览
* 监听文件的变化并自动刷新网页，做到实时预览
* 支持 Source Map，以方便调试

对于这些，Webpack 都为我们考虑好了。Webpack 原生支持上述 2、3 点内容，再结合官方提供的开发工具 DevServer（）也可以很方便地做到第 1 点。DevServer 会启动一个 HTTP 服务器用于服务网页请求，同时会帮助启动 Webpack，并接收 Webpack 发出地文件变更信号，通过 WebSocket 协议自动刷新网页做到实时预览。

下面为之前地小项目 Hello, Webpack 继续集成 DevServer。首先需要安装 DevServer：

```bash
npm i -D webpack-dev-server
```

安装成功后执行 webpack-dev-server 命令，DevServer 就启动了，这时我们会看到控制台有一串日志输出：

Project is running at http://localhost:8080/

webpack output is served from /

这意味着 DevServer 启动的 HTTP 服务器监听在 8080 端口，DevServer 启动后会一直驻留在后台保持运行，访问这个网址，就能获取项目根目录下的 index.html 了。用浏览器打开这个地址时我们会发现页面空白，错误的原因是 ./dist/bundle.js 加载 404 了。同时我们会发现并没有文件输出到 dist 目录，原因是 DevServer 会将 Webpack 构建出的文件保存在内存中，在要访问输出的文件时，必须通过 HTTP 服务访问。由于 DevServer 不会理会 webpack.config.js 里配置的 output.path 属性，所以要获取 bundle.js 的正确 URL 是 http://localhost:8080/bundle.js，对应的 index.html 应该修改为：

```html
<html>
<head>
	<meta charset="UTF-8">
</head>
<body>
<div id="app"></div>
<!-- 导入 DevServer 输出的 JavaScript 文件 -->
<script src="bundle.js"></script>
</body>
</html>
```

## 1. 实时预览

接着上面的步骤，可以试试修改 main.js、main.css、show.js 中的任意文件，保存后我们会发现浏览器被自动刷新，运行出修改后的效果。

Webpack 在启动时可以开启监听模式，之后 Webpack 会监听本地文件系统的变化，在发生变化时重新构建出新的结果。Webpack 默认关闭监听模式，我们可以在启动 Webpack 时通过 webpack --watch 来开启监听模式。

通过 DevServer 启动的 Webpack 会开启监听模式，当发生变化时重新执行构建，然后通知 DevServer。DevServer 会让 Webpack 在构建出的 JavaScript 代码里注入一个代理客户端用于控制网页，网页和 DevServer 之间通过 Websocket 协议通信，以方便 DevServer 主动向客户端发送命令。DevServer 在收到来自 Webpack 的文件变化通知时，通过注入的客户端控制网页刷新。

如果尝试修改 index.html 文件并保存，则我们会发现这并不会触发以上机制，导致这个问题的原因是 Webpack 在启动时会以配置里的 entry 为入口去递归解析出 entry 所依赖的文件，只有 entry 本身和依赖的文件才会被 Webpack 添加到监听列表里。而 index.html 文件是脱离了 JavaScript 模块化系统的，所以 Webpack 不知道它的存在。

# 7. 核心概念

通过之前几节的学习，相信我们已经对 Webpack 有了一个初步的认识。虽然 Webpack 功能强大且配置项多，但只要理解了其中的几个核心概念，就能随心应手地使用它。Webpack 有以下几个核心概念。

* Entry：入口，Webpack 执行构建地第一步将从 Entry 开始，可抽象成输入。
* Module：模块，在 Webpack 里一切皆模块，一个模块对应一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
* Chunk：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
* Loader：模块转换器，用于将模块的原内容按照需求转换成新内容。
* Plugin：扩展插件，在 Webpack 构建流程中的特定时机注入扩展逻辑，来改变构建结果或做我们想要的事情。
* Output：输出结果，在 Webpack 经过一系列处理并得出最终想要的代码后输出结果。

Webpack 在启动后会从 Entry 里配置的 Module 开始，递归解析 Entry 依赖的所有 Module。每找到一个 Module，就会根据配置的 Loader 去找出对应的转换规则，对 Module 进行转换后，再解析出当前 Module 依赖的 Module。这些模块会以 Entry 为单位进行分组，一个 Entry 及其所有依赖的 Module 被分到一个组也就是一个 Chunk。最后，Webpack 会将所有 Chunk 转换成文件输出。在整个流程中，Webpack 会在恰当的时机执行 Plugin 里定义的逻辑。

在实际应用中我们可能会遇到各种奇怪、复杂的场景，不知道从哪开始。根据以上总结，我们已对 Webpack 有了一个整体认识，这能让我们在以后使用 Webpack 时快速知道应该通过配置什么去完成自己想要的功能，而不是无从下手。















# claude

## 1. 安装

### 本地安装（推荐）
```bash
npm install --save-dev webpack-dev-server
```

### 全局安装
```bash
npm install -g webpack-dev-server
```

## 2. 基本配置

### 在 webpack.config.js 中配置
```javascript:webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    hot: true,
    open: true,
    historyApiFallback: true
  },
  mode: 'development'
};
```

## 3. 常用配置选项

### 基础配置
```javascript:webpack.config.js
devServer: {
  // 静态文件目录
  static: {
    directory: path.join(__dirname, 'public'),
    publicPath: '/static'
  },
  
  // 端口号
  port: 3000,
  
  // 主机名
  host: 'localhost',
  
  // 自动打开浏览器
  open: true,
  
  // 启用热模块替换
  hot: true,
  
  // 启用 gzip 压缩
  compress: true,
  
  // 支持 HTML5 History API
  historyApiFallback: true
}
```

### 高级配置
```javascript:webpack.config.js
devServer: {
  // 代理配置
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  },
  
  // 允许外部访问
  allowedHosts: 'all',
  
  // 自定义头部
  headers: {
    'X-Custom-Header': 'yes'
  },
  
  // 监听文件变化
  watchFiles: ['src/**/*', 'public/**/*'],
  
  // 客户端配置
  client: {
    logging: 'info',
    overlay: {
      errors: true,
      warnings: false
    },
    progress: true
  }
}
```

## 4. 启动方式

### 通过 npm scripts
在 package.json 中添加：
```json:package.json
{
  "scripts": {
    "start": "webpack serve",
    "dev": "webpack serve --mode development",
    "serve": "webpack serve --config webpack.dev.js"
  }
}
```

然后运行：
```bash
npm start
```

### 直接命令行
```bash
npx webpack serve
```

### 带参数启动
```bash
npx webpack serve --port 8080 --hot --open
```

## 5. 热模块替换 (HMR)

### 启用 HMR
```javascript:webpack.config.js
const webpack = require('webpack');

module.exports = {
  // ... 其他配置
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    hot: true
  }
};
```

### 在代码中使用 HMR
```javascript:src/index.js
if (module.hot) {
  module.hot.accept('./module.js', function() {
    console.log('模块已更新');
    // 重新执行模块逻辑
  });
}
```

## 6. 代理配置

### 简单代理
```javascript:webpack.config.js
devServer: {
  proxy: {
    '/api': 'http://localhost:3000'
  }
}
```

### 复杂代理配置
```javascript:webpack.config.js
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      pathRewrite: { '^/api': '' },
      changeOrigin: true,
      secure: false,
      logLevel: 'debug'
    },
    '/auth': {
      target: 'http://localhost:4000',
      changeOrigin: true
    }
  }
}
```

## 7. 常见问题解决

### CORS 问题
```javascript:webpack.config.js
devServer: {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
  }
}
```

### 网络访问
```javascript:webpack.config.js
devServer: {
  host: '0.0.0.0', // 允许外部访问
  port: 8080,
  allowedHosts: 'all'
}
```

### 自定义中间件
```javascript:webpack.config.js
devServer: {
  setupMiddlewares: (middlewares, devServer) => {
    if (!devServer) {
      throw new Error('webpack-dev-server is not defined');
    }

    devServer.app.get('/setup-middleware/some/path', (_, response) => {
      response.send('setup-middlewares option GET');
    });

    return middlewares;
  }
}
```

## 8. 最佳实践

1. **开发环境专用**：只在开发环境使用 webpack-dev-server
2. **配置分离**：将开发和生产配置分开
3. **合理使用 HMR**：对于 React/Vue 等框架，使用专门的 HMR 插件
4. **代理配置**：合理配置 API 代理，避免跨域问题
5. **性能优化**：适当配置 watchOptions 和 ignored 选项

## 9. 完整示例

```javascript:webpack.dev.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    hot: true,
    open: true,
    port: 3000,
    compress: true,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
      template: './src/index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  }
};
```

这样配置后，运行 `npm start` 就可以启动开发服务器，享受热重载和其他开发便利功能了。
        

























































































































































































































































































































































































































































































































































































































































































































