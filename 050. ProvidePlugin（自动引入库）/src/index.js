// src/index.js
// 注意：这里没有写 import $ from "jquery"
// 也没有写 import _ from "lodash"
// 但 ProvidePlugin 会自动注入

$("body").append("<h1>hello ProvidePlugin</h1>");

const arr = _.chunk([1, 2, 3, 4, 5, 6], 2);
console.log("chunked:", arr);

// join 是 lodash 的方法，使用 _.join
console.log("joined:", _.join(["a", "b", "c"], "-"));
