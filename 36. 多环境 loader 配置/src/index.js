// src/index.js
// 同一份代码，dev / prod 下 CSS 处理方式不同：
//   - dev：style-loader 把 CSS 注入 <style>
//   - prod：mini-css-extract-plugin.loader 抽离为独立 .css
import "./style.css";

const app = document.getElementById("app");
app.innerHTML = `
  <h1>多环境 loader 配置 Demo</h1>
  <div class="box">
    <p>当前模式（构建时）：${process.env.NODE_ENV || "development"}</p>
    <p>开发：style 注入到 head；生产：单独 .css 文件被 link 引入。</p>
  </div>
`;
