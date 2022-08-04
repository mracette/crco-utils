import './styles.css';
import './utilities.css';
import { drawCircle } from './draw/circle';
import { drawCurve } from './draw/curve';
import { drawDiamond } from './draw/diamond';
import { drawLineSegments } from './draw/lineSegments';
import { drawPolygon } from './draw/polygon';
import { drawSquare } from './draw/square';
import { drawStar } from './draw/star';
import {
  Canvas2DGraphics,
  Canvas2DGraphicsOptions,
  CanvasCoordinates,
  TAU,
  Vector2
} from '../src';
import { Canvas2DGraphicsRough } from '../src/canvas/Canvas2DGraphicsRough';

const OPTIONS: Canvas2DGraphicsOptions = {
  useNormalCoordinates: true,
  stroke: true,
  scalarNormalization: 'width',
  styles: {
    lineWidth: (coords) => coords.width(0.01),
    fillStyle: 'lightblue'
  },
  saveAndRestore: false,
  closePath: false
};

const ROOT_ELEMENT = document.getElementById('root') as HTMLDivElement;

const DRAWINGS = [
  {
    title: 'Circle',
    canvas: document.createElement('canvas'),
    drawFunction: drawCircle
  },
  {
    title: 'Square',
    canvas: document.createElement('canvas'),
    drawFunction: drawSquare
  },
  {
    title: 'Line Segments',
    canvas: document.createElement('canvas'),
    drawFunction: drawLineSegments
  },
  {
    title: 'Diamond',
    canvas: document.createElement('canvas'),
    drawFunction: drawDiamond
  },
  {
    title: 'Star',
    canvas: document.createElement('canvas'),
    drawFunction: drawStar
  },
  {
    title: 'Polygon',
    canvas: document.createElement('canvas'),
    drawFunction: drawPolygon
  },
  {
    title: 'Curve Through Points',
    canvas: document.createElement('canvas'),
    drawFunction: drawCurve
  },
  {
    title: 'Line Segments (rough)',
    canvas: document.createElement('canvas'),
    drawFunction: drawLineSegments,
    rough: true
  },
  {
    title: 'Circle (rough)',
    canvas: document.createElement('canvas'),
    drawFunction: drawCircle,
    rough: true
  },
  {
    title: 'Square (rough)',
    canvas: document.createElement('canvas'),
    drawFunction: drawSquare,
    rough: true
  },
  {
    title: 'Diamond (rough)',
    canvas: document.createElement('canvas'),
    drawFunction: drawDiamond,
    rough: true
  },
  {
    title: 'Star (rough)',
    canvas: document.createElement('canvas'),
    drawFunction: drawStar,
    rough: true
  },
  {
    title: 'Polygon (rough)',
    canvas: document.createElement('canvas'),
    drawFunction: drawPolygon,
    rough: true
  }
];

export const init = () => {
  DRAWINGS.map(({ canvas, drawFunction, title, rough = false }) => {
    ROOT_ELEMENT.append(canvas);
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    const coords = new CanvasCoordinates({
      canvas,
      nxRange: [-3, 3],
      // nxRange: [-1, 1],
      nyRange: [-1, 1]
    });
    const graphics = rough
      ? new Canvas2DGraphicsRough(context, { ...OPTIONS, coords, roughness: 0.05 })
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
