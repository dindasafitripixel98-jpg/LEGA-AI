import React, { useState, useEffect } from 'react';
import {
  Activity,
  Eye,
  Hand,
  Volume2,
  Wind,
  Smile,
  Cloud,
  Send,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Compass,
  Info,
  Clock,
  Heart,
  MessageSquare,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Layers,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { ModuleType } from '../types';
import { presenceReflect } from '../lib/geminiApi';

interface MindfulnessExercisesProps {
  onSelectModule?: (module: ModuleType | string) => void;
  onOpenCrisis?: () => void;
}

const DURATION_OPTIONS = [1, 3, 5, 10, 15, 20, 30];

const USER_STATES = [
  { id: 'netral', label: 'Biasa / Netral', desc: 'Latihan keberadaan standar' },
  { id: 'cemas', label: 'Sedang Cemas', desc: 'Latihan lebih singkat, fokus napas & tubuh' },
  { id: 'marah', label: 'Sedang Marah / Kesal', desc: 'Fokus ekstra pada sensasi fisik & pijakan' },
  { id: 'sedih', label: 'Sedang Sedih', desc: 'Tempo lebih lambat dengan lebih banyak jeda' },
  { id: 'lelah', label: 'Sedang Lelah', desc: 'Latihan sederhana & tidak menuntut' },
];

const PRESENCE_STEPS = [
  { title: '1. Berhenti Sejenak', prompt: 'Mari berhenti sejenak. Hentikan dulu apa pun yang sedang Anda lakukan.' },
  { title: '2. Sadari Posisi Tubuh', prompt: 'Rasakan posisi tubuh Anda saat ini. Perhatikan titik-titik sentuhan tubuh dengan kursi atau lantai.' },
  { title: '3. Sadari Napas', prompt: 'Perhatikan napas yang masuk dan keluar. Tidak perlu mengubah napas, cukup menyadarinya.' },
  { title: '4. Sadari Suara Sekitar', prompt: 'Perhatikan suara di sekitar Anda, baik yang dekat maupun yang jauh. Biarkan suara hadir tanpa dinilai.' },
  { title: '5. Sadari Sentuhan Tubuh', prompt: 'Perhatikan suhu udara yang menyentuh kulit dan sensasi pakaian yang menempel di tubuh.' },
  { title: '6. Sadari Emosi', prompt: 'Jika muncul emosi, cukup akui kehadirannya. Cukup beri ruang tanpa mengusirnya.' },
  { title: '7. Sadari Pikiran', prompt: 'Jika muncul pikiran, sadari bahwa pikiran sedang hadir. Tidak perlu melawannya, tidak perlu mengikutinya.' },
  { title: '8. Kembalikan Perhatian', prompt: 'Jika perhatian mengembara, kembalikan perlahan ke napas atau sensasi tubuh dengan lembut.' },
  { title: '9. Refleksi Kehadiran', prompt: 'Selesai. Refleksikan tingkat kehadiran yang Anda rasakan saat ini.' },
];

export const MindfulnessExercises: React.FC<MindfulnessExercisesProps> = ({
  onSelectModule,
  onOpenCrisis,
}) => {
  const [activeTab, setActiveTab] = useState<'presence-session' | 'grounding' | 'thought-clouds'>('presence-session');

  // LEGA Presence State
  const [durationMinutes, setDurationMinutes] = useState<number>(3);
  const [userState, setUserState] = useState<string>('netral');
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(180);

  // Wandering Mind Anchor Message
  const [anchorMessage, setAnchorMessage] = useState<string | null>(null);

  // Reflection State
  const [presenceRating, setPresenceRating] = useState<number>(7);
  const [identifiedEmotion, setIdentifiedEmotion] = useState<string>('Tenang / Mengamati');
  const [reflectionNotes, setReflectionNotes] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [presenceOutput, setPresenceOutput] = useState<any | null>(null);

  // Grounding 5-4-3-2-1 State
  const [groundingStep, setGroundingStep] = useState<number>(0);
  const groundingSteps = [
    { title: '5 Hal yang Dilihat', icon: Eye, desc: 'Amati 5 benda di sekitarmu. Perhatikan warna, bayangan, atau bentuknya tanpa menghakimi.' },
    { title: '4 Sensasi yang Disentuh', icon: Hand, desc: 'Rasakan 4 tekstur fisik: pijakan kaki di lantai, sentuhan baju di kulit, atau dinginnya meja.' },
    { title: '3 Suara yang Didengar', icon: Volume2, desc: 'Dengarkan 3 suara terdekat maupun jauh: deru kipas, detak jam, atau desir angin.' },
    { title: '2 Aroma yang Dihirup', icon: Wind, desc: 'Hirup 2 aroma di udara sekitarmu. Tarik napas lembut.' },
    { title: '1 Rasa yang Dirasakan', icon: Smile, desc: 'Rasakan 1 sensasi di mulutmu atau bersyukurlah untuk kehadiranmu saat ini.' },
  ];

  // Cloud Thought Observer State
  const [cloudThought, setCloudThought] = useState('');
  const [floatingThoughts, setFloatingThoughts] = useState<{ id: string; text: string }[]>([]);

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timeLeftSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setCurrentStepIdx(8); // Jump to step 9 (Reflection)
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeftSeconds]);

  const handleStartSession = () => {
    setTimeLeftSeconds(durationMinutes * 60);
    setCurrentStepIdx(0);
    setIsTimerRunning(true);
    setAnchorMessage(null);
    setPresenceOutput(null);
  };

  const handlePauseResumeTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeftSeconds(durationMinutes * 60);
    setCurrentStepIdx(0);
    setAnchorMessage(null);
  };

  const handleSelectWanderingPast = () => {
    setAnchorMessage(
      'Saya menyadari perhatian Anda sedang tertuju pada pengalaman di masa lalu. Jika Anda bersedia, mari perlahan kembali memperhatikan apa yang sedang Anda alami saat ini.'
    );
  };

  const handleSelectWanderingFuture = () => {
    setAnchorMessage(
      'Rasa khawatir terhadap masa depan dapat muncul. Untuk beberapa saat, mari kembali memperhatikan napas, tubuh, dan pengalaman yang sedang berlangsung sekarang.'
    );
  };

  const handleSelectWanderingEmotion = () => {
    setAnchorMessage(
      'Jika muncul emosi berat, cukup akui kehadirannya. Cukup amati tanpa perlu langsung menolak atau mengusirnya.'
    );
  };

  const handleCompleteReflection = async () => {
    setIsProcessing(true);
    const result = await presenceReflect({
      durationMinutes,
      userState,
      identifiedEmotion,
      presenceRating,
      userReflectionNotes: reflectionNotes,
    });
    setPresenceOutput(result);
    setIsProcessing(false);
  };

  const handleAddCloudThought = () => {
    if (!cloudThought.trim()) return;
    const newThought = { id: `thought-${Date.now()}`, text: cloudThought.trim() };
    setFloatingThoughts((prev) => [...prev, newThought]);
    setCloudThought('');
  };

  const handleRemoveThought = (id: string) => {
    setFloatingThoughts((prev) => prev.filter((t) => t.id !== id));
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 text-stone-100">
      {/* Module Header Banner */}
      <div className="bg-stone-900/90 border border-stone-800 p-5 md:p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-950/80 border border-teal-800 text-teal-400 rounded-2xl">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-stone-100 flex items-center gap-2">
                LEGA Presence
                <span className="text-xs bg-teal-900/80 text-teal-300 px-2.5 py-0.5 rounded-full border border-teal-700 font-mono">
                  v1.0
                </span>
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Latihan Melatih Perhatian Penuh Terhadap Pengalaman Saat Ini
              </p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex bg-stone-950 border border-stone-800 rounded-2xl p-1 gap-1 text-xs">
            <button
              onClick={() => setActiveTab('presence-session')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'presence-session'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Sesi LEGA Presence 9-Tahap</span>
            </button>
            <button
              onClick={() => setActiveTab('grounding')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'grounding'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Grounding 5-4-3-2-1</span>
            </button>
            <button
              onClick={() => setActiveTab('thought-clouds')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'thought-clouds'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Langit Kesadaran</span>
            </button>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="p-3 bg-stone-950/80 border border-stone-800/80 rounded-2xl text-[11px] text-stone-400 flex items-start gap-2 leading-relaxed">
          <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-stone-200 font-semibold">Prinsip Utama:</span> LEGA Presence <span className="italic text-stone-300">bukan meditasi untuk mencapai kondisi tertentu dan bukan teknik mengosongkan pikiran</span>. Ini adalah latihan mengembalikan perhatian dengan lembut ketika pikiran mengembara. <span className="text-teal-300 font-medium">"Tidak ada latihan yang gagal."</span>
          </div>
        </div>
      </div>

      {/* Mode 1: Sesi Terpandu LEGA Presence 9-Tahap */}
      {activeTab === 'presence-session' && (
        <div className="space-y-6">
          {/* Setup Panel: Duration & Mood Selection */}
          {!isTimerRunning && currentStepIdx === 0 && (
            <div className="bg-stone-900/90 border border-stone-800 p-6 md:p-8 rounded-3xl space-y-6 animate-fade-in">
              <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-400" />
                <span>Pengaturan Latihan Kesadaran Saat Ini</span>
              </h3>

              {/* Duration Options */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-300">
                  Pilih Durasi Latihan:
                </label>
                <div className="flex flex-wrap gap-2">
                  {DURATION_OPTIONS.map((dur) => (
                    <button
                      key={dur}
                      onClick={() => {
                        setDurationMinutes(dur);
                        setTimeLeftSeconds(dur * 60);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                        durationMinutes === dur
                          ? 'bg-teal-600 border-teal-500 text-white shadow-md'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      {dur} Menit
                    </button>
                  ))}
                </div>
              </div>

              {/* User State Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-300">
                  Kondisi Batin Anda Saat Ini (Penyesuaian Otomatis):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {USER_STATES.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setUserState(st.id)}
                      className={`p-3 rounded-2xl border text-xs text-left transition ${
                        userState === st.id
                          ? 'bg-teal-950 border-teal-500 text-teal-200 ring-1 ring-teal-500 font-semibold'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <p className="font-bold text-stone-200">{st.label}</p>
                      <p className="text-[10px] text-stone-400 mt-1">{st.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleStartSession}
                  className="px-8 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-2xl text-sm transition inline-flex items-center gap-2.5 shadow-xl shadow-teal-950/50"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Mulai Latihan LEGA Presence ({durationMinutes} Menit)</span>
                </button>
              </div>
            </div>
          )}

          {/* Active Session Display */}
          {(isTimerRunning || (currentStepIdx > 0 && currentStepIdx < 8)) && (
            <div className="bg-stone-900/90 border border-stone-800 p-6 md:p-8 rounded-3xl space-y-6 text-center animate-fade-in">
              {/* Top Timer Bar */}
              <div className="flex items-center justify-between text-xs border-b border-stone-800 pb-4">
                <span className="font-semibold text-teal-400 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 animate-spin-slow" /> Tahap {currentStepIdx + 1}/9: {PRESENCE_STEPS[currentStepIdx].title}
                </span>
                <span className="font-mono text-xl font-bold text-stone-100 bg-stone-950 px-3 py-1 rounded-xl border border-stone-800">
                  {formatTime(timeLeftSeconds)}
                </span>
              </div>

              {/* Step Prompt Card */}
              <div className="py-8 space-y-4 max-w-xl mx-auto">
                <div className="w-20 h-20 rounded-full bg-teal-950/60 border border-teal-800 text-teal-300 flex items-center justify-center mx-auto animate-pulse shadow-inner">
                  <Wind className="w-10 h-10" />
                </div>

                <h3 className="text-lg md:text-xl font-bold text-stone-100">
                  {PRESENCE_STEPS[currentStepIdx].title}
                </h3>

                <p className="text-sm md:text-base text-stone-200 leading-relaxed font-medium bg-stone-950/80 p-5 rounded-2xl border border-stone-800/80">
                  "{PRESENCE_STEPS[currentStepIdx].prompt}"
                </p>
              </div>

              {/* Wandering Mind Support Anchor Controls */}
              <div className="p-4 bg-stone-950/90 border border-stone-800 rounded-2xl space-y-3 text-left max-w-xl mx-auto">
                <p className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Jika Perhatian Mengembara (Sentuh Untuk Bimbingan):
                </p>

                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={handleSelectWanderingPast}
                    className="px-3 py-1.5 bg-stone-900 border border-stone-800 hover:border-amber-600 text-stone-300 rounded-xl transition"
                  >
                    Pikiran ke Masa Lalu
                  </button>
                  <button
                    onClick={handleSelectWanderingFuture}
                    className="px-3 py-1.5 bg-stone-900 border border-stone-800 hover:border-amber-600 text-stone-300 rounded-xl transition"
                  >
                    Khawatir Masa Depan
                  </button>
                  <button
                    onClick={handleSelectWanderingEmotion}
                    className="px-3 py-1.5 bg-stone-900 border border-stone-800 hover:border-amber-600 text-stone-300 rounded-xl transition"
                  >
                    Emosi Berat Muncul
                  </button>
                </div>

                {anchorMessage && (
                  <div className="p-3 bg-amber-950/80 border border-amber-800/80 text-amber-200 text-xs rounded-xl italic leading-relaxed animate-fade-in">
                    "{anchorMessage}"
                  </div>
                )}
              </div>

              {/* Step & Timer Controls */}
              <div className="flex items-center justify-between pt-2 max-w-xl mx-auto">
                <button
                  onClick={() => setCurrentStepIdx((prev) => Math.max(0, prev - 1))}
                  disabled={currentStepIdx === 0}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-300 rounded-xl text-xs font-medium transition"
                >
                  Sebelumnya
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePauseResumeTimer}
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-medium transition flex items-center gap-1.5"
                  >
                    {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isTimerRunning ? 'Jeda' : 'Lanjut'}</span>
                  </button>
                  <button
                    onClick={handleResetTimer}
                    className="px-3 py-2 bg-stone-950 hover:bg-stone-800 text-stone-400 rounded-xl text-xs transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (currentStepIdx < 8) {
                      setCurrentStepIdx((prev) => prev + 1);
                    } else {
                      setIsTimerRunning(false);
                    }
                  }}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <span>{currentStepIdx === 7 ? 'Selesaikan' : 'Lanjut Step'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Reflection Step (Step 9 Output) */}
          {currentStepIdx === 8 && !isTimerRunning && (
            <div className="bg-stone-900/90 border border-stone-800 p-6 md:p-8 rounded-3xl space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-teal-400" />
                  <h3 className="text-lg md:text-xl font-bold text-stone-100">
                    Sesi Latihan LEGA Presence Selesai
                  </h3>
                </div>
                <span className="text-xs bg-teal-950 text-teal-300 border border-teal-800 px-3 py-1 rounded-full font-semibold">
                  {durationMinutes} Menit Latihan
                </span>
              </div>

              {/* Self-Reported Presence Rating */}
              <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-300">
                    Tingkat Kehadiran Yang Anda Rasakan (Refleksi Diri):
                  </span>
                  <span className="px-2.5 py-0.5 bg-teal-950 text-teal-300 border border-teal-800 rounded font-bold">
                    {presenceRating}/10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={presenceRating}
                  onChange={(e) => setPresenceRating(Number(e.target.value))}
                  className="w-full accent-teal-500 bg-stone-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Identified Emotion Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-300">
                  Emosi Yang Teridentifikasi Selama Latihan:
                </label>
                <input
                  type="text"
                  value={identifiedEmotion}
                  onChange={(e) => setIdentifiedEmotion(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-100 outline-none focus:border-teal-500"
                />
              </div>

              {/* Reflection Notes */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-300">
                  Catatan Refleksi Bebas (Opsional):
                </label>
                <textarea
                  value={reflectionNotes}
                  onChange={(e) => setReflectionNotes(e.target.value)}
                  placeholder="Catat pengalaman mengembalikan perhatian saat pikiran mengembara..."
                  rows={3}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-100 outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleResetTimer}
                  className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-medium transition"
                >
                  Ulangi Latihan
                </button>
                <button
                  onClick={handleCompleteReflection}
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl text-xs transition inline-flex items-center gap-2 shadow-lg shadow-teal-950/50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Memproses Ringkasan AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generasi Output Refleksi</span>
                    </>
                  )}
                </button>
              </div>

              {/* AI Output Result */}
              {presenceOutput && (
                <div className="p-6 bg-stone-950 border border-stone-800 rounded-2xl space-y-5 animate-fade-in">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Ringkasan Kehadiran LEGA
                    </p>
                    <p className="text-xs text-stone-200 leading-relaxed">
                      {presenceOutput.presenceSummary}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-400" /> Catatan Refleksi Penguat
                    </p>
                    <p className="text-xs text-stone-400 italic leading-relaxed">
                      "{presenceOutput.reflectionNote}"
                    </p>
                  </div>

                  {/* Connected Recommended Modules */}
                  <div className="pt-2 border-t border-stone-800 space-y-3">
                    <p className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-teal-400" /> Modul Lanjutan Terhubung:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {presenceOutput.recommendedNextModules && Array.isArray(presenceOutput.recommendedNextModules) ? (
                        presenceOutput.recommendedNextModules.map((mod: any, idx: number) => (
                          <div key={idx} className="p-3 bg-stone-900 border border-stone-800 rounded-xl space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-teal-300">{mod.moduleName}</span>
                              <button
                                onClick={() => onSelectModule && onSelectModule(mod.targetModuleKey || 'breathing')}
                                className="px-2.5 py-0.5 bg-teal-600 hover:bg-teal-500 text-white text-[10px] rounded font-semibold transition"
                              >
                                Buka
                              </button>
                            </div>
                            <p className="text-[10px] text-stone-400">{mod.reason}</p>
                          </div>
                        ))
                      ) : (
                        <>
                          <button
                            onClick={() => onSelectModule && onSelectModule('breathing')}
                            className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-left hover:border-teal-700 transition"
                          >
                            <p className="font-bold text-xs text-teal-300">LEGA Breathing</p>
                            <p className="text-[10px] text-stone-400 mt-0.5">Stabilkan sistem saraf dengan irama napas</p>
                          </button>
                          <button
                            onClick={() => onSelectModule && onSelectModule('journal')}
                            className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-left hover:border-teal-700 transition"
                          >
                            <p className="font-bold text-xs text-teal-300">LEGA Journal</p>
                            <p className="text-[10px] text-stone-400 mt-0.5">Catat refleksi hari ini dalam jurnal</p>
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
      )}

      {/* Mode 2: Grounding Indrawi 5-4-3-2-1 */}
      {activeTab === 'grounding' && (
        <div className="bg-stone-900/90 p-6 md:p-8 rounded-3xl border border-stone-800 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-teal-400 bg-teal-950 px-3 py-1 rounded-full border border-teal-800">
              Langkah {groundingStep + 1} dari 5
            </span>
            <button
              onClick={() => setGroundingStep(0)}
              className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {groundingStep < 5 ? (
            <div className="space-y-6 text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto shadow-inner">
                {React.createElement(groundingSteps[groundingStep].icon, { className: 'w-8 h-8' })}
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-lg md:text-xl font-bold text-stone-100">
                  {groundingSteps[groundingStep].title}
                </h3>
                <p className="text-xs md:text-sm text-stone-300 leading-relaxed">
                  {groundingSteps[groundingStep].desc}
                </p>
              </div>

              <button
                onClick={() => setGroundingStep((prev) => Math.min(prev + 1, 5))}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition inline-flex items-center gap-2 shadow-lg shadow-teal-900/30"
              >
                <span>Selesai Langkah Ini</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-teal-400">Latihan Grounding Selesai</h3>
              <p className="text-xs md:text-sm text-stone-300 max-w-md mx-auto">
                Rasakan keheningan di dalam dirimu. Tubuhmu ada di sini, aman, dan hadir sepenuhnya.
              </p>
              <button
                onClick={() => setGroundingStep(0)}
                className="px-6 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-medium transition"
              >
                Ulangi Latihan
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mode 3: Langit Kesadaran (Thought Observer) */}
      {activeTab === 'thought-clouds' && (
        <div className="bg-stone-900/90 p-6 md:p-8 rounded-3xl border border-stone-800 space-y-6 animate-fade-in">
          <div className="space-y-2">
            <h3 className="font-semibold text-stone-100 text-sm md:text-base flex items-center gap-2">
              <Cloud className="w-5 h-5 text-sky-400" />
              <span>Langit Kesadaran (Visualisasi Awan Pikiran)</span>
            </h3>
            <p className="text-xs text-stone-400">
              Pikiran hanyalah seperti awan yang melintas di langit luas dirimu. Tuliskan beban pikiranmu dan letakkan di awan agar berlalu perlahan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={cloudThought}
              onChange={(e) => setCloudThought(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCloudThought()}
              placeholder="Tuliskan satu pikiran yang mengganggu saat ini..."
              className="flex-1 bg-stone-950 border border-stone-800 focus:border-sky-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-stone-100 placeholder-stone-500 outline-none"
            />
            <button
              onClick={handleAddCloudThought}
              disabled={!cloudThought.trim()}
              className="px-5 py-3 bg-sky-600 hover:bg-sky-500 disabled:bg-stone-800 text-white rounded-xl text-xs font-medium transition flex items-center gap-2"
            >
              <span>Lepas ke Awan</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Floating Sky Area */}
          <div className="min-h-[220px] bg-gradient-to-b from-stone-950 via-slate-900 to-stone-950 rounded-2xl p-6 border border-stone-800 relative overflow-hidden space-y-4">
            <p className="text-[11px] text-stone-500 text-center font-medium">
              Langit Kesadaran: Amati pikiran melintas tanpa perlu menahannya
            </p>

            <div className="flex flex-wrap gap-4 justify-center items-center py-4">
              {floatingThoughts.map((t) => (
                <div
                  key={t.id}
                  className="px-4 py-2.5 bg-sky-950/70 border border-sky-800/80 rounded-2xl text-sky-200 text-xs shadow-lg animate-pulse flex items-center gap-2"
                >
                  <Cloud className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>"{t.text}"</span>
                  <button
                    onClick={() => handleRemoveThought(t.id)}
                    className="text-stone-500 hover:text-rose-400 ml-1 text-xs"
                    title="Biarkan Hilang"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {floatingThoughts.length === 0 && (
                <p className="text-xs text-stone-600 italic py-8">
                  Langit pikiranmu sedang jernih. Tuliskan pikiran jika ada yang ingin dilesapkan.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
