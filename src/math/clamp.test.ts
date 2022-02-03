import { clamp } from "./clamp";

test("clamp", () => {
  expect(clamp(0.5, 0, 1)).toBe(0.5);
  expect(clamp(-0.5, 0, 1)).toBe(0);
  expect(clamp(1.5, 0, 1)).toBe(1);
});
