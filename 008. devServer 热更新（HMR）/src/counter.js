// src/counter.js —— 一个带状态的计数器组件，用于直观感受 HMR：
// 状态在 HMR 时不会丢失（因为我们只替换了 counter 模块，没有刷新页面）
let count = 0;

export function mount(container) {
  container.innerHTML = `
    <h1>HMR 计数器（修改本文件试试）</h1>
    <p>当前 count = <span id="count">${count}</span></p>
    <button id="add">+1</button>
    <button id="reset">重置</button>
  `;

  container.querySelector("#add").addEventListener("click", () => {
    count += 1;
    container.querySelector("#count").textContent = count;
  });

  container.querySelector("#reset").addEventListener("click", () => {
    count = 0;
    container.querySelector("#count").textContent = count;
  });
}
