# 10. 打包图片资源

演示如何用 webpack 5 处理图片资源（PNG / JPG / GIF / WEBP / SVG）：

- JS 中 `import logo from './images/x.png'` —— 由 asset 模块处理
- CSS 中 `background-image: url('...')` —— 由 css-loader 解析路径后再交给 asset 模块
- 大图（>8KB）输出为独立文件到 `dist/images/`，文件名带 hash
- 小图（<8KB）自动 base64 内联，减少请求数

## 用法

```bash
npm install
npm start          # 开发模式
npm run build      # 生产打包，CSS 会被抽取为单独文件
```

## 关键配置

```js
{
  test: /\.(png|jpe?g|gif|webp|svg)$/i,
  type: 'asset',
  parser: { dataUrlCondition: { maxSize: 8 * 1024 } },
  generator: { filename: 'images/[name].[hash:8][ext]' },
}
```

- 使用 `output.assetModuleFilename` 设置全局默认资源命名
- 使用 `generator.filename` 针对单条规则覆盖
- 通过 `parser.dataUrlCondition.maxSize` 控制内联阈值
