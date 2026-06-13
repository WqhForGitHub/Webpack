// src/index.js
// 通过自定义 csv-loader 把 .csv 当作对象数组导入
import users from "./users.csv";

console.log("[csv-loader] users 类型:", typeof users, Array.isArray(users));
console.log("[csv-loader] 数据:", users);

const app = document.getElementById("app");

const table = document.createElement("table");
table.border = "1";
table.cellPadding = "6";

if (users.length > 0) {
  // 表头
  const thead = document.createElement("thead");
  const trh = document.createElement("tr");
  Object.keys(users[0]).forEach((k) => {
    const th = document.createElement("th");
    th.textContent = k;
    trh.appendChild(th);
  });
  thead.appendChild(trh);
  table.appendChild(thead);

  // 表体
  const tbody = document.createElement("tbody");
  users.forEach((row) => {
    const tr = document.createElement("tr");
    Object.values(row).forEach((v) => {
      const td = document.createElement("td");
      td.textContent = String(v);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
}

app.appendChild(table);
