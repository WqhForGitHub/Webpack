// src/index.esm.js
// 使用 ES Module 导入，只用 add，其它应被全部删除

import { add } from "./utils.esm.js";

console.log("ESM add =", add(1, 2));
