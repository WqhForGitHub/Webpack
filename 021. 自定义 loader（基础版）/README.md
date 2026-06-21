# 21. 自定义 loader（基础版）

## 简介

演示如何编写本地自定义 loader（不发布到 npm）。本 demo 实现 3 个 loader：

| loader           | 作用                                              |
| ---------------- | ------------------------------------------------- |
| `banner-loader`  | 在每个 JS 文件顶部插入注释 banner                 |
| `replace-loader` | 按规则替换源码中的字符串/正则                     |
| `txt-loader`     | 把 `.txt` 文件作为字符串导入（类似 `raw-loader`） |

## 启动

```bash
npm install
npm start
npm run build
```

## 核心要点

1. **loader 本质**：`function (source) { return transformed; }`，输入是上游产物字符串/Buffer，输出是新的字符串/Buffer；
2. **执行顺序**：同一个 `use` 数组中，loader 从右往左、从下往上依次执行；
3. **读取 options**：`this.getOptions()`（webpack 5 推荐方式），并用 `schema-utils` 校验；
4. **本地 loader 路径解析**：通过 `resolveLoader.modules` 把本项目的 `loaders` 目录加入查找路径，`use: 'banner-loader'` 即可被识别；
5. **`this` 是 loader context**：可以使用 `this.resourcePath`、`this.async()`、`this.emitFile()` 等 API。

## 进阶方向

- 异步 loader（`const cb = this.async(); cb(null, result);`）
- Pitch loader（前置阶段拦截）
- 配合 `loader-utils`、SourceMap 透传
- 把 loader 拆分成独立 npm 包发布
