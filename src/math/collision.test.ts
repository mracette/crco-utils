import { circleCircleCollision, rectangleRectangleCollision } from './collision';

test('collision', () => {
  expect(circleCircleCollision(0, 0, 1, 0.5, 0.5, 0.0001)).toBe(true);
  expect(circleCircleCollision(0, 0, 1, 1.5, 1.5, 0.25)).toBe(false);
  expect(circleCircleCollision(0, 0, 1, -1.26, 0, 0.25)).toBe(false);
  expect(circleCircleCollision(0, 0, 1, -1.25, 0, 0.25)).toBe(true);

  expect(rectangleRectangleCollision(-1, -1, 2, 2, 0, 0, 1, 1)).toBe(true);
  expect(rectangleRectangleCollision(-1, -1, 2, 2, 1.01, 1.01, 1, 1)).toBe(false);
  expect(rectangleRectangleCollision(-1, -1, 2, 2, -2, -1, 0.99, 1)).toBe(false);
  expect(rectangleRectangleCollision(-1, -1, 2, 2, -2, -1, 1.01, 1)).toBe(true);
});
