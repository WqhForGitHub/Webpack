// src/render.js
export function render(text) {
  const el = document.getElementById("app");
  el.textContent = text + " @ " + new Date().toLocaleTimeString();
}
