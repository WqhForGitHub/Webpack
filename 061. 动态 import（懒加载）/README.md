# 61. 动态 import（懒加载）

## 原理
webpack 编译时遇到 `import("./xxx")` 会：
1. 把目标模块（含其依赖）拆分为独立 **async chunk**
2. 主 bundle 中保留一段「runtime + jsonp 加载器」
3. 运行时调用 `import()` → 通过 `<script>` 动态插入 jsonp 脚本下载该 chunk
4. 下载完成后 resolve Promise，即可拿到模块导出

## 配置要点
```js
output: {
  filename: "js/[name].js",          // 主 chunk
  chunkFilename: "js/chunk-[name].js", // 异步 chunk
  publicPath: "/",                    // jsonp 加载路径前缀
}
```

## 代码
```js
btn.addEventListener("click", async () => {
  const mod = await import("./math.js"); // 仅在点击时才下载
  mod.add(1, 2);
});
```

## 验证懒加载
```bash
npm install
npm run build
npm run serve
# 浏览器打开 http://localhost:8080
# Network 面板：初次只看到 main.js
# 点击按钮：才会下载 chunk-xxx.js
```

## 优势
- 首屏 JS 体积降下来，更快可交互
- 不常用功能（弹窗 / 路由懒加载）按需加载
- 与 `import()` + 路由系统结合，是 SPA 性能优化的核心手段
