// src/index.js —— 通过多个动态 import 主动制造多个 chunk
import(/* webpackChunkName: "page-a" */ "./pages/page-a").then((m) => m.run());
import(/* webpackChunkName: "page-b" */ "./pages/page-b").then((m) => m.run());
import(/* webpackChunkName: "page-c" */ "./pages/page-c").then((m) => m.run());
import(/* webpackChunkName: "page-d" */ "./pages/page-d").then((m) => m.run());
import(/* webpackChunkName: "page-e" */ "./pages/page-e").then((m) => m.run());

console.log("entry loaded");
