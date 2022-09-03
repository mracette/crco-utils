import { Canvas2DGraphics } from '../../src';

const NUM_LINES = 10;

export const drawResponsiveLines = (graphics: Canvas2DGraphics) => {
  const [x0, x1] = graphics.coords.nxRange;
  const [y0, y1] = graphics.coords.nyRange;
  const height = graphics.coords.nHeight();
  for (let i = 0; i < NUM_LINES; i++) {
    graphics.lineSegments([
      [x0, y0 + (height * i + 0.5) / NUM_LINES],
      [x1, y0 + (height * i + 0.5) / NUM_LINES]
    ]);
  }
};

export const drawResponsiveCircles = (graphics: Canvas2DGraphics) => {
  const nHeight = graphics.coords.nHeight(graphics.coords.height());
  for (let i = 0; i < NUM_LINES; i++) {
    const radius = (0.5 * i + 0.5) / NUM_LINES;
    graphics.circle(0, 0, radius);
  }
};

const CHARS = 'oSKJ01kSSLasjkiuennfalkj3jJIODFlkj';

export const drawResponsiveText = (graphics: Canvas2DGraphics) => {
  const [y0, y1] = graphics.coords.nyRange;
  for (let i = 0; i < NUM_LINES; i++) {
    const text = new Array(i)
      .fill(null)
      .map((_, i) => CHARS.charAt(i))
      .join('');
    graphics.text(text, 0, y0 + ((y1 - y0) * i) / NUM_LINES);
  }
};
