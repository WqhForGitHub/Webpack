// 入口：导入 .md 文件，由 markdown-loader 转换成 HTML 字符串
import html from "./doc.md";

const root = document.getElementById("app");
root.innerHTML = html;
