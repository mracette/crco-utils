import {
  Canvas2DGraphics,
  CanvasCoordinates,
  magnitude,
  mulberry32,
  random
} from '../../src';
import { Canvas2DGraphicsOptions } from '../../src';
import {
  drawResponsiveCircles,
  drawResponsiveLines,
  drawResponsiveText
} from '../draw/responsive';
import { drawSquare } from '../draw/square';

const OPTIONS: Canvas2DGraphicsOptions = {
  useNormalCoordinates: true,
  stroke: true,
  scalarNormalization: 'width',
  styles: {
    lineWidth: (coords) => coords.width(0.01),
    fillStyle: 'lightblue'
  },
  saveAndRestore: false
};

const ROOT_ELEMENT = document.getElementById('root') as HTMLDivElement;

const DRAWINGS = [
  {
    canvas: document.createElement('canvas'),
    // drawFunction: drawResponsiveLines,
    // drawFunction: drawResponsiveCircles,
    drawFunction: drawResponsiveText,
    size: 1
  },
  {
    canvas: document.createElement('canvas'),
    // drawFunction: drawResponsiveLines,
    // drawFunction: drawResponsiveCircles,
    drawFunction: drawResponsiveText,
    size: 5
  }
];

const getRandom = () => mulberry32(0x7d1ec9f1);

export const init = () => {
  DRAWINGS.map(({ canvas, drawFunction, size }) => {
    ROOT_ELEMENT.append(canvas);
    canvas.setAttribute('style', 'width: 100%; aspect-ratio: 2');
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    const coords = new CanvasCoordinates({
      canvas,
      nxRange: [-size, size],
      nyRange: [-size, size]
    });
    const graphics = new Canvas2DGraphics(context, {
      ...OPTIONS,
      coords,
      roughness: 0.1,
      random: getRandom(),
      styles: {
        fontSize: (coords) => coords.width(0.075),
        textAlign: 'center'
      },
      scalarNormalization: 'height'
    });
    const observer = new ResizeObserver(() => {
      graphics.options.random = getRandom();
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
      canvas.width = canvas.clientWidth * window.devicePixelRatio;
      drawFunction(graphics);
    });
    observer.observe(canvas);
    drawFunction(graphics);
  });
};

init();
