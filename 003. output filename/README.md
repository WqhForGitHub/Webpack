# 03. output filename

演示 webpack `output.filename` 中常见占位符的差异。

## 占位符对比

| 占位符          | 含义             | 变更条件              | 适用场景               |
| --------------- | ---------------- | --------------------- | ---------------------- |
| `[name]`        | entry 的 key 名  | 入口名变化            | 基础多入口             |
| `[id]`          | chunk id（数字） | chunk 顺序变化        | 不推荐用于缓存         |
| `[fullhash]`    | 整次编译 hash    | 任意文件变化都会变    | 不推荐用于长缓存       |
| `[chunkhash]`   | chunk 内容 hash  | 该 chunk 内容变化才变 | JS 长缓存              |
| `[contenthash]` | 文件内容 hash    | 该文件内容变化才变    | 最适合 CSS / JS 长缓存 |

## 目录结构

```
03. output filename/
├── src/
│   ├── index.js
│   ├── vendor.js
│   └── utils/hello.js
├── webpack.config.js                # [name]
├── webpack.hash.config.js           # [fullhash]
├── webpack.chunkhash.config.js      # [chunkhash]
├── webpack.contenthash.config.js    # [contenthash]
├── package.json
└── .gitignore
```

## 使用方式

```bash
npm install

# 默认使用 [name]
npm run build

# 使用 [fullhash]
npm run build:hash

# 使用 [chunkhash]
npm run build:chunkhash

# 使用 [contenthash]
npm run build:contenthash
```

打包后查看 `dist/name`、`dist/hash`、`dist/chunkhash`、`dist/contenthash` 中产物文件名的不同。

## 关键点

- 多入口必须使用占位符，否则文件名冲突会报错
- 长缓存优先选 `[contenthash]`，因为它只与文件内容相关
- `[fullhash]`（webpack5 改名，原 `[hash]`）每次编译都会变，缓存效果差
- 占位符可以截取长度，如 `[contenthash:8]` 表示取前 8 位
