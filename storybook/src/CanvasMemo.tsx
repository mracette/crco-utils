import React, { CSSProperties } from "react";

export const CanvasMemo = React.memo(
  React.forwardRef<HTMLCanvasElement, { style: CSSProperties }>((props, ref) => (
    <canvas {...props} ref={ref} />
  ))
);
