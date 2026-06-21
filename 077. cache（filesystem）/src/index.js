// src/index.js
import { greet } from "./utils.js";
import data from "./data.js";

const arrowFn = (x) => x * 2;
const result = [1, 2, 3].map(arrowFn);

console.log(greet("filesystem cache"));
console.log("data length =", data.length);
console.log("result =", result);
