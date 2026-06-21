// src/utils/index.js —— 桶文件 barrel
export { add } from "./add";
export { mul } from "./mul";
export { sub } from "./sub";

// 此处导入了一个有副作用的模块（修改 globalThis）
import "./side-effect";
