// src/index.js
// 业务代码使用 lodash / jquery，但因为 DllReferencePlugin 的存在，
// 它们不会被打入主 bundle，而是从 vendors.dll.js 读取

import _ from "lodash";
import $ from "jquery";

const arr = [10, 20, 30];
console.log("lodash sum =", _.sum(arr));

$(function () {
  $("body").append("<h1>DLL Demo loaded</h1>");
  $("body").append(`<p>lodash.sum=${_.sum(arr)}</p>`);
});
