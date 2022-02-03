import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  BoundedSineFunction,
  CanvasCoordinates,
  BoundedSineParams,
  boundedSine,
  DPR,
  TAU,
  Canvas2DGraphics,
  Canvas2DStyle,
  CanvasDimensions
} from "crco-utils";
import { CanvasMemo } from "../../CanvasMemo";

const NUM_POINTS = 256;
const DARK = "rgb(13, 17, 23)";
const LIGHT = "rgb(255, 255, 255)";

const BASE_STYLES: Canvas2DStyle = {
  strokeStyle: LIGHT,
  fillStyle: LIGHT,
  lineWidth: 3,
  lineWidthIsProportionalTo: CanvasDimensions.Height,
  lineCap: "round",
  fontFamily: "sans-serif",
  fontSize: 0.05,
  fontSizeIsProportionalTo: CanvasDimensions.Height
};

const AXES_STYLES: Canvas2DStyle = {
  lineWidth: 1,
  lineWidthIsProportionalTo: CanvasDimensions.Height
};

const TEXT_PADDING = 0.03;

const drawPoints = (
  graphics: Canvas2DGraphics,
  {
    yStart,
    translateY,
    yMin,
    yMax,
    period,
    translateX,
    invert
  }: Required<BoundedSineParams>
) => {
  const { coords } = graphics;
  const phaseShift =
    Math.asin((2 * (yStart - yMin)) / (yMax - yMin) - 1) * (period / TAU);

  // y-axis min
  graphics.text(
    coords.nyRange[0].toString(),
    coords.nx(0),
    coords.ny(coords.nyRange[0]) + coords.height(TEXT_PADDING),
    {
      styles: { textAlign: "center", textBaseline: "top" },
      useNormalCoordinates: false
    }
  );

  // y-axis max
  graphics.text(
    coords.nyRange[1].toString(),
    coords.nx(0),
    coords.ny(coords.nyRange[1]) - coords.height(TEXT_PADDING),
    {
      styles: { textAlign: "center", textBaseline: "bottom" },
      useNormalCoordinates: false
    }
  );

  // yMax
  const yMaxCoords = [
    parseFloat((0.25 * period - phaseShift + (translateX % period)).toPrecision(2)),
    (invert ? -1 : 1) * (yMax + translateY)
  ] as [number, number];

  graphics.circle(yMaxCoords[0], yMaxCoords[1], coords.height(0.01), {
    fill: true
  });

  graphics.text(
    `(${yMaxCoords.join(", ")})`,
    coords.nx(yMaxCoords[0]),
    coords.ny(yMaxCoords[1]) - coords.height(TEXT_PADDING),
    {
      styles: { textAlign: "center", textBaseline: "bottom" },
      useNormalCoordinates: false
    }
  );

  // yMin
  const yMinCoords = [
    parseFloat((0.75 * period - phaseShift + (translateX % period)).toPrecision(2)),
    (invert ? -1 : 1) * (yMin + translateY)
  ] as [number, number];

  graphics.circle(yMinCoords[0], yMinCoords[1], coords.height(0.01), {
    fill: true
  });

  graphics.text(
    `(${yMinCoords.join(", ")})`,
    coords.nx(yMinCoords[0]),
    coords.ny(yMinCoords[1]) + coords.height(TEXT_PADDING),
    {
      styles: { textAlign: "center", textBaseline: "top" },
      useNormalCoordinates: false
    }
  );

  // 0, yStart
  graphics.circle(0, yStart + translateY, coords.height(0.01), {
    fill: true
  });

  graphics.text(
    `(0, ${yStart + translateY})  `,
    0,
    yStart + translateY,
    { styles: { textAlign: "right", textBaseline: "middle" } } // + padding
  );

  // period, yStart
  graphics.circle(period, yStart + translateY, coords.height(0.01), { fill: true });
  graphics.text(
    `  (${period.toString()}, ${yStart + translateY})`,
    period,
    yStart + translateY,
    {
      styles: { textAlign: "left", textBaseline: "middle" }
    }
  );
};

const drawAxes = (
  graphics: Canvas2DGraphics,
  { translateY, yMin, yMax, period }: Required<BoundedSineParams>
) => {
  const yMinAdj = Math.min(translateY + yMin, yMin);
  const yMaxAdj = Math.max(translateY + yMax, yMax);
  const xAxisPoints = [
    [0, 0],
    [period, 0]
  ];
  const yAxisPoints = [
    [0, yMinAdj],
    [0, yMaxAdj]
  ];
  graphics.lineSegments(xAxisPoints, { styles: AXES_STYLES });
  graphics.lineSegments(yAxisPoints, { styles: AXES_STYLES });
};

const drawCurve = (
  fn: BoundedSineFunction,
  graphics: Canvas2DGraphics,
  params: Required<BoundedSineParams>
) => {
  const points = new Array(NUM_POINTS).fill(null).map((_, i) => {
    return [
      (params.period * i) / (NUM_POINTS - 1),
      fn((params.period * i) / (NUM_POINTS - 1))
    ];
  });
  graphics.lineSegments(points, { styles: BASE_STYLES });
};

const draw = (
  fn: BoundedSineFunction,
  graphics: Canvas2DGraphics,
  params: Required<BoundedSineParams>
) => {
  graphics.clear();
  graphics.rect(
    0,
    0,
    graphics.context.canvas.width,
    graphics.context.canvas.height,
    {
      styles: { fillStyle: DARK },
      fill: true,
      useNormalCoordinates: false
    }
  );
  drawCurve(fn, graphics, params);
  drawAxes(graphics, params);
  drawPoints(graphics, params);
};

export type BoundedSineProps = Required<BoundedSineParams>;

export const BoundedSine: FC<BoundedSineProps> = (props) => {
  const { yStart, period, yMin, yMax, translateX, translateY, invert } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [coords, setCoords] = useState<CanvasCoordinates>();
  const [graphics, setGraphics] = useState<Canvas2DGraphics>();
  const [bSine, setBSine] = useState<BoundedSineFunction>(() =>
    boundedSine({ period })
  );

  const render = useCallback(() => {
    const context = canvasRef?.current?.getContext("2d");
    coords && context && graphics && draw(bSine, graphics, props);
  }, [bSine, coords, graphics, props]);

  useEffect(() => {
    const coords = new CanvasCoordinates({
      canvas: canvasRef.current!,
      padding: 0.1,
      equalPadding: false,
      // @ts-ignore
      yAxisOrientation: "up"
    });
    coords.nyRange = [
      Math.min(translateY + yMin, yMin),
      Math.max(translateY + yMax, yMax)
    ];
    coords.nxRange = [0, period];
    setCoords(coords);

    const graphics = new Canvas2DGraphics(
      canvasRef.current?.getContext("2d")!,
      coords,
      { stroke: true, styles: BASE_STYLES, useNormalCoordinates: true }
    );
    setGraphics(graphics);

    setBSine(() =>
      boundedSine({ yStart, period, yMin, yMax, translateX, translateY, invert })
    );
  }, [yStart, period, yMin, yMax, translateX, translateY, invert]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const observer = new ResizeObserver(() => {
      if (canvasRef.current) {
        canvasRef.current.width = canvasRef.current.clientWidth * DPR;
        canvasRef.current.height = canvasRef.current.clientHeight * DPR;
      }
      render();
    });
    observer.observe(canvas);
    render();
    return () => observer.unobserve(canvas);
  }, [render]);

  useEffect(() => {});

  return (
    <CanvasMemo
      style={{ width: "100%", height: "100%", minHeight: "40vh" }}
      ref={canvasRef}
    />
  );
};
