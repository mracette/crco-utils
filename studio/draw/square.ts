import { Canvas2DGraphics } from '../../src';

export const drawSquare = (graphics: Canvas2DGraphics) => {
  graphics.rect(-0.5, -0.5, 0.5, 0.5, { fill: true });
};
