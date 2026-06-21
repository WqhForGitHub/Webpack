// remote/src/Button.js
// 暴露给 Host 的组件（这里用原生 DOM 演示，不依赖框架）
export default function createButton(label = "remote") {
  const btn = document.createElement("button");
  btn.textContent = `[Remote] ${label}`;
  btn.style.cssText =
    "padding:8px 16px;background:#1976d2;color:#fff;border:none;border-radius:4px;cursor:pointer;";
  btn.onclick = () => alert(`Hello from remote! label=${label}`);
  return btn;
}
