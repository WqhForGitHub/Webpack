// src/index.js
// 业务代码可以照常 import lodash / jquery —— 经过 externals 配置，
// webpack 会把它们替换成对全局变量 _ / jQuery 的引用。

import _ from "lodash";
import $ from "jquery";
import "./style.css";

const arr = [1, 2, 3, 4];
console.log("lodash sum =", _.sum(arr));

$(function () {
  $("#app").html(`<h1 class="title">externals + contenthash</h1>
    <p>lodash.sum([1,2,3,4]) = ${_.sum(arr)}</p>`);
});
