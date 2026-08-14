import React, { useState } from 'react';
import {
  Activity,
  Heart,
  Sparkles,
  Layers,
  ArrowRight,
  RotateCcw,
  Compass,
  Info,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Wind,
  Clock,
  AlertTriangle,
  Flame,
  FileText,
  UserCheck,
  HelpCircle
} from 'lucide-react';
import { ModuleType } from '../types';
import { bodyAwarenessReflect } from '../lib/geminiApi';
import { VoiceGuideButton } from './VoiceGuideButton';

interface BodyAwarenessProps {
  onSelectModule?: (module: ModuleType | string) => void;
  onOpenCrisis?: () => void;
}

const DURATIONS = [2, 5, 10, 15, 20, 30];

const ALL_BODY_AREAS = [
  'Kepala', 'Wajah', 'Mata', 'Rahang', 'Leher',
  'Bahu', 'Lengan', 'Tangan', 'Dada', 'Punggung',
  'Perut', 'Pinggang', 'Panggul', 'Paha', 'Lutut',
  'Betis', 'Pergelangan kaki', 'Telapak kaki', 'Seluruh tubuh'
];

const ALL_SENSATIONS = [
  'Hangat', 'Dingin', 'Berat', 'Ringan',
  'Tegang', 'Lemas', 'Berdebar', 'Berdenyut',
  'Kesemutan', 'Gatal', 'Nyeri ringan', 'Nyaman',
  'Tidak nyaman', 'Kosong', 'Penuh energi', 'Sensasi lain'
];

const ALUR_LATIHAN = [
  { title: '1. Berhenti Sejenak', prompt: 'Hentikan aktivitas Anda sejenak. Biarkan diri Anda hadir utuh di momen saat ini tanpa terburu-buru.' },
  { title: '2. Sadari Napas', prompt: 'Bawa perhatian lembut pada helaan napas masuk dan napas keluar. Rasakan pergerakan dada dan perut.' },
  { title: '3. Rasakan Posisi Tubuh', prompt: 'Rasakan titik tumpu tubuh Anda. Sadari sentuhan telapak kaki dengan lantai atau pinggul dengan tempat duduk.' },
  { title: '4. Amati Tubuh dari Kepala hingga Kaki', prompt: 'Perlahan pindai tubuh dari mahkota kepala, wajah, leher, bahu, dada, perut, hingga ujung kaki.' },
  { title: '5. Perhatikan Bagian yang Menarik Perhatian', prompt: 'Pilihlah bagian tubuh yang paling menarik perhatian atau terasa menyimpan sensasi paling jelas saat ini.' },
  { title: '6. Amati Sensasi yang Muncul', prompt: 'Amati sensasi fisik tanpa menilai baik/buruk. Apakah terasa tegang, hangat, berat, berdebar, atau netral?' },
  { title: '7. Sadari Perubahan & Hubungan Emosi', prompt: 'Perhatikan apakah sensasi tersebut berubah saat diberi perhatian sadar, dan bagaimana hubungannya dengan emosimu.' },
  { title: '8. Refleksi & Pemaknaan AI', prompt: 'Selesai. Dapatkan ringkasan pengamatan somatis dan refleksi dari LEGA AI.' }
];

export const BodyAwareness: React.FC<BodyAwarenessProps> = ({
  onSelectModule,
  onOpenCrisis
}) => {
  const [activeTab, setActiveTab] = useState<'body-scan' | 'somatic-map' | 'gratitude'>('body-scan');

  // Exercise Config
  const [selectedDuration, setSelectedDuration] = useState<number>(5);

  // 8-Step Alur Latihan State
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [primaryZone, setPrimaryZone] = useState<string>('Bahu');
  const [scannedZones, setScannedZones] = useState<string[]>(['Kepala', 'Leher', 'Bahu', 'Dada']);
  const [selectedSensations, setSelectedSensations] = useState<string[]>(['Tegang']);
  const [currentEmotion, setCurrentEmotion] = useState<string>('Lelah / Cemas');
  const [isSensationChanging, setIsSensationChanging] = useState<boolean>(true);
  const [comfortRating, setComfortRating] = useState<number>(6);
  const [userNotes, setUserNotes] = useState<string>('');

  // Pain / Heavy Alert State
  const [hasSeverePain, setHasSeverePain] = useState<boolean>(false);

  // AI Output State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [somaticOutput, setSomaticOutput] = useState<any | null>(null);

  // Gratitude
  const [gratitudeText, setGratitudeText] = useState<string>('');
  const [gratitudeSaved, setGratitudeSaved] = useState<boolean>(false);

  const toggleZone = (zone: string) => {
    setScannedZones((prev) =>
      prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone]
    );
  };

  const toggleSensation = (sens: string) => {
    setSelectedSensations((prev) =>
      prev.includes(sens) ? prev.filter((s) => s !== sens) : [...prev, sens]
    );
  };

  const handleCompleteBodyScan = async () => {
    setIsProcessing(true);
    const result = await bodyAwarenessReflect({
      durationMinutes: selectedDuration,
      scannedZones,
      primaryTensionZone: primaryZone,
      physicalSensations: selectedSensations,
      currentEmotion,
      isSensationChanging,
      comfortRating,
      userNotes,
    });
    setSomaticOutput(result);
    setIsProcessing(false);
  };

  const handleResetScan = () => {
    setCurrentStep(0);
    setSomaticOutput(null);
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 text-stone-100">
      {/* Header Banner */}
      <div className="bg-stone-900/90 border border-stone-800 p-5 md:p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-2xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-stone-100 flex items-center gap-2">
                LEGA Body Awareness
                <span className="text-xs bg-emerald-900/80 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-700 font-mono">
                  v1.0
                </span>
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Meningkatkan kesadaran tubuh & mengenali hubungan antara sensasi fisik, emosi, dan pikiran
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <VoiceGuideButton
              text="Selamat datang di modul LEGA Tubuh & Body Scan. Tubuh Anda adalah rumah yang menyimpan setiap rekaman emosi dan pengalaman. Sadari sensasi fisik tanpa menghakimi, hadirkan rasa terima kasih, dan izinkan ketegangan terurai perlahan."
              title="Panduan Body Awareness LEGA"
              subtitle="Latihan Pemindaian Tubuh & Somatis"
              variant="pill"
            />
            {/* Navigation Mode Tabs */}
            <div className="flex bg-stone-950 border border-stone-800 rounded-2xl p-1 gap-1 text-xs">
            <button
              onClick={() => setActiveTab('body-scan')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'body-scan'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Alur Body Scan (8 Step)</span>
            </button>
            <button
              onClick={() => setActiveTab('somatic-map')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'somatic-map'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Area & Jenis Sensasi</span>
            </button>
            <button
              onClick={() => setActiveTab('gratitude')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'gratitude'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Apresiasi Somatis</span>
            </button>
          </div>
        </div>
      </div>

        {/* Non-Medical Disclaimer Banner */}
        <div className="p-3.5 bg-amber-950/40 border border-amber-800/60 rounded-2xl text-[11px] text-amber-200 flex items-start gap-2.5 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300">Pernyataan Penting:</span> Modul ini adalah latihan kesadaran diri (body awareness), BUKAN alat diagnosis medis atau pengganti dokter. Tubuh layak didengarkan dengan penuh perhatian tanpa menghakimi. Jika Anda mengalami keluhan fisik berat, menetap, atau mengkhawatirkan, segera berkonsultasi dengan tenaga kesehatan.
          </div>
        </div>
      </div>

      {/* Mode 1: Alur Body Scan 8-Step */}
      {activeTab === 'body-scan' && (
        <div className="bg-stone-900/90 border border-stone-800 p-6 md:p-8 rounded-3xl space-y-6 animate-fade-in">
          {/* Duration Selector & Controls Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-4 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-stone-300">Pilih Durasi Latihan:</span>
              <div className="flex gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800">
                {DURATIONS.map((dur) => (
                  <button
                    key={dur}
                    onClick={() => setSelectedDuration(dur)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
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

            <div className="flex items-center gap-3">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4" /> Tahap {currentStep + 1} / 8: {ALUR_LATIHAN[currentStep].title}
              </span>
              <button
                onClick={handleResetScan}
                className="text-stone-400 hover:text-stone-200 flex items-center gap-1 transition text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>

          {/* Current Step Instruction Box */}
          <div className="p-5 bg-stone-950/80 border border-stone-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">
                Panduan Pemandu AI (Body Scan)
              </p>
              <VoiceGuideButton
                text={ALUR_LATIHAN[currentStep].prompt}
                title={ALUR_LATIHAN[currentStep].title}
                subtitle="Instruksi Pemindaian Tubuh"
                variant="compact"
              />
            </div>
            <p className="text-sm md:text-base text-stone-200 font-medium leading-relaxed">
              "{ALUR_LATIHAN[currentStep].prompt}"
            </p>
          </div>

          {/* Step 1: Berhenti Sejenak */}
          {currentStep === 0 && (
            <div className="py-6 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 flex items-center justify-center mx-auto shadow-xl animate-pulse">
                <Activity className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-stone-100">
                Berhenti Sejenak & Sambut Diri Anda
              </h3>
              <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
                Niatkan latihan {selectedDuration} menit ini untuk menyapa tubuh dengan ramah. Tidak perlu terburu-buru, tidak perlu memaksa merasakan sesuatu.
              </p>
            </div>
          )}

          {/* Step 2-4: Selection & Scan Areas */}
          {currentStep >= 1 && currentStep <= 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Pilih Area Tubuh Yang Sudah Anda Pindai / Sadari:
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_BODY_AREAS.map((area) => {
                    const isSelected = scannedZones.includes(area);
                    return (
                      <button
                        key={area}
                        onClick={() => toggleZone(area)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                          isSelected
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-200 shadow-sm'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        {area} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Bagian Paling Menarik Perhatian */}
          {currentStep === 4 && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-stone-300">
                Bagian Tubuh Mana Yang Paling Menarik Perhatian Anda Saat Ini?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ALL_BODY_AREAS.map((area) => (
                  <button
                    key={area}
                    onClick={() => setPrimaryZone(area)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition ${
                      primaryZone === area
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Jenis Sensasi yang Muncul */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-300">
                  Sensasi Apa Yang Anda Rasakan di Area {primaryZone}?
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SENSATIONS.map((sens) => {
                    const isSelected = selectedSensations.includes(sens);
                    return (
                      <button
                        key={sens}
                        onClick={() => toggleSensation(sens)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                          isSelected
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-200 shadow-sm'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        {sens} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Severe Pain / Discomfort Check */}
              <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl space-y-2">
                <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasSeverePain}
                    onChange={(e) => setHasSeverePain(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                  <span>Sensasi terasa berupa keluhan nyeri fisik yang sangat berat / memburuk</span>
                </label>
                {hasSeverePain && (
                  <div className="p-3 bg-amber-950/60 border border-amber-800/80 rounded-lg text-[11px] text-amber-200 space-y-2">
                    <p>
                      <strong>Catatan Pengingat Kesehatan:</strong> AI tidak dapat menyimpulkan penyebab nyeri. Jika nyeri terasa berat, memburuk, atau berlangsung lama, mohon segera berkonsultasi dengan dokter atau fasilitas kesehatan terdekat.
                    </p>
                    <button
                      onClick={() => onSelectModule && onSelectModule('breathing')}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-[10px] font-bold"
                    >
                      Alihkan ke Latihan Napas Ringan (LEGA Breathing)
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 7: Perubahan Sensasi & Hubungan Emosi */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-300">
                  Bagaimana Hubungan Sensasi Fisik Ini Dengan Emosi Yang Sedang Anda Alami?
                </label>
                <input
                  type="text"
                  value={currentEmotion}
                  onChange={(e) => setCurrentEmotion(e.target.value)}
                  placeholder="Contoh: Merasa cemas tentang pekerjaan, terasa sesak di dada..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-3">
                <p className="text-xs font-semibold text-stone-300">
                  Apakah Sensasi Tersebut Berubah Saat Diberi Perhatian Sadar?
                </p>
                <div className="flex gap-3 text-xs">
                  <button
                    onClick={() => setIsSensationChanging(true)}
                    className={`px-4 py-2 rounded-xl font-bold border transition ${
                      isSensationChanging
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-stone-900 border-stone-800 text-stone-400'
                    }`}
                  >
                    Ya, Berubah / Mereda / Bergeser
                  </button>
                  <button
                    onClick={() => setIsSensationChanging(false)}
                    className={`px-4 py-2 rounded-xl font-bold border transition ${
                      !isSensationChanging
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-stone-900 border-stone-800 text-stone-400'
                    }`}
                  >
                    Tidak, Tetap Konstan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 8: Refleksi & Output AI */}
          {currentStep === 7 && (
            <div className="space-y-5">
              <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-300">
                    Apakah Ada Bagian Tubuh Yang Terasa Lebih Rileks? (Skala Kenyamanan 1-10)
                  </span>
                  <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-bold">
                    {comfortRating}/10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={comfortRating}
                  onChange={(e) => setComfortRating(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-stone-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-300">
                  Catatan Refleksi Singkat Pengalaman Tubuh Anda:
                </label>
                <textarea
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="Apa yang Anda pelajari tentang tubuh Anda setelah latihan ini?"
                  rows={2}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleCompleteBodyScan}
                  disabled={isProcessing}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs sm:text-sm transition inline-flex items-center gap-2 shadow-xl shadow-emerald-950/50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sintesis Pengamatan Tubuh...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generasi Output Latihan LEGA Body Awareness</span>
                    </>
                  )}
                </button>
              </div>

              {/* AI Somatic Output Card */}
              {somaticOutput && (
                <div className="p-6 bg-stone-950 border border-stone-800 rounded-2xl space-y-5 animate-fade-in text-left">
                  <div className="space-y-2 border-b border-stone-800 pb-3">
                    <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Ringkasan Latihan Kesadaran Tubuh
                    </p>
                    <p className="text-xs text-stone-200 leading-relaxed">
                      {somaticOutput.somaticSummary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl space-y-1">
                      <p className="text-stone-400 text-[10px] uppercase font-bold">Bagian Tubuh Utama</p>
                      <p className="font-bold text-emerald-300">{somaticOutput.primaryBodyZone || primaryZone}</p>
                    </div>
                    <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl space-y-1">
                      <p className="text-stone-400 text-[10px] uppercase font-bold">Sensasi Yang Diamati</p>
                      <p className="font-bold text-emerald-300">{somaticOutput.reportedSensations || selectedSensations.join(', ')}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-emerald-400" /> Hubungan Antara Tubuh & Emosi
                    </p>
                    <p className="text-xs text-stone-300 italic leading-relaxed bg-stone-900/90 p-4 rounded-xl border border-stone-800">
                      "{somaticOutput.bodyEmotionRelation}"
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-emerald-400" /> Refleksi & Wawasan Somatis
                    </p>
                    <p className="text-xs text-stone-300 leading-relaxed bg-emerald-950/20 p-4 rounded-xl border border-emerald-900/40">
                      "{somaticOutput.reflectionInsight}"
                    </p>
                  </div>

                  {somaticOutput.relaxationTip && (
                    <div className="p-3 bg-emerald-950/50 border border-emerald-800/60 rounded-xl text-xs text-emerald-200 italic">
                      Tip Pelemasan: {somaticOutput.relaxationTip}
                    </div>
                  )}

                  {/* Connected Next Modules */}
                  <div className="pt-3 border-t border-stone-800 space-y-3">
                    <p className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-emerald-400" /> Rekomendasi Latihan Terhubung berikutnya:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {somaticOutput.recommendedNextModules && Array.isArray(somaticOutput.recommendedNextModules) ? (
                        somaticOutput.recommendedNextModules.map((mod: any, idx: number) => (
                          <div key={idx} className="p-3 bg-stone-900 border border-stone-800 rounded-xl space-y-1 text-left">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-emerald-300">{mod.moduleName}</span>
                              <button
                                onClick={() => onSelectModule && onSelectModule(mod.targetModuleKey || 'breathing')}
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
                            onClick={() => onSelectModule && onSelectModule('breathing')}
                            className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-left hover:border-emerald-700 transition"
                          >
                            <p className="font-bold text-xs text-emerald-300">LEGA Breathing</p>
                            <p className="text-[10px] text-stone-400 mt-0.5">Latihan napas terpandu</p>
                          </button>
                          <button
                            onClick={() => onSelectModule && onSelectModule('observer')}
                            className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-left hover:border-emerald-700 transition"
                          >
                            <p className="font-bold text-xs text-emerald-300">LEGA Observer</p>
                            <p className="text-[10px] text-stone-400 mt-0.5">Amati batin sebagai saksi</p>
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

          {/* Step Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-800">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-300 rounded-xl text-xs font-medium transition"
            >
              Sebelumnya
            </button>

            <button
              onClick={() => setCurrentStep((prev) => Math.min(7, prev + 1))}
              disabled={currentStep === 7}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <span>{currentStep === 6 ? 'Selesaikan & Dapatkan Output AI' : 'Langkah Selanjutnya'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Mode 2: Area & Jenis Sensasi Overview */}
      {activeTab === 'somatic-map' && (
        <div className="bg-stone-900/90 border border-stone-800 p-6 rounded-3xl space-y-6 animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span>Daftar Lengkap Area Pengamatan & Jenis Sensasi Fisik</span>
            </h3>
            <p className="text-xs text-stone-400">
              Gunakan referensi ini untuk mengidentifikasi sensasi fisik dengan jujur dan netral:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 bg-stone-950 border border-stone-800 rounded-2xl space-y-3">
              <h4 className="font-bold text-emerald-300 text-xs uppercase tracking-wider">
                20 Area Pengamatan Tubuh
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {ALL_BODY_AREAS.map((area) => (
                  <span
                    key={area}
                    className="px-2.5 py-1 bg-stone-900 border border-stone-800 text-stone-300 text-xs rounded-lg font-medium"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 bg-stone-950 border border-stone-800 rounded-2xl space-y-3">
              <h4 className="font-bold text-emerald-300 text-xs uppercase tracking-wider">
                16 Jenis Sensasi Fisik
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {ALL_SENSATIONS.map((sens) => (
                  <span
                    key={sens}
                    className="px-2.5 py-1 bg-stone-900 border border-stone-800 text-emerald-200/80 text-xs rounded-lg font-medium"
                  >
                    {sens}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Apresiasi Somatis */}
      {activeTab === 'gratitude' && (
        <div className="bg-stone-900/90 border border-stone-800 p-6 md:p-8 rounded-3xl space-y-6 animate-fade-in text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-stone-100">
              Apresiasi & Ucapan Terima Kasih Kepada Tubuh
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Tubuh bukan musuh dan tidak perlu dilawan. Kirimkan pesan kasih sayang dan rasa terima kasih kepada rumah fisik Anda.
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-3">
            <textarea
              value={gratitudeText}
              onChange={(e) => {
                setGratitudeText(e.target.value);
                setGratitudeSaved(false);
              }}
              placeholder="Contoh: Terima kasih paru-paruku yang selalu bernapas, terima kasih kakiku yang tangguh..."
              rows={4}
              className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 text-xs text-stone-100 outline-none focus:border-emerald-500"
            />

            <button
              onClick={() => setGratitudeSaved(true)}
              disabled={!gratitudeText.trim()}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-800 text-white font-semibold rounded-xl text-xs transition inline-flex items-center gap-2 shadow-lg shadow-emerald-950/40"
            >
              <Heart className="w-4 h-4" />
              <span>Simpan Catatan Apresiasi Tubuh</span>
            </button>

            {gratitudeSaved && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs rounded-xl flex items-center justify-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Pesan apresiasi tubuhmu telah tersimpan dengan hangat.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
