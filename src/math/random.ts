export function random(max?: number, min?: number): number;
export function random<T>(options: T[]): T;
export function random<T>(
  optionsOrMax: T[] | number | undefined = 0,
  min = 1
): T | number {
  if (Array.isArray(optionsOrMax)) {
    return optionsOrMax[Math.floor(Math.random() * optionsOrMax.length)];
  } else {
    return min + Math.random() * (optionsOrMax - min);
  }
}
