# 98. 模块解析（resolve）

webpack 通过 `enhanced-resolve` 把 `import` / `require` 中的字符串解析成磁盘上的真实文件。本 demo 演示完整的解析流程与最常用的 4 个配置项。

## 解析流程（简化）

```
request: 'foo/bar'
  │
  ├─ 是相对路径？ (./, ../, /)
  │     是：path.resolve(context, request) 拼出绝对路径
  │
  ├─ 是绝对路径？
  │     是：直接用
  │
  └─ 否：当成 "模块名" 处理
        for dir in resolve.modules (默认 [node_modules]):
          for parent in 当前目录到根目录:
            尝试 parent/dir/foo/bar
        若是 npm 包：读 package.json 中 mainFields 指定字段

最终路径：
  ├─ 文件存在？ 直接用
  ├─ 否则按 resolve.extensions 顺序补全：x.js / x.jsx / x.json
  └─ 是目录？按 resolve.mainFiles 找入口（默认 index），再走扩展名
```

## 关键配置

| 配置项              | 作用                                     | 默认值                              |
| ------------------- | ---------------------------------------- | ----------------------------------- |
| `resolve.extensions` | 自动补全的扩展名                         | `['.js', '.json', '.wasm']`         |
| `resolve.modules`    | 查找模块的目录列表                       | `['node_modules']`                  |
| `resolve.mainFiles`  | 把目录解析成文件时尝试的"入口名"          | `['index']`                         |
| `resolve.mainFields` | 读取 npm 包入口的 `package.json` 字段顺序 | `['browser', 'module', 'main']` (web) |

## 目录结构

```
98. 模块解析（resolve）/
├── src/
│   ├── index.js
│   ├── utils/math.js   # 通过 ./utils/math 省略扩展名命中
│   ├── bag/main.js     # 通过 ./bag 目录 + mainFiles 命中
│   └── tools/format.js # 通过 modules: ['src', 'node_modules'] 命中
├── webpack.config.js
├── trace-resolve.js    # 用 enhanced-resolve 跑解析过程
└── package.json
```

## 运行

```bash
npm install

# 1) 通过 webpack 真实打包
npm run build

# 2) 单独追踪解析过程（不打包）
npm run trace
```

`npm run trace` 会输出三种 case 的解析结果：

```
./src/utils/math     (from .) -> src/utils/math.js
./bag                (from src) -> src/bag/main.js
tools/format         (from src) -> src/tools/format.js
```

## 关键点

- `resolve.extensions` 顺序敏感：先匹配的扩展名优先
- `resolve.modules` 写绝对路径会更快（避免逐级向上查找 node_modules）
- `resolve.mainFields` 决定 npm 包到底使用 ESM 入口还是 CJS 入口（影响 tree shaking）
- 99 号 demo 会进一步演示 `alias` 与 `mainFields` 的对比效果
