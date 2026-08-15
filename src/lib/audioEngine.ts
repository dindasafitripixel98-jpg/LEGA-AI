// LEGA Audio Engine - Premium Relaxation Soundscapes & Ambient Synthesizer
// SHAQILA DIGITAL 99 - LEGA v3.0

import { NatureSoundType, AmbientMusicType, AudioRelaxationMetadata } from '../types';

export interface SoundscapeOptions {
  natureType?: NatureSoundType;
  natureTypes?: NatureSoundType[];
  ambientType?: AmbientMusicType;
  natureVolume?: number; // 0.0 - 1.0 (recommended: 0.28 - 0.40, prioritize nature)
  musicVolume?: number; // 0.0 - 1.0 (recommended: 0.10 - 0.16, very thin background)
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
  tagline: 'Temani dirimu berhenti sejenak, hadir saat ini, dan menikmati ketenangan di pangkuan alam.',
  category: 'Universal Relaxation Soundscape',
  atmospheres: [
    { icon: '🌊', label: 'Air mengalir lembut', desc: 'Arus sungai pegunungan yang jernih, mengalir konstan, dan stabil menenangkan' },
    { icon: '🌧️', label: 'Hujan ringan', desc: 'Rintik air hujan tenang dan sejuk di dedaunan tanpa petir' },
    { icon: '🍃', label: 'Angin di pepohonan', desc: 'Semilir hembusan angin sejuk yang menggerakkan dedaunan rimbun perlahan' },
    { icon: '🐦', label: 'Burung natural yang jauh', desc: 'Kicau burung alami fajar yang damai dan bergema lembut di kejauhan' },
    { icon: '🌊', label: 'Ombak lembut', desc: 'Deburan riak ombak pantai yang lembut dan berirama menyelaraskan napas' },
    { icon: '💧', label: 'Gemericik air', desc: 'Tetesan dan percikan air sejuk alami di atas bebatuan yang menyegarkan batin' },
    { icon: '🌲', label: 'Suasana hutan yang nyaman', desc: 'Kanopi hutan alami yang hangat, teduh, menaungi, dan damai' },
    { icon: '🌿', label: 'Suasana alam terbuka', desc: 'Lanskap padang rumput dan cakrawala alam luas yang hening dan lapang' }
  ],
  characteristics: [
    'Tenang',
    'Nyaman',
    'Hangat',
    'Cerah',
    'Natural',
    'Menenangkan',
    'Aman didengar',
    'Tanpa suara mengejutkan',
    'Tanpa lonjakan volume mendadak'
  ],
  purposes: [
    'Kesadaran Diri (Self-Awareness)',
    'Hadir Saat Ini (Present Moment)',
    'Mengamati Napas & Tubuh',
    'Relaksasi & Ketenangan Pikiran',
    'Regulasi Emosi & Grounding',
    'Refleksi Diri & Istirahat Berkualitas'
  ],
  headsetAdvice: '🎧 Gunakan headset atau earphone untuk pengalaman audio yang lebih optimal dan imersif.',
  recommendedScript: 'Selamat datang di ruang tenang Anda. Ambil posisi yang nyaman dan biarkan tubuh Anda bersandar dengan rileks. Rasakan aliran udara sejuk masuk saat Anda menarik napas, dan lepaskan seluruh ketegangan saat Anda menghembuskannya perlahan. Dengarkan gemericik air yang mengalir lembut... desau angin yang menaungi pepohonan... dan kicau burung di kejauhan. Biarkan alunan musik ringan dan hangat ini menjadi latar tipis yang menemani Anda hadir seutuhnya di saat ini. Di sini, Anda aman, tenang, dan utuh.'
};

export const NATURE_SOUND_DEFINITIONS: Record<NatureSoundType, {
  name: string;
  description: string;
  icon: string;
  recommendedTheme: string;
  defaultNatureVolume: number;
  defaultMusicVolume: number;
  defaultAmbient: AmbientMusicType;
  loopRecommendation: string;
}> = {
  'aliran-sungai': {
    name: 'Air Mengalir Lembut',
    description: 'Arus sungai pegunungan alami yang jernih, mengalir konstan, dan stabil membawa keheningan.',
    icon: '🌊',
    recommendedTheme: 'Pelepasan Beban Pikiran & Ketenangan Mengalir',
    defaultNatureVolume: 0.34,
    defaultMusicVolume: 0.12,
    defaultAmbient: 'piano-lembut',
    loopRecommendation: 'Seamless Organic Flow Loop (30 Detik)'
  },
  'gemericik-air': {
    name: 'Gemericik Air',
    description: 'Tetesan dan percikan air sejuk lembut di atas bebatuan alami yang menyegarkan batin dan menjernihkan pikiran.',
    icon: '💧',
    recommendedTheme: 'Kehadiran Momen Ini & Kejernihan Jiwa',
    defaultNatureVolume: 0.30,
    defaultMusicVolume: 0.12,
    defaultAmbient: 'piano-lembut',
    loopRecommendation: 'Granular Ripple Loop (25 Detik)'
  },
  'air-terjun-lembut': {
    name: 'Air Terjun Menyejukkan',
    description: 'Gemuruh air terjun alami yang lembut dan sejuk di sela bebatuan, membasuh rasa lelah dan menyegarkan jiwa.',
    icon: '🌊',
    recommendedTheme: 'Pembersihan Mental & Kesegaran Jiwa',
    defaultNatureVolume: 0.34,
    defaultMusicVolume: 0.10,
    defaultAmbient: 'pad-sinematik',
    loopRecommendation: 'Cascading Water Flow Loop (30 Detik)'
  },
  'hujan-lembut': {
    name: 'Hujan Ringan',
    description: 'Rintik hujan lembut dan sejuk di atas dedaunan yang membasuh kecemasan dan mengantar istirahat damai.',
    icon: '🌧️',
    recommendedTheme: 'Kenyamanan Emosional & Pengantar Tidur Nyenyak',
    defaultNatureVolume: 0.32,
    defaultMusicVolume: 0.12,
    defaultAmbient: 'piano-lembut',
    loopRecommendation: 'Continuous Gentle Rain Loop (30 Detik)'
  },
  'angin-pepohonan': {
    name: 'Angin di Pepohonan',
    description: 'Semilir hembusan angin sejuk yang menggerakkan dedaunan rimbun dengan ritme lambat dan menaungi.',
    icon: '🍃',
    recommendedTheme: 'Pelepasan Ketegangan Fisik & Pengheningan Somatis',
    defaultNatureVolume: 0.32,
    defaultMusicVolume: 0.12,
    defaultAmbient: 'petikan-gitar',
    loopRecommendation: 'Atmospheric Breeze Cycle (30 Detik)'
  },
  'burung-pagi': {
    name: 'Burung Natural yang Jauh',
    description: 'Kicau burung alami fajar di taman yang tenang dengan embun pagi dan semilir udara segar di kejauhan.',
    icon: '🐦',
    recommendedTheme: 'Optimisme Cerah & Memulai Hari dengan Hati Lapang',
    defaultNatureVolume: 0.28,
    defaultMusicVolume: 0.12,
    defaultAmbient: 'piano-lembut',
    loopRecommendation: 'Randomized Natural Birdsong Cycle (45 Detik)'
  },
  'ombak-pantai': {
    name: 'Ombak Lembut',
    description: 'Deburan riak ombak laut yang lembut dan berirama menyelaraskan tarikan dan hembusan napas dengan ritme alam.',
    icon: '🌊',
    recommendedTheme: 'Relaksasi Mendalam & Penyelarasan Irama Napas',
    defaultNatureVolume: 0.34,
    defaultMusicVolume: 0.12,
    defaultAmbient: 'pad-sinematik',
    loopRecommendation: 'Tidal Wave Dynamic Loop (24 Detik)'
  },
  'hutan-alami': {
    name: 'Suasana Hutan yang Nyaman',
    description: 'Suasana kanopi hutan alami yang damai, hangat, teduh, dan menaungi jiwa dengan keheningan alam.',
    icon: '🌲',
    recommendedTheme: 'Grounding Batin & Rasa Terhubung dengan Alam',
    defaultNatureVolume: 0.32,
    defaultMusicVolume: 0.12,
    defaultAmbient: 'akustik-hangat',
    loopRecommendation: 'Deep Sanctuary Rainforest Loop (40 Detik)'
  },
  'suasana-alam-tenang': {
    name: 'Suasana Alam Terbuka',
    description: 'Lanskap padang rumput dan cakrawala alam terbuka luas dengan semilir angin sepoi-sepoi yang menenteramkan.',
    icon: '🌿',
    recommendedTheme: 'Fokus Bekerja, Belajar & Meditasi Ruang Terbuka',
    defaultNatureVolume: 0.30,
    defaultMusicVolume: 0.10,
    defaultAmbient: 'ambient-minimal',
    loopRecommendation: 'Open Horizon Zen Loop (30 Detik)'
  },
  'suasana-malam': {
    name: 'Suasana Malam Tenang',
    description: 'Keheningan malam dengan desau angin malam lembut dan jangkrik halus menenangkan pikiran.',
    icon: '🌙',
    recommendedTheme: 'Relaksasi Menjelang Tidur & Pengheningan Malam',
    defaultNatureVolume: 0.28,
    defaultMusicVolume: 0.10,
    defaultAmbient: 'lullaby-malam',
    loopRecommendation: 'Nocturnal Calm Cycle (30 Detik)'
  },
  'fajar-tenang': {
    name: 'Fajar Menenteramkan',
    description: 'Kesejukan udara fajar dengan kicau burung lembut kejauhan dan kehangatan sinar mentari.',
    icon: '🌅',
    recommendedTheme: 'Kesegaran Pagi & Menemukan Ruang Tenang Diri',
    defaultNatureVolume: 0.30,
    defaultMusicVolume: 0.12,
    defaultAmbient: 'piano-hangat',
    loopRecommendation: 'Dawn Horizon Cycle (35 Detik)'
  }
};

export const AMBIENT_MUSIC_DEFINITIONS: Record<AmbientMusicType, {
  name: string;
  description: string;
  character: string;
  recommendedFor: string;
}> = {
  'piano-lembut': {
    name: 'Piano Akustik Lembut (432Hz)',
    description: 'Sentuhan tuts piano akustik sederhana bernada pentatonik cerah, lembut, dan stabil sebagai latar tipis.',
    character: 'Ringan, Hangat, Cerah, Sederhana & Stabil',
    recommendedFor: 'Universal Calm, Hadir Saat Ini, Kesegaran Jiwa'
  },
  'petikan-gitar': {
    name: 'Petikan Gitar Akustik Ringan & Stabil (432Hz)',
    description: 'Petikan dawai gitar akustik berirama perlahan, mantap, dan teratur yang menenangkan tanpa ramai.',
    character: 'Stabil, Bersahaja, Lembut, Tidak Ramai & Grounded',
    recommendedFor: 'LEGA — MARAH & Pelepasan Emosi Tertahan'
  },
  'akustik-hangat': {
    name: 'Instrumen Akustik Lembut & Mengayomi',
    description: 'Harmoni instrumen akustik bernada hangat dan merangkul, memberi ruang aman tanpa membebani suasana.',
    character: 'Hangat, Merangkul, Aman, Welas Asih & Menyejukkan',
    recommendedFor: 'LEGA — SEDIH & LEGA — TAKUT'
  },
  'harp-kalimba': {
    name: 'Kalimba & Harpa Lembut Menenangkan',
    description: 'Petikan kalimba dan harpa yang mengalir stabil, ringan, dan menenangkan tanpa lonjakan suara mendadak.',
    character: 'Stabil, Ringan, Menenangkan, Halus & Konsisten',
    recommendedFor: 'LEGA — CEMAS & Meredakan Ketegangan Syaraf'
  },
  'gitar-reflektif': {
    name: 'Petikan Gitar Reflektif & Rhodes Hangat',
    description: 'Petikan gitar reflektif yang lembut dan hangat, menemani proses penerimaan dan pelepasan ekspektasi.',
    character: 'Reflektif, Lembut, Hangat & Menerima',
    recommendedFor: 'LEGA — KECEWA & Refleksi Batin'
  },
  'ambient-minimal': {
    name: 'Musik Minimalis Hening (Suara Alam Dominan)',
    description: 'Dengung nada hening minimalis tanpa melodi rumit agar tidak membuat pikiran ramai, membiarkan suara alam menjadi dominan.',
    character: 'Sederhana, Stabil, Minimalis, Hening & Alami',
    recommendedFor: 'LEGA — OVERTHINKING & LEGA — PRESENCE'
  },
  'tibetan-bowl-deep': {
    name: 'Resonansi Tibetan Bowl & Pad Somatis',
    description: 'Resonansi mangkuk Tibet bernada 528Hz dan pad somatis beritme pernapasan lambat yang menuntun pengamatan tubuh.',
    character: 'Perlahan, Stabil, Berjangkar & Menyelaraskan Tubuh',
    recommendedFor: 'LEGA — BODY AWARENESS (Kesadaran Tubuh)'
  },
  'pad-sinematik': {
    name: 'Pad Ambient Mengalun Lembut (432Hz)',
    description: 'Lapisan pad analog hangat mengambang tipis di latar belakang memberi rasa aman dan ruang batin lapang.',
    character: 'Ringan, Melayang Tipis, Hangat & Nyaman',
    recommendedFor: 'LEGA — RELEASE & Penyelarasan Napas'
  },
  'string-halus': {
    name: 'String Akustik Halus & Damai (528Hz)',
    description: 'Gesekan dawai senar orkestra sangat lembut dengan resonansi panjang yang meredakan beban batin.',
    character: 'Lembut, Stabil, Damai & Tidak Mencolok',
    recommendedFor: 'Memaafkan, Syukur & Inner Child'
  },
  'piano-hangat': {
    name: 'Piano Teduh Hangat (432Hz)',
    description: 'Progresi harmoni piano solfeggio lembut dengan suasana teduh, stabil, dan tidak mendominasi suara alam.',
    character: 'Hangat, Sederhana, Teduh & Menenteramkan',
    recommendedFor: 'Refleksi Diri & Istirahat Berkualitas'
  },
  'lullaby-malam': {
    name: 'Musik Tidur Hening & Sangat Perlahan (432Hz Delta)',
    description: 'Harmoni tidur hening dengan tempo sangat lambat dan nada-nada lembut yang menghantarkan tubuh dan pikiran menuju tidur lelap.',
    character: 'Sangat Lembut, Stabil, Perlahan & Menidurkan',
    recommendedFor: 'LEGA — TIDUR (Pengantar Tidur Nyenyak)'
  }
};

/**
 * Indonesian Vocal Character Profiles (6 Pilihan Suara Resmi LEGA)
 */
export interface VoiceCharacterProfile {
  id: string;
  name: string; // 'Suara Tenang', 'Suara Hangat', etc.
  geminiVoice: string; // 'Kore', 'Puck', 'Aoede', 'Zephyr', 'Leda', 'Fenrir'
  indonesianName: string;
  label: string;
  badge: string;
  gender: 'female' | 'male';
  tone: string;
  pitch: number;
  rate: number;
  description: string;
  samplePhrase: string;
}

export const VOICE_CHARACTERS: VoiceCharacterProfile[] = [
  {
    id: 'suara-tenang',
    name: 'Suara Tenang',
    geminiVoice: 'Kore',
    indonesianName: 'Suara Tenang',
    label: 'Suara Tenang (Damai & Lembut)',
    badge: 'Damai & Teduh',
    gender: 'female',
    tone: 'Feminin Lembut & Mengayomi',
    pitch: 1.02,
    rate: 0.78,
    description: 'Vokal feminin yang sangat tenang, damai, dan mengayomi. Artikulasi lembut menyejukkan batin, cocok untuk meditasi, kesadaran diri, dan refleksi mendalam.',
    samplePhrase: 'Selamat datang di ruang tenang LEGA. Tarik napas lembut... izinkan tubuh dan pikiran Anda beristirahat dalam kedamaian.'
  },
  {
    id: 'suara-hangat',
    name: 'Suara Hangat',
    geminiVoice: 'Puck',
    indonesianName: 'Suara Hangat',
    label: 'Suara Hangat (Bersahabat & Ramah)',
    badge: 'Hangat & Ramah',
    gender: 'female',
    tone: 'Hangat, Bersahabat & Merangkul',
    pitch: 1.10,
    rate: 0.84,
    description: 'Vokal hangat, bersahabat, dan penuh penerimaan. Seperti teman terpercaya yang mendengarkan tanpa menghakimi.',
    samplePhrase: 'Mari berhenti sejenak. Sadari apa yang sedang Anda rasakan saat ini dengan jujur, hangat, dan lapang dada.'
  },
  {
    id: 'suara-lembut',
    name: 'Suara Lembut',
    geminiVoice: 'Aoede',
    indonesianName: 'Suara Lembut',
    label: 'Suara Lembut (Welas Asih & Hening)',
    badge: 'Welas Asih & Hening',
    gender: 'female',
    tone: 'Sangat Lembut, Welas Asih & Hening',
    pitch: 0.95,
    rate: 0.74,
    description: 'Vokal sangat lembut dan welas asih dengan tempo mengalir lambat. Ideal untuk latihan penerimaan diri, memaafkan, dan pengantar tidur.',
    samplePhrase: 'Tarik napas perlahan... rasakan kelembutan udara yang mengalir, izinkan seluruh ketegangan batin Anda melunak.'
  },
  {
    id: 'suara-natural',
    name: 'Suara Natural',
    geminiVoice: 'Zephyr',
    indonesianName: 'Suara Natural',
    label: 'Suara Natural (Alami & Santai)',
    badge: 'Natural & Bersahaja',
    gender: 'male',
    tone: 'Alami, Bersahaja & Santai',
    pitch: 0.90,
    rate: 0.85,
    description: 'Vokal alami maskulin bersahaja yang mengalir rileks dan organik, mengarahkan perhatian tanpa terasa menggurui.',
    samplePhrase: 'Dengarkan suara alami di sekitar Anda. Anda tidak perlu terburu-buru, hadir seutuhnya di momen saat ini.'
  },
  {
    id: 'suara-jernih',
    name: 'Suara Jernih',
    geminiVoice: 'Leda',
    indonesianName: 'Suara Jernih',
    label: 'Suara Jernih (Segar & Fokus)',
    badge: 'Jernih & Fokus',
    gender: 'female',
    tone: 'Jernih, Segar & Teratur',
    pitch: 1.16,
    rate: 0.82,
    description: 'Vokal artikulasi jernih, terang, dan teratur yang membangkitkan kesegaran batin, fokus belajar/bekerja, dan mengurai overthinking.',
    samplePhrase: 'Perhatikan setiap kejernihan pikiran Anda. Setiap tarikan napas membawa kesegaran baru bagi tubuh dan pikiran Anda.'
  },
  {
    id: 'suara-dalam',
    name: 'Suara Dalam',
    geminiVoice: 'Fenrir',
    indonesianName: 'Suara Dalam',
    label: 'Suara Dalam (Bariton & Grounded)',
    badge: 'Grounded & Berjangkar',
    gender: 'male',
    tone: 'Bariton Rendah, Mantap & Berjangkar',
    pitch: 0.70,
    rate: 0.76,
    description: 'Resonansi vokal bariton rendah yang kuat, stabil, dan berjangkar. Sangat efektif untuk meredakan kepanikan, kecemasan tinggi, dan grounding tubuh.',
    samplePhrase: 'Rasakan pijakan Anda yang kokoh dan berjangkar kuat. Napas Anda aman. Saat ini Anda berada dalam ruang perlindungan yang tenang.'
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
  const natureVol = options?.natureVolume ?? 0.32; // Primary nature element
  const musicVol = options?.musicVolume ?? 0.12; // Very thin, non-dominating background
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
  // 1. AMBIENT MUSIC SYNTHESIS (Warm, Light, Diverse Instruments & Compositions)
  // -------------------------------------------------------------
  if (ambientType === 'piano-lembut' || ambientType === 'piano-hangat') {
    // Warm, bright, simple acoustic chords tuned to 432Hz (Cmaj9, Gmaj7, Fmaj7, D9)
    const chordNotes = ambientType === 'piano-hangat' ? [
      [108, 162, 216, 288, 360],     // A2 - E3 - A3 - D4 - F#4 (Warm grounded & stable)
      [129.6, 194.4, 259.2, 324],    // F3 - C4 - F4 - A4
      [144, 216, 288, 360],          // D3 - F#3 - A3 - C#4
      [129.6, 216, 259.2, 388.8],    // C3 - E3 - G3 - C5
    ] : [
      [129.6, 194.4, 259.2, 324],    // C3 - G3 - C4 - E4 (Bright, simple, warm & peaceful)
      [144, 216, 288, 360],          // D3 - A3 - D4 - F#4
      [108, 162, 216, 324],          // A2 - E3 - A3 - C#4
      [129.6, 194.4, 259.2, 388.8],  // F3 - C4 - F4 - G4
    ];

    const chordInterval = 8.5; // Very slow, stable pacing
    const numChords = Math.ceil(actualDuration / chordInterval);

    for (let c = 0; c < numChords; c++) {
      const chordTime = c * chordInterval + 0.5;
      if (chordTime >= actualDuration - 1.5) break;

      const notes = chordNotes[c % chordNotes.length];
      notes.forEach((freq, nIdx) => {
        const noteTime = chordTime + nIdx * 0.16;
        if (noteTime < actualDuration - 1.5) {
          const osc1 = offlineCtx.createOscillator();
          const osc2 = offlineCtx.createOscillator();
          const filter = offlineCtx.createBiquadFilter();
          const gain = offlineCtx.createGain();

          // Soft sine fundamental
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(freq, noteTime);

          // Gentle warm acoustic triangle overtone
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(freq * 2.001, noteTime);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(ambientType === 'piano-hangat' ? 520 : 620, noteTime);
          filter.frequency.exponentialRampToValueAtTime(160, Math.min(actualDuration, noteTime + 6.0));

          // Extremely soft, delicate envelope
          const targetVol = musicVol * (0.07 / (nIdx + 1));
          gain.gain.setValueAtTime(0.0001, noteTime);
          gain.gain.linearRampToValueAtTime(targetVol, noteTime + 0.18);
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
  } else if (ambientType === 'petikan-gitar') {
    // 🎸 PETIKAN GITAR AKUSTIK RINGAN & STABIL (Khusus Marah, Release & Grounding)
    // Ritme perlahan, stabil, grounded, tanpa nada keras atau mendadak (432Hz: A, E, D, C#)
    const guitarPatterns = [
      [108, 162, 216, 270, 324],     // A2 - E3 - A3 - C#4 - E4
      [144, 216, 288, 360, 432],     // D3 - A3 - D4 - F#4 - A4
      [129.6, 194.4, 259.2, 324],    // F3 - C4 - F4 - A4
      [108, 162, 216, 270],          // A2 - E3 - A3 - C#4
    ];

    const pickInterval = 1.35; // Slow, steady acoustic plucking rhythm
    let currentChordIdx = 0;
    let t = 0.6;

    while (t < actualDuration - 2.0) {
      const currentChord = guitarPatterns[currentChordIdx % guitarPatterns.length];
      for (let pIdx = 0; pIdx < currentChord.length; pIdx++) {
        const noteT = t + pIdx * 0.42;
        if (noteT >= actualDuration - 1.5) break;

        const freq = currentChord[pIdx];
        const osc = offlineCtx.createOscillator();
        const subOsc = offlineCtx.createOscillator();
        const filter = offlineCtx.createBiquadFilter();
        const gain = offlineCtx.createGain();

        // Warm acoustic nylon pluck emulation (triangle + warm body sine)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteT);

        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(freq * 0.5, noteT);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(750, noteT);
        filter.frequency.exponentialRampToValueAtTime(220, noteT + 2.8);

        const pluckVol = musicVol * (pIdx === 0 ? 0.08 : 0.055);
        gain.gain.setValueAtTime(0.0001, noteT);
        gain.gain.linearRampToValueAtTime(pluckVol, noteT + 0.035);
        gain.gain.exponentialRampToValueAtTime(0.0001, Math.min(actualDuration, noteT + 3.8));

        osc.connect(filter);
        subOsc.connect(filter);
        filter.connect(gain);
        gain.connect(offlineCtx.destination);

        osc.start(noteT);
        osc.stop(Math.min(actualDuration, noteT + 4.0));
        subOsc.start(noteT);
        subOsc.stop(Math.min(actualDuration, noteT + 4.0));
      }
      t += currentChord.length * 0.42 + pickInterval;
      currentChordIdx++;
    }
  } else if (ambientType === 'akustik-hangat') {
    // 🪵 INSTRUMEN AKUSTIK LEMBUT & MENGAYOMI (Khusus Sedih & Takut)
    // Harmoni hangat, merangkul, memberi ruang tanpa membuat suasana semakin berat
    const warmNotes = [
      [194.4, 259.2, 324, 388.8],    // C4 - E4 - G4 - B4
      [172.8, 216, 259.2, 345.6],    // A3 - C#4 - E4 - A4
      [144, 216, 288, 360],          // D3 - A3 - D4 - F#4
      [129.6, 194.4, 259.2, 388.8],  // F3 - C4 - F4 - C5
    ];

    const warmInterval = 7.0;
    const numSets = Math.ceil(actualDuration / warmInterval);

    for (let s = 0; s < numSets; s++) {
      const setTime = s * warmInterval + 0.8;
      if (setTime >= actualDuration - 1.8) break;

      const chord = warmNotes[s % warmNotes.length];
      chord.forEach((freq, idx) => {
        const noteTime = setTime + idx * 0.28;
        if (noteTime < actualDuration - 1.5) {
          const osc = offlineCtx.createOscillator();
          const bodyOsc = offlineCtx.createOscillator();
          const filter = offlineCtx.createBiquadFilter();
          const gain = offlineCtx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, noteTime);

          bodyOsc.type = 'triangle';
          bodyOsc.frequency.setValueAtTime(freq * 1.5, noteTime);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(540, noteTime);
          filter.frequency.exponentialRampToValueAtTime(180, noteTime + 5.0);

          const vol = musicVol * (0.065 / (idx + 1));
          gain.gain.setValueAtTime(0.0001, noteTime);
          gain.gain.linearRampToValueAtTime(vol, noteTime + 0.25);
          gain.gain.exponentialRampToValueAtTime(0.0001, Math.min(actualDuration, noteTime + 6.8));

          osc.connect(filter);
          bodyOsc.connect(filter);
          filter.connect(gain);
          gain.connect(offlineCtx.destination);

          osc.start(noteTime);
          osc.stop(Math.min(actualDuration, noteTime + 7.0));
          bodyOsc.start(noteTime);
          bodyOsc.stop(Math.min(actualDuration, noteTime + 7.0));
        }
      });
    }
  } else if (ambientType === 'harp-kalimba') {
    // 🪕 KALIMBA & HARPA LEMBUT MENENANGKAN (Khusus Cemas)
    // Nada-nada stabil, halus, konsisten, hindari perubahan suara mendadak
    const harpNotes = [162, 216, 270, 324, 378, 432]; // Pentatonik lembut 432Hz
    const step = 0.75;
    let t = 0.5;
    let noteIdx = 0;

    while (t < actualDuration - 1.5) {
      const freq = harpNotes[noteIdx % harpNotes.length];
      const osc = offlineCtx.createOscillator();
      const filter = offlineCtx.createBiquadFilter();
      const gain = offlineCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(680, t);

      // Sangat halus & stabil tanpa dinamika tajam
      const targetVol = musicVol * 0.045;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(targetVol, t + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, Math.min(actualDuration, t + 2.4));

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(offlineCtx.destination);

      osc.start(t);
      osc.stop(Math.min(actualDuration, t + 2.5));

      t += step;
      noteIdx++;
    }
  } else if (ambientType === 'gitar-reflektif') {
    // 🍂 PETIKAN GITAR REFLEKTIF & RHODES HANGAT (Khusus Kecewa)
    // Reflektif, hangat, memberi kelegaan dan penerimaan
    const refChords = [
      [129.6, 194.4, 259.2, 345.6],  // Fmaj7
      [108, 162, 216, 324],          // Em7
      [144, 216, 288, 360],          // Dm7
      [129.6, 194.4, 259.2, 388.8],  // Cmaj7
    ];

    const refInterval = 7.5;
    const numC = Math.ceil(actualDuration / refInterval);

    for (let i = 0; i < numC; i++) {
      const chordT = i * refInterval + 0.6;
      if (chordT >= actualDuration - 1.5) break;

      const chord = refChords[i % refChords.length];
      chord.forEach((freq, idx) => {
        const nT = chordT + idx * 0.22;
        if (nT < actualDuration - 1.5) {
          const osc = offlineCtx.createOscillator();
          const filter = offlineCtx.createBiquadFilter();
          const gain = offlineCtx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, nT);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(460, nT);
          filter.frequency.exponentialRampToValueAtTime(160, nT + 4.5);

          const vol = musicVol * (0.055 / (idx + 1));
          gain.gain.setValueAtTime(0.0001, nT);
          gain.gain.linearRampToValueAtTime(vol, nT + 0.12);
          gain.gain.exponentialRampToValueAtTime(0.0001, Math.min(actualDuration, nT + 5.5));

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(offlineCtx.destination);

          osc.start(nT);
          osc.stop(Math.min(actualDuration, nT + 6.0));
        }
      });
    }
  } else if (ambientType === 'tibetan-bowl-deep') {
    // 🔔 RESONANSI TIBETAN BOWL & PAD SOMATIS (Khusus Body Awareness)
    // Perlahan dan stabil, berirama dengan napas sadar
    const bowlFreqs = [108, 216, 432, 528];
    bowlFreqs.forEach((freq, idx) => {
      const osc = offlineCtx.createOscillator();
      const gain = offlineCtx.createGain();
      const filter = offlineCtx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, 0);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(360, 0);

      // Slow deep breathing cycle
      const baseVol = (musicVol * 0.05) / (idx + 1);
      gain.gain.setValueAtTime(0.0001, 0);
      gain.gain.linearRampToValueAtTime(baseVol, fadeIn + 2.0);
      gain.gain.setValueAtTime(baseVol, actualDuration - fadeOut);
      gain.gain.linearRampToValueAtTime(0.0001, actualDuration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(offlineCtx.destination);

      osc.start(0);
      osc.stop(actualDuration);
    });
  } else if (ambientType === 'lullaby-malam') {
    // 🌙 MUSIK TIDUR HENING & SANGAT PERLAHAN (Khusus Tidur)
    // Sangat lembut, stabil, nada-nada hangat tempo perlahan
    const lullabyNotes = [108, 162, 216, 288];
    lullabyNotes.forEach((freq, idx) => {
      const osc = offlineCtx.createOscillator();
      const gain = offlineCtx.createGain();
      const filter = offlineCtx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, 0);
      osc.detune.setValueAtTime(idx * 0.5, 0);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, 0); // Sangat hangat & bebas distorsi

      const baseVol = (musicVol * 0.038) / (idx + 1);
      gain.gain.setValueAtTime(0.0001, 0);
      gain.gain.linearRampToValueAtTime(baseVol, fadeIn + 3.0);
      gain.gain.setValueAtTime(baseVol, actualDuration - fadeOut);
      gain.gain.linearRampToValueAtTime(0.0001, actualDuration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(offlineCtx.destination);

      osc.start(0);
      osc.stop(actualDuration);
    });
  } else if (ambientType === 'pad-sinematik') {
    // Ultra-light, airy analog warm pad drone (432Hz Solfeggio Harmonics)
    const padFreqs = [108, 216, 324, 432];
    padFreqs.forEach((freq, idx) => {
      const osc = offlineCtx.createOscillator();
      const filter = offlineCtx.createBiquadFilter();
      const gain = offlineCtx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, 0);
      osc.detune.setValueAtTime((idx % 2 === 0 ? 2 : -2), 0);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380, 0);

      const baseVol = (musicVol * 0.06) / (idx + 1);
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
    // 🍃 ULTRA-MINIMAL PURE SINE (Khusus Overthinking & Presence - Suara Alam Dominan)
    // Sederhana, stabil, tidak banyak melodi agar pikiran tidak ramai
    const minFreqs = [108, 216, 432];
    minFreqs.forEach((freq, idx) => {
      const osc = offlineCtx.createOscillator();
      const gain = offlineCtx.createGain();
      const filter = offlineCtx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, 0);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(240, 0);

      const baseVol = (musicVol * 0.035) / (idx + 1);
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
    // String Akustik Halus & Damai (528Hz Solfeggio)
    const stringFreqs = [132, 264, 396];
    stringFreqs.forEach((freq, idx) => {
      const osc = offlineCtx.createOscillator();
      const gain = offlineCtx.createGain();
      const filter = offlineCtx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, 0);
      osc.detune.setValueAtTime(idx * 1.5, 0);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, 0);

      const baseVol = (musicVol * 0.035) / (idx + 1);
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
  // 2. NATURE BACKSOUND SYNTHESIS (Primary Audio Element - 8 Atmospheres)
  // -------------------------------------------------------------
  const layerCount = Math.max(1, selectedNatureTypes.length);
  const layerGainScale = 1 / Math.sqrt(layerCount);

  for (const nType of selectedNatureTypes) {
    const noiseBufferSize = sampleRate * 6;
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
      // 🌊 Air mengalir lembut (smooth continuous flow of mountain spring water)
      natureFilter.type = 'bandpass';
      natureFilter.frequency.setValueAtTime(620, 0);
      natureFilter.Q.setValueAtTime(1.1, 0);
      natureGain.gain.setValueAtTime(effectiveLayerVol * 0.9, 0);
    } else if (nType === 'air-terjun-lembut') {
      // 🌊 Air terjun lembut (deep soothing cascade roar & gentle mist dispersion)
      natureFilter.type = 'lowpass';
      natureFilter.frequency.setValueAtTime(820, 0);
      natureGain.gain.setValueAtTime(effectiveLayerVol * 0.92, 0);
    } else if (nType === 'hujan-lembut') {
      // 🌧️ Hujan ringan (soothing, gentle rain drops on leaves, zero harshness)
      natureFilter.type = 'lowpass';
      natureFilter.frequency.setValueAtTime(1100, 0);
      natureGain.gain.setValueAtTime(effectiveLayerVol * 0.85, 0);
    } else if (nType === 'gemericik-air') {
      // 💧 Gemericik air (delicate watery ripples & crystalline droplet blips)
      natureFilter.type = 'bandpass';
      natureFilter.frequency.setValueAtTime(1150, 0);
      natureFilter.Q.setValueAtTime(2.2, 0);
      natureGain.gain.setValueAtTime(effectiveLayerVol * 0.7, 0);

      const dropTimes = [2.5, 6.5, 11, 16.5, 21.5, 27];
      dropTimes.forEach((dt) => {
        if (dt < actualDuration - 2) {
          const dropOsc = offlineCtx.createOscillator();
          const dropGain = offlineCtx.createGain();
          dropOsc.type = 'sine';
          dropOsc.frequency.setValueAtTime(950 + Math.random() * 250, dt);
          dropOsc.frequency.exponentialRampToValueAtTime(1700 + Math.random() * 300, dt + 0.07);

          dropGain.gain.setValueAtTime(0.0001, dt);
          dropGain.gain.linearRampToValueAtTime(effectiveLayerVol * 0.22, dt + 0.02);
          dropGain.gain.exponentialRampToValueAtTime(0.0001, dt + 0.14);

          dropOsc.connect(dropGain);
          dropGain.connect(offlineCtx.destination);
          dropOsc.start(dt);
          dropOsc.stop(dt + 0.18);
        }
      });
    } else if (nType === 'burung-pagi' || nType === 'fajar-tenang') {
      // 🐦 Burung natural yang jauh & fajar tenang (peaceful, distant reverberant songs)
      natureFilter.type = 'lowpass';
      natureFilter.frequency.setValueAtTime(450, 0);
      natureGain.gain.setValueAtTime(effectiveLayerVol * 0.35, 0);

      const birdTimes = [3, 9, 16, 22];
      birdTimes.forEach((bt) => {
        if (bt < actualDuration - 2) {
          const chirps = 3;
          for (let k = 0; k < chirps; k++) {
            const chirpTime = bt + k * 0.19;
            const osc = offlineCtx.createOscillator();
            const chirpGain = offlineCtx.createGain();

            osc.type = 'sine';
            const baseF = 2300 + Math.random() * 400;
            osc.frequency.setValueAtTime(baseF, chirpTime);
            osc.frequency.linearRampToValueAtTime(baseF + 650, chirpTime + 0.05);
            osc.frequency.linearRampToValueAtTime(baseF - 150, chirpTime + 0.13);

            chirpGain.gain.setValueAtTime(0.0001, chirpTime);
            chirpGain.gain.linearRampToValueAtTime(effectiveLayerVol * 0.20, chirpTime + 0.03);
            chirpGain.gain.exponentialRampToValueAtTime(0.0001, chirpTime + 0.14);

            osc.connect(chirpGain);
            chirpGain.connect(offlineCtx.destination);
            osc.start(chirpTime);
            osc.stop(chirpTime + 0.15);
          }
        }
      });
    } else if (nType === 'angin-pepohonan') {
      // 🍃 Angin di pepohonan (ultra-soft slow breeze through green canopy)
      natureFilter.type = 'lowpass';
      natureFilter.frequency.setValueAtTime(320, 0);
      natureGain.gain.setValueAtTime(effectiveLayerVol * 0.9, 0);
    } else if (nType === 'ombak-pantai') {
      // 🌊 Ombak lembut (rhythmic ocean tidal breath, slow in-out flow)
      natureFilter.type = 'lowpass';
      natureFilter.frequency.setValueAtTime(420, 0);
      natureGain.gain.setValueAtTime(effectiveLayerVol * 0.88, 0);
    } else if (nType === 'hutan-alami') {
      // 🌲 Suasana hutan yang nyaman (grounded, warm sanctuary woodland shelter)
      natureFilter.type = 'bandpass';
      natureFilter.frequency.setValueAtTime(480, 0);
      natureFilter.Q.setValueAtTime(0.85, 0);
      natureGain.gain.setValueAtTime(effectiveLayerVol * 0.8, 0);
    } else if (nType === 'suasana-alam-tenang') {
      // 🌿 Suasana alam terbuka (wide airy horizon breeze, calm and open space)
      natureFilter.type = 'lowpass';
      natureFilter.frequency.setValueAtTime(360, 0);
      natureGain.gain.setValueAtTime(effectiveLayerVol * 0.75, 0);
    } else if (nType === 'suasana-malam') {
      // 🌙 Suasana malam tenang (gentle nocturnal breeze & soft distant crickets)
      natureFilter.type = 'lowpass';
      natureFilter.frequency.setValueAtTime(260, 0);
      natureGain.gain.setValueAtTime(effectiveLayerVol * 0.6, 0);

      const cricketTimes = [1.5, 6, 11.5, 17, 22.5];
      cricketTimes.forEach((ct) => {
        if (ct < actualDuration - 2) {
          for (let p = 0; p < 3; p++) {
            const pTime = ct + p * 0.09;
            const osc = offlineCtx.createOscillator();
            const cGain = offlineCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(4200 + Math.random() * 150, pTime);

            cGain.gain.setValueAtTime(0.0001, pTime);
            cGain.gain.linearRampToValueAtTime(effectiveLayerVol * 0.06, pTime + 0.02);
            cGain.gain.exponentialRampToValueAtTime(0.0001, pTime + 0.06);

            osc.connect(cGain);
            cGain.connect(offlineCtx.destination);
            osc.start(pTime);
            osc.stop(pTime + 0.07);
          }
        }
      });
    } else {
      natureFilter.type = 'lowpass';
      natureFilter.frequency.setValueAtTime(500, 0);
      natureGain.gain.setValueAtTime(effectiveLayerVol * 0.7, 0);
    }

    noiseSource.connect(natureFilter);
    natureFilter.connect(natureGain);
    natureGain.connect(offlineCtx.destination);
    noiseSource.start(0);
    noiseSource.stop(actualDuration);
  }

  // -------------------------------------------------------------
  // 3. TIBETAN SINGING BOWL (Subtle 528Hz Peace Resonance - Very Soft)
  // -------------------------------------------------------------
  if (withBowl) {
    const bowlTimes = [1.2, 14.5];
    bowlTimes.forEach((t) => {
      if (t < actualDuration - 3) {
        const bowlOsc1 = offlineCtx.createOscillator();
        const bowlOsc2 = offlineCtx.createOscillator();
        const bowlGain = offlineCtx.createGain();

        bowlOsc1.type = 'sine';
        bowlOsc1.frequency.setValueAtTime(528, t);
        bowlOsc2.type = 'sine';
        bowlOsc2.frequency.setValueAtTime(528 * 2.76, t);

        bowlGain.gain.setValueAtTime(0.0001, t);
        bowlGain.gain.linearRampToValueAtTime(0.04, t + 0.2);
        bowlGain.gain.exponentialRampToValueAtTime(0.0001, Math.min(actualDuration, t + 7.5));

        bowlOsc1.connect(bowlGain);
        bowlOsc2.connect(bowlGain);
        bowlGain.connect(offlineCtx.destination);

        bowlOsc1.start(t);
        bowlOsc1.stop(Math.min(actualDuration, t + 8));
        bowlOsc2.start(t);
        bowlOsc2.stop(Math.min(actualDuration, t + 8));
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
 * 2. 🐦 Burung natural yang jauh (reverberant gentle distant birds)
 * 3. 🍃 Angin di pepohonan (ultra-soft canopy breeze)
 * 4. 🎹 Musik ambient/piano yang sangat lembut & tipis (warm 432Hz light piano chords)
 *
 * Characteristics: Tenang, Nyaman, Hangat, Cerah, Natural, Menenangkan, Aman Didengar.
 */
export async function generateLegaCalmNatureWav(
  durationSeconds = 24,
  customVolumes?: { natureVolume?: number; musicVolume?: number }
): Promise<string> {
  return generateRelaxationSoundscapeWav(durationSeconds, {
    natureTypes: ['aliran-sungai', 'burung-pagi', 'angin-pepohonan'],
    ambientType: 'piano-lembut',
    natureVolume: customVolumes?.natureVolume ?? 0.34, // Primary nature sound
    musicVolume: customVolumes?.musicVolume ?? 0.12, // Very thin background layer
    fadeInSeconds: 4.0,
    fadeOutSeconds: 5.5,
    includeSingingBowl: true
  });
}

/**
 * EMOTION & TRAINING NEED PRESET CONFIGURATIONS (LEGA Audio Presets)
 * Suasana alam tetap menjadi identitas utama seluruh audio LEGA.
 * Musik relaksasinya disesuaikan secara dinamis dengan kebutuhan & emosi pengguna.
 */
export interface EmotionalAudioPreset {
  id: string;
  name: string;
  emotionLabel: string;
  musicDescription: string;
  natureDescription: string;
  natureTypes: NatureSoundType[];
  ambientMusic: AmbientMusicType;
  narrationPromptTone: string;
  suggestedGeminiVoice: string;
  sampleScript: string;
  natureVolume: number;
  musicVolume: number;
  narrationVolume: number;
}

export const LEGA_EMOTION_PRESETS: Record<string, EmotionalAudioPreset> = {
  'marah': {
    id: 'marah',
    name: 'LEGA — MARAH',
    emotionLabel: 'Pelepasan & Ketenangan Marah',
    musicDescription: 'Musik petikan gitar akustik lembut, stabil, tidak ramai, dan ritme perlahan.',
    natureDescription: 'Angin lembut di pepohonan & aliran air sungai pegunungan.',
    natureTypes: ['angin-pepohonan', 'aliran-sungai'],
    ambientMusic: 'petikan-gitar',
    narrationPromptTone: 'Suara tenang, stabil, memberi ruang aman tanpa menghakimi, membantu meredakan gelora amarah.',
    suggestedGeminiVoice: 'Suara Tenang',
    sampleScript: 'Sadari rasa marah yang sedang hadir di dalam diri Anda. Anda tidak perlu melawannya atau menekannya. Izinkan napas Anda mengalir perlahan... Dengarkan semilir angin yang menaungi pepohonan dan arus air yang senantiasa mengalir. Bersama setiap hembusan napas, lepaskan ketegangan di rahang, leher, dan dada Anda. Anda aman di sini.',
    natureVolume: 0.34,
    musicVolume: 0.11,
    narrationVolume: 0.90
  },
  'sedih': {
    id: 'sedih',
    name: 'LEGA — SEDIH',
    emotionLabel: 'Ruang Hangat Merasakan Kesedihan',
    musicDescription: 'Musik instrumen akustik lembut dan hangat, memberi ruang aman tanpa membuat suasana terasa semakin berat.',
    natureDescription: 'Rintik hujan ringan menyejukkan & gemericik air alami.',
    natureTypes: ['hujan-lembut', 'gemericik-air'],
    ambientMusic: 'akustik-hangat',
    narrationPromptTone: 'Suara hangat dan lembut, penuh welas asih, merangkul tanpa terburu-buru menghibur.',
    suggestedGeminiVoice: 'Suara Hangat',
    sampleScript: 'Izinkan diri Anda merasakan apa pun yang sedang hadir. Kesedihan adalah bukti bahwa ada hal berharga yang Anda pedulikan. Dengarkan rintik hujan lembut yang menyejukkan... Rasakan kehangatan musik yang menemani Anda tanpa menuntut apa pun. Berikan pelukan kasih sayang pada diri Anda sendiri saat ini.',
    natureVolume: 0.32,
    musicVolume: 0.11,
    narrationVolume: 0.90
  },
  'cemas': {
    id: 'cemas',
    name: 'LEGA — CEMAS',
    emotionLabel: 'Kestabilan & Ketenangan Batin',
    musicDescription: 'Musik kalimba & harpa stabil, ringan, menenangkan, tanpa perubahan suara yang mendadak.',
    natureDescription: 'Air mengalir lembut, semilir angin, dan rintik hujan ringan.',
    natureTypes: ['aliran-sungai', 'angin-pepohonan'],
    ambientMusic: 'harp-kalimba',
    narrationPromptTone: 'Suara jernih, stabil, dan konsisten, memandu kembali ke pijakan yang nyata.',
    suggestedGeminiVoice: 'Suara Jernih',
    sampleScript: 'Tarik napas perlahan... dan hembuskan dengan lembut. Sadari bahwa saat ini Anda berada di tempat yang aman. Dengarkan aliran air yang mengalir stabil di hadapan Anda... dan petikan nada lembut yang konstan. Pikiran Anda mungkin sedang mengembara ke masa depan, namun tubuh Anda ada di sini, aman dan terlindungi.',
    natureVolume: 0.34,
    musicVolume: 0.10,
    narrationVolume: 0.90
  },
  'takut': {
    id: 'takut',
    name: 'LEGA — TAKUT',
    emotionLabel: 'Rasa Aman & Perlindungan Jiwa',
    musicDescription: 'Musik instrumen akustik yang terasa aman, lembut, hangat, dan menaungi.',
    natureDescription: 'Suasana hutan kanopi yang tenang, teduh, dan angin lembut.',
    natureTypes: ['hutan-alami', 'angin-pepohonan'],
    ambientMusic: 'akustik-hangat',
    narrationPromptTone: 'Suara dalam, kokoh, menenteramkan, dan meyakinkan rasa aman.',
    suggestedGeminiVoice: 'Suara Dalam',
    sampleScript: 'Anda tidak sendirian. Sadari telapak kaki Anda yang menopang ke bumi. Masuki keteduhan kanopi hutan yang kokoh dan melindungi Anda dari segala badai. Rasakan kehangatan nada musik yang menyelimuti tubuh Anda. Ambil napas dalam... di dalam ruang ini, Anda aman dan berdaya.',
    natureVolume: 0.32,
    musicVolume: 0.11,
    narrationVolume: 0.90
  },
  'kecewa': {
    id: 'kecewa',
    name: 'LEGA — KECEWA',
    emotionLabel: 'Refleksi Batin & Pelepasan Ekspektasi',
    musicDescription: 'Musik petikan gitar reflektif yang lembut dan hangat.',
    natureDescription: 'Air sungai mengalir & semilir angin dedaunan.',
    natureTypes: ['aliran-sungai', 'angin-pepohonan'],
    ambientMusic: 'gitar-reflektif',
    narrationPromptTone: 'Suara lembut dan bijaksana, membimbing penerimaan realitas dengan lapang dada.',
    suggestedGeminiVoice: 'Suara Lembut',
    sampleScript: 'Kekecewaan hadir ketika harapan kita belum sesuai dengan kenyataan. Biarkan diri Anda bernapas bersama rasa ini... Dengarkan petikan gitar reflektif dan air yang mengalir melepaskan bebannya. Apa yang terjadi biarlah berlalu. Saat ini, Anda berhak memulihkan batin Anda kembali.',
    natureVolume: 0.32,
    musicVolume: 0.12,
    narrationVolume: 0.90
  },
  'overthinking': {
    id: 'overthinking',
    name: 'LEGA — OVERTHINKING',
    emotionLabel: 'Pengheningan Pikiran & Jeda Mental',
    musicDescription: 'Musik ambient sederhana, stabil, dan minimalis tanpa banyak melodi agar pikiran tidak semakin ramai.',
    natureDescription: 'Air mengalir stabil & gemericik air alami di bebatuan.',
    natureTypes: ['aliran-sungai', 'gemericik-air'],
    ambientMusic: 'ambient-minimal',
    narrationPromptTone: 'Suara natural, santai, memberi jeda hening yang luas tanpa instruksi rumit.',
    suggestedGeminiVoice: 'Suara Natural',
    sampleScript: 'Pikiran Anda telah bekerja sangat keras hari ini. Sekarang adalah waktunya beristirahat. Anda tidak perlu menganalisis atau memecahkan apa pun saat ini. Fokuskan pendengaran Anda hanya pada aliran air yang konstan dan jernih. Setiap kali pikiran muncul, biarkan ia mengalir seperti daun di atas air sungai.',
    natureVolume: 0.36,
    musicVolume: 0.08,
    narrationVolume: 0.88
  },
  'presence': {
    id: 'presence',
    name: 'LEGA — PRESENCE (Hadir Saat Ini)',
    emotionLabel: 'Kesadaran Momen Ini',
    musicDescription: 'Musik minimalis yang sangat ringan dan natural, membiarkan suara alam menjadi LEBIH dominan daripada musik.',
    natureDescription: 'Suasana alam terbuka, kicau burung alami di kejauhan, dan semilir angin fajar.',
    natureTypes: ['suasana-alam-tenang', 'burung-pagi', 'angin-pepohonan'],
    ambientMusic: 'ambient-minimal',
    narrationPromptTone: 'Suara jernih dan hadir, membimbing panca indra ke saat ini.',
    suggestedGeminiVoice: 'Suara Jernih',
    sampleScript: 'Bawa seluruh kesadaran Anda ke momen ini. Rasakan udara yang menyentuh kulit... dengarkan kicau burung fajar yang bergema di kejauhan... dan semilir angin di padang rumput terbuka. Tidak ada masa lalu, tidak ada masa depan. Hanya ada keheningan dan kehidupan di saat ini.',
    natureVolume: 0.38,
    musicVolume: 0.07,
    narrationVolume: 0.88
  },
  'body-awareness': {
    id: 'body-awareness',
    name: 'LEGA — BODY AWARENESS (Kesadaran Tubuh)',
    emotionLabel: 'Pengamatan & Relaksasi Somatis',
    musicDescription: 'Musik perlahan dan stabil dengan resonansi mangkuk Tibet dan pad somatis bernada 528Hz.',
    natureDescription: 'Air mengalir lembut, semilir angin pepohonan, dan gemericik air sejuk.',
    natureTypes: ['aliran-sungai', 'angin-pepohonan'],
    ambientMusic: 'tibetan-bowl-deep',
    narrationPromptTone: 'Suara dalam, berakar, dan perlahan, memandu pemindaian tubuh secara bertahap.',
    suggestedGeminiVoice: 'Suara Dalam',
    sampleScript: 'Arahkan perhatian lembut Anda ke seluruh tubuh. Mulai dari ujung jari kaki... naik perlahan ke betis... paha... perut... hingga pundak dan wajah. Rasakan resonansi mangkuk hening dan aliran air yang merelakskan setiap serat otot Anda. Setiap napas masuk membawa ketenangan, setiap napas keluar melepaskan beban.',
    natureVolume: 0.34,
    musicVolume: 0.11,
    narrationVolume: 0.90
  },
  'release': {
    id: 'release',
    name: 'LEGA — RELEASE (Pelepasan Emosi)',
    emotionLabel: 'Katarsis & Kelegaan Batin',
    musicDescription: 'Musik pelepasan dinamis yang mengalun lembut menyesuaikan emosi yang diproses.',
    natureDescription: 'Air mengalir bebas, semilir angin pepohonan, dan deburan ombak berirama.',
    natureTypes: ['aliran-sungai', 'angin-pepohonan', 'ombak-pantai'],
    ambientMusic: 'pad-sinematik',
    narrationPromptTone: 'Suara tenang dan mantap, memandu proses pelepasan emosi secara tuntas dan aman.',
    suggestedGeminiVoice: 'Suara Tenang',
    sampleScript: 'Tarik napas dalam-dalam memenuhi rongga dada Anda... tahan sejenak... dan hembuskan dengan kelegaan yang utuh melalui mulut. Lepaskan apa pun yang selama ini Anda genggam dengan erat. Dengarkan perpaduan arus air dan angin bebas. Biarkan diri Anda merasa lega, ringan, dan bebas.',
    natureVolume: 0.35,
    musicVolume: 0.12,
    narrationVolume: 0.90
  },
  'tidur': {
    id: 'tidur',
    name: 'LEGA — TIDUR (Pengantar Tidur Nyenyak)',
    emotionLabel: 'Istirahat Malam & Tidur Lelap',
    musicDescription: 'Musik tidur hening, sangat lembut, stabil, dan bertempo perlahan (Delta-Sleep 432Hz).',
    natureDescription: 'Suasana malam tenang, desau angin malam, dan rintik hujan lembut.',
    natureTypes: ['suasana-malam', 'hujan-lembut'],
    ambientMusic: 'lullaby-malam',
    narrationPromptTone: 'Suara sangat lembut, hangat, mengalun perlahan, menidurkan sistem syaraf.',
    suggestedGeminiVoice: 'Suara Lembut',
    sampleScript: 'Hari ini telah usai, dan Anda telah melakukan yang terbaik. Biarkan tubuh Anda tenggelam dalam kelembutan kasur yang nyaman. Dengarkan suara malam yang hening dan rintik hujan yang menentramkan. Pejamkan mata Anda... biarkan pikiran Anda melayang dalam kedamaian... Selamat beristirahat dalam tidur yang lelap.',
    natureVolume: 0.30,
    musicVolume: 0.09,
    narrationVolume: 0.88
  }
};

/**
 * Synthesizes specialized emotional relaxation soundscapes based on user's emotion or training goal
 */
export async function generateEmotionSoundscapeWav(
  emotionKey: string,
  durationSeconds = 24
): Promise<string> {
  const normKey = emotionKey.toLowerCase().replace(/lega\s*[-—]\s*/i, '').trim();
  const preset = LEGA_EMOTION_PRESETS[normKey] || LEGA_EMOTION_PRESETS['marah'] || LEGA_EMOTION_PRESETS['cemas'];

  return generateRelaxationSoundscapeWav(durationSeconds, {
    natureTypes: preset.natureTypes,
    ambientType: preset.ambientMusic,
    natureVolume: preset.natureVolume,
    musicVolume: preset.musicVolume,
    fadeInSeconds: 3.5,
    fadeOutSeconds: 4.5,
    includeSingingBowl: normKey !== 'overthinking' && normKey !== 'presence'
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
let activeUtterance: SpeechSynthesisUtterance | null = null;
let speechKeepAliveInterval: number | null = null;

if (typeof window !== 'undefined' && window.speechSynthesis) {
  const updateVoices = () => {
    try {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        cachedVoices = v;
      }
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
  const q = nameOrKey.toLowerCase().trim();

  // 1. Direct match by id or name
  const exact = VOICE_CHARACTERS.find(
    (v) => v.id === q || v.name.toLowerCase() === q || v.geminiVoice.toLowerCase() === q
  );
  if (exact) return exact;

  // 2. Keyword heuristic mapping for all 6 official voices
  if (q.includes('tenang') || q.includes('kore') || q.includes('laras') || q === '1') {
    return VOICE_CHARACTERS[0]; // Suara Tenang
  }
  if (q.includes('hangat') || q.includes('puck') || q.includes('damai') || q === '2') {
    return VOICE_CHARACTERS[1]; // Suara Hangat
  }
  if (q.includes('lembut') || q.includes('aoede') || q.includes('nirmala') || q === '3') {
    return VOICE_CHARACTERS[2]; // Suara Lembut
  }
  if (q.includes('natural') || q.includes('zephyr') || q.includes('bayu') || q === '4') {
    return VOICE_CHARACTERS[3]; // Suara Natural
  }
  if (q.includes('jernih') || q.includes('leda') || q.includes('calliope') || q === '5') {
    return VOICE_CHARACTERS[4]; // Suara Jernih
  }
  if (q.includes('dalam') || q.includes('fenrir') || q.includes('arga') || q.includes('charon') || q.includes('orus') || q === '6') {
    return VOICE_CHARACTERS[5]; // Suara Dalam
  }

  // 3. Fallback fuzzy search
  const found = VOICE_CHARACTERS.find(
    (v) =>
      v.indonesianName.toLowerCase().includes(q) ||
      v.label.toLowerCase().includes(q) ||
      v.tone.toLowerCase().includes(q)
  );
  return found || VOICE_CHARACTERS[0];
}

function clearSpeechKeepAlive() {
  if (speechKeepAliveInterval !== null) {
    window.clearInterval(speechKeepAliveInterval);
    speechKeepAliveInterval = null;
  }
}

function startSpeechKeepAlive() {
  clearSpeechKeepAlive();
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  
  // Chrome bug fix: speech pauses after ~15s without resume ping
  speechKeepAliveInterval = window.setInterval(() => {
    if (!window.speechSynthesis.speaking) {
      clearSpeechKeepAlive();
      return;
    }
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    } else {
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }
  }, 9000);
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
    clearSpeechKeepAlive();
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
  utterance.volume = options?.volume !== undefined ? Math.max(0, Math.min(1, options.volume)) : 0.95;
  utterance.lang = 'id-ID';

  let voices = cachedVoices.length > 0 ? cachedVoices : (window.speechSynthesis.getVoices() || []);
  if (voices.length === 0) {
    try {
      voices = window.speechSynthesis.getVoices() || [];
    } catch {
      // ignore
    }
  }
  
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
        v.name.toLowerCase().includes('pria') ||
        v.name.toLowerCase().includes('bayu') ||
        v.name.toLowerCase().includes('arga')
      ) || idVoices[0];
    } else {
      chosenVoice = idVoices.find(v => 
        v.name.toLowerCase().includes('female') || 
        v.name.toLowerCase().includes('gadis') || 
        v.name.toLowerCase().includes('wanita') ||
        v.name.toLowerCase().includes('siti') ||
        v.name.toLowerCase().includes('laras') ||
        v.name.toLowerCase().includes('sinta')
      ) || idVoices[0];
    }
  } else {
    // Multilingual natural fallback
    chosenVoice = voices.find(v => v.lang.startsWith('en') && (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('online'))) || voices[0];
  }

  if (chosenVoice) {
    utterance.voice = chosenVoice;
  }

  utterance.onstart = () => {
    startSpeechKeepAlive();
    if (options?.onStart) options.onStart();
  };

  utterance.onend = () => {
    clearSpeechKeepAlive();
    activeUtterance = null;
    if (options?.onEnd) options.onEnd();
  };

  utterance.onerror = (e) => {
    clearSpeechKeepAlive();
    activeUtterance = null;
    console.warn('SpeechSynthesis utterance error:', e);
    if (options?.onError) options.onError(e);
  };

  // Hold in module scope so browser GC does not destroy it during speech
  activeUtterance = utterance;

  try {
    window.speechSynthesis.speak(utterance);
    startSpeechKeepAlive();
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
  onStart?: () => void,
  onEnd?: () => void
): SpeechSynthesisUtterance | null {
  const profile = getVoiceCharacter(voiceName);
  return speakIndonesianNarration(profile.samplePhrase, {
    voiceCharacter: profile.name,
    rate: profile.rate,
    pitch: profile.pitch,
    onStart,
    onEnd: () => {
      if (onEnd) onEnd();
    },
    onError: () => {
      if (onEnd) onEnd();
    }
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
