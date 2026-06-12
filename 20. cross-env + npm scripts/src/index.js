// src/index.js
const app = document.getElementById("app");

const info = [
  ["NODE_ENV", process.env.NODE_ENV],
  ["APP_ENV", process.env.APP_ENV],
  ["API_BASE", __API_BASE__],
  ["DEBUG", String(__DEBUG__)],
];

const ul = document.createElement("ul");
info.forEach(([k, v]) => {
  const li = document.createElement("li");
  li.textContent = `${k} = ${v}`;
  ul.appendChild(li);
});

const h1 = document.createElement("h1");
h1.textContent = `当前环境：${process.env.APP_ENV}`;
app.appendChild(h1);
app.appendChild(ul);

if (__DEBUG__) {
  console.log("[debug] 调试模式开启");
}
