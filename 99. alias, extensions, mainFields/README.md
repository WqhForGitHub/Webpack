# 99. alias, extensions, mainFields

集中演示 webpack 三个最常用的 resolve 配置项：

- **alias**：路径别名（也可用于"包重定向"）
- **extensions**：自动补全的扩展名
- **mainFields**：解析 npm 包入口的字段顺序

## 目录结构

```
99. alias, extensions, mainFields/
├── src/
│   ├── index.js
│   ├── utils/
│   │   ├── math.js
│   │   └── format.js
│   └── shim/
│       └── old-lib.js          # alias "old-lib" 重定向到这里
├── node_modules/
│   └── demo-lib/
│       ├── package.json        # main / module / browser 三套入口
│       ├── index.cjs.js
│       ├── index.esm.js
│       └── index.browser.js
├── webpack.config.js
└── package.json
```

## 三种构建模式

```bash
npm install

# 默认：alias 启用 + mainFields=['browser','module','main']
npm run build
# -> dist-default/bundle.js

# 关闭 alias：'@' / 'old-lib' 都会解析失败
npm run build:no-alias
# -> 期望看到 webpack 报错：Module not found

# 强制使用 cjs 入口：mainFields = ['main']
npm run build:cjs
# -> bundle 中 demo-lib 来自 index.cjs.js
```

## 三个配置详解

### 1) alias

```js
alias: {
  '@': path.resolve(__dirname, 'src'),
  '@utils': path.resolve(__dirname, 'src/utils'),
  'old-lib': path.resolve(__dirname, 'src/shim/old-lib.js'),
}
```

- `@/utils/math` → `src/utils/math.js`
- `old-lib` 不是真实 npm 包，被 alias 拦截到 `src/shim/old-lib.js`，常用于：
  - 替换有问题的依赖
  - 做 polyfill / shim
  - 把重型依赖换成轻量版（如 `lodash` → `lodash-es`）

### 2) extensions

```js
extensions: ['.js', '.jsx', '.json']
```

- import `./utils/math` 时按 `.js` → `.jsx` → `.json` 顺序尝试
- 顺序敏感：先匹配的优先
- **建议把最常用的放在前面**，可以加快解析速度

### 3) mainFields

```js
mainFields: ['browser', 'module', 'main']  // 默认 (target=web)
```

| 字段     | 含义                          |
| -------- | ----------------------------- |
| browser  | 浏览器环境专用入口            |
| module   | ESM 入口（推荐，利于 tree shaking） |
| main     | 默认 CommonJS 入口（最古老）  |

`demo-lib` 同时声明了 3 个字段，本 demo 通过切换 `mainFields` 让你看到 bundle 中实际打进的是哪一个文件：

- `--env mode=cjs` → `mainFields: ['main']` → 命中 `index.cjs.js`
- 默认 → `mainFields: ['browser', 'module', 'main']` → 命中 `index.browser.js`

## 关键点

- **alias 是最强的"重定向"手段**，可以让任何 import 指向任何文件
- **extensions** 和 **mainFiles**、**modules** 一起组成 webpack 的"补全规则"
- **mainFields** 直接影响 tree shaking——如果包只暴露 `main`（CJS）入口，webpack 没法做 tree shaking
- 所有 resolve 配置最终都会被传给 [enhanced-resolve](https://github.com/webpack/enhanced-resolve) 这个底层库
