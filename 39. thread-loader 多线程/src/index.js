import { a, Demo } from "./a";
import { b } from "./b";
import { c } from "./c";

const app = document.getElementById("app");
const d = new Demo("thread-loader");

app.innerHTML = `
  <h1>thread-loader Demo</h1>
  <p>babel-loader 通过 thread-loader 在多 worker 进程中并行执行。</p>
  <pre>a(1,2,3) = ${a(1, 2, 3)}</pre>
  <pre>${d.hello()}</pre>
  <pre>c = ${JSON.stringify(c)}</pre>
`;

b().then((arr) => console.log("[b()] 结果:", arr));
