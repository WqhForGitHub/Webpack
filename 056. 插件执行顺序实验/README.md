# 56. 插件执行顺序实验

## 两条主线
1. **不同 hook 之间** → 由 webpack 生命周期顺序决定
   ```
   environment → beforeRun → compile → emit → done
   ```
2. **同一 hook 上多个 tap** → 默认按"注册顺序"执行
   - 谁先 `tap`，谁先执行
   - 可通过 `tap("name", { stage: -10, before: ["X"] }, fn)` 覆盖

## 本 demo 的预期输出
插件 A、B、C 都在 environment / beforeRun / compile / emit / done 上注册了 tap：

```
[A] environment
[B] environment
[C] environment
[A] beforeRun
[B] beforeRun
[C] beforeRun
[A] compile
[B] compile
[C] compile
[A] emit
[B] emit
[C] emit
[A] done
[B] done
[C] done
```

## 结论
- **横向（同 hook）**：A → B → C，因为 `plugins: [A, B, C]` 的注册顺序
- **纵向（跨 hook）**：environment 永远早于 emit，符合编译生命周期
- 想跨过默认顺序，必须显式声明 `stage` 或 `before`

## 运行
```bash
npm install
npm run build
```
观察终端输出。
