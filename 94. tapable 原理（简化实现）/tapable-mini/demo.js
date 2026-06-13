// tapable-mini/demo.js
// 演示 5 种 hook 的行为
const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  AsyncSeriesHook,
  AsyncParallelHook,
} = require("./index");

console.log("=== SyncHook ===");
const sync = new SyncHook(["name"]);
sync.tap("a", (n) => console.log("a:", n));
sync.tap("b", (n) => console.log("b:", n));
sync.call("webpack");

console.log("\n=== SyncBailHook ===");
const bail = new SyncBailHook(["x"]);
bail.tap("a", () => console.log("a 执行"));
bail.tap("b", () => {
  console.log("b 执行 -> bail");
  return "STOP";
});
bail.tap("c", () => console.log("c 不会执行"));
console.log("结果:", bail.call(1));

console.log("\n=== SyncWaterfallHook ===");
const wf = new SyncWaterfallHook(["v"]);
wf.tap("+1", (v) => v + 1);
wf.tap("*2", (v) => v * 2);
wf.tap("-3", (v) => v - 3);
console.log("结果:", wf.call(10)); // (10+1)*2-3 = 19

console.log("\n=== AsyncSeriesHook ===");
const series = new AsyncSeriesHook(["v"]);
series.tapAsync("a", (v, cb) => {
  setTimeout(() => {
    console.log("a", v);
    cb();
  }, 100);
});
series.tapAsync("b", (v, cb) => {
  setTimeout(() => {
    console.log("b", v);
    cb();
  }, 100);
});
series.callAsync("hi", () => {
  console.log("series done");

  console.log("\n=== AsyncParallelHook ===");
  const par = new AsyncParallelHook(["v"]);
  par.tapAsync("a", (v, cb) => {
    setTimeout(() => {
      console.log("a", v);
      cb();
    }, 200);
  });
  par.tapAsync("b", (v, cb) => {
    setTimeout(() => {
      console.log("b", v);
      cb();
    }, 100);
  });
  const t = Date.now();
  par.callAsync("go", () => {
    console.log("parallel done in", Date.now() - t, "ms");
  });
});
