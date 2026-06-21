const data = new Array(3000).fill(0).map((_, i) => ({
  id: i,
  name: `record-${i}`,
  square: i * i,
}));

export default data;
