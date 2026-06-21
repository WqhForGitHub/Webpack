// src/about.js
const main = document.getElementById("app");
const p = document.createElement("p");
p.textContent = "这里是关于页（about chunk）。";
main.appendChild(p);
console.log("[about] loaded");
