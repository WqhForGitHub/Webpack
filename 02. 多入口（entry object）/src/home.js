// src/home.js
// home 页入口
import { greet } from "./utils/common.js";

console.log(greet("Home"));

const root = document.getElementById("app");
if (root) {
  root.innerHTML = "<h1>Home Page</h1><p>这是 home 入口的产物</p>";
}
