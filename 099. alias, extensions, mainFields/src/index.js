// src/index.js

// 1) alias '@' 指向 src
import { add } from "@/utils/math"; // 等价于 import './utils/math'

// 2) alias '@utils'
import { upper } from "@utils/format";

// 3) alias 整包重定向（"old-lib" 不是真正的 npm 包，被 alias 拦到 shim）
import oldLib from "old-lib";

// 4) 真实 npm 包，用 mainFields 决定走哪个入口
import demoLib from "demo-lib";

console.log("add:", add(1, 2));
console.log("upper:", upper("hi"));
console.log("oldLib:", oldLib());
console.log("demoLib:", demoLib());
