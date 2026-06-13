# 31. 图片压缩 loader

自定义一个图片压缩 loader，结合 webpack 5 的 `asset/resource` 实现「打包时自动压缩 png/jpg」。

## 关键点

- **raw loader**：`module.exports.raw = true`，让 loader 接收 Buffer 而不是字符串
- **异步 loader**：使用 `this.async()` + `cb(err, buf)`
- **借助 sharp**：对 png 走 `png({ quality })`，jpg 走 `jpeg({ quality, mozjpeg: true })`
- **仅生产模式压缩**：开发模式下跳过，加快热更新

## 使用

1. `npm install`
2. 把任意 jpg/png 放到 `src/images/`
3. `npm run build`

控制台会打印每张图压缩前后的字节数：

```
[image-compress-loader] photo.jpg 524288 -> 184230 bytes (省 64.9%)
```
