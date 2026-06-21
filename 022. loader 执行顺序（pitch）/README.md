# 22. loader 执行顺序（pitch）

> 纯 webpack 演示自定义 loader 的两阶段执行模型：**pitch 阶段**（自上而下）+ **normal 阶段**（自下而上），以及 pitch 阶段的“熔断”行为。

## 目录结构

```
22. loader 执行顺序（pitch）/
├─ loaders/
│  ├─ a-loader.js      # pitch + normal，第一个 loader
│  ├─ b-loader.js      # pitch + normal，可通过 options.pitchBreak 触发熔断
│  └─ c-loader.js      # pitch + normal，最后一个 loader（最先 normal）
├─ public/index.html
├─ src/index.js
├─ webpack.config.js
└─ package.json
```

## 安装与运行

```bash
cd "22. loader 执行顺序（pitch）"
npm install
# 普通模式：观察 pitch 阶段 a -> b -> c，normal 阶段 c -> b -> a
npm run build
# 触发 b-loader pitch 熔断：c.pitch / 读源 / c.normal / b.normal 都被跳过
npx webpack --mode production --env pitchBreak
# 开发服务器
npm start
```

## 核心知识点

webpack 中每个 loader 都可以同时拥有：

- 一个 **normal 函数**：`module.exports = function (source) { ... }`
- 一个 **pitch 函数**：`module.exports.pitch = function (remainingRequest, precedingRequest, data) { ... }`

对配置：

```js
use: ["a-loader", "b-loader", "c-loader"];
```

实际执行顺序是：

```
a.pitch  -> b.pitch  -> c.pitch
                       ↓
                   读取源文件
                       ↓
a.normal <- b.normal <- c.normal
```

也就是：

- pitch 阶段：**从左到右 / 从上到下**（按 use 数组顺序）
- normal 阶段：**从右到左 / 从下到上**（与 use 数组逆序）

### 熔断（short-circuit）

如果某个 loader 的 `pitch` 返回了**非 undefined**的值：

- 后续 loader 的 pitch、对源文件的读取、以及后续 loader 的 normal 阶段全部被**跳过**
- 直接把该返回值作为已处理结果，**回退到前一个 loader 的 normal 阶段**继续执行

本 demo 中，开启 `--env pitchBreak` 后：

```
a.pitch  -> b.pitch (返回字符串，熔断)
a.normal <- 直接拿到 b.pitch 的返回值
```

控制台中只会看到 `[a-loader] pitch`、`[b-loader] pitch (pitchBreak=true)`、`[a-loader] normal` 三条日志。

## 观察方式

1. 普通模式 `npm run build`：终端依次打印
   ```
   [a-loader] pitch
   [b-loader] pitch
   [c-loader] pitch
   [c-loader] normal
   [b-loader] normal
   [a-loader] normal
   ```
2. 熔断模式 `npx webpack --env pitchBreak`：终端只打印
   ```
   [a-loader] pitch
   [b-loader] pitch (pitchBreak=true)
   [a-loader] normal
   ```
3. 打开 `dist/js/bundle.*.js`，可以在 `index.js` 模块对应代码末尾看到不同 loader 追加的注释；熔断模式下只剩下 b.pitch 返回的代码 + a 的注释。
