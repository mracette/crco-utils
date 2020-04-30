/**
 * @param {object} context The canvas context to draw with
 * @param {*} resolution The number of line segments
 * @param {*} fn A function that takes a normalized input in the [0, 1] range and returns
 * an [x, y] array that describes the coordinates of the line at that point.
 */

export const drawLine2D = (context, resolution, fn) => {
  context.beginPath();
  for (let i = 0; i <= resolution; i++) {
    const coords = fn(i / resolution);
    if (i === 0) {
      context.moveTo(coords[0], coords[1]);
    } else {
      context.lineTo(coords[0], coords[1]);
    }
  }
  context.stroke();
};

export const createBlobFromDataURL = (dataURL) => {
  return new Promise((resolve) => {
    const splitIndex = dataURL.indexOf(",");
    if (splitIndex === -1) {
      resolve(new window.Blob());
      return;
    }
    const base64 = dataURL.slice(splitIndex + 1);
    const byteString = window.atob(base64);
    const type = dataURL.slice(0, splitIndex);
    const mimeMatch = /data:([^;]+)/.exec(type);
    const mime = (mimeMatch ? mimeMatch[1] : "") || undefined;
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    resolve(new window.Blob([ab], { type: mime }));
  });
};

/**
 * @param {object} dataUrl The canvas context to draw with
 * @param {string} filename The filename for the output
 */

export const canvasToPng = (canvas, filename) => {
  const dataUrl = canvas.toDataURL("image/png");
  createBlobFromDataURL(dataUrl).then((blob) => {
    console.log(blob);

    const link = document.createElement("a");
    link.style.visibility = "hidden";
    link.target = "_blank";
    link.download = filename;
    link.href = window.URL.createObjectURL(blob);
    document.body.appendChild(link);

    link.onclick = () => {
      link.onclick = () => {};
      setTimeout(() => {
        window.URL.revokeObjectURL(blob);
        if (link.parentElement) link.parentElement.removeChild(link);
        link.removeAttribute("href");
      });
    };

    link.click();
  });
};
