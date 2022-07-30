import "./styles.css";
import "./utilities.css";
import { Canvas2DGraphics, Canvas2DGraphicsOptions, TAU, Vector2 } from "../src";
import { Canvas2DGraphicsRough } from "../src/canvas/Canvas2DGraphicsRough";

const ORIGIN = new Vector2(0, 0);

const OPTIONS: Canvas2DGraphicsOptions = {
  useNormalCoordinates: true,
  stroke: true,
  scalarNormalization: "width",
  styles: {
    lineWidth: (coords) => coords.width(0.01)
  },
  saveAndRestore: false
};

const drawCircle = (graphics: Canvas2DGraphics) => {
  graphics.circle(0, 0, 0.25);
};

const drawSquare = (graphics: Canvas2DGraphics) => {
  graphics.rect(-0.5, -0.5, 0.5, 0.5);
};

const drawDiamond = (graphics: Canvas2DGraphics) => {
  graphics.rect(-0.5, -0.5, 0.5, 0.5, {
    styles: {
      scale: { origin: ORIGIN, scale: new Vector2(0.5, 1), constantLineWidth: true },
      rotation: { origin: ORIGIN, rotation: TAU / 8 }
    }
  });
};

const drawLineSegments = (graphics: Canvas2DGraphics) => {
  graphics.lineSegments([
    [-0.5, -0.5],
    [0.5, -0.5],
    [-0.5, 0.5],
    [0.5, 0.5]
  ]);
};

const ROOT_ELEMENT = document.getElementById("root") as HTMLDivElement;

const DRAWINGS = [
  {
    title: "Circle",
    canvas: document.createElement("canvas"),
    drawFunction: drawCircle
  },
  {
    title: "Square",
    canvas: document.createElement("canvas"),
    drawFunction: drawSquare
  },
  {
    title: "Line Segments",
    canvas: document.createElement("canvas"),
    drawFunction: drawLineSegments
  },
  {
    title: "Diamond",
    canvas: document.createElement("canvas"),
    drawFunction: drawDiamond
  },
  {
    title: "Line Segments (rough)",
    canvas: document.createElement("canvas"),
    drawFunction: drawLineSegments,
    rough: true
  },
  {
    title: "Circle (rough)",
    canvas: document.createElement("canvas"),
    drawFunction: drawCircle,
    rough: true
  }
];

export const init = () => {
  DRAWINGS.map(({ canvas, drawFunction, title, rough = false }) => {
    ROOT_ELEMENT.append(canvas);
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    const graphics = rough
      ? new Canvas2DGraphicsRough(context, OPTIONS)
      : new Canvas2DGraphics(context, OPTIONS);
    const observer = new ResizeObserver(() => {
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
      canvas.width = canvas.clientWidth * window.devicePixelRatio;
      drawFunction(graphics);
    });
    observer.observe(canvas);
    drawFunction(graphics);
  });
};

init();
