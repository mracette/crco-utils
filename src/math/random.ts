export function random(max?: number, min?: number, random?: () => number): number;
export function random<T>(options: T[], random?: () => number): T;
export function random<T>(
  optionsOrMax: T[] | number = 1,
  minOrRandom: number | (() => number) = 0,
  random = Math.random
): T | number {
  if (Array.isArray(optionsOrMax) && typeof minOrRandom === 'function') {
    return optionsOrMax[Math.floor(random() * optionsOrMax.length)];
  } else if (
    typeof minOrRandom === 'number' &&
    typeof optionsOrMax === 'number' &&
    typeof random === 'function'
  ) {
    return minOrRandom + random() * (optionsOrMax - minOrRandom);
  } else {
    throw new Error('Invalid args. Check function signature.');
  }
}
