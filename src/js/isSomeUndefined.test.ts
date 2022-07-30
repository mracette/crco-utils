import { isSomeUndefined } from './isSomeUndefined';

test('one argument', () => {
  expect(isSomeUndefined(true)).toBe(false);
  expect(isSomeUndefined(false)).toBe(false);
  expect(isSomeUndefined('test')).toBe(false);
  expect(isSomeUndefined(27)).toBe(false);
  expect(isSomeUndefined(NaN)).toBe(false);
  expect(isSomeUndefined(Boolean)).toBe(false);
  expect(isSomeUndefined(null)).toBe(false);
  expect(isSomeUndefined({})).toBe(false);
  expect(isSomeUndefined([])).toBe(false);
  expect(isSomeUndefined(undefined)).toBe(true);
});

test('multiple arguments', () => {
  expect(isSomeUndefined(true, false)).toBe(false);
  expect(isSomeUndefined('test', 27)).toBe(false);
  expect(isSomeUndefined(27, 1, 0, 8)).toBe(false);
  expect(isSomeUndefined(Boolean, 23, 'test')).toBe(false);
  expect(isSomeUndefined(null, false, Boolean, 2, true)).toBe(false);
  expect(isSomeUndefined({}, [], null, 2, 'test')).toBe(false);
  expect(isSomeUndefined('test', undefined)).toBe(true);
  expect(isSomeUndefined(undefined, undefined)).toBe(true);
});
