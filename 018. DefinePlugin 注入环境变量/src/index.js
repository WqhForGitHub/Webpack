// src/index.js
// 这些「全局常量」实际上不是运行时变量，而是编译时被字面量替换
// 因此对 if (__IS_PROD__) 这类分支，未命中分支可被压缩工具进一步消除（dead code elimination）

const app = document.getElementById("app");

const lines = [
  `process.env.NODE_ENV = ${process.env.NODE_ENV}`,
  `__APP_VERSION__ = ${__APP_VERSION__}`,
  `__BUILD_TIME__   = ${__BUILD_TIME__}`,
  `__IS_PROD__      = ${__IS_PROD__}`,
  `__FEATURE_FLAGS__ = ${JSON.stringify(__FEATURE_FLAGS__)}`,
];

const ul = document.createElement("ul");
lines.forEach((text) => {
  const li = document.createElement("li");
  li.textContent = text;
  ul.appendChild(li);
});
app.appendChild(ul);

if (__IS_PROD__) {
  console.log("[prod] 走生产分支");
} else {
  console.log("[dev] 走开发分支，可以打开调试日志");
}
