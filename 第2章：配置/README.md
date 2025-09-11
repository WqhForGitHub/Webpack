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











































































































