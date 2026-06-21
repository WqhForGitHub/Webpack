// src/index.js
// 各种「死代码」示例，构建后应被全部删除

// 1. 永远不会进入的分支
if (false) {
  console.log("never executed - case 1");
  const arr = new Array(10000).fill("dead");
  console.log(arr.length);
}

// 2. 编译期常量替换 + DCE
// __DEV__ 被 DefinePlugin 替换为 false → terser 删除整个 if 块
if (__DEV__) {
  console.log("[DEV ONLY] verbose log, should be eliminated in prod");
}

// 3. 不可达代码（return 之后）
function calc(a, b) {
  return a + b;
  console.log("unreachable after return"); // eslint-disable-line
}

// 4. 编译期可计算的表达式
const useless = 1 + 2 + 3; // 可被折叠
const isFeatureX = process.env.FEATURE_X; // 替换为 false

if (isFeatureX) {
  console.log("Feature X path - dead");
}

// 5. 未使用的常量
const NEVER_USED = "I will be removed";

console.log("calc(1,2) =", calc(1, 2));
console.log("useless =", useless);
