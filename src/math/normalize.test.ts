import { normalize } from "./normalize";

describe("normalize - negative + positive", () => {
  test("within bounds", () => {
    expect(normalize(-1, -1, 1)).toBe(0);
    expect(normalize(0, -1, 1)).toBe(0.5);
    expect(normalize(1, -1, 1)).toBe(1);
  });
  test("out of bounds", () => {
    expect(normalize(-3, -1, 1)).toBe(-1);
    expect(normalize(3, -1, 1)).toBe(2);
  });
  test("out of bounds with clamp", () => {
    expect(normalize(-3, -1, 1, true)).toBe(0);
    expect(normalize(3, -1, 1, true)).toBe(1);
  });
});

describe("normalize - negative + negative", () => {
  test("within bounds", () => {
    expect(normalize(-2, -2, -1)).toBe(0);
    expect(normalize(-1.5, -2, -1)).toBe(0.5);
    expect(normalize(-1, -2, -1)).toBe(1);
  });
  test("out of bounds", () => {
    expect(normalize(-3, -2, -1)).toBe(-1);
    expect(normalize(0, -2, -1)).toBe(2);
  });
  test("out of bounds with clamp", () => {
    expect(normalize(-3, -2, -1, true)).toBe(0);
    expect(normalize(0, -2, -1, true)).toBe(1);
  });
});

describe("normalize - positive + positive", () => {
  test("within bounds", () => {
    expect(normalize(1, 1, 2)).toBe(0);
    expect(normalize(1.5, 1, 2)).toBe(0.5);
    expect(normalize(2, 1, 2)).toBe(1);
  });
  test("out of bounds", () => {
    expect(normalize(0, 1, 2)).toBe(-1);
    expect(normalize(3, 1, 2)).toBe(2);
  });
  test("out of bounds with clamp", () => {
    expect(normalize(0, 1, 2, true)).toBe(0);
    expect(normalize(3, 1, 2, true)).toBe(1);
  });
});
