// 使用一些典型的 ES6+ 语法：
//   - const / let
//   - 箭头函数
//   - 解构赋值
//   - 模板字符串
//   - class
//   - Promise（运行时由浏览器或 polyfill 提供）

class Greeter {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return `Hello, ${this.name}!`;
  }
}

const sum = (...nums) => nums.reduce((acc, n) => acc + n, 0);

const user = { name: "Webpack", age: 12 };
const { name, age } = user;

const root = document.getElementById("app");
root.innerHTML = `
  <h2>${new Greeter(name).greet()}</h2>
  <p>age: ${age}</p>
  <p>sum(1,2,3,4) = ${sum(1, 2, 3, 4)}</p>
`;

console.log("打包后请在 dist 中查看 bundle，可以发现箭头函数 / class 已经被转成 ES5。");
