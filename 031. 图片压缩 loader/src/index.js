// 入口：演示图片导入与压缩
//
// 这里通过 require.context 一次性加载 src/images 下的所有图片，
// 这样无论用户放入多少 png/jpg，都会自动经过 image-compress-loader 处理。
const ctx = require.context("./images", false, /\.(png|jpe?g)$/i);

const root = document.getElementById("app");
ctx.keys().forEach((key) => {
  const url = ctx(key);
  const wrap = document.createElement("div");
  wrap.style.cssText = "display:inline-block;margin:8px;text-align:center;";
  wrap.innerHTML = `
    <img src="${url}" style="max-width:240px;display:block;" />
    <p>${key}</p>
  `;
  root.appendChild(wrap);
});
