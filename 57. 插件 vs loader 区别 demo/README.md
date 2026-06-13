# 57. 插件 vs loader 区别 demo

## 核心区别
| 维度 | Loader | Plugin |
|------|--------|--------|
| 工作粒度 | 单个文件（source-in / source-out） | 整个构建生命周期 |
| 作用阶段 | 模块加载阶段（解析时） | 任意阶段（compile / emit / done...） |
| API 形态 | 普通函数：`function(source) { return newSource }` | 类：`apply(compiler)`，注册 hook |
| 能拿到的资源 | 只有当前文件内容 | compiler / compilation / 所有 assets |
| 典型场景 | `babel-loader` 转译 ES6、`css-loader` 处理 @import | `HtmlWebpackPlugin` 生成 HTML、`DefinePlugin` 注入变量 |

## 一句话理解
> **Loader 是「翻译官」**：把一种文件翻译成 webpack 能识别的 JS。
> **Plugin 是「项目经理」**：在整条流水线上指手画脚，做任何"系统级"的事。

## 本 demo 同时演示
1. `loaders/upper-loader.js`
   - 把 `.txt` 内容全部转大写
   - 只关心「单文件」
2. `plugins/file-list-plugin.js`
   - 在 `emit` 钩子中读取所有 assets
   - 生成一份 `dist/filelist.md` 清单
   - 关心「全局产物」

## 运行
```bash
npm install
npm run build
```
查看 `dist/`：
- `bundle.js` 中包含大写后的文本
- `filelist.md` 列出了本次构建生成的文件清单
