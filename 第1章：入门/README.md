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































































































































































































































































































































































































































































































































































































































































































































