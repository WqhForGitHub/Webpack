// plugins/module-graph-plugin.js
// 自定义插件：扫描 compilation.modules，输出模块依赖图（graph）
//   - 每个 module 包含：id、resource（绝对路径）、依赖的子模块
//   - webpack 内部本身就维护着 ModuleGraph，这里我们把它"打印"出来
const path = require("path");

class ModuleGraphPlugin {
  constructor(options = {}) {
    this.filename = options.filename || "module-graph.json";
  }

  apply(compiler) {
    const PLUGIN_NAME = "ModuleGraphPlugin";
    const context = compiler.context;

    compiler.hooks.emit.tap(PLUGIN_NAME, (compilation) => {
      const moduleGraph = compilation.moduleGraph;
      const graph = {
        entry: null,
        modules: [],
      };

      // 入口模块
      for (const [name, entryData] of compilation.entries) {
        const dep = entryData.dependencies[0];
        const entryModule = moduleGraph.getModule(dep);
        if (entryModule) {
          graph.entry = relative(context, entryModule.resource || name);
        }
      }

      // 遍历所有模块
      for (const mod of compilation.modules) {
        const resource = mod.resource;
        if (!resource) continue;

        const deps = [];
        for (const dep of mod.dependencies) {
          const depModule = moduleGraph.getModule(dep);
          if (depModule && depModule.resource) {
            deps.push({
              request: dep.request || dep.userRequest || null,
              resource: relative(context, depModule.resource),
            });
          }
        }

        graph.modules.push({
          id: relative(context, resource),
          resource: relative(context, resource),
          dependencies: deps,
        });
      }

      const json = JSON.stringify(graph, null, 2);

      compilation.assets[this.filename] = {
        source: () => json,
        size: () => json.length,
      };

      // 控制台同时打印一份简化版
      console.log(`\n[${PLUGIN_NAME}] 模块依赖图：`);
      console.log(`  入口: ${graph.entry}`);
      graph.modules.forEach((m) => {
        console.log(`  - ${m.id}`);
        m.dependencies.forEach((d) => {
          console.log(`      └── ${d.request}  ->  ${d.resource}`);
        });
      });
    });
  }
}

function relative(context, abs) {
  return path.relative(context, abs).replace(/\\/g, "/");
}

module.exports = ModuleGraphPlugin;
