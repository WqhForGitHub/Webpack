import _ from "lodash";
import $ from "jquery";
import axios from "axios";

console.log("[index]", _.VERSION, $.fn.jquery, axios.VERSION);

$("#app").text(_.join(["cacheGroups", "demo"], " - "));
