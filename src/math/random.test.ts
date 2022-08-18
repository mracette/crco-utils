import { random } from './random';

describe('random', () => {
  test('random', () => {
    expect(random(0.000001)).not.toBeGreaterThan(0.000001);
    expect(random(1, 0.999999)).not.toBeLessThan(0.999999);
  });
});
