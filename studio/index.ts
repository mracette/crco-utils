import "./styles.css";
import "./utilities.css";
import { aspectRatioResize, Canvas2DGraphics, Vector2 } from "../src";

export const init = () => {
  const canvas = document.getElementById("canvas-main") as HTMLCanvasElement;
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  const resizeObserver = aspectRatioResize(canvas, new Vector2(16, 9));
  const graphics = new Canvas2DGraphics(context, {
    useNormalCoordinates: true,
    stroke: true,
    scalarNormalization: "width",
    styles: {
      lineWidth: (coords) => coords.width(0.01)
    }
  });

  const drawObserver = new ResizeObserver(() => draw(graphics));
  drawObserver.observe(canvas);
};

const draw = (graphics: Canvas2DGraphics) => {
  graphics.circle(0, 0, 0.25);
};

init();
