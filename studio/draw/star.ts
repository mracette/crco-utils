import { Canvas2DGraphics } from '../../src';
import { star } from '../../src/geometry/star';

export const drawStar = (graphics: Canvas2DGraphics) => {
  graphics.lineSegments(star(0, 0, 0.9, 5), { fill: true, closePath: true });
};
