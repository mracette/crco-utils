import { TAU } from './constants';

export const rotatePoint = (px, py, cx, cy, angle) => {
    return {
        x: Math.cos(angle) * (px - cx) - Math.sin(angle) * (py - cy) + cx,
        y: Math.sin(angle) * (px - cx) + Math.cos(angle) * (py - cy) + cy
    }
}

export function equilateralTriangle(x, y, side, rotation) {

    const v = [];
    const h = side * Math.sqrt(3) / 2

    v.push(rotatePoint(x, y - 2 * h / 3, x, y, rotation));
    v.push(rotatePoint(x + side / 2, y * (h / 3), x, y, rotation));
    v.push(rotatePoint(x - side / 2, y * (h / 3), x, y, rotation));

    return v;

}

export function isocelesTriangle(x, y, sideOne, sideTwo, rotation) {

    const v = [];
    const h = Math.sqrt(sideTwo * sideTwo / 4 - sideOne * sideOne);

    v.push(rotatePoint(x, y - 2 * h / 3, x, y, rotation));
    v.push(rotatePoint(x + sideTwo / 2, y * (h / 3), x, y, rotation));
    v.push(rotatePoint(x - sideTwo / 2, y * (h / 3), x, y, rotation));

    return v;

}

export function star(x, y, scale, rotation) {

    const v = [];

    v.push(rotatePoint(x + Math.cos(TAU * 5 / 5) * scale, y + Math.sin(TAU * 5 / 5) * scale, x, y, rotation));
    v.push(rotatePoint(x + Math.cos(TAU * 3 / 5) * scale, y + Math.sin(TAU * 3 / 5) * scale, x, y, rotation));
    v.push(rotatePoint(x + Math.cos(TAU * 1 / 5) * scale, y + Math.sin(TAU * 1 / 5) * scale, x, y, rotation));
    v.push(rotatePoint(x + Math.cos(TAU * 4 / 5) * scale, y + Math.sin(TAU * 4 / 5) * scale, x, y, rotation));
    v.push(rotatePoint(x + Math.cos(TAU * 2 / 5) * scale, y + Math.sin(TAU * 2 / 5) * scale, x, y, rotation));
    v.push(rotatePoint(x + Math.cos(TAU * 0 / 5) * scale, y + Math.sin(TAU * 0 / 5) * scale, x, y, rotation));

}