import { deepClone } from "./deepClone";

test.each([{ a: 1, b: 2 }, [1, 2, 3, null, "a", "b", "c"]])(
  "deepClone objects",
  (item) => {
    const clone = deepClone(item);
    expect(item).toStrictEqual(clone);
    expect(item).not.toBe(clone);
  }
);

test.each([true, false, null, 1, "string"])("deepClone primitives", (item) => {
  const clone = deepClone(item);
  expect(item).toStrictEqual(clone);
  expect(item).toBe(clone);
});
