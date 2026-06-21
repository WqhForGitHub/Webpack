// src/index.js
import moment from "moment";
// 因为 IgnorePlugin 忽略了 moment/locale，这里需要手动按需引入想要的语言包
import "moment/locale/zh-cn";

moment.locale("zh-cn");
console.log(moment().format("LLLL"));
