// src/index.js
// webpack 5 内置 JSON 解析：直接 import 即可拿到 JS 对象
import data from "./data.json";

const app = document.getElementById("app");
const list = document.createElement("ul");

data.users.forEach((user) => {
  const li = document.createElement("li");
  li.textContent = `${user.id} - ${user.name} (${user.role})`;
  list.appendChild(li);
});

const title = document.createElement("p");
title.textContent = `项目：${data.project}，版本：${data.version}`;

app.appendChild(title);
app.appendChild(list);

console.log("从 data.json 读取到：", data);
