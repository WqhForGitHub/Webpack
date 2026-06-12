// src/home.js
const main = document.getElementById("app");
const p = document.createElement("p");
p.textContent = "这里是首页（home chunk）。";
main.appendChild(p);
console.log("[home] loaded");
