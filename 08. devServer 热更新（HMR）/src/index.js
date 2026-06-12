// src/index.js —— HMR 入口
import "./style.css";
import { mount } from "./counter";

mount(document.getElementById("app"));

// 关键：声明本模块对子模块 './counter' 的热替换接收逻辑
// 这样修改 counter.js 时，无需整页刷新即可看到更新
if (module.hot) {
  module.hot.accept("./counter", () => {
    console.log("[HMR] counter 模块已热替换");
    // 重新挂载新模块
    const { mount: nextMount } = require("./counter");
    nextMount(document.getElementById("app"));
  });
}
