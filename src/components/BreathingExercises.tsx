import React, { useState, useEffect, useRef } from 'react';
import {
  Wind,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  Clock,
  Heart,
  Layers,
  ArrowRight,
  Compass,
  AlertTriangle,
  HelpCircle,
  Activity,
  CheckCircle2,
  Smile,
  Zap,
  Info,
  RefreshCw,
  Mic,
  Bell,
  Check,
  UserCheck,
  HeartHandshake
} from 'lucide-react';
import { ModuleType } from '../types';
import { breathingReflect } from '../lib/geminiApi';
import { VoiceGuideButton } from './VoiceGuideButton';
import {
  speakIndonesianNarration,
  stopIndonesianNarration,
  playCalmMeditationChime
} from '../lib/audioEngine';

interface BreathingExercisesProps {
  onSelectModule?: (module: ModuleType | string) => void;
  onOpenCrisis?: () => void;
}

interface BreathVariation {
  id: string;
  name: string;
  desc: string;
  category: string;
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
}

const DURATIONS = [1, 3, 5, 10, 15, 20, 30];

const VARIATIONS: BreathVariation[] = [
  {
    id: 'natural',
    name: 'Kesadaran Napas Alami',
    desc: 'Mengamati irama alami napas tanpa memaksakan ritme atau kedalaman.',
    category: 'Dasar',
    inhale: 4,
    holdIn: 0,
    exhale: 4,
    holdOut: 0
  },
  {
    id: 'counting',
    name: 'Menghitung Napas',
    desc: 'Menghitung setiap hembusan napas 1–10 untuk mengembalikan fokus yang mengembara.',
    category: 'Fokus',
    inhale: 4,
    holdIn: 1,
    exhale: 4,
    holdOut: 1
  },
  {
    id: 'diaphragm',
    name: 'Napas Diafragma',
    desc: 'Mengalirkan udara lembut hingga perut mengembang untuk relaksasi tubuh.',
    category: 'Relaksasi',
    inhale: 4,
    holdIn: 2,
    exhale: 6,
    holdOut: 0
  },
  {
    id: 'slow',
    name: 'Napas Perlahan',
    desc: 'Memperlambat laju tarikan dan hembusan napas secara bertahap.',
    category: 'Ketenangan',
    inhale: 5,
    holdIn: 0,
    exhale: 5,
    holdOut: 0
  },
  {
    id: 'sleep',
    name: 'Napas Sebelum Tidur',
    desc: 'Pola 4-7-8 menenangkan sistem saraf otonom menjelang istirahat lelap.',
    category: 'Tidur',
    inhale: 4,
    holdIn: 7,
    exhale: 8,
    holdOut: 0
  },
  {
    id: 'work',
    name: 'Napas Saat Bekerja',
    desc: 'Micro-break 1–3 menit di sela aktivitas kerja untuk menyegarkan pikiran.',
    category: 'Produktivitas',
    inhale: 4,
    holdIn: 2,
    exhale: 4,
    holdOut: 2
  },
  {
    id: 'anxiety',
    name: 'Napas Saat Cemas',
    desc: 'Memperpanjang hembusan napas untuk mengaktifkan respons penenang alami.',
    category: 'Penenang Emosi',
    inhale: 3,
    holdIn: 0,
    exhale: 6,
    holdOut: 0
  },
  {
    id: 'anger',
    name: 'Napas Saat Marah',
    desc: 'Jeda pengamatan lebih panjang untuk meredakan gejolak emosi dan impulsif.',
    category: 'Penenang Emosi',
    inhale: 4,
    holdIn: 4,
    exhale: 6,
    holdOut: 2
  },
  {
    id: 'speaking',
    name: 'Napas Sebelum Berbicara',
    desc: 'Menenangkan pita suara dan getaran dada sebelum presentasi atau bicarakan hal penting.',
    category: 'Kesiapan',
    inhale: 4,
    holdIn: 2,
    exhale: 4,
    holdOut: 0
  },
  {
    id: 'decision',
    name: 'Napas Sebelum Mengambil Keputusan',
    desc: 'Menjadi titik balik jeda sebelum merespon situasi secara bijak.',
    category: 'Kesiapan',
    inhale: 4,
    holdIn: 4,
    exhale: 4,
    holdOut: 4
  }
];

const ALUR_STEPS = [
  {
    title: '1. Berhenti Sejenak',
    subtitle: 'Menyudahi Ketergesaan',
    prompt: 'Hentikan sejenak segala rutinitas. Duduk atau berdiri dengan posisi yang nyaman, berikan izin pada diri Anda untuk hadir di sini saat ini.',
    tip: 'Lepaskan beban aktivitas beberapa saat. Tidak ada yang perlu diselesaikan dalam beberapa menit ke depan.'
  },
  {
    title: '2. Sadari Posisi Tubuh',
    subtitle: 'Menopang Diri dengan Rileks',
    prompt: 'Rasakan titik kontak tubuh Anda dengan tempat duduk atau lantai. Biarkan bahu Anda melunak perlahan dan rahang mengendur.',
    tip: 'Tegakkan punggung tanpa kaku, biarkan bahu turun menjauhi telinga, letakkan telapak tangan santai di pangkuan.'
  },
  {
    title: '3. Perhatikan Napas Masuk',
    subtitle: 'Mengamati Udara Sejuk',
    prompt: 'Bawa perhatian Anda ke ujung hidung atau rongga dada. Rasakan sensasi udara sejuk yang mengalir masuk secara alami tanpa perlu dipaksakan.',
    tip: 'Cukup amati alirannya. Jangan memaksakan napas panjang jika belum nyaman.'
  },
  {
    title: '4. Perhatikan Napas Keluar',
    subtitle: 'Melepaskan Ketegangan',
    prompt: 'Rasakan udara hangat yang perlahan berhembus keluar. Biarkan setiap embusan membawa serta sisa-sisa ketegangan dari otot tubuh Anda.',
    tip: 'Bayangkan beban pikiran ikut mengalir keluar bersama hembusan napas yang lembut.'
  },
  {
    title: '5. Rasakan Gerakan Dada & Perut',
    subtitle: 'Harmoni Diafragma',
    prompt: 'Amati kembang kempisnya dada dan perut mengikuti irama napas yang mengalir alami seperti ombak laut yang tenang.',
    tip: 'Napas diafragma yang santai mengirimkan sinyal rasa aman ke sistem saraf pusat Anda.'
  },
  {
    title: '6. Kembalikan Perhatian Perlahan',
    subtitle: 'Pikiran Mengembara Itu Wajar',
    prompt: 'Jika pikiran mengembara ke masa lalu atau masa depan, itu sangat manusiawi. Sadari tanpa menghakimi, lalu dengan lembut bawa kembali perhatian ke napas.',
    tip: 'Setiap kali Anda menyadari pikiran teralihkan dan kembali ke napas, itu adalah momen keberhasilan kesadaran.'
  },
  {
    title: '7. Latihan Siklus Napas (Visualizer)',
    subtitle: 'Irama Napas Terpandu',
    prompt: 'Gunakan lingkaran visualisasi pernapasan di bawah ini untuk memandu tarikan, tahanan, dan hembusan napas sesuai variasi yang Anda pilih.',
    tip: 'Ikuti lingkaran napas, dengarkan suara pemandu atau bel harmonik untuk memandu ritme Anda.'
  },
  {
    title: '8. Refleksi & Pemaknaan AI',
    subtitle: 'Integrasi dan Ulasan',
    prompt: 'Selesai latihan. Amati bagaimana kondisi tubuh dan batin Anda terasa saat ini, lalu catat refleksi singkat untuk dianalisis oleh LEGA AI.',
    tip: 'Dapatkan wawasan terpersonalisasi untuk mendukung regulasi emosi jangka panjang Anda.'
  }
];

export const BreathingExercises: React.FC<BreathingExercisesProps> = ({
  onSelectModule,
  onOpenCrisis
}) => {
  const [activeTab, setActiveTab] = useState<'guided' | 'variations' | 'reflection'>('guided');

  // Selected State
  const [selectedVariation, setSelectedVariation] = useState<BreathVariation>(VARIATIONS[0]);
  const [selectedDuration, setSelectedDuration] = useState<number>(3); // minutes
  const [userEmotionState, setUserEmotionState] = useState<string>('Netral');

  // Respiratory Condition Alert
  const [hasRespiratoryIssue, setHasRespiratoryIssue] = useState<boolean>(false);

  // Guided Flow Step (0 to 7)
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Step Section Scroll Ref
  const stepContainerRef = useRef<HTMLDivElement>(null);

  // Timer & Breath Engine
  const [isActive, setIsActive] = useState<boolean>(false);
  const [phase, setPhase] = useState<'Inhale' | 'HoldIn' | 'Exhale' | 'HoldOut'>('Inhale');
  const [countdown, setCountdown] = useState<number>(VARIATIONS[0].inhale);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  // Sound & Voice Mode
  type SoundMode = 'voice' | 'bell' | 'mute';
  const [soundMode, setSoundMode] = useState<SoundMode>('voice');

  // Reflective Questions State
  const [breathSensationBefore, setBreathSensationBefore] = useState<string>('Dangkal / Tegang');
  const [breathSensationAfter, setBreathSensationAfter] = useState<string>('Lebih Halus / Teratur');
  const [awarenessNoticed, setAwarenessNoticed] = useState<string>('');
  const [bodyStateChange, setBodyStateChange] = useState<string>('');

  // AI Output State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [aiReflectOutput, setAiReflectOutput] = useState<any | null>(null);

  const totalSecondsTarget = selectedDuration * 60;

  const goToStep = (stepIndex: number) => {
    stopIndonesianNarration();
    if (stepIndex >= 8) {
      setActiveTab('reflection');
    } else {
      setCurrentStep(stepIndex);
      if (activeTab !== 'guided') {
        setActiveTab('guided');
      }
    }
    setTimeout(() => {
      stepContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // Sound & Voice Narration Trigger
  const playPhaseAudioAndNarration = (targetPhase: 'Inhale' | 'HoldIn' | 'Exhale' | 'HoldOut') => {
    if (soundMode === 'mute') return;

    // 1. Play serene harmonic bell / chime
    if (targetPhase === 'Inhale') {
      playCalmMeditationChime('inhale');
    } else if (targetPhase === 'Exhale') {
      playCalmMeditationChime('exhale');
    } else {
      playCalmMeditationChime('hold');
    }

    // 2. Speak voice guide if mode is 'voice'
    if (soundMode === 'voice') {
      let textToSpeak = '';
      if (targetPhase === 'Inhale') {
        textToSpeak = 'Tarik napas perlahan...';
      } else if (targetPhase === 'HoldIn') {
        textToSpeak = 'Tahan napas...';
      } else if (targetPhase === 'Exhale') {
        textToSpeak = 'Hembuskan perlahan lewat mulut...';
      } else if (targetPhase === 'HoldOut') {
        textToSpeak = 'Tahan sejenak...';
      }
      if (textToSpeak) {
        speakIndonesianNarration(textToSpeak, { rate: 0.9, pitch: 0.95 });
      }
    }
  };

  const handleTestVoiceGuide = () => {
    playCalmMeditationChime('bowl');
    speakIndonesianNarration('Tes suara pemandu pernapasan. Tarik napas perlahan, rasakan tubuh rileks, dan hembuskan dengan lembut.', {
      rate: 0.88,
      pitch: 0.95
    });
  };

  useEffect(() => {
    stopIndonesianNarration();
    setIsActive(false);
    setPhase('Inhale');
    setCountdown(selectedVariation.inhale);
    setElapsedSeconds(0);
  }, [selectedVariation, selectedDuration]);

  // Breathing Loop Timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isActive) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev >= totalSecondsTarget) {
            setIsActive(false);
            if (soundMode !== 'mute') {
              playCalmMeditationChime('bowl');
              if (soundMode === 'voice') {
                speakIndonesianNarration('Latihan pernapasan telah selesai. Amati ketenangan dan kelegaan di dalam tubuh Anda.');
              }
            }
            return totalSecondsTarget;
          }
          return prev + 1;
        });

        setCountdown((prevCount) => {
          if (prevCount > 1) {
            return prevCount - 1;
          } else {
            // Switch Phase
            if (phase === 'Inhale') {
              if (selectedVariation.holdIn > 0) {
                setPhase('HoldIn');
                playPhaseAudioAndNarration('HoldIn');
                return selectedVariation.holdIn;
              } else {
                setPhase('Exhale');
                playPhaseAudioAndNarration('Exhale');
                return selectedVariation.exhale;
              }
            } else if (phase === 'HoldIn') {
              setPhase('Exhale');
              playPhaseAudioAndNarration('Exhale');
              return selectedVariation.exhale;
            } else if (phase === 'Exhale') {
              if (selectedVariation.holdOut > 0) {
                setPhase('HoldOut');
                playPhaseAudioAndNarration('HoldOut');
                return selectedVariation.holdOut;
              } else {
                setPhase('Inhale');
                playPhaseAudioAndNarration('Inhale');
                return selectedVariation.inhale;
              }
            } else {
              setPhase('Inhale');
              playPhaseAudioAndNarration('Inhale');
              return selectedVariation.inhale;
            }
          }
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, phase, countdown, selectedVariation, totalSecondsTarget, soundMode]);

  const toggleTimer = () => {
    if (!isActive) {
      playPhaseAudioAndNarration(phase);
      setIsActive(true);
    } else {
      stopIndonesianNarration();
      setIsActive(false);
    }
  };

  const resetTimer = () => {
    stopIndonesianNarration();
    setIsActive(false);
    setPhase('Inhale');
    setCountdown(selectedVariation.inhale);
    setElapsedSeconds(0);
  };

  const handleGenerateReflection = async () => {
    setIsProcessing(true);
    const result = await breathingReflect({
      durationMinutes: selectedDuration,
      variationId: selectedVariation.id,
      variationName: selectedVariation.name,
      userEmotionState,
      breathSensationBefore,
      breathSensationAfter,
      userReflections: `${awarenessNoticed} | Kondisi tubuh: ${bodyStateChange}`,
      hasRespiratoryIssue
    });
    setAiReflectOutput(result);
    setIsProcessing(false);
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'Inhale':
        return 'Tarik Napas Pelan-pelan';
      case 'HoldIn':
        return 'Tahan Napas Nyaman';
      case 'Exhale':
        return 'Hembuskan Lewat Mulut';
      case 'HoldOut':
        return 'Tahan Dalam Keheningan';
    }
  };

  const getCircleStyle = () => {
    if (!isActive) return 'scale-100 opacity-70 bg-stone-900 border-stone-700';
    switch (phase) {
      case 'Inhale':
        return 'scale-125 opacity-100 bg-emerald-500/20 border-emerald-400 shadow-2xl shadow-emerald-500/30';
      case 'HoldIn':
        return 'scale-125 opacity-90 bg-teal-500/20 border-teal-400 shadow-xl shadow-teal-500/20';
      case 'Exhale':
        return 'scale-90 opacity-70 bg-sky-500/10 border-sky-400 shadow-md shadow-sky-500/10';
      case 'HoldOut':
        return 'scale-90 opacity-50 bg-stone-800/30 border-stone-600';
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 text-stone-100">
      {/* Header Banner */}
      <div className="bg-stone-900/90 border border-stone-800 p-5 md:p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-2xl">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-stone-100 flex items-center gap-2">
                LEGA Breathing
                <span className="text-xs bg-emerald-900/80 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-700 font-mono">
                  v1.0
                </span>
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Menggunakan napas sebagai jangkar perhatian & titik kembali ke momen saat ini
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <VoiceGuideButton
              text="Selamat datang di modul LEGA Breathing. Napas adalah jembatan antara pikiran dan tubuh Anda. Bernapaslah secara alami tanpa memaksakan ritme, rasakan udara masuk dan keluar, serta izinkan sistem saraf Anda rileks dengan aman."
              title="Panduan LEGA Breathing"
              subtitle="Latihan Pernapasan Berkesadaran"
              variant="pill"
            />
            {/* Nav Mode Tabs */}
            <div className="flex bg-stone-950 border border-stone-800 rounded-2xl p-1 gap-1 text-xs">
            <button
              onClick={() => setActiveTab('guided')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'guided'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Alur Latihan (8 Step)</span>
            </button>
            <button
              onClick={() => setActiveTab('variations')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'variations'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>10 Variasi Napas</span>
            </button>
            <button
              onClick={() => setActiveTab('reflection')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'reflection'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Refleksi AI</span>
            </button>
          </div>
        </div>
      </div>

        {/* Non-Medical Disclaimer & Respiratory Guard */}
        <div className="p-3.5 bg-amber-950/40 border border-amber-800/60 rounded-2xl text-[11px] text-amber-200 space-y-2 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300">Pernyataan Penting:</span> LEGA Breathing adalah latihan kesadaran diri (breath awareness), BUKAN terapi, pengobatan, atau pengganti penanganan medis.
            </div>
          </div>

          <div className="pt-2 border-t border-amber-900/50 flex flex-wrap items-center justify-between gap-2">
            <label className="flex items-center gap-2 cursor-pointer text-amber-200">
              <input
                type="checkbox"
                checked={hasRespiratoryIssue}
                onChange={(e) => setHasRespiratoryIssue(e.target.checked)}
                className="accent-amber-500 rounded"
              />
              <span>Saya memiliki kondisi pernapasan (seperti Asma, PPOK, atau sesak napas)</span>
            </label>
            {hasRespiratoryIssue && (
              <span className="text-[10px] text-amber-300 italic">
                *Jangan memaksakan latihan. Jika terasa tidak nyaman, kembalilah ke pola napas normal.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mode 1: Guided 8-Step Alur Latihan */}
      {activeTab === 'guided' && (
        <div className="bg-stone-900/90 border border-stone-800 p-6 md:p-8 rounded-3xl space-y-6 animate-fade-in">
          {/* Config Bar: Duration & Emotional State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 border-b border-stone-800 pb-4 text-xs">
            {/* Duration Selector */}
            <div className="space-y-1">
              <span className="font-bold text-stone-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Durasi Latihan:
              </span>
              <div className="flex flex-wrap gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800">
                {DURATIONS.map((dur) => (
                  <button
                    key={dur}
                    onClick={() => setSelectedDuration(dur)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition ${
                      selectedDuration === dur
                        ? 'bg-emerald-600 text-white'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {dur}m
                  </button>
                ))}
              </div>
            </div>

            {/* Emotion State Adaptive */}
            <div className="space-y-1">
              <span className="font-bold text-stone-300 flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-emerald-400" /> Kondisi Emosi Saat Ini:
              </span>
              <select
                value={userEmotionState}
                onChange={(e) => setUserEmotionState(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-stone-200 outline-none focus:border-emerald-500"
              >
                <option value="Netral">Netral / Tenang</option>
                <option value="Cemas">Cemas / Gelisah (Penenang Alami)</option>
                <option value="Marah">Marah / Kesal (Perpanjang Jeda)</option>
                <option value="Sedih">Sedih / Hampa (Tempo Lembut)</option>
                <option value="Lelah">Lelah / Kehabisan Energi (Latihan Singkat)</option>
              </select>
            </div>

            {/* Selected Preset Name */}
            <div className="space-y-1 flex flex-col justify-center">
              <span className="text-[10px] text-stone-400 uppercase font-bold">Variasi Napas Aktif</span>
              <span className="font-bold text-emerald-300 text-xs">{selectedVariation.name}</span>
            </div>
          </div>

          {/* Adaptive Tip Banner */}
          {userEmotionState === 'Cemas' && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Panduan Cemas:</strong> Fokus mengamati napas alami tanpa paksaan. Biarkan hembusan napas mengalir santai.
              </span>
            </div>
          )}
          {userEmotionState === 'Marah' && (
            <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-xs text-amber-200 flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Panduan Marah:</strong> Perpanjang jeda pengamatan pada sensasi napas untuk meredakan dorongan impulsif.
              </span>
            </div>
          )}

          {/* 8-Step Interactive Progress Bar */}
          <div ref={stepContainerRef} className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4" /> Alur 8 Langkah: Langkah {currentStep + 1} dari 8
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-stone-400">
                  {Math.round(((currentStep + 1) / 8) * 100)}% Selesai
                </span>
                <button
                  onClick={() => goToStep(0)}
                  className="text-stone-400 hover:text-stone-200 flex items-center gap-1 text-[11px] transition bg-stone-900 border border-stone-800 px-2 py-0.5 rounded-lg"
                  title="Kembali ke Langkah 1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>
            </div>

            {/* Step Pills Navigation */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {ALUR_STEPS.map((stepItem, sIdx) => {
                const isCurrent = currentStep === sIdx;
                const isPassed = currentStep > sIdx;
                return (
                  <button
                    key={sIdx}
                    onClick={() => goToStep(sIdx)}
                    className={`py-2 px-1 rounded-xl text-[11px] font-medium transition flex flex-col items-center justify-center gap-0.5 border ${
                      isCurrent
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-2 ring-emerald-500/30'
                        : isPassed
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60'
                        : 'bg-stone-900/80 text-stone-400 border-stone-800 hover:bg-stone-800 hover:text-stone-200'
                    }`}
                    title={stepItem.title}
                  >
                    <div className="flex items-center gap-1">
                      {isPassed ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <span className="text-[10px] opacity-75">#{sIdx + 1}</span>
                      )}
                    </div>
                    <span className="truncate max-w-[65px] text-[10px] hidden sm:inline">
                      {stepItem.title.replace(/^\d+\.\s*/, '')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Step Active Card */}
          <div className="p-5 md:p-6 bg-stone-950/90 border border-emerald-900/40 rounded-2xl space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-850 pb-3">
              <div className="space-y-0.5">
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Langkah {currentStep + 1} dari 8
                </span>
                <h4 className="text-base md:text-lg font-bold text-stone-100">
                  {ALUR_STEPS[currentStep].title}
                </h4>
                <p className="text-xs text-stone-400">
                  {ALUR_STEPS[currentStep].subtitle}
                </p>
              </div>

              {/* Voice Guide Button for this Step */}
              <VoiceGuideButton
                text={ALUR_STEPS[currentStep].prompt}
                title={ALUR_STEPS[currentStep].title}
                subtitle="Instruksi Napas Berkesadaran"
                variant="compact"
              />
            </div>

            {/* Instruction Quote */}
            <div className="p-4 bg-stone-900/90 border border-stone-800 rounded-xl space-y-2">
              <p className="text-sm md:text-base text-stone-100 font-medium leading-relaxed italic">
                "{ALUR_STEPS[currentStep].prompt}"
              </p>
              <div className="flex items-center gap-2 text-xs text-stone-400 pt-1">
                <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>Tips:</strong> {ALUR_STEPS[currentStep].tip}</span>
              </div>
            </div>

            {/* Interactive Step-specific helpers for Steps 1-6 */}
            {currentStep === 0 && (
              <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs text-emerald-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Smile className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Luangkan 10-15 detik untuk hening sepenuhnya sebelum melanjutkan.</span>
                </div>
                <button
                  onClick={() => goToStep(1)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold shrink-0 transition"
                >
                  Saya Siap &rarr;
                </button>
              </div>
            )}

            {currentStep === 1 && (
              <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs text-emerald-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Rasakan tumpuan kaki di lantai dan rilekskan ketegangan leher/pundak.</span>
                </div>
                <button
                  onClick={() => goToStep(2)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold shrink-0 transition"
                >
                  Posisi Rileks &rarr;
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs text-emerald-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Rasakan aliran udara sejuk masuk perlahan melalui hidung.</span>
                </div>
                <button
                  onClick={() => goToStep(3)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold shrink-0 transition"
                >
                  Napas Masuk Terasakan &rarr;
                </button>
              </div>
            )}

            {currentStep === 3 && (
              <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs text-emerald-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Hembuskan perlahan, biarkan rasa tegang mengalir keluar.</span>
                </div>
                <button
                  onClick={() => goToStep(4)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold shrink-0 transition"
                >
                  Hembusan Terasakan &rarr;
                </button>
              </div>
            )}

            {currentStep === 4 && (
              <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs text-emerald-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Amati gerakan naik-turun rongga dada dan perut secara wajar.</span>
                </div>
                <button
                  onClick={() => goToStep(5)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold shrink-0 transition"
                >
                  Irama Terasakan &rarr;
                </button>
              </div>
            )}

            {currentStep === 5 && (
              <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs text-emerald-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Bawa kembali perhatian dengan ramah setiap kali ada distraksi.</span>
                </div>
                <button
                  onClick={() => goToStep(6)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold shrink-0 transition"
                >
                  Menuju Latihan Napas (Visualizer) &rarr;
                </button>
              </div>
            )}
          </div>

          {/* Interactive Breathing Visualizer (Prominently featured in Step 7 and accessible anytime) */}
          <div className="bg-stone-950/90 p-6 md:p-10 rounded-3xl border border-stone-800 text-center space-y-6 relative overflow-hidden shadow-2xl">
            <div className="flex flex-wrap justify-between items-center gap-3 text-xs text-stone-400 border-b border-stone-850 pb-4">
              <div className="flex items-center gap-2 text-left">
                <Wind className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-semibold text-stone-200">
                    {selectedVariation.name} ({selectedVariation.category})
                  </div>
                  <div className="text-[11px] text-stone-400">
                    {selectedVariation.desc}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Mode Suara Selector */}
                <div className="flex bg-stone-900 border border-stone-800 rounded-xl p-1 gap-1 text-[11px]">
                  <button
                    onClick={() => setSoundMode('voice')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1.5 ${
                      soundMode === 'voice'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                    title="Narasi Suara Pemandu Bahasa Indonesia + Bel Harmonik"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Suara Pemandu</span>
                  </button>
                  <button
                    onClick={() => setSoundMode('bell')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1.5 ${
                      soundMode === 'bell'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                    title="Hanya Denting Bel Lonceng Meditatif"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Bel Saja</span>
                  </button>
                  <button
                    onClick={() => setSoundMode('mute')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1.5 ${
                      soundMode === 'mute'
                        ? 'bg-stone-700 text-white'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                    title="Hening tanpa suara"
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Hening</span>
                  </button>
                </div>

                <button
                  onClick={handleTestVoiceGuide}
                  className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-xl text-[11px] text-emerald-300 font-medium transition flex items-center gap-1.5"
                  title="Dengarkan contoh suara pemandu pernapasan"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Tes Suara</span>
                </button>

                <span className="font-mono bg-stone-900 border border-stone-800 px-2.5 py-1 rounded-xl text-stone-300 text-[11px]">
                  {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, '0')} / {selectedDuration}:00
                </span>
              </div>
            </div>

            {/* Animated Circle Container */}
            <div className="relative py-6 flex flex-col items-center justify-center gap-3">
              <div
                className={`w-44 h-44 sm:w-56 sm:h-56 rounded-full border-4 transition-all duration-1000 flex flex-col items-center justify-center gap-2 ${getCircleStyle()}`}
              >
                <span className="text-3xl sm:text-5xl font-extrabold text-stone-100 font-mono">
                  {countdown}
                </span>
                <span className="text-xs sm:text-sm font-medium text-stone-300 max-w-[150px]">
                  {getPhaseText()}
                </span>
              </div>

              {/* Spoken Narration Live Status Pill */}
              {isActive && soundMode === 'voice' && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/80 border border-emerald-700/60 rounded-full text-xs text-emerald-300 animate-pulse">
                  <Mic className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Narasi Pemandu: "{getPhaseText()}"</span>
                </div>
              )}
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={toggleTimer}
                className={`px-8 py-3.5 rounded-2xl font-semibold text-sm transition flex items-center gap-2 shadow-lg ${
                  isActive
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950/40'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
                }`}
              >
                {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isActive ? 'Jeda Latihan' : 'Mulai Latihan Napas'}</span>
              </button>

              <button
                onClick={resetTimer}
                className="p-3.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-2xl border border-stone-700 transition"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Step Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-800">
            <button
              onClick={() => goToStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 disabled:opacity-40 disabled:hover:bg-stone-800 text-stone-200 rounded-xl text-xs font-semibold transition cursor-pointer disabled:cursor-not-allowed"
            >
              &larr; Langkah Sebelumnya
            </button>

            <button
              onClick={() => {
                if (currentStep >= 7) {
                  goToStep(8);
                } else {
                  goToStep(currentStep + 1);
                }
              }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-lg shadow-emerald-950/30 cursor-pointer"
            >
              <span>{currentStep >= 7 ? 'Lanjut ke Refleksi & Ulasan AI' : `Lanjut ke Langkah ${currentStep + 2}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mode 2: 10 Variasi Latihan Napas */}
      {activeTab === 'variations' && (
        <div className="bg-stone-900/90 border border-stone-800 p-6 rounded-3xl space-y-6 animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>10 Variasi Latihan Kesadaran Napas</span>
            </h3>
            <p className="text-xs text-stone-400">
              Pilih teknik yang sesuai dengan kebutuhan batin Anda saat ini:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {VARIATIONS.map((varItem) => {
              const isSelected = selectedVariation.id === varItem.id;
              return (
                <button
                  key={varItem.id}
                  onClick={() => {
                    setSelectedVariation(varItem);
                    setActiveTab('guided');
                  }}
                  className={`p-4 rounded-2xl border text-left transition space-y-2 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-stone-900 text-emerald-400 px-2 py-0.5 rounded border border-stone-800 font-semibold">
                        {varItem.category}
                      </span>
                      {isSelected && <span className="text-xs text-emerald-400 font-bold">✓ Aktif</span>}
                    </div>
                    <h4 className="font-bold text-xs text-stone-100">{varItem.name}</h4>
                    <p className="text-[11px] text-stone-400 leading-relaxed">{varItem.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-stone-900 flex justify-between text-[10px] text-stone-500 font-mono">
                    <span>Tarik: {varItem.inhale}s</span>
                    <span>Tahan: {varItem.holdIn}s</span>
                    <span>Hembus: {varItem.exhale}s</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 3: Refleksi AI & Output Modul */}
      {activeTab === 'reflection' && (
        <div className="bg-stone-900/90 border border-stone-800 p-6 md:p-8 rounded-3xl space-y-6 animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Pertanyaan Reflektif & Sintesis LEGA AI</span>
            </h3>
            <p className="text-xs text-stone-400">
              Refleksikan perubahan yang Anda rasakan setelah latihan napas:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <label className="font-semibold text-stone-300">
                1. Bagaimana napas Anda terasa SEBELUM latihan?
              </label>
              <select
                value={breathSensationBefore}
                onChange={(e) => setBreathSensationBefore(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 outline-none focus:border-emerald-500"
              >
                <option value="Dangkal / Tegang">Dangkal & Tegang di Dada</option>
                <option value="Cepat / Tersendat">Cepat & Tersendat</option>
                <option value="Berat / Sesak">Berat & Kurang Nyaman</option>
                <option value="Netral">Netral</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-stone-300">
                2. Bagaimana napas Anda terasa SESUDAH latihan?
              </label>
              <select
                value={breathSensationAfter}
                onChange={(e) => setBreathSensationAfter(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 outline-none focus:border-emerald-500"
              >
                <option value="Lebih Halus / Teratur">Lebih Halus & Teratur</option>
                <option value="Dalam & Nyaman">Dalam & Terasa Nyaman</option>
                <option value="Relatif Sama">Relatif Sama (Tidak Apa-apa)</option>
                <option value="Lebih Rileks">Sistem Saraf Lebih Rileks</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-stone-300">
                3. Apa yang Anda sadari selama memperhatikan napas?
              </label>
              <input
                type="text"
                value={awarenessNoticed}
                onChange={(e) => setAwarenessNoticed(e.target.value)}
                placeholder="Contoh: Pikiran sempat mengembara ke kerjaan, lalu kembali ke napas..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-stone-300">
                4. Bagaimana kondisi tubuh Anda sekarang dibanding sebelum latihan?
              </label>
              <input
                type="text"
                value={bodyStateChange}
                onChange={(e) => setBodyStateChange(e.target.value)}
                placeholder="Contoh: Bahu terasa lebih turun, pikiran tidak terlalu tegang..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={handleGenerateReflection}
              disabled={isProcessing}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs sm:text-sm transition inline-flex items-center gap-2 shadow-xl shadow-emerald-950/50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sintesis Refleksi Napas...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generasi Output Latihan LEGA Breathing</span>
                </>
              )}
            </button>
          </div>

          {/* AI Output Card */}
          {aiReflectOutput && (
            <div className="p-6 bg-stone-950 border border-stone-800 rounded-2xl space-y-5 animate-fade-in text-left">
              <div className="space-y-2 border-b border-stone-800 pb-3">
                <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Ringkasan Latihan Kesadaran Napas
                </p>
                <p className="text-xs text-stone-200 leading-relaxed">
                  {aiReflectOutput.breathingSummary}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl space-y-1">
                  <p className="text-stone-400 text-[10px] uppercase font-bold">Pengamatan Irama Napas</p>
                  <p className="font-bold text-emerald-300">{aiReflectOutput.breathStateObservation}</p>
                </div>
                <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl space-y-1">
                  <p className="text-stone-400 text-[10px] uppercase font-bold">Respon Ketenangan Somatis</p>
                  <p className="font-bold text-emerald-300">{aiReflectOutput.somaticCalmnessNote}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-emerald-400" /> Napas Sebagai Jangkar Perhatian
                </p>
                <p className="text-xs text-stone-300 italic leading-relaxed bg-emerald-950/20 p-4 rounded-xl border border-emerald-900/40">
                  "{aiReflectOutput.mindfulAnchorInsight}"
                </p>
              </div>

              {/* Connected Next Modules */}
              <div className="pt-3 border-t border-stone-800 space-y-3">
                <p className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-400" /> Rekomendasi Latihan Terhubung berikutnya:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {aiReflectOutput.recommendedNextModules && Array.isArray(aiReflectOutput.recommendedNextModules) ? (
                    aiReflectOutput.recommendedNextModules.map((mod: any, idx: number) => (
                      <div key={idx} className="p-3 bg-stone-900 border border-stone-800 rounded-xl space-y-1 text-left">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-emerald-300">{mod.moduleName}</span>
                          <button
                            onClick={() => onSelectModule && onSelectModule(mod.targetModuleKey || 'body-awareness')}
                            className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] rounded font-semibold transition"
                          >
                            Buka
                          </button>
                        </div>
                        <p className="text-[10px] text-stone-400 line-clamp-2">{mod.reason}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <button
                        onClick={() => onSelectModule && onSelectModule('body-awareness')}
                        className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-left hover:border-emerald-700 transition"
                      >
                        <p className="font-bold text-xs text-emerald-300">LEGA Body Awareness</p>
                        <p className="text-[10px] text-stone-400 mt-0.5">Pindai kesadaran tubuh</p>
                      </button>
                      <button
                        onClick={() => onSelectModule && onSelectModule('mindfulness')}
                        className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-left hover:border-emerald-700 transition"
                      >
                        <p className="font-bold text-xs text-emerald-300">LEGA Presence</p>
                        <p className="text-[10px] text-stone-400 mt-0.5">Kehadiran di momen kini</p>
                      </button>
                      <button
                        onClick={() => onSelectModule && onSelectModule('ai-coach')}
                        className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-left hover:border-emerald-700 transition"
                      >
                        <p className="font-bold text-xs text-emerald-300">LEGA AI Coach</p>
                        <p className="text-[10px] text-stone-400 mt-0.5">Konsultasikan bersama AI</p>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
