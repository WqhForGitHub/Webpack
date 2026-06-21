// src/about.js
// about 页入口
import { greet } from "./utils/common.js";

console.log(greet("About"));

const root = document.getElementById("app");
if (root) {
  root.innerHTML = "<h1>About Page</h1><p>这是 about 入口的产物</p>";
}
