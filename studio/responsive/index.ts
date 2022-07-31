import { Canvas2DGraphics, Canvas2DGraphicsRough, CanvasCoordinates } from '../../src';
import { Canvas2DGraphicsOptions } from '../../src';
import { drawCircle } from '../draw/circle';
import { drawDiamond } from '../draw/diamond';
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
    title: 'Circle',
    canvas: document.createElement('canvas'),
    drawFunction: drawSquare,
    rough: true
  }
];

export const init = () => {
  DRAWINGS.map(({ canvas, drawFunction, title, rough = false }) => {
    ROOT_ELEMENT.append(canvas);
    canvas.setAttribute('style', 'width: 100%; aspect-ratio: 2');
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    const coords = new CanvasCoordinates({
      canvas,
      nxRange: [-3, 3],
      nyRange: [-1, 1]
    });
    const graphics = rough
      ? new Canvas2DGraphicsRough(context, { ...OPTIONS, coords })
      : new Canvas2DGraphics(context, { ...OPTIONS, coords });
    const observer = new ResizeObserver(() => {
      canvas.height = canvas.clientHeight;
      canvas.width = canvas.clientWidth;
      drawFunction(graphics);
    });
    observer.observe(canvas);
    drawFunction(graphics);
  });
};

init();
