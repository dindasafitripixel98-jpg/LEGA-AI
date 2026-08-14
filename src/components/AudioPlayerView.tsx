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
  Bell
} from 'lucide-react';
import { ModuleType } from '../types';
import { generateAudioScript, generateGeminiTts } from '../lib/geminiApi';
import {
  pcmToWavBlobUrl,
  generateMeditationAmbientWav,
  speakIndonesianNarration,
  stopIndonesianNarration
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
  subcategories: string[];
}

const CATEGORIES: AudioCategory[] = [
  {
    id: 'release',
    name: 'LEGA Release',
    icon: Flame,
    color: 'text-rose-400',
    bgColor: 'bg-rose-950/80 border-rose-800',
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
    subcategories: [
      'Mengurangi Overthinking',
      'Relaksasi Sebelum Tidur',
      'Menanangkan Pikiran',
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
    subcategories: [
      'Inner Child Reflection',
      'Membangun Kebiasaan Baru',
      'Persiapan Menghadapi Hari',
      'Meningkatkan Fokus',
      'Membangun Kepercayaan Diri'
    ]
  }
];

const DURATIONS = [1, 3, 5, 10, 15, 20, 30, 45, 60];

const VOICES = [
  { name: 'Kore', label: 'Kore (Lembut, Tenang & Mindful)', tone: 'Feminin Soft' },
  { name: 'Zephyr', label: 'Zephyr (Hangat & Jernih)', tone: 'Masculine Warm' },
  { name: 'Puck', label: 'Puck (Ramah & Menentramkan)', tone: 'Gentle Friend' },
  { name: 'Fenrir', label: 'Fenrir (Suara Dalam & Steady)', tone: 'Deep Grounded' },
  { name: 'Charon', label: 'Charon (Soothing Malam)', tone: 'Quiet Night' }
];

const EMOTIONS = ['Cemas', 'Marah', 'Sedih', 'Kecewa', 'Bersalah', 'Lelah', 'Netral'];

const PRESET_LIBRARY = [
  {
    id: 'pres-1',
    title: 'Napas Penghening Senja (LEGA Calm)',
    category: 'LEGA Calm',
    subcategory: 'Relaksasi Sebelum Tidur',
    duration: '5 Menit',
    desc: 'Audio panduan lembut untuk mengendurkan otot dan menenangkan pikiran sebelum istirahat malam.',
    sampleScript: 'Selamat malam. Ambil posisi yang paling nyaman di tempat tidur Anda. Tarik napas lembut... biarkan seluruh tubuh rileks. [Jeda 3 detik] Hari ini telah selesai, Anda tidak perlu membawa beban hari ini ke dalam tidur Anda.'
  },
  {
    id: 'pres-2',
    title: 'Grounding Pelepasan Kecemasan (LEGA Release)',
    category: 'LEGA Release',
    subcategory: 'Pelepasan Cemas',
    duration: '3 Menit',
    desc: 'Audio pereda rasa panik dan cemas singkat untuk mengembalikan rasa aman tubuh.',
    sampleScript: 'Mari berhenti sejenak. Rasakan pijakan kaki Anda di bumi. Napas Anda aman. Kecemasan ini adalah awan yang lewat di langit batin Anda. Anda bukan kecemasan itu, Anda adalah langitnya.'
  },
  {
    id: 'pres-3',
    title: 'Mengenal Nilai Hidup & Syukur (LEGA Reflection)',
    category: 'LEGA Reflection',
    subcategory: 'Syukur',
    duration: '10 Menit',
    desc: 'Panduan refleksi mendalam mengapresiasi perjalanan dan keberadaan diri Anda saat ini.',
    sampleScript: 'Luangkan waktu untuk menyapa diri sendiri. Apa satu hal kecil hari ini yang layak Anda beri senyuman terima kasih?'
  }
];

export const AudioPlayerView: React.FC<AudioPlayerViewProps> = ({
  onSelectModule,
  onOpenCrisis,
  userName = 'Sahabat LEGA'
}) => {
  // Configuration State
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

  // Audio Generation & Player State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedScriptData, setGeneratedScriptData] = useState<any | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  // Audio Engine & Playback Options
  const [playbackSource, setPlaybackSource] = useState<'gemini_tts' | 'web_speech' | 'ambient_music'>('gemini_tts');
  const [isTestingSound, setIsTestingSound] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync category change with default subcategory
  const handleCategoryChange = (cat: AudioCategory) => {
    setSelectedCategory(cat);
    setSelectedSubcategory(cat.subcategories[0]);
  };

  // Sound Test Helper (Tibetan Singing Bowl Bell)
  const handleTestAudioChime = async () => {
    setIsTestingSound(true);
    try {
      const chimeUrl = await generateMeditationAmbientWav(8);
      if (audioRef.current) {
        audioRef.current.src = chimeUrl;
        audioRef.current.volume = volume;
        audioRef.current.play().then(() => setIsPlaying(true));
      }
    } catch (err) {
      console.error('Test audio error:', err);
    } finally {
      setTimeout(() => setIsTestingSound(false), 2000);
    }
  };

  // Generate Personalized AI Audio & Script
  const handleGenerateAudio = async () => {
    setIsGenerating(true);
    stopIndonesianNarration();
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    try {
      // 1. Generate Personalized Audio Script via Gemini 3.6 Flash (Master Prompt 25)
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

      // 2. Synthesize Audio
      const ttsText = scriptData?.cleanScriptForTTS || scriptData?.script || 'Mari kita hening sejenak...';
      
      if (playbackSource === 'web_speech') {
        // Mode 1: Indonesian Web Speech Narration + 432Hz ambient bed
        const ambientUrl = await generateMeditationAmbientWav(durationMinutes * 60);
        setAudioUrl(ambientUrl);
        if (audioRef.current) {
          audioRef.current.src = ambientUrl;
          audioRef.current.volume = volume * 0.4;
          audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => console.log('Autoplay handled:', e));
        }
        speakIndonesianNarration(ttsText, {
          rate: speechSpeed === 'perlahan' ? 0.82 : speechSpeed === 'santai' ? 0.88 : 0.95,
          pitch: 0.95,
          onEnd: () => setIsPlaying(false),
          onError: () => setIsPlaying(false)
        });
      } else if (playbackSource === 'ambient_music') {
        // Mode 2: Pure 432Hz Soundscape
        const ambientUrl = await generateMeditationAmbientWav(durationMinutes * 60);
        setAudioUrl(ambientUrl);
        if (audioRef.current) {
          audioRef.current.src = ambientUrl;
          audioRef.current.volume = volume;
          audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => console.log('Autoplay handled:', e));
        }
      } else {
        // Mode 3: Gemini TTS with Fallback
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
          // Robust Fallback: Synthesize offline meditation music & speak
          finalUrl = await generateMeditationAmbientWav(durationMinutes * 60);
          speakIndonesianNarration(ttsText, {
            onEnd: () => setIsPlaying(false),
            onError: () => setIsPlaying(false)
          });
        }

        setAudioUrl(finalUrl);
        if (audioRef.current && finalUrl) {
          audioRef.current.src = finalUrl;
          audioRef.current.volume = volume;
          audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => {
            console.log('Autoplay deferred:', e);
            speakIndonesianNarration(ttsText, {
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
          'Bagaimana sensasi napas Anda setelah mendengarkan preset ini?',
          'Apakah ada ketegangan yang berhasil Anda biarkan melorot?'
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
        // Guaranteed Fallback: Ambient singing bowl + Indonesian narration
        url = await generateMeditationAmbientWav(180);
        speakIndonesianNarration(preset.sampleScript, {
          onEnd: () => setIsPlaying(false),
          onError: () => setIsPlaying(false)
        });
      }

      setAudioUrl(url);
      if (audioRef.current && url) {
        audioRef.current.src = url;
        audioRef.current.volume = volume;
        audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => {
          console.log('Autoplay deferred:', e);
          speakIndonesianNarration(preset.sampleScript, {
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

  // Toggle Play/Pause
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
            onEnd: () => setIsPlaying(false)
          });
        }
      });
      setIsPlaying(true);
    }
  };

  // Restart Audio
  const handleRestart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    audioRef.current.play().then(() => setIsPlaying(true));
  };

  // Seek time
  const handleSeek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // Volume Change
  const handleVolumeChange = (v: number) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    setIsMuted(v === 0);
  };

  // Toggle Mute
  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // Audio Event Listeners
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
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 text-stone-100">
      <audio ref={audioRef} />

      {/* Header Banner */}
      <div className="bg-stone-900/90 border border-stone-800 p-5 md:p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-950/80 border border-indigo-800 text-indigo-400 rounded-2xl">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-stone-100 flex items-center gap-2">
                LEGA AI Audio
                <span className="text-xs bg-indigo-900/80 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-700 font-mono">
                  v1.0
                </span>
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Audio panduan terpersonalisasi dengan Gemini TTS Bahasa Indonesia & Sintesis Script Dinamis
              </p>
            </div>
          </div>
        </div>

        {/* Non-Medical Disclaimer Banner */}
        <div className="p-3.5 bg-indigo-950/40 border border-indigo-800/60 rounded-2xl text-[11px] text-indigo-200 space-y-1.5 leading-relaxed">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong>Disclaimer Non-Medis:</strong> Audio LEGA AI BUKAN terapi, BUKAN pengobatan, dan BUKAN pengganti bantuan profesional kesehatan mental/medis. Audio dirancang sebagai pendamping mandiri untuk latihan kesadaran, relaksasi, dan penguraian beban emosi.
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Configuration & Generator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Generator Form (7 cols) */}
        <div className="lg:col-span-7 bg-stone-900/90 p-5 md:p-7 rounded-3xl border border-stone-800 space-y-5 shadow-xl">
          <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-sm text-stone-100">Personalisasi Audio Panduan LEGA</h3>
          </div>

          {/* 1. Category Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" /> Pilih Kategori Utamakan:
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
                        ? `${cat.bgColor} text-stone-100 font-bold ring-1 ring-indigo-500 shadow-md`
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
              Pilih Subkategori ({selectedCategory.name}):
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {selectedCategory.subcategories.map((sub, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                    selectedSubcategory === sub
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                      : 'bg-stone-950 border-stone-800 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Duration Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" /> Durasi Audio (Menit):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {DURATIONS.map((dur) => (
                <button
                  key={dur}
                  onClick={() => setDurationMinutes(dur)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                    durationMinutes === dur
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {dur} mnt
                </button>
              ))}
            </div>
          </div>

          {/* 4. Emotion, Intensity & Voice Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">Emosi Dominan Saat Ini:</label>
              <select
                value={emotionState}
                onChange={(e) => setEmotionState(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100 outline-none focus:border-indigo-500"
              >
                {EMOTIONS.map((emo, idx) => (
                  <option key={idx} value={emo}>{emo}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">Intensitas Emosi:</label>
              <select
                value={emotionIntensity}
                onChange={(e) => setEmotionIntensity(e.target.value as any)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100 outline-none focus:border-indigo-500"
              >
                <option value="Rendah">Rendah (Ringan)</option>
                <option value="Sedang">Sedang (Standar)</option>
                <option value="Tinggi">Tinggi (Kuat)</option>
                <option value="Sangat Tinggi">Sangat Tinggi (Intens / Krisis)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">Pilihan Suara Gemini TTS:</label>
              <select
                value={voiceName}
                onChange={(e) => setVoiceName(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100 outline-none focus:border-indigo-500"
              >
                {VOICES.map((v, idx) => (
                  <option key={idx} value={v.name}>{v.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">Level Pengalaman Pengguna:</label>
              <select
                value={userExperienceLevel}
                onChange={(e) => setUserExperienceLevel(e.target.value as any)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100 outline-none focus:border-indigo-500"
              >
                <option value="pemula">Pemula (Banyak Orientasi)</option>
                <option value="menengah">Menengah (Refleksi Seimbang)</option>
                <option value="lanjutan">Lanjutan (Jeda & Hening Panjang)</option>
              </select>
            </div>
          </div>

          {/* Mode Audio & Spiritual Mode Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">Mode Panduan Audio:</label>
              <select
                value={audioMode}
                onChange={(e) => setAudioMode(e.target.value as any)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100 outline-none focus:border-indigo-500"
              >
                <option value="guided">Guided (Instruksi Penuh)</option>
                <option value="gentle">Gentle (Instruksi Halus)</option>
                <option value="reflective">Reflective (Fokus Pertanyaan)</option>
                <option value="sleep">Sleep (Pengantar Tidur Lambat)</option>
                <option value="emergency_calming">Emergency Calming (Penstabilan Cepat)</option>
              </select>
            </div>

            <div className="space-y-1.5 flex flex-col justify-end">
              <button
                type="button"
                onClick={() => setSpiritualMode(!spiritualMode)}
                className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                  spiritualMode
                    ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300 ring-1 ring-emerald-500'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-emerald-400" />
                  <span>Nuansa Spiritual (Islami)</span>
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${spiritualMode ? 'bg-emerald-900 text-emerald-200' : 'bg-stone-900 text-stone-500'}`}>
                  {spiritualMode ? 'AKTIF' : 'NON-AKTIF'}
                </span>
              </button>
            </div>
          </div>

          {/* Custom Goal */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-300">Tujuan Kebutuhan Sesi Ini:</label>
            <input
              type="text"
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              placeholder="Contoh: Menenangkan dada yang sesak dan membantu fokus"
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Speed Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-300">Kecepatan Bicara Narasi:</label>
            <div className="flex gap-2">
              {(['perlahan', 'normal', 'santai'] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSpeechSpeed(spd)}
                  className={`flex-1 py-1.5 rounded-xl border text-xs font-medium capitalize transition ${
                    speechSpeed === spd
                      ? 'bg-indigo-950 border-indigo-500 text-indigo-300 font-bold'
                      : 'bg-stone-950 border-stone-800 text-stone-400'
                  }`}
                >
                  {spd}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateAudio}
            disabled={isGenerating}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-stone-800 text-white font-bold rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-indigo-950/60"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-200" />
                <span>Menghasilkan Audio Gemini TTS & Naskah...</span>
              </>
            ) : (
              <>
                <Radio className="w-4 h-4" />
                <span>Buat Audio Panduan Personalisasi LEGA</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Audio Player & Script Display (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Audio Player Card */}
          <div className="bg-stone-900/90 border border-stone-800 p-5 md:p-6 rounded-3xl space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-indigo-400" /> Player Audio LEGA AI
              </span>
              {isPlaying && (
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live Audio
                </span>
              )}
            </div>

            {/* Title & Metadata */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-stone-100">
                  {generatedScriptData?.title || `${selectedSubcategory} (${selectedCategory.name})`}
                </h4>
                <button
                  onClick={handleTestAudioChime}
                  disabled={isTestingSound}
                  className="px-2.5 py-1 bg-stone-950 hover:bg-stone-800 border border-stone-800 rounded-lg text-[10px] text-indigo-300 font-medium transition flex items-center gap-1.5"
                  title="Uji Speaker dengan Bel Meditasi Tibet"
                >
                  <Bell className={`w-3 h-3 ${isTestingSound ? 'animate-bounce text-amber-400' : 'text-indigo-400'}`} />
                  <span>{isTestingSound ? 'Memutar Bel...' : 'Uji Suara'}</span>
                </button>
              </div>
              <p className="text-xs text-stone-400 line-clamp-2">
                {generatedScriptData?.description || 'Klik tombol buat audio untuk mendengarkan panduan narasi khusus.'}
              </p>
            </div>

            {/* Audio Engine Selector */}
            <div className="bg-stone-950 p-2 rounded-xl border border-stone-800 space-y-1">
              <label className="text-[10px] font-semibold text-stone-400 flex items-center gap-1">
                <Music className="w-3 h-3 text-indigo-400" /> Sumber Suara Audio:
              </label>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => setPlaybackSource('gemini_tts')}
                  className={`py-1 px-1.5 rounded-lg text-[10px] font-medium transition text-center truncate ${
                    playbackSource === 'gemini_tts'
                      ? 'bg-indigo-950 border border-indigo-500 text-indigo-200 font-bold'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-300'
                  }`}
                >
                  Gemini TTS
                </button>
                <button
                  onClick={() => setPlaybackSource('web_speech')}
                  className={`py-1 px-1.5 rounded-lg text-[10px] font-medium transition text-center truncate ${
                    playbackSource === 'web_speech'
                      ? 'bg-indigo-950 border border-indigo-500 text-indigo-200 font-bold'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-300'
                  }`}
                >
                  Narasi Suara
                </button>
                <button
                  onClick={() => setPlaybackSource('ambient_music')}
                  className={`py-1 px-1.5 rounded-lg text-[10px] font-medium transition text-center truncate ${
                    playbackSource === 'ambient_music'
                      ? 'bg-indigo-950 border border-indigo-500 text-indigo-200 font-bold'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-300'
                  }`}
                >
                  Musik 432Hz
                </button>
              </div>
            </div>

            {/* Audio Waveform Animation Canvas / Pulsing Visualizer */}
            <div className="p-5 bg-stone-950 border border-stone-800 rounded-2xl flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
              <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-700 ${
                isPlaying
                  ? 'border-indigo-500 bg-indigo-950/60 shadow-2xl shadow-indigo-500/50 scale-105'
                  : 'border-stone-800 bg-stone-900'
              }`}>
                <Headphones className={`w-7 h-7 transition ${isPlaying ? 'text-indigo-400 animate-bounce' : 'text-stone-600'}`} />
              </div>

              {/* Animated Audio Bars */}
              <div className="flex items-center justify-center gap-1 h-7">
                {[40, 70, 30, 90, 50, 80, 40, 60, 30, 75].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: isPlaying ? `${Math.max(12, (h * (i % 2 === 0 ? 0.9 : 1.1)))}%` : '15%' }}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      isPlaying ? 'bg-indigo-400' : 'bg-stone-800'
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
                  className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-stone-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(totalDuration)}</span>
                </div>
              </div>
            </div>

            {/* Audio Controls Bar */}
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
                      : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-950/50'
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

              {/* Volume Slider */}
              <div className="flex items-center gap-2 text-xs text-stone-400 px-2">
                <Volume2 className="w-3.5 h-3.5 shrink-0" />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Generated Script Card */}
          {generatedScriptData && (
            <div className="bg-stone-900/90 border border-stone-800 p-5 rounded-3xl space-y-3 animate-fade-in text-xs">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <span className="font-bold text-stone-200 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-400" /> Naskah Narasi AI LEGA
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
                  <p className="font-bold text-stone-300 text-[11px]">Refleksi Setelah Mendengarkan:</p>
                  <ul className="space-y-1 text-stone-400">
                    {generatedScriptData.reflectiveQuestions.map((q: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
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

      {/* Preset Library Section */}
      <div className="space-y-3 pt-4 border-t border-stone-800">
        <h3 className="font-bold text-xs uppercase tracking-wider text-stone-400 flex items-center gap-2">
          <Headphones className="w-4 h-4 text-indigo-400" /> Koleksi Audio Pilihan Langsung Putar:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRESET_LIBRARY.map((preset) => (
            <div
              key={preset.id}
              className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3 hover:border-stone-700 transition flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-stone-950 text-indigo-300 px-2 py-0.5 rounded border border-stone-800 font-semibold">
                    {preset.category}
                  </span>
                  <span className="text-[10px] text-stone-400">{preset.duration}</span>
                </div>
                <h4 className="font-bold text-xs text-stone-100">{preset.title}</h4>
                <p className="text-[11px] text-stone-400 leading-relaxed line-clamp-2">{preset.desc}</p>
              </div>

              <button
                onClick={() => handlePlayPreset(preset)}
                className="w-full py-2 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-indigo-300 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5" /> Putar Preset
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-Module Integration Section */}
      <div className="p-5 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-3">
        <h4 className="font-bold text-xs text-stone-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" /> Terhubung dengan Seluruh Ekosistem Modul LEGA:
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'LEGA AI Coach', key: 'ai-coach' },
            { name: 'LEGA Emotion Analyzer', key: 'emotion-analysis' },
            { name: 'LEGA Release', key: 'emotional-release' },
            { name: 'LEGA Presence', key: 'mindfulness' },
            { name: 'LEGA Observer', key: 'lega-observer' },
            { name: 'LEGA Body Awareness', key: 'body-awareness' },
            { name: 'LEGA Breathing', key: 'breathing' },
            { name: 'LEGA Journal', key: 'journal' },
            { name: 'LEGA Insight', key: 'ai-insights' },
            { name: 'LEGA Progress', key: 'progress' }
          ].map((mod, idx) => (
            <button
              key={idx}
              onClick={() => onSelectModule && onSelectModule(mod.key)}
              className="px-3 py-1.5 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-indigo-300 rounded-xl text-xs font-medium transition flex items-center gap-1.5"
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
