# 62. import() 魔法注释（chunkName）

webpack 在解析 `import()` 时，会读取调用参数前的「魔法注释」（Magic Comments）来决定 chunk 行为。

## 常用魔法注释
| 注释 | 作用 |
|------|------|
| `webpackChunkName: "name"` | 自定义异步 chunk 的文件名（替代默认数字 ID） |
| `webpackPrefetch: true` | 浏览器空闲时预取，生成 `<link rel="prefetch">` |
| `webpackPreload: true` | 与父 chunk 并行加载，生成 `<link rel="preload">` |
| `webpackMode: "lazy" \| "eager" \| "weak" \| "lazy-once"` | 控制 chunk 拆分策略 |
| `webpackInclude` / `webpackExclude` | 限定动态 import 通配符匹配的文件 |
| `webpackIgnore: true` | 让 webpack 忽略这个 import()，运行时由浏览器原生处理 |

## 示例
```js
const mod = await import(
  /* webpackChunkName: "user-page" */
  /* webpackPrefetch: true */
  "./pages/user.js"
);
```
配合配置：
```js
output: {
  chunkFilename: "js/[name].chunk.js",
}
```
最终生成 `js/user-page.chunk.js`。

## prefetch vs preload
| | prefetch | preload |
|---|----------|---------|
| 触发时机 | 浏览器空闲时 | 与父 chunk 并行 |
| 优先级 | 低 | 高 |
| 用途 | "用户可能马上要" | "本页面立刻就要" |

## 运行
```bash
npm install
npm run build
npm run serve
```
打开 Network 面板：
- `chart-page` 在页面加载完后，会被浏览器空闲时间下载
- `user-page` 仅在点击按钮后下载
- `lodash-utils` 与父 chunk 并行加载
