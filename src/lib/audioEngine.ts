// LEGA Audio Engine - Premium Relaxation Soundscapes & Ambient Synthesizer
// SHAQILA DIGITAL 99 - LEGA v3.0

import { NatureSoundType, AmbientMusicType, AudioRelaxationMetadata } from '../types';

export interface SoundscapeOptions {
  natureType?: NatureSoundType;
  natureTypes?: NatureSoundType[];
  ambientType?: AmbientMusicType;
  natureVolume?: number; // 0.0 - 1.0 (recommended: 0.2 - 0.3)
  musicVolume?: number; // 0.0 - 1.0 (recommended: 0.15 - 0.25)
  fadeInSeconds?: number;
  fadeOutSeconds?: number;
  includeSingingBowl?: boolean;
}

/**
 * LEGA CALM NATURE - Official Universal Relaxation Audio Configuration
 * Designed as a universal companion for self-awareness, relaxation, meditation,
 * breathing, reflection, and peace of mind.
 */
export const LEGA_CALM_NATURE_CONFIG = {
  id: 'lega-calm-nature',
  title: 'LEGA CALM NATURE',
  tagline: 'Temani dirimu berhenti sejenak, hadir saat ini, dan menikmati ketenangan.',
  category: 'Universal Relaxation Soundscape',
  atmospheres: [
    { icon: '🌊', label: 'Air mengalir lembut', desc: 'Arus sungai pegunungan yang jernih dan mengalir stabil' },
    { icon: '🐦', label: 'Burung yang natural dan jauh', desc: 'Kicau burung fajar yang lembut dan bergema di kejauhan' },
    { icon: '🍃', label: 'Angin lembut di pepohonan', desc: 'Semilir hembusan angin sejuk menaungi dedaunan rimbun' },
    { icon: '🎹', label: 'Musik ambient/piano yang sangat lembut', desc: 'Sentuhan tuts piano pentatonik 432Hz yang hangat dan menenangkan' }
  ],
  characteristics: [
    'Tenang',
    'Lembut',
    'Natural',
    'Hangat',
    'Menenteramkan',
    'Tidak ada suara mengejutkan',
    'Tidak ada perubahan volume mendadak'
  ],
  purposes: [
    'Kesadaran Diri',
    'Relaksasi',
    'Meditasi',
    'Pernapasan',
    'Refleksi',
    'Ketenangan Pikiran'
  ],
  headsetAdvice: 'Gunakan headset atau earphone untuk pengalaman audio yang lebih optimal dan imersif.',
  recommendedScript: 'Selamat datang di ruang tenang Anda. Ambil posisi yang nyaman dan biarkan tubuh Anda bersandar dengan rileks. Rasakan aliran udara sejuk masuk saat Anda menarik napas, dan lepaskan seluruh ketegangan saat Anda menghembuskannya perlahan. Dengarkan gemericik air yang mengalir lembut... desau angin yang menaungi pepohonan... dan kicau burung di kejauhan. Biarkan alunan piano lembut ini menemani Anda hadir seutuhnya di saat ini. Di sini, Anda aman, tenang, dan utuh.'
};

export const NATURE_SOUND_DEFINITIONS: Record<NatureSoundType, {
  name: string;
  description: string;
  recommendedTheme: string;
  defaultNatureVolume: number;
  defaultMusicVolume: number;
  defaultAmbient: AmbientMusicType;
  loopRecommendation: string;
}> = {
  'aliran-sungai': {
    name: 'Aliran Sungai Alami',
    description: 'Gemericik arus air sungai pegunungan yang jernih dan mengalir konstan membawa keheningan.',
    recommendedTheme: 'Pelepasan Beban Pikiran & Ketenangan Mengalir',
    defaultNatureVolume: 0.26,
    defaultMusicVolume: 0.20,
    defaultAmbient: 'piano-lembut',
    loopRecommendation: 'Seamless Organic Crossfade Loop (30 Detik)'
  },
  'gemericik-air': {
    name: 'Gemericik Air',
    description: 'Tetesan dan percikan air lembut di atas bebatuan alami yang menyegarkan batin.',
    recommendedTheme: 'Kehadiran Momen Ini & Kejernihan Jiwa',
    defaultNatureVolume: 0.24,
    defaultMusicVolume: 0.20,
    defaultAmbient: 'piano-lembut',
    loopRecommendation: 'Granular Ripple Loop (25 Detik)'
  },
  'burung-pagi': {
    name: 'Burung Pagi',
    description: 'Kicauan burung fajar di taman yang tenang dengan embun dan semilir udara segar.',
    recommendedTheme: 'Optimisme & Memulai Hari dengan Hati Lapang',
    defaultNatureVolume: 0.22,
    defaultMusicVolume: 0.18,
    defaultAmbient: 'string-halus',
    loopRecommendation: 'Randomized Melody Cycle (45 Detik)'
  },
  'angin-pepohonan': {
    name: 'Angin di Pepohonan',
    description: 'Semilir hembusan angin sejuk yang menggerakkan dedaunan rimbun dengan ritme lambat.',
    recommendedTheme: 'Pelepasan Ketegangan Fisik & Pengheningan',
    defaultNatureVolume: 0.25,
    defaultMusicVolume: 0.20,
    defaultAmbient: 'pad-sinematik',
    loopRecommendation: 'Atmospheric Breeze Cycle (30 Detik)'
  },
  'ombak-pantai': {
    name: 'Ombak Pantai',
    description: 'Deburan ombak laut yang lembut dan berirama menyelaraskan napas dengan ritme alam.',
    recommendedTheme: 'Relaksasi Mendalam & Penyelarasan Napas',
    defaultNatureVolume: 0.28,
    defaultMusicVolume: 0.18,
    defaultAmbient: 'pad-sinematik',
    loopRecommendation: 'Tidal Wave Dynamic Loop (20 Detik)'
  },
  'hutan-alami': {
    name: 'Hutan Alami',
    description: 'Suasana kanopi hutan alami tropis yang damai, hangat, dan menaungi jiwa.',
    recommendedTheme: 'Grounding Batin & Rasa Terhubung dengan Alam',
    defaultNatureVolume: 0.25,
    defaultMusicVolume: 0.22,
    defaultAmbient: 'string-halus',
    loopRecommendation: 'Deep Rainforest Continuous Loop (40 Detik)'
  },
  'hujan-lembut': {
    name: 'Hujan Lembut',
    description: 'Rintik hujan tenang di atas dedaunan yang membasuh kecemasan dan mengantar istirahat.',
    recommendedTheme: 'Kenyamanan Emosional & Pengantar Tidur Nyenyak',
    defaultNatureVolume: 0.26,
    defaultMusicVolume: 0.18,
    defaultAmbient: 'piano-lembut',
    loopRecommendation: 'Continuous White/Pink Rain Loop (30 Detik)'
  },
  'suasana-malam': {
    name: 'Suasana Malam Tenang',
    description: 'Keheningan malam dengan desau angin malam lembut dan jangkrik halus menenangkan pikiran.',
    recommendedTheme: 'Relaksasi Menjelang Tidur & Pengheningan Malam',
    defaultNatureVolume: 0.22,
    defaultMusicVolume: 0.18,
    defaultAmbient: 'piano-hangat',
    loopRecommendation: 'Nocturnal Calm Cycle (30 Detik)'
  },
  'suasana-alam-tenang': {
    name: 'Suasana Alam Tenang',
    description: 'Paduan alam hening dengan angin sepoi-sepoi dan gemerisik dedaunan minimal.',
    recommendedTheme: 'Fokus Bekerja, Belajar & Meditasi Sadar',
    defaultNatureVolume: 0.24,
    defaultMusicVolume: 0.16,
    defaultAmbient: 'ambient-minimal',
    loopRecommendation: 'Zen Nature Loop (30 Detik)'
  },
  'fajar-tenang': {
    name: 'Fajar Menenteramkan',
    description: 'Kesejukan udara fajar dengan kicau burung lembut kejauhan dan kehangatan sinar mentari.',
    recommendedTheme: 'Kesegaran Pagi & Menemukan Ruang Tenang Diri',
    defaultNatureVolume: 0.24,
    defaultMusicVolume: 0.20,
    defaultAmbient: 'piano-hangat',
    loopRecommendation: 'Dawn Horizon Cycle (35 Detik)'
  }
};

export const AMBIENT_MUSIC_DEFINITIONS: Record<AmbientMusicType, {
  name: string;
  description: string;
  character: string;
}> = {
  'piano-lembut': {
    name: 'Piano Lembut Akustik (432Hz)',
    description: 'Sentuhan tuts piano hangat bernada pentatonik lembut yang menenangkan sistem saraf.',
    character: 'Hangat, Jernih, Lembut & Menenteramkan'
  },
  'piano-hangat': {
    name: 'Piano Ambient Hangat (432Hz)',
    description: 'Progresi harmoni piano solfeggio lembut dengan suasana teduh dan menenteramkan batin.',
    character: 'Hangat, Dalam, Teduh & Menghanyutkan'
  },
  'pad-sinematik': {
    name: 'Pad Sinematik Mengalun (432Hz)',
    description: 'Lapisan suara pad analog yang mengambang perlahan memberi rasa aman dan ruang batin luas.',
    character: 'Mendalam, Melayang, Luas & Memeluk'
  },
  'string-halus': {
    name: 'String Halus Meditatif (528Hz)',
    description: 'Gesekan dawai senar orkestra halus dengan resonansi panjang yang meredakan emosi.',
    character: 'Elegan, Menghanyutkan, Teduh & Damai'
  },
  'ambient-minimal': {
    name: 'Musik Ambient Minimal (432Hz)',
    description: 'Dengung nada hening minimalis tanpa melodi mencolok untuk kejernihan konsentrasi dan istirahat.',
    character: 'Minimalis, Hening, Ringan & Menyejukkan'
  }
};

/**
 * Indonesian Vocal Character Profiles
 */
export interface VoiceCharacterProfile {
  name: string; // Internal key (e.g. Kore, Zephyr, Puck, Fenrir, Charon, Aoede)
  indonesianName: string;
  label: string;
  gender: 'female' | 'male';
  tone: string;
  pitch: number;
  rate: number;
  description: string;
  samplePhrase: string;
}

export const VOICE_CHARACTERS: VoiceCharacterProfile[] = [
  {
    name: 'Kore',
    indonesianName: 'Laras (Feminin Lembut)',
    label: 'Kore — Laras (Lembut, Tenang & Hangat)',
    gender: 'female',
    tone: 'Feminin Lembut & Mengayomi',
    pitch: 1.05,
    rate: 0.80,
    description: 'Artikulasi lembut menyejukkan batin, cocok untuk meditasi, kesadaran diri, dan refleksi mendalam.',
    samplePhrase: 'Selamat datang. Ambil napas lembut... izinkan tubuh dan pikiran Anda beristirahat dalam ketenangan.'
  },
  {
    name: 'Zephyr',
    indonesianName: 'Bayu (Maskulin Hangat)',
    label: 'Zephyr — Bayu (Hangat, Bersahabat & Jernih)',
    gender: 'male',
    tone: 'Maskulin Hangat & Bersahabat',
    pitch: 0.88,
    rate: 0.84,
    description: 'Vokal maskulin yang bersahabat dan tenang, seperti sahabat setia yang mendengarkan tanpa menghakimi.',
    samplePhrase: 'Mari berhenti sejenak. Sadari apa yang sedang Anda rasakan saat ini dengan jujur dan lapang dada.'
  },
  {
    name: 'Puck',
    indonesianName: 'Damai (Ramah & Santai)',
    label: 'Puck — Damai (Ramah, Rileks & Mengalir)',
    gender: 'female',
    tone: 'Ramah, Mengalir & Meringankan',
    pitch: 1.12,
    rate: 0.85,
    description: 'Nada ramah dan santai yang membantu melepaskan overthinking dan meredakan ketegangan harian.',
    samplePhrase: 'Tarik napas sejenak. Anda tidak perlu menyelesaikan semuanya sekaligus saat ini. Hadirlah di sini.'
  },
  {
    name: 'Fenrir',
    indonesianName: 'Arga (Grounded & Dalam)',
    label: 'Fenrir — Arga (Suara Dalam, Mantap & Grounded)',
    gender: 'male',
    tone: 'Maskulin Dalam & Berjangkar',
    pitch: 0.72,
    rate: 0.76,
    description: 'Resonansi vokal dalam dan stabil yang sangat efektif untuk meredakan kepanikan dan kecemasan tinggi.',
    samplePhrase: 'Rasakan pijakan kaki Anda di bumi. Napas Anda aman. Saat ini Anda berada dalam ruang yang terlindungi.'
  },
  {
    name: 'Charon',
    indonesianName: 'Sinta (Bisikan Hening Pengantar Tidur)',
    label: 'Charon — Sinta (Hening Khusus Menjelang Tidur)',
    gender: 'female',
    tone: 'Lembut Hening & Meditatif',
    pitch: 0.82,
    rate: 0.72,
    description: 'Tempo sangat lambat dan bisikan damai yang menuntun otot tubuh menuju tidur lelap yang berkualitas.',
    samplePhrase: 'Hari ini telah selesai. Lepaskan semua beban pikiran... pejamkan mata Anda dan beristirahatlah dengan damai.'
  },
  {
    name: 'Aoede',
    indonesianName: 'Nirmala (Welas Asih & Teduh)',
    label: 'Aoede — Nirmala (Penuh Welas Asih & Menyejukkan)',
    gender: 'female',
    tone: 'Welas Asih & Penuh Penerimaan',
    pitch: 0.98,
    rate: 0.78,
    description: 'Vokal penuh kehangatan welas asih, cocok untuk latihan memaafkan diri, rasa syukur, dan inner child.',
    samplePhrase: 'Terima kasih telah bertahan sejauh ini. Berikan pelukan hangat dan penerimaan tulus bagi diri Anda hari ini.'
  }
];

/**
 * Builds standard relaxation metadata based on category / selected sounds
 */
export function buildAudioRelaxationMetadata(
  themeTitle: string,
  nature: NatureSoundType = 'aliran-sungai',
  ambient: AmbientMusicType = 'piano-lembut',
  customOverrides?: Partial<AudioRelaxationMetadata>
): AudioRelaxationMetadata {
  const natDef = NATURE_SOUND_DEFINITIONS[nature] || NATURE_SOUND_DEFINITIONS['aliran-sungai'];
  const ambDef = AMBIENT_MUSIC_DEFINITIONS[ambient] || AMBIENT_MUSIC_DEFINITIONS['piano-lembut'];

  return {
    atmosphereTheme: themeTitle || natDef.recommendedTheme,
    natureSoundType: nature,
    natureSoundLabel: natDef.name,
    ambientMusicType: ambient,
    ambientMusicLabel: ambDef.name,
    narrationVolume: 90, // Narasi 90% (Jernih & Utama)
    natureVolume: Math.round(natDef.defaultNatureVolume * 100), // Suara alam 22-28%
    musicVolume: Math.round(natDef.defaultMusicVolume * 100), // Musik ambient 18-22%
    fadeInSeconds: 4.5,
    fadeOutSeconds: 6.0,
    loopRecommendation: natDef.loopRecommendation,
    voiceWarmthDescription: 'Suara Bahasa Indonesia hangat, lembut, artikulasi tenang, dan ritme perlahan.',
    ...customOverrides
  };
}

/**
 * Converts a raw 16-bit linear PCM base64 string or binary buffer into a playable WAV Blob URL.
 */
export function pcmToWavBlobUrl(base64Data: string, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): string {
  try {
    const cleanBase64 = base64Data.includes('base64,') ? base64Data.split('base64,')[1] : base64Data;
    const binaryString = atob(cleanBase64);
    const len = binaryString.length;
    const pcmBytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      pcmBytes[i] = binaryString.charCodeAt(i);
    }

    if (len >= 4 && binaryString.slice(0, 4) === 'RIFF') {
      const blob = new Blob([pcmBytes], { type: 'audio/wav' });
      return URL.createObjectURL(blob);
    }

    const headerBuffer = new ArrayBuffer(44);
    const view = new DataView(headerBuffer);

    const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
    const blockAlign = numChannels * (bitsPerSample / 8);
    const dataSize = pcmBytes.length;

    // "RIFF"
    view.setUint8(0, 0x52); view.setUint8(1, 0x49); view.setUint8(2, 0x46); view.setUint8(3, 0x46);
    view.setUint32(4, 36 + dataSize, true);
    // "WAVE"
    view.setUint8(8, 0x57); view.setUint8(9, 0x41); view.setUint8(10, 0x56); view.setUint8(11, 0x45);
    // "fmt "
    view.setUint8(12, 0x66); view.setUint8(13, 0x6d); view.setUint8(14, 0x74); view.setUint8(15, 0x20);
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    // "data"
    view.setUint8(36, 0x64); view.setUint8(37, 0x61); view.setUint8(38, 0x74); view.setUint8(39, 0x61);
    view.setUint32(40, dataSize, true);

    const wavBlob = new Blob([headerBuffer, pcmBytes], { type: 'audio/wav' });
    return URL.createObjectURL(wavBlob);
  } catch (err) {
    console.error('Error converting PCM to WAV Blob:', err);
    return '';
  }
}

// Cache for generated soundscape WAV URLs
const soundscapeWavCache = new Map<string, string>();

/**
 * Synthesizes a high-fidelity relaxation soundscape (Nature Sound + Ambient Music + Solfeggio 432/528Hz Bowls)
 * Returns a high-quality playable WAV blob URL generated quickly via Web Audio API.
 * Uses a smooth 24-second seamless loop that takes <60ms to generate.
 */
export async function generateRelaxationSoundscapeWav(
  durationSeconds = 24,
  options?: SoundscapeOptions
): Promise<string> {
  const selectedNatureTypes: NatureSoundType[] = (options?.natureTypes && options.natureTypes.length > 0)
    ? options.natureTypes
    : [options?.natureType || 'aliran-sungai'];

  const ambientType = options?.ambientType || 'piano-lembut';
  const natureVol = options?.natureVolume ?? 0.25;
  const musicVol = options?.musicVolume ?? 0.20;
  const fadeIn = Math.min(options?.fadeInSeconds ?? 2.5, 4.0);
  const fadeOut = Math.min(options?.fadeOutSeconds ?? 3.0, 4.0);
  const withBowl = options?.includeSingingBowl !== false;

  // Cap generation length to 24s for instantaneous rendering and seamless loop
  const actualDuration = Math.min(Math.max(durationSeconds, 10), 30);
  const natureKey = selectedNatureTypes.sort().join('+');
  const cacheKey = `${natureKey}_${ambientType}_${Math.round(natureVol * 100)}_${Math.round(musicVol * 100)}_${actualDuration}_${withBowl}`;

  if (soundscapeWavCache.has(cacheKey)) {
    return soundscapeWavCache.get(cacheKey)!;
  }

  const sampleRate = 44100;
  const numChannels = 2;
  const length = sampleRate * actualDuration;

  const OfflineCtxClass = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
  if (!OfflineCtxClass) {
    console.warn('OfflineAudioContext not available');
    return '';
  }

  const offlineCtx = new OfflineCtxClass(numChannels, length, sampleRate);

  // -------------------------------------------------------------
  // 1. AMBIENT MUSIC SYNTHESIS (Piano, Cinematic Pad, Soft Strings, Warm Piano, Minimal Ambient)
  // -------------------------------------------------------------
  if (ambientType === 'piano-lembut' || ambientType === 'piano-hangat') {
    // Warm Pentatonic Piano chords at 432Hz tuning (C, D, E, G, A, C)
    const chordNotes = ambientType === 'piano-hangat' ? [
      [108, 162, 216, 288, 360],     // A2 - E3 - A3 - D4 - F#4 (Warm grounded)
      [129.6, 194.4, 259.2, 324],    // F3 - C4 - F4 - A4
      [144, 216, 288, 360],          // D3 - F#3 - A3 - C#4
      [129.6, 216, 259.2, 388.8],    // C3 - E3 - G3 - C5
    ] : [
      [129.6, 216, 259.2, 324],     // C3 - E3 - G3 - B3 / D4
      [144, 216, 288, 360],         // D3 - F#3 - A3 - C#4
      [108, 162, 216, 324],         // A2 - E3 - A3 - E4
      [129.6, 194.4, 259.2, 388.8], // F3 - C4 - F4 - C5
    ];

    const chordInterval = ambientType === 'piano-hangat' ? 9 : 8; // Gentle chord pacing
    const numChords = Math.ceil(actualDuration / chordInterval);

    for (let c = 0; c < numChords; c++) {
      const chordTime = c * chordInterval + 0.3;
      if (chordTime >= actualDuration - 1.5) break;

      const notes = chordNotes[c % chordNotes.length];
      notes.forEach((freq, nIdx) => {
        const noteTime = chordTime + nIdx * 0.12;
        if (noteTime < actualDuration - 1.5) {
          const osc1 = offlineCtx.createOscillator();
          const osc2 = offlineCtx.createOscillator();
          const filter = offlineCtx.createBiquadFilter();
          const gain = offlineCtx.createGain();

          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(freq, noteTime);

          // Piano overtone
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(freq * 2.001, noteTime);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(ambientType === 'piano-hangat' ? 580 : 700, noteTime);
          filter.frequency.exponentialRampToValueAtTime(120, Math.min(actualDuration, noteTime + 6.5));

          // Piano envelope (soft attack, organic decay)
          const targetVol = musicVol * (0.09 / (nIdx + 1));
          gain.gain.setValueAtTime(0.0001, noteTime);
          gain.gain.linearRampToValueAtTime(targetVol, noteTime + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, Math.min(actualDuration, noteTime + 7.5));

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);
          gain.connect(offlineCtx.destination);

          osc1.start(noteTime);
          osc1.stop(Math.min(actualDuration, noteTime + 8));
          osc2.start(noteTime);
          osc2.stop(Math.min(actualDuration, noteTime + 8));
        }
      });
    }
  } else if (ambientType === 'pad-sinematik') {
    // Lush Analog Warm Pad Drone (432Hz Solfeggio Harmonics)
    const padFreqs = [108, 216, 324, 432, 648];
    padFreqs.forEach((freq, idx) => {
      const osc = offlineCtx.createOscillator();
      const filter = offlineCtx.createBiquadFilter();
      const gain = offlineCtx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, 0);
      osc.detune.setValueAtTime((idx % 2 === 0 ? 3 : -3), 0);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, 0);

      const baseVol = (musicVol * 0.08) / (idx + 1);
      gain.gain.setValueAtTime(0.0001, 0);
      gain.gain.linearRampToValueAtTime(baseVol, Math.min(fadeIn, actualDuration / 2));
      gain.gain.setValueAtTime(baseVol, Math.max(0, actualDuration - fadeOut));
      gain.gain.linearRampToValueAtTime(0.0001, actualDuration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(offlineCtx.destination);

      osc.start(0);
      osc.stop(actualDuration);
    });
  } else if (ambientType === 'ambient-minimal') {
    // Ultra-soft minimal sine harmonic drone (432Hz Pure Zen)
    const minFreqs = [108, 216, 432];
    minFreqs.forEach((freq, idx) => {
      const osc = offlineCtx.createOscillator();
      const gain = offlineCtx.createGain();
      const filter = offlineCtx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, 0);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, 0);

      const baseVol = (musicVol * 0.05) / (idx + 1);
      gain.gain.setValueAtTime(0.0001, 0);
      gain.gain.linearRampToValueAtTime(baseVol, fadeIn);
      gain.gain.setValueAtTime(baseVol, actualDuration - fadeOut);
      gain.gain.linearRampToValueAtTime(0.0001, actualDuration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(offlineCtx.destination);

      osc.start(0);
      osc.stop(actualDuration);
    });
  } else {
    // String Halus Meditatif (528Hz Solfeggio Warm Bowed String)
    const stringFreqs = [132, 264, 396, 528];
    stringFreqs.forEach((freq, idx) => {
      const osc = offlineCtx.createOscillator();
      const gain = offlineCtx.createGain();
      const filter = offlineCtx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, 0);
      osc.detune.setValueAtTime(idx * 2, 0);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, 0);

      const baseVol = (musicVol * 0.04) / (idx + 1);
      gain.gain.setValueAtTime(0.0001, 0);
      gain.gain.linearRampToValueAtTime(baseVol, fadeIn);
      gain.gain.setValueAtTime(baseVol, actualDuration - fadeOut);
      gain.gain.linearRampToValueAtTime(0.0001, actualDuration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(offlineCtx.destination);

      osc.start(0);
      osc.stop(actualDuration);
    });
  }

  // -------------------------------------------------------------
  // 2. NATURE BACKSOUND SYNTHESIS (Supports Multi-Layer Textures: Sungai + Burung + Angin, etc.)
  // -------------------------------------------------------------
  const layerCount = Math.max(1, selectedNatureTypes.length);
  const layerGainScale = 1 / Math.sqrt(layerCount);

  for (const nType of selectedNatureTypes) {
    const noiseBufferSize = sampleRate * 5;
    const noiseBuffer = offlineCtx.createBuffer(2, noiseBufferSize, sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = noiseBuffer.getChannelData(ch);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < noiseBufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }
    }

    const noiseSource = offlineCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const natureFilter = offlineCtx.createBiquadFilter();
    const natureGain = offlineCtx.createGain();
    const effectiveLayerVol = natureVol * layerGainScale;

    if (nType === 'aliran-sungai') {
      natureFilter.type = 'bandpass';
      natureFilter.frequency.setValueAtTime(650, 0);
      natureFilter.Q.setValueAtTime(1.2, 0);
      natureGain.gain.setValueAtTime(effectiveLayerVol * 0.8, 0);
    } else if (nType === 'gemericik-air') {
      natureFilter.type = 'bandpass';
      natureFilter.frequency.setValueAtTime(1200, 0);
      natureFilter.Q.setValueAtTime(2.5, 0);
      natureGain.gain.setValueAtTime(effectiveLayerVol * 0.6, 0);

      const dropTimes = [3, 8, 14, 21, 29, 38, 48, 60, 75, 90, 105];
      dropTimes.forEach((dt) => {
        if (dt < actualDuration - 2) {
          const dropOsc = offlineCtx.createOscillator();
          const dropGain = offlineCtx.createGain();
          dropOsc.type = 'sine';
          dropOsc.frequency.setValueAtTime(900 + Math.random() * 300, dt);
          dropOsc.frequency.exponentialRampToValueAtTime(1800 + Math.random() * 400, dt + 0.08);

          dropGain.gain.setValueAtTime(0.0001, dt);
          dropGain.gain.linearRampToValueAtTime(effectiveLayerVol * 0.25, dt + 0.02);
          dropGain.gain.exponentialRampToValueAtTime(0.0001, dt + 0.15);

          dropOsc.connect(dropGain);
          dropGain.connect(offlineCtx.destination);
          dropOsc.start(dt);
          dropOsc.stop(dt + 0.2);
        }
      });
    } else if (nType === 'burung-pagi') {
      natureFilter.type = 'lowpass';
      natureFilter.frequency.setValueAtTime(400, 0);
      natureGain.gain.setValueAtTime(effectiveLayerVol * 0.3, 0);

      const birdTimes = [2, 6, 12, 18, 24];
      birdTimes.forEach((bt) => {
        if (bt < actualDuration - 2) {
          const chirps = 3;
          for (let k = 0; k < chirps; k++) {
            const chirpTime = bt + k * 0.18;
            const osc = offlineCtx.createOscillator();
            const chirpGain = offlineCtx.createGain();

            osc.type = 'sine';
            const baseF = 2400 + Math.random() * 600;
            osc.frequency.setValueAtTime(baseF, chirpTime);
            osc.frequency.linearRampToValueAtTime(baseF + 800, chirpTime + 0.05);
            osc.frequency.linearRampToValueAtTime(baseF - 200, chirpTime + 0.12);

            chirpGain.gain.setValueAtTime(0.0001, chirpTime);
            chirpGain.gain.linearRampToValueAtTime(effectiveLayerVol * 0.22, chirpTime + 0.03);
            chirpGain.gain.exponentialRampToValueAtTime(0.0001, chirpTime + 0.14);

            osc.connect(chirpGain);
            chirpGain.connect(offlineCtx.destination);
            osc.start(chirpTime);
            osc.stop(chirpTime + 0.15);
          }
        }
      });
    } else if (nType === 'angin-pepohonan') {
      natureFilter.type = 'lowpass';
      natureFilter.frequency.setValueAtTime(300, 0);
      natureGain.gain.setValueAtTime(effectiveLayerVol * 0.85, 0);
    } else if (nType === 'ombak-pantai') {
      natureFilter.type = 'lowpass';
      natureFilter.frequency.setValueAtTime(450, 0);
      natureGain.gain.setValueAtTime(effectiveLayerVol * 0.8, 0);
    } else if (nType === 'hutan-alami') {
      natureFilter.type = 'bandpass';
      natureFilter.frequency.setValueAtTime(500, 0);
      natureFilter.Q.setValueAtTime(0.8, 0);
      natureGain.gain.setValueAtTime(effectiveLayerVol * 0.7, 0);
    } else if (nType === 'suasana-malam') {
      // Soft night breeze with subtle high-frequency nocturnal crickets
      natureFilter.type = 'lowpass';
      natureFilter.frequency.setValueAtTime(260, 0);
      natureGain.gain.setValueAtTime(effectiveLayerVol * 0.5, 0);

      // Night Crickets (gentle chirps around 4.5kHz)
      const cricketTimes = [1.5, 5, 8.5, 12, 16.5, 20];
      cricketTimes.forEach((ct) => {
        if (ct < actualDuration - 2) {
          for (let p = 0; p < 4; p++) {
            const pTime = ct + p * 0.09;
            const osc = offlineCtx.createOscillator();
            const cGain = offlineCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(4400 + Math.random() * 200, pTime);

            cGain.gain.setValueAtTime(0.0001, pTime);
            cGain.gain.linearRampToValueAtTime(effectiveLayerVol * 0.08, pTime + 0.02);
            cGain.gain.exponentialRampToValueAtTime(0.0001, pTime + 0.06);

            osc.connect(cGain);
            cGain.connect(offlineCtx.destination);
            osc.start(pTime);
            osc.stop(pTime + 0.07);
          }
        }
      });
    } else if (nType === 'fajar-tenang') {
      // Dawn freshness breeze + distant birds
      natureFilter.type = 'bandpass';
      natureFilter.frequency.setValueAtTime(550, 0);
      natureFilter.Q.setValueAtTime(0.9, 0);
      natureGain.gain.setValueAtTime(effectiveLayerVol * 0.55, 0);

      const dawnBirdTimes = [3, 9, 15, 21];
      dawnBirdTimes.forEach((bt) => {
        if (bt < actualDuration - 2) {
          for (let k = 0; k < 2; k++) {
            const chirpTime = bt + k * 0.22;
            const osc = offlineCtx.createOscillator();
            const chirpGain = offlineCtx.createGain();
            osc.type = 'sine';
            const baseF = 2600 + Math.random() * 400;
            osc.frequency.setValueAtTime(baseF, chirpTime);
            osc.frequency.linearRampToValueAtTime(baseF + 600, chirpTime + 0.06);
            osc.frequency.linearRampToValueAtTime(baseF - 100, chirpTime + 0.14);

            chirpGain.gain.setValueAtTime(0.0001, chirpTime);
            chirpGain.gain.linearRampToValueAtTime(effectiveLayerVol * 0.15, chirpTime + 0.03);
            chirpGain.gain.exponentialRampToValueAtTime(0.0001, chirpTime + 0.15);

            osc.connect(chirpGain);
            chirpGain.connect(offlineCtx.destination);
            osc.start(chirpTime);
            osc.stop(chirpTime + 0.16);
          }
        }
      });
    } else if (nType === 'suasana-alam-tenang') {
      natureFilter.type = 'lowpass';
      natureFilter.frequency.setValueAtTime(380, 0);
      natureGain.gain.setValueAtTime(effectiveLayerVol * 0.6, 0);
    } else {
      natureFilter.type = 'lowpass';
      natureFilter.frequency.setValueAtTime(1400, 0);
      natureGain.gain.setValueAtTime(effectiveLayerVol * 0.75, 0);
    }

    noiseSource.connect(natureFilter);
    natureFilter.connect(natureGain);
    natureGain.connect(offlineCtx.destination);
    noiseSource.start(0);
    noiseSource.stop(actualDuration);
  }

  // -------------------------------------------------------------
  // 3. TIBETAN SINGING BOWL HARMONICS (528Hz Love & Miracle frequency)
  // -------------------------------------------------------------
  if (withBowl) {
    const bowlTimes = [1, 14, 26];
    bowlTimes.forEach((t) => {
      if (t < actualDuration - 3) {
        const bowlOsc1 = offlineCtx.createOscillator();
        const bowlOsc2 = offlineCtx.createOscillator();
        const bowlGain = offlineCtx.createGain();

        bowlOsc1.type = 'sine';
        bowlOsc1.frequency.setValueAtTime(528, t);
        bowlOsc2.type = 'sine';
        bowlOsc2.frequency.setValueAtTime(528 * 2.76, t); // Overtone

        bowlGain.gain.setValueAtTime(0.0001, t);
        bowlGain.gain.linearRampToValueAtTime(0.08, t + 0.15);
        bowlGain.gain.exponentialRampToValueAtTime(0.0001, Math.min(actualDuration, t + 8));

        bowlOsc1.connect(bowlGain);
        bowlOsc2.connect(bowlGain);
        bowlGain.connect(offlineCtx.destination);

        bowlOsc1.start(t);
        bowlOsc1.stop(Math.min(actualDuration, t + 8.5));
        bowlOsc2.start(t);
        bowlOsc2.stop(Math.min(actualDuration, t + 8.5));
      }
    });
  }

  // Render offline buffer to audio
  const renderedBuffer = await offlineCtx.startRendering();
  const url = audioBufferToWavBlob(renderedBuffer);
  soundscapeWavCache.set(cacheKey, url);
  return url;
}

/**
 * Synthesizes LEGA CALM NATURE (Universal Relaxation Audio)
 * Master multi-layer soundscape:
 * 1. 🌊 Air mengalir lembut (smooth continuous alpine waterflow)
 * 2. 🐦 Burung natural dan jauh (reverberant gentle distant birds)
 * 3. 🍃 Angin lembut di pepohonan (ultra-soft canopy breeze)
 * 4. 🎹 Musik ambient/piano yang sangat lembut (warm 432Hz pentatonic piano chords)
 *
 * Characteristics: Tenang, Lembut, Natural, Hangat, Menenteramkan, Tanpa Suara Mengejutkan.
 */
export async function generateLegaCalmNatureWav(
  durationSeconds = 24,
  customVolumes?: { natureVolume?: number; musicVolume?: number }
): Promise<string> {
  return generateRelaxationSoundscapeWav(durationSeconds, {
    natureTypes: ['aliran-sungai', 'burung-pagi', 'angin-pepohonan'],
    ambientType: 'piano-lembut',
    natureVolume: customVolumes?.natureVolume ?? 0.28,
    musicVolume: customVolumes?.musicVolume ?? 0.22,
    fadeInSeconds: 4.0,
    fadeOutSeconds: 5.5,
    includeSingingBowl: true
  });
}

/**
 * Backward compatibility alias for generateMeditationAmbientWav
 */
export async function generateMeditationAmbientWav(durationSeconds = 120): Promise<string> {
  return generateLegaCalmNatureWav(durationSeconds);
}

/**
 * Converts AudioBuffer to WAV Blob URL
 */
function audioBufferToWavBlob(audioBuffer: AudioBuffer): string {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const length = audioBuffer.length * numChannels * 2;
  const buffer = new ArrayBuffer(44 + length);
  const view = new DataView(buffer);

  // RIFF header
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
 * Spoken Indonesian Speech Narration via Web Speech API with calm pacing
 */
let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && window.speechSynthesis) {
  const updateVoices = () => {
    try {
      cachedVoices = window.speechSynthesis.getVoices();
    } catch {
      // ignore
    }
  };
  updateVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }
}

export function getVoiceCharacter(nameOrKey?: string): VoiceCharacterProfile {
  if (!nameOrKey) return VOICE_CHARACTERS[0];
  const found = VOICE_CHARACTERS.find(
    (v) => v.name.toLowerCase() === nameOrKey.toLowerCase() ||
           v.indonesianName.toLowerCase().includes(nameOrKey.toLowerCase()) ||
           v.label.toLowerCase().includes(nameOrKey.toLowerCase())
  );
  return found || VOICE_CHARACTERS[0];
}

export function speakIndonesianNarration(
  text: string,
  options?: {
    voiceName?: string;
    voiceCharacter?: string;
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

  try {
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  } catch {
    // ignore
  }

  const cleanText = text
    .replace(/\[PAUSE_SHORT\]/gi, '... ')
    .replace(/\[PAUSE_MEDIUM\]/gi, '... ... ')
    .replace(/\[PAUSE_LONG\]/gi, '... ... ... ')
    .replace(/\[Jeda \d+ detik\]/gi, '... ')
    .replace(/[*#_`]/g, '')
    .trim();

  if (!cleanText) return null;

  const charProfile = getVoiceCharacter(options?.voiceCharacter || options?.voiceName);

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = options?.rate ?? charProfile.rate ?? 0.80; // Pacing from character
  utterance.pitch = options?.pitch ?? charProfile.pitch ?? 1.0; // Pitch resonance from character
  utterance.volume = options?.volume ?? 0.95;
  utterance.lang = 'id-ID';

  const voices = cachedVoices.length > 0 ? cachedVoices : (window.speechSynthesis.getVoices() || []);
  
  // Try finding Indonesian voice matching gender preference if possible
  const idVoices = voices.filter((v) => 
    v.lang.startsWith('id') || 
    v.lang.includes('ID') || 
    v.name.toLowerCase().includes('indonesia') ||
    v.lang.startsWith('in')
  );

  let chosenVoice: SpeechSynthesisVoice | undefined;
  if (idVoices.length > 0) {
    if (charProfile.gender === 'male') {
      chosenVoice = idVoices.find(v => 
        v.name.toLowerCase().includes('male') || 
        v.name.toLowerCase().includes('ardi') || 
        v.name.toLowerCase().includes('david') ||
        v.name.toLowerCase().includes('pria')
      ) || idVoices[0];
    } else {
      chosenVoice = idVoices.find(v => 
        v.name.toLowerCase().includes('female') || 
        v.name.toLowerCase().includes('gadis') || 
        v.name.toLowerCase().includes('wanita') ||
        v.name.toLowerCase().includes('siti')
      ) || idVoices[0];
    }
  } else {
    // Multilingual fallback
    chosenVoice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('natural')) || voices[0];
  }

  if (chosenVoice) {
    utterance.voice = chosenVoice;
  }

  if (options?.onStart) utterance.onstart = options.onStart;
  if (options?.onEnd) utterance.onend = options.onEnd;
  if (options?.onError) utterance.onerror = options.onError;

  try {
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Failed to call speechSynthesis.speak:', err);
  }
  return utterance;
}

/**
 * Previews a chosen Indonesian voice character with its custom sample phrase
 */
export function previewIndonesianVoiceCharacter(
  voiceName: string,
  onEnd?: () => void
): SpeechSynthesisUtterance | null {
  const profile = getVoiceCharacter(voiceName);
  return speakIndonesianNarration(profile.samplePhrase, {
    voiceCharacter: profile.name,
    onEnd
  });
}

/**
 * Play harmonic chime or bell
 */
let sharedAudioCtx: AudioContext | null = null;

export function playCalmMeditationChime(type: 'inhale' | 'exhale' | 'hold' | 'bell' | 'bowl' = 'bowl', volume = 0.15) {
  if (typeof window === 'undefined') return;
  try {
    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume();
    }
    const ctx = sharedAudioCtx;
    const now = ctx.currentTime;

    if (type === 'inhale') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(528, now + 0.4);
      gain.gain.setValueAtTime(volume * 0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.7);
    } else if (type === 'exhale') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.5);
      gain.gain.setValueAtTime(volume * 0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.8);
    } else if (type === 'hold') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, now);
      gain.gain.setValueAtTime(volume * 0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    } else {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(528, now);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(528 * 2.76, now);

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 3.6);
      osc2.stop(now + 3.6);
    }
  } catch (err) {
    console.warn('Audio chime playback error:', err);
  }
}

/**
 * Stop any ongoing Web Speech narration
 */
export function stopIndonesianNarration() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
