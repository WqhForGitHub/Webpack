// src/index.js
// 实验：tree shaking 仅对 ESM 有效；CommonJS 不能被摇掉
import { used as esmUsed } from "./esm-module";
import * as cjsModule from "./cjs-module";

console.log("ESM used:", esmUsed());
console.log("CJS used:", cjsModule.used());
