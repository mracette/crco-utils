export const createAudioPlayer = (audioCtx, audioFilePath, options = {}) => {

    const offlineRendering = options.offlineRendering || false;
    const logLevel = options.logLevel || 'none';

    return new Promise((resolve, reject) => {

        loadArrayBuffer(audioFilePath).then((arrayBuffer) => {

            audioCtx.decodeAudioData(arrayBuffer, function (buffer) {

                if (offlineRendering) {

                    const offline = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(
                        2,
                        options.renderLength || buffer.length,
                        buffer.sampleRate
                    );

                    const offlineBuffer = offline.createBufferSource();

                    offlineBuffer.buffer = buffer;
                    offlineBuffer.connect(offline.destination);
                    offlineBuffer.start();
                    offline.startRendering().then((renderedBuffer) => {

                        logLevel === 'debug' && console.log(renderedBuffer);
                        const audioPlayer = audioCtx.createBufferSource();
                        audioPlayer.buffer = renderedBuffer;

                        resolve(audioPlayer);

                    }).catch((err) => {

                        logLevel === 'debug' && console.error(err);
                        reject(err);

                    })

                } else {

                    const audioPlayer = audioCtx.createBufferSource();
                    audioPlayer.buffer = buffer;
                    resolve(audioPlayer);

                }

            }, (err) => {

                logLevel === 'debug' && console.error(err);
                reject(err);

            })

        }).catch((err) => {

            logLevel === 'debug' && console.error(err);
            reject(err);

        })

    })

}

export const loadArrayBuffer = (audioFilePath) => {

    return new Promise((resolve, reject) => {

        const request = new XMLHttpRequest();

        request.responseType = "arraybuffer";

        request.addEventListener('load', () => {
            if (request.status === 200) {
                resolve(request.response);
            }
        })

        request.addEventListener('error', (err) => {
            reject(err);
        })

        request.open('GET', audioFilePath, true);
        request.send();

    });

}