# 09. Asset Modules（替代 file-loader / url-loader / raw-loader）

webpack 5 内置 4 种 **资源模块（Asset Modules）** 类型，无需安装额外 loader：

| `type`           | 行为                                             | 替代                     |
| ---------------- | ------------------------------------------------ | ------------------------ |
| `asset/resource` | 发出独立文件，模块导出 URL                       | `file-loader`            |
| `asset/inline`   | 转 DataURL 内联到 bundle                         | `url-loader`（一定内联） |
| `asset/source`   | 作为字符串导出                                   | `raw-loader`             |
| `asset`          | 自动在 resource / inline 间切换（默认 8KB 阈值） | `url-loader` + 阈值      |

## 用法

```bash
npm install
npm start         # 启动 devServer
npm run build     # 生产打包到 dist/
```

打开页面可看到：

- PNG 通过 `asset/resource` 输出到 `dist/images/...`
- SVG 通过 `asset/inline` 内联为 `data:image/svg+xml;base64,...`
- TXT 通过 `asset/source` 作为字符串渲染到 `<pre>` 中
- 字体（如有）走 `asset` 自动判定模式

## 关键配置

- `output.assetModuleFilename`：默认资源输出名规则
- `module.rules[].generator.filename`：单条规则覆盖默认命名
- `module.rules[].parser.dataUrlCondition.maxSize`：`asset` 类型的内联阈值
