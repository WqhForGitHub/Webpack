// 入口：导入 SCSS，由 sass-loader → css-loader → style-loader 串联处理
import "./style.scss";

const root = document.getElementById("app");
root.innerHTML = `
  <h2 class="title">Hello Sass</h2>
  <div class="card">
    <p class="desc">这是来自 SCSS 的样式：变量、嵌套、mixin 都可以使用。</p>
  </div>
`;
