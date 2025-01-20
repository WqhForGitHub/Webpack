* **`减少打包时间`**：**`缩减范围`**、**`缓存副本`**、**`定向搜索`**、**`提前构建`**、**`并行构建`**、**`可视结构`**
* **`减少打包体积`**：**`分割代码`**、**`摇树优化`**、**`动态垫片`**、**`按需加载`**、**`作用提升`**、**`压缩资源`**





## 减少打包时间



### 缩减范围

**`配置 include / exclude 减小 Loader 对文件的搜索范围`**，好处是 **`避免不必要的转译`**。

**`node_modules`** 文件夹的体积这么大，那得增加多少时间成本去检索所有文件？

**`include / exclude`** 通常在各大 **`Loader`** 中配置， **`src`** 文件夹通常作为源码目录，可做以下处理。

当然 **`include / exclude`** 可根据实际情况修改。

```javascript
export default {
    module: {
        rules: [
            {
                exclude: /node_modules/,
                include: /src/,
                test: /\.js$/,
                use: "babel-loader"
            }
        ]
    }
}
```





### 缓存副本

**`配置 cache 缓存 Loader 对文件的编译副本`**，好处是 **`再次编译时只编译变动的文件`**。未变动的文件干嘛要随着变动的文件重新编译？

很多 **`Loader / Plugin`** 都会提供一个可用编译缓存的选项，通常包括 **`cache`** 字眼。以 **`babel-loader`** 与 **`eslint-webpack-plugin`** 为例。

```javascript
export default {
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true
                        }
                    }
                ]
            }
        ]
    }
}
```





### 定向搜索

**`配置 resolve 提高文件的搜索速度`**，好处是 **`定向指定所需文件路径`**。若某些第三方库以默认形式引用可能报错或希望程序自动索引指定类型文件都可通过该方式解决。

**`alias`** 表示映射路径， **`extensions`** 表示文件后缀， **`noParse`** 表示过滤无依赖文件。通常配置 **`alias`** 与 **`extensions`** 就足够。

```javascript
export default {
    resolve: {
        alias: {
            "@": "src"
        },
        extensions: [".js", ".ts", ".jsx", ".tsx", ".json", ".vue"] // 导入模块省略后缀
    }
}
```





### 提前构建

**`配置 DllPlugin 将第三方依赖提前打包`**，好处是 **`将 DLL 与业务代码完全分离且每次只构建业务代码`**。

**`DLL`** 意为 **`动态链接库`**，指一个可由多个程序同时使用的代码库。在前端领域中可认为是另类缓存的存在，它把公共代码打包为 **`dll 文件`** 并存放到硬盘中，再次构建时动态链接 **`dll 文件`** 就无需再次打包那些公共代码，以提升构建速度，减少打包时间。







### 并行构建

**`配置 Thread 将 Loader 单进程转换为多进程`**，好处是 **`释放 CPU 多核并发的优势`**。在使用 **`webpack`** 构建项目时会有大量文件需解析与处理，构建过程是计算密集型的操作，随着文件增多会使构建过程变得越慢。

在此需要注意一个问题，若项目文件不算多就不要使用该 **`性能优化建议`**，毕竟开启多个线程也会存在性能开销。

```javascript
module.exports = {
  // ... other configurations ...
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: 2, // 使用的 worker 数量，根据你的 CPU 核心数调整
              poolTimeout: 2000 // worker 空闲超时时间 (ms)，设置为 Infinity 可避免 worker 关闭
            }
          },
          {
            loader: 'babel-loader',
            options: {
              // babel-loader 配置
            }
          }
        ]
      },
      // ... other rules ...
    ]
  }
};
```





### 可视结构

**`配置 BundleAnalyzer 分析打包文件结构`**，好处是 **`找出导致体积过大的原因`**。通过分析原因得出优化方案减少打包时间。 **`BundleAnalyzer`** 是 **`webpack`** 官方插件，可直观分析 **`打包文件`** 的模块组成部分、模块体积占比、模块包括关系、模块依赖关系、文件是否重复、压缩体积对比等可视化数据。

可用 **`webpack-bundle-analyzer`** 配置，有了它就能快速找出相关问题。

```javascript
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

export default {
    plugins: [
        BundleAnalyzerPlugin()
    ]
}
```





## 减少打包体积



### 分割代码

**`分割各个模块代码，提取相同部分代码`**，好处是 **`减少重复代码的出现频率`**。 **`webpack v4+`** 使用 **`splitChunks`** 替代 **`CommonsChunksPlugin`** 实现代码分割。





### 摇树优化

**`删除项目中未被引用代码`**，好处是 **`删除重复代码与未使用代码`**。

在 **`webpack`** 中只需将打包环境设置为 **`生产环境`** 就能让 **`摇树优化`** 生效，同时业务代码使用 **`ESM`** 编写，使用 **`import`** 导入模块，使用 **`export`** 导出模块。

```javascript
export default {
    mode: "production"
}
```





### 动态垫片





### 按需加载

**`将路由页面 / 触发性功能单独打包为一个文件，使用时才加载`**。好处是 **`减轻首屏渲染的负担`**。因为项目功能越多其打包体积越大，导致首屏渲染速度越慢。

```javascript
const Login = () => import("../../views/login");
const Logon = () => import("../../views/logon");
```



### 压缩资源

**`压缩 HTML / CSS / JS 代码，压缩字体 / 图像 / 音频 / 视频`**，好处是 **`更有效减少打包体积`**。极致地优化代码都有可能不及优化一个资源文件的体积更有效。

* **`压缩 CSS 代码`** ： **`css-minimizer-webpack-plugin`**
* **`压缩 ES6 版本中的 JS 代码`** ：**`terser-webpack-plugin`**

