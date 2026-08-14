// LEGA Audio Engine - Advanced Soundscape, Gemini TTS Decoder & Web Audio Synthesizer
// SHAQILA DIGITAL 99 - LEGA v3.0

/**
 * Converts a raw 16-bit linear PCM base64 string or binary buffer into a playable WAV Blob URL.
 */
export function pcmToWavBlobUrl(base64Data: string, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): string {
  try {
    // Check if it already has a data URL header
    const cleanBase64 = base64Data.includes('base64,') ? base64Data.split('base64,')[1] : base64Data;
    const binaryString = atob(cleanBase64);
    const len = binaryString.length;
    const pcmBytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      pcmBytes[i] = binaryString.charCodeAt(i);
    }

    // Check if it already contains a 'RIFF' header
    if (len >= 4 && binaryString.slice(0, 4) === 'RIFF') {
      const blob = new Blob([pcmBytes], { type: 'audio/wav' });
      return URL.createObjectURL(blob);
    }

    // Otherwise, construct a 44-byte RIFF/WAVE header
    const headerBuffer = new ArrayBuffer(44);
    const view = new DataView(headerBuffer);

    const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
    const blockAlign = numChannels * (bitsPerSample / 8);
    const dataSize = pcmBytes.length;

    // "RIFF"
    view.setUint8(0, 0x52);
    view.setUint8(1, 0x49);
    view.setUint8(2, 0x46);
    view.setUint8(3, 0x46);
    // File size - 8
    view.setUint32(4, 36 + dataSize, true);
    // "WAVE"
    view.setUint8(8, 0x57);
    view.setUint8(9, 0x41);
    view.setUint8(10, 0x56);
    view.setUint8(11, 0x45);
    // "fmt "
    view.setUint8(12, 0x66);
    view.setUint8(13, 0x6d);
    view.setUint8(14, 0x74);
    view.setUint8(15, 0x20);
    // Subchunk1Size (16 for PCM)
    view.setUint32(16, 16, true);
    // AudioFormat (1 for PCM)
    view.setUint16(20, 1, true);
    // NumChannels
    view.setUint16(22, numChannels, true);
    // SampleRate
    view.setUint32(24, sampleRate, true);
    // ByteRate
    view.setUint32(28, byteRate, true);
    // BlockAlign
    view.setUint16(32, blockAlign, true);
    // BitsPerSample
    view.setUint16(34, bitsPerSample, true);
    // "data"
    view.setUint8(36, 0x64);
    view.setUint8(37, 0x61);
    view.setUint8(38, 0x74);
    view.setUint8(39, 0x61);
    // Data size
    view.setUint32(40, dataSize, true);

    const wavBlob = new Blob([headerBuffer, pcmBytes], { type: 'audio/wav' });
    return URL.createObjectURL(wavBlob);
  } catch (err) {
    console.error('Error converting PCM to WAV Blob:', err);
    return '';
  }
}

/**
 * Synthesizes a calming meditation soundscape (Singing Bowl + 432Hz ambient chord + ocean breathing wave)
 * Returns a high-fidelity WAV blob URL generated offline via Web Audio API.
 */
export async function generateMeditationAmbientWav(durationSeconds = 120): Promise<string> {
  const sampleRate = 44100;
  const numChannels = 2;
  const length = sampleRate * durationSeconds;

  const offlineCtx = new (window.OfflineAudioContext || (window as any).webkitOfflineAudioContext)(
    numChannels,
    length,
    sampleRate
  );

  // 1. Root Harmonic Drone (432 Hz, warm peaceful tone)
  const rootFreqs = [108, 216, 432, 648]; // Natural harmonics
  rootFreqs.forEach((freq, idx) => {
    const osc = offlineCtx.createOscillator();
    const gain = offlineCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, 0);

    // Subtle detune for lush binaural warmth
    osc.detune.setValueAtTime((idx % 2 === 0 ? 1 : -1) * 3, 0);

    const baseVol = 0.08 / (idx + 1);
    gain.gain.setValueAtTime(0.001, 0);
    gain.gain.linearRampToValueAtTime(baseVol, 4); // 4s fade in
    gain.gain.setValueAtTime(baseVol, durationSeconds - 5);
    gain.gain.linearRampToValueAtTime(0.001, durationSeconds); // 5s fade out

    osc.connect(gain);
    gain.connect(offlineCtx.destination);
    osc.start(0);
    osc.stop(durationSeconds);
  });

  // 2. Periodic Singing Bowl Bells (every 15-20 seconds)
  const bowlTimes = [1, 20, 45, 75, 100];
  bowlTimes.forEach((t) => {
    if (t < durationSeconds - 5) {
      const bowlOsc1 = offlineCtx.createOscillator();
      const bowlOsc2 = offlineCtx.createOscillator();
      const bowlGain = offlineCtx.createGain();

      bowlOsc1.type = 'sine';
      bowlOsc1.frequency.setValueAtTime(528, t); // Love/Miracle frequency
      bowlOsc2.type = 'sine';
      bowlOsc2.frequency.setValueAtTime(528 * 2.76, t); // Bell overtone

      bowlGain.gain.setValueAtTime(0.001, t);
      bowlGain.gain.linearRampToValueAtTime(0.12, t + 0.1);
      bowlGain.gain.exponentialRampToValueAtTime(0.0001, t + 12); // Long resonant decay

      bowlOsc1.connect(bowlGain);
      bowlOsc2.connect(bowlGain);
      bowlGain.connect(offlineCtx.destination);

      bowlOsc1.start(t);
      bowlOsc1.stop(t + 13);
      bowlOsc2.start(t);
      bowlOsc2.stop(t + 13);
    }
  });

  // 3. Gentle Ocean / Breath Waves (Pink Noise LFO)
  const bufferSize = sampleRate * 4;
  const noiseBuffer = offlineCtx.createBuffer(1, bufferSize, sampleRate);
  const output = noiseBuffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.03;
    b6 = white * 0.115926;
  }

  const noiseSource = offlineCtx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;

  const filter = offlineCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(350, 0);

  const noiseGain = offlineCtx.createGain();
  noiseGain.gain.setValueAtTime(0.03, 0);

  noiseSource.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(offlineCtx.destination);
  noiseSource.start(0);
  noiseSource.stop(durationSeconds);

  // Render to AudioBuffer
  const renderedBuffer = await offlineCtx.startRendering();

  // Convert AudioBuffer to WAV Blob URL
  return audioBufferToWavBlob(renderedBuffer);
}

/**
 * Converts AudioBuffer to WAV Blob
 */
function audioBufferToWavBlob(audioBuffer: AudioBuffer): string {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const length = audioBuffer.length * numChannels * 2;
  const buffer = new ArrayBuffer(44 + length);
  const view = new DataView(buffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, length, true);

  // Interleave channels
  let offset = 44;
  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      let sample = audioBuffer.getChannelData(channel)[i];
      sample = Math.max(-1, Math.min(1, sample));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  const blob = new Blob([buffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Spoken Indonesian Speech Narration via Web Speech API
 */
export function speakIndonesianNarration(
  text: string,
  options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (e: any) => void;
  }
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('SpeechSynthesis is not supported on this browser.');
    return null;
  }

  window.speechSynthesis.cancel(); // Stop any previous speech

  const cleanText = text
    .replace(/\[PAUSE_SHORT\]/gi, '... ')
    .replace(/\[PAUSE_MEDIUM\]/gi, '... ... ')
    .replace(/\[PAUSE_LONG\]/gi, '... ... ... ')
    .replace(/\[Jeda \d+ detik\]/gi, '... ')
    .replace(/[*#_`]/g, '');

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = options?.rate ?? 0.88; // Gentle, slower pace for meditation
  utterance.pitch = options?.pitch ?? 0.95; // Soft warm pitch
  utterance.volume = options?.volume ?? 0.9;
  utterance.lang = 'id-ID';

  // Find Indonesian voice if available
  const voices = window.speechSynthesis.getVoices();
  const idVoice = voices.find((v) => v.lang.startsWith('id') || v.lang.includes('ID'));
  if (idVoice) {
    utterance.voice = idVoice;
  }

  if (options?.onStart) utterance.onstart = options.onStart;
  if (options?.onEnd) utterance.onend = options.onEnd;
  if (options?.onError) utterance.onerror = options.onError;

  window.speechSynthesis.speak(utterance);
  return utterance;
}

/**
 * Stop any ongoing Web Speech narration
 */
export function stopIndonesianNarration() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
