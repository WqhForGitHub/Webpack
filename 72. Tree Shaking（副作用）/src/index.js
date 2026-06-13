// 入口文件
// 故意从 utils 中只引入 add，看看 sub / mul / heavyButUnused 会不会被删

import { add } from "./utils/math";
// 这行会触发 polyfill 副作用（被 sideEffects 数组保留）
import "./polyfill";

console.log("[index] add(2, 3) =", add(2, 3));
document.getElementById("app").textContent = "add(2,3) = " + add(2, 3);

// 注意：utils/log.js 整个文件未被引用，应被完全删除
