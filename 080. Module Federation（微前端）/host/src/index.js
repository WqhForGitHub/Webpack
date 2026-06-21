// host/src/index.js
// Host 通过动态 import 加载 remote 暴露出来的模块
// 使用 import() 是为了让 ModuleFederation 在运行时拉取 remoteEntry.js

const root = document.createElement("div");
root.innerHTML = `<h1>Host App</h1><p>下面这个按钮来自 remote_app：</p>`;
document.body.appendChild(root);

// 动态 import 触发远程模块加载
Promise.all([
  import("remote_app/Button"),
  import("remote_app/utils"),
]).then(([{ default: createButton }, { greet }]) => {
  document.body.appendChild(createButton("from-host"));
  console.log(greet("host"));
});
