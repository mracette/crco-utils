import { isUndefined } from "./isUndefined";

test("is undefined", () => {
  expect(isUndefined(true)).toBe(false);
  expect(isUndefined(false)).toBe(false);
  expect(isUndefined("test")).toBe(false);
  expect(isUndefined(27)).toBe(false);
  expect(isUndefined(NaN)).toBe(false);
  expect(isUndefined(Boolean)).toBe(false);
  expect(isUndefined(null)).toBe(false);
  expect(isUndefined({})).toBe(false);
  expect(isUndefined([])).toBe(false);
  expect(isUndefined(undefined)).toBe(true);
});
