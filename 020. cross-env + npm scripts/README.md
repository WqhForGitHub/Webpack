# 20. cross-env + npm scripts

## 简介

通过 `cross-env` 在不同操作系统（Windows / macOS / Linux）下统一设置环境变量，再配合 webpack 的 `DefinePlugin` 实现「同一份代码、多套环境」。

## 启动

```bash
npm install

npm start            # NODE_ENV=development APP_ENV=local
npm run build:dev    # NODE_ENV=development APP_ENV=dev
npm run build:test   # NODE_ENV=production  APP_ENV=test
npm run build        # NODE_ENV=production  APP_ENV=prod
```

打开页面即可看到不同 `APP_ENV` 下的 `API_BASE`、`DEBUG` 等。

## 核心要点

1. Windows 下 `NODE_ENV=production` 这样的写法不被原生支持，`cross-env` 解决跨平台问题；
2. `webpack.config.js` 是 Node.js 文件，直接读取 `process.env.APP_ENV` 决定本次构建的配置；
3. 通过 `DefinePlugin` 把 Node 端的环境变量「复制」到浏览器代码中，运行时即可访问；
4. 建议把环境差异收敛到一个 `ENV_CONFIG` 对象中集中管理。
