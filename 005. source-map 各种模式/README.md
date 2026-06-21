# 05. source-map 各种模式

演示 webpack `devtool` 各种 source-map 模式之间的差异。通过 `--env devtool=xxx` 动态切换。

## devtool 速查表

| devtool                   | 是否产出 .map 文件 | 是否包含源码        | 是否定位行 | 是否定位列 | loader 后源码 | 适用环境         |
| ------------------------- | ------------------ | ------------------- | ---------- | ---------- | ------------- | ---------------- |
| `false`                   | 否                 | -                   | -          | -          | -             | 任意             |
| `eval`                    | 否（内嵌 eval）    | 是                  | 是         | 否         | 否            | 开发（最快）     |
| `source-map`              | 是（独立 .map）    | 是                  | 是         | 是         | 是            | 生产/开发        |
| `eval-source-map`         | 否（dataURL 内嵌） | 是                  | 是         | 是         | 是            | 开发             |
| `cheap-source-map`        | 是                 | 是                  | 是         | 否         | 否            | 开发             |
| `cheap-module-source-map` | 是                 | 是                  | 是         | 否         | 是            | 开发             |
| `inline-source-map`       | 否（dataURL 内嵌） | 是                  | 是         | 是         | 是            | 开发（产物巨大） |
| `hidden-source-map`       | 是（不引用）       | 是                  | 是         | 是         | 是            | 生产（仅上报）   |
| `nosources-source-map`    | 是                 | 否（仅文件名/行号） | 是         | 是         | 是            | 生产             |

记忆口诀（前缀含义）：

- `eval`：使用 `eval()` 包裹模块；最快，但定位精度差
- `cheap`：不包含列信息，体积更小、构建更快
- `module`：包含 loader 处理前的源码（否则是 loader 处理后的）
- `inline`：source map 内嵌进 bundle（dataURL）
- `hidden`：生成 .map 但 bundle 不引用（适合错误监控上报）
- `nosources`：只有文件名行号，没有源码内容（保护源码）

## 目录结构

```
05. source-map 各种模式/
├── src/
│   ├── index.js
│   └── utils/math.js
├── scripts/build-all.js     # 一键构建全部 devtool
├── webpack.config.js        # 通过 env.devtool 动态切换
├── index.html
├── package.json
└── .gitignore
```

## 使用方式

```bash
npm install

# 一键构建全部 9 种产物（推荐）
npm run build

# 也可以单独构建某一个
npm run build:eval
npm run build:source-map
npm run build:eval-source-map
npm run build:cheap-source-map
npm run build:cheap-module-source-map
npm run build:inline-source-map
npm run build:hidden-source-map
npm run build:nosources-source-map
npm run build:none
```

## 验证方法

1. 修改 `index.html` 中 `<script src="...">` 指向某个产物
2. 浏览器打开 `index.html`，控制台执行 `buggyFunction()`
3. 观察报错堆栈定位的是源码还是打包后的代码
4. 同时对比 `dist/<mode>/` 目录下产物大小、是否有 .map 文件、map 中是否含源码

## 关键点

- 开发环境推荐：`eval-cheap-module-source-map`（速度与定位平衡）或 `eval-source-map`
- 生产环境推荐：`source-map`（配合错误监控）或 `hidden-source-map` / `nosources-source-map`（保护源码）
- 切勿在生产环境使用 `eval` 系（CSP 不允许）
- `inline-source-map` 会让 bundle 体积暴涨，不要用于线上
