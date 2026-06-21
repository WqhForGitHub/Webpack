// src/index.js
import { add } from "./utils/math.js";
import { unusedFn } from "./utils/unused.js"; // production 下应被 tree-shaking 移除

const result = add(1, 2);

if (process.env.NODE_ENV === "development") {
  console.log("[dev] 正在开发环境运行");
} else if (process.env.NODE_ENV === "production") {
  console.log("[prod] 正在生产环境运行");
} else {
  console.log("[none] 没有指定 mode");
}

document.getElementById("app").innerHTML = `1 + 2 = ${result}`;
