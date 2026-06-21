const longText = "x".repeat(50000);
export function heavyB() {
  return longText.length;
}
