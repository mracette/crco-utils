import { Canvas2DGraphics, ORIGIN, TAU, Vector2 } from '../../src';

export const drawDiamond = (graphics: Canvas2DGraphics) => {
  graphics.rect(-0.5, -0.5, 0.5, 0.5, {
    styles: {
      scale: { origin: ORIGIN, scale: new Vector2(0.5, 1), constantLineWidth: true },
      rotation: { origin: ORIGIN, rotation: TAU / 8 }
    },
    fill: true
  });
};
