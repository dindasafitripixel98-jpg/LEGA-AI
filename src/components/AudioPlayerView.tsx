import React, { useState, useRef, useEffect } from 'react';
import {
  Headphones,
  Sparkles,
  Play,
  Pause,
  Square,
  Volume1,
  Volume2,
  VolumeX,
  RotateCcw,
  ShieldCheck,
  Layers,
  Radio,
  RefreshCw,
  Sliders,
  User,
  Clock,
  Mic,
  CheckCircle2,
  Copy,
  Check,
  Download,
  HelpCircle,
  HeartHandshake,
  Sun,
  Flame,
  Smile,
  Zap,
  BookOpen,
  ArrowRight,
  Music,
  Bell,
  Waves,
  Trees,
  CloudRain,
  Wind,
  Bird,
  Droplets,
  Disc,
  Info,
  SlidersHorizontal,
  CheckSquare,
  Moon,
  Sunrise,
  Filter
} from 'lucide-react';
import { ModuleType, NatureSoundType, AmbientMusicType, AudioRelaxationMetadata } from '../types';
import { generateAudioScript, generateGeminiTts } from '../lib/geminiApi';
import {
  pcmToWavBlobUrl,
  generateRelaxationSoundscapeWav,
  generateLegaCalmNatureWav,
  LEGA_CALM_NATURE_CONFIG,
  speakIndonesianNarration,
  stopIndonesianNarration,
  playCalmMeditationChime,
  NATURE_SOUND_DEFINITIONS,
  AMBIENT_MUSIC_DEFINITIONS,
  buildAudioRelaxationMetadata,
  VOICE_CHARACTERS,
  getVoiceCharacter,
  previewIndonesianVoiceCharacter,
  VoiceCharacterProfile
} from '../lib/audioEngine';
import { setStoredVoiceName } from '../lib/voiceService';

interface AudioPlayerViewProps {
  onSelectModule?: (module: ModuleType | string) => void;
  onOpenCrisis?: () => void;
  userName?: string;
}

export interface AudioCategory {
  id: 'release' | 'presence' | 'reflection' | 'calm' | 'growth';
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  defaultNature: NatureSoundType;
  defaultAmbient: AmbientMusicType;
  subcategories: string[];
}

const CATEGORIES: AudioCategory[] = [
  {
    id: 'release',
    name: 'LEGA Release',
    icon: Flame,
    color: 'text-rose-400',
    bgColor: 'bg-rose-950/80 border-rose-800',
    defaultNature: 'angin-pepohonan',
    defaultAmbient: 'pad-sinematik',
    subcategories: [
      'Pelepasan Marah',
      'Pelepasan Sedih',
      'Pelepasan Cemas',
      'Pelepasan Kecewa',
      'Pelepasan Bersalah',
      'Pelepasan Rasa Malu',
      'Pelepasan Iri',
      'Pelepasan Dendam',
      'Pelepasan Ketakutan'
    ]
  },
  {
    id: 'presence',
    name: 'LEGA Presence',
    icon: Zap,
    color: 'text-amber-400',
    bgColor: 'bg-amber-950/80 border-amber-800',
    defaultNature: 'gemericik-air',
    defaultAmbient: 'piano-lembut',
    subcategories: [
      'Hadir Saat Ini',
      'Kesadaran Napas',
      'Kesadaran Tubuh',
      'Kesadaran Pikiran',
      'Kesadaran Emosi'
    ]
  },
  {
    id: 'reflection',
    name: 'LEGA Reflection',
    icon: HeartHandshake,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-950/80 border-emerald-800',
    defaultNature: 'aliran-sungai',
    defaultAmbient: 'piano-lembut',
    subcategories: [
      'Syukur',
      'Memaafkan',
      'Penerimaan Diri',
      'Belas Kasih kepada Diri',
      'Mengenal Nilai Hidup',
      'Refleksi Harian',
      'Refleksi Malam'
    ]
  },
  {
    id: 'calm',
    name: 'LEGA Calm',
    icon: Sun,
    color: 'text-sky-400',
    bgColor: 'bg-sky-950/80 border-sky-800',
    defaultNature: 'hujan-lembut',
    defaultAmbient: 'piano-lembut',
    subcategories: [
      'Mengurangi Overthinking',
      'Relaksasi Sebelum Tidur',
      'Menenangkan Pikiran',
      'Istirahat Mental',
      'Pemulihan Setelah Hari yang Berat'
    ]
  },
  {
    id: 'growth',
    name: 'LEGA Growth',
    icon: Smile,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-950/80 border-indigo-800',
    defaultNature: 'burung-pagi',
    defaultAmbient: 'string-halus',
    subcategories: [
      'Inner Child Reflection',
      'Membangun Kebiasaan Baru',
      'Persiapan Menghadapi Hari',
      'Meningkatkan Fokus',
      'Membangun Kepercayaan Diri'
    ]
  }
];

const NATURE_OPTIONS: { id: NatureSoundType; name: string; icon: any; desc: string }[] = [
  { id: 'aliran-sungai', name: 'Aliran Sungai Alami', icon: Droplets, desc: 'Gemericik arus air jernih pegunungan yang konstan' },
  { id: 'gemericik-air', name: 'Gemericik Air', icon: Droplets, desc: 'Tetesan air sejuk lembut di atas bebatuan' },
  { id: 'burung-pagi', name: 'Burung Pagi', icon: Bird, desc: 'Kicau burung fajar alami di kejauhan' },
  { id: 'angin-pepohonan', name: 'Angin di Pepohonan', icon: Wind, desc: 'Semilir hembusan angin lembut mengayun dedaunan' },
  { id: 'ombak-pantai', name: 'Ombak Pantai', icon: Waves, desc: 'Deburan ombak laut tenang menenangkan napas' },
  { id: 'hutan-alami', name: 'Hutan Alami', icon: Trees, desc: 'Kanopi hutan tropis rimbun, teduh, dan luas' },
  { id: 'hujan-lembut', name: 'Hujan Lembut', icon: CloudRain, desc: 'Rintik hujan tenang pengantar istirahat damai' },
  { id: 'suasana-malam', name: 'Suasana Malam Tenang', icon: Moon, desc: 'Udara malam sejuk dengan jangkrik hening halus' },
  { id: 'suasana-alam-tenang', name: 'Suasana Alam Tenang', icon: Trees, desc: 'Lanskap alam hening minimalis' },
  { id: 'fajar-tenang', name: 'Fajar Menenteramkan', icon: Sunrise, desc: 'Kesegaran hembusan fajar dan kicauan burung pagi' }
];

const AMBIENT_OPTIONS: { id: AmbientMusicType; name: string; desc: string }[] = [
  { id: 'piano-lembut', name: 'Piano Lembut Akustik (432Hz)', desc: 'Tuts piano nada pentatonik hangat & menenteramkan' },
  { id: 'piano-hangat', name: 'Piano Ambient Hangat (432Hz)', desc: 'Alunan piano bernuansa hangat, luas, dan menenangkan' },
  { id: 'ambient-minimal', name: 'Musik Ambient Minimalis', desc: 'Resonansi nada ambient halus & sangat hening' },
  { id: 'pad-sinematik', name: 'Pad Sinematik Mengalun (432Hz)', desc: 'Lapisan pad analog hangat & luas membalut batin' },
  { id: 'string-halus', name: 'String Halus Meditatif (528Hz)', desc: 'Gesekan dawai orkestra lembut melarutkan ketegangan' }
];

const DURATIONS = [1, 3, 5, 10, 15, 20, 30, 45, 60];

const VOICES = VOICE_CHARACTERS;

const EMOTIONS = ['Cemas', 'Marah', 'Sedih', 'Kecewa', 'Bersalah', 'Lelah', 'Netral'];

export type AudioPurposeTag = 'semua' | 'latihan-lega' | 'bekerja-belajar' | 'istirahat-meditasi' | 'menjelang-tidur' | 'menenangkan-pikiran';

export interface AudioLibraryTrack {
  id: string;
  trackNumber: number;
  title: string;
  subtitle: string;
  category: string;
  subcategory: string;
  duration: string;
  desc: string;
  purposes: AudioPurposeTag[];
  purposeLabels: string[];
  tagline?: string;
  sampleScript: string;
  natureTypes: NatureSoundType[];
  ambientMusic: AmbientMusicType;
  narrationVolume: number;
  natureVolume: number;
  musicVolume: number;
  metadata: AudioRelaxationMetadata;
}

const PRESET_LIBRARY: AudioLibraryTrack[] = [
  {
    id: 'track-calm-nature',
    trackNumber: 0,
    title: '🌿 LEGA CALM NATURE (Universal)',
    subtitle: 'Universal Relaxation & Grounding',
    category: 'Universal Relaxation',
    subcategory: 'Kesadaran Diri & Ketenangan Pikiran',
    duration: '15 Menit / Loop Latar',
    desc: 'Audio relaksasi universal LEGA: Paduan air mengalir lembut, kicau burung natural & jauh, semilir angin pepohonan, serta piano ambient 432Hz hangat menenteramkan tanpa suara mengejutkan.',
    purposes: ['semua', 'latihan-lega', 'istirahat-meditasi', 'menenangkan-pikiran', 'bekerja-belajar', 'menjelang-tidur'],
    purposeLabels: ['Latihan LEGA', 'Menenangkan Pikiran', 'Semua Kebutuhan'],
    tagline: 'Temani dirimu berhenti sejenak, hadir saat ini, dan menikmati ketenangan.',
    sampleScript: 'Selamat datang di ruang tenang Anda. Ambil posisi yang nyaman dan biarkan tubuh Anda bersandar dengan rileks. Rasakan aliran udara sejuk masuk saat Anda menarik napas, dan lepaskan seluruh ketegangan saat Anda menghembuskannya perlahan. [Jeda 4 detik] Dengarkan gemericik air yang mengalir lembut... desau angin yang menaungi pepohonan... dan kicau burung di kejauhan. Biarkan alunan piano lembut ini menemani Anda hadir seutuhnya di saat ini. Di sini, Anda aman, tenang, dan utuh.',
    natureTypes: ['aliran-sungai', 'burung-pagi', 'angin-pepohonan'],
    ambientMusic: 'piano-lembut',
    narrationVolume: 85,
    natureVolume: 65,
    musicVolume: 45,
    metadata: buildAudioRelaxationMetadata(
      'LEGA CALM NATURE - Universal Relaxation',
      'aliran-sungai',
      'piano-lembut',
      {
        natureSoundTypes: ['aliran-sungai', 'burung-pagi', 'angin-pepohonan'],
        narrationVolume: 85,
        natureVolume: 65,
        musicVolume: 45,
        fadeInSeconds: 4.0,
        fadeOutSeconds: 5.5
      }
    )
  },
  {
    id: 'track-1-air-sungai',
    trackNumber: 1,
    title: '1. LEGA — Ketenangan Air Sungai',
    subtitle: 'Air Sungai Lembut + Burung Natural + Musik Ambient',
    category: 'LEGA Calm',
    subcategory: 'Ketenangan Aliran Air & Fajar',
    duration: '15 Menit',
    desc: 'Suara air sungai lembut pegunungan dipadukan dengan kicauan burung natural di kejauhan serta musik ambient menyejukkan.',
    purposes: ['semua', 'latihan-lega', 'menenangkan-pikiran', 'istirahat-meditasi'],
    purposeLabels: ['Latihan LEGA', 'Menenangkan Pikiran', 'Istirahat'],
    sampleScript: 'Dengarkan aliran air sungai yang mengalir jernih dan tenang di hadapan Anda. Seperti arus air yang senantiasa bergerak melepaskan bebannya, izinkan setiap helaan napas Anda melepaskan kepenatan hari ini. [Jeda 4 detik] Burung-burung di kejauhan menyapa dengan lembut. Anda hadir sepenuhnya di sini.',
    natureTypes: ['aliran-sungai', 'burung-pagi'],
    ambientMusic: 'piano-lembut',
    narrationVolume: 80,
    natureVolume: 60,
    musicVolume: 40,
    metadata: buildAudioRelaxationMetadata(
      'Ketenangan Air Sungai & Burung Alami',
      'aliran-sungai',
      'piano-lembut',
      { natureSoundTypes: ['aliran-sungai', 'burung-pagi'], narrationVolume: 80, natureVolume: 60, musicVolume: 40 }
    )
  },
  {
    id: 'track-2-hujan',
    trackNumber: 2,
    title: '2. LEGA — Ketenangan Hujan',
    subtitle: 'Suara Hujan Lembut + Musik Piano Tenang',
    category: 'LEGA Calm',
    subcategory: 'Pembersihan Pikiran & Relaksasi Tidur',
    duration: '15 Menit',
    desc: 'Suara hujan lembut membasahi bumi dipadukan dengan alunan tuts piano akustik yang tenang, hangat, dan menidurkan.',
    purposes: ['semua', 'menjelang-tidur', 'istirahat-meditasi', 'menenangkan-pikiran'],
    purposeLabels: ['Menjelang Tidur', 'Istirahat', 'Menenangkan Pikiran'],
    sampleScript: 'Rintik hujan turun dengan lembut di luar jendela... Setiap tetesnya menyejukkan dan membasuh rasa lelah di kepala serta pundak Anda. [Jeda 4 detik] Dengarkan nada piano yang mengalir perlahan, menuntun tubuh Anda beristirahat dalam kenyamanan seutuhnya.',
    natureTypes: ['hujan-lembut'],
    ambientMusic: 'piano-lembut',
    narrationVolume: 80,
    natureVolume: 60,
    musicVolume: 40,
    metadata: buildAudioRelaxationMetadata(
      'Ketenangan Hujan & Piano Menidurkan',
      'hujan-lembut',
      'piano-lembut',
      { natureSoundTypes: ['hujan-lembut'], narrationVolume: 80, natureVolume: 60, musicVolume: 40 }
    )
  },
  {
    id: 'track-3-hutan',
    trackNumber: 3,
    title: '3. LEGA — Ketenangan Hutan',
    subtitle: 'Suasana Hutan + Angin Pepohonan + Burung Jauh',
    category: 'LEGA Presence',
    subcategory: 'Keheningan Kanopi Tropis',
    duration: '15 Menit',
    desc: 'Suasana hutan alami yang rimbun dengan semilir angin di pucuk pepohonan, burung di kejauhan, dan dawai string halus meditatif.',
    purposes: ['semua', 'latihan-lega', 'bekerja-belajar', 'istirahat-meditasi'],
    purposeLabels: ['Latihan LEGA', 'Fokus Bekerja/Belajar', 'Meditasi'],
    sampleScript: 'Masuki keteduhan hutan yang luas dan hijau. Tarik napas dalam... rasakan aroma kesegaran daun-daun basah dan semilir angin yang mengayun ranting pohon. [Jeda 4 detik] Anda aman di bawah naungan alam semesta.',
    natureTypes: ['hutan-alami', 'angin-pepohonan', 'burung-pagi'],
    ambientMusic: 'string-halus',
    narrationVolume: 80,
    natureVolume: 60,
    musicVolume: 40,
    metadata: buildAudioRelaxationMetadata(
      'Ketenangan Hutan & Semilir Angin',
      'hutan-alami',
      'string-halus',
      { natureSoundTypes: ['hutan-alami', 'angin-pepohonan', 'burung-pagi'], narrationVolume: 80, natureVolume: 60, musicVolume: 40 }
    )
  },
  {
    id: 'track-4-ombak',
    trackNumber: 4,
    title: '4. LEGA — Ketenangan Ombak',
    subtitle: 'Suara Ombak Lembut + Angin Pantai + Musik Ambient',
    category: 'LEGA Release',
    subcategory: 'Ritme Napas & Deburan Tenang',
    duration: '15 Menit',
    desc: 'Suara deburan ombak laut yang lembut dan berirama teratur, berpadu dengan hembusan angin pantai dan pad sinematik hangat.',
    purposes: ['semua', 'latihan-lega', 'menenangkan-pikiran', 'istirahat-meditasi'],
    purposeLabels: ['Latihan LEGA', 'Pelepasan Emosi', 'Ketenangan'],
    sampleScript: 'Samakan ritme napas Anda dengan deburan ombak di pantai. Tarik napas saat ombak mendekat ke tepian... hembuskan napas saat ombak kembali perlahan ke laut lepas. [Jeda 4 detik] Lepaskan apa pun yang tak lagi perlu Anda genggam.',
    natureTypes: ['ombak-pantai', 'angin-pepohonan'],
    ambientMusic: 'pad-sinematik',
    narrationVolume: 80,
    natureVolume: 60,
    musicVolume: 40,
    metadata: buildAudioRelaxationMetadata(
      'Ketenangan Ombak & Pad Sinematik',
      'ombak-pantai',
      'pad-sinematik',
      { natureSoundTypes: ['ombak-pantai', 'angin-pepohonan'], narrationVolume: 80, natureVolume: 60, musicVolume: 40 }
    )
  },
  {
    id: 'track-5-angin',
    trackNumber: 5,
    title: '5. LEGA — Semilir Angin',
    subtitle: 'Angin Lembut + Suara Pepohonan + Musik Ambient',
    category: 'LEGA Calm',
    subcategory: 'Kelembutan Angin & Kelegaan Dada',
    duration: '15 Menit',
    desc: 'Hembusan angin lembut yang membelai dedaunan rimbun, ditemani pad sinematik hangat frekuensi 432Hz yang menenangkan batin.',
    purposes: ['semua', 'bekerja-belajar', 'menenangkan-pikiran', 'istirahat-meditasi'],
    purposeLabels: ['Bekerja & Belajar', 'Menenangkan Pikiran', 'Relaksasi'],
    sampleScript: 'Rasakan kelembutan angin yang menyentuh kulit Anda. Angin ini hadir tanpa menuntut, hanya mengalir bebas dan menyejukkan. [Jeda 3 detik] Biarkan pikiran Anda menjadi seringan hembusan angin ini.',
    natureTypes: ['angin-pepohonan'],
    ambientMusic: 'pad-sinematik',
    narrationVolume: 80,
    natureVolume: 60,
    musicVolume: 40,
    metadata: buildAudioRelaxationMetadata(
      'Semilir Angin Pepohonan & Keheningan',
      'angin-pepohonan',
      'pad-sinematik',
      { natureSoundTypes: ['angin-pepohonan'], narrationVolume: 80, natureVolume: 60, musicVolume: 40 }
    )
  },
  {
    id: 'track-6-gemericik',
    trackNumber: 6,
    title: '6. LEGA — Gemericik Air',
    subtitle: 'Gemericik Air + Musik Ambient Sangat Lembut',
    category: 'LEGA Presence',
    subcategory: 'Fokus & Kejernihan Pikiran',
    duration: '15 Menit',
    desc: 'Tetesan dan gemericik air sejuk di atas bebatuan alami, dipadukan alunan nada piano ambient yang sangat lembut dan hening.',
    purposes: ['semua', 'bekerja-belajar', 'latihan-lega', 'menenangkan-pikiran'],
    purposeLabels: ['Belajar & Kerja', 'Latihan LEGA', 'Kejernihan'],
    sampleScript: 'Fokuskan perhatian Anda pada suara gemericik air yang jernih. Seperti tetes demi tetes yang menghidupkan kesegaran, setiap momen saat ini adalah peluang untuk kembali jernih dan tenang.',
    natureTypes: ['gemericik-air'],
    ambientMusic: 'piano-lembut',
    narrationVolume: 80,
    natureVolume: 60,
    musicVolume: 40,
    metadata: buildAudioRelaxationMetadata(
      'Gemericik Air Sejuk & Piano Hening',
      'gemericik-air',
      'piano-lembut',
      { natureSoundTypes: ['gemericik-air'], narrationVolume: 80, natureVolume: 60, musicVolume: 40 }
    )
  },
  {
    id: 'track-7-alam-tenang',
    trackNumber: 7,
    title: '7. LEGA — Suasana Alam Tenang',
    subtitle: 'Suara Alam Lembut + Musik Ambient Minimal',
    category: 'LEGA Reflection',
    subcategory: 'Keheningan Ruang Batin',
    duration: '15 Menit',
    desc: 'Lanskap suara alam terbuka yang sejuk dan luas dengan musik ambient minimalis, memberikan ruang lapang bagi pikiran Anda.',
    purposes: ['semua', 'istirahat-meditasi', 'bekerja-belajar', 'menenangkan-pikiran'],
    purposeLabels: ['Istirahat & Meditasi', 'Bekerja', 'Refleksi Diri'],
    sampleScript: 'Berhentilah sejenak dari segala kesibukan. Di ruang alam yang tenang ini, tidak ada yang perlu Anda buktikan, tidak ada yang perlu dikejar. Cukup ada di sini, menikmati keheningan.',
    natureTypes: ['suasana-alam-tenang'],
    ambientMusic: 'ambient-minimal',
    narrationVolume: 80,
    natureVolume: 60,
    musicVolume: 40,
    metadata: buildAudioRelaxationMetadata(
      'Suasana Alam Tenang & Ambient Minimal',
      'suasana-alam-tenang',
      'ambient-minimal',
      { natureSoundTypes: ['suasana-alam-tenang'], narrationVolume: 80, natureVolume: 60, musicVolume: 40 }
    )
  },
  {
    id: 'track-8-piano',
    trackNumber: 8,
    title: '8. LEGA — Piano Menenangkan',
    subtitle: 'Piano Ambient Lembut dengan Suasana Hangat',
    category: 'LEGA Calm',
    subcategory: 'Harmoni Hangat 432Hz',
    duration: '15 Menit',
    desc: 'Komposisi piano ambient bernuansa hangat dan lembut, dirancang untuk merelakskan sistem saraf dan mengendurkan ketegangan mental.',
    purposes: ['semua', 'menenangkan-pikiran', 'istirahat-meditasi', 'menjelang-tidur', 'bekerja-belajar'],
    purposeLabels: ['Menenangkan Pikiran', 'Istirahat', 'Menjelang Tidur'],
    sampleScript: 'Biarkan alunan melodi piano yang hangat ini menyelimuti hati Anda. Rasakan otot-otot wajah, bahu, dan punggung Anda yang perlahan melemas dan rileks seutuhnya.',
    natureTypes: ['angin-pepohonan'],
    ambientMusic: 'piano-hangat',
    narrationVolume: 80,
    natureVolume: 50,
    musicVolume: 50,
    metadata: buildAudioRelaxationMetadata(
      'Piano Menenangkan & Resonansi Hangat',
      'angin-pepohonan',
      'piano-hangat',
      { natureSoundTypes: ['angin-pepohonan'], narrationVolume: 80, natureVolume: 50, musicVolume: 50 }
    )
  },
  {
    id: 'track-9-malam',
    trackNumber: 9,
    title: '9. LEGA — Suasana Malam Tenang',
    subtitle: 'Suara Malam Lembut + Jangkrik Halus + Musik Ambient Pelan',
    category: 'LEGA Calm',
    subcategory: 'Istirahat Malam & Tidur Nyenyak',
    duration: '15 Menit',
    desc: 'Suasana malam yang sunyi dan damai, semilir angin malam dengan desau jangkrik halus dan alunan piano pelan yang menghantarkan tidur lelap.',
    purposes: ['semua', 'menjelang-tidur', 'istirahat-meditasi', 'menenangkan-pikiran'],
    purposeLabels: ['Menjelang Tidur', 'Istirahat Malam', 'Ketenangan'],
    sampleScript: 'Malam telah tiba untuk memeluk istirahat Anda. Tarik napas lembut... lepaskan semua beban hari ini. Biarkan ketenangan malam dan jangkrik halus mengantar Anda menuju tidur yang lelap dan damai.',
    natureTypes: ['suasana-malam'],
    ambientMusic: 'piano-hangat',
    narrationVolume: 80,
    natureVolume: 60,
    musicVolume: 40,
    metadata: buildAudioRelaxationMetadata(
      'Suasana Malam Tenang & Jangkrik Halus',
      'suasana-malam',
      'piano-hangat',
      { natureSoundTypes: ['suasana-malam'], narrationVolume: 80, natureVolume: 60, musicVolume: 40 }
    )
  },
  {
    id: 'track-10-fajar',
    trackNumber: 10,
    title: '10. LEGA — Fajar Menenteramkan',
    subtitle: 'Suara Fajar + Burung Pagi + Musik Ambient Hangat',
    category: 'LEGA Growth',
    subcategory: 'Kesegaran Fajar & Semangat Baru',
    duration: '15 Menit',
    desc: 'Kesejukan udara fajar yang menyejukkan batin, kicauan burung pagi menyambut hari, dipadukan alunan musik piano ambient hangat yang membangkitkan rasa syukur.',
    purposes: ['semua', 'latihan-lega', 'bekerja-belajar', 'menenangkan-pikiran', 'istirahat-meditasi'],
    purposeLabels: ['Latihan LEGA', 'Memulai Hari', 'Bekerja & Belajar'],
    sampleScript: 'Selamat menyambut fajar yang damai. Udara fajar ini murni dan penuh harapan baru. Tarik napas dalam... serap energi positif dan biarkan hari ini Anda jalani dengan kebaikan serta ketenangan.',
    natureTypes: ['fajar-tenang', 'burung-pagi'],
    ambientMusic: 'piano-hangat',
    narrationVolume: 80,
    natureVolume: 60,
    musicVolume: 40,
    metadata: buildAudioRelaxationMetadata(
      'Fajar Menenteramkan & Kicau Burung Pagi',
      'fajar-tenang',
      'piano-hangat',
      { natureSoundTypes: ['fajar-tenang', 'burung-pagi'], narrationVolume: 80, natureVolume: 60, musicVolume: 40 }
    )
  }
];

// Helper: Renders ASCII block meter for volume (e.g. ████████░░)
export const renderAsciiVolumeMeter = (pct: number, bars = 10): string => {
  const filled = Math.max(0, Math.min(bars, Math.round((pct / 100) * bars)));
  return '█'.repeat(filled) + '░'.repeat(bars - filled);
};

export const AudioPlayerView: React.FC<AudioPlayerViewProps> = ({
  onSelectModule,
  onOpenCrisis,
  userName = 'Sahabat LEGA'
}) => {
  // Category & Generation Configuration
  const [selectedCategory, setSelectedCategory] = useState<AudioCategory>(CATEGORIES[0]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(CATEGORIES[0].subcategories[0]); // Hutan Pagi / Relaksasi
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [emotionState, setEmotionState] = useState<string>('Netral');
  const [emotionIntensity, setEmotionIntensity] = useState<'Rendah' | 'Sedang' | 'Tinggi' | 'Sangat Tinggi'>('Sedang');
  const [userExperienceLevel, setUserExperienceLevel] = useState<'pemula' | 'menengah' | 'lanjutan'>('pemula');
  const [audioMode, setAudioMode] = useState<'guided' | 'gentle' | 'reflective' | 'sleep' | 'emergency_calming'>('gentle');
  const [spiritualMode, setSpiritualMode] = useState<boolean>(false);
  const [customGoal, setCustomGoal] = useState<string>('Kesegaran dan ketenangan pagi bersama suara alam');
  const [voiceName, setVoiceName] = useState<string>('Kore');
  const [speechSpeed, setSpeechSpeed] = useState<'perlahan' | 'normal' | 'santai'>('perlahan');

  // Soundscape & Acoustic Mixing Controls
  const [selectedNatureSounds, setSelectedNatureSounds] = useState<NatureSoundType[]>([
    'aliran-sungai',
    'burung-pagi',
    'angin-pepohonan'
  ]);
  const [natureSound, setNatureSound] = useState<NatureSoundType>('burung-pagi');
  const [ambientMusic, setAmbientMusic] = useState<AmbientMusicType>('piano-lembut');
  const [narrationVolumePct, setNarrationVolumePct] = useState<number>(80); // 80% (████████░░)
  const [natureVolumePct, setNatureVolumePct] = useState<number>(60); // 60% (██████░░░░)
  const [musicVolumePct, setMusicVolumePct] = useState<number>(40); // 40% (████░░░░░░)
  const [fadeInSec, setFadeInSec] = useState<number>(3.5);
  const [fadeOutSec, setFadeOutSec] = useState<number>(5.0);

  // Active Session Metadata
  const [activeMetadata, setActiveMetadata] = useState<AudioRelaxationMetadata>(() =>
    buildAudioRelaxationMetadata('Hutan Pagi & Fajar Menenangkan', 'burung-pagi', 'piano-lembut', {
      natureSoundTypes: ['aliran-sungai', 'burung-pagi', 'angin-pepohonan'],
      narrationVolume: 80,
      natureVolume: 60,
      musicVolume: 40
    })
  );

  // Audio Player State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedScriptData, setGeneratedScriptData] = useState<any | null>(() => ({
    title: PRESET_LIBRARY[0].title,
    category: PRESET_LIBRARY[0].category,
    subcategory: PRESET_LIBRARY[0].subcategory,
    durationMinutes: 15,
    description: PRESET_LIBRARY[0].desc,
    script: PRESET_LIBRARY[0].sampleScript,
    ttsPrompt: PRESET_LIBRARY[0].sampleScript,
    reflectiveQuestions: [
      'Bagaimana rasa napas dan ketenangan batin Anda saat membayangkan embun fajar di hutan ini?',
      'Apakah ada niat positif atau rasa syukur yang ingin Anda bawa sepanjang hari ini?'
    ]
  }));

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [masterVolume, setMasterVolume] = useState<number>(0.85);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(900); // 15 mins
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [previewingSound, setPreviewingSound] = useState<string | null>(null);
  const [showMetadataDrawer, setShowMetadataDrawer] = useState<boolean>(true);

  // Audio Engine & Playback Options
  const [playbackSource, setPlaybackSource] = useState<'gemini_tts' | 'web_speech' | 'ambient_music'>('web_speech');

  // Dedicated Audio Refs for Voice and Background Soundscape
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const soundscapeAudioRef = useRef<HTMLAudioElement | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const progressTimerRef = useRef<number | null>(null);

  // Helper: Toggle individual nature sound layers
  const toggleNatureSound = (soundId: NatureSoundType) => {
    setSelectedNatureSounds((prev) => {
      let next: NatureSoundType[];
      if (prev.includes(soundId)) {
        if (prev.length === 1) return prev; // keep at least 1 sound active
        next = prev.filter((s) => s !== soundId);
      } else {
        next = [...prev, soundId];
      }
      setNatureSound(next[0]);
      prepareSoundscapeAudio(next, ambientMusic, natureVolumePct, musicVolumePct);
      return next;
    });
  };

  // Helper: Prepare or update background soundscape audio (handles multi-nature layers)
  const prepareSoundscapeAudio = async (
    nats: NatureSoundType[] | NatureSoundType = selectedNatureSounds,
    amb: AmbientMusicType = ambientMusic,
    natVol = natureVolumePct,
    musVol = musicVolumePct
  ): Promise<string> => {
    try {
      const activeNatureTypes = Array.isArray(nats) ? nats : [nats];
      const primaryNature = activeNatureTypes[0] || 'burung-pagi';

      const url = await generateRelaxationSoundscapeWav(24, {
        natureType: primaryNature,
        natureTypes: activeNatureTypes,
        ambientType: amb,
        natureVolume: natVol / 100,
        musicVolume: musVol / 100,
        fadeInSeconds: fadeInSec,
        fadeOutSeconds: fadeOutSec,
        includeSingingBowl: true
      });

      if (soundscapeAudioRef.current && url) {
        if (soundscapeAudioRef.current.src !== url) {
          soundscapeAudioRef.current.src = url;
          soundscapeAudioRef.current.loop = true;
        }
        const effectiveVol = isMuted ? 0 : masterVolume * Math.min(1, (natVol + musVol) / 100);
        soundscapeAudioRef.current.volume = effectiveVol;
      }
      return url;
    } catch (err) {
      console.warn('Prepare soundscape error:', err);
      return '';
    }
  };

  // Sync category change with defaults
  const handleCategoryChange = (cat: AudioCategory) => {
    setSelectedCategory(cat);
    setSelectedSubcategory(cat.subcategories[0]);
    setNatureSound(cat.defaultNature);
    setSelectedNatureSounds([cat.defaultNature]);
    setAmbientMusic(cat.defaultAmbient);
    updateMetadataForSelection(cat.name, cat.subcategories[0], cat.defaultNature, cat.defaultAmbient);
    prepareSoundscapeAudio([cat.defaultNature], cat.defaultAmbient);
  };

  const updateMetadataForSelection = (
    catName: string,
    subName: string,
    nat: NatureSoundType,
    amb: AmbientMusicType
  ) => {
    const meta = buildAudioRelaxationMetadata(
      `${subName} (${catName})`,
      nat,
      amb,
      {
        narrationVolume: narrationVolumePct,
        natureVolume: natureVolumePct,
        musicVolume: musicVolumePct,
        fadeInSeconds: fadeInSec,
        fadeOutSeconds: fadeOutSec
      }
    );
    setActiveMetadata(meta);
  };

  // Preview Nature or Ambient Sound briefly (5 seconds)
  const handlePreviewSound = async (type: 'nature' | 'ambient', soundId: string) => {
    try {
      setPreviewingSound(soundId);
      const testNature = type === 'nature' ? (soundId as NatureSoundType) : natureSound;
      const testAmbient = type === 'ambient' ? (soundId as AmbientMusicType) : ambientMusic;

      const wavUrl = await generateRelaxationSoundscapeWav(5, {
        natureType: testNature,
        ambientType: testAmbient,
        natureVolume: natureVolumePct / 100,
        musicVolume: musicVolumePct / 100,
        fadeInSeconds: 0.5,
        fadeOutSeconds: 1.0,
        includeSingingBowl: false
      });

      if (previewAudioRef.current && wavUrl) {
        previewAudioRef.current.src = wavUrl;
        previewAudioRef.current.volume = isMuted ? 0 : masterVolume;
        previewAudioRef.current.play().catch((e) => console.warn('Preview play warning:', e));
      }
    } catch (err) {
      console.warn('Preview sound error:', err);
    } finally {
      setTimeout(() => setPreviewingSound(null), 5200);
    }
  };

  // Test Tibetan Bell Chime
  const handleTestAudioChime = () => {
    playCalmMeditationChime('bowl', 0.25);
  };

  // Start Playback by current Mode
  const startPlaybackForMode = async (
    mode: 'gemini_tts' | 'web_speech' | 'ambient_music',
    scriptText?: string,
    geminiAudioUrl?: string | null
  ) => {
    const textToSpeak = scriptText || generatedScriptData?.cleanScriptForTTS || generatedScriptData?.script || PRESET_LIBRARY[0].sampleScript;
    const targetUrl = geminiAudioUrl !== undefined ? geminiAudioUrl : audioUrl;

    // Ensure soundscape is ready and playing
    await prepareSoundscapeAudio();
    if (soundscapeAudioRef.current) {
      const effectiveSoundscapeVol = isMuted ? 0 : masterVolume * Math.min(1, (natureVolumePct + musicVolumePct) / 100);
      soundscapeAudioRef.current.volume = effectiveSoundscapeVol;
      soundscapeAudioRef.current.play().catch((e) => console.log('Soundscape autoplay handled:', e));
    }

    if (mode === 'ambient_music') {
      // Pure Soundscape - No speech
      stopIndonesianNarration();
      if (voiceAudioRef.current) voiceAudioRef.current.pause();
      setIsPlaying(true);
    } else if (mode === 'web_speech') {
      // Indonesian Speech + Soundscape
      if (voiceAudioRef.current) voiceAudioRef.current.pause();
      stopIndonesianNarration();

      speakIndonesianNarration(textToSpeak, {
        rate: speechSpeed === 'perlahan' ? 0.78 : speechSpeed === 'santai' ? 0.85 : 0.92,
        pitch: 0.95,
        volume: isMuted ? 0 : (narrationVolumePct / 100) * masterVolume,
        onEnd: () => {
          // Keep gentle soundscape playing in background or let user pause
        },
        onError: () => {
          // Web speech error fallback
        }
      });
      setIsPlaying(true);
    } else {
      // Gemini TTS Mode
      stopIndonesianNarration();
      if (targetUrl && voiceAudioRef.current) {
        voiceAudioRef.current.src = targetUrl;
        voiceAudioRef.current.volume = isMuted ? 0 : masterVolume * (narrationVolumePct / 100);
        voiceAudioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Fallback to Web Speech + Soundscape
            speakIndonesianNarration(textToSpeak, {
              rate: 0.80,
              pitch: 0.95,
              volume: isMuted ? 0 : (narrationVolumePct / 100) * masterVolume
            });
            setIsPlaying(true);
          });
      } else {
        // Fallback to Web Speech + Soundscape
        speakIndonesianNarration(textToSpeak, {
          rate: 0.80,
          pitch: 0.95,
          volume: isMuted ? 0 : (narrationVolumePct / 100) * masterVolume
        });
        setIsPlaying(true);
      }
    }
  };

  // Switch Audio Engine Mode
  const handleSelectPlaybackSource = (newMode: 'gemini_tts' | 'web_speech' | 'ambient_music') => {
    setPlaybackSource(newMode);
    if (isPlaying) {
      startPlaybackForMode(newMode);
    }
  };

  // Generate Personalized AI Audio & Relaxation Experience
  const handleGenerateAudio = async () => {
    setIsGenerating(true);
    stopIndonesianNarration();
    if (voiceAudioRef.current) voiceAudioRef.current.pause();
    if (soundscapeAudioRef.current) soundscapeAudioRef.current.pause();
    setIsPlaying(false);

    // Build session metadata
    const meta = buildAudioRelaxationMetadata(
      `${selectedSubcategory} - ${customGoal || selectedCategory.name}`,
      natureSound,
      ambientMusic,
      {
        narrationVolume: narrationVolumePct,
        natureVolume: natureVolumePct,
        musicVolume: musicVolumePct,
        fadeInSeconds: fadeInSec,
        fadeOutSeconds: fadeOutSec
      }
    );
    setActiveMetadata(meta);

    try {
      // 1. Generate Personalized Audio Script via Gemini 3.7 Flash
      const scriptData = await generateAudioScript({
        userName,
        primaryEmotion: emotionState,
        emotionIntensity,
        userGoal: customGoal,
        category: selectedCategory.name,
        subcategory: selectedSubcategory,
        durationMinutes,
        userExperienceLevel,
        preferredVoice: voiceName,
        voiceName,
        speechSpeed,
        spiritualMode,
        audioMode
      });

      setGeneratedScriptData(scriptData);
      setTotalDuration(durationMinutes * 60);

      const ttsText = scriptData?.cleanScriptForTTS || scriptData?.script || 'Mari kita hening sejenak...';

      let newVoiceUrl: string | null = null;
      if (playbackSource === 'gemini_tts') {
        try {
          const rawAudio = await generateGeminiTts(ttsText, voiceName as any);
          if (rawAudio) {
            if (rawAudio.startsWith('data:audio/') || rawAudio.startsWith('blob:') || rawAudio.startsWith('http')) {
              newVoiceUrl = rawAudio;
            } else {
              newVoiceUrl = pcmToWavBlobUrl(rawAudio, 24000);
            }
          }
        } catch (e) {
          console.warn('Gemini TTS warning:', e);
        }
      }

      setAudioUrl(newVoiceUrl);
      await startPlaybackForMode(playbackSource, ttsText, newVoiceUrl);
    } catch (err) {
      console.error('Error generating audio:', err);
      // Fallback: Start soundscape and web speech
      await startPlaybackForMode('web_speech');
    } finally {
      setIsGenerating(false);
    }
  };

  // Play Preset Track
  const handlePlayPreset = async (preset: typeof PRESET_LIBRARY[0]) => {
    setIsGenerating(true);
    stopIndonesianNarration();
    if (voiceAudioRef.current) voiceAudioRef.current.pause();
    if (soundscapeAudioRef.current) soundscapeAudioRef.current.pause();
    setIsPlaying(false);

    setActiveMetadata(preset.metadata);
    const presetNats = (preset as any).natureTypes || (preset.metadata.natureSoundTypes && preset.metadata.natureSoundTypes.length > 0 ? preset.metadata.natureSoundTypes : [preset.metadata.natureSoundType]);
    setSelectedNatureSounds(presetNats);
    setNatureSound(presetNats[0] || preset.metadata.natureSoundType);
    setAmbientMusic(preset.metadata.ambientMusicType);
    setNarrationVolumePct(preset.metadata.narrationVolume);
    setNatureVolumePct(preset.metadata.natureVolume);
    setMusicVolumePct(preset.metadata.musicVolume);

    const durMins = preset.id === 'pres-hutan-pagi' || preset.duration.includes('15') ? 15 : (preset.duration.includes('10') ? 10 : (preset.duration.includes('3') ? 3 : 5));
    setDurationMinutes(durMins);

    try {
      setGeneratedScriptData({
        title: preset.title,
        category: preset.category,
        subcategory: preset.subcategory,
        durationMinutes: durMins,
        description: preset.desc,
        script: preset.sampleScript,
        ttsPrompt: preset.sampleScript,
        reflectiveQuestions: [
          'Bagaimana sensasi napas dan detak jantung Anda setelah menyimak panduan ini?',
          'Apakah ada rasa lega atau ketegangan yang mulai mengendur?'
        ]
      });
      setTotalDuration(durMins * 60);

      // Prepare soundscape with the preset's multi-layers
      await prepareSoundscapeAudio(
        presetNats,
        preset.metadata.ambientMusicType,
        preset.metadata.natureVolume,
        preset.metadata.musicVolume
      );

      let url: string | null = null;
      if (playbackSource === 'gemini_tts') {
        try {
          const rawAudio = await generateGeminiTts(preset.sampleScript, 'Kore');
          if (rawAudio) {
            if (rawAudio.startsWith('data:audio/') || rawAudio.startsWith('blob:') || rawAudio.startsWith('http')) {
              url = rawAudio;
            } else {
              url = pcmToWavBlobUrl(rawAudio, 24000);
            }
          }
        } catch (e) {
          console.warn('Preset Gemini TTS error:', e);
        }
      }

      setAudioUrl(url);
      await startPlaybackForMode(playbackSource, preset.sampleScript, url);
    } catch (err) {
      console.error('Preset play error:', err);
      await startPlaybackForMode('web_speech', preset.sampleScript);
    } finally {
      setIsGenerating(false);
    }
  };

  // Quick Action: Launch 🌿 LEGA CALM NATURE Universal Session
  const handleStartLegaCalmNatureSession = async (pureAmbientOnly = false) => {
    const calmNaturePreset = PRESET_LIBRARY[0];
    if (pureAmbientOnly) {
      setIsGenerating(true);
      stopIndonesianNarration();
      if (voiceAudioRef.current) voiceAudioRef.current.pause();
      if (soundscapeAudioRef.current) soundscapeAudioRef.current.pause();
      setIsPlaying(false);

      setActiveMetadata(calmNaturePreset.metadata);
      setSelectedNatureSounds(calmNaturePreset.natureTypes);
      setNatureSound('aliran-sungai');
      setAmbientMusic('piano-lembut');
      setNarrationVolumePct(0);
      setNatureVolumePct(calmNaturePreset.natureVolume);
      setMusicVolumePct(calmNaturePreset.musicVolume);

      setGeneratedScriptData({
        title: 'LEGA CALM NATURE (Pure Soundscape)',
        script: 'Audio relaksasi alami murni tanpa narasi suara untuk menemani meditasi, pernapasan, kesadaran diri, dan refleksi batin.',
        cleanScriptForTTS: '',
        userGoal: 'Universal Background Relaxation',
        stage: 10,
        voiceWarmthDescription: 'Suasana alami murni yang tenang dan menenteramkan.',
        natureSoundRecommendation: 'Paduan Aliran Air, Burung Jauh, Angin Pepohonan, & Piano 432Hz',
        ambientMusicRecommendation: 'Piano Lembut 432Hz',
        ttsPrompt: '',
        reflectiveQuestions: [
          'Bagaimana ketenangan batin Anda saat mendengarkan aliran alam ini?',
          'Rasakan setiap tarikan dan hembusan napas yang menyatu dengan desau angin dan gemericik air.'
        ]
      });

      await prepareSoundscapeAudio(
        calmNaturePreset.natureTypes,
        'piano-lembut',
        calmNaturePreset.natureVolume,
        calmNaturePreset.musicVolume
      );

      setPlaybackSource('ambient_music');
      await startPlaybackForMode('ambient_music');
      setIsGenerating(false);
    } else {
      await handlePlayPreset(calmNaturePreset);
    }
  };

  // Quick Action: Launch 🌊 Hutan Pagi Session
  const handleStartHutanPagiSession = async () => {
    const hutanPagiPreset = PRESET_LIBRARY.find((p) => p.id === 'pres-hutan-pagi') || PRESET_LIBRARY[1];
    await handlePlayPreset(hutanPagiPreset);
  };

  // Play/Pause toggle
  const togglePlayPause = async () => {
    if (isPlaying) {
      if (soundscapeAudioRef.current) soundscapeAudioRef.current.pause();
      if (voiceAudioRef.current) voiceAudioRef.current.pause();
      stopIndonesianNarration();
      setIsPlaying(false);
    } else {
      await startPlaybackForMode(playbackSource);
    }
  };

  const handleRestart = async () => {
    setCurrentTime(0);
    if (soundscapeAudioRef.current) soundscapeAudioRef.current.currentTime = 0;
    if (voiceAudioRef.current) voiceAudioRef.current.currentTime = 0;
    await startPlaybackForMode(playbackSource);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    if (soundscapeAudioRef.current && isFinite(soundscapeAudioRef.current.duration) && soundscapeAudioRef.current.duration > 0) {
      soundscapeAudioRef.current.currentTime = time % soundscapeAudioRef.current.duration;
    }
    if (voiceAudioRef.current && isFinite(voiceAudioRef.current.duration) && voiceAudioRef.current.duration > 0) {
      voiceAudioRef.current.currentTime = Math.min(time, voiceAudioRef.current.duration);
    }
  };

  const handleMasterVolumeChange = (v: number) => {
    setMasterVolume(v);
    setIsMuted(v === 0);
    if (soundscapeAudioRef.current) {
      soundscapeAudioRef.current.volume = v * Math.min(1, (natureVolumePct + musicVolumePct) / 100);
    }
    if (voiceAudioRef.current) {
      voiceAudioRef.current.volume = v * (narrationVolumePct / 100);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (soundscapeAudioRef.current) {
        soundscapeAudioRef.current.volume = masterVolume * Math.min(1, (natureVolumePct + musicVolumePct) / 100);
      }
      if (voiceAudioRef.current) {
        voiceAudioRef.current.volume = masterVolume * (narrationVolumePct / 100);
      }
    } else {
      setIsMuted(true);
      if (soundscapeAudioRef.current) soundscapeAudioRef.current.volume = 0;
      if (voiceAudioRef.current) voiceAudioRef.current.volume = 0;
    }
  };

  // Progress timer for UI playback progression
  useEffect(() => {
    if (isPlaying) {
      progressTimerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= (totalDuration || 300)) {
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPlaying, totalDuration]);

  // Pre-load soundscape on mount
  useEffect(() => {
    prepareSoundscapeAudio();
    return () => {
      stopIndonesianNarration();
    };
  }, []);

  // Update soundscape when nature sound or ambient music or their volumes change
  useEffect(() => {
    prepareSoundscapeAudio(natureSound, ambientMusic, natureVolumePct, musicVolumePct);
  }, [natureSound, ambientMusic, natureVolumePct, musicVolumePct]);

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCopyScript = () => {
    if (!generatedScriptData?.script) return;
    navigator.clipboard.writeText(generatedScriptData.script);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 text-stone-100">
      {/* Dedicated audio streams */}
      <audio ref={soundscapeAudioRef} loop preload="auto" />
      <audio ref={voiceAudioRef} preload="auto" />
      <audio ref={previewAudioRef} preload="auto" />

      {/* Header Banner */}
      <div className="bg-stone-900/90 border border-stone-800 p-5 md:p-6 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-950/80 border border-sky-800 text-sky-400 rounded-2xl shadow-inner">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold text-stone-100">LEGA Audio Relaksasi Premium</h2>
                <span className="text-xs bg-sky-900/80 text-sky-300 px-2.5 py-0.5 rounded-full border border-sky-700 font-mono">
                  v3.0 Premium Studio
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Pengalaman relaksasi berstandar tinggi: Narasi Bahasa Indonesia hangat & lambat, 7 backsound suara alam, musik ambient piano/pad/string, dan tata metadata suara profesional.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestAudioChime}
              className="px-3 py-2 bg-stone-950 hover:bg-stone-800 border border-stone-800 rounded-xl text-xs font-semibold text-sky-300 transition flex items-center gap-2"
              title="Bunyikan Tibetan Singing Bowl 528Hz"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Tibetan Bowl (528Hz)</span>
            </button>
            <button
              onClick={() => setShowMetadataDrawer(!showMetadataDrawer)}
              className={`px-3 py-2 border rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                showMetadataDrawer
                  ? 'bg-sky-950/80 border-sky-600 text-sky-200'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Metadata Audio</span>
            </button>
          </div>
        </div>

        {/* Rekomendasi Penggunaan Headset / Earphone */}
        <div className="p-4 bg-gradient-to-r from-sky-950/90 via-indigo-950/80 to-stone-950 border border-sky-500/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-3.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-300 flex items-center justify-center shrink-0 text-xl shadow-inner">
            🎧
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <p className="text-xs md:text-sm font-bold text-white flex items-center gap-2">
              <span>Gunakan headset atau earphone untuk pengalaman LEGA yang lebih optimal.</span>
            </p>
            <p className="text-[11px] md:text-xs text-stone-300 leading-relaxed">
              Gunakan headset atau earphone untuk pengalaman audio yang lebih optimal dan imersif. Headset membantu pengguna mendengar dengan lebih jelas suara panduan, musik ambient, aliran air, suara burung, angin, serta detail suara alam lainnya.
            </p>
          </div>
        </div>

        {/* Acoustic Balance & Non-Medical Disclaimer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="p-3 bg-stone-950 border border-stone-800/80 rounded-2xl text-[11px] text-stone-300 space-y-1">
            <div className="flex items-center gap-2 text-sky-400 font-semibold">
              <Disc className="w-3.5 h-3.5" />
              <span>Prinsip Akustik LEGA (Latar Tidak Mengalahkan Narasi):</span>
            </div>
            <p className="text-stone-400 leading-relaxed">
              Musik ambient dan suara alam dirancang khusus berada pada rentang volume seimbang dengan auto-ducking halus, memastikan vokal narasi Bahasa Indonesia tetap terdengar hangat, intim, dan jernih.
            </p>
          </div>

          <div className="p-3 bg-stone-950 border border-stone-800/80 rounded-2xl text-[11px] text-stone-300 space-y-1">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Disclaimer Non-Medis:</span>
            </div>
            <p className="text-stone-400 leading-relaxed">
              Audio LEGA adalah media relaksasi dan kesadaran diri mandiri, bukan pengganti diagnosis psikoterapi klinis. Bila Anda dalam kondisi krisis akut, silakan hubungi saluran bantuan.
            </p>
          </div>
        </div>
      </div>

      {/* 🌿 LEGA CALM NATURE - Universal Relaxation Audio Showcase */}
      <div className="bg-gradient-to-r from-emerald-950/90 via-stone-900 to-sky-950/90 border-2 border-emerald-500/50 p-5 md:p-6 rounded-3xl space-y-4 shadow-2xl relative overflow-hidden">
        {/* Decorative ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 space-y-3">
          {/* Header Row & Title */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-2xl animate-pulse">🌿</span>
                <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-wide flex items-center gap-2">
                  <span>LEGA CALM NATURE</span>
                </h3>
                <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-emerald-900/90 text-emerald-300 border border-emerald-500/60 font-mono">
                  Audio Relaksasi Universal
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-sky-950/80 text-sky-300 border border-sky-700/60">
                  4 Lapisan Suara Alami Multi-Layer
                </span>
              </div>

              {/* Tagline Audio */}
              <p className="text-sm md:text-base font-serif italic text-emerald-200/95 leading-relaxed pt-0.5">
                "{LEGA_CALM_NATURE_CONFIG.tagline}"
              </p>

              <p className="text-xs text-stone-300 leading-relaxed">
                Satu audio relaksasi universal yang dirancang sebagai pendamping setia latihan kesadaran diri, meditasi, latihan pernapasan, refleksi batin, dan relaksasi mendalam di berbagai situasi.
              </p>
            </div>

            {/* Quick Play CTA Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
              <button
                onClick={() => handleStartLegaCalmNatureSession(false)}
                disabled={isGenerating}
                className="px-5 py-3.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-stone-950 font-extrabold text-xs sm:text-sm rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/80"
              >
                <Play className="w-4 h-4 fill-stone-950" />
                <span>▶ Putar LEGA CALM NATURE</span>
              </button>

              <button
                onClick={() => handleStartLegaCalmNatureSession(true)}
                disabled={isGenerating}
                className="px-4 py-2.5 bg-stone-950/90 hover:bg-stone-800 border border-emerald-600/50 hover:border-emerald-500 text-emerald-300 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Audio Latar Murni (Background)</span>
              </button>
            </div>
          </div>

          {/* 4 Suasana Alami Multi-Layer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2">
            {LEGA_CALM_NATURE_CONFIG.atmospheres.map((atm, i) => (
              <div
                key={i}
                className="p-3 bg-stone-950/70 border border-emerald-900/50 hover:border-emerald-700/60 rounded-2xl space-y-1 transition backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <span className="text-base">{atm.icon}</span>
                  <span>{atm.label}</span>
                </div>
                <p className="text-[11px] text-stone-400 leading-snug">
                  {atm.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Karakteristik & Kegunaan Universal Pills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {/* Karakteristik Suara */}
            <div className="p-3 bg-stone-950/60 rounded-2xl border border-stone-800/80 space-y-1.5 text-xs">
              <div className="text-[11px] font-bold text-stone-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Karakteristik Audio:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {LEGA_CALM_NATURE_CONFIG.characteristics.map((c, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-stone-900 text-stone-300 rounded-lg text-[10px] border border-stone-800"
                  >
                    • {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Kegunaan Universal */}
            <div className="p-3 bg-stone-950/60 rounded-2xl border border-stone-800/80 space-y-1.5 text-xs">
              <div className="text-[11px] font-bold text-stone-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pendamping Berbagai Latihan LEGA:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {LEGA_CALM_NATURE_CONFIG.purposes.map((p, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-emerald-950/60 text-emerald-300 rounded-lg text-[10px] border border-emerald-800/60 font-medium"
                  >
                    ✓ {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Rekomendasi Headset Banner */}
          <div className="p-3 bg-sky-950/60 border border-sky-600/40 rounded-2xl flex items-center gap-3 text-xs text-sky-200">
            <span className="text-lg shrink-0">🎧</span>
            <div className="leading-relaxed">
              <span className="font-semibold text-white">Rekomendasi Audio: </span>
              {LEGA_CALM_NATURE_CONFIG.headsetAdvice}
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Audio Studio Configuration (7 cols) */}
        <div className="lg:col-span-7 bg-stone-900/90 p-5 md:p-6 rounded-3xl border border-stone-800 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <h3 className="font-bold text-sm text-stone-100">Personalisasi Sesi Relaksasi Premium</h3>
            </div>
            <span className="text-[10px] text-sky-400 font-medium bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-800">
              Master Prompt 25 Active
            </span>
          </div>

          {/* 1. Category Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" /> 1. Kategori Sesi LEGA:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const IconComp = cat.icon;
                const isSelected = selectedCategory.id === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat)}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                      isSelected
                        ? `${cat.bgColor} text-stone-100 font-bold ring-1 ring-sky-500 shadow-md`
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <IconComp className={`w-4 h-4 ${cat.color} shrink-0`} />
                    <span className="text-xs truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Subcategory Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-300">
              Subkategori Fokus ({selectedCategory.name}):
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
              {selectedCategory.subcategories.map((sub, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedSubcategory(sub);
                    updateMetadataForSelection(selectedCategory.name, sub, natureSound, ambientMusic);
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                    selectedSubcategory === sub
                      ? 'bg-sky-600 border-sky-500 text-white shadow-md'
                      : 'bg-stone-950 border-stone-800 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* 3. 7 Pilihan Backsound Suara Alam Sesuai Tema (Multi-Layer Supported) */}
          <div className="space-y-2.5 pt-2 border-t border-stone-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                <Trees className="w-3.5 h-3.5 text-emerald-400" /> 2. Rekomendasi Backsound Suara Alam:
              </label>
              <span className="text-[10px] text-emerald-400 font-mono">
                {selectedNatureSounds.length} Layer Aktif
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {NATURE_OPTIONS.map((opt) => {
                const IconComp = opt.icon;
                const isSelected = selectedNatureSounds.includes(opt.id);
                const isPreviewing = previewingSound === opt.id;

                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      toggleNatureSound(opt.id);
                      updateMetadataForSelection(selectedCategory.name, selectedSubcategory, opt.id, ambientMusic);
                    }}
                    className={`p-2.5 rounded-xl border cursor-pointer transition flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-emerald-950/70 border-emerald-600 text-stone-100 ring-1 ring-emerald-500'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${isSelected ? 'bg-emerald-800 text-white' : 'bg-stone-900 text-emerald-400'}`}>
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-stone-200 truncate flex items-center gap-1.5">
                          <span>{opt.name}</span>
                          {isSelected && <Check className="w-3 h-3 text-emerald-400 shrink-0" />}
                        </div>
                        <div className="text-[10px] text-stone-400 line-clamp-1">{opt.desc}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewSound('nature', opt.id);
                      }}
                      className={`px-2 py-1 rounded-lg text-[10px] shrink-0 font-medium transition ${
                        isPreviewing ? 'bg-emerald-500 text-stone-950 font-bold' : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
                      }`}
                      title="Dengar preview 5 detik"
                    >
                      {isPreviewing ? 'Memutar...' : 'Dengar'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Pilihan Musik Ambient Yang Sangat Lembut */}
          <div className="space-y-2.5 pt-2 border-t border-stone-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-indigo-400" /> 3. Musik Ambient Lembut (Background Pad / String / Piano):
              </label>
              <span className="text-[10px] text-indigo-300">Tuning 432Hz / 528Hz</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {AMBIENT_OPTIONS.map((amb) => {
                const isSelected = ambientMusic === amb.id;
                const isPreviewing = previewingSound === amb.id;

                return (
                  <div
                    key={amb.id}
                    onClick={() => {
                      setAmbientMusic(amb.id);
                      prepareSoundscapeAudio(selectedNatureSounds, amb.id, natureVolumePct, musicVolumePct);
                      updateMetadataForSelection(selectedCategory.name, selectedSubcategory, natureSound, amb.id);
                    }}
                    className={`p-2.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-950/70 border-indigo-500 text-stone-100 ring-1 ring-indigo-500'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-stone-200">{amb.name}</div>
                      <div className="text-[10px] text-stone-400 mt-0.5 line-clamp-2">{amb.desc}</div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewSound('ambient', amb.id);
                      }}
                      className={`mt-2 w-full py-1 rounded-lg text-[10px] font-medium transition ${
                        isPreviewing ? 'bg-indigo-500 text-white font-bold' : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
                      }`}
                    >
                      {isPreviewing ? 'Preview...' : 'Uji Musik'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Acoustic Volume Mixer Sliders (Narasi vs Suara Alam vs Musik) */}
          <div className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-stone-200">
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" /> Mixer Level Akustik & Fade:
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Auto-Ducking Active</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Narration Vol */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-stone-300 font-medium">Vol Narasi (Utama):</span>
                  <span className="font-bold text-sky-400">{narrationVolumePct}%</span>
                </div>
                <div className="text-[10px] font-mono text-sky-400 tracking-wider">
                  {renderAsciiVolumeMeter(narrationVolumePct)}
                </div>
                <input
                  type="range"
                  min={40}
                  max={100}
                  step={5}
                  value={narrationVolumePct}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setNarrationVolumePct(val);
                    setActiveMetadata((prev) => ({ ...prev, narrationVolume: val }));
                  }}
                  className="w-full accent-sky-500 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
                />
              </div>

              {/* Nature Vol */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-stone-300 font-medium">Vol Suara Alam:</span>
                  <span className="font-bold text-emerald-400">{natureVolumePct}%</span>
                </div>
                <div className="text-[10px] font-mono text-emerald-400 tracking-wider">
                  {renderAsciiVolumeMeter(natureVolumePct)}
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={natureVolumePct}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setNatureVolumePct(val);
                    setActiveMetadata((prev) => ({ ...prev, natureVolume: val }));
                    prepareSoundscapeAudio(selectedNatureSounds, ambientMusic, val, musicVolumePct);
                  }}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
                />
              </div>

              {/* Ambient Music Vol */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-stone-300 font-medium">Vol Musik Ambient:</span>
                  <span className="font-bold text-indigo-400">{musicVolumePct}%</span>
                </div>
                <div className="text-[10px] font-mono text-indigo-400 tracking-wider">
                  {renderAsciiVolumeMeter(musicVolumePct)}
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={musicVolumePct}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setMusicVolumePct(val);
                    setActiveMetadata((prev) => ({ ...prev, musicVolume: val }));
                    prepareSoundscapeAudio(selectedNatureSounds, ambientMusic, natureVolumePct, val);
                  }}
                  className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
                />
              </div>
            </div>

            {/* Fade In & Out Controls */}
            <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-800/80 flex-wrap gap-2">
              <span className="flex items-center gap-1">
                <span>Fade In:</span>
                <strong className="text-stone-200">{fadeInSec} detik</strong>
              </span>
              <span className="flex items-center gap-1">
                <span>Fade Out:</span>
                <strong className="text-stone-200">{fadeOutSec} detik</strong>
              </span>
              <span className="text-sky-300 font-mono text-[10px]">Loop: Seamless 30s</span>
            </div>
          </div>

          {/* 6. Duration, Voice & Goal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" /> Durasi Sesi:
              </label>
              <div className="flex flex-wrap gap-1">
                {DURATIONS.slice(0, 6).map((dur) => (
                  <button
                    key={dur}
                    onClick={() => setDurationMinutes(dur)}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${
                      durationMinutes === dur
                        ? 'bg-sky-600 border-sky-500 text-white'
                        : 'bg-stone-950 border-stone-800 text-stone-400'
                    }`}
                  >
                    {dur}m
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-sky-400" /> Karakter Vokal Narasi:
              </label>
              <select
                value={voiceName}
                onChange={(e) => setVoiceName(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-stone-100 outline-none focus:border-sky-500"
              >
                {VOICES.map((v, idx) => (
                  <option key={idx} value={v.name}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Emotion & Goal Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">Kondisi Emosi Saat Ini:</label>
              <select
                value={emotionState}
                onChange={(e) => setEmotionState(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-stone-100 outline-none focus:border-sky-500"
              >
                {EMOTIONS.map((emo, idx) => (
                  <option key={idx} value={emo}>{emo}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">Kecepatan Narasi (Bahasa Indonesia):</label>
              <div className="flex gap-1.5">
                {(['perlahan', 'santai', 'normal'] as const).map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setSpeechSpeed(spd)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs capitalize transition font-medium ${
                      speechSpeed === spd
                        ? 'bg-sky-950 border-sky-500 text-sky-200 font-bold'
                        : 'bg-stone-950 border-stone-800 text-stone-400'
                    }`}
                  >
                    {spd}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Custom Goal */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-300">Tujuan Personal Sesi:</label>
            <input
              type="text"
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              placeholder="Contoh: Menenangkan dada yang sesak dan membantu tidur tenang"
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100 outline-none focus:border-sky-500"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateAudio}
            disabled={isGenerating}
            className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 disabled:bg-stone-800 text-white font-bold rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-sky-950/60"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-sky-200" />
                <span>Menyusun Lanskap Relaksasi & Naskah Narasi...</span>
              </>
            ) : (
              <>
                <Radio className="w-4 h-4" />
                <span>Rancang & Putar Audio Relaksasi Premium</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Audio Player & Metadata Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Player Card */}
          <div className="bg-stone-900/90 border border-stone-800 p-5 md:p-6 rounded-3xl space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-sky-400" /> Player Relaksasi LEGA AI
              </span>
              {isPlaying && (
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live Audio
                </span>
              )}
            </div>

            {/* Title & Atmosphere Badge */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {activeMetadata.atmosphereTheme}
                </span>
              </div>
              <h4 className="font-bold text-sm text-stone-100">
                {generatedScriptData?.title || `${selectedSubcategory} - ${selectedCategory.name}`}
              </h4>
              <p className="text-xs text-stone-400 line-clamp-2">
                {generatedScriptData?.description || activeMetadata.voiceWarmthDescription}
              </p>
            </div>

            {/* Audio Engine Mode Selection */}
            <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-semibold text-stone-300 flex items-center gap-1">
                  <Music className="w-3 h-3 text-sky-400" /> Mode Engine Audio:
                </label>
                <span className="text-[9px] text-sky-400 font-mono">Klik untuk ganti instan</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => handleSelectPlaybackSource('gemini_tts')}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-medium transition text-center truncate flex flex-col items-center justify-center ${
                    playbackSource === 'gemini_tts'
                      ? 'bg-sky-950 border border-sky-500 text-sky-200 font-bold shadow-sm'
                      : 'bg-stone-900 border border-stone-800/80 text-stone-400 hover:text-stone-300 hover:border-stone-700'
                  }`}
                  title="Vokal AI Gemini + Suara Alam & Musik"
                >
                  <span className="truncate">Gemini TTS</span>
                  <span className="text-[8px] opacity-75 font-normal truncate">AI Voice</span>
                </button>
                <button
                  onClick={() => handleSelectPlaybackSource('web_speech')}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-medium transition text-center truncate flex flex-col items-center justify-center ${
                    playbackSource === 'web_speech'
                      ? 'bg-sky-950 border border-sky-500 text-sky-200 font-bold shadow-sm'
                      : 'bg-stone-900 border border-stone-800/80 text-stone-400 hover:text-stone-300 hover:border-stone-700'
                  }`}
                  title="Narasi Suara Indonesia Hangat + Suara Alam"
                >
                  <span className="truncate">Narasi + Alam</span>
                  <span className="text-[8px] opacity-75 font-normal truncate">Vokal & Alam</span>
                </button>
                <button
                  onClick={() => handleSelectPlaybackSource('ambient_music')}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-medium transition text-center truncate flex flex-col items-center justify-center ${
                    playbackSource === 'ambient_music'
                      ? 'bg-sky-950 border border-sky-500 text-sky-200 font-bold shadow-sm'
                      : 'bg-stone-900 border border-stone-800/80 text-stone-400 hover:text-stone-300 hover:border-stone-700'
                  }`}
                  title="Hanya Suara Alam Alami & Musik Ambient (Tanpa Suara Bicara)"
                >
                  <span className="truncate">Hanya Soundscape</span>
                  <span className="text-[8px] opacity-75 font-normal truncate">Tanpa Suara</span>
                </button>
              </div>
            </div>

            {/* Visualizer & Waveform Sphere */}
            <div className="p-5 bg-stone-950 border border-stone-800 rounded-2xl flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
              <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-700 ${
                isPlaying
                  ? 'border-sky-500 bg-sky-950/60 shadow-2xl shadow-sky-500/50 scale-105'
                  : 'border-stone-800 bg-stone-900'
              }`}>
                <Headphones className={`w-7 h-7 transition ${isPlaying ? 'text-sky-400 animate-bounce' : 'text-stone-600'}`} />
              </div>

              {/* Animated Audio Equalizer Bars */}
              <div className="flex items-center justify-center gap-1 h-7">
                {[35, 65, 25, 85, 45, 75, 40, 60, 30, 70, 50, 80].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: isPlaying ? `${Math.max(12, (h * (i % 2 === 0 ? 0.9 : 1.1)))}%` : '15%' }}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      isPlaying ? (i % 2 === 0 ? 'bg-sky-400' : 'bg-emerald-400') : 'bg-stone-800'
                    }`}
                  />
                ))}
              </div>

              {/* Seekable Progress Bar */}
              <div className="w-full space-y-1">
                <input
                  type="range"
                  min={0}
                  max={totalDuration || 1}
                  step={0.5}
                  value={currentTime}
                  onChange={(e) => handleSeek(parseFloat(e.target.value))}
                  disabled={!audioUrl && !totalDuration}
                  className="w-full accent-sky-500 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-stone-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(totalDuration)}</span>
                </div>
              </div>
            </div>

            {/* Audio Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleRestart}
                  disabled={!audioUrl && !isPlaying}
                  className="p-2.5 bg-stone-950 hover:bg-stone-800 disabled:opacity-40 border border-stone-800 rounded-xl text-stone-300 transition"
                  title="Ulangi dari Awal"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlayPause}
                  disabled={!audioUrl && !generatedScriptData}
                  className={`p-4 rounded-2xl text-white font-bold shadow-xl transition flex items-center justify-center ${
                    isPlaying
                      ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/50'
                      : 'bg-sky-600 hover:bg-sky-500 shadow-sky-950/50'
                  }`}
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>

                <button
                  onClick={toggleMute}
                  disabled={!audioUrl && !isPlaying}
                  className="p-2.5 bg-stone-950 hover:bg-stone-800 disabled:opacity-40 border border-stone-800 rounded-xl text-stone-300 transition"
                  title="Mute / Unmute"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-stone-300" />}
                </button>
              </div>

              {/* Master Volume Slider */}
              <div className="flex items-center gap-2 text-xs text-stone-400 px-2">
                <Volume2 className="w-3.5 h-3.5 shrink-0" />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={masterVolume}
                  onChange={(e) => handleMasterVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              {/* Headset Recommendation Pill */}
              <div className="p-2.5 bg-sky-950/70 border border-sky-600/40 rounded-xl flex items-center gap-2 text-[11px] text-sky-200">
                <span className="text-sm shrink-0">🎧</span>
                <span className="leading-tight font-medium">
                  Gunakan headset atau earphone untuk pengalaman LEGA yang lebih optimal.
                </span>
              </div>
            </div>
          </div>

          {/* Full Metadata Inspector Panel (As Requested by User) */}
          {showMetadataDrawer && (
            <div className="bg-stone-900/90 border border-stone-800 p-5 rounded-3xl space-y-3.5 shadow-xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-sky-400" /> Metadata Relaksasi Audio LEGA
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Premium Specification</span>
              </div>

              <div className="space-y-2 text-xs">
                {/* 1. Tema Suasana */}
                <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between gap-2">
                  <span className="text-stone-400">Tema Suasana:</span>
                  <span className="font-semibold text-stone-200 text-right truncate max-w-[200px]">
                    {activeMetadata.atmosphereTheme}
                  </span>
                </div>

                {/* 2. Jenis Backsound */}
                <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between gap-2">
                  <span className="text-stone-400 flex items-center gap-1">
                    <Trees className="w-3 h-3 text-emerald-400" /> Jenis Backsound:
                  </span>
                  <span className="font-semibold text-emerald-300 text-right">
                    {activeMetadata.natureSoundLabel}
                  </span>
                </div>

                {/* 3. Jenis Musik */}
                <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between gap-2">
                  <span className="text-stone-400 flex items-center gap-1">
                    <Music className="w-3 h-3 text-indigo-400" /> Jenis Musik:
                  </span>
                  <span className="font-semibold text-indigo-300 text-right">
                    {activeMetadata.ambientMusicLabel}
                  </span>
                </div>

                {/* 4. Volume Ratios Grid */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 bg-stone-950 rounded-xl border border-stone-800 text-center">
                    <div className="text-[10px] text-stone-400">Vol Narasi</div>
                    <div className="font-bold text-sky-400 mt-0.5">{activeMetadata.narrationVolume}%</div>
                  </div>
                  <div className="p-2 bg-stone-950 rounded-xl border border-stone-800 text-center">
                    <div className="text-[10px] text-stone-400">Vol Suara Alam</div>
                    <div className="font-bold text-emerald-400 mt-0.5">{activeMetadata.natureVolume}%</div>
                  </div>
                  <div className="p-2 bg-stone-950 rounded-xl border border-stone-800 text-center">
                    <div className="text-[10px] text-stone-400">Vol Musik</div>
                    <div className="font-bold text-indigo-400 mt-0.5">{activeMetadata.musicVolume}%</div>
                  </div>
                </div>

                {/* 5. Fade In & Fade Out */}
                <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between gap-2">
                  <span className="text-stone-400">Durasi Fade In & Out:</span>
                  <span className="font-mono text-stone-200 text-right">
                    In: {activeMetadata.fadeInSeconds}s | Out: {activeMetadata.fadeOutSeconds}s
                  </span>
                </div>

                {/* 6. Rekomendasi Loop */}
                <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between gap-2">
                  <span className="text-stone-400">Rekomendasi Loop:</span>
                  <span className="font-semibold text-sky-300 text-right text-[11px]">
                    {activeMetadata.loopRecommendation}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Generated Script Card */}
          {generatedScriptData && (
            <div className="bg-stone-900/90 border border-stone-800 p-5 rounded-3xl space-y-3 animate-fade-in text-xs shadow-xl">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <span className="font-bold text-stone-200 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-sky-400" /> Naskah Narasi Bahasa Indonesia
                </span>
                <button
                  onClick={handleCopyScript}
                  className="px-2.5 py-1 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 rounded-lg text-[10px] font-medium transition flex items-center gap-1"
                >
                  {copiedScript ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedScript ? 'Tersalin' : 'Salin Teks'}</span>
                </button>
              </div>

              <div className="p-3.5 bg-stone-950 border border-stone-800 rounded-xl max-h-48 overflow-y-auto leading-relaxed text-stone-300 italic whitespace-pre-wrap">
                "{generatedScriptData.script}"
              </div>

              {generatedScriptData.reflectiveQuestions && (
                <div className="space-y-1.5 pt-2 border-t border-stone-800">
                  <p className="font-bold text-stone-300 text-[11px]">Refleksi Batin Setelah Mendengarkan:</p>
                  <ul className="space-y-1 text-stone-400">
                    {generatedScriptData.reflectiveQuestions.map((q: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Preset Library Section with Full Relaxation Metadata */}
      <div className="space-y-3 pt-4 border-t border-stone-800">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-stone-400 flex items-center gap-2">
            <Headphones className="w-4 h-4 text-sky-400" /> Koleksi Audio Relaksasi Pilihan Langsung Putar:
          </h3>
          <span className="text-[11px] text-stone-400">Lengkap dengan konfigurasi backsound & metadata</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESET_LIBRARY.map((preset) => (
            <div
              key={preset.id}
              className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3 hover:border-stone-700 transition flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-stone-950 text-sky-300 px-2 py-0.5 rounded border border-stone-800 font-semibold">
                    {preset.category}
                  </span>
                  <span className="text-[10px] text-stone-400">{preset.duration}</span>
                </div>
                <h4 className="font-bold text-xs text-stone-100">{preset.title}</h4>
                <p className="text-[11px] text-stone-400 leading-relaxed line-clamp-2">{preset.desc}</p>

                {/* Metadata Pills */}
                <div className="pt-1.5 border-t border-stone-800/80 space-y-1 text-[10px] text-stone-400">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Trees className="w-3 h-3" /> {preset.metadata.natureSoundLabel}
                    </span>
                    <span className="font-mono text-stone-400">{preset.metadata.natureVolume}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-indigo-400 flex items-center gap-1">
                      <Music className="w-3 h-3" /> {preset.metadata.ambientMusicLabel}
                    </span>
                    <span className="font-mono text-stone-400">{preset.metadata.musicVolume}%</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handlePlayPreset(preset)}
                className="w-full py-2 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-sky-300 hover:text-sky-200 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5" /> Putar Preset
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-Module Ecosystem Link */}
      <div className="p-5 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-3">
        <h4 className="font-bold text-xs text-stone-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-400" /> Terhubung dengan Seluruh Ekosistem Modul LEGA:
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'LEGA AI Coach', key: 'ai-coach' },
            { name: 'LEGA Emotion Analyzer', key: 'emotion-analysis' },
            { name: 'LEGA Release', key: 'emotional-release' },
            { name: 'LEGA Presence', key: 'mindfulness' },
            { name: 'LEGA Observer', key: 'observer' },
            { name: 'LEGA Body Awareness', key: 'body-awareness' },
            { name: 'LEGA Breathing', key: 'breathing' },
            { name: 'LEGA Journal', key: 'journal' },
            { name: 'LEGA Insight', key: 'ai-insights' },
            { name: 'LEGA Progress', key: 'progress' }
          ].map((mod, idx) => (
            <button
              key={idx}
              onClick={() => onSelectModule && onSelectModule(mod.key)}
              className="px-3 py-1.5 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-sky-300 rounded-xl text-xs font-medium transition flex items-center gap-1.5"
            >
              <span>{mod.name}</span>
              <ArrowRight className="w-3 h-3 text-stone-500" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
