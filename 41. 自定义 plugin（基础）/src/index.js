const app = document.getElementById("app");
app.innerHTML = `
  <h1>自定义 Plugin（基础）</h1>
  <p>本次构建结束后，dist/ 中会多出一个 <code>filelist.md</code>，由我们自己写的 FileListPlugin 生成。</p>
`;
console.log("hello custom plugin");
