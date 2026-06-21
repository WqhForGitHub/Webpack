// src/index.js
// 测试用源码：包含未使用代码、长变量名、注释，方便对比压缩效果

import { add, multiply, unusedFunction } from "./math";
import { greet } from "./greet";

// 这是一段较长的注释，在 production 模式应被删除
// 这里有大量空白和未压缩的代码

const aLongVariableName = 100;
const anotherLongVariableName = 200;

function calculateSomeResult(firstNumber, secondNumber) {
  const sumValue = add(firstNumber, secondNumber);
  const productValue = multiply(firstNumber, secondNumber);
  return {
    sum: sumValue,
    product: productValue,
  };
}

const finalResult = calculateSomeResult(aLongVariableName, anotherLongVariableName);

console.log("greet:", greet("Webpack"));
console.log("result:", finalResult);

// 未使用的导出、死代码（生产模式下应被 tree shake 掉）
if (false) {
  console.log("dead code");
  unusedFunction();
}
