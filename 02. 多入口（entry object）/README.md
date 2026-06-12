# 02. 多入口（entry object）

纯 webpack 多入口打包 demo。`entry` 使用对象形式，每个 key 对应一个 chunk 名，value 对应入口文件。

## 目录结构

```
02. 多入口（entry object）/
├── src/
│   ├── home.js           # 入口 1
│   ├── about.js          # 入口 2
│   ├── contact.js        # 入口 3
│   └── utils/common.js   # 公共模块
├── home.html             # 引用 home.bundle.js
├── about.html            # 引用 about.bundle.js
├── contact.html          # 引用 contact.bundle.js
├── webpack.config.js
├── package.json
└── .gitignore
```

## 核心配置说明

```js
entry: {
  home: './src/home.js',
  about: './src/about.js',
  contact: './src/contact.js',
},
output: {
  filename: '[name].bundle.js',
}
```

- `entry` 为对象时即多入口；key 即 `[name]` 占位符的值
- `output.filename` 必须使用 `[name]` 等占位符，否则多入口会冲突报错
- 每个入口会生成独立的 chunk，默认共同依赖会被各自打包（不分离）

## 使用方式

```bash
npm install
npm run build
```

打包完成后 `dist/` 目录下会生成：

- `home.bundle.js`
- `about.bundle.js`
- `contact.bundle.js`

分别用浏览器打开 `home.html` / `about.html` / `contact.html` 查看效果。

## 关键点

- 多入口适合 MPA（多页应用）场景
- 公共模块默认会被重复打包，需要 `optimization.splitChunks` 才能抽离
- 输出 filename 必须用 `[name]` 占位符
