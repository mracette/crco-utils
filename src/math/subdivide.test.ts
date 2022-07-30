import { Alignment, subdivide } from './subdivide';

const expectToBeCloseToArray = (result: number[], expected: number[]) => {
  expect(result.length).toStrictEqual(expected.length);
  result.forEach((element, index) => {
    expect(element).toBeCloseTo(expected[index]);
  });
};

describe('subdivide', () => {
  test('space-between', () => {
    expectToBeCloseToArray(subdivide(0, 1, 4), [0, 0.333, 0.666, 1]);
    expectToBeCloseToArray(subdivide(0, -1, 4), [0, -0.333, -0.666, -1]);
  });
  test('space-around', () => {
    expectToBeCloseToArray(
      subdivide(0, 1, 4, { alignment: Alignment.SpaceAround }),
      [0.125, 0.375, 0.625, 0.875]
    );
    expectToBeCloseToArray(
      subdivide(0, -1, 4, { alignment: Alignment.SpaceAround }),
      [-0.125, -0.375, -0.625, -0.875]
    );
  });
  test('distribution', () => {
    expectToBeCloseToArray(
      subdivide(0, 1, 4, { distribution: (n: number) => n ** 2 }),
      [0 ** 2, 0.333 ** 2, 0.666 ** 2, 1 ** 2]
    );
    expectToBeCloseToArray(
      subdivide(0, 1, 4, {
        alignment: Alignment.SpaceAround,
        distribution: (n: number) => n ** 2
      }),
      [0.125 ** 2, 0.375 ** 2, 0.625 ** 2, 0.875 ** 2]
    );
  });
});
