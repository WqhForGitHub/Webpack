// 入口文件：演示「px 自动换算成 rem」效果
import "./style.css";

// 简单写一个根字号自适应（屏幕宽度 / 10），方便观察 rem 在不同尺寸下的表现
function setRootFontSize() {
  const designWidth = 750; // 设计稿宽度
  const html = document.documentElement;
  const w = Math.min(html.clientWidth, designWidth);
  html.style.fontSize = (w / 10) + "px"; // 1rem = 屏宽 / 10
}
setRootFontSize();
window.addEventListener("resize", setRootFontSize);

const root = document.getElementById("app");
root.innerHTML = `
  <h2 class="title">px -> rem 自动转换</h2>
  <div class="box">300x150 (px in source)</div>
  <p>调整窗口宽度，盒子尺寸会随 html 根字号等比缩放。</p>
`;
