import { lerp } from './lerp';

test('lerp - negative + positive', () => {
  expect(lerp(0, -1, 1)).toBe(-1);
  expect(lerp(0.5, -1, 1)).toBe(0);
  expect(lerp(1, -1, 1)).toBe(1);
});

test('lerp - negative + negative', () => {
  expect(lerp(0, -2, -1)).toBe(-2);
  expect(lerp(0.5, -2, -1)).toBe(-1.5);
  expect(lerp(1, -2, -1)).toBe(-1);
});

test('lerp - positive + positive', () => {
  expect(lerp(0, 1, 2)).toBe(1);
  expect(lerp(0.5, 1, 2)).toBe(1.5);
  expect(lerp(1, 1, 2)).toBe(2);
});
