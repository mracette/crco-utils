import { Canvas2DGraphics } from '../../src';

export const drawPolygon = (graphics: Canvas2DGraphics) => {
  graphics.polygon(0, 0, 0.25, undefined, { fill: true });
};
