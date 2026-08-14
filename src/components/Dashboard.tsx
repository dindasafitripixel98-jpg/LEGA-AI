import React, { useState, useEffect } from 'react';
import {
  Bot,
  Wind,
  BookOpen,
  Flame,
  BrainCircuit,
  Compass,
  ArrowRight,
  Smile,
  Frown,
  Meh,
  Zap,
  Sparkles,
  HeartPulse,
  Clock,
  ShieldCheck,
  RefreshCw,
  Moon,
  Volume2,
  CheckCircle2,
  Activity,
  Layers,
  Play,
  HelpCircle,
  AlertTriangle,
  Sun,
  Sunrise,
  Sunset,
  Smartphone,
  Download
} from 'lucide-react';
import { EmotionCategory, EmotionLog, JournalEntry, ModuleType, UserProfile } from '../types';
import { getDashboardSummary, generateVoiceAudio } from '../lib/geminiApi';
import { pcmToWavBlobUrl, speakIndonesianNarration, generateMeditationAmbientWav, stopIndonesianNarration } from '../lib/audioEngine';
import { VoiceGuideButton } from './VoiceGuideButton';

interface DashboardProps {
  userProfile: UserProfile;
  emotionLogs: EmotionLog[];
  journals: JournalEntry[];
  onSelectModule: (module: ModuleType) => void;
  onQuickLogMood: (emotion: EmotionCategory, intensity: number) => void;
  onOpenPwaModal?: () => void;
}

const MOOD_OPTIONS: { category: EmotionCategory; label: string; icon: any; color: string }[] = [
  { category: 'tenang', label: 'Tenang', icon: Smile, color: 'emerald' },
  { category: 'bersyukur', label: 'Bersyukur', icon: Sparkles, color: 'teal' },
  { category: 'cemas', label: 'Cemas', icon: Zap, color: 'amber' },
  { category: 'sedih', label: 'Sedih', icon: Frown, color: 'sky' },
  { category: 'marah', label: 'Marah', icon: Flame, color: 'rose' },
  { category: 'lelah', label: 'Lelah', icon: Meh, color: 'indigo' },
];

const ONBOARDING_GOALS = [
  'Mengenal Diri',
  'Mengelola Emosi',
  'Mengurangi Overthinking',
  'Mengelola Stres',
  'Mengatasi Kecemasan',
  'Membangun Kesadaran',
  'Life Purpose',
  'Refleksi Spiritual'
];

export const Dashboard: React.FC<DashboardProps> = ({
  userProfile,
  emotionLogs,
  journals,
  onSelectModule,
  onQuickLogMood,
  onOpenPwaModal,
}) => {
  const [selectedQuickMood, setSelectedQuickMood] = useState<EmotionCategory | null>(null);
  const [moodLoggedSuccess, setMoodLoggedSuccess] = useState(false);
  const [selectedBodyState, setSelectedBodyState] = useState<string>('Napas teratur');
  const [spiritualMode, setSpiritualMode] = useState<boolean>(false);
  const [userGoals, setUserGoals] = useState<string[]>(['Mengenal Diri', 'Mengelola Emosi']);
  
  // Dashboard AI State
  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Time of Day Detection
  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 16) return 'afternoon';
    if (hour >= 16 && hour < 19) return 'evening';
    return 'night';
  };

  const timeOfDay = getTimeOfDay();

  const getTimeIcon = () => {
    switch (timeOfDay) {
      case 'morning':
        return <Sunrise className="w-5 h-5 text-amber-400" />;
      case 'afternoon':
        return <Sun className="w-5 h-5 text-amber-300" />;
      case 'evening':
        return <Sunset className="w-5 h-5 text-rose-400" />;
      case 'night':
      default:
        return <Moon className="w-5 h-5 text-indigo-400" />;
    }
  };

  // Fetch Dashboard AI Summary from Backend
  const handleFetchDashboardSummary = async () => {
    setIsLoadingSummary(true);
    try {
      const summary = await getDashboardSummary({
        userName: userProfile.name,
        timeOfDay,
        recentEmotionLogs: emotionLogs,
        recentJournals: journals,
        userProfile,
        userGoals,
        spiritualMode,
      });
      setDashboardData(summary);
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  useEffect(() => {
    handleFetchDashboardSummary();
  }, [spiritualMode]);

  const handleQuickCheckIn = (cat: EmotionCategory) => {
    setSelectedQuickMood(cat);
    onQuickLogMood(cat, 6);
    setMoodLoggedSuccess(true);
    setTimeout(() => setMoodLoggedSuccess(false), 3000);
  };

  const handleToggleGoal = (goal: string) => {
    if (userGoals.includes(goal)) {
      setUserGoals(userGoals.filter((g) => g !== goal));
    } else {
      setUserGoals([...userGoals, goal]);
    }
  };

  const handlePlayAudioRecommendation = async () => {
    const script = dashboardData?.recommendedAudio?.scriptText || 'Mari kita hening sejenak, rasakan napas yang mengalir lembut ke dalam tubuh.';
    if (isPlayingAudio) {
      if (audioElement) {
        audioElement.pause();
      }
      stopIndonesianNarration();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    try {
      const audioUrl = await generateVoiceAudio(script, 'Kore');
      let finalAudioUrl = audioUrl;

      if (!finalAudioUrl) {
        // Fallback: Generate soothing ambient soundscape and speak script
        finalAudioUrl = await generateMeditationAmbientWav(60);
        speakIndonesianNarration(script, {
          onEnd: () => setIsPlayingAudio(false),
          onError: () => setIsPlayingAudio(false)
        });
      } else if (!finalAudioUrl.startsWith('data:audio/') && !finalAudioUrl.startsWith('blob:') && !finalAudioUrl.startsWith('http')) {
        finalAudioUrl = pcmToWavBlobUrl(finalAudioUrl);
      }

      if (finalAudioUrl) {
        const audio = new Audio(finalAudioUrl);
        setAudioElement(audio);
        audio.play().catch((e) => {
          console.log('Autoplay handled:', e);
          speakIndonesianNarration(script, {
            onEnd: () => setIsPlayingAudio(false)
          });
        });
        audio.onended = () => setIsPlayingAudio(false);
      } else {
        speakIndonesianNarration(script, {
          onEnd: () => setIsPlayingAudio(false)
        });
      }
    } catch (err) {
      console.error('Audio play error:', err);
      speakIndonesianNarration(script, {
        onEnd: () => setIsPlayingAudio(false)
      });
    }
  };

  const latestLog = emotionLogs[0];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto text-stone-100">
      {/* 1. Header & Time-Aware Greeting Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-stone-900 via-stone-900 to-emerald-950/80 p-6 md:p-8 rounded-3xl border border-stone-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-stone-800 border border-stone-700">
                {getTimeIcon()}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                LEGA Dashboard AI v2.0
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              {dashboardData?.greeting ||
                `Selamat ${
                  timeOfDay === 'morning'
                    ? 'pagi'
                    : timeOfDay === 'afternoon'
                    ? 'siang'
                    : timeOfDay === 'evening'
                    ? 'sore'
                    : 'malam'
                }, ${userProfile.name}.`}
            </h1>
            <p className="text-stone-300 text-xs md:text-sm max-w-2xl leading-relaxed">
              Ruang pribadimu untuk berhenti sejenak, memahami apa yang sedang terjadi, dan memilih
              langkah kecil berikutnya dengan tenang.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <VoiceGuideButton
              text={`Selamat datang di LEGA. ${dashboardData?.reflectionPrompt || 'Ruang pribadimu untuk berhenti sejenak, menenangkan sistem saraf, dan mendengarkan apa yang sedang terjadi di dalam diri dengan penuh kelembutan.'}`}
              title="Sapaan Suara Harian"
              subtitle="Refleksi Singkat Hari Ini"
              variant="pill"
            />

            {/* Spiritual Mode Toggle */}
            <button
              onClick={() => setSpiritualMode(!spiritualMode)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition flex items-center gap-1.5 ${
                spiritualMode
                  ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                  : 'bg-stone-800 border-stone-700 text-stone-300 hover:text-white'
              }`}
            >
              <Moon className="w-4 h-4 text-amber-400" />
              <span>{spiritualMode ? 'Mode Spiritual Aktif' : 'Aktifkan Mode Spiritual'}</span>
            </button>

            {/* Refresh AI Insights */}
            <button
              onClick={handleFetchDashboardSummary}
              disabled={isLoadingSummary}
              className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl border border-stone-700 transition disabled:opacity-50"
              title="Perbarui AI Summary"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-400 ${isLoadingSummary ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="pt-2 flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onSelectModule('ai-coach')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-900/40"
          >
            <Bot className="w-4 h-4" />
            <span>Ngobrol dengan LEGA AI</span>
          </button>
          <button
            onClick={() => onSelectModule('mindfulness')}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium rounded-xl text-xs border border-stone-700 transition flex items-center gap-2"
          >
            <Wind className="w-4 h-4 text-emerald-400" />
            <span>LEGA Presence 3 Menit</span>
          </button>
          <button
            onClick={() => onSelectModule('breathing')}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium rounded-xl text-xs border border-stone-700 transition flex items-center gap-2"
          >
            <Activity className="w-4 h-4 text-teal-400" />
            <span>LEGA Breathing</span>
          </button>
          {onOpenPwaModal && (
            <button
              onClick={onOpenPwaModal}
              className="px-3.5 py-2 bg-stone-900/90 hover:bg-stone-800 text-emerald-300 font-medium rounded-xl text-xs border border-emerald-800/40 transition flex items-center gap-1.5 ml-auto"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mode PWA</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Current State Overview Card */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
          <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider">Mood</span>
          <p className="text-sm font-bold text-stone-200">
            {dashboardData?.currentState?.mood || 'Baik'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
          <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider">Emosi Utamamu</span>
          <p className="text-sm font-bold text-emerald-400">
            {latestLog?.emotion?.toUpperCase() || dashboardData?.currentState?.dominantEmotion || 'Tenang'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
          <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider">Energi</span>
          <p className="text-sm font-bold text-amber-400">
            {dashboardData?.currentState?.energyLevel || 'Sedang'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
          <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider">Kondisi Tubuh</span>
          <p className="text-sm font-bold text-stone-300 truncate">
            {selectedBodyState}
          </p>
        </div>

        <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
          <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider">Status Refleksi</span>
          <p className="text-sm font-bold text-teal-400">
            {latestLog ? 'Sudah Check-In' : 'Belum Check-In'}
          </p>
        </div>
      </div>

      {/* 3. Today's Interactive Quick Check-In Widget */}
      <div className="bg-stone-900/90 p-5 rounded-2xl border border-stone-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm md:text-base font-bold text-stone-100 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-emerald-400" />
              <span>Bagaimana Keadaanmu Saat Ini?</span>
            </h3>
            <p className="text-xs text-stone-400">
              Pilih emosi & rasa di tubuhmu untuk check-in kehadiran hari ini.
            </p>
          </div>

          {moodLoggedSuccess && (
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3 py-1 rounded-full animate-fade-in flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Emosi Dicatat!
            </span>
          )}
        </div>

        {/* Emotion Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {MOOD_OPTIONS.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedQuickMood === item.category;
            return (
              <button
                key={item.category}
                onClick={() => handleQuickCheckIn(item.category)}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500'
                    : 'bg-stone-800/80 hover:bg-stone-800 border-stone-700/80 text-stone-300'
                }`}
              >
                <Icon className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-medium capitalize">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body State Quick Select */}
        <div className="pt-2 border-t border-stone-800/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-stone-400 font-medium">Sensasi Tubuh:</span>
          {['Napas teratur', 'Pundak tegang', 'Dada sesak', 'Kepala berat', 'Tubuh rileks'].map((state) => (
            <button
              key={state}
              onClick={() => setSelectedBodyState(state)}
              className={`px-2.5 py-1 rounded-lg border transition ${
                selectedBodyState === state
                  ? 'bg-teal-950 border-teal-500 text-teal-300'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {state}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Primary Recommended Action & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary Action Card */}
        <div className="lg:col-span-1 p-5 rounded-2xl bg-gradient-to-br from-stone-900 to-emerald-950/60 border border-emerald-500/30 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
              Satu Langkah Kecil Hari Ini
            </span>
            <h3 className="text-lg font-bold text-white">
              {dashboardData?.primaryRecommendation?.title || 'LEGA Presence 3 Menit'}
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              {dashboardData?.primaryRecommendation?.goal ||
                'Jeda sejenak untuk meletakkan beban pikiran dan kembali hadir utuh di sini.'}
            </p>
          </div>

          <button
            onClick={() =>
              onSelectModule(
                (dashboardData?.primaryRecommendation?.moduleKey as ModuleType) || 'mindfulness'
              )
            }
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
          >
            <span>{dashboardData?.primaryRecommendation?.actionLabel || 'Mulai Latihan'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* AI Insights Card */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>AI Insight Refleksi Hari Ini</span>
            </h3>
            <span className="text-[10px] text-stone-500">
              {timeOfDay === 'morning' ? 'Refleksi Pagi' : 'Refleksi Harian'}
            </span>
          </div>

          <div className="space-y-3 text-xs leading-relaxed">
            {dashboardData?.aiInsights?.map((insight: any, idx: number) => (
              <div key={idx} className="p-3 rounded-xl bg-stone-950/80 border border-stone-800/80 text-stone-300 flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                <p>{insight.text}</p>
              </div>
            )) || (
              <p className="text-stone-400 italic">
                Lakukan 1 kali check-in emosi untuk menghasilkan insight refleksi personal dari AI.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 5. Recommended Practices Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-stone-200 flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>Latihan Hari Ini yang Direkomendasikan</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(dashboardData?.recommendedPractices || [
            {
              title: 'LEGA Presence',
              moduleKey: 'mindfulness',
              duration: '3 Menit',
              goal: 'Latihan hadir penuh tanpa menghakimi.',
              description: 'Jangkar kesadaran saat pikiran mulai memikirkan masa depan.'
            },
            {
              title: 'LEGA Breathing',
              moduleKey: 'breathing',
              duration: '4 Menit',
              goal: 'Relaksasi sistem saraf melalui nafas teratur.',
              description: 'Napas ritmis 4-7-8 untuk menenangkan ketegangan.'
            },
            {
              title: 'LEGA Observer',
              moduleKey: 'emotion-analysis',
              duration: '5 Menit',
              goal: 'Mengamati emosi tanpa terlarut.',
              description: 'Melihat emosi mengalir tanpa perlu hanyut.'
            }
          ]).map((prac: any, idx: number) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-3 flex flex-col justify-between hover:border-emerald-500/40 transition"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-100">{prac.title}</span>
                  <span className="px-2 py-0.5 rounded-full bg-stone-800 text-[10px] text-stone-400 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    {prac.duration}
                  </span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">{prac.description || prac.goal}</p>
              </div>

              <button
                onClick={() => onSelectModule((prac.moduleKey as ModuleType) || 'mindfulness')}
                className="w-full py-2 bg-stone-800 hover:bg-emerald-600 text-stone-200 hover:text-white font-medium rounded-xl text-xs transition flex items-center justify-center gap-1.5"
              >
                <span>Mulai</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Audio Recommendation & Streak Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audio Card */}
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20 flex items-center gap-1">
                <Volume2 className="w-3 h-3" /> Audio Refleksi LEGA
              </span>
              <span className="text-xs text-stone-400 font-medium">
                {dashboardData?.recommendedAudio?.duration || '5 Menit'}
              </span>
            </div>

            <h4 className="text-sm font-bold text-stone-100">
              {dashboardData?.recommendedAudio?.title || 'Hadir Saat Ini — Panduan Relaksasi'}
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              {dashboardData?.recommendedAudio?.purpose ||
                'Suara panduan narasi lembut untuk mengalirkan ketenangan pada tubuh dan pikiran.'}
            </p>
          </div>

          <button
            onClick={handlePlayAudioRecommendation}
            className="w-full py-2.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-200 font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2"
          >
            <Play className={`w-4 h-4 text-indigo-400 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
            <span>{isPlayingAudio ? 'Mendengarkan Audio...' : 'Putar Audio Panduan'}</span>
          </button>
        </div>

        {/* Progress & Streak Card */}
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>🔥 {userProfile.streakDays || 1} Hari Refleksi</span>
              </span>
              <button
                onClick={() => onSelectModule('progress')}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
              >
                Lihat Progress <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              {dashboardData?.progressSummary?.consistencyText ||
                `Anda telah menjaga konsistensi refleksi selama ${userProfile.streakDays} hari berturut-turut.`}
            </p>
            <p className="text-[11px] text-stone-500 italic">
              "Ingat, streak bukan paksaan. Jika Anda sempat jeda, Anda dapat mulai kembali kapan saja tanpa rasa bersalah."
            </p>
          </div>

          <div className="pt-2 border-t border-stone-800 text-xs text-stone-400 flex items-center justify-between">
            <span>Refleksi Harian:</span>
            <span className="font-semibold text-emerald-400">
              {latestLog ? 'Sudah Selesai' : 'Belum Dimulai'}
            </span>
          </div>
        </div>
      </div>

      {/* 7. Weekly Insight & Article Recommendation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Insight */}
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-400" />
              <span>Weekly Insight Pola Emosi</span>
            </h4>
            <span className="text-[10px] text-stone-500">Minggu Ini</span>
          </div>

          <div className="space-y-2 text-xs">
            <p className="text-stone-300">
              <strong className="text-white">Pola Terlihat:</strong>{' '}
              {dashboardData?.weeklyInsight?.observedPattern ||
                'Minggu ini Anda cukup sering mencatat ketegangan di jam kerja.'}
            </p>
            <p className="text-stone-400">
              <strong className="text-stone-300">Saran Minggu Depan:</strong>{' '}
              {dashboardData?.weeklyInsight?.recommendationForNextWeek ||
                'Selipkan jeda napas 3 menit di sela-sela aktivitas produktif.'}
            </p>
          </div>
        </div>

        {/* Article / Learning Recommendation */}
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20 flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Artikel Refleksi
              </span>
              <span className="text-[10px] text-stone-500">
                {dashboardData?.articleRecommendation?.readTime || '3 Menit Baca'}
              </span>
            </div>

            <h4 className="text-sm font-bold text-stone-100">
              {dashboardData?.articleRecommendation?.title || 'Memahami Hubungan Stres dan Ketegangan Tubuh'}
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">
              {dashboardData?.articleRecommendation?.summary ||
                'Mengapa emosi beresonansi dalam sensasi fisik dan bagaimana mengalirkan kembali ketenangan.'}
            </p>
          </div>

          <button
            onClick={() => onSelectModule('articles')}
            className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-sky-300 font-medium rounded-xl text-xs transition flex items-center justify-center gap-1.5"
          >
            <span>Baca Artikel</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 8. Daily Journal Prompt Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-900 to-indigo-950/60 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Pertanyaan Refleksi Hari Ini</span>
          </span>
          <h4 className="text-sm font-bold text-white">
            "{dashboardData?.journalPrompt?.question || 'Apa satu hal kecil yang paling Anda butuhkan untuk merasa aman dan tenang hari ini?'}"
          </h4>
        </div>

        <button
          onClick={() => onSelectModule('journal')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition shrink-0 flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50"
        >
          <span>{dashboardData?.journalPrompt?.actionLabel || 'Tulis Sekarang'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 9. Quick Actions Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Quick Actions Menu</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {[
            { label: 'Check-In', module: 'emotion-analysis', icon: BrainCircuit, color: 'text-emerald-400' },
            { label: 'LEGA AI', module: 'ai-coach', icon: Bot, color: 'text-teal-400' },
            { label: 'Release', module: 'breathing', icon: Wind, color: 'text-amber-400' },
            { label: 'Presence', module: 'mindfulness', icon: Compass, color: 'text-indigo-400' },
            { label: 'Breathing', module: 'breathing', icon: Activity, color: 'text-sky-400' },
            { label: 'Journal', module: 'journal', icon: BookOpen, color: 'text-rose-400' },
            { label: 'Audio', module: 'audio', icon: Volume2, color: 'text-teal-300' },
            { label: 'Insight', module: 'progress', icon: Sparkles, color: 'text-amber-300' },
          ].map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={() => onSelectModule(action.module as ModuleType)}
                className="p-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 transition text-center flex flex-col items-center gap-1.5"
              >
                <Icon className={`w-4 h-4 ${action.color}`} />
                <span className="text-[11px] font-medium text-stone-300">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 10. First-Time Onboarding / Goal Selector */}
      <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800/80 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>Fokus Utama Refleksimu</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {ONBOARDING_GOALS.map((goal) => {
            const isSelected = userGoals.includes(goal);
            return (
              <button
                key={goal}
                onClick={() => handleToggleGoal(goal)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                  isSelected
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-stone-800/60 border-stone-700/60 text-stone-400 hover:text-stone-200'
                }`}
              >
                {goal}
              </button>
            );
          })}
        </div>
      </div>

      {/* 11. Developer Footer & Crisis Safety Disclaimer */}
      <div className="space-y-2 text-center text-[11px] text-stone-500">
        <p className="leading-relaxed">
          LEGA Dashboard AI v3.0 Final &bull; Developer: <strong className="text-stone-400">SHAQILA DIGITAL 99</strong> &bull; Ruang pribadi mandiri untuk hadir, menyadari, dan bertumbuh dengan tenang.
        </p>
        <p className="text-[10px] text-stone-600">
          LEGA Dashboard AI bukan pengganti layanan konseling medis atau diagnosis klinis. Dalam krisis emosional berat, harap hubungi profesional kesehatan terdekat.
        </p>
      </div>
    </div>
  );
};
