import { Canvas2DGraphics } from '../../src';

export const drawStar = (graphics: Canvas2DGraphics) => {
  graphics.star(0, 0, 0.25, 5, undefined, { fill: true, closePath: true });
};
