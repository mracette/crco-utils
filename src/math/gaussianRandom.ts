/**
 * A quick and simple approximation of a gaussian random number generator.
 */
export function gaussianRandom() {
  let rand = 0;
  for (let i = 0; i < 6; i += 1) {
    rand += Math.random();
  }
  return rand / 6;
}
