import _ from "lodash";
import "./style.css";

console.log("[index] long-term cache demo");
document.getElementById("app").textContent = _.join(
  ["contenthash", "long", "term", "cache"],
  " - "
);
