export const aspectRatioResize = (
  element: HTMLElement,
  aspect: [number, number]
): ResizeObserver | null => {
  if (!element.parentElement) {
    console.warn('aspectRatioResize: element has no parent and cannot be resized');
    return null;
  } else {
    const parent = element.parentElement;
    const [x, y] = aspect;
    const resizeToAspectRatio = () => {
      const { width, height } = parent.getBoundingClientRect();
      const resizeRatio = Math.min(width / x, height / y);
      const currentWidth = element.clientWidth;
      const currentHeight = element.clientHeight;
      const newWidth = Math.round(resizeRatio * x);
      const newHeight = Math.round(resizeRatio * y);
      // Do not resize if the new size is the same as the current size
      // as it has side effects for canvas elements
      if (newWidth !== currentWidth || newHeight !== currentHeight) {
        if (element instanceof HTMLCanvasElement) {
          const dpr = window?.devicePixelRatio || 1;
          element.width = newWidth * dpr;
          element.height = newHeight * dpr;
        }
        element.style.width = newWidth + 'px';
        element.style.height = newHeight + 'px';
      }
    };
    const observer = new ResizeObserver(resizeToAspectRatio);
    observer.observe(parent);
    return observer;
  }
};
