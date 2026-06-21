// 一个简单的接口 + 类，演示 TypeScript 类型系统
interface User {
  name: string;
  age: number;
}

class UserCard {
  constructor(private user: User) {}

  render(): string {
    const { name, age } = this.user;
    return `<div class="card"><h3>${name}</h3><p>age: ${age}</p></div>`;
  }
}

const users: User[] = [
  { name: "Alice", age: 18 },
  { name: "Bob", age: 22 },
];

const root = document.getElementById("app")!;
root.innerHTML = users.map((u) => new UserCard(u).render()).join("");
