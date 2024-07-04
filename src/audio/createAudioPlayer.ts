import { error } from 'console';

declare global {
  interface Window {
    webkitOfflineAudioContext: OfflineAudioContext;
  }
}

type CreateAudioBufferSourceNodeOptions = Partial<{
  /** @defaultValue audioBuffer length */
  renderLength: number;
  /** @defaultValue false */
  offlineRendering: boolean;
  /** @defaultValue 0 */
  fadeLength: number;
  /** @defaultValue 'exponential' */
  fadeType: 'exponential' | 'linear';
  /** @defaultValue false */
  loop: boolean;
}>;

// Avoid issues with exponential ramping to 0
const MIN_VOLUME = 0.001;
const MAX_VOLUME = 1;

export const createAudioBufferSourceNode = async (
  audioCtx: AudioContext,
  audioFilePath: string,
  options: CreateAudioBufferSourceNodeOptions = {}
): Promise<AudioBufferSourceNode> => {
  const fadeLength = options.fadeLength || 0;
  const fadeType = options.fadeType || 'exponential';
  const offlineRendering = options.offlineRendering || false;
  const loop = options.loop || true;

  const response = await fetch(audioFilePath);
  const arrayBuffer = await response.arrayBuffer();

  return new Promise<AudioBufferSourceNode>((resolve, reject) => {
    audioCtx.decodeAudioData(
      arrayBuffer,
      (audioBuffer) => {
        if (offlineRendering) {
          const bufferLength = options.renderLength || audioBuffer.length;
          const bufferDuration = bufferLength / audioBuffer.sampleRate;

          const offline = new (window.OfflineAudioContext ||
            window.webkitOfflineAudioContext)(2, bufferLength, audioBuffer.sampleRate);

          offline.oncomplete = (event) => {
            const { renderedBuffer } = event;
            const audioPlayer = audioCtx.createBufferSource();
            audioPlayer.buffer = renderedBuffer;
            resolve(audioPlayer);
          };

          const gainNode = offline.createGain();

          const offlineBuffer = offline.createBufferSource();
          offlineBuffer.loop = loop;
          offlineBuffer.buffer = audioBuffer;
          offlineBuffer.connect(gainNode);
          gainNode.connect(offline.destination);

          if (fadeLength > 0) {
            gainNode.gain.setValueAtTime(MIN_VOLUME, offline.currentTime);
            gainNode.gain.setValueAtTime(
              MAX_VOLUME,
              offline.currentTime + bufferDuration - fadeLength
            );

            if (fadeType === 'exponential') {
              gainNode.gain.exponentialRampToValueAtTime(
                MAX_VOLUME,
                offline.currentTime + fadeLength
              );
              gainNode.gain.exponentialRampToValueAtTime(
                MIN_VOLUME,
                offline.currentTime + bufferDuration
              );
            } else if (fadeType === 'linear') {
              gainNode.gain.linearRampToValueAtTime(
                MAX_VOLUME,
                offline.currentTime + fadeLength
              );
              gainNode.gain.linearRampToValueAtTime(
                MIN_VOLUME,
                offline.currentTime + bufferDuration
              );
            }
          }

          offlineBuffer.start();
          offline.startRendering();
        } else {
          const audioPlayer = audioCtx.createBufferSource();
          audioPlayer.buffer = audioBuffer;
          audioPlayer.loop = loop;
          resolve(audioPlayer);
        }
      },
      (error) => reject(error)
    );
  });
};
