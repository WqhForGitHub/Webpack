// 多写几个文件，模拟较大量的 babel 工作
export const a = (...args) => args.reduce((s, x) => s + x, 0);
export class Demo {
  constructor(name = "demo") {
    this.name = name;
  }
  hello() {
    return `hello, ${this.name}`;
  }
}
