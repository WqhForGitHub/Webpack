# 1. Entry

entry 是配置模块的入口，可抽象成输入，Webpack 执行构建的第一步将从入口开始，搜寻递归解析出所有入口依赖的模块。

entry 配置是必填的，若不填则将导致 Webpack 报错、退出。

## 1. context

Webpack 在寻找相对路径的文件时会以 context 为根目录，context 默认为执行启动 Webpack 时所在的当前工作目录。如果想改变 context 的默认配置，则可以在配置文件里这样设置它：

```javascript
module.exports = {
    context: path.resolve(__dirname, 'app')
}
```

注意，context 必须是一个绝对路径的字符串。除此之外，还可以通过在启动 Webpack 时带上参数 webpack --context 来设置 context。

之所以在这里先介绍 context，是因为 Entry 的路径及其依赖的模块的路径可能采用相对于 context 的路径来描述，context 会影响到这些相对路径所指向的真实文件。

## 2. Entry 类型

Entry 类型可以是以下三种中的一种或者相互组合，如下表所示。

| 类型   | 例子                                                         | 含义                                 |
| ------ | ------------------------------------------------------------ | ------------------------------------ |
| string | './app/entry'                                                | 入口模块的文件路径，可以是相对路径   |
| array  | ['./app/entry1', './app/entry2']                             | 入口模块的文件路径，可以是相对路径   |
| object | { a: './app/entry-a', b: ['./app/entry-b1', './app/entry-b2'] } | 配置多个入口，每个入口生成一个 Chunk |

如果是 array 类型，则搭配 output.library 配置项使用时，只有数组的最后一个入口文件的模块会被导出。

## 3. Chunk 的名称

Webpack 会为每个生成的 Chunk 取一个名称，Chunk 的名称和 Entry 的配置有关。

* 如果 entry 是一个 string 或 array，就只会生成一个 Chunk，这时 Chunk 的名称是 main。
* 如果 entry 是一个 object，就可能会出现多个 Chunk，这时 Chunk 的名称是 object 键值对中键的名称。

## 4. 配置动态 Entry

假如项目里有多个页面需要为每个页面的入口配置一个 Entry，但这些页面的数量可能会不断增长，则这时 Entry 的配置会受到其他因素的影响，导致不能写成静态的值。其解决方法是将 Entry 设置成一个函数动态地返回上面所说的配置，代码如下：

```javascript
// 同步函数
entry: () => {
    return {
        a: './pages/a',
        b: './pages/b'
    }
};
```

```javascript
// 异步函数
entry: () => {
    return new Promise((resolve) => {
        resolve({
            a: './pages/a',
            b: './pages/b'
        });
    });
};
```

# 2. Ouput

output 配置如何输出最终想要的代码。output 是一个 object，里面包含一系列配置项，下面分别介绍它们。

## 1. filename

output.filename 配置输出文件的名称，为 string 类型。如果只有一个输出文件，则可以将它写成静态不变的：

```javascript
filename: 'bundle.js'
```

但是在有多个 Chunk 要输出时，就需要借助模板和变量了。前面讲到，Webpack 会为每个 Chunk 取一个名称，所以我们可以根据 Chunk 的名称来区分输出的文件名：

```javascript
filename: '[name].js'
```

代码里的 [name] 代表用内置的 name 变量去替换 [name]，这时我们可以将它看作一个字符串模板函数，每个要输出的 Chunk 都会通过这个函数去拼接出输出的文件名称。

内置变量除了包括 name，还包括如下表所示的变量。

| 变量名    | 含义                        |
| --------- | --------------------------- |
| id        | Chunk 的唯一标识，从 0 开始 |
| name      | Chunk 的名称                |
| hash      | Chunk 的唯一标识的 Hash 值  |
| chunkhash | Chunk 内容的 Hash 值        |

其中，hash 和 chunkhash 的长度是可指定的，[hash:8] 代表取 8 位 Hash 值，默认是 20 位。

注意，ExtractTextWebpackPlugin 插件使用 contenthash 而不是 chunkhash 来代表哈希值，原因在于 ExtractTextWebpackPlugin 提取出来的内容是代码内容本身，而不是由一组模块组成的 Chunk。

## 2. chunkFilename

output.chunkFilename 配置无入口的 Chunk 在输出时的文件名称。chunkFilename 和上面的 filename 非常类似，但 chunkFilename 只用于指定在运行过程中生成的 Chunk 在输出时的文件名称。会在运行时生成 Chunk 的常见场景包括：使用 CommonChunkPlugin、使用 import('path/to/module') 动态加载等。chunkFilename 支持和 filename 一致的内置变量。

## 3. path

output.path 配置输出文件存放在本地的目录，必须是 string 类型的绝对路径。通常通过 Node.js 的 path 模块去获取绝对路径：

```javascript
path: path.resolve(__dirname, 'dist_[hash]')
```

## 4. publicPath

在复杂的项目里可能会有一些构建出的资源需要异步加载，加载这些异步资源需要对应的 URL 地址。

output.publicPath 配置发布到线上资源的 URL 前缀，为 string 类型。默认值是空字符串 ''，即使用相对路径。

这样说可能有点抽象，举个例子，需要将构建出的资源文件上传到 CDN 服务上，以利于加快页面的打开速度。配置代码如下：

```javascript
filename: '[name]_[chunkhash:8].js'
publicPath: 'https://cdn.example.com/assets/'
```

这时发布到线上的 HTML 在引入 JavaScript 文件时就需要以下配置项：

```html
<script src="https://cdn.example.com/assets/a_12345678.js"></script>
```

使用该配置项要小心，稍有不慎将导致资源加载 404 错误。

output.path 和 output.publicPath 都支持字符串模板，内置变量只有一个，即 hash，代表一次编译操作的 Hash 值。

## 5. crossOriginLoading

Webpack 输出的部分代码块可能需要异步加载，而异步加载是通过 JSONP 方式实现的。JSONP 的原理是动态地向 HTML 中插入一个 `<script> src="url"></script>` 标签去加载异步资源。output.crossOriginLoading 则是用于配置这个异步插入的标签的 crossorigin 值。

script 标签的 crossorigin 属性可以取以下值：

* anonymous（默认），在加载此脚本资源时不会带上用户的 Cookies。
* use-credentials，在加载此脚本资源时会带上用户的 Cookies。

通常通过设置 crossorigin 来获取异步加载的脚本执行时的详细错误信息。

## 6. libraryTarget 和 library

当用 Webpack 去构建一个可以被其他模块导入使用的库时，需要用到 libraryTarget 和 library。

* output.libraryTarget 配置以何种方式导出库。
* outout.library 配置导出库的名称。

它们通常搭配在一起使用。

output.libraryTarget 是字符串的枚举类型，支持以下配置。

### 1. var（默认）

编写的库将通过 var 被赋值给通过 library 指定名称的变量。

假如配置了 output.library='LibraryName'，则输出和使用的代码如下：

```javascript
// Webpack 输出的代码
var LibraryName = lib_code;
// 使用库的代码
LibraryName.doSomething();
```

假如 output.library 为空，则直接输出：

```javascript
lib_code
```

其中，lib_code 是指导出库的代码内容，是有返回值的一个自执行函数。

### 2. commonjs

编写的库将通过 CommonJS 规范导出。

假如配置了 output.library='LibraryName'，则输出和使用的代码如下：

```javascript
// Webpack 输出的代码
exports['LibraryName'] = lib_code;
// 使用库的方法
require('library-name-in-npm')['LibraryName'].doSomething();
```

其中，library-name-in-npm 是指模块被发布到 npm 代码仓库时的名称。

### 3. commonjs2

编写的库将通过 CommonJS2 规范导出，输出和使用的代码如下：

```javascript
// Webpack 输出的代码
module.exports = lib_code;
// 使用库的方法
require('library-name-in-npm').doSomething();
```

CommonJS2 和 CommonJS 规范相似，差别在于 CommonJS 只能用 exports 导出，而 CommonJS2 在 CommonJS 的基础上增加了 module.exports 的导出方式。

在 output.libraryTarget 为 commonjs2 时，配置 output.library 将没有意义。

### 4. this

编写的库将通过 this 被赋值给通过 library 指定的名称，输出和使用的代码如下：

```javascript
// Webpack 输出的代码
this['LibraryName'] = lib_code;
// 使用库的方法
this.LibraryName.doSomething();
```

### 5. window

编写的库将通过 window 赋值给通过 library 指定的名称，输出和使用的代码如下：

```javascript
// Webpack 输出的代码
window['LibraryName'] = lib_code;
// 使用库的方法
window.LibraryName.doSomething();
```

### 6. global

编写的库将通过 global 赋值给通过 library 指定的名称，即把库挂载到 global 上，输出和使用的代码如下：

```javascript
// Webpack 输出的代码
global['LibraryName'] = lib_code;
// 使用库的方法
global.LibraryName.doSomething();
```

## 7. libraryExport

output.libraryExport 配置要导出的模块中哪些子模块需要被导出。它只有在 output.libraryTarget 被设置成 commonjs 或者 commonjs2 时使用才有意义。

假如要导出的模块源代码是：

```javascript
export const a = 1;
export default b = 2;
```

而现在想让构建输出的代码只导出其中的 a，则可以将 output.libraryExport 设置成 a，那么构建输出的代码和使用方法将变成如下内容：

```javascript
// Webpack 输出的代码
module.exports = lib_code['a'];
// 使用库的方法
require('library-name-in-npm')===1;
```

以上只是 output 中的常用配置项，还有部分几乎用不上的配置项没有在这里一一列举，可以在 Webpack 官方文档上查阅它们。

# 3. Module

module 配置处理模块的规则，下面对它进行详细讲解。

## 1. 配置 Loader

rules 配置模块的读取和解析规则，通常用来配置 Loader。其类型是一个数组，数组里的每一项都描述了如何处理部分文件。配置一项 rules 时大致可通过以下方式来完成。

* 条件匹配：通过 test、include、exclude 三个配置项来选中 Loader 要应用规则的文件。
* 应用规则：对选中的文件通过 use 配置项来应用 Loader，可以只应用一个 Loader 或者按照从后往前的顺序应用一组 Loader，同时可以分别向 Loader 传入参数。
* 重置顺序：一组 Loader 的执行顺序默认是从右到左执行的，通过 enforce 选项可以将其中一个 Loader 的执行顺序放到最前或者最后。

下面通过一个例子来说明具体的使用方法：

```javascript
module: {
    rules: [
        {
            // 命中 JavaScript 文件
            test: /\.js$/,
            // 用 babel-loader 转换 JavaScript 文件
            // ?cacheDirectory 表示传给 babel-loader 的参数，用于缓存 babel 的编译结果，加快重新编译的速度
            use: ['babel-loader?cacheDirectory'],
            // 只命中 src 目录里的 JavaScript 文件，加快 Webpack 的搜索速度
            include: path.resolve(__dirname, 'src')
        },
        {
            // 命中 SCSS 文件
            test: /\.scss$/,
            // 使用一组 Loader 去处理 SCSS 文件
            // 处理顺序为从后到前，即先交给 sass-loader 处理，再将结果交给 css-loader，最后交给 style-loader
            use: ['style-loader', 'css-loader', 'sass-loader'],
            // 排除 node_modules 目录下的文件
            exclude: path.resolve(__dirname, 'node_modules')
        },
        {
            // 对非文本文件采用 file-loader 加载
            test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf)$/,
            use: ['file-loader']
        }
    ]
}
```

在 Loader 需要传入很多参数时，我们还可以通过一个 Object 来描述，例如在上面的 babel-loader 配置中有如下代码：

```javascript
use: [
    {
        loader: 'babel-loader',
        options: {
            cacheDirectory: true
        },
        // enforce: 'post' 的含义是将该 Loader 的执行顺序放到最后
        // enforce 的值还可以是 pre，代表将 Loader 的执行顺序放到最前面
        enforce: 'post'
    },
    // 省略其他 Loader
]
```

在上面的例子中，test、include、exclude 这三个命令文件的配置项只传入了一个字符串或正则，其实它们也支持数组类型，使用如下：

```javascript
{
    test: [
        /\.jsx?$/,
        /\.tsx?$/
    ],
    include: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'tests')
    ],
    exclude: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, 'bower_modules')
    ]
}
```

数组里的每项之间是或的关系，即文件的路径只要满足数组中的任何一个条件，就会被命中。

## 2. noParse

noParse 配置项可以让 Webpack 忽略对部分没采用模块化的文件的递归解析和处理，这样做的好处是能提高构建性能。原因是一些库如 jQuery、ChartJS 庞大又没有采用模块化标准，让 Webpack 去解析这些文件既耗时又没有意义。

noParse 是可选的配置项，类型需要是 RegExp、[RegExp]、function 中的一种。

例如，若想要忽略 jQuery、ChartJS，则可以使用如下代码：

```javascript
// 使用正则表达式
noParse: /jquery|chartjs/
// 使用函数，从 Webpack 3.0.0 开始支持
noParse: (content) => {
    // content 代表一个模块的文件路径
    // 返回 true 或 false
    return /jquery|chartjs/.test(content);
}
```

注意，被忽略的文件里不应该包含 import、require、define 等模块化语句，不然会导致在构建出的代码中包含无法在浏览器环境下执行的模块化语句。

## 3. parser

因为 Webpack 是以模块化的 JavaScript 文件为入口的，所以内置了对模块化 JavaScript 的解析功能，支持 AMD、CommonJS、SystemJS、ES6。parser 属性可以更细粒度地配置哪些模块语法被解析、哪些不被解析。同 noParse 配置项地区别在于，parser 可以精确到语法层面，而 noParse 只能控制哪些文件不被解析。parser 地使用方法如下：

```javascript
module: {
    rules: [
        {
            test: /\.js$/,
            use: ['babel-loader'],
            parser: {
                amd: false, // 禁用 AMD
                commonjs: false, // 禁用 CommonJS
                system: false, // 禁用 SystemJS
                harmony: false. // 禁用 ES6 import/export
                requireInclude: false, // 禁用 require.include
                requireEnsure: false, // 禁用 require.ensure
                requireContext: false, // 禁用 require.context
                browserify: false, // 禁用 browserify
                requireJs: false // 禁用 requirejs  
            }
        }
    ]
}
```

# 4. Resolve

Webpack 在启动后会从配置的入口模块出发找出所有依赖的模块，Resolve 配置 Webpack 如何寻找模块所对应的文件。Webpack 内置 JavaScript 模块化语法解析功能，默认会采用模块化标准里约定的规则去寻找，但我们也可以根据自己的需要修改默认的规则。

## 1. alias

resolve.alias 配置项通过别名来将原导入路径映射成一个新的导入路径。例如使用以下配置：

```javascript
// Webpack alias 配置
resolve: {
    alias: {
        components: './src/components/'
    }
}
```

当通过 import Button from 'components/button' 导入时，实际上被 alias 等价替换成了 import Button from './src/components/button'。

以上 alias 配置的含义是，将导入语句里的 components 关键字替换成 ./src/components/。

这样做可能会命中太多导入语句，alias 还支持通过 $ 符号来缩小范围到只命中以关键字结尾的导入语句：

```javascript
resolve: {
    alias: {
        'react$': '/path/to/react.min.js'
    }
}
```

react$ 只会命中以 react 结尾的导入语句，即只会将 import 'react' 关键字替换成 import '/path/tp/react/min.js'。

## 2. mainFields

有一些第三方模块会针对不同的环境提供几份代码。例如分别提供了采用了 ES5 和 ES6 的两份代码，这两份代码的位置写在 package.json 文件里，代码如下：

```json
{
    "jsnext:main": "es/index.js", // 采用 ES6 语法的代码入口文件
    "main": "lib/index.js" // 采用 ES5 语法的代码入口文件
}
```

Webpack 会根据 mainFields 的配置去决定优先采用哪份代码，mainFields 默认如下：

```javascript
mainFields: ['browser', 'main']
```

Webpack 会按照数组里的顺序在 package.json 文件里寻找，只会使用找到的第 1 个文件。

假如我们想优先采用 ES6 的那份代码，则可以这样配置：

```javascript
mainFields: ['jsnext:main', 'browser', 'main']
```

## 3. extensions

在导入语句没带文件后缀时，Webpack 会自动带上后缀后去尝试访问文件是否存在。resolve.extensions 用于配置在尝试过程中用到的后缀列表，默认是：

```javascript
extensions: ['.js', '.json']
```

也就是说，当遇到 require('./data') 这样的导入语句时，Webpack 会先寻找 ./data.js 文件，如果该文件不存在，就去寻找 ./data/json 文件，如果还是找不到，就报错。

假如我们想让 Webpack 优先使用目录下的 TypeScript 文件，则可以这样配置：

```javascript
extensions: ['.ts', '.js', '.json']
```

## 4. modules

resolve.modules 配置 Webpack 去哪些目录下寻找第三方模块，默认只会去 node_modules 目录下寻找。有时我们的项目里会有一些模块被其他模块大量依赖和导入，由于其他模块的位置不定，针对不同的文件都要计算被导入的模块文件的相对路径，这个路径有时会很长，就像 import '../../../components/button'，这时可以利用 modules 配置项优化。假如那些被大量导入的模块都在 ./src/components 目录下，则将 modules 配置成 modules: ['./src/components', 'node_modules'] 后，可以简单地通过 import 'button' 导入。

## 5. descriptionFiles

resolve.descriptionFiles 配置描述第三方模块地文件名称，也就是 package.json 文件。默认如下：

```javascript
descriptionFiles: ['package.json']
```

## 6. enforceExtension

如果 resolve.enforceExtension 被配置为 true，则所有导入语句都必须带文件后缀，例如开启前 import './foo' 能正常工作，开启后就必须写成 import './foo.js'。

## 7. enforceModuleExtension

enforceModuleExtension 和 enforceExtension 的作用类似，但 enforceModuleExtension 只对 node_modules 下的模块生效。enforceModuleExtension 通常搭配 enforceExtension 使用，在 enforceExtension: true 时，因为安装的第三方模块中大多数导入语句都没带文件的后缀，所以这时通过配置 enforceModuleExtension: false 来兼容第三方模块。

# 5. Plugin

Plugin 用于扩展 Webpack 的功能，各种各样的 Plugin 几乎可以让 Webpack 做任何与构建相关的事情。

Plugin 配置很简单，plugins 配置项接收一个数组，数组里的每一项都是一个要使用的 Plugin 的实例，Plugin 需要的参数通过构造函数传入。

```javascript
const CommonChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

module.exports = {
    plugins: [
        // 所有页面都会用到的公共代码被提取到 common 代码块中
        new CommonChunkPlugin({
            name: 'common',
            chunks: ['a', 'b']
        })
    ]
}
```

使用 Plugin 的难点在于掌握 Plugin 本身提供的配置项，而不是如何在 Webpack 中接入 Plugin。

几乎所有 Webpack 无法直接实现的功能都能在社区找到开源的 Plugin 去解决，我们需要善于使用搜索引擎寻找解决问题的方法。

# 6. DevServer

在 1.6 节介绍过用来提高开发效率的 DevServer，它提供的一些配置项可以用于改变 DevServer 的默认行为。要配置 DevServer，除了可以在配置文件里通过 devServer 传入参数，还可以通过命令行参数传入。注意，只有在通过 DevServer 启动 Webpack 时，配置文件里的 devServer 才会生效，因为这些参数所对应的功能都是 DevServer 提供的，Webpack 本身并不认识 devServer 配置项。

## 1. hot

devServer.hot 配置是否启用 1.6 节提到的模块热替换功能。DevServer 的默认行为是在发现源代码被更新后通过自动刷新整个页面来做到实时预览，开启模块热替换功能后，将在不刷新整个页面的情况下通过用新模块替换老模块来做到实时预览。

## 2. inline

DevServer 的实时预览功能依赖一个注入页面里的代理客户端，去接收来自 DevServer 的命令并负责刷新网页的工作。devServer.inline 用于配置是否将这个代理客户端自动注入将运行在页面中的 Chunk 里，默认自动注入。DevServer 会根据我们是否开启 inline 来调整它的自动刷新策略。

* 如果开启 inline，则 DevServer 会在构建变化后的代码时通过代理客户端控制网页刷新。
* 如果关闭 inline，则 DevServer 将无法直接控制要开发的网页。这时它会通过 iframe 的方式去运行要开发的网页。在构建完变化后的代码时，会通过刷新 iframe 来实时预览，但这时我们需要去 http://localhost:8080/webpack-dev-server/ 实时预览自己的网页。

如果你想使用 DevServer 自动刷新网页实现实时预览，则最方便的方法是直接开启 inline。

## 3. historyApiFallback

devServer.historyApiFallback 用于方便地开发使用了 HTML5 History API 的单页应用。这类单页应用要求服务器在针对任何命中的路由时，都返回一个对应的 HTML 文件。例如在访问 http://locahost/user 和 http://localhost/home 时都返回 index.html 文件，浏览器端的 JavaScript 代码会从 URL 里解析出当前页面的状态，显示对应的界面。

配置 historyApiFallback 的简单做法是：

```javascript
historyApiFallback: true
```

这会导致任何请求都会返回 index.html 文件，这只能用于只有一个 HTML 文件的应用。

如果我们的应用由多个单页应用组成，则需要 DevServer 根据不同的请求返回不同的 HTML 文件，配置如下：

```javascript
historyApiFallback: {
    // 使用正则匹配命中路由
    rewrites: [
        // /user 开头的都返回 user.html
        { from: /^\/user/, to: '/user.html' },
        { from: /^\/game/, to: '/game.html' },
        // 其他的都返回 index.html
        { from: /./, to: '/index.html' }
    ]
}
```

## 4. contentBase

devServer.contentBase 配置 DevServer HTTP 服务器的文件根目录。在默认情况下为当前的执行目录，通常是项目根目录，所以在一般情况下不必设置它，除非有额外的文件需要被 DevServer 服务。例如，若想将项目根目录下的 public 目录设置成 DevServer 服务器的文件根目录，则可以这样配置：

```javascript
devServer: {
    contentBase: path.join(__dirname, 'public')j
}
```

这里解释一下可能会让我们感到疑惑的地方。DevServer 服务器通过 HTTP 服务暴露文件的方式可分为两类：

* 暴露本地文件
* 暴漏 Webpack 构建出的结果，由于构建出的结果交给了 DevServer，所以我们在使用 DevServer 时，会在本地找不到构建出的文件。

contentBase 只能用来配置暴露本地文件的规则，可以通过 contentBase: false 来关闭暴露本地文件。

## 5. headers

devServer.headers 配置项可以在 HTTP 响应中注入一些 HTTP 响应头，使用如下：

```javascript
devServer: {
    headers: {
        'X-foo': 'bar'
    }
}
```

## 6. host

devServer.host 配置项用于配置 DevServer 服务监听的地址。例如，若想让局域网中的其他设备访问自己的本地服务，则可以在启动 DevServer 时带上 --host 0.0.0.0。host 的默认值是 127.0.0.1，即只有本地可以访问 DevServer 的 HTTP 服务。

## 7. port

devServer.host 配置项用于配置 DevServer 服务监听的端口，默认使用 8080 端口。如果 8080 端口已经被其他程序占用，就使用 8081。如果 8081 还是被占用，则使用 8082，以此类推。

## 8. allowedHosts

devServer.allowedHosts 配置一个白名单列表，只有 HTTP 请求的 HOST 在列表里才正常返回，使用如下：

```javascript
allowedHosts: [
    // 匹配单个域名
    'host.com',
    'sub.host.com',
    // host2.com 和所有的子域名 *.host2.com 都将匹配
    '.host2.com'
]
```

## 9. disableHostCheck

devServer.disableHostCheck 配置项用于配置是否关闭用于 DNS 重新绑定的 HTTP 请求的 HOST 检查。DevServer 默认只接收来自本地的请求，关闭后可以接收来自任意 HOST 的请求。它通常用于搭配 --host 0.0.0.0 使用，因为想让其他设备访问自己的本地服务，但访问时是直接通过 IP 地址访问而不是通过 HOST 访问，所以需要关闭 HOST 检查。

## 10. https

DevServer 默认使用 HTTP 服务，它也能使用 HTTPS 服务。在某些情况下我们必须使用 HTTPS，例如 HTTP2 和 Service Worker 就必须运行在 HTTPS 上。要切换成 HTTPS 服务，最简单的方式是：

```javascript
devServer: {
    https: true
}
```

DevServer 会自动为我们生成一份 HTTPS 证书。

如果我们想用自己的证书，则可以这样配置：

```javascript
devServer: {
    https: {
        key: fs.readFileSync('path/to/server.key'),
        cert: fs.readFileSync('path/to/server/crt'),
        ca: fs.readFileSync('path/to/ca.pem')
    }
}
```

## 11. clientLogLevel

devServer.clientLogLevel 配置客户端的日志等级，这会影响到我们在浏览器开发者工具控制台里看到的日志内容。clientLogLevel 是枚举类型，可取如下值之一：none、error、warning、info。默认为 info 级别，即输出所有类型的日志，设置成 none 时可以不输出任何日志。

## 12. compress

devServer.compress 配置是否启用 Gzip 压缩，为 boolean 类型，默认为 false。

## 13. open

devServer.open 用于在 DevServer 启动且第一次构建完时，自动用我们的系统的默认浏览器去打开要开发的网页。还提供了 devServer.openPage 配置项来打开指定 URL 的网页。

# 7. 其他配置项

除了前面介绍到的配置项，Webpack 还提供了一些零散的配置项。下面介绍这些配置项中的常用部分。

## 1. Target

JavaScript 的应用场景越来越多，从浏览器到 Node.js，这些运行子啊不同环境下中的 JavaScript 代码存在一些差异。target 配置项可以让 Webpack 构建出针对不同运行环境的代码。target 可以是如下表所示的值之一。

| target 值         | 描述                                           |
| ----------------- | ---------------------------------------------- |
| web               | 针对浏览器（默认），所有代码都集中在一个文件里 |
| node              | 针对 Node.js，使用 require 语句加载 Chunk 代码 |
| async-node        | 针对 Node.js，异步加载 Chunk 代码              |
| webworker         | 针对 WebWorker                                 |
| electron-main     | 针对 Electron 主线程                           |
| electron-renderer | 针对 Electron 渲染线程                         |

例如，在设置 target: 'node' 时，在源代码中导入 Node.js 原生模块的语句 require('fs') 将会被保留，fs 模块的内容不会被打包到 Chunk 里。

## 2. Devtool

devtool 配置 Webpack 如何生成 Source Map，默认值是 false，即不生成 Source Map，若想为构建出的代码生成 Source Map 以方便调试，则可以这样配置：

```javascript
module.exports = {
    devtool: 'source-map'
}
```

## 3. Watch 和 WatchOptions

前面介绍过 Webpack 的监听模式，它支持监听文件更新，在文件发生变化时重新编译。在使用 Webpack 时，监听模式默认是关闭的，若想打开，则需要如下配置：

```javascript
module.exports = {
    watch: true
}
```

在使用 DevServer 时，监听模式默认是开启的。

除此之外，Webpack 还提供了 watchOptions 配置项去更灵活地控制监听模式，使用如下：

```javascript
module.exports = {
    // 只有在开启监听模式时，watchOptions 才有意义
    // 默认为 false，也就是不开启
    watch: true,
    // 监听模式运行时的参数
    // 在开启监听模式下，才有意义
    watchOptions: {
        // 不监听的文件或文件夹，支持正则匹配
        // 默认为空
        ignored: /node_modules/,
        // 监听到变化后会等 300ms 再去执行动作，防止文件更新太快导致重新编译频率太高
        // 默认为 300ms
        aggregateTimeout: 300,
        // 判断文件是否发生变化是通过不停地询问系统指定文件有没有变化实现的
        // 默认每秒询问 1000 次
        poll: 1000
    }
}
```

## 4. Externals

Externals 用来告诉在 Webpack 要构建的代码中使用了哪些不用被打包的模块，也就是说这些模板是外部提供的，Webpack 在打包时可以忽略它们。

有些 JavaScript 运行环境可能内置了一些全局变量或者模块，例如在我们的 HTML HEAD 标签里通过以下代码引入 jQuery：

```html
<script src="path/to/jquery.js"></script>
```

这时，全局变量 jQuery 就会被注入网页的 JavaScript 运行环境里。

如果想在使用模块化的源代码里导入和使用 jQuery，则可能需要这样：

```javascript
import $ from 'jquery';
$('.my-element');
```

构建后我们会发现输出的 Chunk 里包含的 jQuery 库的内容，这导致 jQuery 库出现了两次，浪费加载流量，最好是 Chunk 里不会包含 jQuery 库的内容。

Externals 配置项就是用于解决这个问题的。

通过 externals 可以告诉 Webpack 在 JavaScript 运行环境中已经内置了哪些全局变量，不用将这些全局变量打包到代码中而是直接使用它们。要解决以上问题，可以这样配置 externals：

```javascript
module.exports = {
    externals: {
        // 将导入语句里的 jquery 替换成运行环境里的全局变量 jQuery
        jquery: 'jQuery'
    }
}
```

## 5. ResolveLoader

ResolveLoader 用来告诉 Webpack 如何去寻找 Loader，因为在使用 Loader 时是通过其包名称去引用的，Webpack 需要根据配置的 Loader 包名去找到 Loader 的实际代码，以调用 Loader 去处理源文件。

ResolveLoader 的默认配置如下：

```javascript
module.exports = {
    resolveLoader: {
        // 去哪个目录下寻找 Loader
        modules: ['node_modules'],
        // 入口文件的后缀
        extensions: ['.js', '.json'],
        // 指名入口文件位置的字段
        mainFields: ['loader', 'main']
    }
}
```

该配置项常用于加载本地的 Loader。

# 9. 多种配置类型

除了通过导出一个 Object 来描述 Webpack 所需的配置，还有其他更灵活的方式，以简化不同场景的配置。下面来一一介绍它们。

## 1. 导出一个 Function

在大多数时候，我们需要从同一份源代码中构建出多份代码，例如一份用于开发，一份用于发布到线上。

如果采用导出一个 Object 来描述 Webpack 所需的配置的方法，则需要写两个文件，一个用于开发环境，一个用于线上环境。再在启动时通过 webpack --config webpack.config.js 指定使用哪个配置文件。

采用导出一个 Function 的方式，能通过 JavaScript 灵活地控制配置，做到只用写一个配置文件就能完成以上要求。

导出一个 Function 的使用方式如下：

```javascript
const path = require('path');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
module.exports = function (env = {}, argv) {
    const plugins = [];
    const isProduction = env['production'];
    
    // 在生成环境中才压缩
    if (isProduction) {
        plugins.push(
            // 压缩输出的 JavaScript 代码
            new UglifyJsPlugin()
        )
    }
    
    return {
        plugins: plugins,
        devtool: isProduction ? undefined : 'source-map';
    }
}
```

在运行 Webpack 时，会向这个函数传入两个参数，如下所述。

* env：当前运行时的 Webpack 专属环境变量，env 是一个 Object。读取时直接访问 Object 的属性，将它设置为需要在启动 Webpack 时带上参数。例如启动命令似乎 webpack --env.production --env.bao-foo，则 env 的值是 {"production": "true", "bao": "foo"}。
* argv：代表在启动 Webpack 时通过命令行传入的所有参数，例如 --config、--env、--devtool，可以通过 webpack -h 列出所有 Webpack 支持的命令行参数。

就以上配置文件而言，在开发时执行命令 webpack 构建出方便调试的代码，在需要构建出发布到线上的代码时执行 webpack --env.production 构建出压缩的代码。

## 2. 导出一个返回 Promise 的函数

在某些情况下不能以同步的方式返回一个描述配置的 Object，Webpack 还支持导出一个返回 Promise 的函数，使用如下：

```javascript
module.exports = function(env = {}, argv) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({});
        }, 5000)
    })
}
```

## 3. 导出多份配置

除了只导出一份配置，Webpack 还支持导出一个数组，数组中可以包含每份配置，并且每份配置都会执行一遍构建。

注意，Webpack 从 3.1.0 版本才开始支持该特性。

使用如下：

```javascript
module.exports = {
    // 采用 Object 描述的一份配置
    {
    	// ...
	},
    // 采用函数描述的一份配置
    function() {
    	return {
            // ...
        }
	},
    // 采用异步函数描述的一份配置
    function() {
		return Promise();
	}
}
```

以上配置会导致 Webpack 针对这三份配置执行三次不同的构建。

这特别适合用 Webpack 构建一个要上传到 Npm 仓库的库，因为库中可能需要包含多种模块化格式的代码，例如 CommonJS、UMD。





























































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































