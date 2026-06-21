# 39. thread-loader 多线程

把 `babel-loader` 放到 worker 池中执行，提升大型项目构建速度。

## 关键点

```js
{
  test: /\.js$/,
  use: [
    { loader: "thread-loader", options: { workers: os.cpus().length - 1 } },
    { loader: "babel-loader", options: { cacheDirectory: true, ... } },
  ],
}
```

- `thread-loader` 必须放在数组最前面（处理顺序：从右到左执行 ⇒ thread-loader 最后被链接到 worker 通信器）。
- 仅对**重量级 loader**（babel / ts）有收益；轻量 loader 的进程通信开销可能拖慢构建。
- 建议配合 `cacheDirectory`：先命中缓存的文件不会再走 worker。

## 安装 / 运行

```bash
npm install
npm start
npm run build
```
