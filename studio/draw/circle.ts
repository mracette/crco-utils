import { Canvas2DGraphics } from '../../src';

export const drawCircle = (graphics: Canvas2DGraphics) => {
  graphics.circle(0, 0, 0.25, { fill: true });
  graphics.circle(-0.3, -0.4, 0.05, { fill: true });
  graphics.circle(0.6, 0.2, 0.12, { fill: true });
};
