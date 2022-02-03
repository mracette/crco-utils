import { isEveryUndefined } from "./isEveryUndefined";

test("one argument", () => {
  expect(isEveryUndefined(true)).toBe(false);
  expect(isEveryUndefined(false)).toBe(false);
  expect(isEveryUndefined("test")).toBe(false);
  expect(isEveryUndefined(27)).toBe(false);
  expect(isEveryUndefined(NaN)).toBe(false);
  expect(isEveryUndefined(Boolean)).toBe(false);
  expect(isEveryUndefined(null)).toBe(false);
  expect(isEveryUndefined({})).toBe(false);
  expect(isEveryUndefined([])).toBe(false);
  expect(isEveryUndefined(undefined)).toBe(true);
});

test("multiple arguments", () => {
  expect(isEveryUndefined(true, false)).toBe(false);
  expect(isEveryUndefined("test", 27)).toBe(false);
  expect(isEveryUndefined(27, 1, 0, 8)).toBe(false);
  expect(isEveryUndefined(Boolean, 23, "test")).toBe(false);
  expect(isEveryUndefined(null, false, Boolean, 2, true)).toBe(false);
  expect(isEveryUndefined({}, [], null, 2, "test")).toBe(false);
  expect(isEveryUndefined("test", undefined)).toBe(false);
  expect(isEveryUndefined(undefined, undefined)).toBe(true);
});
