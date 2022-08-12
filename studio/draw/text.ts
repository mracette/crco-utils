import { Canvas2DGraphics } from '../../src';

export const drawText = (graphics: Canvas2DGraphics) => {
  graphics.text('TEXT', 0, 0, {
    styles: {
      fillStyle: 'black',
      fontSize: (coords) => coords.height(0.1),
      textAlign: 'center',
      textBaseline: 'middle'
    }
  });
};
