// src/index.js
// 演示 4 种 asset module 类型
import logoPng from "./assets/logo.png"; // asset/resource —— 得到 URL
import iconSvg from "./assets/icon.svg"; // asset/inline —— 得到 DataURL
import readmeText from "./assets/readme.txt"; // asset/source —— 得到字符串

const app = document.getElementById("app");
app.innerHTML = `
  <h1>Asset Modules（替代 file-loader / url-loader / raw-loader）</h1>

  <h2>asset/resource（独立文件，返回 URL）</h2>
  <img src="${logoPng}" alt="logo" style="height:80px" />
  <p>URL: <code>${logoPng}</code></p>

  <h2>asset/inline（内联 DataURL）</h2>
  <img src="${iconSvg}" alt="icon" style="height:48px" />

  <h2>asset/source（作为字符串导入）</h2>
  <pre>${readmeText}</pre>
`;
