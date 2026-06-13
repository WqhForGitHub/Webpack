// ESM 模块：使用 export，可被 tree shake
export function used() {
  return "ESM used function";
}

export function unusedA() {
  console.log("ESM unusedA");
  return "should be removed";
}

export function unusedB() {
  console.log("ESM unusedB");
  return Array.from({ length: 1000 }, (_, i) => i).join(",");
}

export const unusedConstant = "I should disappear after tree shaking";
