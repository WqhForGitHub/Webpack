# 46. 自动生成文件插件

自定义插件 `AutoGenerateFilePlugin`，在 `compilation.hooks.processAssets` 阶段使用 `compilation.emitAsset(name, source)` 自动生成额外文件：

- `manifest.json`：资源清单
- `version.txt`：版本与构建时间
- `build-info.json`：构建摘要

## 关键 API
- `compiler.hooks.thisCompilation`：拿到当前 compilation
- `compilation.hooks.processAssets`：webpack5 推荐的 assets 处理钩子（替代 emit）
- `compilation.emitAsset(name, source)`：新增资源
- `webpack.sources.RawSource`：构造 Source 对象

## 运行
```bash
npm install
npm run build
```
