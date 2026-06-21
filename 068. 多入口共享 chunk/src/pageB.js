import _ from "lodash";
import $ from "jquery";

console.log("[pageB] lodash:", _.VERSION, "jquery:", $.fn.jquery);
$("body").append("<p>" + _.join(["Page", "B"], " - ") + " 共享 lodash + jquery</p>");
