import React, { useState } from 'react';
import {
  Flame,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Wind,
  Heart,
  Activity,
  Compass,
  AlertTriangle,
  ArrowRight,
  Pause,
  CheckCircle,
  HelpCircle,
  Layers,
  BrainCircuit,
  BookOpen,
  MessageSquare,
  BarChart2,
  Volume2,
  RefreshCw,
  Info,
} from 'lucide-react';
import { ModuleType } from '../types';
import { releaseReflect } from '../lib/geminiApi';

interface EmotionalReleaseProps {
  onSelectModule?: (module: ModuleType | string) => void;
  onOpenCrisis?: () => void;
}

const RELEASE_STEPS = [
  '1. Berhenti Sejenak',
  '2. Sadari Napas',
  '3. Kenali Emosi',
  '4. Sensasi Tubuh',
  '5. Beri Ruang',
  '6. Refleksi',
  '7. Langkah Kecil',
];

const EMOTION_OPTIONS = [
  'Marah / Kesal',
  'Sedih / Kecewa',
  'Cemas / Khawatir',
  'Takut / Gelisah',
  'Bersalah / Malu',
  'Lelah / Kosong',
  'Frustrasi / Tertekan',
  'Iri / Dendam',
];

const BODY_SENSATIONS = [
  'Dada terasa sesak / kencang',
  'Bahu & leher tegang / kaku',
  'Rahang terkatup rapat',
  'Perut melilit / mual',
  'Kepala berat / pusing',
  'Detak jantung cepat',
  'Napas pendek / dangkal',
  'Tangan / kaki gemetar',
];

const UNFULFILLED_NEEDS = [
  'Rasa aman & kepastian',
  'Batas (boundaries) yang jelas',
  'Ruang diri & waktu istirahat',
  'Apresiasi & validasi',
  'Keadilan & kesetaraan',
  'Koneksi & pengertian',
  'Kebebasan berekspresi',
];

const PRESET_SMALL_STEPS = [
  'Minum segelas air hangat perlahan',
  'Mencuci muka dengan air dingin',
  'Melakukan 5 napas dalam LEGA Breathing',
  'Istirahat dari gawai / skrin selama 15 menit',
  'Berjalan kaki sebentar di luar ruangan',
  'Menuliskan lanjutan isi pikiran di LEGA Journal',
];

export const EmotionalRelease: React.FC<EmotionalReleaseProps> = ({
  onSelectModule,
  onOpenCrisis,
}) => {
  const [activeTab, setActiveTab] = useState<'guided-release' | 'catharsis-burn'>('guided-release');

  // Guided Release State
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [isPauseCounting, setIsPauseCounting] = useState<boolean>(false);
  const [pauseCount, setPauseCount] = useState<number>(5);

  const [selectedEmotion, setSelectedEmotion] = useState<string>('Cemas / Khawatir');
  const [selectedSensations, setSelectedSensations] = useState<string[]>(['Dada terasa sesak / kencang']);
  const [intensity, setIntensity] = useState<number>(6);
  const [triggerText, setTriggerText] = useState<string>('');
  const [importantValues, setImportantValues] = useState<string>('');
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(['Rasa aman & kepastian']);
  const [learnings, setLearnings] = useState<string>('');
  const [nextSmallStep, setNextSmallStep] = useState<string>('Minum segelas air hangat perlahan');

  const [isProcessingReflect, setIsProcessingReflect] = useState<boolean>(false);
  const [summaryResult, setSummaryResult] = useState<any | null>(null);
  const [showEscalationPanel, setShowEscalationPanel] = useState<boolean>(false);

  // Catharsis Burn State
  const [burnText, setBurnText] = useState<string>('');
  const [isBurning, setIsBurning] = useState<boolean>(false);
  const [isBurned, setIsBurned] = useState<boolean>(false);

  // Pause Countdown handler
  const handleStartPauseTimer = () => {
    setIsPauseCounting(true);
    setPauseCount(5);
    const interval = setInterval(() => {
      setPauseCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsPauseCounting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const toggleSensation = (item: string) => {
    setSelectedSensations((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleNeed = (item: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleFinishRelease = async () => {
    setIsProcessingReflect(true);

    const releaseData = {
      emotion: selectedEmotion,
      physicalSensations: selectedSensations,
      triggers: triggerText ? [triggerText] : [],
      importantValues,
      unfulfilledNeeds: selectedNeeds.join(', '),
      learnings,
      nextSmallStep,
    };

    const result = await releaseReflect(releaseData);
    setSummaryResult(result);
    setIsProcessingReflect(false);
  };

  const handleBurn = () => {
    if (!burnText.trim()) return;
    setIsBurning(true);
    setTimeout(() => {
      setIsBurning(false);
      setIsBurned(true);
      setBurnText('');
    }, 2500);
  };

  const getIntensityLabel = (val: number) => {
    if (val <= 2) return 'Sangat Ringan';
    if (val <= 4) return 'Ringan';
    if (val <= 6) return 'Sedang';
    if (val <= 8) return 'Kuat';
    return 'Sangat Kuat';
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 text-stone-100">
      {/* Header Banner */}
      <div className="bg-stone-900/90 border border-stone-800 p-5 md:p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-950/80 border border-rose-800/80 text-rose-400 rounded-2xl">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-stone-100 flex items-center gap-2">
                LEGA Release
                <span className="text-xs bg-rose-900/80 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-700 font-mono">
                  v1.0
                </span>
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Latihan Refleksi, Penerimaan, & Regulasi Emosi Bertahap
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-stone-950 border border-stone-800 rounded-2xl p-1 gap-1 text-xs">
            <button
              onClick={() => setActiveTab('guided-release')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'guided-release'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Latihan Refleksi 7-Tahap</span>
            </button>
            <button
              onClick={() => setActiveTab('catharsis-burn')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'catharsis-burn'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Katarsis Tulisan (Burn & Release)</span>
            </button>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="p-3 bg-stone-950/80 border border-stone-800/80 rounded-2xl text-[11px] text-stone-400 flex items-start gap-2 leading-relaxed">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-stone-200 font-semibold">Batas & Keamanan Modul:</span> LEGA Release adalah latihan refleksi dan regulasi emosi. LEGA Release <span className="text-stone-300 italic">bukan terapi, bukan pengobatan, dan bukan diagnosis medis</span>.
          </div>
        </div>
      </div>

      {/* Mode 1: Guided 7-Stage LEGA Release */}
      {activeTab === 'guided-release' && (
        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="bg-stone-900/90 p-4 rounded-2xl border border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-rose-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Alur LEGA Release: Tahap {currentStage}/7
              </span>
              <span className="text-stone-300 font-medium">
                {RELEASE_STEPS[currentStage - 1]}
              </span>
            </div>
            <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full transition-all duration-500"
                style={{ width: `${(currentStage / 7) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between overflow-x-auto pb-0.5 text-[10px] text-stone-500 font-medium scrollbar-none gap-2">
              {RELEASE_STEPS.map((step, idx) => (
                <span
                  key={idx}
                  onClick={() => setCurrentStage(idx + 1)}
                  className={`cursor-pointer whitespace-nowrap px-1 py-0.5 rounded transition ${
                    currentStage === idx + 1
                      ? 'text-rose-300 font-bold bg-rose-950/80 border border-rose-800'
                      : 'hover:text-stone-300'
                  }`}
                >
                  {step}
                </span>
              ))}
            </div>
          </div>

          {/* Emergency Escalation Button (When emotions feel overwhelming) */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowEscalationPanel(!showEscalationPanel)}
              className="px-3 py-1.5 bg-amber-950/80 hover:bg-amber-900 border border-amber-800/80 text-amber-300 rounded-xl text-xs font-medium transition flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Emosi Terasa Meningkat / Butuh Jeda?</span>
            </button>
          </div>

          {/* Escalation Interventions Panel */}
          {showEscalationPanel && (
            <div className="p-5 rounded-3xl bg-amber-950/60 border border-amber-800 text-stone-200 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Protokol Regulasi Saat Emosi Meningkat</span>
                </div>
                <button
                  onClick={() => setShowEscalationPanel(false)}
                  className="text-xs text-stone-400 hover:text-stone-200"
                >
                  Tutup
                </button>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Jika perasaan ini terasa terlalu berat atau membuatmu kewalahan, kamu tidak harus memaksakan diri menjawab semua pertanyaan refleksi. Kamu berhak beristirahat sejenak.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <button
                  onClick={() => onSelectModule && onSelectModule('breathing')}
                  className="p-3 bg-stone-900 border border-amber-800/80 rounded-2xl text-left hover:border-amber-600 transition"
                >
                  <p className="font-bold text-xs text-emerald-300 flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5" />
                    LEGA Breathing
                  </p>
                  <p className="text-[10px] text-stone-400 mt-1">Latihan napas penenang sistem saraf</p>
                </button>

                <button
                  onClick={() => onSelectModule && onSelectModule('mindfulness')}
                  className="p-3 bg-stone-900 border border-amber-800/80 rounded-2xl text-left hover:border-amber-600 transition"
                >
                  <p className="font-bold text-xs text-teal-300 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    LEGA Presence
                  </p>
                  <p className="text-[10px] text-stone-400 mt-1">Kembali berjangkar di momen saat ini</p>
                </button>

                <button
                  onClick={() => onOpenCrisis && onOpenCrisis()}
                  className="p-3 bg-rose-950/80 border border-rose-800 rounded-2xl text-left hover:border-rose-600 transition"
                >
                  <p className="font-bold text-xs text-rose-300 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5" />
                    Layanan Darurat
                  </p>
                  <p className="text-[10px] text-rose-200/80 mt-1">Akses Bantuan Psikologis / 119 ext 8</p>
                </button>
              </div>
            </div>
          )}

          {/* Interactive Step Content Container */}
          <div className="bg-stone-900/90 border border-stone-800 p-6 md:p-8 rounded-3xl space-y-6">
            {/* Step 1: Berhenti Sejenak (Pause) */}
            {currentStage === 1 && (
              <div className="space-y-6 animate-fade-in text-center max-w-lg mx-auto py-4">
                <div className="w-16 h-16 bg-rose-950/80 text-rose-400 border border-rose-800 rounded-full flex items-center justify-center mx-auto">
                  <Pause className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg md:text-xl font-bold text-stone-100">
                    Tahap 1: Berhenti Sejenak (Pause)
                  </h3>
                  <p className="text-xs md:text-sm text-stone-300 leading-relaxed">
                    Hentikan sejenak apa pun yang sedang Anda lakukan. Turunkan bahu Anda, kendurkan rahang yang terkatup, dan lepaskan genggaman tangan.
                  </p>
                </div>

                <div className="p-6 bg-stone-950 border border-stone-800 rounded-2xl space-y-3">
                  <p className="text-xs font-semibold text-rose-300">
                    Jeda Kesadaran 5 Detik:
                  </p>
                  {isPauseCounting ? (
                    <div className="text-3xl font-mono font-bold text-rose-400 animate-pulse">
                      {pauseCount}s
                    </div>
                  ) : pauseCount === 0 ? (
                    <div className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      <span>Terima kasih telah memberi dirimu jeda.</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleStartPauseTimer}
                      className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-medium transition"
                    >
                      Mulai Jeda 5 Detik
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setCurrentStage(2)}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-2xl text-xs transition inline-flex items-center gap-2 shadow-lg shadow-rose-950/50"
                >
                  <span>Saya Sudah Berhenti Sejenak</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2: Sadari Napas (Breath Awareness) */}
            {currentStage === 2 && (
              <div className="space-y-6 animate-fade-in text-center max-w-lg mx-auto py-4">
                <div className="w-20 h-20 rounded-full bg-rose-950/50 border border-rose-800/80 flex items-center justify-center mx-auto animate-pulse">
                  <Wind className="w-10 h-10 text-rose-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg md:text-xl font-bold text-stone-100">
                    Tahap 2: Sadari Napas (Breath Awareness)
                  </h3>
                  <p className="text-xs md:text-sm text-stone-300 leading-relaxed">
                    Tarik napas lembut melalui hidung... Hembuskan perlahan melalui mulut.
                  </p>
                </div>

                <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl text-xs text-stone-400 italic leading-relaxed">
                  "Emosi tidak perlu langsung dilawan. Emosi tidak harus langsung dihilangkan. Emosi cukup diamati."
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => setCurrentStage(1)}
                    className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-medium transition"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={() => setCurrentStage(3)}
                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs transition inline-flex items-center gap-2 shadow-lg shadow-rose-950/50"
                  >
                    <span>Sudah Menyadari Napas</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Kenali Emosi Yang Hadir */}
            {currentStage === 3 && (
              <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-400" />
                    <span>Tahap 3: Kenali Emosi Yang Hadir</span>
                  </h3>
                  <p className="text-xs text-stone-400">
                    Pertanyaan Reflektif: <span className="text-rose-300 italic font-medium">"Apa yang sedang Anda rasakan saat ini?"</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {EMOTION_OPTIONS.map((emo) => (
                    <button
                      key={emo}
                      onClick={() => setSelectedEmotion(emo)}
                      className={`p-3 rounded-2xl border text-xs text-left transition font-semibold ${
                        selectedEmotion === emo
                          ? 'bg-rose-950 border-rose-500 text-rose-200 ring-1 ring-rose-500'
                          : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      {emo}
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-400">Atau tuliskan emosimu secara spesifik:</label>
                  <input
                    type="text"
                    value={selectedEmotion}
                    onChange={(e) => setSelectedEmotion(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-100 outline-none focus:border-rose-500"
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setCurrentStage(2)}
                    className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-medium transition"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={() => setCurrentStage(4)}
                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs transition inline-flex items-center gap-2 shadow-lg shadow-rose-950/50"
                  >
                    <span>Lanjut Tahap 4</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Amati Sensasi Tubuh & Intensitas */}
            {currentStage === 4 && (
              <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-teal-400" />
                    <span>Tahap 4: Amati Sensasi Tubuh & Intensitas</span>
                  </h3>
                  <p className="text-xs text-stone-400">
                    Pertanyaan Reflektif: <span className="text-teal-300 italic font-medium">"Di bagian tubuh mana perasaan itu paling terasa & bagaimana intensitasnya?"</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-300">Pilih Sensasi Fisik:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {BODY_SENSATIONS.map((sens) => {
                      const checked = selectedSensations.includes(sens);
                      return (
                        <button
                          key={sens}
                          onClick={() => toggleSensation(sens)}
                          className={`p-2.5 rounded-xl text-xs text-left border transition flex items-center justify-between ${
                            checked
                              ? 'bg-teal-950 border-teal-600 text-teal-200 font-medium'
                              : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                          }`}
                        >
                          <span>{sens}</span>
                          {checked && <CheckCircle className="w-3.5 h-3.5 text-teal-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Intensity Slider */}
                <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-stone-300">Skala Intensitas Emosi:</span>
                    <span className="px-2.5 py-0.5 bg-teal-950 text-teal-300 border border-teal-800 rounded font-bold">
                      {intensity}/10 ({getIntensityLabel(intensity)})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-full accent-teal-500 bg-stone-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setCurrentStage(3)}
                    className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-medium transition"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={() => setCurrentStage(5)}
                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs transition inline-flex items-center gap-2 shadow-lg shadow-rose-950/50"
                  >
                    <span>Lanjut Tahap 5</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Beri Ruang Pada Pengalaman Tersebut */}
            {currentStage === 5 && (
              <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-amber-400" />
                    <span>Tahap 5: Beri Ruang Pada Pengalaman Tersebut</span>
                  </h3>
                  <p className="text-xs text-stone-400">
                    Pertanyaan Reflektif: <span className="text-amber-300 italic font-medium">"Apa pemicunya & kebutuhan apa yang mungkin belum terpenuhi?"</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-300">
                    Apa yang tampaknya memicu perasaan tersebut atau hal apa yang paling penting bagimu?
                  </label>
                  <textarea
                    value={triggerText}
                    onChange={(e) => setTriggerText(e.target.value)}
                    placeholder="Contoh: Tenggat waktu berlebih, ekspektasi dari rekan kerja, atau ucapan seseorang..."
                    rows={2}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-100 outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-300">
                    Pilih Kebutuhan Batin Yang Belum Terpenuhi:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {UNFULFILLED_NEEDS.map((need) => {
                      const checked = selectedNeeds.includes(need);
                      return (
                        <button
                          key={need}
                          onClick={() => toggleNeed(need)}
                          className={`p-2.5 rounded-xl text-xs text-left border transition flex items-center justify-between ${
                            checked
                              ? 'bg-amber-950 border-amber-600 text-amber-200 font-medium'
                              : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                          }`}
                        >
                          <span>{need}</span>
                          {checked && <CheckCircle className="w-3.5 h-3.5 text-amber-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setCurrentStage(4)}
                    className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-medium transition"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={() => setCurrentStage(6)}
                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs transition inline-flex items-center gap-2 shadow-lg shadow-rose-950/50"
                  >
                    <span>Lanjut Tahap 6</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 6: Refleksikan Pembelajaran */}
            {currentStage === 6 && (
              <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-sky-400" />
                    <span>Tahap 6: Refleksikan Pembelajaran</span>
                  </h3>
                  <p className="text-xs text-stone-400">
                    Pertanyaan Reflektif: <span className="text-sky-300 italic font-medium">"Apa yang dapat Anda pelajari dari pengalaman ini?"</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <textarea
                    value={learnings}
                    onChange={(e) => setLearnings(e.target.value)}
                    placeholder="Tuliskan pembelajaran atau pemaknaan baru dari situasi ini..."
                    rows={4}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-100 outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setCurrentStage(5)}
                    className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-medium transition"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={() => setCurrentStage(7)}
                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs transition inline-flex items-center gap-2 shadow-lg shadow-rose-950/50"
                  >
                    <span>Lanjut Tahap 7</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 7: Pilih Langkah Kecil Next */}
            {currentStage === 7 && (
              <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span>Tahap 7: Pilih Langkah Kecil Yang Ingin Dilakukan</span>
                  </h3>
                  <p className="text-xs text-stone-400">
                    Pertanyaan Reflektif: <span className="text-emerald-300 italic font-medium">"Langkah kecil apa yang ingin Anda ambil setelah sesi ini?"</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-300">Pilih Langkah Kecil Sederhana:</label>
                  <div className="space-y-2">
                    {PRESET_SMALL_STEPS.map((step) => (
                      <button
                        key={step}
                        onClick={() => setNextSmallStep(step)}
                        className={`w-full p-3 rounded-xl text-xs text-left border transition flex items-center justify-between ${
                          nextSmallStep === step
                            ? 'bg-emerald-950 border-emerald-600 text-emerald-200 font-semibold'
                            : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        <span>{step}</span>
                        {nextSmallStep === step && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-400">Atau ketikkan langkah spesifikmu:</label>
                  <input
                    type="text"
                    value={nextSmallStep}
                    onChange={(e) => setNextSmallStep(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-100 outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setCurrentStage(6)}
                    className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-medium transition"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={handleFinishRelease}
                    disabled={isProcessingReflect}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-2xl text-xs transition inline-flex items-center gap-2 shadow-lg shadow-emerald-950/50"
                  >
                    {isProcessingReflect ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Memproses Refleksi Final...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Selesaikan LEGA Release</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Session Summary Output Result */}
          {summaryResult && (
            <div className="p-6 md:p-8 bg-stone-900 border border-stone-800 rounded-3xl space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-rose-400" />
                  <h3 className="text-lg font-bold text-stone-100">
                    Hasil & Output Refleksi LEGA Release
                  </h3>
                </div>
                <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-2.5 py-0.5 rounded-full font-mono">
                  Selesai
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-2">
                  <p className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5" /> Ringkasan Emosi & Tubuh
                  </p>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {summaryResult.emotionSummary}
                  </p>
                </div>

                <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-2">
                  <p className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" /> Ringkasan Kebutuhan Batin
                  </p>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {summaryResult.needsSummary}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-2">
                <p className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                  <BrainCircuit className="w-3.5 h-3.5" /> Insight Refleksi LEGA
                </p>
                <p className="text-xs text-stone-200 leading-relaxed italic">
                  "{summaryResult.reflectionInsight}"
                </p>
              </div>

              {/* Recommended Next LEGA Ecosystem Modules */}
              <div className="p-5 bg-rose-950/40 border border-rose-900/80 rounded-2xl space-y-3">
                <p className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> Modul Lanjutan Terhubung dalam Ekosistem LEGA:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {summaryResult.recommendedModules && Array.isArray(summaryResult.recommendedModules) ? (
                    summaryResult.recommendedModules.map((mod: any, idx: number) => (
                      <div key={idx} className="p-3 bg-stone-900 border border-stone-800 rounded-xl space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-rose-300">{mod.moduleName}</span>
                          <button
                            onClick={() => onSelectModule && onSelectModule(mod.targetModuleKey || 'breathing')}
                            className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white text-[10px] rounded font-semibold transition"
                          >
                            Buka
                          </button>
                        </div>
                        <p className="text-[11px] text-stone-400">{mod.reason}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <button
                        onClick={() => onSelectModule && onSelectModule('ai-coach')}
                        className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-left hover:border-rose-700 transition"
                      >
                        <p className="font-bold text-xs text-rose-300 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5" /> LEGA AI Coach
                        </p>
                        <p className="text-[10px] text-stone-400 mt-0.5">Diskusi reflektif lebih dalam bersama AI Coach</p>
                      </button>

                      <button
                        onClick={() => onSelectModule && onSelectModule('journal')}
                        className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-left hover:border-rose-700 transition"
                      >
                        <p className="font-bold text-xs text-rose-300 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" /> LEGA Journal
                        </p>
                        <p className="text-[10px] text-stone-400 mt-0.5">Catat pengalaman refleksi ini ke dalam jurnal harian</p>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Catharsis Burn & Release Writing Space */}
      {activeTab === 'catharsis-burn' && (
        <div className="bg-stone-900/90 p-6 md:p-8 rounded-3xl border border-stone-800 space-y-6 shadow-xl relative overflow-hidden animate-fade-in">
          <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 text-xs text-stone-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Privasi Mutlak: Apapun yang dituliskan di ruang ini tidak disimpan di database. Tulisanmu murni instrumen katarsis sementara.
            </span>
          </div>

          {!isBurned ? (
            <div className="space-y-4">
              <textarea
                value={burnText}
                onChange={(e) => setBurnText(e.target.value)}
                disabled={isBurning}
                placeholder="Tumpahkan rasa jengkel, amarah, kekecewaan, atau kata-kata yang tidak bisa disajikan langsung di depan orang lain di sini..."
                rows={8}
                className={`w-full bg-stone-950 border border-stone-800 focus:border-rose-500 rounded-2xl p-4 text-xs sm:text-sm text-stone-100 placeholder-stone-600 outline-none transition-all duration-1000 ${
                  isBurning ? 'opacity-20 blur-sm scale-95 transition-all duration-2000' : ''
                }`}
              />

              <div className="flex justify-between items-center flex-wrap gap-2">
                <span className="text-xs text-stone-500">
                  {burnText.length} Karakter Terisi
                </span>

                <button
                  onClick={handleBurn}
                  disabled={!burnText.trim() || isBurning}
                  className="px-6 py-3 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-rose-950/50"
                >
                  <Flame className={`w-4 h-4 ${isBurning ? 'animate-bounce' : ''}`} />
                  <span>{isBurning ? 'Melepaskan & Melenyapkan...' : 'Bakar & Lepaskan Beban'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-rose-950/80 text-rose-400 border border-rose-800 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-stone-100">Tulisanmu Telah Dilepaskan</h3>
              <p className="text-xs md:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
                Beban emosional tersebut telah melenyap bersama tulisanmu. Tarik napas dalam-dalam, hembuskan perlahan, dan izinkan hatimu merasa lega.
              </p>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsBurned(false)}
                  className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-medium transition inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Tuliskan Pelepasan Baru</span>
                </button>
                <button
                  onClick={() => setActiveTab('guided-release')}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition inline-flex items-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  <span>Lanjut Latihan Refleksi 7-Tahap</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
