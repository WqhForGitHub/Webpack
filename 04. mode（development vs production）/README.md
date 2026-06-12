# 04. mode（development vs production）

演示 webpack `mode` 的三种取值（`development` / `production` / `none`）的差异。

## 三种模式对比

| 选项                   | development   | production                      | none   |
| ---------------------- | ------------- | ------------------------------- | ------ |
| `process.env.NODE_ENV` | `development` | `production`                    | 未定义 |
| 代码压缩               | 否            | 是（TerserPlugin）              | 否     |
| Tree Shaking           | 否            | 是                              | 否     |
| Scope Hoisting         | 否            | 是（ModuleConcatenationPlugin） | 否     |
| Source Map（默认）     | `eval`        | 无                              | 无     |
| 模块路径               | 完整          | 数字 ID                         | 完整   |
| 调试体验               | 友好          | 不友好                          | 一般   |

## 目录结构

```
04. mode（development vs production）/
├── src/
│   ├── index.js
│   └── utils/
│       ├── math.js
│       └── unused.js     # 用于演示 tree-shaking
├── webpack.dev.config.js
├── webpack.prod.config.js
├── webpack.none.config.js
├── package.json
└── .gitignore
```

## 使用方式

```bash
npm install

# 三种模式分别构建
npm run build:dev
npm run build:prod
npm run build:none

# 一次性构建三种产物
npm run build:all
```

构建完成后产物分别在：

- `dist/dev/bundle.js`：源码可读，未压缩
- `dist/prod/bundle.js`：极小、被压缩混淆，`unused.js` 被移除
- `dist/none/bundle.js`：未做任何优化的原始 webpack 包裹代码

## 关键点

- `mode` 是 webpack 4+ 的核心约定，本质是开启一组默认 plugin
- `production` 默认会做：压缩、tree-shaking、scope hoisting、副作用分析
- `development` 默认更适合调试：保留模块路径、提供 `eval` source map
- `none` 表示不开启任何默认 plugin，需要手动配置
- 通过对比三个产物文件大小最直观（生产模式可能小一个数量级）
