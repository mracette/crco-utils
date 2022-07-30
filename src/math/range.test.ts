import { range } from './range';

describe('range', () => {
  test('positive step', () => {
    expect(range(0, 1, 0.5)).toStrictEqual([0, 0.5, 1]);
  });
  test('negative step', () => {
    expect(range(1, 0, -0.5)).toStrictEqual([1, 0.5, 0]);
  });
});
