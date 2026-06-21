// src/index.js
import { foo } from "./foo";

const app = document.getElementById("app");
app.innerHTML = `
  <h1>include / exclude Demo</h1>
  <p>babel-loader 仅作用于 <code>src/</code> 下的 JS（include），并排除 node_modules（exclude）。</p>
  <pre id="out"></pre>
`;
document.getElementById("out").textContent = JSON.stringify(foo("hello"), null, 2);
