// loaders/image-compress-loader.js
// 自定义图片压缩 loader：
//   - raw = true：接收的是 Buffer（图片二进制）而非字符串
//   - 异步：调用 sharp 对图片重新编码 / 压缩
//   - 输出仍然是 Buffer，交给后面的 asset/resource 处理输出文件
//
// 选项：
//   options.quality  jpeg/webp 等有损格式的质量（1-100）
const path = require("path");
const sharp = require("sharp");

function imageCompressLoader(content) {
  const cb = this.async();
  const options = this.getOptions() || {};
  const quality = typeof options.quality === "number" ? options.quality : 70;

  const ext = (this.resourcePath.match(/\.([a-z0-9]+)$/i) || [])[1] || "";
  let pipeline = sharp(content);

  if (ext.toLowerCase() === "png") {
    // png 走有损量化压缩
    pipeline = pipeline.png({ quality, compressionLevel: 9 });
  } else {
    // jpg/jpeg：直接重设质量
    pipeline = pipeline.jpeg({ quality, mozjpeg: true });
  }

  pipeline
    .toBuffer()
    .then((buf) => {
      const before = content.length;
      const after = buf.length;
      const saved = (((before - after) / before) * 100).toFixed(1);
      console.log(
        `[image-compress-loader] ${path.basename(
          this.resourcePath
        )} ${before} -> ${after} bytes (省 ${saved}%)`
      );
      cb(null, buf);
    })
    .catch((err) => cb(err));
}

module.exports = imageCompressLoader;
// 必须声明 raw = true，告诉 webpack 输入是 Buffer
module.exports.raw = true;
