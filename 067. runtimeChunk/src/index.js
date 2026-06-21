import _ from "lodash";

console.log("[app] runtime chunk demo");
document.getElementById("out").textContent = _.join(["runtime", "chunk", "demo"], " - ");
