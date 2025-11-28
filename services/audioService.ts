/**
 * Decodes base64 string to raw bytes
 */
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Decodes raw PCM data into an AudioBuffer compatible with Web Audio API
 */
export async function decodeAudioData(
  base64Data: string,
  ctx: AudioContext,
  sampleRate: number = 24000
): Promise<AudioBuffer> {
  const data = decode(base64Data);
  // Gemini TTS returns 16-bit PCM (Int16), mono usually.
  // We need to convert it to Float32 for the AudioContext
  const dataInt16 = new Int16Array(data.buffer);
  const numChannels = 1;
  const frameCount = dataInt16.length / numChannels;
  
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      // Convert Int16 (-32768 to 32767) to Float32 (-1.0 to 1.0)
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
