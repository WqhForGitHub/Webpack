import _ from "lodash";

console.log("[app] start", _.VERSION);

document.getElementById("btn-load")?.addEventListener("click", async () => {
  const mod = await import(/* webpackChunkName: "user-profile" */ "./profile");
  document.body.append(mod.render());
});
