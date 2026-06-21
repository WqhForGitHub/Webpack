# 80. Module Federation（微前端）

纯 webpack 5 内置的 `ModuleFederationPlugin` 实现微前端模块共享。

## 结构

```
.
├── remote/        # 暴露 Button、utils 模块
│   ├── webpack.config.js
│   ├── index.html
│   └── src/
└── host/          # 通过 import('remote_app/Button') 动态加载
    ├── webpack.config.js
    ├── index.html
    └── src/
```

## 运行

需要两个终端：

```bash
# 终端 1：启动 remote（端口 3001）
npm install
npm run start:remote

# 终端 2：启动 host（端口 3000）
npm run start:host
```

浏览器打开 `http://localhost:3000`：

- Host 页面会动态加载 `http://localhost:3001/remoteEntry.js`
- 渲染出来自 remote 的按钮，点击弹出 alert
- 控制台输出 `Hello, host!`（来自 remote 的 utils.js）

## 关键 API

| 角色   | 字段       | 含义                                                       |
| ------ | ---------- | ---------------------------------------------------------- |
| remote | `name`     | 远程容器全局名（host 通过此名引用）                        |
| remote | `filename` | 暴露入口清单（约定 `remoteEntry.js`）                       |
| remote | `exposes`  | `{ 对外名: 本地路径 }` 暴露模块                            |
| host   | `remotes`  | `{ 本地别名: 'name@url' }` 引用远程容器                    |
| 双方   | `shared`   | 共享依赖（如 react/vue），实现单例运行（本 demo 未演示）   |

## 与 DLLPlugin 的差异

- DLLPlugin 是「构建期」共享，需要双构建配置且不能跨应用共享
- Module Federation 是「运行期」共享，应用可独立部署、独立升级
- 真正解决「微前端代码共享」的问题
