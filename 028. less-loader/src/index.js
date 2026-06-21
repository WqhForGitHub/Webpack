// 入口：导入 LESS，由 less-loader → css-loader → style-loader 处理
import "./style.less";

const root = document.getElementById("app");
root.innerHTML = `
  <h2 class="title">Hello Less</h2>
  <div class="box">
    <p class="desc">这是来自 LESS 的样式：变量、嵌套、mixin 都已经支持。</p>
  </div>
`;
