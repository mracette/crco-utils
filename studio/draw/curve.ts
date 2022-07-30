import { Canvas2DGraphics } from '../../src';

export const drawCurve = (graphics: Canvas2DGraphics) => {
  graphics.curveThroughPoints([
    [-0.5, -0.5],
    [0, -0.5],
    [0.5, -0.5],
    [0, 0],
    [-0.5, 0.5],
    [0, 0.5],
    [0.5, 0.5]
  ]);
};
