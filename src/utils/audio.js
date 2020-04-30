export const createAudioPlayer = (audioCtx, audioFilePath, options = {}) => {
  const fade = options.fade || false;
  const fadeLength = options.fadeLength || null;
  const fadeType = options.fadeType || "exponential";
  const offlineRendering = options.offlineRendering || false;
  const logLevel = options.logLevel || "none";

  return new Promise((resolve, reject) => {
    loadArrayBuffer(audioFilePath)
      .then((arrayBuffer) => {
        audioCtx.decodeAudioData(
          arrayBuffer,
          function (buffer) {
            if (offlineRendering) {
              const bufferLength = options.renderLength || buffer.length;
              const bufferDuration = bufferLength / buffer.sampleRate;

              const offline = new (window.OfflineAudioContext ||
                window.webkitOfflineAudioContext)(
                2,
                bufferLength,
                buffer.sampleRate
              );

              offline.oncomplete = (event) => {
                const { renderedBuffer } = event;
                logLevel === "debug" && console.log(renderedBuffer);
                const audioPlayer = audioCtx.createBufferSource();
                audioPlayer.buffer = renderedBuffer;
                resolve(audioPlayer);
              };

              const gainNode = offline.createGain();

              const offlineBuffer = offline.createBufferSource();
              offlineBuffer.buffer = buffer;
              offlineBuffer.connect(gainNode);
              gainNode.connect(offline.destination);

              if (fade) {
                gainNode.gain.setValueAtTime(0.001, offline.currentTime);
                gainNode.gain.setValueAtTime(
                  1,
                  offline.currentTime + bufferDuration - fadeLength
                );

                if (fadeType === "exponential") {
                  gainNode.gain.exponentialRampToValueAtTime(
                    1,
                    offline.currentTime + fadeLength
                  );
                  gainNode.gain.exponentialRampToValueAtTime(
                    0.001,
                    offline.currentTime + bufferDuration
                  );
                } else if (fadeType === "linear") {
                  gainNode.gain.linearRampToValueAtTime(
                    1,
                    offline.currentTime + fadeLength
                  );
                  gainNode.gain.linearRampToValueAtTime(
                    0.001,
                    offline.currentTime + bufferDuration
                  );
                }
              }

              offlineBuffer.start();
              offline.startRendering();
            } else {
              const audioPlayer = audioCtx.createBufferSource();
              audioPlayer.buffer = buffer;
              resolve(audioPlayer);
            }
          },
          (err) => {
            logLevel === "debug" && console.error(err);
            reject(err);
          }
        );
      })
      .catch((err) => {
        logLevel === "debug" && console.error(err);
        reject(err);
      });
  });
};

export const loadArrayBuffer = (audioFilePath) => {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.responseType = "arraybuffer";

    request.addEventListener("load", () => {
      if (request.status === 200) {
        resolve(request.response);
      }
    });

    request.addEventListener("error", (err) => {
      reject(err);
    });

    request.open("GET", audioFilePath, true);
    request.send();
  });
};
