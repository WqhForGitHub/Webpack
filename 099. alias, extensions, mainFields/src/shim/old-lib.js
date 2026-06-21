// src/shim/old-lib.js  —— 通过 alias 'old-lib' 重定向到这里
module.exports = function () {
  return "I am the SHIM of old-lib";
};
