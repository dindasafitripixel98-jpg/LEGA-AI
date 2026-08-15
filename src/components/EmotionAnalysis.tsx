import React, { useState } from 'react';
import {
  BrainCircuit,
  Zap,
  Activity,
  Tag,
  Sparkles,
  HelpCircle,
  Wind,
  CheckCircle,
  RefreshCw,
  AlertTriangle,
  Compass,
  Layers,
  ArrowRight,
  Heart,
  ListChecks,
} from 'lucide-react';
import { EmotionCategory, EmotionLog, ModuleType } from '../types';
import { analyzeEmotion } from '../lib/geminiApi';
import { VoiceGuideButton } from './VoiceGuideButton';

interface EmotionAnalysisProps {
  onSaveLog: (log: EmotionLog) => void;
  onSelectModule: (module: ModuleType | string) => void;
}

const ALL_EMOTIONS: { category: EmotionCategory; label: string; desc: string; group: 'berat' | 'cemas' | 'positif' }[] = [
  // Emosi Berat / Luka
  { category: 'marah', label: 'Marah', desc: 'Batas terlanggar atau rasa tidak adil', group: 'berat' },
  { category: 'sedih', label: 'Sedih', desc: 'Proses menerima rasa kehilangan & luka', group: 'berat' },
  { category: 'takut', label: 'Takut', desc: 'Sinyal bahaya atau ancaman', group: 'berat' },
  { category: 'kecewa', label: 'Kecewa', desc: 'Realitas tidak sesuai harapan', group: 'berat' },
  { category: 'bersalah', label: 'Bersalah', desc: 'Rasa penyesalan atas tindakan', group: 'berat' },
  { category: 'malu', label: 'Malu', desc: 'Penilaian diri & rasa takut dinilai', group: 'berat' },
  { category: 'iri', label: 'Iri', desc: 'Keinginan atas hal yang dimiliki orang lain', group: 'berat' },
  { category: 'dendam', label: 'Dendam', desc: 'Luka & keadilan yang belum selesai', group: 'berat' },
  { category: 'panik', label: 'Panik', desc: 'Gelombang ketakutan mendadak', group: 'berat' },
  { category: 'putus_asa', label: 'Putus Asa', desc: 'Rasa kehilangan harapan', group: 'berat' },

  // Cemas, Beban & Kebingungan
  { category: 'cemas', label: 'Cemas', desc: 'Antisipasi ketidakpastian masa depan', group: 'cemas' },
  { category: 'bingung', label: 'Bingung', desc: 'Kehilangan arah atau informasi berlebih', group: 'cemas' },
  { category: 'frustrasi', label: 'Frustrasi', desc: 'Hambatan berulang menuju tujuan', group: 'cemas' },
  { category: 'kesepian', label: 'Kesepian', desc: 'Kerinduan akan koneksi batin', group: 'cemas' },
  { category: 'gelisah', label: 'Gelisah', desc: 'Energi tubuh yang tidak tenang', group: 'cemas' },
  { category: 'kosong', label: 'Kosong', desc: 'Kelelahan mendalam & keheningan batin', group: 'cemas' },
  { category: 'lelah', label: 'Lelah', desc: 'Penumpukan tekanan fisik & mental', group: 'cemas' },

  // Positif & Ketenangan
  { category: 'bahagia', label: 'Bahagia', desc: 'Rasa sukacita & kelapangan dada', group: 'positif' },
  { category: 'tenang', label: 'Tenang', desc: 'Kesadaran yang stabil & terhubung', group: 'positif' },
  { category: 'lega', label: 'Lega', desc: 'Pelepasan beban & ketegangan', group: 'positif' },
  { category: 'haru', label: 'Haru', desc: 'Resonansi kebaikan yang menyentuh', group: 'positif' },
  { category: 'bersyukur', label: 'Bersyukur', desc: 'Apresiasi mendalam atas keberadaan', group: 'positif' },
  { category: 'senang', label: 'Senang', desc: 'Keceriaan dan kehangatan energi', group: 'positif' },
];

const PHYSICAL_SENSATIONS = [
  'Dada terasa sesak / sempit',
  'Bahu & leher kaku / tegang',
  'Rahang terkatup rapat',
  'Perut melilit / mual',
  'Kepala berat / pusing',
  'Detak jantung berdebar cepat',
  'Napas terasa pendek & dangkal',
  'Mata berat / lelah mendalam',
  'Sensasi dingin / gemetar',
  'Otot-otot terasa kencang',
];

const TRIGGER_TAGS = [
  'Pekerjaan & Tenggat Waktu',
  'Ekspektasi Berlebih',
  'Konflik Hubungan',
  'Tuntutan Finansial',
  'Masalah Kesehatan',
  'Kurang Tidur / Istirahat',
  'Rasa Kesepian',
  'Perubahan Mendadak',
  'Perbandingan Diri',
  'Kritik Orang Lain',
];

const ANALYSIS_STEPS = [
  '1. Konteks',
  '2. Emosi Utama',
  '3. Emosi Pendukung',
  '4. Intensitas',
  '5. Pemicu',
  '6. Sensasi Tubuh',
  '7. Pola Pikir',
  '8. Kebutuhan Batin',
  '9. Ringkasan',
  '10. Modul LEGA',
];

export const EmotionAnalysis: React.FC<EmotionAnalysisProps> = ({
  onSaveLog,
  onSelectModule,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EmotionCategory>('cemas');
  const [filterGroup, setFilterGroup] = useState<'all' | 'berat' | 'cemas' | 'positif'>('all');
  const [intensity, setIntensity] = useState<number>(6);
  const [selectedSensations, setSelectedSensations] = useState<string[]>(['Dada terasa sesak / sempit']);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>(['Pekerjaan & Tenggat Waktu']);
  const [notes, setNotes] = useState<string>('');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  const filteredEmotions = ALL_EMOTIONS.filter((e) => {
    if (filterGroup === 'all') return true;
    return e.group === filterGroup;
  });

  const toggleSensation = (item: string) => {
    setSelectedSensations((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleTrigger = (item: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const getIntensityText = (val: number) => {
    if (val <= 2) return 'Sangat Ringan';
    if (val <= 4) return 'Ringan';
    if (val <= 6) return 'Sedang';
    if (val <= 8) return 'Kuat';
    return 'Sangat Kuat';
  };

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    setAnalysisResult(null);

    const logData = {
      emotion: selectedCategory,
      intensity,
      physicalSensations: selectedSensations,
      triggers: selectedTriggers,
      notes,
    };

    const aiResult = await analyzeEmotion(logData);
    setAnalysisResult(aiResult);
    setAnalyzing(false);

    // Save log to central state
    const newLog: EmotionLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      emotion: selectedCategory,
      intensity,
      physicalSensations: selectedSensations,
      triggers: selectedTriggers,
      notes,
      aiAnalysis: aiResult,
    };
    onSaveLog(newLog);
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-8 text-stone-100">
      {/* Module Title Header */}
      <div className="bg-stone-900/90 border border-stone-800 p-5 md:p-6 rounded-3xl space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 rounded-2xl">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-stone-100 flex items-center gap-2">
                LEGA Emotion Analyzer
                <span className="text-xs bg-emerald-900/80 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-700 font-mono">
                  v1.0
                </span>
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Pengenal & Analis Reflektif Emosi Berdasarkan Kesadaran Diri
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <VoiceGuideButton
              text="Selamat datang di Modul Analisis Emosi LEGA. Emosi bukan musuh yang harus dilawan, melainkan sinyal berharga dari dalam diri. Luangkan waktu sejenak, pilih emosi yang Anda rasakan, amati sensasi tubuh Anda, dan biarkan AI membimbing refleksi Anda."
              title="Panduan Analisis Emosi LEGA"
              subtitle="Pengantar Kesadaran Diri Emosional"
              variant="pill"
            />
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-white font-extrabold font-mono uppercase tracking-wider block">
                SHAQILA DIGITAL 99
              </span>
              <span className="text-xs text-emerald-400 font-semibold">Self Awareness Platform</span>
            </div>
          </div>
        </div>

        {/* 10-Step Visual Flow Pills */}
        <div className="pt-2 border-t border-stone-800/80">
          <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ListChecks className="w-3.5 h-3.5 text-emerald-400" />
            <span>Alur Analisis 10-Tahap LEGA:</span>
          </p>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] scrollbar-none">
            {ANALYSIS_STEPS.map((step, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-stone-800/90 text-stone-300 border border-stone-700/80 rounded-lg whitespace-nowrap shrink-0 font-medium"
              >
                {step}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Input Section */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Emotion Selection with Group Filters */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-xs font-semibold text-stone-300 tracking-wider uppercase flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>1. Pilih Emosi Utama (23 Kategori Recognized)</span>
              </label>

              {/* Category Filter Tabs */}
              <div className="flex bg-stone-900 border border-stone-800 rounded-xl p-1 gap-1 text-[10px]">
                <button
                  onClick={() => setFilterGroup('all')}
                  className={`px-2 py-0.5 rounded-lg transition ${
                    filterGroup === 'all'
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setFilterGroup('berat')}
                  className={`px-2 py-0.5 rounded-lg transition ${
                    filterGroup === 'berat'
                      ? 'bg-rose-900/80 text-rose-200 font-semibold border border-rose-700'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Berat
                </button>
                <button
                  onClick={() => setFilterGroup('cemas')}
                  className={`px-2 py-0.5 rounded-lg transition ${
                    filterGroup === 'cemas'
                      ? 'bg-amber-900/80 text-amber-200 font-semibold border border-amber-700'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Cemas
                </button>
                <button
                  onClick={() => setFilterGroup('positif')}
                  className={`px-2 py-0.5 rounded-lg transition ${
                    filterGroup === 'positif'
                      ? 'bg-teal-900/80 text-teal-200 font-semibold border border-teal-700'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Positif
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1 text-left scrollbar-thin">
              {filteredEmotions.map((item) => {
                const isSelected = selectedCategory === item.category;
                return (
                  <button
                    key={item.category}
                    onClick={() => setSelectedCategory(item.category)}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      isSelected
                        ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500 shadow-md'
                        : 'bg-stone-900/80 hover:bg-stone-800/80 border-stone-800 text-stone-300'
                    }`}
                  >
                    <p className="font-semibold text-xs capitalize text-emerald-300 flex items-center justify-between">
                      <span>{item.label}</span>
                      {isSelected && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                    </p>
                    <p className="text-[10px] text-stone-400 line-clamp-2 mt-0.5 leading-tight">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Intensity Slider with 5 Qualitative Levels */}
          <div className="space-y-3 bg-stone-900/90 p-4 rounded-2xl border border-stone-800">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-stone-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>2. Intensitas Emosi</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400 font-medium">
                  {getIntensityText(intensity)}
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-lg font-mono font-bold text-xs">
                  {intensity} / 10
                </span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-stone-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="grid grid-cols-5 text-[9px] text-stone-400 font-medium text-center">
              <span className={intensity <= 2 ? 'text-emerald-400 font-bold' : ''}>Sangat Ringan (1-2)</span>
              <span className={intensity >= 3 && intensity <= 4 ? 'text-emerald-400 font-bold' : ''}>Ringan (3-4)</span>
              <span className={intensity >= 5 && intensity <= 6 ? 'text-amber-400 font-bold' : ''}>Sedang (5-6)</span>
              <span className={intensity >= 7 && intensity <= 8 ? 'text-rose-400 font-bold' : ''}>Kuat (7-8)</span>
              <span className={intensity >= 9 ? 'text-rose-400 font-bold' : ''}>Sangat Kuat (9-10)</span>
            </div>
          </div>

          {/* 3. Physical Sensations Checklist */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-stone-300 tracking-wider uppercase block flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-400" />
              <span>3. Sensasi Fisik pada Tubuh (Somatis)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PHYSICAL_SENSATIONS.map((sens) => {
                const checked = selectedSensations.includes(sens);
                return (
                  <button
                    key={sens}
                    onClick={() => toggleSensation(sens)}
                    className={`p-2.5 rounded-xl text-xs text-left border transition flex items-center justify-between ${
                      checked
                        ? 'bg-teal-950/70 border-teal-600 text-teal-200 font-medium'
                        : 'bg-stone-900/80 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <span>{sens}</span>
                    {checked && <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Trigger Tags */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-stone-300 tracking-wider uppercase block flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>4. Pemicu Utama (Triggers)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {TRIGGER_TAGS.map((tag) => {
                const checked = selectedTriggers.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTrigger(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs border transition ${
                      checked
                        ? 'bg-amber-950/70 border-amber-600 text-amber-300 font-medium'
                        : 'bg-stone-900/80 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Additional Notes */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-300 uppercase block">
              5. Cerita / Konteks Tambahan (Opsional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ceritakan kejadian spesifik, pikiran yang muncul, atau harapan yang belum terpenuhi..."
              rows={3}
              className="w-full bg-stone-900/90 border border-stone-800 focus:border-emerald-500 rounded-xl p-3 text-xs text-stone-100 placeholder-stone-500 outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-2xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-200" />
                <span>LEGA Emotion Analyzer Sedang Menganalisis...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Jalankan Analisis Reflektif LEGA</span>
              </>
            )}
          </button>
        </div>

        {/* AI Analysis Output Section */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Hasil Analisis Reflektif</span>
            </h3>
            {analysisResult && (
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                Lengkap (10-Tahap)
              </span>
            )}
          </div>

          {analysisResult ? (
            <div className="space-y-4 animate-fade-in">
              {/* Voice Player Banner for Complete Analysis */}
              <VoiceGuideButton
                text={`Hasil Analisis Kesadaran Diri LEGA. Emosi utama yang teridentifikasi adalah ${analysisResult.primaryEmotion || selectedCategory}, dengan intensitas ${analysisResult.intensityLevel || getIntensityText(intensity)}. ${analysisResult.summary}. Sensasi tubuh: ${analysisResult.bodySensations || analysisResult.mindBodyPerspective || ''}. Kebutuhan batin terdalam: ${analysisResult.underlyingNeed}. Saran reflektif: ${analysisResult.reflectiveQuestion || (Array.isArray(analysisResult.reflectiveQuestions) ? analysisResult.reflectiveQuestions[0] : '')}. Luangkan waktu untuk bernapas dan izinkan diri Anda merasakan dengan lembut tanpa menghakimi.`}
                title={`Audio Analisis: ${analysisResult.primaryEmotion || selectedCategory}`}
                subtitle="Dengarkan pembacaan diagnostik & panduan batin LEGA"
                variant="banner"
              />

              {/* Emergency / Safety Alert if detected */}
              {analysisResult.emergencyNotice && (
                <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-rose-300">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Perhatian & Dukungan Keamanan</span>
                  </div>
                  <p className="text-xs text-rose-100 leading-relaxed">
                    {analysisResult.emergencyNotice}
                  </p>
                </div>
              )}

              {/* Primary & Secondary Emotions Badge */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                    Identifikasi Emosi
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full text-[10px] font-bold">
                    Intensitas: {analysisResult.intensityLevel || getIntensityText(intensity)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="px-3 py-1 bg-emerald-950/90 text-emerald-300 border border-emerald-700 rounded-xl text-xs font-bold capitalize">
                    {analysisResult.primaryEmotion || selectedCategory} (Utama)
                  </span>
                  {analysisResult.secondaryEmotions &&
                    analysisResult.secondaryEmotions.map((sec: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-stone-800 text-stone-300 border border-stone-700 rounded-xl text-xs capitalize"
                      >
                        {sec}
                      </span>
                    ))}
                </div>
              </div>

              {/* Situation Summary */}
              <div className="p-4.5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>Ringkasan Situasi Reflektif</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {analysisResult.summary}
                </p>
              </div>

              {/* Somatic & Body Perspective */}
              <div className="p-4.5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1.5">
                <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs">
                  <Activity className="w-4 h-4" />
                  <span>Respon Somatis / Sensasi Tubuh</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {analysisResult.bodySensations || analysisResult.mindBodyPerspective}
                </p>
              </div>

              {/* Thought Patterns */}
              {analysisResult.thoughtPatterns && (
                <div className="p-4.5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                    <BrainCircuit className="w-4 h-4" />
                    <span>Pola Pikir yang Tampak</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {analysisResult.thoughtPatterns}
                  </p>
                </div>
              )}

              {/* Underlying Need */}
              <div className="p-4.5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs">
                  <Zap className="w-4 h-4" />
                  <span>Kebutuhan Batin Tersembunyi</span>
                </div>
                <p className="text-xs text-stone-200 font-medium leading-relaxed">
                  {analysisResult.underlyingNeed}
                </p>
              </div>

              {/* Reflective Questions */}
              <div className="p-4.5 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
                <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs">
                  <HelpCircle className="w-4 h-4" />
                  <span>Pertanyaan Refleksi Eksploratif</span>
                </div>
                <ul className="space-y-1.5">
                  {analysisResult.reflectiveQuestions && Array.isArray(analysisResult.reflectiveQuestions) ? (
                    analysisResult.reflectiveQuestions.map((q: string, idx: number) => (
                      <li key={idx} className="text-xs text-stone-200 italic leading-relaxed flex items-start gap-2">
                        <span className="text-sky-400 font-bold shrink-0">•</span>
                        <span>"{q}"</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-stone-200 italic leading-relaxed">
                      "{analysisResult.reflectiveQuestion || 'Apa satu hal kecil yang paling kamu butuhkan saat ini?'}"
                    </li>
                  )}
                </ul>
              </div>

              {/* Recommended LEGA Modules */}
              <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-emerald-400" />
                    <span>Rekomendasi Modul LEGA</span>
                  </span>
                  <span className="text-[10px] text-emerald-400">Pilih Latihan</span>
                </div>

                {analysisResult.recommendedModules && Array.isArray(analysisResult.recommendedModules) ? (
                  <div className="space-y-2">
                    {analysisResult.recommendedModules.map((mod: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 bg-stone-900/90 border border-emerald-900/80 rounded-xl space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-300">{mod.moduleName}</span>
                          <button
                            onClick={() => onSelectModule(mod.targetModuleKey || 'breathing')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-semibold transition flex items-center gap-1"
                          >
                            <span>Mulai</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-[11px] text-stone-400 leading-tight">{mod.reason}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-stone-900/90 border border-emerald-900/80 rounded-xl space-y-2">
                    <p className="text-xs text-stone-300">
                      {analysisResult.suggestedExercise || 'LEGA Breathing & Grounding Exercise'}
                    </p>
                    <button
                      onClick={() => onSelectModule('breathing')}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
                    >
                      <span>Buka Modul LEGA Breathing</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-stone-900/60 border border-stone-800/80 text-center space-y-3">
              <BrainCircuit className="w-10 h-10 text-stone-600 mx-auto" />
              <p className="text-xs text-stone-400 leading-relaxed max-w-xs mx-auto">
                Pilih emosi, sensasi tubuh, dan pemicu di panel kiri, lalu tekan tombol untuk menjalankan analisis reflektif 10-tahap LEGA.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
