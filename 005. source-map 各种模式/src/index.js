// src/index.js
import { divide } from "./utils/math.js";

// 故意制造一个运行时错误便于在浏览器中测试 source-map 是否能正确定位源码
function buggyFunction() {
  // 在浏览器控制台调用 buggyFunction() 即可触发
  return divide(10, 0);
}

window.buggyFunction = buggyFunction;

document.getElementById("app").innerHTML = `
  <h1>Source Map Demo</h1>
  <p>打开浏览器控制台，输入 <code>buggyFunction()</code> 触发错误，观察堆栈是否指向源码</p>
`;
