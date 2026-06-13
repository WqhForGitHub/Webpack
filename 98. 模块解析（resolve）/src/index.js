// src/index.js
// 体现 resolve 各种规则：

// 1) 省略扩展名 -> resolve.extensions
import { add } from "./utils/math";

// 2) 直接引用目录 -> resolve.mainFiles
import bag from "./bag";

// 3) 通过 modules: ['src', 'node_modules'] 直接 import 'tools/...'
import { upper } from "tools/format";

console.log(add(1, 2), bag.name, upper("hi"));
