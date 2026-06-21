// src/index.js
// 业务入口：渲染 message
import { render } from "./render";
import { message } from "./message";

render(message);

// ------ 简化版 HMR API ------
// 通过 webpack 提供的 module.hot 进行热替换
if (module.hot) {
  // 关注 ./message 模块的变化
  module.hot.accept("./message", () => {
    // 重新 require 拿到最新值
    const next = require("./message").message;
    console.log("[HMR] message 更新为:", next);
    render(next);
  });
}
