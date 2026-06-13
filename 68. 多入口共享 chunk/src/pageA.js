import _ from "lodash";
import $ from "jquery";

console.log("[pageA] lodash:", _.VERSION, "jquery:", $.fn.jquery);
$("body").append("<p>Page A 共享 lodash + jquery</p>");
