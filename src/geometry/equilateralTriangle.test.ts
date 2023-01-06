import { equilateralTriangle } from './equilateralTriangle';

const height = Math.sqrt(3) / 2;

// Expected with params of (0, 0, 1)
const expected = [
  [0, -(2 / 3) * height],
  [0.5, (1 / 3) * height],
  [-0.5, (1 / 3) * height]
];

test('equilateralTriangle', () => {
  expect(equilateralTriangle(0, 0, 1)).toStrictEqual(expected);

  // With offset center
  const offsetX = 2.38;
  const offsetY = -10.92;

  expect(equilateralTriangle(offsetX, offsetY, 1)).toStrictEqual(
    expected.map(([x, y]) => [x + offsetX, y + offsetY])
  );
});
