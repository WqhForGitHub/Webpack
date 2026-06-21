# 44. emit 阶段修改文件

`emit` 钩子是 webpack 把资源写入磁盘前的最后机会，此时 `compilation.assets` 是一个 `{ filename: Source }` 对象，可以：

- 修改已有文件内容（如添加 banner）
- 新增文件（如生成 `manifest.txt`）
- 删除文件（`delete compilation.assets[filename]`）

## 运行
```bash
npm install
npm run build
```

打包后查看 `dist/`：
- `bundle.js` 头部多了一行 banner 注释
- 新增了 `emit-extra.txt`
