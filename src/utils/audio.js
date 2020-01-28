export const createAudioPlayer = (audioCtx, audioFilePath) => {

    return new Promise((resolve, reject) => {

        loadArrayBuffer(audioFilePath).then((arrayBuffer) => {

            audioCtx.decodeAudioData(arrayBuffer, (audioBuffer) => {

                const audioPlayer = audioCtx.createBufferSource();
                audioPlayer.buffer = audioBuffer;

                resolve(audioPlayer);

            }, (err) => {

                console.error(err);
                reject(err);

            })

        }).catch((err) => {

            console.error(err);
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