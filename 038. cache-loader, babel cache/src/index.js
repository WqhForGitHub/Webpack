import { heavy, utils } from "./utils";

const app = document.getElementById("app");
app.innerHTML = `
  <h1>Cache Demo</h1>
  <p>三层缓存：cache-loader + babel-loader cacheDirectory + webpack5 filesystem cache。</p>
  <pre>heavy() = ${heavy()}</pre>
  <pre>utils.spread(1,2,3,4,5) = ${utils.spread(1, 2, 3, 4, 5)}</pre>
`;
