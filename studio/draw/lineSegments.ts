import { Canvas2DGraphics } from '../../src';

export const drawLineSegments = (graphics: Canvas2DGraphics) => {
  graphics.lineSegments([
    [-0.5, -0.5],
    [0.5, -0.5],
    [-0.5, 0.5],
    [0.5, 0.5]
  ]);
};
