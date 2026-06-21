// import() 魔法注释（Magic Comments）演示
// 在 import() 调用中加入 /* webpackXxx: "value" */ 注释，
// webpack 会读取并据此生成对应行为的 chunk。

const btnUser = document.getElementById("btn-user");
const btnChart = document.getElementById("btn-chart");
const btnLodash = document.getElementById("btn-lodash");

// 1. webpackChunkName：自定义 chunk 文件名
btnUser.addEventListener("click", async () => {
  const mod = await import(
    /* webpackChunkName: "user-page" */ "./pages/user.js"
  );
  mod.render();
});

// 2. webpackPrefetch：浏览器空闲时预取
//    打包后会插入 <link rel="prefetch"> 到 HTML
btnChart.addEventListener("click", async () => {
  const mod = await import(
    /* webpackChunkName: "chart-page" */
    /* webpackPrefetch: true */
    "./pages/chart.js"
  );
  mod.render();
});

// 3. webpackPreload：与父 chunk 并行加载
btnLodash.addEventListener("click", async () => {
  const mod = await import(
    /* webpackChunkName: "lodash-utils" */
    /* webpackPreload: true */
    "./pages/lodash-utils.js"
  );
  mod.render();
});

console.log("entry loaded");
