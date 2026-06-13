// src/index.js
function helloWorld(name) {
  // 这条注释在压缩后会被移除
  console.log("hello " + name);
  console.debug("debug message"); // 会被 drop_console 移除
}

const unused = "I will be removed by tree-shaking / terser";

helloWorld("terser-webpack-plugin");
