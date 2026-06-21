// src/index.js —— 一个故意制造体积的入口
import _ from "lodash";
import { heavyA } from "./heavy-a";
import { heavyB } from "./heavy-b";

console.log(_.chunk([1, 2, 3, 4, 5, 6], 2));
console.log(heavyA());
console.log(heavyB());

// 异步 chunk
import(/* webpackChunkName: "lazy-feature" */ "./lazy-feature").then((m) => {
  m.run();
});
