// src/index.js
// 直接 import CSS 文件 -> 由 css-loader 解析 -> 由 style-loader 注入 <style>
import "./style.css";

console.log("[CSS] 已通过 style-loader 注入到 <head>");
