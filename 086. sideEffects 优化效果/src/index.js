// src/index.js
// 只导入 utils 中的 add 函数；如果 sideEffects=false，
// 整个 utils 中其他函数 + side-effect.js 都会被剔除
import { add } from "./utils";

console.log(add(1, 2));
