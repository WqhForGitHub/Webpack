// src/index.js
import "./style.css";

const app = document.getElementById("app");
app.innerHTML = `
  <h1 class="custom-font">Hello, 自定义字体！</h1>
  <p class="custom-font">The quick brown fox jumps over the lazy dog. 0123456789</p>
  <p>右键查看 Network 面板，可以看到字体文件被独立加载（fonts/...）</p>

  <h2>iconfont 示例（@font-face 自定义图标字体也可以这样打包）</h2>
  <i class="icon">&#xE001;</i>
`;
