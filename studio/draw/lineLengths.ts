import { Canvas2DGraphics } from '../../src';
import { range } from '../../src/math/range';
import { Alignment, subdivide } from '../../src/math/subdivide';

const numLines = 10;

export const drawLineLengths = (graphics: Canvas2DGraphics) => {
  const x = subdivide(-1, 1, 5, { alignment: Alignment.SpaceAround });
  const y = subdivide(-1, 1, 5, { alignment: Alignment.SpaceAround });

  x.forEach((x, i) => {
    graphics.lineSegments([
      [-1, y[i]],
      [x, y[i]]
    ]);
  });
};
