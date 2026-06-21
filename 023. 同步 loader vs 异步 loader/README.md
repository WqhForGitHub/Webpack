# 23. 同步 loader vs 异步 loader

> 纯 webpack 演示自定义 loader 的两种写法：**同步 loader**（直接 return / `this.callback`）和 **异步 loader**（`this.async()` + callback）。

## 目录结构

```
23. 同步 loader vs 异步 loader/
├─ loaders/
│  ├─ sync-upper-loader.js   # 同步 loader：把内容大写后导出
│  └─ async-delay-loader.js  # 异步 loader：延迟 N 毫秒后再返回结果
├─ public/index.html
├─ src/
│  ├─ index.js
│  ├─ hello.upper.txt        # 走 sync-upper-loader
│  └─ data.async.txt         # 走 async-delay-loader
├─ webpack.config.js
└─ package.json
```

## 安装与运行

```bash
cd "23. 同步 loader vs 异步 loader"
npm install
npm run build   # 打包到 dist
npm start       # devServer，浏览器自动打开 http://localhost:8095
```

构建过程中你可以在终端看到日志：

```
[sync-upper-loader] 同步 loader 开始执行 ...hello.upper.txt
[async-delay-loader] 异步 loader 开始执行（delay=200ms） ...data.async.txt
[async-delay-loader] 异步任务完成，回调 callback
```

## 同步 loader

写法上最简单：直接 `return` 字符串即可。

```js
module.exports = function (source) {
  // 1) 直接返回
  return transform(source);

  // 2) 或者用 this.callback（可以同时返回 sourceMap / meta）
  // this.callback(null, transform(source), sourceMap, meta);
  // return; // 用 callback 时必须 return
};
```

特点：

- 函数返回时，loader 才算完成
- 不能在异步任务（setTimeout / fs.readFile / fetch ...）的回调中返回结果——那样 webpack 拿不到值

本 demo 中的 `sync-upper-loader.js` 就是把 `.upper.txt` 内容立即转大写并 `return` 一段 ESM 默认导出代码。

## 异步 loader

当 loader 内部需要做异步 I/O（读文件、网络请求、数据库等）时，必须用异步写法：

```js
module.exports = function (source) {
  const callback = this.async(); // 1. 申请异步模式
  doAsyncWork(source, (err, result) => {
    if (err) return callback(err);
    callback(null, result); // 2. 异步完成时回调
  });
};
```

注意事项：

- `this.async()` 返回一个 callback，**必须最终调用一次**，否则 webpack 会一直等待，构建挂死
- 调用 `callback(err, content[, sourceMap, meta])`，签名与 `this.callback` 相同
- 在 callback 触发之前，pipeline 中的下一个 loader / 模块不会继续

本 demo 中的 `async-delay-loader.js` 用 `setTimeout` 模拟一个 200ms 的异步任务，完成后才回调 webpack。

## 同步 vs 异步对比

| 维度              | 同步 loader                      | 异步 loader                                  |
| ----------------- | -------------------------------- | -------------------------------------------- |
| 取值方式          | `return` 或 `this.callback`      | `this.async()` 拿到 callback，异步完成时调用 |
| 适用场景          | CPU 计算、字符串拼接、纯函数转换 | 文件 I/O、网络请求、外部进程、Worker         |
| 错误处理          | `throw` / `this.callback(err)`   | `callback(err)`                              |
| 是否阻塞 pipeline | 函数返回前阻塞                   | callback 调用前阻塞                          |
| 写法复杂度        | 简单                             | 多一步 `this.async()`                        |

## 观察方式

1. `npm run build`：终端按顺序打印同步 loader 和异步 loader 的日志，且“异步任务完成，回调 callback”一定在“异步 loader 开始执行”之后约 200ms 才出现。
2. 打开 `dist/js/bundle.*.js`，可以看到：
   - `hello.upper.txt` 模块的导出内容已经被转成大写
   - `data.async.txt` 模块的导出内容前面被加上了 `[async] ` 前缀
3. 浏览器页面会同时展示两段处理结果。
