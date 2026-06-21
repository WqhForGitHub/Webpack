const data = new Array(2000).fill(0).map((_, i) => ({ id: i, value: i * 5 }));
export default () => data.length;
