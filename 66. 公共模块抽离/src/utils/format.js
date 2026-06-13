// 公共工具：被 home / about / contact 三个入口共同使用
export function format(name) {
  return `[公共模块] Hello, ${name}! 时间戳: ${Date.now()}`;
}

export function logPage(page) {
  console.log(`[common] 当前页面: ${page}`);
}
