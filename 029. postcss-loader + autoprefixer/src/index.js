// 入口：导入 CSS 后，由 postcss-loader 处理 -> autoprefixer 自动加前缀
import "./style.css";

const root = document.getElementById("app");
const box = document.createElement("div");
box.className = "box";
box.textContent = "Hover me";
root.appendChild(box);

console.log("打包后查看 dist 中的 CSS（通过 mini-css-extract-plugin 抽离会更直观），");
console.log("可以看到 user-select / linear-gradient 等属性已被加上前缀。");
