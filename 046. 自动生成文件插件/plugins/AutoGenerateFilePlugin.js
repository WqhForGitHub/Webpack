// plugins/AutoGenerateFilePlugin.js
// 自定义插件：根据当前 compilation 的资源信息，
// 在打包结果中自动生成几个文件：
//   - manifest.json：所有输出资源的清单
//   - version.txt：当前版本号 + 构建时间
//   - build-info.json：构建摘要

const { sources } = require("webpack");
const { RawSource } = sources;

class AutoGenerateFilePlugin {
  constructor(options = {}) {
    this.version = options.version || "1.0.0";
    this.author = options.author || "anonymous";
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap("AutoGenerateFilePlugin", (compilation) => {
      // processAssets 是 webpack5 推荐的修改/新增 assets 的钩子
      compilation.hooks.processAssets.tap(
        {
          name: "AutoGenerateFilePlugin",
          stage: compilation.constructor.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        (assets) => {
          // 1) manifest.json
          const manifest = {};
          Object.keys(assets).forEach((name) => {
            manifest[name] = {
              size: assets[name].size(),
            };
          });
          compilation.emitAsset(
            "manifest.json",
            new RawSource(JSON.stringify(manifest, null, 2))
          );

          // 2) version.txt
          const versionText =
            `version: ${this.version}\n` +
            `author : ${this.author}\n` +
            `time   : ${new Date().toISOString()}\n`;
          compilation.emitAsset("version.txt", new RawSource(versionText));

          // 3) build-info.json
          const info = {
            version: this.version,
            author: this.author,
            buildAt: Date.now(),
            assetCount: Object.keys(assets).length,
          };
          compilation.emitAsset(
            "build-info.json",
            new RawSource(JSON.stringify(info, null, 2))
          );
        }
      );
    });
  }
}

module.exports = AutoGenerateFilePlugin;
