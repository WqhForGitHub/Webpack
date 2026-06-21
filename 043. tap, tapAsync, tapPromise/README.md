# 43. tap, tapAsync, tapPromise

演示 webpack 自定义插件中三种钩子注册方式。

## 三种注册方式
| 方式 | 说明 | 适用钩子 |
| --- | --- | --- |
| `tap` | 同步注册 | 所有钩子（SyncHook / AsyncHook 都可，但异步钩子上注册的 tap 无法做异步） |
| `tapAsync` | 异步注册（callback） | AsyncHook（如 emit、afterEmit、done） |
| `tapPromise` | 异步注册（Promise） | AsyncHook |

## 运行
```bash
npm install
npm run build
```

## 输出顺序
```
[tap] compile 钩子触发（同步）
[tapAsync] emit 钩子触发（异步 callback）
[tapAsync] 异步任务完成，调用 callback()
[tapPromise] afterEmit 钩子触发（异步 Promise）
[tapPromise] Promise resolve
[tap] done 钩子触发（构建完成）
```
