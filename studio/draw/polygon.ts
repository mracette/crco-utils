import { Canvas2DGraphics } from '../../src';
import { polygon } from '../../src/geometry/polygon';

export const drawPolygon = (graphics: Canvas2DGraphics) => {
  graphics.lineSegments(polygon(0, 0, 0.5), { fill: true });
};
