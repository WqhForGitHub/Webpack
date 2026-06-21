// src/index.js
// 用于演示 loader pitch / normal 执行顺序的入口文件
// 真正的执行顺序日志在控制台（loaders 中 console.log）
// 打包产物里你会看到 a/b/c-loader 在 normal 阶段追加的注释（如果没有发生 pitch 熔断）

const app = document.getElementById("app");

const h1 = document.createElement("h1");
h1.textContent = "loader 执行顺序（pitch）Demo";

const p = document.createElement("p");
p.textContent =
  "请打开终端 / 浏览器控制台，并查看构建产物以观察 loader 执行顺序。";

app.appendChild(h1);
app.appendChild(p);

console.log("[index.js] 已加载");
