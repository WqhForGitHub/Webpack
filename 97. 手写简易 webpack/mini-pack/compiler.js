// mini-pack/compiler.js
// 简化版 Compiler：完成"读 → parse → 收集依赖 → 生成 bundle"全流程
//
// 核心步骤：
//   1. 从 entry 开始，递归 build 模块
//   2. 每个模块：读源码 → 用正则匹配 import/require → 把相对路径解析成绝对路径
//   3. 给每个模块编一个 id（这里用绝对路径）
//   4. 把 ES Module 语法转成 CommonJS（这里只做最简的字符串替换）
//   5. 把所有模块包成 IIFE，附带 mini-runtime 输出 bundle.js
const fs = require("fs");
const path = require("path");

class Compiler {
  constructor(options) {
    this.options = options;
    this.modules = []; // [{ id, code, deps }]
    this.moduleMap = new Map(); // id -> module
  }

  run(callback) {
    try {
      const entry = path.resolve(this.options.context, this.options.entry);
      this.buildModule(entry);
      const bundle = this.emit();
      callback(null, {
        modules: this.modules,
        outputPath: bundle.outputPath,
      });
    } catch (e) {
      callback(e);
    }
  }

  buildModule(absPath) {
    if (this.moduleMap.has(absPath)) return this.moduleMap.get(absPath);

    console.log("[mini-pack] build:", path.relative(this.options.context, absPath));

    let source = fs.readFileSync(absPath, "utf-8");
    const deps = []; // [{ request, absPath }]

    // 极简：只处理 import xxx from 'path' / import 'path' / require('path')
    // 把 import / export 统一改写成 CommonJS（与 webpack 通过 AST 改写思路一致，只是简化为正则）
    source = source.replace(
      /import\s+(?:([\w$*\s{},]+)\s+from\s+)?['"]([^'"]+)['"];?/g,
      (m, imported, request) => {
        const resolved = this.resolve(absPath, request);
        deps.push({ request, absPath: resolved });
        if (!imported) {
          return `require(${JSON.stringify(resolved)});`;
        }
        // 处理 default、命名 import
        const trimmed = imported.trim();
        if (/^\w+$/.test(trimmed)) {
          // import x from 'm'  -> const x = require('m').default || require('m')
          return `const ${trimmed} = (require(${JSON.stringify(resolved)}).default || require(${JSON.stringify(resolved)}));`;
        }
        if (trimmed.startsWith("{")) {
          // import {a, b} from 'm' -> const { a, b } = require('m')
          return `const ${trimmed} = require(${JSON.stringify(resolved)});`;
        }
        // 兜底
        return `const _${Math.random().toString(36).slice(2, 8)} = require(${JSON.stringify(resolved)});`;
      }
    );

    source = source.replace(
      /export\s+default\s+/g,
      "module.exports.default = "
    );
    source = source.replace(
      /export\s+(const|let|var)\s+(\w+)\s*=/g,
      "$1 $2 = module.exports.$2 ="
    );
    source = source.replace(
      /export\s+function\s+(\w+)/g,
      "module.exports.$1 = function $1"
    );
    source = source.replace(
      /export\s*\{\s*([^}]+)\s*\};?/g,
      (m, names) => {
        return names
          .split(",")
          .map((n) => n.trim())
          .filter(Boolean)
          .map((n) => `module.exports.${n} = ${n};`)
          .join("\n");
      }
    );

    // 处理 require('xxx') 中的相对路径
    source = source.replace(/require\(['"]([^'"]+)['"]\)/g, (m, request) => {
      if (request.startsWith(".") || path.isAbsolute(request)) {
        const resolved = path.isAbsolute(request)
          ? request
          : this.resolve(absPath, request);
        if (!deps.find((d) => d.absPath === resolved)) {
          deps.push({ request, absPath: resolved });
        }
        return `require(${JSON.stringify(resolved)})`;
      }
      return m;
    });

    const mod = { id: absPath, code: source, deps };
    this.moduleMap.set(absPath, mod);
    this.modules.push(mod);

    deps.forEach((d) => this.buildModule(d.absPath));

    return mod;
  }

  resolve(fromFile, request) {
    let p = path.resolve(path.dirname(fromFile), request);
    // 自动补全扩展名
    if (!fs.existsSync(p)) {
      for (const ext of [".js", ".json"]) {
        if (fs.existsSync(p + ext)) {
          p = p + ext;
          break;
        }
      }
    }
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) {
      p = path.join(p, "index.js");
    }
    return p;
  }

  emit() {
    const outputPath = path.resolve(
      this.options.context,
      this.options.output.path
    );
    const outputFile = path.join(outputPath, this.options.output.filename);

    if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });

    const entryAbs = path.resolve(this.options.context, this.options.entry);

    const modulesCode = this.modules
      .map(
        (m) =>
          `  ${JSON.stringify(m.id)}: function(module, exports, require) {\n${m.code}\n  }`
      )
      .join(",\n");

    const bundle = `
// === mini-pack bundle ===
(function(modules) {
  const cache = {};
  function require(id) {
    if (cache[id]) return cache[id].exports;
    const module = cache[id] = { exports: {} };
    modules[id](module, module.exports, require);
    return module.exports;
  }
  return require(${JSON.stringify(entryAbs)});
})({
${modulesCode}
});
`;

    fs.writeFileSync(outputFile, bundle, "utf-8");
    return { outputPath: outputFile };
  }
}

module.exports = Compiler;
