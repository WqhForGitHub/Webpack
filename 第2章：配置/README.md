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



