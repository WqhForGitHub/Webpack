// 业务代码：使用 lodash 和 jquery
import _ from "lodash";
import $ from "jquery";

const text = _.join(["手动", "拆", "vendor", "demo"], " - ");
$("#app").text(text);

console.log("[main] lodash:", _.VERSION);
console.log("[main] jquery:", $.fn.jquery);
