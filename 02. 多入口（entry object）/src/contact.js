// src/contact.js
// contact 页入口
import { greet } from "./utils/common.js";

console.log(greet("Contact"));

const root = document.getElementById("app");
if (root) {
  root.innerHTML = "<h1>Contact Page</h1><p>这是 contact 入口的产物</p>";
}
