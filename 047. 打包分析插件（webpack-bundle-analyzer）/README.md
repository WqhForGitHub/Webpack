# 47. 打包分析插件（webpack-bundle-analyzer）

`webpack-bundle-analyzer` 用矩形树图（treemap）可视化打包产物，帮助：
- 找出体积最大的 npm 包
- 检查重复打包
- 评估 tree-shaking 效果

## 安装
```bash
npm install
```

## 三种 analyzerMode
| mode | 说明 |
| --- | --- |
| `server` | 默认，启动 http 服务在浏览器查看 |
| `static` | 生成 `report.html` 静态文件 |
| `disabled` | 不生成报告，配合 `generateStatsFile: true` 只输出 stats.json |

## 运行
普通打包（不生成报告）：
```bash
npm run build
```

打包并生成分析报告（dist/report.html + dist/stats.json，并自动打开浏览器）：
```bash
npm run analyze
```
