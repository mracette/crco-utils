import { Canvas2DGraphics } from '../../src';

export const drawText = (graphics: Canvas2DGraphics) => {
  graphics.text('ROUGHNESS', 0, 0, {
    styles: {
      fillStyle: 'black',
      fontSize: (coords) => coords.height(0.1),
      textAlign: 'center',
      textBaseline: 'middle'
    }
  });
  graphics.text('ROUGHNESS', -0.9, -0.9, {
    styles: {
      fillStyle: 'black',
      fontSize: (coords) => coords.height(0.1),
      textAlign: 'left',
      textBaseline: 'top'
    }
  });
  graphics.text('ROUGHNESS', 0.9, 0.9, {
    styles: {
      fillStyle: 'black',
      fontSize: (coords) => coords.height(0.1),
      textAlign: 'right',
      textBaseline: 'bottom'
    }
  });
};
