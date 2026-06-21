const app = document.getElementById("app");
app.innerHTML = `
  <h1>compiler vs compilation</h1>
  <p>查看终端日志，观察 compiler 钩子（只触发一次）与 compilation 钩子（每次编译触发一次）的区别。</p>
  <p>提示：执行 <code>npm start</code> 后修改本文件，可以看到 compilation 计数累加。</p>
`;
