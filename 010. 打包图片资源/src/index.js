// src/index.js
import "./style.css";
import bigImage from "./images/big.png"; // 大图：会输出独立文件
import smallIcon from "./images/small.svg"; // 小图：可能被内联

const app = document.getElementById("app");
app.innerHTML = `
  <h1>打包图片资源 Demo</h1>

  <h2>1. 通过 import 引入图片（asset 自动判定）</h2>
  <img src="${bigImage}" alt="big" />
  <p>大图 URL: <code>${bigImage}</code></p>

  <img src="${smallIcon}" alt="icon" />
  <p>小图 URL（可能是 data:）: <code>${smallIcon.slice(0, 60)}...</code></p>

  <h2>2. 通过 CSS background 引入图片</h2>
  <div class="bg-box"></div>
`;
