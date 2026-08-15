import React, { useState, useRef, useEffect } from 'react';
import {
  Headphones,
  Sparkles,
  Play,
  Pause,
  Square,
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
  SlidersHorizontal
} from 'lucide-react';
import { ModuleType, NatureSoundType, AmbientMusicType, AudioRelaxationMetadata } from '../types';
import { generateAudioScript, generateGeminiTts } from '../lib/geminiApi';
import {
  pcmToWavBlobUrl,
  generateRelaxationSoundscapeWav,
  speakIndonesianNarration,
  stopIndonesianNarration,
  playCalmMeditationChime,
  NATURE_SOUND_DEFINITIONS,
  AMBIENT_MUSIC_DEFINITIONS,
  buildAudioRelaxationMetadata
} from '../lib/audioEngine';

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
  { id: 'aliran-sungai', name: 'Aliran Sungai Alami', icon: Droplets, desc: 'Gemericik arus air jernih mengalir konstan' },
  { id: 'gemericik-air', name: 'Gemericik Air', icon: Droplets, desc: 'Tetesan air sejuk di atas bebatuan' },
  { id: 'burung-pagi', name: 'Burung Pagi', icon: Bird, desc: 'Kicau burung fajar menyapa udara segar' },
  { id: 'angin-pepohonan', name: 'Angin di Pepohonan', icon: Wind, desc: 'Semilir hembusan angin mengayun dedaunan' },
  { id: 'ombak-pantai', name: 'Ombak Pantai', icon: Waves, desc: 'Deburan ombak laut menenangkan ritme napas' },
  { id: 'hutan-alami', name: 'Hutan Alami', icon: Trees, desc: 'Kanopi hutan tropis rimbun dan teduh' },
  { id: 'hujan-lembut', name: 'Hujan Lembut', icon: CloudRain, desc: 'Rintik hujan tenang pengantar tidur nyenyak' }
];

const AMBIENT_OPTIONS: { id: AmbientMusicType; name: string; desc: string }[] = [
  { id: 'piano-lembut', name: 'Piano Lembut Akustik (432Hz)', desc: 'Tuts piano hangat nada pentatonik' },
  { id: 'pad-sinematik', name: 'Pad Sinematik Mengalun (432Hz)', desc: 'Lapisan pad analog hangat & luas' },
  { id: 'string-halus', name: 'String Halus Meditatif (528Hz)', desc: 'Gesekan dawai orkestra lembut melarutkan stres' }
];

const DURATIONS = [1, 3, 5, 10, 15, 20, 30, 45, 60];

const VOICES = [
  { name: 'Kore', label: 'Kore (Lembut, Tenang & Hangat)', tone: 'Feminin Soft' },
  { name: 'Zephyr', label: 'Zephyr (Hangat, Bersahabat & Jernih)', tone: 'Masculine Warm' },
  { name: 'Puck', label: 'Puck (Ramah & Menentramkan Batin)', tone: 'Gentle Friend' },
  { name: 'Fenrir', label: 'Fenrir (Suara Dalam, Mantap & Grounded)', tone: 'Deep Grounded' },
  { name: 'Charon', label: 'Charon (Soothing Khusus Pengantar Tidur)', tone: 'Quiet Night' }
];

const EMOTIONS = ['Cemas', 'Marah', 'Sedih', 'Kecewa', 'Bersalah', 'Lelah', 'Netral'];

const PRESET_LIBRARY = [
  {
    id: 'pres-1',
    title: 'Napas Penghening Senja',
    category: 'LEGA Calm',
    subcategory: 'Relaksasi Sebelum Tidur',
    duration: '5 Menit',
    desc: 'Audio panduan batin dengan aliran sungai alami dan piano lembut untuk mengendurkan otot serta pikiran sebelum tidur.',
    sampleScript: 'Selamat malam. Ambil posisi yang paling nyaman di tempat tidur Anda. Tarik napas lembut... biarkan seluruh tubuh rileks. [Jeda 3 detik] Hari ini telah selesai, Anda tidak perlu membawa beban hari ini ke dalam tidur Anda.',
    metadata: buildAudioRelaxationMetadata(
      'Ketenangan Senja & Relaksasi Tidur',
      'aliran-sungai',
      'piano-lembut',
      { narrationVolume: 90, natureVolume: 26, musicVolume: 20, fadeInSeconds: 4.5, fadeOutSeconds: 6.0 }
    )
  },
  {
    id: 'pres-2',
    title: 'Grounding Pelepasan Kecemasan',
    category: 'LEGA Release',
    subcategory: 'Pelepasan Cemas',
    duration: '3 Menit',
    desc: 'Audio pereda rasa panik dan cemas singkat dengan hembusan angin di pepohonan dan pad sinematik 432Hz.',
    sampleScript: 'Mari berhenti sejenak. Rasakan pijakan kaki Anda di bumi. Napas Anda aman. Kecemasan ini adalah awan yang lewat di langit batin Anda. Anda bukan kecemasan itu, Anda adalah langitnya.',
    metadata: buildAudioRelaxationMetadata(
      'Grounding & Pelepasan Kecemasan Akut',
      'angin-pepohonan',
      'pad-sinematik',
      { narrationVolume: 90, natureVolume: 25, musicVolume: 20, fadeInSeconds: 4.0, fadeOutSeconds: 5.5 }
    )
  },
  {
    id: 'pres-3',
    title: 'Mengenal Nilai Hidup & Syukur',
    category: 'LEGA Reflection',
    subcategory: 'Syukur',
    duration: '10 Menit',
    desc: 'Panduan refleksi mendalam berlatar burung pagi dan dawai string halus untuk mengapresiasi perjalanan hidup.',
    sampleScript: 'Luangkan waktu untuk menyapa diri sendiri. Tarik napas dalam... Apa satu hal kecil hari ini yang layak Anda beri senyuman terima kasih?',
    metadata: buildAudioRelaxationMetadata(
      'Syukur & Keselarasan Nilai Hidup',
      'burung-pagi',
      'string-halus',
      { narrationVolume: 90, natureVolume: 22, musicVolume: 18, fadeInSeconds: 5.0, fadeOutSeconds: 6.5 }
    )
  },
  {
    id: 'pres-4',
    title: 'Hujan Pembasuh Kelelahan Batin',
    category: 'LEGA Calm',
    subcategory: 'Pemulihan Setelah Hari yang Berat',
    duration: '15 Menit',
    desc: 'Sentuhan rintik hujan lembut dan piano akustik menidurkan kegelisahan dan mengembalikan energi.',
    sampleScript: 'Dengarkan rintik hujan yang jatuh di luar sana... Setiap tetesnya membasuh kepenatan yang menempel di pundak Anda. Hembuskan napas panjang dan lepaskan.',
    metadata: buildAudioRelaxationMetadata(
      'Pemulihan Setelah Hari Berat & Hujan Hening',
      'hujan-lembut',
      'piano-lembut',
      { narrationVolume: 90, natureVolume: 28, musicVolume: 18, fadeInSeconds: 4.5, fadeOutSeconds: 7.0 }
    )
  }
];

export const AudioPlayerView: React.FC<AudioPlayerViewProps> = ({
  onSelectModule,
  onOpenCrisis,
  userName = 'Sahabat LEGA'
}) => {
  // Category & Generation Configuration
  const [selectedCategory, setSelectedCategory] = useState<AudioCategory>(CATEGORIES[0]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(CATEGORIES[0].subcategories[2]); // Pelepasan Cemas
  const [durationMinutes, setDurationMinutes] = useState<number>(5);
  const [emotionState, setEmotionState] = useState<string>('Cemas');
  const [emotionIntensity, setEmotionIntensity] = useState<'Rendah' | 'Sedang' | 'Tinggi' | 'Sangat Tinggi'>('Sedang');
  const [userExperienceLevel, setUserExperienceLevel] = useState<'pemula' | 'menengah' | 'lanjutan'>('pemula');
  const [audioMode, setAudioMode] = useState<'guided' | 'gentle' | 'reflective' | 'sleep' | 'emergency_calming'>('guided');
  const [spiritualMode, setSpiritualMode] = useState<boolean>(false);
  const [customGoal, setCustomGoal] = useState<string>('Menenangkan pikiran dan melepaskan ketegangan tubuh');
  const [voiceName, setVoiceName] = useState<string>('Kore');
  const [speechSpeed, setSpeechSpeed] = useState<'perlahan' | 'normal' | 'santai'>('perlahan');

  // Soundscape & Acoustic Mixing Controls
  const [natureSound, setNatureSound] = useState<NatureSoundType>('angin-pepohonan');
  const [ambientMusic, setAmbientMusic] = useState<AmbientMusicType>('pad-sinematik');
  const [narrationVolumePct, setNarrationVolumePct] = useState<number>(90); // 90%
  const [natureVolumePct, setNatureVolumePct] = useState<number>(25); // 25% (Latar)
  const [musicVolumePct, setMusicVolumePct] = useState<number>(20); // 20% (Latar)
  const [fadeInSec, setFadeInSec] = useState<number>(4.5);
  const [fadeOutSec, setFadeOutSec] = useState<number>(6.0);

  // Active Session Metadata
  const [activeMetadata, setActiveMetadata] = useState<AudioRelaxationMetadata>(() =>
    buildAudioRelaxationMetadata('Pelepasan Ketegangan Batin', 'angin-pepohonan', 'pad-sinematik')
  );

  // Audio Player State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedScriptData, setGeneratedScriptData] = useState<any | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [masterVolume, setMasterVolume] = useState<number>(0.85);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [previewingSound, setPreviewingSound] = useState<string | null>(null);
  const [showMetadataDrawer, setShowMetadataDrawer] = useState<boolean>(true);

  // Audio Engine & Playback Options
  const [playbackSource, setPlaybackSource] = useState<'gemini_tts' | 'web_speech' | 'ambient_music'>('gemini_tts');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Sync category change with defaults
  const handleCategoryChange = (cat: AudioCategory) => {
    setSelectedCategory(cat);
    setSelectedSubcategory(cat.subcategories[0]);
    setNatureSound(cat.defaultNature);
    setAmbientMusic(cat.defaultAmbient);
    updateMetadataForSelection(cat.name, cat.subcategories[0], cat.defaultNature, cat.defaultAmbient);
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
        fadeInSeconds: 1.0,
        fadeOutSeconds: 1.5,
        includeSingingBowl: false
      });

      if (previewAudioRef.current) {
        previewAudioRef.current.src = wavUrl;
        previewAudioRef.current.volume = masterVolume;
        previewAudioRef.current.play();
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

  // Generate Personalized AI Audio & Relaxation Experience
  const handleGenerateAudio = async () => {
    setIsGenerating(true);
    stopIndonesianNarration();
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

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

      // 2. Synthesize Audio Experience
      const ttsText = scriptData?.cleanScriptForTTS || scriptData?.script || 'Mari kita hening sejenak...';

      if (playbackSource === 'web_speech') {
        // Mode 1: Indonesian Web Speech Narration + Multi-Layer Soundscape (Nature + Ambient)
        const soundscapeUrl = await generateRelaxationSoundscapeWav(durationMinutes * 60, {
          natureType: natureSound,
          ambientType: ambientMusic,
          natureVolume: natureVolumePct / 100,
          musicVolume: musicVolumePct / 100,
          fadeInSeconds: fadeInSec,
          fadeOutSeconds: fadeOutSec
        });

        setAudioUrl(soundscapeUrl);
        if (audioRef.current) {
          audioRef.current.src = soundscapeUrl;
          // Background sound stays gentle as a backdrop
          audioRef.current.volume = masterVolume * (natureVolumePct / 100 + musicVolumePct / 100);
          audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => console.log('Autoplay handled:', e));
        }

        speakIndonesianNarration(ttsText, {
          rate: speechSpeed === 'perlahan' ? 0.80 : speechSpeed === 'santai' ? 0.85 : 0.92,
          pitch: 0.95,
          volume: (narrationVolumePct / 100) * masterVolume,
          onEnd: () => setIsPlaying(false),
          onError: () => setIsPlaying(false)
        });
      } else if (playbackSource === 'ambient_music') {
        // Mode 2: Pure Relaxing Nature & Ambient Soundscape
        const soundscapeUrl = await generateRelaxationSoundscapeWav(durationMinutes * 60, {
          natureType: natureSound,
          ambientType: ambientMusic,
          natureVolume: natureVolumePct / 100,
          musicVolume: musicVolumePct / 100,
          fadeInSeconds: fadeInSec,
          fadeOutSeconds: fadeOutSec
        });

        setAudioUrl(soundscapeUrl);
        if (audioRef.current) {
          audioRef.current.src = soundscapeUrl;
          audioRef.current.volume = masterVolume;
          audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => console.log('Autoplay handled:', e));
        }
      } else {
        // Mode 3: Gemini TTS with Indonesian Tone & Automatic Ambient Soundbed
        const rawAudio = await generateGeminiTts(ttsText, voiceName as any);
        let finalUrl: string | null = null;

        if (rawAudio) {
          if (rawAudio.startsWith('data:audio/') || rawAudio.startsWith('blob:') || rawAudio.startsWith('http')) {
            finalUrl = rawAudio;
          } else {
            finalUrl = pcmToWavBlobUrl(rawAudio, 24000);
          }
        }

        if (!finalUrl) {
          // Robust Fallback: Synthesize soundscape & speak in warm Indonesian
          finalUrl = await generateRelaxationSoundscapeWav(durationMinutes * 60, {
            natureType: natureSound,
            ambientType: ambientMusic,
            natureVolume: natureVolumePct / 100,
            musicVolume: musicVolumePct / 100,
            fadeInSeconds: fadeInSec,
            fadeOutSeconds: fadeOutSec
          });
          speakIndonesianNarration(ttsText, {
            rate: 0.82,
            pitch: 0.95,
            volume: (narrationVolumePct / 100) * masterVolume,
            onEnd: () => setIsPlaying(false),
            onError: () => setIsPlaying(false)
          });
        }

        setAudioUrl(finalUrl);
        if (audioRef.current && finalUrl) {
          audioRef.current.src = finalUrl;
          audioRef.current.volume = masterVolume;
          audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => {
            console.log('Autoplay deferred:', e);
            speakIndonesianNarration(ttsText, {
              rate: 0.82,
              pitch: 0.95,
              volume: (narrationVolumePct / 100) * masterVolume,
              onEnd: () => setIsPlaying(false)
            });
          });
        }
      }
    } catch (err) {
      console.error('Error generating audio:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Play Preset Track
  const handlePlayPreset = async (preset: typeof PRESET_LIBRARY[0]) => {
    setIsGenerating(true);
    stopIndonesianNarration();
    if (audioRef.current) audioRef.current.pause();

    setActiveMetadata(preset.metadata);
    setNatureSound(preset.metadata.natureSoundType);
    setAmbientMusic(preset.metadata.ambientMusicType);
    setNarrationVolumePct(preset.metadata.narrationVolume);
    setNatureVolumePct(preset.metadata.natureVolume);
    setMusicVolumePct(preset.metadata.musicVolume);

    try {
      setGeneratedScriptData({
        title: preset.title,
        category: preset.category,
        subcategory: preset.subcategory,
        durationMinutes: 5,
        description: preset.desc,
        script: preset.sampleScript,
        ttsPrompt: preset.sampleScript,
        reflectiveQuestions: [
          'Bagaimana sensasi napas dan detak jantung Anda setelah menyimak panduan ini?',
          'Apakah ada rasa lega atau ketegangan yang mulai mengendur?'
        ]
      });

      // Try Gemini TTS first
      const rawAudio = await generateGeminiTts(preset.sampleScript, 'Kore');
      let url: string | null = null;

      if (rawAudio) {
        if (rawAudio.startsWith('data:audio/') || rawAudio.startsWith('blob:') || rawAudio.startsWith('http')) {
          url = rawAudio;
        } else {
          url = pcmToWavBlobUrl(rawAudio, 24000);
        }
      }

      if (!url) {
        // Guaranteed Fallback: Multi-layer Soundscape + Indonesian speech
        url = await generateRelaxationSoundscapeWav(180, {
          natureType: preset.metadata.natureSoundType,
          ambientType: preset.metadata.ambientMusicType,
          natureVolume: preset.metadata.natureVolume / 100,
          musicVolume: preset.metadata.musicVolume / 100
        });
        speakIndonesianNarration(preset.sampleScript, {
          rate: 0.82,
          pitch: 0.95,
          volume: masterVolume,
          onEnd: () => setIsPlaying(false),
          onError: () => setIsPlaying(false)
        });
      }

      setAudioUrl(url);
      if (audioRef.current && url) {
        audioRef.current.src = url;
        audioRef.current.volume = masterVolume;
        audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => {
          console.log('Autoplay deferred:', e);
          speakIndonesianNarration(preset.sampleScript, {
            rate: 0.82,
            pitch: 0.95,
            volume: masterVolume,
            onEnd: () => setIsPlaying(false)
          });
        });
      }
    } catch (err) {
      console.error('Preset play error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Play/Pause toggle
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      stopIndonesianNarration();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((e) => {
        console.log('Audio play resumed error:', e);
        if (generatedScriptData?.script) {
          speakIndonesianNarration(generatedScriptData.script, {
            rate: 0.82,
            pitch: 0.95,
            volume: masterVolume,
            onEnd: () => setIsPlaying(false)
          });
        }
      });
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    audioRef.current.play().then(() => setIsPlaying(true));
  };

  const handleSeek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleMasterVolumeChange = (v: number) => {
    setMasterVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    setIsMuted(v === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = masterVolume || 0.85;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setTotalDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

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
      <audio ref={audioRef} />
      <audio ref={previewAudioRef} />

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

        {/* Acoustic Balance & Non-Medical Disclaimer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="p-3 bg-stone-950 border border-stone-800/80 rounded-2xl text-[11px] text-stone-300 space-y-1">
            <div className="flex items-center gap-2 text-sky-400 font-semibold">
              <Disc className="w-3.5 h-3.5" />
              <span>Prinsip Akustik LEGA (Latar Tidak Mengalahkan Narasi):</span>
            </div>
            <p className="text-stone-400 leading-relaxed">
              Musik ambient dan suara alam dirancang khusus berada pada rentang volume 15–28% dengan auto-ducking halus, memastikan vokal narasi Bahasa Indonesia tetap terdengar hangat, intim, dan jernih.
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

          {/* 3. 7 Pilihan Backsound Suara Alam Sesuai Tema */}
          <div className="space-y-2.5 pt-2 border-t border-stone-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                <Trees className="w-3.5 h-3.5 text-emerald-400" /> 2. Rekomendasi Backsound Suara Alam:
              </label>
              <span className="text-[10px] text-stone-400">7 Lanskap Alami</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {NATURE_OPTIONS.map((opt) => {
                const IconComp = opt.icon;
                const isSelected = natureSound === opt.id;
                const isPreviewing = previewingSound === opt.id;

                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      setNatureSound(opt.id);
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
                        <div className="text-xs font-bold text-stone-200 truncate">{opt.name}</div>
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
                <input
                  type="range"
                  min={50}
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
                <input
                  type="range"
                  min={5}
                  max={50}
                  step={1}
                  value={natureVolumePct}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setNatureVolumePct(val);
                    setActiveMetadata((prev) => ({ ...prev, natureVolume: val }));
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
                <input
                  type="range"
                  min={5}
                  max={40}
                  step={1}
                  value={musicVolumePct}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setMusicVolumePct(val);
                    setActiveMetadata((prev) => ({ ...prev, musicVolume: val }));
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
            <div className="bg-stone-950 p-2 rounded-xl border border-stone-800 space-y-1">
              <label className="text-[10px] font-semibold text-stone-400 flex items-center gap-1">
                <Music className="w-3 h-3 text-sky-400" /> Mode Engine Audio:
              </label>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => setPlaybackSource('gemini_tts')}
                  className={`py-1 px-1.5 rounded-lg text-[10px] font-medium transition text-center truncate ${
                    playbackSource === 'gemini_tts'
                      ? 'bg-sky-950 border border-sky-500 text-sky-200 font-bold'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-300'
                  }`}
                >
                  Gemini TTS
                </button>
                <button
                  onClick={() => setPlaybackSource('web_speech')}
                  className={`py-1 px-1.5 rounded-lg text-[10px] font-medium transition text-center truncate ${
                    playbackSource === 'web_speech'
                      ? 'bg-sky-950 border border-sky-500 text-sky-200 font-bold'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-300'
                  }`}
                >
                  Narasi + Alam
                </button>
                <button
                  onClick={() => setPlaybackSource('ambient_music')}
                  className={`py-1 px-1.5 rounded-lg text-[10px] font-medium transition text-center truncate ${
                    playbackSource === 'ambient_music'
                      ? 'bg-sky-950 border border-sky-500 text-sky-200 font-bold'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-300'
                  }`}
                >
                  Hanya Soundscape
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
