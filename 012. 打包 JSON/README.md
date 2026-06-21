# 12. 打包 JSON

## 简介

演示 webpack 5 内置对 JSON 文件的支持：

- 无需额外安装 `json-loader`
- 直接 `import data from './xxx.json'` 即可获得 JS 对象
- 内部使用 `type: 'json'` 资源类型

## 启动

```bash
npm install
npm start     # 开发模式
npm run build # 生产打包
```

## 核心要点

1. webpack 5 默认即支持 JSON 模块；
2. 在 `module.rules` 中可以显式声明 `{ test: /\.json$/, type: 'json' }`，效果与默认行为一致；
3. JSON 内容会作为静态对象被打包进 chunk，支持 Tree Shaking（仅当使用 `import { xxx } from` 形式访问命名属性，且开启 `optimization.usedExports` 时）。
