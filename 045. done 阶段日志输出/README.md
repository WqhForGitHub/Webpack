# 45. done 阶段日志输出

`compiler.hooks.done` 钩子在每次构建完成后触发，回调参数是 `Stats` 对象，可以用来：

- 输出构建耗时
- 输出资源列表 / 大小
- 检查 `stats.hasErrors()` / `stats.hasWarnings()`
- 接入企业 IM（钉钉 / 飞书 / 企业微信）通知构建结果

## 运行
```bash
npm install
npm run build
```

控制台会打印一段自定义的构建摘要。
