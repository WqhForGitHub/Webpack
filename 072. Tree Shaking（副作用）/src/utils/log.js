// 整个文件未被任何地方 import，应被完全删除
export function info(msg) {
  console.info("[unused log]", msg);
}

export function warn(msg) {
  console.warn("[unused log]", msg);
}
