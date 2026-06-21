# 40. loader 性能对比实验

四种构建配置的耗时对比：

| 配置 | 描述 |
| --- | --- |
| `basic` | 仅使用 babel-loader |
| `cache` | babel-loader cacheDirectory + webpack5 filesystem cache |
| `thread` | thread-loader 多线程，无缓存 |
| `thread+cache` | thread-loader + 缓存（推荐） |

## 步骤

```bash
# 1. 安装依赖
npm install

# 2. 生成大量源文件（默认 80 个模块）
npm run gen

# 3. 单独跑某种配置
npm run build:basic
npm run build:cache
npm run build:thread
npm run build:thread-cache

# 4. 一键 benchmark：每种配置都跑两次（冷启动 + 二次构建）
npm run bench
```

`bench` 输出示例：

```
配置             冷启动     二次构建
basic            1860       1850
cache            1900       420
thread           1500       1480
thread+cache     1620       380
```

## 结论（参考）

- 只对**重型 loader**（babel/ts）启用 thread-loader 才有收益。
- 缓存对"二次构建"几乎是数量级的提升。
- 生产环境通常推荐 `thread + cache` 同开。
