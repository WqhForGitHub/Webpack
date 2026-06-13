// loader-runner-mini/runner.js
// 简化版 loader-runner：模拟 webpack 内部调用 loader 的过程
//
// 核心流程：
//   1. resource：要被加工的源文件
//   2. loaders：从右到左 normal 阶段；从左到右 pitch 阶段
//   3. 每个 loader 是一个 module.exports = function(content) {...}，可挂 module.exports.pitch
//   4. pitch 阶段：从左到右执行所有 loader 的 pitch 函数，
//      若某个 pitch 返回非 undefined 值，则跳过它右边的所有 loader 和 resource，
//      "回头"从当前 loader 左侧开始执行 normal 阶段。
//   5. normal 阶段：从右到左依次把上一个 loader 的输出作为下一个 loader 的输入。

const fs = require("fs");

function runLoaders(options, finalCallback) {
  const { resource, loaders } = options;
  // 包装 loaders -> { path, normal, pitch, data }
  const loaderObjects = loaders.map((p) => {
    const mod = require(p);
    return {
      path: p,
      normal: typeof mod === "function" ? mod : null,
      pitch: mod && mod.pitch ? mod.pitch : null,
      data: {},
    };
  });

  let loaderIndex = 0;

  const loaderContext = {
    resource,
    loaders: loaderObjects,
    loaderIndex: 0,
    data: null,
    async() {
      this._async = true;
      return (err, result) => {
        if (err) finalCallback(err);
        else next(result);
      };
    },
  };

  // 先 pitch（从左到右），再读文件，再 normal（从右到左）
  iteratePitch();

  function iteratePitch() {
    if (loaderIndex >= loaderObjects.length) {
      // 所有 pitch 执行完了 -> 读文件 -> 进入 normal 阶段
      const source = fs.readFileSync(resource, "utf-8");
      console.log(`[runner] read source: ${resource}`);
      // normal 阶段从最后一个 loader 开始
      loaderContext.loaderIndex = loaderObjects.length - 1;
      return iterateNormal(source);
    }
    const cur = loaderObjects[loaderIndex];
    loaderContext.loaderIndex = loaderIndex;
    if (!cur.pitch) {
      loaderIndex++;
      return iteratePitch();
    }
    console.log(`[runner] pitch: ${cur.path}`);
    // pitch(remainingRequest, precedingRequest, data)
    const remaining = loaderObjects
      .slice(loaderIndex + 1)
      .map((l) => l.path)
      .concat(resource)
      .join("!");
    const preceding = loaderObjects
      .slice(0, loaderIndex)
      .map((l) => l.path)
      .join("!");
    const r = cur.pitch.call(loaderContext, remaining, preceding, cur.data);
    if (r !== undefined) {
      // 短路：跳过右边所有 loader 和 resource，从这个 loader 左侧开始 normal
      console.log(`[runner] pitch 短路 by ${cur.path} -> ${JSON.stringify(r)}`);
      loaderContext.loaderIndex = loaderIndex - 1;
      return iterateNormal(r);
    }
    loaderIndex++;
    iteratePitch();
  }

  function iterateNormal(content) {
    if (loaderContext.loaderIndex < 0) {
      // 所有 normal 执行完毕
      return finalCallback(null, content);
    }
    const cur = loaderObjects[loaderContext.loaderIndex];
    if (!cur.normal) {
      loaderContext.loaderIndex--;
      return iterateNormal(content);
    }
    console.log(`[runner] normal: ${cur.path}`);
    loaderContext._async = false;

    const callback = (err, result) => {
      if (err) return finalCallback(err);
      next(result);
    };

    // 通过 this.async() 取异步回调
    const r = cur.normal.call(
      Object.assign({}, loaderContext, {
        async() {
          loaderContext._async = true;
          return callback;
        },
      }),
      content
    );

    if (!loaderContext._async) {
      // 同步 loader：直接拿返回值
      next(r);
    }

    function next(result) {
      loaderContext.loaderIndex--;
      iterateNormal(result);
    }
  }

  function next(result) {
    iterateNormal(result);
  }
}

module.exports = { runLoaders };
