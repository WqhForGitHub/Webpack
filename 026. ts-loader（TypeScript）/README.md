# 26. ts-loader（TypeScript）

使用 `ts-loader` 让 webpack 处理 TypeScript 源代码。

## 关键文件

- `tsconfig.json`：TS 编译选项（target、module、strict 等）
- `webpack.config.js`：声明 `.ts/.tsx` 走 `ts-loader`
- `resolve.extensions` 加入 `.ts/.tsx`，支持省略后缀的 import

## 运行

```bash
npm install
npm start
```
