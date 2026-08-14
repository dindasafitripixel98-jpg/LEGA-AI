import React, { useState } from 'react';
import {
  Eye,
  Activity,
  Heart,
  Cloud,
  Sparkles,
  Layers,
  ArrowRight,
  RotateCcw,
  Compass,
  Maximize2,
  Info,
  RefreshCw
} from 'lucide-react';
import { ModuleType } from '../types';
import { observerReflect } from '../lib/geminiApi';

interface LegaObserverProps {
  onSelectModule?: (module: ModuleType | string) => void;
  onOpenCrisis?: () => void;
}

const BODY_SENSATIONS = [
  'Ketegangan di Bahu/Leher',
  'Sensasi Sempit di Dada',
  'Sensasi Hangat / Dingin',
  'Detak Jantung Terasa',
  'Rasa Berat di Kepala',
  'Kekakuan di Perut/Pinggang',
  'Sensasi Getaran Halus',
  'Napas Terasa Dangkal',
  'Sensasi Otot Rileks',
  'Rasa Pijakan Kaki Kuat'
];

const EMOTIONAL_WAVES = [
  { id: 'cemas', label: 'Gelombang Kecemasan', desc: 'Rasa gelisah yang naik dan turun seperti ombak' },
  { id: 'marah', label: 'Gelombang Kemarahan', desc: 'Sensasi panas yang memuncak lalu mereda' },
  { id: 'sedih', label: 'Gelombang Kesedihan', desc: 'Rasa dalam dan basah yang menyelimuti sementara' },
  { id: 'takut', label: 'Gelombang Ketakutan', desc: 'Ketegangan waspada yang perlahan melunak' },
  { id: 'netral', label: 'Gelombang Tenang / Netral', desc: 'Lautan batin yang relatif tenang dan stabil' },
];

const OBSERVER_STEPS = [
  { title: '1. Mengambil Posisi Saksi', prompt: 'Duduk nyaman. Tarik napas perlahan. Geser fokus Anda dari pelaku utama menjadi Sang Pengamat yang tenang di ruang batin.' },
  { title: '2. Mengamati Sensasi Fisik Tubuh', prompt: 'Pindai tubuh dari kepala hingga kaki. Amati sensasi fisik sebagai data netral tanpa menilai "baik" atau "buruk".' },
  { title: '3. Mengamati Gelombang Emosi', prompt: 'Perhatikan emosi yang hadir saat ini. Amati sebagai gelombang energi yang naik, mencapai puncak, dan akan surut dengan sendirinya.' },
  { title: '4. Mengamati Arus Pikiran (Defusion)', prompt: 'Amati pikiran yang melintas. Gunakan kalimat: "Saya menyadari ada pikiran bahwa..." untuk menciptakan jarak sehat.' },
  { title: '5. Menyadari Jarak Psikologis', prompt: 'Ukur berapa jauh jarak antara Diri Anda (Sang Saksi) dan isi pikiran/emosi Anda.' },
  { title: '6. Refleksi & Pemaknaan AI', prompt: 'Selesai. Dapatkan ringkasan pengamatan dan insight pemisahan identitas dari LEGA AI.' }
];

export const LegaObserver: React.FC<LegaObserverProps> = ({
  onSelectModule,
  onOpenCrisis
}) => {
  const [activeTab, setActiveTab] = useState<'observer-journey' | 'dimension-matrix'>('observer-journey');

  // Observer Journey States
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedSensations, setSelectedSensations] = useState<string[]>([]);
  const [selectedEmotionalWave, setSelectedEmotionalWave] = useState<string>('netral');
  const [observedThoughts, setObservedThoughts] = useState<string>('');
  const [distanceRating, setDistanceRating] = useState<number>(7);
  const [reflectionNotes, setReflectionNotes] = useState<string>('');

  // AI Output State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [observerOutput, setObserverOutput] = useState<any | null>(null);

  // Matrix Active Subtab
  const [matrixTab, setMatrixTab] = useState<'body' | 'emotion' | 'thought' | 'space'>('body');

  const toggleSensation = (sens: string) => {
    setSelectedSensations((prev) =>
      prev.includes(sens) ? prev.filter((s) => s !== sens) : [...prev, sens]
    );
  };

  const handleCompleteObserverJourney = async () => {
    setIsProcessing(true);
    const result = await observerReflect({
      bodySensations: selectedSensations,
      emotionalWave: selectedEmotionalWave,
      observedThoughts,
      distanceRating,
      reflectionNotes,
    });
    setObserverOutput(result);
    setIsProcessing(false);
  };

  const handleResetJourney = () => {
    setCurrentStep(0);
    setSelectedSensations([]);
    setSelectedEmotionalWave('netral');
    setObservedThoughts('');
    setDistanceRating(7);
    setReflectionNotes('');
    setObserverOutput(null);
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 text-stone-100">
      {/* Header Banner */}
      <div className="bg-stone-900/90 border border-stone-800 p-5 md:p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-950/80 border border-purple-800 text-purple-400 rounded-2xl">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-stone-100 flex items-center gap-2">
                LEGA Observer
                <span className="text-xs bg-purple-900/80 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-700 font-mono">
                  v1.0
                </span>
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Latihan Menjadi Saksi Terhadap Pikiran, Emosi, dan Sensasi Tubuh Tanpa Menghakimi
              </p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex bg-stone-950 border border-stone-800 rounded-2xl p-1 gap-1 text-xs">
            <button
              onClick={() => setActiveTab('observer-journey')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'observer-journey'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Sesi Saksi 6-Tahap</span>
            </button>
            <button
              onClick={() => setActiveTab('dimension-matrix')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'dimension-matrix'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>4 Dimensi Saksi</span>
            </button>
          </div>
        </div>

        {/* Core Principle Card */}
        <div className="p-3.5 bg-stone-950/90 border border-stone-800/80 rounded-2xl text-[11px] text-stone-300 flex items-start gap-2.5 leading-relaxed">
          <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-purple-300 font-semibold">Prinsip Sang Pengamat:</span> "Anda bukanlah pikiran Anda. Anda adalah ruang yang luas tempat pikiran, emosi, dan sensasi tubuh datang, tinggal sejenak, lalu berlalu." Latihan ini memisahkan identitas diri dari riak batin.
          </div>
        </div>
      </div>

      {/* Mode 1: Sesi Saksi 6-Tahap */}
      {activeTab === 'observer-journey' && (
        <div className="bg-stone-900/90 border border-stone-800 p-6 md:p-8 rounded-3xl space-y-6 animate-fade-in">
          {/* Step Indicator */}
          <div className="flex items-center justify-between border-b border-stone-800 pb-4 text-xs">
            <span className="font-bold text-purple-400 flex items-center gap-2">
              <Eye className="w-4 h-4" /> Tahap {currentStep + 1} dari 6: {OBSERVER_STEPS[currentStep].title}
            </span>
            <button
              onClick={handleResetJourney}
              className="text-stone-400 hover:text-stone-200 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* Current Step Content */}
          <div className="space-y-6">
            <div className="p-5 bg-stone-950/80 border border-stone-800 rounded-2xl space-y-2">
              <p className="text-xs text-purple-300 font-semibold uppercase tracking-wider">
                Panduan Saksi Batin
              </p>
              <p className="text-sm md:text-base text-stone-200 font-medium leading-relaxed">
                "{OBSERVER_STEPS[currentStep].prompt}"
              </p>
            </div>

            {/* Step 1: Observer Stance Intro */}
            {currentStep === 0 && (
              <div className="py-6 text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-purple-950/80 border border-purple-800 text-purple-300 flex items-center justify-center mx-auto shadow-xl animate-pulse">
                  <Eye className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-stone-100">
                  Mengambil Posisi Sang Pengamat
                </h3>
                <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
                  Tutup mata Anda sejenak atau pandang satu titik dengan lembut. Bayangkan Anda duduk di kursi penonton bioskop, dan pikiran serta emosi adalah film yang sedang diputar di layar.
                </p>
              </div>
            )}

            {/* Step 2: Body Sensations Tagging */}
            {currentStep === 1 && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-purple-400" />
                  Pilih Sensasi Fisik Yang Terasa Saat Ini (Amati Tanpa Menilai):
                </label>
                <div className="flex flex-wrap gap-2">
                  {BODY_SENSATIONS.map((sens) => {
                    const isSelected = selectedSensations.includes(sens);
                    return (
                      <button
                        key={sens}
                        onClick={() => toggleSensation(sens)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition ${
                          isSelected
                            ? 'bg-purple-950 border-purple-500 text-purple-200 shadow-md'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        {sens} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Emotional Wave Selection */}
            {currentStep === 2 && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-purple-400" />
                  Pilih Bentuk Gelombang Emosi Yang Sedang Melintas:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {EMOTIONAL_WAVES.map((wave) => (
                    <button
                      key={wave.id}
                      onClick={() => setSelectedEmotionalWave(wave.id)}
                      className={`p-3.5 rounded-2xl border text-xs text-left transition ${
                        selectedEmotionalWave === wave.id
                          ? 'bg-purple-950 border-purple-500 text-purple-200 font-semibold ring-1 ring-purple-500'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <p className="font-bold text-stone-200">{wave.label}</p>
                      <p className="text-[10px] text-stone-400 mt-1">{wave.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Cognitive Defusion (Observed Thoughts) */}
            {currentStep === 3 && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                  <Cloud className="w-4 h-4 text-purple-400" />
                  Tuliskan Arus Pikiran Dengan Formula Pemisahan Identitas:
                </label>
                <div className="p-3 bg-purple-950/40 border border-purple-800/50 rounded-xl text-xs text-purple-200 italic">
                  Contoh: "Saya menyadari ada pikiran bahwa saya takut gagal." (Bukan "Saya takut gagal")
                </div>
                <textarea
                  value={observedThoughts}
                  onChange={(e) => setObservedThoughts(e.target.value)}
                  placeholder="Ubah kalimat pikiranmu menjadi: Saya menyadari bahwa..."
                  rows={3}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-100 outline-none focus:border-purple-500"
                />
              </div>
            )}

            {/* Step 5: Distance Rating Scale */}
            {currentStep === 4 && (
              <div className="p-5 bg-stone-950 border border-stone-800 rounded-2xl space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-300">
                    Jarak Psikologis Antara Diri (Saksi) & Pikiran/Emosi:
                  </span>
                  <span className="px-3 py-1 bg-purple-950 text-purple-300 border border-purple-800 rounded font-bold">
                    {distanceRating}/10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={distanceRating}
                  onChange={(e) => setDistanceRating(Number(e.target.value))}
                  className="w-full accent-purple-500 bg-stone-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-500">
                  <span>1 (Sangat Terjebak/Melengket)</span>
                  <span>5 (Mulai Ada Jarak)</span>
                  <span>10 (Sepenuhnya Menjadi Saksi Jernih)</span>
                </div>
              </div>
            )}

            {/* Step 6: Reflection & AI Output */}
            {currentStep === 5 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-300">
                    Catatan Pengamatan Tambahan (Opsional):
                  </label>
                  <textarea
                    value={reflectionNotes}
                    onChange={(e) => setReflectionNotes(e.target.value)}
                    placeholder="Apa yang Anda pelajari saat menjadi saksi netral terhadap batin Anda?"
                    rows={2}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-100 outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleCompleteObserverJourney}
                    disabled={isProcessing}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl text-xs sm:text-sm transition inline-flex items-center gap-2 shadow-xl shadow-purple-950/50"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Menganalisis Perspektif Saksi...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generasi Refleksi Saksi Kesadaran</span>
                      </>
                    )}
                  </button>
                </div>

                {/* AI Observer Output Card */}
                {observerOutput && (
                  <div className="p-6 bg-stone-950 border border-stone-800 rounded-2xl space-y-5 animate-fade-in text-left">
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" /> Ringkasan Pengamatan Netral
                      </p>
                      <p className="text-xs text-stone-200 leading-relaxed">
                        {observerOutput.observerSummary}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-purple-400" /> Insight Pemisahan Identitas (Cognitive Defusion)
                      </p>
                      <p className="text-xs text-stone-300 italic leading-relaxed bg-stone-900/90 p-4 rounded-xl border border-stone-800">
                        "{observerOutput.defusionInsight}"
                      </p>
                    </div>

                    {observerOutput.presenceAnchor && (
                      <div className="p-3 bg-purple-950/50 border border-purple-800/60 rounded-xl text-xs text-purple-200 italic">
                        Anchor: {observerOutput.presenceAnchor}
                      </div>
                    )}

                    {/* Recommended Next Modules */}
                    <div className="pt-3 border-t border-stone-800 space-y-3">
                      <p className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-purple-400" /> Modul Lanjutan Terhubung:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {observerOutput.recommendedModules && Array.isArray(observerOutput.recommendedModules) ? (
                          observerOutput.recommendedModules.map((mod: any, idx: number) => (
                            <div key={idx} className="p-3 bg-stone-900 border border-stone-800 rounded-xl space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-purple-300">{mod.moduleName}</span>
                                <button
                                  onClick={() => onSelectModule && onSelectModule(mod.targetModuleKey || 'emotional-release')}
                                  className="px-2.5 py-0.5 bg-purple-600 hover:bg-purple-500 text-white text-[10px] rounded font-semibold transition"
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
                              onClick={() => onSelectModule && onSelectModule('emotional-release')}
                              className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-left hover:border-purple-700 transition"
                            >
                              <p className="font-bold text-xs text-purple-300">LEGA Release</p>
                              <p className="text-[10px] text-stone-400 mt-0.5">Lepaskan beban emosional yang diamati</p>
                            </button>
                            <button
                              onClick={() => onSelectModule && onSelectModule('ai-coach')}
                              className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-left hover:border-purple-700 transition"
                            >
                              <p className="font-bold text-xs text-purple-300">LEGA AI Coach</p>
                              <p className="text-[10px] text-stone-400 mt-0.5">Diskusikan bersama AI Coach</p>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-800">
              <button
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-300 rounded-xl text-xs font-medium transition"
              >
                Sebelumnya
              </button>

              <button
                onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
                disabled={currentStep === 5}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
              >
                <span>{currentStep === 4 ? 'Selesaikan' : 'Langkah Selanjutnya'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: 4 Dimensi Saksi Matrix */}
      {activeTab === 'dimension-matrix' && (
        <div className="bg-stone-900/90 border border-stone-800 p-6 rounded-3xl space-y-6 animate-fade-in">
          {/* Matrix Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => setMatrixTab('body')}
              className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                matrixTab === 'body'
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Sensasi Tubuh</span>
            </button>
            <button
              onClick={() => setMatrixTab('emotion')}
              className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                matrixTab === 'emotion'
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Gelombang Emosi</span>
            </button>
            <button
              onClick={() => setMatrixTab('thought')}
              className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                matrixTab === 'thought'
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Cloud className="w-4 h-4" />
              <span>Arus Pikiran</span>
            </button>
            <button
              onClick={() => setMatrixTab('space')}
              className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                matrixTab === 'space'
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Maximize2 className="w-4 h-4" />
              <span>Ruang Kesadaran</span>
            </button>
          </div>

          {/* Matrix Card Detail */}
          <div className="p-6 bg-stone-950 border border-stone-800 rounded-2xl space-y-4">
            {matrixTab === 'body' && (
              <div className="space-y-3">
                <h4 className="font-bold text-purple-300 text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Saksi Sensasi Tubuh (Raw Physical Data)
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Bila terasa tegang di leher atau dada sempit, hindari menghakimi bahwa itu "sakit" atau "buruk". Pandanglah itu hanya sebagai energi fisik netral. Katakan dalam hati: "Saya mengamati sensasi tegang ini ada di sini saat ini."
                </p>
              </div>
            )}

            {matrixTab === 'emotion' && (
              <div className="space-y-3">
                <h4 className="font-bold text-purple-300 text-sm flex items-center gap-2">
                  <Heart className="w-4 h-4" /> Saksi Gelombang Emosi (Emotional Wave Surfing)
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Emosi bertindak seperti gelombang samudra. Gelombang tidak bisa ditahan dengan tangan kosong, namun dapat diarungi. Izinkan emosi hadir, memuncak, dan berlalu tanpa harus bereaksi impulsive.
                </p>
              </div>
            )}

            {matrixTab === 'thought' && (
              <div className="space-y-3">
                <h4 className="font-bold text-purple-300 text-sm flex items-center gap-2">
                  <Cloud className="w-4 h-4" /> Saksi Arus Pikiran (Cognitive Defusion)
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Pikiran bukanlah kenyataan mutlak, melainkan hanya saran spontan dari otak Anda. Ketika pikiran buruk muncul, ucapkan: "Terima kasih otakku atas saran pikiran ini, tapi aku memilih tetap di sini."
                </p>
              </div>
            )}

            {matrixTab === 'space' && (
              <div className="space-y-3">
                <h4 className="font-bold text-purple-300 text-sm flex items-center gap-2">
                  <Maximize2 className="w-4 h-4" /> Ruang Kesadaran Murni (Pure Observer Space)
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Di balik riak pikiran dan badai emosi, ada bagian dari diri Anda yang selalu tenang, jernih, dan tak tersentuh: Sang Saksi. Di ruang ini, Anda selalu aman.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
