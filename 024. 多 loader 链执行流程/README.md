# 24. 多 loader 链执行流程

演示 webpack 中针对单个模块配置多个 loader 时的执行顺序。

## 核心规则

`use: ['loader-a', 'loader-b', 'loader-c']`

- 执行顺序：**从右到左**（即 loader-c → loader-b → loader-a）
- 每个 loader 的输出会作为下一个 loader 的输入
- 链中最后一个执行的 loader 必须返回合法 JavaScript

## 运行

```bash
npm install
npm start
```

打开浏览器后查看控制台日志和页面，即可看到各 loader 的输入输出。
