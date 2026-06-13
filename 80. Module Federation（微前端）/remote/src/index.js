// remote/src/index.js
// 远程应用自身也能独立运行（开发模式访问 http://localhost:3001）
import { greet } from "./utils.js";
import createButton from "./Button.js";

document.body.innerHTML = `<h1>Remote app standalone</h1>`;
document.body.appendChild(createButton("standalone"));
console.log(greet("remote"));
