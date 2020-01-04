import { TAU } from './constants';

export const rotatePoint = (px, py, cx, cy, angle) => {
    return {
        x: Math.cos(angle) * (px - cx) - Math.sin(angle) * (py - cy) + cx,
        y: Math.sin(angle) * (px - cx) + Math.cos(angle) * (py - cy) + cy
    }
}

export const equilateralTriangle = (x, y, side, rotation) => {

    const v = [];
    const h = side * Math.sqrt(3) / 2

    v.push(rotatePoint(x, y - 2 * h / 3, x, y, rotation));
    v.push(rotatePoint(x + side / 2, y * (h / 3), x, y, rotation));
    v.push(rotatePoint(x - side / 2, y * (h / 3), x, y, rotation));

    return v;

}

export const isocelesTriangle = (x, y, sideOne, sideTwo, rotation) => {

    const v = [];
    const h = Math.sqrt(sideTwo * sideTwo / 4 - sideOne * sideOne);

    v.push(rotatePoint(x, y - 2 * h / 3, x, y, rotation));
    v.push(rotatePoint(x + sideTwo / 2, y * (h / 3), x, y, rotation));
    v.push(rotatePoint(x - sideTwo / 2, y * (h / 3), x, y, rotation));

    return v;

}

export const star = (x, y, scale, rotation) => {

    const v = [];

    v.push(rotatePoint(x + Math.cos(TAU * 5 / 5) * scale, y + Math.sin(TAU * 5 / 5) * scale, x, y, rotation));
    v.push(rotatePoint(x + Math.cos(TAU * 3 / 5) * scale, y + Math.sin(TAU * 3 / 5) * scale, x, y, rotation));
    v.push(rotatePoint(x + Math.cos(TAU * 1 / 5) * scale, y + Math.sin(TAU * 1 / 5) * scale, x, y, rotation));
    v.push(rotatePoint(x + Math.cos(TAU * 4 / 5) * scale, y + Math.sin(TAU * 4 / 5) * scale, x, y, rotation));
    v.push(rotatePoint(x + Math.cos(TAU * 2 / 5) * scale, y + Math.sin(TAU * 2 / 5) * scale, x, y, rotation));
    v.push(rotatePoint(x + Math.cos(TAU * 0 / 5) * scale, y + Math.sin(TAU * 0 / 5) * scale, x, y, rotation));

}

export const regularPolygon = (nSides, size = 1, cx = 0, cy = 0, closedLoop = true, rotate = false, twoDim = false) => {
    const nPoints = closedLoop ? (nSides + 1) : nSides;
    const nCoords = twoDim ? 2 : 3;
    const points = new Float32Array(nPoints * nCoords);
    for (let i = 0; i < nPoints; i++) {
        if (twoDim) {
            points[i * nCoords] = cx + size * Math.cos(i * 2 * Math.PI / nSides);
            points[i * nCoords + 1] = cy + size * Math.sin(i * 2 * Math.PI / nSides);
        } else {
            points[i * nCoords] = cx + size * Math.cos(i * 2 * Math.PI / nSides);
            points[i * nCoords + 1] = rotate ? 0 : cy + size * Math.sin(i * 2 * Math.PI / nSides);
            points[i * nCoords + 2] = rotate ? cy + size * Math.sin(i * 2 * Math.PI / nSides) : 0;
        }
    }
    return points;
}