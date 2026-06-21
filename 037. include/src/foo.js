// src/foo.js
// 故意写一些较新的 ES 语法，依赖 babel-loader 转换
export const foo = (msg = "foo") => {
  const obj = { msg, ts: Date.now() };
  return { ...obj, tag: "src/foo.js" };
};
