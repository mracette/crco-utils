import { CanvasCoordinates } from "./CanvasCoordinates";

let coords: CanvasCoordinates;

// a simple canvas mock
let canvas = {
  width: 100,
  height: 100
} as HTMLCanvasElement;

const testXnAndInverse = (coords: CanvasCoordinates, n: number, x: number) => {
  expect(coords.nx(n)).toBe(x);
  expect(coords.xn(x)).toBe(n);
};

const testYnAndInverse = (coords: CanvasCoordinates, n: number, y: number) => {
  expect(coords.ny(n)).toBe(y);
  expect(coords.yn(y)).toBe(n);
};

test("initialization errors", () => {
  expect(() => {
    new CanvasCoordinates();
  }).toThrow();
  expect(() => {
    new CanvasCoordinates({ baseWidth: 1 });
  }).toThrow();
  expect(() => {
    new CanvasCoordinates({ baseHeight: 1 });
  }).toThrow();
  expect(() => {
    new CanvasCoordinates({ baseWidth: 1, baseHeight: 1 });
  }).not.toThrow();
  expect(() => {
    new CanvasCoordinates({ canvas });
  }).not.toThrow();
});

describe("padding", () => {
  test("base padding is proportional to dimensions", () => {
    canvas = { width: 100, height: 200 } as HTMLCanvasElement;
    coords = new CanvasCoordinates({
      canvas,
      padding: 0.1
    });
    testXnAndInverse(coords, -1, 10);
    testXnAndInverse(coords, 1, 90);
    testYnAndInverse(coords, -1, 20);
    testYnAndInverse(coords, 1, 180);
  });

  test("x and y padding are equal when equalPadding is true", () => {
    canvas = { width: 100, height: 200 } as HTMLCanvasElement;
    coords = new CanvasCoordinates({
      canvas,
      padding: 0.1,
      equalPadding: true
    });
    expect(coords.nx(-1)).toEqual(coords.ny(-1));
    expect(canvas.width - coords.nx(1)).toEqual(canvas.height - coords.ny(1));
    canvas = { width: 200, height: 100 } as HTMLCanvasElement;
    coords = new CanvasCoordinates({
      canvas,
      padding: 0.1,
      equalPadding: true
    });
    expect(coords.nx(-1)).toEqual(coords.ny(-1));
    expect(canvas.width - coords.nx(1)).toEqual(canvas.height - coords.ny(1));
  });

  test("separate padding for x and y", () => {
    canvas = { width: 100, height: 200 } as HTMLCanvasElement;
    coords = new CanvasCoordinates({
      canvas,
      paddingX: 0.1,
      paddingY: 0.2
    });
    testXnAndInverse(coords, -1, 10);
    testXnAndInverse(coords, 1, 90);
    testYnAndInverse(coords, -1, 40);
    testYnAndInverse(coords, 1, 160);
  });
});

describe("width and height", () => {
  test("width", () => {
    canvas = { width: 100, height: 100 } as HTMLCanvasElement;
    coords = new CanvasCoordinates({
      canvas
    });
    expect(coords.width()).toBe(100);
    expect(coords.width(0.5)).toBe(50);
    expect(coords.width(2)).toBe(200);
    coords = new CanvasCoordinates({
      baseWidth: 100,
      baseHeight: 100
    });
    expect(coords.width()).toBe(100);
    expect(coords.width(0.5)).toBe(50);
    expect(coords.width(2)).toBe(200);
  });

  test("height", () => {
    canvas = { width: 100, height: 100 } as HTMLCanvasElement;
    coords = new CanvasCoordinates({
      canvas
    });
    expect(coords.height()).toBe(100);
    expect(coords.height(0.5)).toBe(50);
    expect(coords.height(2)).toBe(200);
    coords = new CanvasCoordinates({
      baseWidth: 100,
      baseHeight: 100
    });
    expect(coords.height()).toBe(100);
    expect(coords.height(0.5)).toBe(50);
    expect(coords.height(2)).toBe(200);
  });
});
