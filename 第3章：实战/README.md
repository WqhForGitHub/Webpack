# 3.1 使用 ES6 语言

ECMAScript 6.0 是 2015 年发布的下一代 JavaScript 语言标准，它引入了新的语法和 API 来提升开发效率。虽然目前部分浏览器和 Node.js 已经支持 ES6，但由于它们对 ES6 的所有标准支持不全，会导致在开发中不能全面使用 ES6。

通常我们需要将采用 ES6 编写的代码转换成目前已经支持良好的 ES5 代码，包含如下两件事：

- 将新的 ES6 语法用 ES5 实现，例如 ES6 的 class 语法用 ES5 的 prototype 实现；
- 为新的 API 注入 polyfill，例如使用新的 fetch API 时在注入对应的 polyfill 后才能让低端浏览器正常运行。

## 1. 认识 Babel

Babel ([https://babeljs.io](https://babeljs.io/)) 可以方便地完成以上两件事。Babel 是一个 JavaScript 编译器，能将 ES6 代码转为 ES5 代码，让我们使用最新的语言特性而不用担心兼容性问题，并且可以通过插件机制根据需求灵活地扩展。在 Babel 执行编译的过程中，会从项目根目录下的 .babelrc 文件中读取配置。.babelrc 是一个 JSON 格式的文件，内容大致如下：

```json
{
  "plugins": [
    [
      "transform-runtime",
      {
        "polyfill": false
      }
    ]
  ],
  "presets": [
    [
      "es2015",
      {
        "modules": false
      }
    ],
    "stage-2",
    "react"
  ]
}
```

### 1. Plugins

plugins 属性告诉 Babel 要使用哪些插件，这些插件可以控制如何转换代码。

以上配置文件里的 transform-runtime 对应的插件全名叫作 babel-plugin-transform-runtime，即在前面加上了 babel-plugin-。要让 Babel 正常运行，我们必须先安装这个插件：

```bash
npm i -D babel-plugin-transform-runtime
```

babel-plugin-transform-runtime 是 Babel 官方提供的一个插件，作用是减少冗余的代码。Babel 在将 ES6 代码转换成 ES5 代码时，通常需要一些由 ES5 编写的辅助函数来完成新语法的实现，例如在转换 class extent 语法时会在转换后的 ES5 代码里注入 _extent 辅助函数用于实现继承：

```javascript
k'ifunction _extent(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
}
```

这会导致每个使用 class extent 语法的文件都被注入重复的 _extent 辅助函数代码，babel-plugin-transform-runtime 的作用在于将原本注入 JavaScript 文件里的辅助函数替换成一条导入语句：

```javascript
var _extent = require('babel-runtime/helpers/_extent');
```

这样能减小 Babel 编译出来的代码的文件大小。

同时需要注意的是，由于 babel-plugin-transform-runtime 注入了 require ('babel-runtime/helpers/_extent') 语句到编译后的代码里，需要安装 babel-runtime 依赖到我们的项目后，代码才能正常运行。也就是说 babel-plugin-transform-runtime 和 babel-runtime 需要配套使用，在使用 babel-plugin-transform-runtime 后一定要使用 babel-runtime。

### 2. Presets

presets 属性告诉 Babel 要转换的源码使用了哪些新的语法特性，一个 Presets 对一组新语法的特性提供了支持，多个 Presets 可以叠加。Presets 其实是一组 Plugins 的集合，每个 Plugin 完成一个新语法的转换工作。Presets 是按照 ECMAScript 草案来组织的，通常可以分为以下三大类。

(1) 已经被写入 ECMAScript 标准里的特性，由于之前每年都有新特性被加入到标准里，所以又可细分如下。

- ES2015 (https://babeljs.io/docs/plugins/preset-es2015/)：包含在 2015 年加入的新特性。
- ES2016 (https://babeljs.io/docs/plugins/preset-es2016/)：包含在 2016 年加入的新特性。
- ES2017 (https://babeljs.io/docs/plugins/preset-es2017/)：包含在 2017 年加入的新特性。
- Env (https://babeljs.io/docs/plugins/preset-env/)：包含当前所有 ECMAScript 标准里的最新特性。

它们之间的关系如图 3-1 所示。

![](https://front-end-1257950569.cos.ap-guangzhou.myqcloud.com/Webpack/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Webpack/ECMAScript%20%E6%A0%87%E5%87%86%E9%87%8C%E7%9A%84%E7%89%B9%E6%80%A7%E7%9A%84%E5%85%B3%E7%B3%BB.png)

(2) 被社区提出来的但还未被写入 ECMAScript 标准里的特性，这其中又分为以下四种。

- stage0 (https://babeljs.io/docs/plugins/preset-stage-0/)：只是一个美好激进的想法，一些 Babel 插件实现了对这些特性的支持，但是不确定是否会被定为标准。
- stage1 (https://babeljs.io/docs/plugins/preset-stage-1/)：值得被纳入标准的特性。
- stage2 (https://babeljs.io/docs/plugins/preset-stage-2/)：该特性规范已经被起草，将会被纳入标准里。
- stage3 (https://babeljs.io/docs/plugins/preset-stage-3/)：该特性规范已经定稿，各大浏览器厂商和 Node.js 社区已开始着手实现。
- stage4：在接下来的一年里将会加入标准里。

它们之间的关系如图 3-2 所示。

![](https://front-end-1257950569.cos.ap-guangzhou.myqcloud.com/Webpack/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Webpack/stage%20%E5%85%B3%E7%B3%BB%E5%9B%BE.png)

(3) 用于支持一些特定应用场景下的语法的特性，和 ECMAScript 标准没有关系，例如 babel-preset-react 用于支持 React 开发里的 JSX 语法。

在实际应用中，我们需要根据项目源码所使用的语法去安装对应的 Plugins 或 Presets。

## 2. 接入 Babel

在了解 Babel 后，下一步就需要知道如何在 Webpack 中使用它。由于 Babel 所做的事情是转换代码，所以应该通过 Loader 去接入 Babel。Webpack 的配置如下：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
      },
    ],
  },
  // 输出 source-map 以方便直接调试 ES6 源码
  devtool: 'source-map',
};
```

以上配置命中了项目目录下的所有 JavaScript 文件，并通过 babel-loader 调用 Babel 完成转换工作。在重新执行构建前，需要先安装新引入的依赖：

```bash
# Webpack 接入 Babel 必须依赖的模块
npm i -D babel-core babel-loader
# 根据我们的需求选择不同的 plugins 或 presets
npm i -D babel-preset-env
```

本实例提供项目的完整代码，参见 http://webpack.wuhaolin.cn/3-1 使用 ES6 语言.zip。

# 3.2 使用 TypeScript 语言

## 1. 认识 TypeScript

TypeScript ([http://www.typescriptlang.org](http://www.typescriptlang.org/)) 是 JavaScript 的一个超集，主要提供了类型检查系统和对 ES6 语法的支持，但不支持新的 API。目前没有任何环境支持运行原生的TypeScript 代码，必须通过构建将它转换成 JavaScript 代码后才能运行。

下面改造一下前面用过的例子 Hello, Webpack，用 TypeScript 重写 JavaScript。由于 TypeScript 是 JavaScript 的超集，直接将后缀 .js 改成 .ts 是可以的。但为了体现出 TypeScript 的不同，我们在这里重写 JavaScript 代码，并加入类型检查：

```typescript
// show.ts
// 操作 DOM 元素，将 content 显示到网页上
// 通过 ES6 模块规范导出 show 函数
// 为 show 函数增加类型检查
export function show(content: string) {
  window.document.getElementById('app').innerText = 'Hello, ' + content;
}

// main.ts
// 通过 ES6 模块规范导入 show 函数
import { show } from './show';
// 执行 show 函数
show('Webpack');
```

TypeScript 官方提供了能将 TypeScript 转换成 JavaScript 的编译器。我们需要在当前项目的根目录下新建一个用于配置编译选项的 `tsconfig.json` 文件，编译器默认会读取和使用这个文件，配置文件的内容大致如下：

```json
{
  "compilerOptions": {
    "module": "commonjs", // 编译出的代码采用的模块规范
    "target": "es5", // 编译出的代码采用 ES 的哪个版本
    "sourceMap": true // 输出 Source Map 以方便调试
  },
  "exclude": [ // 不编译这些目录里的文件
    "node_modules"
  ]
}
```

通过 `npm install -g typescript` 安装编译器到全局后，可以通过 `tsc hello.ts` 命令编译出 `hello.js` 和 `hello.js.map` 文件。

## 2. 减少代码冗余

TypeScript 编译器会有与 3.1 节中 Babel 同样的问题：在将 ES6 语法转换成 ES5 语法时需要注入辅助函数。为了不让同样的辅助函数重复出现在多个文件中，可以开启 TypeScript 编译器的 `importHelpers` 选项，需要修改 `tsconfig.json` 文件如下：

```json
{
  "compilerOptions": {
    "importHelpers": true
  }
}
```

该选项的原理和 Babel 中介绍的 `babel-plugin-transform-runtime` 非常类似，会将辅助函数转换成如下导入语句：

```javascript
var _tslib = require('tslib');
_tslib._extend(target);
```

这会导致编译出的代码依赖 `tslib` 这个迷你库，但避免了代码冗余。

## 3. 集成 Webpack

要让 Webpack 支持 TypeScript，需要解决以下两个问题。

- 通过 Loader 将 TypeScript 转换成 JavaScript。
- Webpack 在寻找模块对应的文件时需要尝试 .ts 后缀。

对于问题 1，社区已经出现了几个可用的 Loader，推荐速度更快的 `awesome-typescript-loader` (https://github.com/s-panferov/awesome-typescript-loader)。对于问题 2，根据 2.4 节中的 `resolve.extensions`，我们需要修改默认的 `resolve.extensions` 配置项。

综上所述，相关的 Webpack 配置如下：

```javascript
const path = require('path');
module.exports = {
  // 执行入口文件
  entry: './main',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  resolve: {
    // 先尝试以 .ts 为后缀的 TypeScript 源码文件
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  devtool: 'source-map',// 输出 Source Map 以方便在浏览器里调试 TypeScript 代码
};
```

在运行构建前需要安装上面用到的依赖：

```bash
npm i -D typescript awesome-typescript-loader
```

安装成功后重新执行构建，我们将会在 dist 目录下看到输出的 JavaScript 文件 `bundle.js`，以及对应的 Source Map 文件 `bundle.js.map`。在浏览器里打开 `index.html` 页面后，可以在开发工具里看到和调试用 TypeScript 编写的源码。

本实例提供项目的完整代码，参见 http://webpack.wuhaolin.cn/3-2 使用 TypeScript 语言.zip。

# 3.3 使用 Flow 检查器

## 1. 认识 Flow

Flow ([https://flow.org](https://flow.org/)) 是 Facebook 开源的一个 JavaScript 静态类型检测器，它是 JavaScript 语言的超集。我们所需要做的就是在需要的地方加上类型检查，例如在两个由不同的人开发的模块对接的接口处加上静态类型检查，就能在编译阶段指出部分模块使用不当的问题。同时，Flow 能通过类型推断检查出在 JavaScript 代码中潜在的 Bug。

Flow 的使用效果如下：

```javascript
// @flow
// 静态类型检查
function square1(n: number): number {
  return n * n;
}
square1('2'); // Error: square1 需要传入 number 作为参数
// 类型推断检查
function square2(n) {
  return n * n; // Error:传入的 string 类型不能做乘法运算
}
square2('2');
```

需要注意的是，该段代码的第 1 行 `// @flow` 告诉 Flow 检查器这个文件需要被检查。

## 2. 使用 Flow

以上只是让我们了解 Flow 的功能，下面讲解如何运行 Flow 来检查代码。Flow 检测器由高性能且跨平台的 OCaml ([http://ocaml.org](http://ocaml.org/)) 语言编写，它的可执行文件可以通过 `npm i -D flow-bin` 安装，安装完成后可先配置 Npm Script：

```json
"scripts": {
  "flow": "flow"
}
```

再通过 `npm run flow` 去调用 Flow 执行代码检查。

除此之外，我们还可以通过 `npm i -g flow-bin` 将 Flow 安装到全局，再直接通过 `flow` 命令执行代码检查。

安装成功后，在项目根目录下执行 Flow，Flow 会遍历出所有需要检查的文件并对其进行检查，输出错误结果到控制台，例如：

```plaintext
Error: show.js:6
6: export function show(content) {
                         ^^^^^^^ parameter `content`. Missing annotation
Found 1 error
```

采用了 Flow 静态类型语法的 JavaScript，是无法直接在目前已有的 JavaScript 的引擎中运行的，要让代码可以运行，需要将这些静态类型的语法去掉。例如：

```javascript
// 采用 Flow 的源代码
function foo(one: any, two: number, three?): string {}
// 去掉静态类型语法后输出代码
function foo(one, two, three) {}
```

有两种方式可以做到这一点。

* flow-remove-types（https://github.com/flowtype/flow-remove-types）：可单独使用，速度快。
* babel-preset-flow（https://babeljs.io/docs/plugins/preset-flow/）：与 Babel 集成。

## 3. 集成 Webpack

由于使用了 Flow 的项目一般都会使用 ES6 语法，所以将 Flow 集成到使用 Webpack 构建的项目里的最方便方法是借助 Babel。下面修改 3.1 节中的代码，为其加入 Flow 代码检查，改动如下。

(1) 安装 `npm i -D babel-preset-flow` 依赖到项目。

(2) 修改 `.babelrc` 配置文件，加入 Flow Preset：

```json
"presets": [
  ...[],
  "flow"
]
```

向源码里加入静态类型后重新构建项目，我们会发现采用了 Flow 的源码还是能在浏览器中正常运行的。

要明确构建的目的只是去除源码中的 Flow 静态类型语法，而代码检查和构建无关。许多编辑器已经整合了 Flow，可以实时在代码中高亮显示 Flow 检查出的问题。

本实例提供项目的完整代码，参见 http://webpack.wuhaolin.cn/3-3 使用 Flow 检查器.zip。

# 3.4 使用 SCSS 语言

## 1. 认识 SCSS

SCSS ([http://sass-lang.com](http://sass-lang.com/)) 可以让我们用更灵活的方式写 CSS。它是一种 CSS 预处理器，语法和 CSS 相似，但加入了变量、逻辑等编程元素，代码类似这样：

```scss
$blue: #1875e7;
div {
  color: $blue;
}
```

SCSS 又叫作 SASS，区别在于 SASS 语法类似 Ruby，而 SCSS 语法类似于 CSS，熟悉 CSS 的前端工程师会更喜欢 SCSS。

采用 SCSS 去写 CSS 的好处在于，可以方便地管理代码，抽离公共的部分，通过逻辑写出更灵活的代码。和 SCSS 类似的 CSS 预处理器还有 LESS ([http://lesscss.org](http://lesscss.org/)) 等。

使用 SCSS 可以提升编码的效率，但是必须将 SCSS 源代码编译成可以直接在浏览器环境下运行的 CSS 代码。SCSS 官方提供了多种语言实现的编译器，由于本书更倾向于前端工程师使用的技术栈，所以主要介绍 `node-sass` (https://github.com/sass/node-sass)。

node-sass 的核心模块是用 C++ 编写的，再用 Node.js 封装了一层，以提供给其他 Node.js 调用。node-sass 还支持通过命令行调用，先将它安装到全局：

```bash
npm i -g node-sass
```

再执行编译命令：

```bash
# 将 main.scss 源文件编译成 main.css
node-sass main.scss main.css
```

就能在源码同目录下看到编译后的 `main.css` 文件。

## 2. 接入 Webpack

我们曾在 1.4 节介绍过将 SCSS 源代码转换成 CSS 代码的最佳方式是使用 Loader，Webpack 官方提供了对应的 `sass-loader` (https://github.com/webpack-contrib/sass-loader)。

Webpack 接入 `sass-loader` 的相关配置如下：

```javascript
module.exports = {
  module: {
    rules: [
      {
        // 增加对 SCSS 文件的支持
        test: /\.scss$/,
        // SCSS 文件的处理顺序为先 sass-loader，再 css-loader，再 style-loader
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
};
```

以上配置通过正则 `/\.scss$/` 匹配所有以 `.scss` 为后缀的 SCSS 文件，再分别使用 3 个 Loader 去处理。具体处理流程如下。

- 通过 `sass-loader` 将 SCSS 源码转换为 CSS 代码，再将 CSS 代码交给 `css-loader` 处理。
- `css-loader` 会找出 CSS 代码中 `@import` 和 `url()` 这样的导入语句，告诉 Webpack 依赖这些资源。同时支持 CSS Modules 和压缩 CSS 等功能。处理完后再将结果交给 `style-loader` 处理。
- `style-loader` 会将 CSS 代码转换成字符串后，注入 JavaScript 代码中，通过 JavaScript 向 DOM 增加样式。如果我们想将 CSS 代码提取到一个单独的文件中，而不是和 JavaScript 混在一起，则可以使用在 1.5 节中介绍过的 `ExtractTextPlugin`。

由于接入 `sass-loader`，所以项目需要安装这些新的依赖：

```bash
# 安装 webpack Loader 依赖
npm i -D sass-loader css-loader style-loader
# sass-loader 依赖 node-sass
npm i -D node-sass
```

本实例提供项目的完整代码，参见 http://webpack.wuhaolin.cn/3-4 使用 SCSS 语言.zip。

# 3.5 使用 PostCSS

## 1. 认识 PostCSS

PostCSS ([http://postcss.org](http://postcss.org/)) 是一个 CSS 处理工具，和 SCSS 的不同之处在于它可以通过插件机制灵活地扩展其支持的特性，而不像 SCSS 那样语法是固定的。PostCSS 的用处非常多，包括向 CSS 自动加前缀、使用下一代 CSS 语法等。目前越来越多的人开始使用它，它很可能会成为 CSS 预处理器的最终赢家。

PostCSS 和 CSS 的关系就像 Babel 和 JavaScript 的关系，它们解除了语法上的禁锢，通过插件机制来扩展语言本身，用工程手段为语言带来了更多的可能性。

PostCSS 和 SCSS 的关系就像 Babel 和 TypeScript 的关系，PostCSS 更灵活、可扩张性强，SCSS 内置了大量的功能而不能扩展。

为了更直观地展示 PostCSS，让我们来看一些例子。

为 CSS 自动加前缀，增加各浏览器的兼容性：

```css
/* 输入 */
h1 {
  display: flex;
}
/* 输出 */
h1 {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
```

使用下一代 CSS 语法：

```css
/* 输入 */
:root {
  --red: #d33;
}
h1 {
  color: var(--red);
}
/* 输出 */
h1 {
  color: #d33;
}
```

PostCSS 全部采用 JavaScript 编写，运行在 Node.js 之上，既提供了可在 JavaScript 中调用的 Node.js 模块，也提供了可直接通过命令行执行的程序。在 PostCSS 启动时，会从目录下的 `postcss.config.js` 文件中读取所需的配置，所以需要新建该文件，文件的内容大致如下：

```javascript
module.exports = {
  plugins: [
    // 需要使用的插件列表
    require('postcss-cssnext')
  ]
}
```

其中的 `postcss-cssnext` ([http://cssnext.io](http://cssnext.io/)) 插件可以让我们使用下一代 CSS 语法编写代码，再通过 PostCSS 转换成目前的浏览器可识别的 CSS，并且该插件包含为 CSS 自动加前缀的功能。

目前 Chrome 等现代浏览器已经能完全支持 cssnext 中的所有语法，也就是说按照 cssnext 语法写的 CSS 在不经过转换的情况下也能在浏览器中直接运行。

## 2. 接入 Webpack

虽然使用 PostCSS 后，文件的后缀还是 `.css`，但必须将这些文件先交给 `postcss-loader` (https://github.com/postcss/postcss-loader) 处理一遍后再交给 `css-loader`。

接入 PostCSS 相关的 Webpack 配置如下：

```javascript
module.exports = {
  module: {
    rules: [
      {
        // 使用 PostCSS 处理 CSS 文件
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
};
```

接入 PostCSS 为项目带来了新的依赖需要安装，代码如下：

```bash
# 安装 Webpack Loader 依赖
npm i -D postcss-loader css-loader style-loader
# 根据我们使用的特性安装对应的 PostCSS 插件依赖
npm i -D postcss-cssnext
```

本实例提供项目的完整代码，参见 http://webpack.wuhaolin.cn/3-5 使用 PostCSS.zip。

# 3.6 使用 React 框架

## 1. React 的语法特征

在使用了 React 项目的代码中有 JSX 和 Class 语法，例如：

```javascript
class Button extends Component {
  render() {
    return <h1>Hello, Webpack</h1>
  }
}
```

在使用了 React 的项目里，JSX 和 Class 语法并不是必需的，但使用新语法写出的代码看上去更优雅。

其中，JSX 语法是无法在任何现有的 JavaScript 引擎中运行的，所以在构建的过程中需要将源码转换成可以运行的代码，例如：

```javascript
// 原 JSX 语法代码
return <h1>Hello, Webpack</h1>
// 被转换成正常的 JavaScript 代码
return React.createElement('h1', null, 'Hello, Webpack')
```

目前 Babel 和 TypeScript 都提供了对 React 语法的支持，下面分别介绍如何在使用 Babel 或 TypeScript 的项目中接入 React 框架。目前 Babel 和 TypeScript 都提供了对 React 语法的支持，下面分别介绍如何在使用 Babel 或 TypeScript 的项目中接入 React 框架。

## 2. React 与 Babel

在使用 Babel 的项目中接入 React 框架很简单，只需要加入 React 所依赖的 Presets `babel-preset-react` (https://babeljs.io/docs/plugins/preset-react/)。接下来通过修改 3.1 节中的项目，为其接入 React 框架。

通过以下命令：

```bash
# 安装 React 基础依赖
npm i -D react react-dom
# 安装 Babel 完成语法转换所需的依赖
npm i -D babel-preset-react
```

安装新的依赖后，再修改 `.babelrc` 配置文件，加入 React Presets：

```json
"presets": [
  "react"
],
```

这样就完成了一切准备工作。

再修改 `main.js` 文件如下：

```javascript
import * as React from 'react';
import { Component } from 'react';
import { render } from 'react-dom';

class Button extends Component {
  render() {
    return <h1>Hello, Webpack</h1>
  }
}

render(<Button/>, window.document.getElementById('app'));
```

重新执行构建，打开网页后我们将会发现由 React 渲染出来的 Hello, Webpack。

本实例提供项目的完整代码，参见 http://webpack.wuhaolin.cn/3-6 使用 React 框架 Babel.zip。

## 3. React 与 TypeScript

与 Babel 相比，TypeScript 的优点在于，它原生支持 JSX 语法，不需要重新安装新的依赖，只需修改一行配置。但 TypeScript 的不同之处在于：

- 使用了 JSX 语法的文件后缀必须是 `.tsx`；
- 由于 React 不是采用 TypeScript 编写的，所以需要安装 `react` 和 `react-dom` 对应的 TypeScript 接口描述模块 `@types/react` 和 `@types/react-dom` 才能通过编译。

接下来通过修改在 3.2 节中讲过的项目，为其接入 React 框架。修改 TypeScript 编译器的配置文件 `tsconfig.json`，增加对 JSX 语法的支持：

```json
{
  "compilerOptions": {
    "jsx": "react" // 开启 JSX，支持 React
  }
}
```

由于 `main.js` 文件中存在 JSX 语法，所以这里再将 `main.js` 文件重命名为 `main.tsx`，同时修改文件的内容为上面 React 与 Babel 里采用的 React 代码。同时，为了让 Webpack 对项目里的 `.ts` 与 `.tsx` 原文件都采用 `awesome-typescript-loader` 去转换，我们需要注意，Webpack Loader 配置的 `test` 选项需要匹配到 `.tsx` 类型的文件，并且在 `extensions` 中也要加上 `.tsx`，配置如下：

```javascript
const path = require('path');
module.exports = {
  // TS 执行入口文件
  entry: './main',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  devtool: 'source-map',
};
```

通过以下代码安装新的依赖：

```bash
npm i react react-dom @types/react @types/react-dom
```

之后重启构建，重新打开网页，我们将会发现由 React 渲染出来的内容：Hello，Webpack。

本实例提供项目的完整代码：参见 http://webpack.wuhaolin.cn/3-6 使用 React 框架 TypeScript.zip。

# 3.7 使用 Vue 框架

Vue ([https://cn.vuejs.org](https://cn.vuejs.org/)) 是一个渐进式的 MVVM 框架，比 React、Angular 更灵活、轻量。它不会强制性地内置一些功能和语法，我们可以根据自己的需要一点点地增加功能。虽然采用 Vue 的项目能用可直接运行在浏览器环境里的代码编写，但为了方便编写，大多数项目都会采用 Vue 官方的单文件组件 (https://cn.vuejs.org/v2/guide/single-file-components.html#介绍) 的写法去编写项目。由于直接引用 Vue 是很成熟的做法，所以本书只专注于讲解如何用 Webpack 构建 Vue 单文件组件。

## 1. 认识 Vue

Vue 和 React 一样，都推崇组件化和由数据驱动视图的思想，将视图和数据绑定在一起，这样数据改变时，视图会跟着改变，而无需直接操作视图。还是以前面的 Hello, Webpack 为例，来看看 Vue 版本的实现。

`App.vue` 文件代表一个单文件组件，它是项目唯一的组件，也是根组件：

```vue
<!-- 渲染模板 -->
<template>
  <h1>{{ msg }}</h1>
</template>
<!-- 样式描述 -->
<style scoped>
h1 {
  color: red;
}
</style>
<!-- 组件逻辑 -->
<script>
export default {
  data() {
    return {
      msg: 'Hello, Webpack'
    }
  }
}
</script>
```

Vue 的单文件组件通过一个类似于 HTML 文件的 `.vue` 文件就能描述清楚一个组件所需的模板、样式、逻辑。

`main.js` 入口文件：

```javascript
import Vue from 'vue'
import App from './App.vue'

new Vue({
  el: '#app',
  render: h => h(App)
});
```

入口文件创建 Vue 的一个根实例，在 ID 为 `app` 的 DOM 节点上渲染出上面定义的 App 组件。

## 2. 接入 Webpack

目前最成熟和流行的开发 Vue 项目的方式是采用 ES6 加 Babel 转换，这和基本的采用 ES6 开发的项目很相似，差别在于要解析 `.vue` 格式的单文件组件。好在 Vue 官方提供了对应的 `vue-loader` (https://vue-loader.vuejs.org/zh-cn/)，可以非常方便地完成单文件组件的转换。

修改 Webpack 的相关配置如下：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
    ],
  },
};
```

安装新引入的依赖：

```bash
# Vue 框架运行需要的库
npm i -S vue
# 构建所需的依赖
npm i -D vue-loader css-loader vue-template-compiler
```

在这些依赖中，它们的作用分别如下。

- `vue-loader`: 解析和转换 `.vue` 文件，提取出其中的逻辑代码 `script`、样式代码 `style` 及 HTML 模板 `template`，再分别将它们交给对应的 Loader 去处理。
- `css-loader`: 加载由 `vue-loader` 提取出的 CSS 代码。
- `vue-template-compiler`: 将 `vue-loader` 提取出的 HTML 模板编译成对应的可执行的 JavaScript 代码，这和 React 中的 JSX 语法被编译成 JavaScript 代码类似。预先编译好 HTML 模板相对于在浏览器中编译 HTML 模板，性能更好。

重新启动构建，我们就能看到由 Vue 渲染出的 Hello, Webpack 了。

本实例提供项目的完整代码，参见 http://webpack.wuhaolin.cn/3-7 使用 Vue 框架 Babel.zip。

## 3. 使用 TypeScript 编写 Vue 应用

Vue 从 2.5.0 版本开始，就提供了对 TypeScript 的良好支持。使用 TypeScript 编写 Vue 是一个很好的选择，因为 TypeScript 能检查出一些潜在的错误。下面讲解如何用 Webpack 构建使用 TypeScript 编写的 Vue 应用。

新增 `tsconfig.json` 配置文件，内容如下：

```json
{
  "compilerOptions": {
    // 构建出 ES5 版本的 JavaScript，与 Vue 的浏览器支持保持一致
    "target": "es5",
    // 开启严格模式，这可以对 'this' 上的数据属性进行更严格的推断
    "strict": true,
    // TypeScript 编译器输出的 JavaScript 采用 ES2015 模块化，使 Tree Shaking 生效
    "module": "es2015",
    "moduleResolution": "node"
  }
}
```

在以上代码中，`"module": "es2015"` 用于使 Tree Shaking 优化生效，可通过阅读 4.10 节进一步了解。

修改 `App.vue` 脚本部分的内容如下：

```vue
<!-- 组件逻辑 -->
<script lang="ts">
import Vue from "vue";
// 通过 Vue.extend 启用 TypeScript 类型推断
export default Vue.extend({
  data() {
    return {
      msg: 'Hello, Webpack',
    }
  },
});
</script>
```

注意，`script` 标签中的 `lang="ts"` 用于指明代码的语法是 TypeScript。

修改 `main.ts` 的执行入口文件如下：

```typescript
import Vue from 'vue'
import App from './App.vue'

new Vue({
  el: '#app',
  render: h => h(App)
});
```

由于 TypeScript 不认识以 `.vue` 结尾的文件，所以为了让其支持 `import App from './App.vue'` 导入语句，还需要以下文件 `vue-shims.d.ts` 定义 `.vue` 文件的类型：

```typescript
// 告诉 TypeScript 编译器 .vue 文件其实是一个 Vue
declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
```

Webpack 配置需要两个地方，代码如下：

```javascript
const path = require('path');
module.exports = {
  resolve: {
    // 增加对 TypeScript 的 .ts 和 .vue 文件的支持
    extensions: ['.ts', '.js', '.vue', '.json'],
  },
  module: {
    rules: [
      // 加载 .ts 文件
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          // 让 tsc 将 vue 文件当成一个 TypeScript 模块去处理，以解决 module not found 的问题，tsc 本身不会处理 .vue 结尾的文件
          appendTsSuffixTo: [/\.vue$/],
        }
      },
    ],
  },
};
```

除此之外，还需要安装新引入的依赖：

```bash
npm i -D ts-loader typescript
```

本实例提供项目的完整代码，参见 http://webpack.wuhaolin.cn/3-7 使用 Vue 框架 TypeScript.zip。

# 3.8 使用 Angular2 框架

## 1. 认识 Angular2

Angular2 ([https://angular.io](https://angular.io/)) 是 AngularJS ([https://angularjs.org](https://angularjs.org/)) 的下一个版本，它继承了 AngularJS 中的部分思想，又加入了一些新的改进。与 React 和 Vue 相比，Angular2 要复杂得多，这三者的出发点都是组件化和数据驱动视图，但 Angular2 多出了以下概念。

- 模块 (NgModule): 这里的模块不是指 JavaScript 或者其他编程语言里的模块化，而是指 Angular2 里提出的独有用法。
- 注解 (Decorator): 可通过注解语法 `@XXX` 来为一个 Class 附加元数据。
- 服务 (Service): 按照功能划分，将项目中可以复用的重复代码封装成一个个服务以方便为其他模块使用。服务可以包含函数、常数值等，常见的有日志服务、数据服务、应用程序配置等。
- 依赖注入 (Dependency Injection): 也叫作控制反转 (Inversion of Control)，是面向对象编程中的一种设计原则，可以用来降低代码之间的耦合度。

Angular2 引入的这些概念用于分解和简化大型项目的难度，但在小项目开发中可能都是累赘，初学者可能难以掌握。在语言选择上，虽然 Angular2 官方对 TypeScript 和 JavaScript 都提供了支持，但通常选择 Angular2 的项目都会使用 TypeScript，原因在于 Angular2 本身就是使用 TypeScript 开发的，在项目中使用 TypeScript 相对于 JavaScript 来说，开发体验会好很多。

看到这里，我们可能会被 Angular2 的复杂所吓到，所以我们先来看看如何用 Angular2 开发 Hello, Webpack。

这个应用只有一个视图组件 `AppComponent` 用于渲染 Hello, Webpack，组件的代码如下：

```typescript
import { Component } from '@angular/core';

// 通过注解的方式描述清楚这个视图组件所需的模板、样式、数据、逻辑
@Component({
  // 标签的名称
  selector: 'app-root',
  // HTML 模板
  template: '<h1>{{msg}}</h1>',
  // CSS 样式
  styles: ['h1 { color: red; }']
})
export class AppComponent {
  msg = 'Hello, Webpack';
}
```

光有组件还不够，还需要实例化 `AppComponent` 视图组件，并将它渲染到 DOM 中。Angular2 规定可运行的应用至少有一个 NgModule，也就是需要一个根 NgModule。这个根 NgModule 描述了如何启动应用，代码如下：

```typescript
// 让 Angular2 正常运行需要的 polyfill
import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
```

Angular2 应用在启动后会解析当前的 DOM 树，找出名为 `app-root` 的 HTML 标签，Angular2 应用会将这个找出的标签作为容器运行。为此还需要改造 `index.html` 文件，插入 HTML 标签 `app-root`，代码如下：

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Angular2 App</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root>Loading...</app-root>
</body>
</html>
```

要让 Hello, Webpack 运行起来，需要安装以下模块：

```bash

# Angular2 框架的基础核心模块
npm i -S @angular/core @angular/common @angular/compiler @angular/platform-browser @angular/platform-browser-dynamic rxjs zone.js
# Angular2 框架的浏览器环境运行库，类似于 react-dom
npm i -S @angular/platform-browser
# 让 Angular2 正常运行时所依赖的运行环境和 polyfill
npm i -S core-js rxjs zone.js
# 在浏览器的运行过程中动态地编译 HTML 模板
npm i -S @angular/platform-browser-dynamic @angular/compiler
```

以上是一个最小的能正常运行的 Angular2 应用，可见 Angular2 的依赖有很多，使用起来很复杂。

## 2. 接入 Webpack

由于 Angular2 应用采用 TypeScript 开发，构建与在 3.2 节中讲过的类似，不同之处在于 `tsconfig.json` 配置。由于在 Angular2 项目中采用了注解的语法，而且 `@angular/platform-browser` 源码中有许多 DOM 操作，所以需要将配置修改如下：

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "sourceMap": true,
    // 开启对注解的支持
    "experimentalDecorators": true,
    // Angular2 依赖新的 JavaScript API 和 DOM 操作
    "lib": [
      "es2015",
      "dom"
    ]
  },
  "exclude": [
    "node_modules/**"
  ]
}
```

其他配置与在 3.2 节中讲到的配置保持一致，在安装好前面提到的 Angular2 框架依赖的模块后，重新执行构建并打开网页，我们会看到由 Angular2 渲染出来的 Hello, Webpack。

本实例提供项目的完整代码，参见 http://webpack.wuhaolin.cn/3-8 使用 Angular2 框架.zip。

# 3.9 为单页应用生成 HTML

## 1. 引入问题

在 3.6 节中是用最简单的 Hello, Webpack 作为例子让大家理解，在这个例子里因为只输出了一个 `bundle.js` 文件，所以手写了一个 `index.html` 文件去引入这个 `bundle.js`，才能让应用在浏览器中运行起来。

在实际项目中远比这复杂，一个页面常常有很多资源要加载。接下来举一个实战中的例子，要求如下。

- 项目采用 ES6 语言及 React 框架。
- 为页面加入 Google Analytics (https://analytics.google.com/analytics/web/)，这部分代码需要内嵌到 HEAD 标签里。
- 为页面加入 Disqus ([https://disqus.com](https://disqus.com/)) 用户评论，这部分代码需要异步加载以提升首屏加载速度。
- 压缩和分离 JavaScript 和 CSS 代码，提升加载速度。

在开始前先来看看该应用最终发布到线上的代码：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Hello, Webpack</title>
  <!-- 注入 Chunk app 依赖的 CSS -->
  <style rel="stylesheet">h1{color:red}</style>
  <!-- 内嵌 google_analytics 中的 JavaScript 代码 -->
  <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-XXXXXX-Y', 'auto');
    ga('send', 'pageview');
  </script>
  <!-- 异步加载 Disqus 评论 -->
  <script async src="https://dive-into-webpack.disqus.com/embed.js"></script>
</head>
<body>
  <div id="app"></div>
  <!-- 导入 app 依赖的 JavaScript 文件 -->
  <script src="app_746f32b2.js"></script>
  <!-- Disqus 评论容器 -->
  <div id="disqus_thread"></div>
</body>
</html>
```

HTML 应该是被压缩过的，这里为了方便大家阅读，格式化了 HTML 并且加入了注释。

构建出的目录结构为：

```plaintext
dist
├── app_792b46e.js
└── index.html
```

可以看到，部分代码被内嵌进了 HTML 的 HEAD 标签中，部分文件的名称被打上根据文件内容算出的 Hash 值，并且加载这些文件的 URL 地址也被正常注入 HTML 中了。如果我们还采用手写 `index.html` 文件去完成以上要求，就会使工作变得复杂、易错，项目难以维护。本节讲解如何自动化地生成这个符合要求的 `index.html`。

## 2. 解决方案

这里推荐一个用于方便解决以上问题的 Webpack 插件 `web-webpack-plugin` (https://github.com/gwuhaolin/web-webpack-plugin)。该插件已经被社区中的许多人使用和验证，解决了大家的痛点并获得了很多好评，下面具体介绍如何用它来解决上面的问题。

首先，修改 Webpack 配置如下：

```javascript
const path = require('path');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const WebPlugin = require('web-webpack-plugin');

module.exports = {
  entry: {
    app: './main.js' // app 的 JavaScript 执行入口文件
  },
  output: {
    filename: '[name]_[chunkhash:8].js', // 输出的文件名称加上 Hash 值
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        // 排除 node_modules 目录下的文件
        exclude: path.resolve(__dirname, 'node_modules'),
      },
      {
        test: /\.css$/, // 增加对 CSS 文件的支持
        // 提取出 Chunk 中的 CSS 代码到单独的文件中
        use: ExtractTextPlugin.extract({
          use: ['css-loader?minimize'] // 压缩 CSS 代码
        }),
      },
    ],
  },
  plugins: [
    // 使用本文的主角 WebPlugin，一个 WebPlugin 对应一个 HTML 文件
    new WebPlugin({
      template: './template.html', // HTML 模板文件所在的文件路径
      filename: 'index.html' // 输出的 HTML 的文件名称
    }),
    new ExtractTextPlugin({
      filename: '[name]_[contenthash:8].css', // 输出的 CSS 文件名称加上 Hash 值
    }),
    new DefinePlugin({
      // 定义 NODE_ENV 环境变量为 production，以去除源码中只有开发时才需要的部分
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    // 压缩输出的 JavaScript 代码
    new UglifyJsPlugin({
      // 最紧凑的输出
      beautify: false,
      // 删除所有的注释
      comments: false,
      compress: {
        // 在 UglifyJs 删除没有用到的代码时不输出警告
        warnings: false,
        // 删除所有 console 语句，可以兼容 IE 浏览器
        drop_console: true,
        // 内嵌已定义但是只用到了一次的变量
        collapse_vars: true,
        // 提取出出现多次但是没有定义成变量去引用的静态值
        reduce_vars: true,
      }
    }),
  ],
};
```

以上大多数配置都是按照前面讲过的内容增加的配置，例如：

- 增加对 CSS 文件的支持，将 Chunk 中的 CSS 代码提取到单独的文件中，压缩 CSS 文件；
- 定义 NODE_ENV 环境变量为 production，以去除源码中只有开发时才需要的部分；
- 为输出的文件名称加上 Hash 值；
- 压缩输出的 JavaScript 代码。

但核心部分在于 `plugins` 里的内容：

```javascript
new WebPlugin({
  template: './template.html', // HTML 模板文件所在的文件路径
  filename: 'index.html' // 输出的 HTML 的文件名称
})
```

其中 `template: './template.html'` 所指的模板文件 `template.html` 的内容是：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Hello, Webpack</title>
  <!-- 注入 Chunk app 中的 CSS 代码 -->
  <link rel="stylesheet" href="app?_inline">
  <!-- 注入 google_analytics 中的 JavaScript 代码 -->
  <script src="./google_analytics.js?_inline"></script>
  <!-- 异步加载 Disqus 评论 -->
  <script src="https://dive-into-webpack.disqus.com/embed.js" async></script>
</head>
<body>
  <div id="app"></div>
  <!-- 导入 Chunk app 中的 JavaScript 代码 -->
  <script src="app"></script>
  <!-- Disqus 评论容器 -->
  <div id="disqus_thread"></div>
</body>
</html>
```

该文件描述了哪些资源需要被以某种方式加入到输出的 HTML 文件中。

以 `<link rel="stylesheet" href="app?_inline">` 为例，按照正常引入 CSS 文件一样的语法来引入 Webpack 生产的代码。`href` 属性中的 `app?_inline` 可以分为两部分，前面的 `app` 表示 CSS 代码来自名叫 `app` 的 Chunk，后面的 `_inline` 表示这些代码需要被内嵌到这个标签所在的位置。

同样，`<script src="./google_analytics.js?_inline"></script>` 表示 JavaScript 代码来自相对于当前模板文件 `template.html` 的本地文件 `./google_analytics.js`，而且文件中的 JavaScript 代码也需要被内嵌到这个标签所在的位置。

也就是说，在资源链接 URL 字符串里问号前面的部分表示资源内容来自哪里，后面的部分表示注入的方式。

该插件除了支持 `_inline` 属性，表示内嵌资源到 HTML 中，还支持以下属性。

* __dist：只有在生产环境下才引入该资源。
* __dev：只有在开发环境下才引入该资源
* __ie：只有在 IE 浏览器下才需要引入该资源，通过 [if IE] > resource <![endid] 注释实现。

这些属性之间可以搭配使用，互不冲突。例如 `app?_inline&_dist` 表示只在生产环境下才引入该资源，并且需要内嵌到 HTML 里。

WebPlugin 插件还支持一些更高级的用法，若想了解具体内容，则可以访问该项目主页（https://github.com/gwuhaolin/web-webpack-plugin）的阅读文档。

本实例提供项目的完整代码，参见 https://webpack.wuhaolin.cn/3-9 为单页应用生成 HTML.zip。

# 3.10 管理多个单页应用

## 1. 引入问题

在 3.9 节中只生成了一个 HTML 文件，但在实际应用中一个完整的系统不会将所有功能都做到一个网页中，因为这会导致网页性能不佳。实际的做法是按照功能模块划分成多个单页应用，每个页面中生成一个 HTML 文件。并且随着业务的发展，更多的单页应用可能会被逐渐加入到项目中。

虽然 3.9 节已经解决了自动化生成 HTML 的痛点，但是手动去管理多个单页应用的生成也是一件麻烦的事情。继续改造 3.9 节中的例子，要求如下。

- 该项目目前共有两个单页应用组成，一个是主页 `index.html`，一个是用户登录页 `login.html`。
- 多个单页应用之间会有公共的代码部分，需要将这些公共的部分抽离出来，放到单独的文件中以防止重复加载。例如多个页面都使用了一套 CSS 样式，都采用了 React 框架，这些公共的部分需要抽离到单独的文件中。

在开始前先来看看该应用最终发布到线上的代码。

`login.html` 文件的内容如下：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Login</title>
  <!-- 从多个页面中抽离出的公共 CSS 代码 -->
  <link rel="stylesheet" href="common_7cc9a8d0.css">
  <!-- 只有这个页面需要的 CSS 代码 -->
  <link rel="stylesheet" href="login_e31e214b.css">
  <!-- 注入 google_analytics 中的 JavaScript 代码 -->
  <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-XXXXXX-Y', 'auto');
    ga('send', 'pageview');
  </script>
  <!-- 异步加载 Disqus 评论 -->
  <script async src="https://dive-into-webpack.disqus.com/embed.js"></script>
</head>
<body>
  <div id="app"></div>
  <!-- 从多个页面中抽离出的公共 JavaScript 代码 -->
  <script src="common_a1d9142f.js"></script>
  <!-- 只有这个页面需要的 JavaScript 代码 -->
  <script src="login_f926c466.js"></script>
  <!-- Disqus 评论容器 -->
  <div id="disqus_thread"></div>
</body>
</html>
```

构建出的目录结构为：

```plaintext
dist
├── common_029386ff.js
├── common_7cc9a8d0.css
├── index.html
├── index_040198bf.js
├── index_040198bf.css
├── login_63d3761c.js
├── login.html
├── login_0a3feca9.js
└── login_e31e214b.css
```

如果按照 3.9 节的思路，可能需要为每个单页应用配置如下代码：

```javascript
new WebPlugin({
  template: './template.html', // HTML 模板文件所在的文件路径
  filename: 'login.html' // 输出的 HTML 的文件名称
})
```

并且将页面对应的入口加入 `entry` 配置项中，如下所示：

```javascript
entry: {
  index: './pages/index/index.js', // 页面 index.html 的入口文件
  login: './pages/login/index.js', // 页面 login.html 的入口文件
}
```

当有新页面加入时，就需要修改 Webpack 的配置文件，不断插入以上代码，这会导致构建代码难以维护且易错。

## 2. 解决方案

在 3.9 节中讲到的 `web-webpack-plugin` (https://github.com/gwuhaolin/web-webpack-plugin) 插件也内置了解决该问题的方法，在该节使用了它的 `WebPlugin`。本节将使用它的 `AutoWebPlugin` 来解决以上问题，使用起来非常简单，下面讲解具体用法。

项目源码的目录结构如下：

```plaintext
pages
├── index
│   ├── index.js // 该页面单独需要的 CSS 样式
│   └── index.css // 该页面的入口文件
└── login
│	├── index.js
│   └── index.css
├── common.css // 所有页面都需要的公共 CSS 样式
├── google_analytics.js
├── template.html
└── webpack.config.js
```

从目录结构中可以看出以下几点要求：

- 所有单页应用的代码都需要放到一个目录下，例如都放在 `pages` 目录下；
- 一个单页应用对应一个单独的文件夹，例如最后生成的 `index.html` 相关的代码都在 `index` 目录下，`login.html` 同理；
- 每个单页应用的目录下都有一个 `index.js` 文件作为入口执行文件。

虽然 `AutoWebPlugin` 强制性地规定了项目部分的目录结构，但从实践经验来看，这是一种优雅的目录规范，合理地拆分了代码，又能让新人快速看懂项目的结构，方便日后维护。

将 Webpack 配置文件修改如下：

```javascript
const { AutoWebPlugin } = require('web-webpack-plugin');
// 使用本文的主角 AutoWebPlugin，自动寻找 pages 目录下的所有目录，将每一个目录看作一个单页应用
const autoWebPlugin = new AutoWebPlugin('pages', {
  template: './template.html', // HTML 模板文件所在的文件路径
  postEntries: ['./common.css'], // 所有页面都依赖这份通用的 CSS 样式文件
  // 提取出所有页面的公共代码
  commonsChunk: {
    name: 'common', // 提取出公共代码 Chunk 的名称
  },
});

module.exports = {
  // AutoWebPlugin 会为寻找到的所有单页应用生成对应的入口配置
  entry: autoWebPlugin.entry({
    // 这里可以加入我们额外需要的 Chunk 入口
  }),
  plugins: [
    autoWebPlugin,
  ],
};
```

以上配置文件为了重点展示出本节侧重修改的部分，省略了部分和 3.9 节一致的代码，读者可以参照 3.9 节或者下载本项目的完整代码。

`AutoWebPlugin` 会找出 `pages` 目录下的两个文件夹 `index` 和 `login`，将这两个文件夹看作两个单页应用，并且分别为每个单页应用生成一个 Chunk 配置和 `WebPlugin` 配置。每个单页应用的 Chunk 名称等同于文件夹的名称，也就是说 `autoWebPlugin.entry()` 方法返回的内容其实是：

```javascript
{
  "index": ["./pages/index/index.js", "./common.css"],
  "login": ["./pages/login/index.js", "./common.css"]
}
```

但 `AutoWebPlugin` 会自动为我们完成这些事情，我们明白大致原理即可。

`template.html` 模板文件如下：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <!-- 在这里注入该页面所依赖但没有手动导入的 CSS -->
  <!--STYLE-->
  <!-- 注入 google_analytics 中的 JavaScript 代码 -->
  <script src="./google_analytics.js?_inline"></script>
  <!-- 异步加载 Disqus 评论 -->
  <script src="https://dive-into-webpack.disqus.com/embed.js" async></script>
</head>
<body>
  <div id="app"></div>
  <!-- 在这里注入该页面所依赖但没有手动导入的 JavaScript -->
  <!--SCRIPT-->
  <!-- Disqus 评论容器 -->
  <div id="disqus_thread"></div>
</body>
</html>
```

注意到在模板文件中出现了两个重要的新关键字：`<!--STYLE-->` 和 `<!--SCRIPT-->`，它们是什么意思呢？

由于该模板文件被当作项目中所有单页应用的模板，所以不能再像 3.9 节中那样直接写 Chunk 的名称去引入资源，因为需要被注入当前页面的 Chunk 名称是不固定的，每个单页应用都会有自己的名称。`<!--STYLE-->` 和 `<!--SCRIPT-->` 的作用在于保证该页面所依赖的资源都会被注入生成的 HTML 模板里。

`web-webpack-plugin` 能分析出每个页面依赖哪些资源，例如对于 `login.html` 来说，该插件可以确定该页面依赖以下资源：

- 所有页面都依赖的公共 CSS 代码 `common.css`；
- 所有页面都依赖的公共 JavaScript 代码 `common.js`；
- 只有这个页面依赖的 CSS 代码 `login.css`；
- 只有这个页面依赖的 JavaScript 代码 `login.js`。

由于在模板文件 `template.html` 里没有指出引入这些依赖资源的 HTML 语句，所以插件会自动将没有手动导入但页面依赖的资源按照不同的类型注入 `<!--STYLE-->` 和 `<!--SCRIPT-->` 所在的位置。

- 将 CSS 类型的文件注入 `<!--STYLE-->` 所在的位置，如果 `<!--STYLE-->` 不存在，就注入 HTML HEAD 标签的最后。
- 将 JavaScript 类型的文件注入 `<!--SCRIPT-->` 所在的位置，如果 `<!--SCRIPT-->` 不存在，就注入 HTML BODY 标签的最后。

如果后续有新的页面需要开发，就只需在 `pages` 目录下新建一个目录，该目录名为所输出 HTML 文件的名称，在目录下放这个页面相关的代码即可，无须改动构建代码。

由于 `AutoWebPlugin` 是间接通过在 3.9 节提到的 `WebPlugin` 实现的，所以对于 `WebPlugin` 支持的功能，`AutoWebPlugin` 全部支持，若想了解具体内容，则可以阅读该项目主页 (https://github.com/gwuhaolin/web-webpack-plugin) 的阅读文档。

本实例提供项目的完整代码，参见 http://webpack.wuhaolin.cn/3-10 管理多个单页应用.zip。

# 3.11 构建同构应用

同构应用是指写一份代码但可同时在浏览器和服务器中运行的应用。

## 1. 认识同构应用

现在大多数单页应用的视图都是通过 JavaScript 代码在浏览器端渲染出来的，但在浏览器端渲染的坏处如下。

- 搜索引擎无法收录我们的网页，因为展示的数据都是在浏览器端异步渲染出来的，大部分爬虫无法获取这些数据。
- 对于复杂的单页应用，渲染过程的计算量大，对于低端移动设备来说可能会有性能问题，用户能明显感知首屏的渲染延迟。

为了解决以上问题，有人提出能否将原本只运行在浏览器中的 JavaScript 渲染代码也在服务器端运行，在服务器端渲染出带内容的 HTML 后再返回。这样就能让搜索引擎爬虫直接抓取带数据的 HTML，同时减少首屏渲染时间。Node.js 的流行和成熟，以及虚拟 DOM 的提出与实现，使这个假设成为可能。

实际上，现在主流的前端框架都支持同构，包括 React、Vue2、Angular2，其中最先支持也最成熟的同构方案是 React。由于 React 的使用者更多，所以它们之间很相似，本节只介绍如何用 Webpack 构建 React 同构应用。

同构应用的运行原理的核心在于虚拟 DOM，虚拟 DOM 的意思是不直接操作 DOM，而是通过 JavaScript Object 描述原本的 DOM 结构。在需要更新 DOM 时不直接操作 DOM 树，而是在更新 JavaScript Object 后再映射成 DOM 操作。

虚拟 DOM 的优点如下。

- 因为操作 DOM 树是高耗时的操作，所以尽量减少 DOM 树操作能优化网页的性能。而通过 DOM Diff 算法能找出两个不同 Object 的最小差异，得出最小的 DOM 操作。
- 虚拟 DOM 在渲染时不仅可以通过操作 DOM 树表示结果，也可以有其他表示方式，例如将虚拟 DOM 渲染成字符串（服务器端渲染），或者渲染成手机 App 原生的 UI 组件（React Native）。

以 React 为例，核心模块 `react` 负责管理 React 组件的生命周期，而具体的渲染工作可以由 `react-dom` 模块负责。

`react-dom` 在渲染虚拟 DOM 树时有两种方式可以选择。

- 通过 `render()` 函数去操作浏览器 DOM 树来展示出结果。
- 通过 `renderToString()` 计算表示虚拟 DOM 的 HTML 形式的字符串。

构建同构应用的最终目的是从一份项目源码中构建出两份 JavaScript 代码，一份用于在浏览器端运行，一份用于在 Node.js 环境中运行并渲染出 HTML。对于要在 Node.js 环境中运行的 JavaScript 代码，需要注意：

- 不能包含浏览器环境提供的 API，例如使用 `document` 进行 DOM 操作，因为 Node.js 不支持这些 API；
- 不能包含 CSS 代码，因为服务器端渲染的目的是渲染出 HTML 的内容，渲染出 CSS 代码会增加额外的计算量，影响服务端的渲染性能；
- 不能像用于浏览器环境的输出代码那样将 `node_modules` 里的第三方模块和 Node.js 原生模块（例如 fs 模块）打包进去，而是需要通过 CommonJS 规范引入这些模块；
- 需要通过 CommonJS 规范导出一个渲染函数，用于在 HTTP 服务器中执行这个渲染函数，渲染出 HTML 的内容后返回。

# 3.15 搭配 Npm Script

## 1. 认识 Npm Script

Npm Script 是一个任务执行者。Npm 是在安装 Node.js 时附带的包管理器，Npm Script 则是 Npm 内置的一个功能，允许在 package.json 文件里使用 scripts 字段定义任务：

```json
{
    "scripts": {
        "dev": "node dev.js",
        "pub": "node build.js"
    }
}
```

以上代码中的 scripts 字段是一个对象，每个属性对应一段脚本，以上代码定义了两个任务 dev 和 pub。Npm  Script 的底层实现原理是通过调用 Shell 去运行脚本命令，例如执行 npm run pub 命令等同于执行 node build.js 命令。

Npm Script 还有一个重要的功能，是能运行安装到项目目录的 node_modules 里的可执行模块，例如在通过命令：

```shell
npm i -D webpack
```

将 Webpack 安装到项目中后，是无法直接在项目根目录下通过命令 webpack 去执行 Webpack 构建的，而是要通过如下命令去执行：

```bash
./node_modules/.bin/webpack
```

Npm Script 能方便地解决这个问题，只需要在 scripts 字段里定义一个任务，例如：

```json
{
  "scripts": {
    "build": "webpack"
  }
}
```

Npm Script 会先去项目目录下的 node_modules 中寻找有没有可执行的 webpack 文件，如果有就使用本地的，如果没有就使用全局的。所以现在执行 Webpack 构建时，只需要通过执行 npm run build 实现。

## 2. Webpack 为什么需要 Npm Script

Webpack 只是一个打包模块化代码的工具，并没有提供任何任务管理相关的功能。但在实际场景中通常不会是只通过执行 webpack 就能完成所有任务的，而是需要多个任务才能完成。

举一个常见的例子，要求如下。

- 在开发阶段为了提高开发体验，使用 DevServer 做开发，并且需要输出 Source Map 以方便调试，同时需要开启自动刷新功能。
- 为了减小发布到线上的代码尺寸，在构建出发布到线上的代码时，需要压缩输出的代码。
- 在构建完发布到线上的代码后，需要将构建出的代码提交给发布系统。

可以看出要求 1 和要求 2 是相互冲突的，其中要求 3 又依赖要求 2。要满足以上三个要求，需要定义三个不同的任务。

接下来通过 Npm Script 定义上面的 3 个要求：

```json
"scripts": {
  "dev": "webpack-dev-server --open",
  "dist": "NODE_ENV=production webpack --config webpack_dist.config.js",
  "pub": "npm run dist && rsync dist"
},
```

含义分别如下。

- dev 代表用于开发时执行的任务，通过 DevServer 启动构建。所以在开发项目时只需执行 npm run dev。
- dist 代表构建出用于发布到线上的代码，输出到 dist 目录中。其中的 NODE_ENV=production 用于在运行任务时注入环境变量。
- pub 代表先构建出用于发布到线上的代码，再同步 dist 目录中的文件到发布系统（如何同步文件，则需根据我们所使用的发布系统而定），所以在开发完成后需要发布时只需执行 npm run pub。

使用 Npm Script 的好处是将一连串复杂的流程简化成了一个简单的命令，在需要时只需执行对应的简短命令，而不用手动重复整个流程。这会大大提高我们的效率并降低出错率。

本实例提供项目的完整代码，参见 http://webpack.wuhaolin.cn/3-15 搭配 NpmScript.zip。

# 3.16 检查代码

当项目代码变得日益庞大、复杂时，如何保障代码质量？如何保障多人协助开发时代码的可读性？

完全解决以上问题不是一件简单的事，但代码代检查能解决大部分问题。本节将讲解如何结合构建做代码检查。

## 1. 代码检查具体是做什么的

检查代码和 Code Review 很相似，都是审视提交的代码可能存在的问题。但 Code Review 一般由人执行，而检查代码是通过机器执行一些自动化的检查。自动化地检查代码的成本更低，实施代价更小。

检查代码时主要检查以下几项。

- 代码风格：让项目成员强制遵守统一的代码风格，例如如何缩紧、如何写注释等，保障代码的可读性，不将时间浪费在争论如何使代码更好看上。
- 潜在问题：分析代码在运行过程中可能出现的潜在 Bug。

其中，检查代码风格相关的工具很多，也很成熟。由于情况复杂，对潜在问题的检查目前还没有成熟的工具。

目前已经有成熟的工具可以检验诸如 JavaScript、TypeScript、CSS、SCSS 等常用语言。

## 2. 怎么做代码检查

在做代码风格检查时需要按照不同的文件类型来检查，下面分别介绍。

### 1. 检查 JavaScript

目前最常用的 JavaScript 检查工具是 ESLint（[https://eslint.org](https://eslint.org/)），它不仅内置了大量的常用检查规则，还可以通过插件机制做到灵活扩展。

ESLint 的使用很简单，在通过：

```bash
npm i -g eslint
```

安装到全局后，再在项目目录下执行：

```bash
eslint init
```

来新建一个 ESlint 配置文件 .eslintrc。该文件的格式为 JSON。

如果想覆盖默认的检查规则，或者想加入新的检查规则，则需要修改该文件，例如使用以下配置：

```json
{
  // 从 eslint:recommended 中继承所有检查规则
  "extends": "eslint:recommended",
  // 再自定义一些规则
  "rules": {
    // 需要在每行结尾加；
    "semi": ["error", "always"],
    // 需要使用“”包裹字符串
    "quotes": ["error", "double"]
  }
}
```

写好配置文件后，再执行：

```bash
eslint yourfile.js
```

去检查 `yourfile.js` 文件，如果文件没有通过检查，ESLint 会输出出错的原因。

例如：

```plaintext
/yourfile.js
  296:13  error  Strings must use doublequote  quotes
  298:7   error  Missing semicolon             semi

✖ 2 problems (2 errors, 0 warnings)
```

ESLint 还有很多功能和检查规则，由于篇幅有限，这里就不详细介绍，可以到其官网阅读相关文档。

### 2. 检查 TypeScript

TSLint（https://palantir.github.io/tslint/）是一个和 ESLint 相似的 TypeScript 代码检查工具，区别在于 TSLint 只专注于检查 TypeScript 代码。

TSLint 和 ESLint 的使用方法很相似，首先通过：

```bash
npm i -g tslint
```

安装到全局，再去项目根目录下执行：

```bash
tslint --init
```

生成配置文件 `tslint.json`。在配置好后，再执行：

```bash
tslint yourfile.ts
```

去检查 `yourfile.ts` 文件。

### 3. 检查 CSS

stylelint（https://stylelint.io/）是目前最成熟的 CSS 检查工具，在内置了大量检查规则的同时，也提供了插件机制让用户自定义扩展。stylelint 基于 PostCSS，能检查任何 PostCSS 能解析的代码，例如 SCSS、Less 等。

首先通过：

```bash
npm i -g stylelint
```

安装到全局后，去项目根目录下新建 `.stylelintrc` 配置文件，该配置文件的格式为 JSON，其格式和 ESLint 的配置相似，例如：

```json
{
  // 继承 stylelint-config-standard 中所有的检查规则
  "extends": "stylelint-config-standard",
  // 再自定义检查规则
  "rules": {
    "at-rule-empty-line-before": null
  }
}
```

配置好后，再执行：

```bash
stylelint yourfile.css
```

去检查 `yourfile.css` 文件。

stylelint 还有很多功能和配置项在这里没有介绍，可以访问其官方进一步了解。

目前有很多编辑器如 Webstorm、VSCode 等已经集成了以上介绍的检查工具，编辑器会将检查工具输出的错误实时地显示到编辑的源码上。通过编辑器集成后，不用通过命令行的方式去定位错误。

## 3. 结合 Webpack 检查代码

以上介绍的代码检查工具可以和 Webpack 结合，在开发过程中通过 Webpack 输出实时的检查结果。

### 1. 结合 ESLint

eslint-loader（https://github.com/MoOx/eslint-loader）可以方便地将 ESLint 整合到 Webpack 中，使用方法如下：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        // 不用检查 node_modules 目录下的代码
        exclude: /node_modules/,
        loader: 'eslint-loader',
        // 将 eslint-loader 的执行顺序放在最前面，防止其他 loader 将处理后的代码
        // 交给 eslint-loader 去检查
        enforce: 'pre'
      }
    ]
  }
}
```

接入 eslint-loader 后，就能在控制台中看到 ESLint 输出的错误日志了。

### 2. 结合 TSLint

tslint-loader（https://github.com/wbuchwalter/tslint-loader）是一个和 eslint-loader 相似的 Webpack Loader，能方便地将 TSLint 整合到 Webpack 中，其使用方法如下：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        // 不用检查 node_modules 目录下的代码
        exclude: /node_modules/,
        loader: 'tslint-loader',
        // 将 tslint-loader 的执行顺序放到最前面，防止其他 loader 将处理后的代码
        // 交给 tslint-loader 去检查
        enforce: 'pre'
      }
    ]
  }
}
```

### 3. 结合 stylelint

StyleLintPlugin（https://github.com/JaKXz/stylelint-webpack-plugin）能将 stylelint 整合到 Webpack 中，其使用方法很简单，代码如下：

```javascript
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  // ...
  plugins: [
    new StyleLintPlugin()
  ]
}
```

### 4. 一些建议

将代码检查功能整合到 Webpack 中会导致以下问题：

- 由于执行检查步骤的计算量大，所以整合到 Webpack 中会导致构建变慢；
- 在整合代码检查到 Webpack 后，输出的错误信息是通过行号来定位错误的，没有编辑器集成显示得直观。

为了避免以上问题，还可以这样做：

- 使用集成了代码检查功能的编辑器，让编辑器实时、直观地提示错误；
- 将代码检查步骤放到代码提交时，也就是在代码提交前调用以上检查工具去检查代码，只有在检查都通过时才能提交代码，这样就能保证提交到仓库的代码都通过了检查。

如果我们的项目是使用 Git 管理的，则 Git 提供了 Hook 功能做到在提交代码前触发执行脚本。

husky（https://github.com/typicode/husky）可以方便、快速地为项目接入 Git Hook。执行 `npm i -D husky` 安装 husky，husky 会通过 Npm Scripts 为你配置好 Git Hook。我们需要做的只是在 `package.json` 文件中定义好事件脚本，方法如下：

```json
{
  "scripts": {
    // 在执行 git commit 前会执行的脚本
    "precommit": "npm run lint",
    // 在执行 git push 前会执行的脚本
    "prepush": "lint",
    // 调用 eslint、stylelint 等工具检查代码
    "lint": "eslint && stylelint"
  }
}
```

我们需要根据自己的情况选择 `precommit` 和 `prepush` 中的一个，无须对两个都设置。

# 3.17 通过 Node.js API 启动 Webpack

Webpack 除了提供了可执行的命令行工具，还提供了可在 Node.js 环境中调用的库。通过 Webpack 暴露的 API，可直接在 Node.js 程序中调用 Webpack 执行构建。

通过 API 去调用并执行 Webpack，比直接通过可执行文件启动更灵活，可用在一些特殊场景中，下面讲解如何使用 Webpack 提供的 API。

Webpack 其实是一个 Node.js 应用程序，全部通过 JavaScript 开发完成。在命令行中执行 `webpack` 命令其实等价于执行 `node ./node_modules/webpack/bin/webpack.js`。

## 1. 安装和使用 Webpack 模块

在调用 Webpack API 前，需要先安装它：

```bash
npm i -D webpack
```

安装成功后，可以采用以下代码导入 Webpack 模块：

```javascript
const webpack = require('webpack');

// ES6 语法
import webpack from 'webpack';
```

导出的 `webpack` 其实是一个函数，使用方法如下：

```javascript
webpack({
  // Webpack 配置，和 webpack.config.js 文件一致
}, (err, stats) => {
  if (err || stats.hasErrors()) {
    // 构建过程出错
  }
  // 成功执行完构建
});
```

如果我们将 Webpack 配置写在 `webpack.config.js` 文件中，则可以这样使用：

```javascript
// 读取 webpack.config.js 文件中的配置
const config = require('./webpack.config.js');
webpack(config, callback);
```

## 2. 以监听模式运行

以上使用 Webpack API 的方法只能执行一次构建，无法以监听模式启动 Webpack，为了在使用 API 时以监听模式启动，则需要获取 Compiler 实例，方法如下：

```javascript
// 如果不传 callback 回调函数作为第 2 个参数，就会返回一个 Compiler 实例，用于控制启动，而不是像上面那样立即启动
const compiler = webpack(config);

// 调用 compiler.watch 并以监听模式启动，返回的 watching 用于关闭监听
const watching = compiler.watch({
  // watchOptions
  aggregateTimeout: 300,
}, (err, stats) => {
  // 每次因文件发生变化而重新执行完构建后
});

// 调用 watching.close 关闭监听
watching.close(() => {
  // 在监听关闭后
});
```

其中的 `watchOptions` 就是在 2.7 节中介绍过的 Watch 和 WatchOptions。

本实例提供项目的完整代码，参见 http://webpack.wuhaolin.cn/3-17 通过 Node.js API 启动 Webpack.zip。

# 3.18 使用 Webpack Dev Middleware

在 1.6 节中介绍过的 DevServer 是一个方便开发的小型 HTTP 服务器，DevServer 其实是基于 `webpack-dev-middleware`（https://github.com/webpack/webpack-dev-middleware）和 Expressjs（[https://expressjs.com](https://expressjs.com/)）实现的。而 `webpack-dev-middleware` 其实是 Expressjs 的一个中间件。

也就是说，实现 DevServer 基本功能的代码大致如下：

```javascript
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');

// 从 webpack.config.js 文件中读取 Webpack 配置
const config = require('./webpack.config.js');
// 实例化一个 Expressjs app
const app = express();

// 用读取到的 Webpack 配置实例化一个 Compiler
const compiler = webpack(config);
// 为 app 注册 webpackMiddleware 中间件
app.use(webpackMiddleware(compiler));
// 启动 HTTP 服务器，服务器监听在 3000 端口
app.listen(3000);
```

从以上代码可以看出，从 `webpack-dev-middleware` 中导出的 `webpackMiddleware` 是一个函数，该函数需要接收一个 Compiler 实例。在 3.17 节中曾提到，Webpack API 导出的 `webpack` 函数会返回一个 Compiler 实例。

`webpackMiddleware` 函数的返回结果是一个 Expressjs 的中间件，该中间件有以下功能：

- 接收来自 Webpack Compiler 实例输出的文件，但不会将文件输出到硬盘中，而会保存在内存中。
- 在 Expressjs app 上注册路由，拦截 HTTP 收到的请求，根据请求路径响应对应的文件内容。

## 1. Webpack Dev Middleware 支持的配置项

在 Node.js 中调用 `webpack-dev-middleware` 提供的 API 时，还可以向它传入一些配置项，方法如下：

```javascript
// webpackMiddleware 函数的第 2 个参数为配置项
app.use(webpackMiddleware(compiler, {
  // 在 webpack-dev-middleware 支持的所有配置项中
  // 只有 publicPath 属性为必填项，其他都是选填项
  publicPath: "/assets/",

  // Webpack 输出资源绑定到 HTTP 服务器上的根目录，
  // 和 Webpack 配置中的 publicPath 含义一致

  // 不输出 info 类型的日志到控制台，只输出 warn 和 error 类型的日志
  noInfo: false,

  // 不输出任何类型的日志到控制台
  quiet: false,

  // 切换到懒加载模式，这意味着不监听文件的变化，只会在有请求时再编译对应的文件。
  // 这适合页面非常多的项目。
  lazy: true,

  // watchOptions
  // 只在非懒加载模式下才有效
  watchOptions: {
    aggregateTimeout: 300,
    poll: true
  },

  // 默认的 HTML 路径，默认为 "index.html"
  index: "index.html",

  // 自定义 HTTP 头
  headers: { 'X-Custom-Header': 'yes' },

  // 为特定后缀的文件添加 HTTP mimeTypes，作为文件类型映射表
  mimeTypes: { 'text/html': ['phtml'] },

  // 统计信息输出样式
  stats: {
    colors: true
  },

  // 自定义输出日志的展示方法
  reporter: null,

  // 开启或关闭服务端渲染
  serverSideRender: false,
}));
```

## 2. Webpack Dev Middleware 与模块热替换

DevServer 提供了一个便捷的功能，可以做到在监听到文件发生变化时自动替换网页中的老模块，以做到实时预览。DevServer 虽然是基于 `webpack-dev-middleware` 实现的，但 `webpack-dev-middleware` 并没有实现模块热替换功能，而 DevServer 自己实现了该功能。

为了在使用 `webpack-dev-middleware` 时也能使用模块热替换功能去提升开发效率，需要额外接入 `webpack-hot-middleware`（https://github.com/glenjamin/webpack-hot-middleware）。需要做以下修改才能实现模块热替换。

**第 1 步**，修改 `webpack.config.js` 文件，加入 `HotModuleReplacementPlugin` 插件，修改如下：

```javascript
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');

module.exports = {
  entry: [
    // 为了支持模块热替换，注入代理客户端
    'webpack-hot-middleware/client',
    // JavaScript 执行入口文件
    './src/main.js'
  ],
  output: {
    // 将所有依赖的模块合并输出到一个 bundle.js 文件中
    filename: 'bundle.js',
  },
  plugins: [
    // 为了支持模块热替换，生成 .hot-update.json 文件
    new HotModuleReplacementPlugin(),
  ],
  devtool: 'source-map',
};
```

该修改相当于完成了在 4.6 节中提到的 `webpack-dev-server --hot` 的工作。

**第 2 步**，修改 HTTP 服务器代码的 `server.js` 文件，接入 `webpack-hot-middleware` 中间件，修改如下：

```javascript
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');

// 从 webpack.config.js 文件中读取 Webpack 配置
const config = require('./webpack.config.js');
// 实例化一个 Expressjs app
const app = express();

// 用读取到的 Webpack 配置实例化一个 Compiler
const compiler = webpack(config);
// 为 app 注册 webpackMiddleware 中间件
app.use(webpackMiddleware(compiler));
// 为了支持模块热替换，响应用于替换老模块的资源
app.use(require('webpack-hot-middleware')(compiler));
// 将项目根目录作为静态资源目录，用于服务 HTML 文件
app.use(express.static('.'));
// 启动 HTTP 服务器，服务器监听在 3000 端口
app.listen(3000, () => {
  console.info('成功监听在 3000');
});
```

**第 3 步**，修改执行入口文件 `main.js`，加入替换逻辑，在文件末尾加入以下代码：

```javascript
if (module.hot) {
  module.hot.accept();
}
```

**第 4 步**，安装新引入的依赖：

```bash
npm i -D webpack-dev-middleware webpack-hot-middleware express
```

安装成功后，通过 `node ./server.js` 就能启动一个类似于 DevServer 的支持模块热替换的自定义 HTTP 服务了。

本实例提供项目的完整代码，参见 http://webpack.wuhaolin.cn/3-18 使用 Webpack Dev Middleware.zip。

# 3.19 加载图片

在网页中不可避免地会依赖图片资源，例如 PNG、JPG、GIF。下面讲解如何用 Webpack 加载图片资源。

## 1. 使用 file-loader

file-loader（https://github.com/webpack-contrib/file-loader）可以将 JavaScript 和 CSS 中导入图片的语句替换成正确的地址，同时将文件输出到对应的位置。

例如，CSS 源码是这样写的：

```css
#app {
  background-image: url(./imgs/a.png);
}
```

被 file-loader 转换后输出的 CSS 会变成下面这样：

```css
#app {
  background-image: url(5556e1251a78c5afda9ee7dd06ad109b.png);
}
```

并且在输出目录 dist 中多出 ./imgs/a.png 对应的图片文件 5556e1251a78c5afda9ee7dd06ad109b.png，输出的文件名是根据文件的内容计算出的 hash 值。

同理，在 JavaScript 中导入图片的源码如下：

```javascript
import imgB from './imgs/b.png';

window.document.getElementById('app').innerHTML = `
  <img src="${imgB}"/>
`;
```

经过 file-loader 处理后输出的 JavaScript 代码如下：

```javascript
module.exports = __webpack_require__.p + "0bce1f8d385f78e1271ebfca50668429.png";
```

也就是说，imgB 的值就是图片对应的 URL 地址。

在 Webpack 中使用 file-loader 非常简单，相关配置如下：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.png$/,
        use: ['file-loader']
      }
    ]
  }
};
```

本实例提供项目的完整代码，参见 http://webpack.wuhaolin.cn/3-19 加载图片 file-loader.zip。

## 2. 使用 url-loader

url-loader（https://github.com/webpack-contrib/url-loader）可以将文件的内容经过 base64 编码后注入 JavaScript 或者 CSS 中。

例如，CSS 源码是这样写的：

```css
#app {
  background-image: url(./imgs/a.png);
}
```

被 url-loader 转换后输出的 CSS 会变成下面这样：

```css
#app {
  background-image: url(data:image/png;base64,iVBORw0lafer...); /* 结尾省略了剩下的 base64 编码后的数据 */
}
```

同理，在 JavaScript 中效果类似。

从上面的例子中可以看出，url-loader 会将根据图片内容计算出的 base64 编码的字符串直接注入代码中。由于一般的图片数据量巨大，会导致 JavaScript、CSS 文件也跟着变大，所以在使用 url-loader 时，一定要注意图片的体积不能太大，不然会导致因 JavaScript、CSS 文件过大而带来的网页加载缓慢问题。

一般利用 url-loader 将网页需要用到的小图片资源注入代码中，以减少加载次数。因为在 HTTP/1 协议中，每加载一个资源都需要建立一次 HTTP 链接，为了一个很小的图片而新建一次 HTTP 连接是不划算的。

url-loader 考虑到了以上问题，并提供了一个方便的选择：limit，该选项用于控制在文件的大小小于 limit 时才使用 url-loader，否则使用 fallback 选项中配置的 loader。相关的 Webpack 配置如下：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // 30KB 以下的文件采用 url-loader
              limit: 1024 * 30,
              // 否则采用 file-loader，默认值是 file-loader
              fallback: 'file-loader'
            }
          }
        ]
      }
    ]
  }
};
```

除此之外，还可以做以下优化。

- 通过 imagemin-webpack-plugin（https://www.npmjs.com/package/imagemin-webpack-plugin）压缩图片。
- 通过 webpack-spritesmith（https://www.npmjs.com/package/webpack-spritesmith）插件制作雪碧图。

以上加载图片的方法同样适用于其他二进制类型的资源，例如 PDF、SWF 等。

# 3.20 加载 SVG

SVG 作为矢量图的一种标准格式，已经得到了各大浏览器的支持，也成为 Web 中矢量图的代名词。在网页中采用 SVG 代替位图有如下好处。

- SVG 比位图更清晰，在任意缩放的情况下都不会破坏图形的清晰度，能方便地解决高分辨率屏幕下图显示不清楚的问题。
- 在图形线条比较简单的情况下，SVG 文件的大小要小于位图，在扁平化 UI 流行的今天，在大多数情况下 SVG 会更小。
- 图形相同的 SVG 比对应的高清图有更好的渲染性能。
- SVG 采用和 HTML 一致的 XML 语法描述，灵活性很高。

画图工具能导出一个 .svg 文件，SVG 的导入方法和图片类似，既可以像下面这样在 CSS 中直接使用：

```css
body {
  background-image: url(./svgs/activity.svg);
}
```

也可以在 HTML 中使用：

```html
<img src="./svgs/activity.svg"/>
```

也就是说，可以直接将 SVG 文件当作一张图片来使用，方法和使用图片时完全一样。所以在 3.19 节中介绍的两种方法 —— 使用 file-loader 和使用 url-loader，对 SVG 来说同样有效，只需将 Loader test 配置中的文件后缀改成 .svg，代码如下：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ['file-loader']
      }
    ]
  }
};
```

由于 SVG 是文本格式的文件，所以除了有以上两种方法，还有其他方法，下面一一说明。

## 1. 使用 raw-loader

raw-loader（https://github.com/webpack-contrib/raw-loader）可以将文本文件的内容读取出来，注入 JavaScript 或 CSS 中。

例如，在 JavaScript 中这样写：

```javascript
import svgContent from './svgs/alert.svg';
```

经过 raw-loader 处理后输出的代码如下：

```javascript
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\">...</svg>";
// 末尾省略了 SVG 的内容
```

也就是说，svgContent 的内容等同于字符串形式的 SVG，由于 SVG 本身就是 HTML 元素，所以在获取 SVG 的内容后，可以直接通过以下代码将 SVG 插入网页中：

```javascript
window.document.getElementById('app').innerHTML = svgContent;
```

使用 raw-loader 时的相关 Webpack 配置如下：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ['raw-loader']
      }
    ]
  }
};
```

由于 raw-loader 会直接返回 SVG 的文本内容，并且无法通过 CSS 展示 SVG 的文本内容，因此采用本方法后无法在 CSS 中导入 SVG。也就是说，在 CSS 中不可以出现 `background-image: url(./svgs/activity.svg)` 这样的代码，因为 `background-image: url(<svg>...</svg>)` 是不合法的。

本实例提供项目的完整代码，参见 http://webpack.wuhaolin.cn/3-20 加载 SVG-raw-loader.zip。

## 2. 使用 svg-inline-loader

svg-inline-loader（https://github.com/webpack-contrib/svg-inline-loader）和上面提到的 raw-loader 非常相似，不同之处在于 svg-inline-loader 会分析 SVG 的内容，去除其中不必要的部分代码，以减小 SVG 的文件大小。

在使用画图工具如 Adobe Illustrator、Sketch 制作 SVG 后，在导出时这些工具会生成对网页运行来说不必要的代码。举个例子，以下是 Sketch 导出的 SVG 的代码：

```svg
<svg class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="#000">
  <circle cx="12" cy="12" r="10"/>
</svg>
```

被 svg-inline-loader 处理后会精简如下：

```svg
<svg viewBox="0 0 24 24" stroke="#000"><circle cx="12" cy="12" r="10"/></svg>
```

也就是说，svg-inline-loader 增加了对 SVG 的压缩功能。

使用 svg-inline-loader 时相关的 Webpack 配置如下：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ['svg-inline-loader']
      }
    ]
  }
};
```

本实例提供项目的完整代码，参见 http://webpack.wuhaolin.cn/3-20 加载 SVG-svg-inline-loader.zip。

# 3.21 加载 Source Map

在开发过程中会经常使用新语言开发项目，最后会将源码转换成能在浏览器中直接运行的 JavaScript 代码。这样做虽能提升开发效率，但在调试代码的过程中我们会发现，所生成代码的可读性非常差，这为代码调试带来了不便。

Webpack 支持为转换生成的代码输出对应的 Source Map 文件，以方便在浏览器中通过源码调试。控制 Source Map 输出的 Webpack 配置项是 devtool，它有很多选项，如表 3-1 所示。

| devtool                 | 含义                                                         |
| ----------------------- | ------------------------------------------------------------ |
| 空                      | 不生成 Source Map                                            |
| eval                    | 每个 module 会被封装到 eval 里包裹起来执行，并且会在每个 eval 语句的末尾追加注释 //# sourceURL=webpack:///./main.js |
| source-map              | 会额外生成一个单独的 Source Map 文件，并且会在 JavaScript 文件的末尾追加 //# sourceMappingURL=bundle.js.map |
| hidden-source-map       | 和 source-map 类似，但不会在 JavaScript 文件的末尾追加 //# sourceMappingURL=bundle.js.map |
| inline-source-map       | 和 source-map 类似，但不会额外生成一个单独的 Source Map 文件，而是将 Source Map 转换成 base64 编码内嵌到 JavaScript 文件中 |
| eval-source-map         | 和 eval 类似，但会将每个模块的 Source Map 转换成 base64 编码内嵌到 eval 语句的末尾，例如 //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIj... |
| cheap-source-map        | 和 source-map 类似，但生成的 Source Map 文件中没有列信息，因此生成速度更快 |
| cheap-module-source-map | 和 cheap-source-map 类似，但会包含 Loader 生成的 Source Map  |

其实以上表格只列举了 devtool 可能取值的一部分，它的取值可以由 source-map、eval、inline、hidden、cheap、module 这 6 个关键字随意组合而成。这 6 个关键字中的每一个都代表一种特性，它们的含义分别如下。

- eval：用 eval 语句包裹需要安装的模块。
- source-map：生成独立的 Source Map 文件。
- hidden：不在 JavaScript 文件中指出 Source Map 文件的所在，这样浏览器就不会自动加载 Source Map。
- inline：将生成的 Source Map 转换成 base64 格式内嵌在 JavaScript 文件中。
- cheap：在生成的 Source Map 中不会包含列信息，这样计算量更小，输出的 Source Map 文件更小；同时 Loader 输出的 Source Map 不会被采用。
- module：来自 Loader 的 Source Map 被简单处理成每行一个模块。

## 1. 该如何选择

Devtool 配置项提供的这么多选项看似简单，却让很多人弄不明白它们之间的差别和应用场景。如果不关心细节和性能，只是想在不出任何差错的情况下调试源码，则可以直接设置成 source-map，但这样会造成以下两个问题。

- 在 source-map 模式下会输出质量最高且最详细的 Source Map，这会造成构建速度缓慢，特别是在开发过程中需要频繁修改时会增加等待时间。
- 在 source-map 模式下会将 Source Map 暴露，若构建发布到线上的代码的 Source Map 暴露，就等同于源码被泄露。

为了解决以上两个问题，可以这样做，如下所述。

- 在开发环境下将 devtool 设置成 cheap-module-eval-source-map，因为生成这种 Source Map 的速度最快，能加速构建。由于在开发环境下不会做代码压缩，所以在 Source Map 中即使没有列信息，也不会影响断点调试。
- 在生产环境下将 devtool 设置成 hidden-source-map，意思是生成最详细的 Source Map，但不会将 Source Map 暴露出去。由于在生产环境下会做代码压缩，一个 JavaScript 文件只有一行，所以需要列信息。

在生产环境下通常不会将 Source Map 上传到 HTTP 服务器让用户获取，而是上传到 JavaScript 错误收集系统，在错误收集系统上根据 Source Map 和收集到的 JavaScript 运行错误堆栈，计算出错误所在源码的位置。

不要在生产环境下使用 inline 模式的 Source Map，因为这会使 JavaScript 文件变得很大，而且会泄露源码。

## 2. 加载现有的 Source Map

某些从 Npm 安装的第三方模块是采用 ES6 或者 TypeScript 编写的，它们在发布时会同时带上编译出来的 JavaScript 文件和对应的 Source Map 文件，以方便我们在使用它们出问题时进行调试。

在默认情况下，Webpack 是不会加载这些附加的 Source Map 文件的，Webpack 只会在转换的过程中生成 Source Map。为了让 Webpack 加载这些附加的 Source Map 文件，我们需要安装 source-map-loader（https://github.com/webpack-contrib/source-map-loader）。使用方法如下：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        // 只加载我们关心的目录下的 Source Map，以提升构建速度
        include: [path.resolve(root, 'node_modules/some-components/')],
        use: ['source-map-loader'],
        // 要将 source-map-loader 的执行顺序放到最前面，如果在 source-map-loader 之前有 Loader 转换了该 JavaScript 文件，就会导致 Source Map 映射错误
        enforce: 'pre'
      }
    ]
  }
};
```

由于 source-map-loader 在加载 Source Map 时计算量很大，因此要避免让该 Loader 处理过多的文件，不然会导致构建速度缓慢。我们通常会采用 include 去命中自己关心的文件。

再安装新引入的依赖：

```bash
npm i -D source-map-loader
```

重启 Webpack 后，就能在浏览器中调试 node_modules/some-components/ 目录下的源码了。

# 3.22 实战总结

在实际应用中，我们会遇到各种各样的需求，虽然在前面的小节中已经给出了应对大部分场景和需求的解决方案，但还是很难覆盖所有的可能性。所以我们需要有能力去分析遇到的问题，然后寻找对应的解决方案。我们可以按照以下思路分析和解决问题。

- 对所面临的问题本身要有所了解。例如在用 Webpack 构建 React 应用时，我们需要先掌握 React 的基础知识。
- 找出现在和目标之间的差异。例如在 React 应用的源码中用到了 JSX 语法和 ES6 语法，需要将源码转换成 ES5。
- 找出从现在到目标的可能路径。例如将新语法转换成 ES5 时，可以使用 Babel 转换源码。
- 寻找社区中现成的针对可能路径的 Webpack 集成方案。例如社区中已经有了 babel-loader。
- 如果找不到现成的方案，则说明自己的需求非常特别，这时就需要编写自己的 Loader 或者 Plugin 了。在第 5 章中会介绍如何编写它们。

在解决问题的过程中我们要拥有以下两个重要的能力。

- 通过一个知识尽可能多地联想到与其关联的知识，这有利于打通自己的知识体系，从经验中更快地得出答案。
- 善于使用搜索引擎去寻找自己所面临的问题，这有利于借助他人的经验更快地得出答案，而不是自己重新探索。

最重要的是需要多实战，自己去解决问题，这有利于加深理解，而不是只看不做。











