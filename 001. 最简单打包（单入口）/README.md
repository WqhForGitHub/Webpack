# 01. 最简单打包（单入口）

纯 webpack 实现的最简单打包 demo，使用单入口配置，不引入任何 loader 与 plugin。

## 目录结构

```
01. 最简单打包（单入口）/
├── src/
│   ├── index.js          # 入口文件
│   └── utils/
│       └── math.js       # 工具模块（演示模块化合并）
├── index.html            # 页面入口（引用打包产物）
├── webpack.config.js     # webpack 配置
├── package.json
└── .gitignore
```

## 核心配置说明

`webpack.config.js`：

- `mode`：打包模式，`development` 不压缩、便于调试
- `entry`：单入口，指向 `./src/index.js`
- `output.path`：输出目录的绝对路径 `dist/`
- `output.filename`：打包产物文件名 `bundle.js`
- `output.clean`：每次打包前清空 `dist`（webpack 5 内置）

## 使用方式

1. 安装依赖

```bash
npm install
```

2. 执行打包

```bash
npm run build
```

打包完成后会在 `dist/` 目录下生成 `bundle.js`。

3. 查看效果

直接用浏览器打开根目录下的 `index.html` 即可。

## 关键点

- 单入口：`entry` 配置为字符串
- 模块化代码（`import` / `export`）会被 webpack 解析并合并到一个 `bundle.js`
- 不依赖 babel 等 loader，webpack 5 默认支持 ES Module 语法
