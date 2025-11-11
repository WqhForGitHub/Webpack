经过前面的学习，我们已经能用 Webpack 解决常见的问题了，但还有很多关于优化的知识点需要我们了解。优化可以分为优化开发体验和优化输出质量两部分，本章进一步深入讲解如何优化 Webpack 构建。

(1) 优化开发体验

优化开发体验的目的是提升开发效率，如下所述：

- 优化构建速度，如 4.1~4.4 节所述。项目庞大时构建的耗时可能会变得很长，每次等待构建的耗时加起来也会是个大数目。
- 优化使用体验，如 4.5~4.6 节所述。通过自动化手段完成一些重复的工作，让我们专注于解决问题本身。

(2) 优化输出质量

优化输出质量的目的是为用户呈现体验更好的网页，例如减少首屏加载时间、提升性能流畅度。这至关重要，因为在互联网行业竞争日益激烈的今天，这可能会关系到我们的产品的生死。

优化输出质量的本质是优化构建输出的要发布到线上的代码，分为以下几点：

- 减少用户能感知到的加载时间，也就是首屏加载时间。如 4.7~4.12 节所述。
- 提升流畅度，也就是提升代码性能。如 4.13~4.14 节所述。

优化的关键是找出问题所在，这样才能一针见血，4.15 节讲解如何利用工具快速找出问题的所在。

4.16 节会对以上优化方法做一个总结。

# 4.1 缩小文件的搜索范围

Webpack 在启动后会从配置的 Entry 出发，解析出文件中的导入语句，再递归解析。在遇到导入语句时，Webpack 会做以下两件事：

- 根据导入语句去寻找对应的要导入的文件。例如 `require('react')` 导入语句对应的文件是 `./node_modules/react/react.js`，`require('./util')` 对应的文件是 `./util.js`。
- 根据找到的要导入的文件的后缀，使用配置中的 Loader 去处理文件。例如使用 ES6 开发的 JavaScript 文件需要使用 babel-loader 处理。

虽然以上两件事对于处理一个文件来说非常快，但是在项目大了以后文件量会变得非常大，这时构建速度慢的问题就会暴露出来。虽然以上两件事无法避免，但需要尽量减少以上两件事情的发生，以提高速度。

接下来一一介绍可以优化它们的途径。

## 1. 优化 Loader 配置

由于 Loader 对文件的转换操作很耗时，所以需要让尽可能少的文件被 Loader 处理。

在 2.3 节中介绍过在使用 Loader 时，可以通过 `test`、`include`、`exclude` 三个配置项来命中 Loader 要应用规则的文件。为了尽可能少地让文件被 Loader 处理，可以通过 `include` 去命中只有哪些文件需要被处理。

以采用 ES6 的项目为例，在配置 `babel-loader` 时可以这样：

```javascript
module.exports = {
    module: {
        rules: [
            {
                // 如果项目源码中只有 js 文件，就不要写成 /\.jsx?$/，以提升正则表达式的性能
                test: /\.js$/,
                // babel-loader 支持缓存转换出的结果，通过 cacheDirectory 选项开启
                use: ['babel-loader?cacheDirectory'],
                // 只对项目根目录下的 src 目录中的文件采用 babel-loader
                include: path.resolve(__dirname, 'src')
            }
        ]
    }
}
```

我们可以适当调整项目的目录结构，以方便在配置 Loader 时通过 `include` 缩小命中的范围。

## 2. 优化 resolve.modules 配置

在 2.4 节中介绍过 `resolve.modules`，它用于配置 Webpack 去哪些目录下寻找第三方模块。

`resolve.modules` 的默认值是 `['node_modules']`，含义是先去当前目录的 `./node_modules` 目录下去找我们想要的模块，如果没找到，就去上一级目录 `../node_modules` 中找，再没有就去 `../../node_modules` 中找，以此类推，这和 Node.js 的模块寻找机制很相似。

当安装的第三方模块都放在项目根目录的 `./node_modules` 目录下时，就没有必要按照默认的方式去一层层地寻找，可以指明存放第三方模块的绝对路径，以减少寻找，配置如下：

```javascript
module.exports = {
  resolve: {
    // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
    // 其中，__dirname 表示当前工作目录，也就是项目根目录
    modules: [path.resolve(__dirname, 'node_modules')],
  },
};
```

## 3. 优化 resolve.mainFields 配置

在 2.4 节中介绍过 `resolve.mainFields`，它用于配置第三方模块使用哪个入口文件。

在安装的第三方模块中都会有一个 `package.json` 文件，用于描述这个模块的属性，其中的某些字段用于描述入口文件在哪里，`resolve.mainFields` 用于配置采用哪个字段作为入口文件的描述字段。

可以存在多个字段描述入口文件的原因是，某些模块可以同时用于多个环境中，针对不同的运行环境需要使用不同的代码。以 isomorphic-fetch (https://github.com/matthew-andrews/isomorphic-fetch) 为例，它是 Fetch API (https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API) 的一个实现，但可同时用于浏览器和 Node.js 环境。在它的 `package.json` 中就有两个入口文件描述字段：

```json
{
  "browser": "fetch-npm-browserify.js",
  "main": "fetch-npm-node.js"
}
```

isomorphic-fetch 在不同的运行环境下使用不同的代码，是因为 Fetch API 的实现机制不一样，在浏览器中通过原生的 fetch 或者 XMLHttpRequest 实现，在 Node.js 中通过 http 模块实现。

`resolve.mainFields` 的默认值和当前的 `target` 配置有关系，对应的关系如下：

- 当 `target` 为 `web` 或者 `webworker` 时，值是 `["browser", "module", "main"]`；
- 当 `target` 为其他情况时，值是 `["module", "main"]`。

以 `target` 等于 `web` 为例，Webpack 会先采用第三方模块中的 `browser` 字段去寻找模块的入口文件，如果不存在，就采用 `module` 字段，以此类推。

为了减少搜索步骤，在明确第三方模块的入口文件描述字段时，我们可以将它设置得尽量少。由于大多数第三方模块都采用 `main` 字段描述入口文件的位置，所以可以这样配置 Webpack：

```javascript
module.exports = {
  resolve: {
    // 只采用 main 字段作为入口文件的描述字段，以减少搜索步骤
    mainFields: ['main'],
  },
};
```

使用本方法优化时，需要考虑到所有运行时依赖的第三方模块的入口文件的描述字段，就算只有一个模块出错，也可能会造成构建出的代码无法正常运行。

## 4. 优化 resolve.alias 配置

在 2.4 节中介绍过，`resolve.alias` 配置项通过别名来将原导入路径映射成一个新的导入路径。

在实战项目中经常会依赖一些庞大的第三方模块，以 React 库为例，安装到 `node_modules` 目录下的 React 库的目录结构如下：

```plaintext
react
├── dist
│   ├── react.js
│   ├── react.min.js
│   └── ...
├── lib
│   ├── LinkedStateMixin.js
│   ├── createClass.js
│   ├── React.js
│   └── ...
├── package.json
└── react.js
```

可以看到在发布出去的 React 库中包含两套代码：

- 一套是采用 CommonJS 规范的模块化代码，这些文件都放在 `lib` 目录下，以 `package.json` 中指定的入口文件 `react.js` 为模块的入口。
- 一套是将 React 的所有相关代码打包好的完整代码放到一个单独的文件中，这些代码没有采用模块化，可以直接执行。其中 `dist/react.js` 用于开发环境，里面包含检查和警告的代码。`dist/react.min.js` 用于线上环境，被最小化了。

在默认情况下，Webpack 会从入口文件 `./node_modules/react/react.js` 开始递归解析和处理依赖的几十个文件，这会是一个很耗时的操作。通过配置 `resolve.alias` 别名，可以让 Webpack 在处理 React 库时，直接使用单独、完整的 `react.min.js` 文件，从而跳过耗时的递归解析操作。

相关的 Webpack 配置如下：

```javascript
module.exports = {
  resolve: {
    // 使用 alias 将导入 react 的语句换成直接使用单独、完整的 react.min.js 文件
    // 减少耗时的递归解析操作
    alias: {
      'react': path.resolve(__dirname, './node_modules/react/dist/react.min.js'),
    },
  },
};
```

除了 React 库，大多数库被发布到 Npm 仓库中时都包含打包好的完整文件，对于这些库，也可以对它们配置 alias。

但是，对某些库使用本优化方法后，会影响到后面要讲的使用 Tree Shaking 去除无效代码的优化。因为打包好的完整文件中有些部分代码在我们的项目中可能永远用不上。一般对整体性比较强的库采用本方法优化，因为完整文件中的代码是一个整体，每一行都是不可缺少的。但是对于一些工具类的库如 lodash (https://github.com/lodash/lodash)，我们的项目中可能只用到了其中几个工具函数，就不能使用本方法去优化了，因为这会导致在我们的输出代码中包含很多永远不会被执行的代码。

## 5. 优化 resolve.extensions 配置

在 2.4 节中介绍过，`resolve.extensions` 用于配置在尝试过程中用到的后缀列表，默认是：

```javascript
extensions: ['.js', '.json']
```

也就是说，当遇到 `require('./data')` 这样的导入语句时，Webpack 会先去寻找 `./data.js` 文件，如果该文件不存在，就去寻找 `./data.json` 文件，如果还是找不到就报错。

如果这个列表越长，或者正确的后缀越靠后，就会造成尝试的次数越多，所以 `resolve.extensions` 的配置也会影响到构建的性能。在配置 `resolve.extensions` 时需要遵守以下几点，以做到尽可能地优化构建性能。

- 后缀尝试列表要尽可能小，不要将项目中不可能存在的情况写到后缀尝试列表中。
- 频率出现最高的文件后缀要优先放在最前面，以做到尽快退出寻找过程。
- 在源码中写导入语句时，要尽可能带上后缀，从而可以避免寻找过程。例如在确定的情况下将 `require('./data')` 写成 `require('./data.json')`。

相关的 Webpack 配置如下：

```javascript
module.exports = {
  resolve: {
    // 尽可能减少后缀尝试的可能性r
    extensions: ['.js'],
  },
};
```

## 6. 优化 module.noParse 配置

在 2.3 节中介绍过，`module.noParse` 配置项可以让 Webpack 忽略对部分没采用模块化的文件的递归解析处理，这样做的好处是能提高构建性能。原因是一些库如 jQuery、ChartJS 庞大又没有采用模块化标准，让 Webpack 解析这些文件既耗时又没有意义。

在前面讲解优化 `resolve.alias` 配置时讲到，单独、完整的 `react.min.js` 文件没有采用模块化，让我们通过配置 `module.noParse` 忽略对 `react.min.js` 文件的递归解析处理，相关的 Webpack 配置如下：

```javascript
const path = require('path');

module.exports = {
  module: {
    // 单独、完整的 `react.min.js` 文件没有采用模块化，忽略对 `react.min.js` 文件的递归解析处理
    noParse: [/react\.min\.js$/],
  },
};
```

注意，被忽略掉的文件里不应该包含 `import`、`require`、`define` 等模块化语句，不然会导致在构建出的代码中包含无法在浏览器环境下执行的模块化语句。

以上就是所有和缩小文件搜索范围相关的构建性能优化方面的内容了，在根据自己项目的需要按照以上方法改造后，构建速度一定会有所提升。

本实例提供项目的完整代码，参见 http://webpack.wuhaolin.cn/4-1 缩小文件搜索范围.zip。

# 4.3 使用 HappyPack

由于有大量文件需要解析和处理，所以构建是文件读写和计算密集型的操作，特别是当文件数量变多后，Webpack 构建慢的问题会显得更为严重。运行在 Node.js 之上的 Webpack 是单线程模型的，也就是说 Webpack 需要一个一个地处理任务，不能同时处理多个任务。

文件读写和计算操作是无法避免的，那能不能让 Webpack 在同一时刻处理多个任务，发挥多核 CPU 电脑的功能，以提升构建速度呢？

HappyPack（https://github.com/amireh/happypack）就能让 Webpack 做到这一点，它将任务分解给多个子进程去并发执行，子进程处理完后再将结果发送给主进程。

由于 JavaScript 是单线程模型，所以要想发挥多核 CPU 的功能，就只能通过多进程实现，而无法通过多线程实现。

## 1. 使用 HappyPack

对于分解任务和管理线程的事情，HappyPack 都会帮我们做好。我们所需要做的只是接入 HappyPack。接入 HappyPack 的相关代码如下：

```javascript
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HappyPack = require('happypack');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        // 将对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
        use: ['happypack/loader?id=babel'],
        // 排除 node_modules 目录下的文件，node_modules 目录下的文件都采用了 ES5 语法，没必要再通过 Babel 去转换
        exclude: path.resolve(__dirname, 'node_modules'),
      },
      {
        // 将对 .css 文件的处理转交给 id 为 css 的 HappyPack 实例
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['happypack/loader?id=css'],
        }),
      },
    ],
  },

  plugins: [
    new HappyPack({
      // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
      id: 'babel',
      // 如何处理 .js 文件，用法和 Loader 配置中的一样
      loaders: ['babel-loader?cacheDirectory'],
      // ... 其他配置项
    }),
    new HappyPack({
      id: 'css',
      // 如何处理 .css 文件，用法和 Loader 配置中的一样
      loaders: ['css-loader'],
    }),
    new ExtractTextPlugin({
      filename: '[name].css',
    }),
  ],
};
```

在以上代码中有以下两项重要的修改。

- 在 Loader 配置中，对所有文件的处理都交给了 `happypack/loader`，使用紧跟其后的 querystring `?id=babel` 去告诉 `happypack/loader` 选择哪个 HappyPack 实例处理文件。
- 在 Plugin 配置中新增了两个 HappyPack 实例，分别用于告诉 `happypack/loader` 如何处理 .js 和 .css 文件。选项中的 `id` 属性的值和上面 querystring 中的 `?id=babel` 对应，选项中的 `loaders` 属性和 Loader 配置中的一样。

在实例化 HappyPack 插件时，除了可以传入 `id` 和 `loaders` 两个参数，HappyPack 还支持传入如下参数。

- `threads`：代表开启几个子进程去处理这一类型的文件，默认是 3 个，必须是整数。
- `verbose`：是否允许 HappyPack 输出日志，默认是 `true`。
- `threadPool`：代表共享进程池，即多个 HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多，相关代码如下：

```javascript
const HappyPack = require('happypack');
// 构造出共享进程池，在进程池中包含 5 个子进程
const happyThreadPool = HappyPack.ThreadPool({ size: 5 });

module.exports = {
  plugins: [
    new HappyPack({
      // 用唯一的标识符 id 来代表当前的 HappyPack 用来处理一类特定的文件
      id: 'babel',
      // 如何处理 .js 文件，用法和 Loader 配置中一样
      loaders: ['babel-loader?cacheDirectory'],
      // 使用共享进程池中的子进程去处理任务
      threadPool: happyThreadPool,
    }),
    new HappyPack({
      id: 'css',
      // 如何处理 .css 文件，用法和 Loader 配置中的一样
      loaders: ['css-loader'],
      // 使用共享进程池中的子进程去处理任务
      threadPool: happyThreadPool,
    }),
    new ExtractTextPlugin({
      filename: '[name].css',
    }),
  ],
};
```

接入 HappyPack 后，需要为项目安装新的依赖：

```bash
npm i -D happypack
```

安装成功后重新执行构建，就会看到由 HappyPack 输出的以下日志：

```plaintext
Happy[BABEL]: Version: 4.0.0-beta.5. Threads: 3
Happy[BABEL]: All set; signaling webpack to proceed.
Happy[CSS]: Version: 4.0.0-beta.5. Threads: 3
Happy[CSS]: All set; signaling webpack to proceed.
```

这说明 HappyPack 配置生效了，并且可以得知 HappyPack 分别启动了 3 个子进程去并行处理任务。

本实例提供项目的完整代码，参见 http://webpack.wuhaolin.cn/4-3 使用 HappyPack.zip。

## 2. HappyPack 的原理

在整个 Webpack 构建流程中，最耗时的流程可能就是 Loader 对文件的转换操作了，因为要转换的文件数据量巨大，而且这些转换操作都只能一个一个地处理。HappyPack 的核心原理就是将这部分任务分解到多个进程中去并行处理，从而减少总的构建时间。

从前面的使用中可以看出，所有需要通过 Loader 处理的文件都先交给了 `happypack/loader` 去处理，在收集到了这些文件的处理权后，HappyPack 就可以统一分配了。

每通过 `new HappyPack()` 实例化一个 HappyPack，其实就是告诉 HappyPack 核心调度器如何通过一系列 Loader 去转换一类文件，并且可以指定如何为这类转换操作分配子进程。

核心调度器的逻辑代码在主进程中，也就是运行着 Webpack 的进程中，核心调度器会将一个个任务分配给当前空闲的子进程，子进程处理完毕后将结果发送给核心调度器，它们之间的数据交换是通过进程间的通信 API 实现的。

核心调度器收到来自子进程处理完毕的结果后，会通知 Webpack 该文件已处理完毕。

# 4.4 使用 ParallelUglifyPlugin

在使用 Webpack 构建出用于发布到线上的代码时，都会有压缩代码这一流程。最常见的 JavaScript 代码压缩工具是 UglifyJS（https://github.com/mishoo/UglifyJS2），并且 Webpack 也内置了它。

若用过 UglifyJS，则我们一定会发现能很快通过它构建用于开发环境的代码，但在构建用于线上的代码时会卡在一个时间点迟迟没有反应，其实在这个卡住的时间点正在进行的就是代码压缩。

由于压缩 JavaScript 代码时，需要先将代码解析成 Object 抽象表示的 AST 语法树，再去应用各种规则分析和处理 AST，所以导致这个过程的计算量巨大，耗时非常多。

为什么不将在 4.3 节中介绍过的多进程并行处理的思想也引入到代码压缩中呢？ParallelUglifyPlugin（https://github.com/gdborton/webpack-parallel-uglify-plugin）就做了这件事情。当 Webpack 有多个 JavaScript 文件需要输出和压缩时，原本会使用 UglifyJS 去一个一个压缩再输出，但是 ParallelUglifyPlugin 会开启多个子进程，将对多个文件的压缩工作分配给多个子进程去完成，每个子进程其实还是通过 UglifyJS 去压缩代码，但是变成了并行执行。所以 ParallelUglifyPlugin 能更快地完成对多个文件的压缩工作。

ParallelUglifyPlugin 的使用也非常简单，将原来 Webpack 配置文件中内置的 UglifyJsPlugin 去掉，再替换成 ParallelUglifyPlugin 即可，相关代码如下：

```javascript
const path = require('path');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

module.exports = {
  plugins: [
    // 使用 ParallelUglifyPlugin 并行压缩输出的 JavaScript 代码
    new ParallelUglifyPlugin({
      // 传递给 UglifyJS 的参数
      uglifyJS: {
        output: {
          // 最紧凑的输出
          beautify: false,
          // 剔除所有注释
          comments: false,
        },
        compress: {
            // 在 UglifyJS 删除没有用到的代码时不输出警告
            warnings: false,
            // 删除所有的 `console` 语句，可以兼容 IE 浏览器
            drop_console: true,
            // 内嵌已定义但是只用到一次的变量
            collapse_vars: true,
            // 提取出出现多次但是没有定义成变量去引用的静态值
            reduce_vars: true
        },
      },
    })
  ],
};
```

在通过 `new ParallelUglifyPlugin()` 实例化时，支持以下参数：

- **test**：使用正则去匹配哪些文件需要被 ParallelUglifyPlugin 压缩，默认为 `/.js$/`，也就是默认压缩所有的 .js 文件。
- **include**：使用正则去命中需要被 ParallelUglifyPlugin 压缩的文件，默认为 `[]`。
- **exclude**：使用正则去命中不需要被 ParallelUglifyPlugin 压缩的文件，默认为 `[]`。
- **cacheDir**：缓存压缩后的结果，下次遇到一样的输入时直接从缓存中获取压缩后的结果并返回。cacheDir 用于配置缓存存放的目录路径。默认不会缓存，若想开启缓存，请设置一个目录路径。
- **workerCount**：开启几个子进程去并发执行压缩。默认为当前运行的计算机的 CPU 核数减 1。
- **sourceMap**：是否输出 Source Map，这会导致压缩过程变慢。
- **uglifyJS**：用于压缩 ES5 代码时的配置，为 Object 类型，被原封不动地传递给 UglifyJS 作为参数。
- -**uglifyES**：用于压缩 ES6 代码时的配置，为 Object 类型，被原封不动地传递给 UglifyES 作为参数。

其中的 test、include、exclude 与配置 Loader 时的思想和用法一样。

UglifyES（https://github.com/mishoo/UglifyJS2/tree/harmony）是 UglifyJS 的变种，专门用于压缩 ES6 代码。它们都出自同一个项目，并且不能同时使用。

UglifyES 一般用于为比较新的 JavaScript 运行环境压缩代码，例如用于 ReactNative 的代码运行在兼容性较好的 JavaScriptCore 引擎中，为了得到更好的性能和尺寸，可采用 UglifyES 压缩。

ParallelUglifyPlugin 同时内置了 UglifyJS 和 UglifyES，也就是说 ParallelUglifyPlugin 支持并行压缩 ES6 代码。

接入 ParallelUglifyPlugin 后，项目需要安装新的依赖：

```bash
npm i -D webpack-parallel-uglify-plugin
```

安装成功后重新执行构建，会发现速度变快了许多。如果设置 cacheDir 开启缓存，则在之后的构建中速度会更快。

本实例提供项目的完整代码，参见 http://webpack.wuhaolin.cn/4.4 使用 ParallelUglifyPlugin.zip。

# 4.5 使用自动刷新

在开发阶段，修改源码是不可避免的操作。对于开发网页来说，要想看到修改后的效果，就需要刷新浏览器让其重新运行最新的代码。虽然这相对于开发原生 iOS 和 Android 应用来说要方便很多，因为那需要重新编译这个项目再运行，但我们可以将这个体验优化得更好。借助自动化的手段，可以将这些重复的操作交给代码去帮我们完成，在监听到本地源码文件发生变化时，自动重新构建出可运行的代码再控制浏览器刷新。

Webpack 将这些功能都内置了，并且提供了多种方案供我们选择。

## 1. 文件监听

文件监听是在发现源码文件发生变化时，自动重新构建出新的输出文件。

Webpack 官方提供了两大模块，一个是核心的 webpack（https://www.npmjs.com/package/webpack），一个是在 1.6 节中提到的 webpack-dev-server，而文件监听功能是 Webpack 提供的。

在 2.7 节中曾介绍过 Webpack 支持文件监听相关的配置项，代码如下：

```javascript
module.exports = {
  // 只有在开启监听模式时，watchOptions 才有意义
  // 默认为 false，也就是不开启
  watch: true,
  // 监听模式运行时的参数
  watchOptions: {
    // 不监听的文件或文件夹，支持正则匹配
    // 默认为空
    ignored: /node_modules/,
    // 监听到变化发生后等 300ms 再去执行动作，截流，
    // 防止文件更新太快而导致重新编译频率太快。默认为 300ms
    aggregateTimeout: 300,
    // 判断文件是否发生变化是通过不停地询问系统指定文件有没有变化实现的
    // 默认为每秒询问 1000 次
    poll: 1000
  }
}
```

让 Webpack 开启监听模式时，有如下两种方式：

- 在配置文件 webpack.config.js 中设置 `watch: true`。
- 在执行启动 Webpack 的命令时带上 `--watch` 参数，完整的命令是 `webpack --watch`。

### 1. 文件监听的工作原理

在 Webpack 中监听一个文件发生变化的原理，是定时获取这个文件的最后编辑时间，每次都存下最新的最后编辑时间。如果发现当前获取的和最后一次保存的最后编辑时间不一致，就认为该文件发生了变化。配置项中的 `watchOptions.poll` 用于控制定时检查的周期，具体含义是每秒检查多少次。

当发现某个文件发生了变化时，并不会立刻告诉监听者，而是先缓存起来，收集一段时间的变化后，再一次性告诉监听者。配置项中的 `watchOptions.aggregateTimeout` 用于配置这个等待时间。这样做的目的，是我们在编辑代码的过程中可能会高频地输入文字，导致文件变化的事件高频地发生，如果每次都重新执行构建，就会让构建卡死。

对于多个文件来说，其原理相似，只不过会对列表中的每个文件都定时执行检查。但是怎么确定这个需要监听的文件列表呢？在默认情况下，Webpack 会从配置的 Entry 文件出发，递归解析出 Entry 文件所依赖的文件，将这些依赖的文件都加入监听列表中。可见，Webpack 这一点还是做得很智能的，而不是粗暴地直接监听项目目录下的所有文件。

由于保存文件的路径和最后的编辑时间需要占用内存，定时检查周期检查需要占用 CPU 及文件 I/O，所以最好减少需要监听的文件数量和降低检查频率。

### 2. 优化文件监听的性能

在明白文件监听的工作原理后，就可以分析如何优化文件监听的性能了。

在开启监听模式时，默认情况下会监听配置的 Entry 文件和所有 Entry 递归依赖的文件。在这些文件中会有很多存在于 node_modules 下。因为如今的 Web 项目会依赖大量的第三方模块，所以在大多数情况下我们都不可能去编辑 node_modules 下的文件，而是编辑自己建立的源码文件，而一个很大的优化点就是忽略 node_modules 下的文件，不监听它们。相关配置如下：

```javascript
module.exports = {
  watchOptions: {
    // 不监听的 node_modules 目录下的文件
    ignored: /node_modules/,
  }
}
```

采用这种方法优化后，Webpack 消耗的内存和 CPU 将会大大减少。

有时我们可能会觉得 node_modules 目录下的第三方模块有 Bug，想修改第三方模块的文件，然后在自己的项目中尝试。如果在这种情况下使用以上优化方法，就需要重启构建以看到最新效果，但这种情况是非常少见的。

除了忽略部分文件的优化，还有如下两种方法：

- `watchOptions.aggregateTimeout` 的值越大性能越好，因为这能降低重新构建的频率。
- `watchOptions.poll` 的值越小越好，因为这能降低检查的频率。

但两种优化方法的后果是监听模式的反应和灵敏度降低了。

## 2. 自动刷新浏览器

监听到文件更新后的下一步是刷新浏览器，webpack 模块负责监听文件，webpack-dev-server 模块则负责刷新浏览器。在使用 webpack-dev-server 模块去启动 webpack 模块时，webpack 模块的监听模式默认会被开启。webpack 模块会在文件发生变化时通知 webpack-dev-server 模块。

### 1. 自动刷新的原理

控制浏览器刷新有如下三种方法：

- 借助浏览器扩展去通过浏览器提供的接口刷新，WebStorm IDE 的 LiveEdit 功能就是这样实现的。
- 向要开发的网页中注入代理客户端代码，通过代理客户端去刷新整个页面。
- 将要开发的网页装进一个 iframe 中，通过刷新 iframe 去看到最新效果。

DevServer 支持第 2、3 种方法，第 2 种是 DevServer 默认采用的刷新方法。

通过 DevServer 启动构建后，会看到如下日志：

```bash
> webpack-dev-server
Project is running at http://localhost:8080/
webpack output is served from /
Hash: e4e2f9508ac286037e71
Version: webpack 3.5.5
Time: 1566ms
  Asset    Size  Chunks             Chunk Names
bundle.js  1.07 MB       0  [emitted]  [big]  main
bundle.js.map  1.27 MB       0  [emitted]         main
   [115] multi (webpack)-dev-server/client?http://localhost:8080 ./main.js 40 bytes {0} [built]
   [116] (webpack)-dev-server/client?http://localhost:8080 5.83 kB {0} [built]
   [117] ./node_modules/url/url.js 23.3 kB {0} [built]
   [120] ./node_modules/querystring-es3/index.js 127 bytes {0} [built]
   [123] ./node_modules/strip-ansi/index.js 161 bytes {0} [built]
   [125] ./node_modules/loglevel/lib/loglevel.js 6.74 kB {0} [built]
   [126] (webpack)-dev-server/client/socket.js 856 bytes {0} [built]
   [158] (webpack)-dev-server/client/overlay.js 3.16 kB {0} [built]
   [159] ./node_modules/ansi-html/index.js 4.26 kB {0} [built]
   [163] (webpack)/hot nonrecursive ^\.\/log$ 170 bytes {0} [built]
   [165] (webpack)/hot/emitter.js 77 bytes {0} [built]
   [167] ./main.js 2.28 kB {0} [built]
   + 255 hidden modules
```

细心的你会观察到输出的 bundle.js 中包含了以下 7 个模块：

```plaintext
[116] (webpack)-dev-server/client?http://localhost:8080 5.83 kB {0} [built]
[117] ./node_modules/url/url.js 23.3 kB {0} [built]
[120] ./node_modules/querystring-es3/index.js 127 bytes {0} [built]
[123] ./node_modules/strip-ansi/index.js 161 bytes {0} [built]
[125] ./node_modules/loglevel/lib/loglevel.js 6.74 kB {0} [built]
[126] (webpack)-dev-server/client/socket.js 856 bytes {0} [built]
[158] (webpack)-dev-server/client/overlay.js 3.16 kB {0} [built]
```

这 7 个模块就是代理客户端的代码，它们被打包到了要开发的网页代码中。

在浏览器中打开网址 http://localhost:8080/ 后，在浏览器的开发者工具中会发现由代理客户端向 DevServer 发起的 WebSocket 连接，如图 4-1 所示。

### 2. 优化自动刷新的性能

在 2.6 节中曾介绍过 `devServer.inline` 配置项，它用来控制是否向 Chunk 中注入代理客户端，默认注入。事实上，在开启 inline 时，DevServer 会向每个输出的 Chunk 中注入代理客户端的代码，当我们的项目需要输出很多 Chunk 时，就会导致构建缓慢。其实要完成自动刷新，一个页面只需要一个代理客户端，DevServer 之所以粗暴地为每个 Chunk 都注入，是因为它不知道某个网页依赖哪几个 Chunk，索性全部都注入一个代理客户端。网页只要依赖了其中任何一个 Chunk，代理客户端就被注入网页中。

这里的优化思路是关闭还不够优雅的 inline 模式，只注入一个代理客户端。为了关闭 inline 模式，在启动 DevServer 时可以通过执行命令 `webpack-dev-server --inline false`（也可以在配置文件中设置）来完成，这时输出的日志如下：

```bash
> webpack-dev-server --inline false
Project is running at http://localhost:8080/webpack-dev-server/
webpack output is served from /
Hash: 5a43fc44b5e85f4c2cf1
Version: webpack 3.5.5
Time: 1130ms
  Asset    Size  Chunks             Chunk Names
bundle.js  750 kB       0  [emitted]  [big]  main
bundle.js.map  897 kB       0  [emitted]         main
   [81] ./main.js 2.29 kB {0} [built]
   + 169 hidden modules
```

和前面的不同在于：

- 入口网址变成了 http://localhost:8080/webpack-dev-server/；
- bundle.js 中不再包含代理客户端的代码。

在浏览器中打开网址 http://localhost:8080/webpack-dev-server/ 后，会看到如图 4-2 所示的效果。

要开发的网页被放进了一个 iframe 中，编辑源码后，iframe 会被自动刷新。同时我们会发现构建的时间从 1566ms 减少到了 1130ms，说明优化生效了。要输出的 Chunk 数量越多，构建性能提升的效果越明显。

在关闭 inline 后，DevServer 会自动提示通过新网址 http://localhost:8080/webpack-dev-server/ 去访问，这一点做得很人性化。

如果不想以 iframe 的方式去访问，但同时想让网页保持自动刷新的功能，则需要手动向网页中注入代理客户端的脚本，向 index.html 中插入以下标签：

```html
<!-- 注入 DevServer 提供的代理客户端脚本，这个服务是 devServer 内置的 -->
<script src="http://localhost:8080/webpack-dev-server.js"></script>
```

向网页注入以上脚本后，独立打开的网页就能自动刷新了。但是要注意在发布到线上时删掉这段用于开发环境的代码。

本实例提供项目的完整代码，参见 http://webpack.wuhaolin.cn/4.5 使用自动刷新.zip。

# 4.6 开启模块热替换

要做到实时预览，除了可以用 4.5 中介绍的刷新整个网页的方法，DevServer 还支持一种叫做模块热替换（Hot Module Replacement）的技术可在不刷新整个网页的情况下做到超灵敏实时预览。原理是在一个源码发生变化时，只需重新编译发生变化的模块，再用新输出的模块替换掉浏览器中对应的老模块。

模块热替换技术的优势如下：

- 实时预览反应更快，等待时间更短。
- 不刷新浏览器时能保留当前网页的运行状态，例如在使用 Redux 管理数据的应用中搭配模块热替换能做到在代码更新时 Redux 中的数据保持不变。

总的来说，模块热替换技术在很大程度上提升了开发效率和体验。

## 1. 模块热替换的原理

模块热替换的原理和自动刷新的原理类似，都需要向要开发的网页中注入一个代理客户端来连接 DevServer 和网页，不同在于模块热替换的独特的模块替换机制。

DevServer 默认不会开启模块热替换模式，要开启该模式，则只需在启动时带上参数 `--hot`，完整的命令是 `webpack-dev-server --hot`。

除了通过在启动时带上 `--hot` 参数，还可以通过接入 Plugin 实现，相关代码如下：

```javascript
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');

module.exports = {
  entry: {
    // 为每个入口都注入代理客户端
    main: [
      'webpack-dev-server/client?http://localhost:8080/',
      'webpack/hot/dev-server',
      './src/main.js'
    ]
  },
  plugins: [
    // 该插件的作用就是实现模块热替换，实际上若启动时带上 `--hot` 参数，就会注入该插件，生成 .hot-update.json 文件。
    new HotModuleReplacementPlugin(),
  ],
  devServer: {
    // 告诉 DevServer 要开启模块热替换模式
    hot: true,
  }
};
```

在启动 Webpack 时带上参数 `-hot`，其实就是自动完成以上配置。

启动后的日志如下：

```plaintext
> webpack-dev-server --hot

Project is running at http://localhost:8080/
webpack output is served from /
webpack: wait until bundle finished: /
webpack: wait until bundle finished: /bundle.js
Hash: fe62ac6b753c1d98961b
Version: webpack 3.5.5
Time: 3563ms
          Asset     Size  Chunks             Chunk Names
      bundle.js  1.11 MB       0  [emitted]  [big]  main
  bundle.js.map  1.33 MB       0  [emitted]         main
 [50] (webpack)/hot/log.js 1.04 kB {0} [built]
[118] multi (webpack)-dev-server/client?http://localhost:8080 webpack/hot/dev-server ./main.js 52 bytes {0} [built]
[119] (webpack)-dev-server/client?http://localhost:8080 3.6 kB {0} [built]
[120] ./node_modules/url/url.js 23.3 kB {0} [built]
[126] ./node_modules/strip-ansi/index.js 161 bytes {0} [built]
[128] ./node_modules/loglevel/lib/loglevel.js 6.74 kB {0} [built]
[129] (webpack)-dev-server/client/socket.js 856 bytes {0} [built]
[161] (webpack)-dev-server/client/overlay.js 3.6 kB {0} [built]
[166] (webpack)/hot nonrecursive ^\.\/log$ 170 bytes {0} [built]
[168] (webpack)/hot/dev-server.js 1.61 kB {0} [built]
[169] (webpack)/hot/log-apply-result.js 1.31 kB {0} [built]
[170] ./main.js 2.35 kB {0} [built]
   + 262 hidden modules
```

可以看出，bundle.js 代理客户端相关的代码包含 9 个文件：

```plaintext
[119] (webpack)-dev-server/client?http://localhost:8080 5.83 kB {0} [built]
[120] ./node_modules/url/url.js 23.3 kB {0} [built]
[126] ./node_modules/strip-ansi/index.js 161 bytes {0} [built]
[128] ./node_modules/loglevel/lib/loglevel.js 6.74 kB {0} [built]
[129] (webpack)-dev-server/client/socket.js 856 bytes {0} [built]
[161] (webpack)-dev-server/client/overlay.js 3.6 kB {0} [built]
[166] (webpack)/hot nonrecursive ^\.\/log$ 170 bytes {0} [built]
[168] (webpack)/hot/dev-server.js 1.61 kB {0} [built]
[169] (webpack)/hot/log-apply-result.js 1.31 kB {0} [built]
```

与自动刷新的代理客户端相比，最后多出了三个用于模块热替换的文件，也就是说代理客户端更大了。

修改源码 main.css 文件后，重新输出了如下日志：

```plaintext
webpack: Compiling...
Hash: 18f81c95918f6230623
Version: webpack 3.5.5
Time: 551ms
          Asset       Size  Chunks             Chunk Names
      bundle.js    1.11 MB       0  [emitted]  [big]  main
0.ea11a51f97f2b52b2bca7d.hot-update.js  353 bytes       0  [emitted]  main
ea11a51f97f2b52b2bca7d.hot-update.json   43 bytes          [emitted]
  bundle.js.map    1.33 MB       0  [emitted]         main
0.ea11a51f97f2b52b2bca7d.hot-update.js.map  577 bytes       0  [emitted]  main
 [68] ./node_modules/css-loader!./main.css 217 bytes {0} [built]
[166] (webpack)/hot nonrecursive ^\.\/log$ 170 bytes {0} [built]
   + 275 hidden modules
webpack: Compiled successfully.
```

DevServer 重新生成了一个用于替换老模块的补丁文件 `0.ea11a51f97f2b52b2bca7d.hot-update.js`，同时在浏览器开发工具中也能看到请求这个补丁的抓包，如图 4-3 所示。

可见补丁中包含了 main.css 文件新编译出来的 CSS 代码，网页中的样式也立刻变成了源码中描述的那样。

但在修改 main.js 文件时，我们会发现模块热替换没有生效，而是整个页面被刷新了，为什么修改 main.js 文件时会有这样的效果呢？

为了让使用者在使用模块热替换功能时能灵活地控制老模块被替换时的逻辑，Webpack 允许在源码中定义一些代码去做相应的处理。

将 main.js 文件修改如下：

```javascript
import React from 'react';
import { render } from 'react-dom';
import { AppComponent } from './AppComponent';
import './main.css';

render(<AppComponent />, window.document.getElementById('app'));

// 只有当开启了模块热替换时 module.hot 才存在
if (module.hot) {
  // accept 函数的第 1 个参数指出当前文件接收哪些子模块的替换，这里表示只接收 ./AppComponent 这个子模块
  // 第 2 个参数用于在新的子模块加载完毕后需要执行的逻辑
  module.hot.accept(['./AppComponent'], () => {
    // 在新的 AppComponent 加载成功后重新执行组建渲染逻辑
    render(<AppComponent />, window.document.getElementById('app'));
  });
}
```

其中的 `module.hot` 是当开启模块热替换后注入全局的 API，用于控制模块热替换的逻辑。

现在修改 AppComponent.js 文件，将 `Hello,Webpack` 改成 `Hello,World`，我们会发现模块热替换生效了。但是在编辑 main.js 时，我们会发现整个网页被刷新了。为什么修改这两个文件会有不一样的表现呢？

其原因在于当子模块发生更新时，更新事件会一层层地向上传递，也就是从 AppComponent.js 文件传递到 main.js 文件，直到有某层的文件接收了当前变化的模块，即 main.js 文件中定义的 `module.hot.accept(['./AppComponent'], callback)`，这时就会调用 callback 函数去执行自定义逻辑。如果事件一直往上抛，到最外层都没有文件接收它，则会直接刷新网页。

那为什么没有地方接收 .css 文件，但是修改所有 .css 文件都会触发模块热替换呢？原因在于 style-loader 会注入用于接收 CSS 的代码。

请不要将模块热替换技术用于线上环境，它是专门为提升开发效率而生的。

## 2. 优化模块热替换

在发生模块热替换时，我们会在浏览器的控制台中看到类似图 4-4 所示的日志。

其中的 `Updated modules: 68` 是指 ID 为 68 的模块被替换了，这对开发者来说很不友好，因为开发者不知道 ID 和模块之间的对应关系，最好是将替换了的模块的名称输出。Webpack 内置的 NamedModulesPlugin 插件可以解决该问题，修改 Webpack 配置文件接入该插件：

```javascript
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');

module.exports = {
  plugins: [
    // 显示出被替换模块的名称
    new NamedModulesPlugin(),
  ],
};
```

重启构建后，我们会发现浏览器中的日志更友好了，如图 4-5 所示。

除此之外，模块热替换还面临和自动刷新一样的性能问题，因为它们都需要监听文件的变化和注入客户端。优化模块热替换的构建性能的思路和在 4.5 节中提到的类似：监听更少的文件，忽略 node_modules 目录下的文件。但是其中提到的关闭默认的 inline 模式且手动注入代理客户端的优化方法，不能用于使用模块热替换的情况，原因在于模块热替换的运行依赖在每个 Chunk 中都包含代理客户端的代码。

# 4.7 区分环境

## 1. 为什么需要区分环境

在开发网页的时候，一般都会有多套运行环境，例如：

- 在开发过程中方便开发调试的环境；
- 发布到线上为用户使用的运行环境。

这两套不同的环境虽然都是由同一套源代码编译而来的，但是代码的内容不一样，其差异如下：

- 线上代码已通过在 4.8 节中提到的方法进行了压缩；
- 开发用的代码包含一些用于提示开发者的日志，普通用户不可能去看这些日志；
- 开发用的代码所连接的后端数据的接口地址也可能和线上环境不同，因为要避免在开发过程中造成对线上数据的影响。

为了尽可能复用代码，在构建的过程中需要根据目标代码要运行的环境输出不同的代码，我们需要一套机制在源码中区分环境。幸运的是，Webpack 已经为我们实现了这一点。

## 2. 如何区分环境

具体的区分方法很简单，在源码中通过如下方式即可：

```javascript
if (process.env.NODE_ENV === 'production') {
  console.log('你正在线上环境');
} else {
  console.log('你正在使用开发环境');
}
```

其大概原理是通过环境变量的值去判断执行哪个分支。

当代码中出现了使用 process（https://nodejs.org/api/process.html）模块的语句时，Webpack 就会自动打包进 process 模块的代码以支持非 Node.js 的运行环境。当代码中没有使用 process 时就不会打包进 process 模块的代码。这个注入的 process 模块的作用是模拟 Node.js 中的 process，以支持上面使用的 `process.env.NODE_ENV === 'production'` 语句。

在构建线上环境代码时，需要为当前的运行环境设置环境变量 `NODE_ENV = 'production'`，Webpack 的相关配置如下：

```javascript
const DefinePlugin = require('webpack/lib/DefinePlugin');

module.exports = {
  plugins: [
    new DefinePlugin({
      // 定义 NODE_ENV 环境变量为 production
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
  ],
};
```

注意，在定义环境变量的值时用 `JSON.stringify` 包裹字符串的原因是，环境变量的值需要是一个由双引号包裹的字符串，而 `JSON.stringify('production')` 的值正好等于 `"production"`。

执行构建后，我们会在输出的文件中发现如下代码：

```javascript
if (true) {
  console.log('你正在使用线上环境');
} else {
  console.log('你正在使用开发环境');
}
```

Webpack 定义的环境变量的值被代入了源码中，process.env.NODE_ENV === 'production' 被直接替换成了 true，并且由于访问 process 的语句被替换且不存在了，Webpack 也不会将 process 模块包含到输出文件中了。

DefinePlugin 定义的环境环境只对 Webpack 需要处理的代码有效，而不会影响 Node.js 运行时的环境变量的值。

通过 Shell 脚本的方式定义的环境变量如 NODE_ENV=production webpack，Webpack 是不认识的，对 Webpack 需要处理的代码中的环境区分语句是没有作用的。

也就是说，只需要通过 DefinePlugin 定义环境变量，就能使上面介绍的环境区分语句正常工作，没必要再次通过 Shell 脚本的方式定义一遍。

如果想让 Webpack 使用通过 Shell 脚本的方式定义的环境变量，则可以使用 Environment Plugin，代码如下：

```javascript
new webpack.EnvironmentPlugin(['NODE_ENV']);
```

以上这句代码实际上等价于：

```javascript
new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
})
```

## 3. 结合 UglifyJS

其实前面输出的代码还可以进一步优化，因为 `if(true)` 语句永远只会执行前一个分支中的代码，也就是说最佳的输出应该直接是：

```javascript
console.log('你正在线上环境');
```

Webpack 没有实现去除死代码的功能，但是 UglifyJS 可以做这件事情，若想了解使用方法，请阅读 4.8 节中关于压缩 JavaScript 的内容。

## 4. 第三方库中的环境区分

除了在自己写的源码中可以有环境区分的代码，很多第三方库也做了环境区分的优化。

以 React 为例，它做了两套环境区分，分别如下：

- 开发环境：包含类型检查、HTML 元素检查等针对开发者的警告日志代码。
- 线上环境：去掉了所有针对开发者的代码，只保留了让 React 能正常运行的部分，以优化大小和性能。

例如，在 React 源码中有大量的类似下面这样的代码：

```javascript
if (process.env.NODE_ENV !== 'production') {
  warning(false, '%s(...): Can only update a mounted or mounting component.... ')
}
```

如果不定义 `NODE_ENV=production`，那么这些警告日志会被包含到输出的代码中，输出的文件将会非常大。

`process.env.NODE_ENV !== 'production'` 中的 `NODE_ENV` 和 `'production'` 两个值是社区的约定，通常使用这条判断语句来区分开发环境和线上环境。

本实例提供项目的完整代码，参见 [http://webpack.wuhaolin.cn/4-7 区分环境.zip](http://webpack.wuhaolin.cn/4-7 区分环境.zip)。

# 4.8 压缩代码

浏览器通过服务器访问网页时获取的 JavaScript、CSS 资源都是文本形式的，文件越大，网页加载的时间越长。为了提升网页加载速度和减少网络传输流量，可以对这些资源进行压缩。除了可以通过 GZIP 算法对文件进行压缩，还可以对文本本身进行压缩。

对文本本身进行压缩，除了可以提升网页加载的速度，还有混淆源码的作用。由于压缩后的代码可读性非常差，所以就算别人下载了网页的代码，也很难进行代码分析和改造。

下面一一介绍如何在 Webpack 中压缩代码。

## 1. 压缩 JavaScript

目前最成熟的 JavaScript 代码压缩工具是 UglifyJS（https://github.com/mishoo/UglifyJS2），它会分析 JavaScript 代码语法树，理解代码的含义，从而做到去掉无效代码、去掉日志输出代码、缩短变量名等优化。

我们需要通过插件的形式在 Webpack 中接入 UglifyJS。目前有两个成熟的插件，如下所述。

- `UglifyJsPlugin`：通过封装 UglifyJS 实现压缩。
- `ParallelUglifyPlugin`：多进程并行处理压缩，在 4.4 节中有详细介绍。

由于在 4.4 节中已介绍过 `ParallelUglifyPlugin`，所以这里重点介绍如何配置 UglifyJS 以达到最优的压缩效果。

UglifyJS 提供了非常多的选择，用于配置在压缩过程中采用哪些规则，可以在其官方文档（https://github.com/mishoo/UglifyJS2#minify-options）中看到所有选项说明。由于选项非常多，所以这里挑出一些常用的选项，来详细讲解其应用方式。

- `sourceMap`：是否为压缩后的代码生成对应的 Source Map，默认不生成，开启后耗时会大大增加。一般不会将压缩后的代码的 Source Map 发送给网站用户的浏览器，而是在内部开发人员调试线上代码时使用。
- `beautify`：是否输出可读性较强的代码，即会保留空格和制表符，默认为输出，为了达到更好的压缩效果，可以设置为 `false`。
- `comments`：是否保留代码中的注释，默认为保留，为了达到更好的压缩效果，可以设置为 `false`。
- `compress.warnings`：是否在 UglifyJS 删除没有用到的代码时输出警告信息，默认为输出，可以设置为 `false` 以关闭这些作用不大的警告。
- `drop_console`：是否删除代码中的所有 `console` 语句，默认为不删除。开启后不仅可以提升代码压缩的效果，也可以兼容不支持 `console` 语句的 IE 浏览器。
- `collapse_vars`：是否内联虽然已定义了但是只用到一次的变量，例如将 `var x = 5; y = x` 转换成 `y = 5`，默认为不转换。为了达到更好的压缩效果，可以设置为 `true`。
- `reduce_vars`：是否提取出现了多次但是没有定义成变量去引用的静态值，例如将 `x = 'Hello'; y = 'Hello'` 转换成 `var a = 'Hello'; x = a; y = a`，默认为不转换。为了达到更好的压缩效果，可以设置为 `true`。

也就是说，在不影响代码正确执行的前提下，最优化的代码压缩配置如下：

```javascript
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

module.exports = {
  plugins: [
    // 压缩输出的 JavaScript 代码
    new UglifyJsPlugin({
      compress: {
        // 在 UglifyJS 删除没有用到的代码时不输出警告
        warnings: false,
        // 删除所有 `console` 语句，可以兼容 IE 浏览器
        drop_console: true,
        // 内嵌已定义但是只用到一次的变量
        collapse_vars: true,
        // 提取出现了多次但是没有定义成变量去引用的静态值
        reduce_vars: true,
      },
      output: {
        // 最紧凑的输出
        beautify: false,
        // 删除所有注释
        comments: false,
      },
    }),
  ],
};
```

从以上配置可以看出，Webpack 内置了 `UglifyJsPlugin`。需要指出的是，`UglifyJsPlugin` 当前采用的是 UglifyJS2（https://github.com/mishoo/UglifyJS2），而不是老版本的 UglifyJS1（https://github.com/mishoo/UglifyJS）。这两个版本的 UglifyJS 在配置上有所区别，看文档时要注意版本。

除此之外，Webpack 还提供了一个更简便的方法来接入 `UglifyJsPlugin`，直接在启动 Webpack 时带上 `--optimize-minimize` 参数，即 `webpack --optimize-minimize`，这样 Webpack 会自动为我们注入一个带有默认配置的 `UglifyJsPlugin`。

本实例提供项目的完整代码，参见 [http://webpack.wuhaolin.cn/4-8 压缩代码 - ES5.zip](http://webpack.wuhaolin.cn/4-8 压缩代码 - ES5.zip)。

## 2. 压缩 ES6

虽然当前大多数 JavaScript 引擎还不完全支持 ES6 中的新特性，但在一些特定的运行环境下已经可以直接执行 ES6 代码了，例如最新版的 Chrome、ReactNative 的引擎 JavaScriptCore。

运行 ES6 的代码相对于转换后的 ES5 代码有如下优点。

- 对于一样的逻辑，用 ES6 实现的代码量比 ES5 更少。
- JavaScript 引擎对 ES6 中的语法做了性能优化，例如针对 `const` 申明的变量有更快的读取速度。

所以在运行环境允许的情况下，我们要尽可能地使用原生的 ES6 代码去运行，而不是使用转换后的 ES5 代码。

在用上面所讲的压缩方法去压缩 ES6 代码时，我们会发现 UglifyJS 报错退出，原因是 UglifyJS 只理解 ES5 语法的代码。为了压缩 ES6 代码，需要使用专门针对 ES6 代码的 UglifyES（https://github.com/mishoo/UglifyJS2/tree/harmony）。

UglifyES 和 UglifyJS 来自同一个项目的不同分支，它们的配置项基本相同，只是接入 Webpack 时有所区别。在为 Webpack 接入 UglifyES 时，不能使用内置的 `UglifyJsPlugin`，而是需要单独安装和使用最新版本的 `uglifyjs-webpack-plugin`（https://github.com/webpack-contrib/uglifyjs-webpack-plugin）。安装方法如下：

```bash
npm i -D uglifyjs-webpack-plugin@beta
```

Webpack 相关配置的代码如下：

```javascript
const UglifyESPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  plugins: [
    new UglifyESPlugin({
      // 多嵌套了一层
      uglifyOptions: {
        compress: {
          // 在 UglifyJS 删除没有用到的代码时不输出警告
          warnings: false,
          // 删除所有 `console` 语句，可以兼容 IE 浏览器
          drop_console: true,
          // 内嵌已定义但是只用到一次的变量
          collapse_vars: true,
          // 提取出现多次但是没有定义成变量去引用的静态值
          reduce_vars: true,
        },
        output: {
          // 最紧凑的输出
          beautify: false,
          // 删除所有注释
          comments: false,
        },
      },
    }),
  ],
};
```

同时，为了不让 `babel-loader` 输出 ES5 语法的代码，需要去掉 `.babelrc` 配置文件中的 `babel-preset-env`，但还是要保留其他 Babel 插件如 `babel-preset-react`，因为正是 `babel-preset-env` 负责将 ES6 代码转换为 ES5 代码。

本实例提供项目的完整代码，参见 [http://webpack.wuhaolin.cn/4-8 压缩代码 - ES6.zip](http://webpack.wuhaolin.cn/4-8 压缩代码 - ES6.zip)。

## 3. 压缩 CSS

CSS 代码也可以像 JavaScript 那样被压缩，以达到提升加载速度和代码混淆的作用。目前比较成熟、可靠的 CSS 压缩工具是 cssnano（[http://cssnano.co](http://cssnano.co/)），基于 PostCSS。

cssnano 能理解 CSS 代码的含义，而不仅仅是删掉空格，如下所述。

- `margin:10px 20px 10px 20px` 被压缩成 `margin: 10px 20px`。
- `color:#ff0000` 被压缩成 `color:red`。

可以到其官网查看更多的压缩规则，通常压缩率能达到 60%。

将 cssnano 接入 Webpack 中也非常简单，因为 `css-loader` 已经将其内置了，要开启 cssnano 去压缩代码，则只需开启 `css-loader` 的 `minimize` 选项。相关的 Webpack 配置如下：

```javascript
const path = require('path');
const { WebPlugin } = require('web-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/, // 增加对 CSS 文件的支持
        // 提取 Chunk 中的 CSS 代码到单独的文件中
        use: ExtractTextPlugin.extract({
          // 通过 minimize 选项压缩 CSS 代码
          use: ['css-loader?minimize'],
        }),
      },
    ],
  },
  plugins: [
    // 用 WebPlugin 生成对应的 HTML 文件
    new WebPlugin({
      template: './template.html', // HTML 模板文件所在的文件路径
      filename: 'index.html', // 输出的 HTML 的文件名称
    }),
    new ExtractTextPlugin({
      filename: '[name]_[contenthash:8].css', // 为输出的 CSS 文件名称加上 Hash 值
    }),
  ],
};
```

本实例提供项目的完整代码，参见 [http://webpack.wuhaolin.cn/4-8 压缩代码 - CSS.zip](http://webpack.wuhaolin.cn/4-8 压缩代码 - CSS.zip)。

# 4.9 CDN 加速

## 1. 什么是 CDN

虽然在前面通过压缩代码的手段减小了网络传输的大小，但实际上最影响用户体验的还是网页首次打开时的加载等待，其根本原因是网络传输过程耗时较大。CDN（内容分发网络）的作用就是加速网络传输，通过将资源部署到世界各地，使用户在访问时按照就近原则从离其最近的服务器获取资源，来加快资源的获取速度。CDN 其实是通过优化物理链路层传输过程中的光速有限、丢包等问题来提升网速的，其大致原理如图 4-6 所示。

在本节中，我们不必理解 CDN 的具体运行流程和实现原理，可以简单地将 CDN 服务看作成速度更快的 HTTP 服务。并且目前很多大公司都会建立自己的 CDN 服务，就算我们没有资源去搭建一套 CDN 服务，各大云服务提供商也都为我们提供了按量收费的 CDN 服务。

## 2. 接入 CDN

要为网站接入 CDN，需要将网页的静态资源上传到 CDN 服务上，在服务这些静态资源时需要通过 CDN 服务提供的 URL 地址去访问。

举个详细的例子，有一个单页应用，其构建出的代码结构如下：

```plaintext
dist
|-- app_9d89c964.js
|-- app_a6976b6d.css
|-- arch_ae805d49.png
`-- index.html
```

其中，index.html 的内容如下：

```html
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="app_a6976b6d.css">
</head>
<body>
  <div id="app"></div>
  <script src="app_9d89c964.js"></script>
</body>
</html>
```

app_a6976b6d.css 的内容如下：

```css
body {
  background: url(arch_ae805d49.png) repeat;
}
h1 {
  color: red;
}
```

可以看出，在导入资源之前都是通过相对路径去访问的，当将这些资源都放到同一个 CDN 服务上时，网页能正常使用。但需要注意的是，由于 CDN 服务一般都会为资源开启很长时间的缓存，例如用户从 CDN 上获取 index.html 这个文件后，即使之后的发布操作将 index.html 文件重新覆盖了，但是用户在很长一段时间内还是会运行之前的版本，这会导致新的发布不能立即生效。

要避免以上问题，业界比较成熟的做法如下：

- 针对 HTML 文件：不开启缓存，将 HTML 放到自己的服务器上，而不是 CDN 服务上，同时关闭自己服务器上的缓存。自己的服务器只提供 HTML 文件和数据接口。
- 针对静态的 JavaScript、CSS、图片等文件：开启 CDN 和缓存，上传到 CDN 服务上，同时为每个文件名带上由文件内容算出的 Hash 值，例如上面的 app_a6976b6d.css 文件。带上 Hash 值的原因是文件名会随着文件的内容而变化，只要文件的内容发生变化，其对应的 URL 就会变化，它就会被重新下载，无论缓存时间有多长。

采用以上方案后，也需要将 HTML 文件中的资源引入地址换成 CDN 服务提供的地址，例如以上 index.html 变为：

```html
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="//cdn.com/id/app_a6976b6d.css">
</head>
<body>
  <div id="app"></div>
  <script src="//cdn.com/id/app_9d89c964.js"></script>
</body>
</html>
```

并且 app_a6976b6d.css 的内容也应该变为：

```css
body {
  background: url(//cdn.com/id/arch_ae805d49.png) repeat;
}
h1 {
  color: red;
}
```

也就是说，之前的相对路径都变成了绝对的指向 CDN 服务的 URL 地址。

如果对形如 `//cdn.com/id/app_a6976b6d.css` 这样的 URL 感到陌生，则我们需要知道这种 URL 省掉了前面的 http: 或者 https: 前缀。这样做的好处是采用 HTTP 还是 HTTPS 模式，会自动根据当前 HTML 的 URL 采用了什么模式去决定。

除此之外，如果我们还知道浏览器有一个规则是，在同一时刻对同一个域名的资源的并行请求有限制（大概 4 个左右，不同的浏览器可能不同），则会发现上面的做法有很大的问题。由于所有静态资源都被放到了同一个 CDN 服务的域名下，也就是上面的 [cdn.com](https://cdn.com/) 下，如果网页的资源很多，例如有很多图片，就会导致资源的加载被阻塞，因为同时只能加载几个，必须等其他资源加载完才能继续加载。要解决这个问题，我们可以将这些静态资源分散到不同的 CDN 服务上，例如将 JavaScript 文件放到 [js.cdn.com](https://js.cdn.com/) 域名下，将 CSS 文件放到 [css.cdn.com](https://css.cdn.com/) 域名下，将图片文件放到 [img.cdn.com](https://img.cdn.com/) 域名下，这样 index.html 需要变成：

```html
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="//css.cdn.com/id/app_a6976b6d.css">
</head>
<body>
  <div id="app"></div>
  <script src="//js.cdn.com/id/app_9d89c964.js"></script>
</body>
</html>
```

使用多个域名后又会带来一个新的问题：增加域名解析时间。对于是否采用多域名分散资源，需要根据自己的需求去衡量得失。当然，可以通过在 HTML HEAD 标签中加入 `<link rel="dns-prefetch" href="//js.cdn.com">` 预解析域名，以减少域名解析带来的延迟。

## 3. 用 Webpack 实现 CDN 的接入

总之，构建需要实现以下几点：

- 静态资源的导入 URL 需要变成指向 CDN 服务的绝对路径的 URL，而不是相对于 HTML 文件的 URL。
- 静态资源的文件名需要带上由文件内容算出来的 Hash 值，以防止被缓存。
- 将不同类型的资源放到不同域名的 CDN 服务上，以防止资源的并行加载被阻塞。

先来看看要实现以上要求的最终 Webpack 配置：

```javascript
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebPlugin = require('web-webpack-plugin');

module.exports = {
  // 省略 entry 配置...
  output: {
    // 为输出的 JavaScript 文件各加上 Hash 值
    filename: '[name]_[chunkhash:8].js',
    path: path.resolve(__dirname, './dist'),
    // 指定存放 JavaScript 文件的 CDN 目录 URL
    publicPath: '//js.cdn.com/id/',
  },
  module: {
    rules: [
      {
        // 增加对 CSS 文件的支持
        test: /\.css$/,
        // 提取 Chunk 中的 CSS 代码到单独的文件中
        use: ExtractTextPlugin.extract({
          // 压缩 CSS 代码
          use: ['css-loader?minimize'],
          // 指定存放 CSS 中导入的资源（例如图片）的 CDN 目录 URL
          publicPath: '//img.cdn.com/id/'
        }),
      },
      {
        // 增加对 PNG 文件的支持
        test: /\.png$/,
        // 为输出的 PNG 文件名各加上 Hash 值
        use: ['file-loader?name=[name]_[hash:8].[ext]'],
      },
      // 省略其他 Loader 配置...
    ]
  },
  plugins: [
    // 使用 WebPlugin 自动生成 HTML
    new WebPlugin({
      // HTML 模板文件所在的文件路径
      template: './template.html',
      // 输出的 HTML 文件名
      filename: 'index.html',
      // 指定存放 CSS 文件的 CDN 目录 URL
      stylePublicPath: '//css.cdn.com/id/',
    }),
    new ExtractTextPlugin({
      // 为输出的 CSS 文件名各加上 Hash 值
      filename: '[name]_[contenthash:8].css',
    }),
    // 省略代码压缩插件配置...
  ]
};
```

在以上代码中最核心的部分是通过 publicPath 参数设置存放静态资源的 CDN 目录 URL。为了让不同类型的资源输出到不同的 CDN，需要分别进行如下设置。

- 在 output.publicPath 中设置 JavaScript 的地址。
- 在 css-loader.publicPath 中设置被 CSS 导入的资源的地址。
- 在 WebPlugin.stylePublicPath 中设置 CSS 文件的地址。

设置好 publicPath 后，WebPlugin 在生成 HTML 文件并将 css-loader 转换 CSS 代码时，会考虑到配置中的 publicPath，用对应的线上地址替换原来的相对地址。

本实例提供项目的完整代码，参见 http://webpack.wuhaolin.cn/4-9 CDN 加速.zip。

# 4.10 使用 Tree Shaking

## 1. 认识 Tree Shaking

Tree Shaking 可以用来剔除 JavaScript 中用不上的死代码。它依赖静态的 ES6 模块化语法，例如通过 import 和 export 导入、导出。Tree Shaking 最先在 Rollup 中出现，Webpack 在 2.0 版本中将其引入。

为了更直观地理解它，来看一个具体的例子。假如有一个文件 util.js 里存放了很多工具函数和常量，在 main.js 中会导入和使用 util.js，代码如下：

util.js 源码如下：

```javascript
export function funcA() {
}
export function funcB() {
}
```

main.js 源码如下：

```javascript
import {funcA} from './util.js';
funcA();
```

Tree Shaking 后的 util.js 如下：

```javascript
export function funcA() {
}
```

由于只用到了 util.js 中的 funcA，所以剩下的都被 Tree Shaking 当作死代码剔除了。

需要注意，要让 Tree Shaking 正常工作的前提是，提交给 Webpack 的 JavaScript 代码必须采用了 ES6 的模块化语法，因为 ES6 模块化语法是静态的（在导入、导出语句中的路径必须是静态的字符串，而且不能放入其他代码块中），这让 Webpack 可以简单地分析出哪些 export 的被 import 了。如果采用了 ES5 中的模块化，例如 module.exports={...}、require (x+y)、if (x) {require ('./util')}，则 Webpack 无法分析出可以剔除哪些代码。

## 2. 接入 Tree Shaking

前面讲了 Tree Shaking 是做什么的，接下来讲解如何配置 Webpack 让 Tree Shaking 生效。

首先，为了将采用 ES6 模块化的代码提交给 Webpack，需要配置 Babel 以让其保留 ES6 模块化语句。修改 .babelrc 文件如下：

```json
{
  "presets": [
    [
      "env",
      {
        "modules": false
      }
    ]
  ]
}
```

其中，"modules": false 的含义是关闭 Babel 的模块转换功能，保留原本的 ES6 模块化语法。

配置好 Babel 后，重新运行 Webpack，在启动 Webpack 时带上 --display-used-exports 参数，以方便追踪 Tree Shaking 的工作。这时我们会发现在控制台中输出了如下日志：

```bash
> webpack --display-used-exports
bundle.js 3.5 kB       0  [emitted]  main
  [0] ./main.js 41 bytes {0} [built]
  [1] ./util.js 511 bytes {0} [built]
      [only some exports used: funcA]
```

其中，[only some exports used: funcA] 提示了 util.js 只导出了用到的 funcA，说明 Webpack 确实正确分析出了如何剔除死代码。

若打开 Webpack 输出的 bundle.js 文件并查看，则会发现用不上的代码还在里面：

```javascript
/* harmony export (immutable) */
__webpack_exports__["a"] = funcA;

/* unused harmony export funcB */

function funcA() {
  console.log('funcA');
}

function funcB() {
  console.log('funcB');
}
```

Webpack 只是指出了哪些函数被用上了，而哪些函数没被用上，要剔除用不上的代码，则还得经过 UglifyJS 处理一遍。要接入 UglifyJS，也很简单，不仅可以通过 4.8 节中介绍的加入 UglifyJSPlugin 去实现，也可以简单地通过在启动 Webpack 时带上 --optimize-minimize 参数来实现，为了快速验证 Tree Shaking，我们采用较简单的后者来实验一下。

通过 webpack --display-used-exports --optimize-minimize 重启 Webpack 后，打开新输出的 bundle.js，内容如下：

```javascript
function r() {
  console.log("funcA")
}
t.a = r
```

可以看出 Tree Shaking 确实做到了，用不上的代码都被剔除了。

在项目中使用大量的第三方库时，我们会发现 Tree Shaking 似乎不生效了，原因是大部分 Npm 中的代码都采用了 CommonJS 语法，这导致 Tree Shaking 无法正常工作而降级处理。但幸运的是，有些库考虑到了这一点，这些库在发布到 Npm 上时会同时提供两份代码，一份采用 CommonJS 模块化语法，一份采用 ES6 模块化语法，并且在 package.json 文件中分别指出这两份代码的入口。

以 redux 库为例，其发布到 Npm 上的目录结构为：

```plaintext
node_modules/redux
├── es
│   └── index.js  # 采用 ES6 模块化语法
├── lib
│   └── index.js  # 采用 ES5 模块化语法
└── package.json
```

在 package.json 文件中有两个字段：

```json
{
  "main": "lib/index.js", // 指明采用 CommonJS 模块化的代码入口
  "jsnext:main": "es/index.js" // 指明采用 ES6 模块化语法的文件
}
```

在 2.4 节中曾介绍过 mainFields 用于配置采用哪个字段作为模块的入口描述。为了让 Tree Shaking 对 redux 生效，需要配置 Webpack 的文件寻找规则如下：

```javascript
module.exports = {
  resolve: {
    // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
    mainFields: ['jsnext:main', 'browser', 'main']
  },
};
```

以上配置的含义是优先使用 jsnext:main 作为入口，如果不存在，jsnext:main 就会采用 browser 或者 main 并将其作为入口。虽然并不是每个 Npm 中的第三方模块都会提供 ES6 模块化语法的代码，但对于已提供了的代码要尽量优化。

目前越来越多的 Npm 中的第三方模块都考虑到了 Tree Shaking，并对其提供了支持。采用 jsnext:main 作为 ES6 模块化代码的入口是社区的一个约定，假如将来要发布一个库到 Npm，则我们希望该库能支持 Tree Shaking，以让 Tree Shaking 发挥更大的优化效果，让更多的人受益。

本实例提供项目的完整代码，参见 http://webpack.wuhaolin.cn/4-10 使用 TreeShaking.zip。

# 4.11 提取公共代码

## 1. 为什么需要提取公共代码

大型网站通常由多个页面组成，每个页面都是一个独立的单页应用。但由于所有页面都采用同样的技术栈及同一套样式代码，就导致这些页面之间有很多相同的代码。

如果每个页面的代码都将这些公共的部分包含进去，则会造成以下问题。

- 相同的资源被重复加载，浪费用户的流量和服务器的成本。
- 每个页面需要加载的资源太大，导致网页首屏加载缓慢，影响用户体验。

如果将多个页面的公共代码抽离成单独的文件，就能优化以上问题。原因是假如用户访问了某网站的其中一个网页，那么访问这个网站下的其他网页的概率将非常大。在用户第一次访问后，这些页面的公共代码的文件已经被浏览器缓存起来，在用户切换到其他页面时，就不会再重新加载存放公共代码的文件，而是直接从缓存中获取。这样做有如下好处。

- 减少网络传输流量，降低服务器成本。
- 虽然用户第一次打开网站的速度得不到优化，但之后访问其他页面的速度将大大提升。





















