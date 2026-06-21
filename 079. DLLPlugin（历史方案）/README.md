# 79. DLLPlugin（历史方案）

纯 webpack 演示 DLLPlugin —— 把第三方库预编译为 DLL，跳过主构建对它们的处理。

## 文件结构

```
.
├── webpack.dll.config.js   # 第一步：生成 dll/vendors.dll.js + vendors-manifest.json
├── webpack.config.js       # 第二步：主构建，引用上一步生成的 manifest
├── src/index.js
└── index.html
```

## 运行

```bash
npm install
npm run build:all
# 等价：先 npm run build:dll，再 npm run build
```

打开 `dist/index.html`：

- HTML 中会自动注入 `<script src="dll/vendors.dll.js">`
- 主 bundle `main.xxx.js` 中不包含 lodash / jquery 源码
- 打开 DevTools 应能看到 jQuery 已生效

## 核心 API

| 配置                 | 作用                                                          |
| -------------------- | ------------------------------------------------------------- |
| `DllPlugin`          | 用在 dll 配置中：导出 manifest（描述哪些模块在 DLL 里）       |
| `DllReferencePlugin` | 用在主配置中：读取 manifest，把这些模块当作外部已加载的依赖   |
| `output.library`     | DLL 暴露的全局变量名，需要和 `DllPlugin.name` 保持一致         |

## 为什么称为「历史方案」

- webpack 5 自带 `cache.type='filesystem'`，覆盖了 DLLPlugin 大部分加速场景
- Module Federation 提供了更现代的运行时共享方案
- DLLPlugin 配置繁琐、需要额外维护两份 webpack 配置，故新项目较少使用
