import React, { useState } from 'react';
import {
  RefreshCw,
  Wind,
  Sparkles,
  BookOpen,
  Volume2,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Brain,
  Feather,
  Info,
  Clock,
  HelpCircle,
  Activity,
  Layers,
  CheckSquare,
  AlertTriangle,
  ChevronRight,
  Zap,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { reflectOverthinking } from '../lib/geminiApi';
import { JournalEntry } from '../types';
import { VoiceGuideButton } from './VoiceGuideButton';

interface LegaOverthinkingProps {
  onSelectModule: (module: string) => void;
  onAddJournal?: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
}

const TIME_FOCUS_OPTIONS = [
  { id: 'Masa Depan', label: 'Masa Depan', desc: 'Kekhawatiran, ketidakpastian, skenario buruk, atau hal yang belum terjadi' },
  { id: 'Masa Lalu', label: 'Masa Lalu', desc: 'Penyesalan, pengandaian ("seharusnya saya..."), atau mengingat kembali kesalahan' },
  { id: 'Masa Kini', label: 'Masa Kini', desc: 'Analisis berlebihan terhadap keputusan atau situasi yang sedang dihadapi sekarang' },
  { id: 'Campuran', label: 'Campuran / Melompat-lompat', desc: 'Pikiran bergerak cepat dari masa lalu ke masa depan secara berulang' },
];

const THOUGHT_CATEGORIES = [
  { id: 'Dugaan / Kekhawatiran', label: 'Dugaan & Kekhawatiran', desc: 'Membayangkan skenario buruk tanpa kepastian' },
  { id: 'Penyesalan Masa Lalu', label: 'Penyesalan & Pengandaian', desc: 'Memutar kembali kejadian yang sudah terjadi' },
  { id: 'Analisis Berlebihan', label: 'Analisis & Ragu Mengambil Keputusan', desc: 'Terjebak menimbang-nimbang opsi tanpa bertindak' },
  { id: 'Ekspektasi & Prediksi', label: 'Ekspektasi Tekanan Diri', desc: 'Tuntutan hasil sempurna atau kecemasan performa' },
];

const EMOTION_OPTIONS = [
  'Cemas', 'Tegang / Lelah', 'Takut', 'Bingung', 'Ragu', 'Jenuh',
  'Sesak', 'Sedih', 'Bersalah', 'Marah Pada Diri', 'Kewalahan'
];

export const LegaOverthinking: React.FC<LegaOverthinkingProps> = ({
  onSelectModule,
  onAddJournal,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [mainThoughtText, setMainThoughtText] = useState<string>('');
  const [selectedTimeFocus, setSelectedTimeFocus] = useState<string>('Masa Depan');
  const [selectedCategory, setSelectedCategory] = useState<string>('Dugaan / Kekhawatiran');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  
  // Interactive differentiation inputs
  const [userFacts, setUserFacts] = useState<string>('');
  const [userAssumptions, setUserAssumptions] = useState<string>('');
  const [perceivedControllable, setPerceivedControllable] = useState<string>('');
  const [microStepInput, setMicroStepInput] = useState<string>('');

  // Flag for severe/persistent symptoms
  const [isSevereOrPersistent, setIsSevereOrPersistent] = useState<boolean>(false);

  // Breathing Visualizer state for Step 2
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathingSeconds, setBreathingSeconds] = useState<number>(4);

  // Async state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reflectionResult, setReflectionResult] = useState<any>(null);
  const [journalSaved, setJournalSaved] = useState<boolean>(false);

  // Breathing timer
  React.useEffect(() => {
    if (currentStep !== 2) return;
    const interval = setInterval(() => {
      setBreathingSeconds((prev) => {
        if (prev <= 1) {
          if (breathingPhase === 'Inhale') {
            setBreathingPhase('Hold');
            return 4;
          } else if (breathingPhase === 'Hold') {
            setBreathingPhase('Exhale');
            return 6;
          } else {
            setBreathingPhase('Inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentStep, breathingPhase]);

  const toggleEmotion = (emo: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(emo) ? prev.filter((e) => e !== emo) : [...prev, emo]
    );
  };

  const handleProcessReflection = async () => {
    setIsLoading(true);
    setCurrentStep(7);

    const result = await reflectOverthinking({
      mainThoughtText,
      timeFocus: selectedTimeFocus,
      thoughtCategory: selectedCategory,
      associatedEmotions: selectedEmotions,
      perceivedControllable,
      isSevereOrPersistent,
      userAnswers: {
        facts: userFacts,
        assumptions: userAssumptions,
        microStep: microStepInput
      }
    });

    setReflectionResult(result);
    setIsLoading(false);
  };

  const handleSaveToJournal = () => {
    if (!onAddJournal || !reflectionResult) return;

    const jNote = reflectionResult.journalNote || {};
    const content = `=== REFLEKSI LEGA OVERTHINKING ===
Topik Utama / Pikiran Berulang: ${mainThoughtText || jNote.mainThought || '-'}
Fokus Waktu Pikiran: ${selectedTimeFocus}
Emosi Yang Menyertai: ${selectedEmotions.join(', ') || jNote.associatedEmotion || '-'}

Fakta Objektif Yang Ketahui:
${jNote.knownFacts || reflectionResult.breakdown?.facts || userFacts || '-'}

Asumsi / Kekhawatiran Yang Belum Tentu Terjadi:
${jNote.assumptionsMade || reflectionResult.breakdown?.assumptionsAndWorries || userAssumptions || '-'}

Hal Di Luar Kendali Yang Dilepaskan:
${reflectionResult.uncontrollableFactors || '-'}

Hal Berada Dalam Kendali & Langkah Kecil Pilihan:
${jNote.chosenMicroStep || reflectionResult.microAction || microStepInput || '-'}`;

    onAddJournal({
      title: `Refleksi Overthinking: ${selectedTimeFocus}`,
      content,
      mood: selectedEmotions[0] ? 'cemas' : 'tenang',
      tags: ['Overthinking', 'FaktaVsAsumsi', 'FokusSaatIni']
    });

    setJournalSaved(true);
  };

  const resetExercise = () => {
    setCurrentStep(1);
    setMainThoughtText('');
    setSelectedTimeFocus('Masa Depan');
    setSelectedCategory('Dugaan / Kekhawatiran');
    setSelectedEmotions([]);
    setUserFacts('');
    setUserAssumptions('');
    setPerceivedControllable('');
    setMicroStepInput('');
    setIsSevereOrPersistent(false);
    setReflectionResult(null);
    setJournalSaved(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-950/50 via-stone-900 to-slate-900/40 border border-indigo-800/40 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <RefreshCw className="w-48 h-48 text-indigo-300" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase">
            <RefreshCw className="w-3.5 h-3.5" />
            LEGA Overthinking • Version 1.0
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-100">
            Mengenali Pola Pikiran Berulang & Kembali Ke Saat Ini
          </h1>
          <p className="text-sm md:text-base text-stone-300 leading-relaxed max-w-2xl">
            Overthinking adalah kecenderungan memikirkan suatu masalah atau skenario secara berulang tanpa penyelesaian yang jelas.
            Di sini, kita tidak memaksakan pikiran berhenti, melainkan membedakan fakta vs asumsi dan mengembalikan fokus pada tindakan kecil saat ini.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-stone-400">
            <VoiceGuideButton
              text="Selamat datang di modul LEGA Overthinking. Pikiran berulang adalah tanda bahwa otak sedang berusaha mencari rasa aman. Mari kita urai fakta versus asumsi, sadari momen saat ini, dan kembalikan fokus pada langkah kecil dalam kendali Anda."
              title="Panduan LEGA Overthinking"
              subtitle="Pola Pikiran Berulang & Kehadiran"
              variant="pill"
            />
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-400" /> Bukan Diagnosis Gangguan Mental
            </span>
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-indigo-400" /> Urai Fakta vs Asumsi
            </span>
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-indigo-400" /> Langkah Kecil Realistis
            </span>
          </div>
        </div>
      </div>

      {/* Progress Steps Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 shadow-md">
        <div className="flex items-center justify-between text-xs font-medium text-stone-400 mb-2">
          <span>Langkah {currentStep} dari 7</span>
          <span className="text-indigo-400 font-semibold">
            {currentStep === 1 && '1. Pause & Kehadiran'}
            {currentStep === 2 && '2. Sadari Napas & Tubuh'}
            {currentStep === 3 && '3. Kenali Pikiran Berulang'}
            {currentStep === 4 && '4. Bedakan Fakta vs Asumsi'}
            {currentStep === 5 && '5. Perhatikan Emosi'}
            {currentStep === 6 && '6. Hal Dalam Kendali'}
            {currentStep === 7 && '7. Sintesis & Langkah Kecil AI'}
          </span>
        </div>
        <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-600 to-indigo-400 h-full transition-all duration-500"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: PAUSE & STOP SEJENAK */}
      {currentStep === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg"
        >
          <div className="flex items-center gap-3 text-indigo-400 border-b border-stone-800 pb-4">
            <Feather className="w-6 h-6" />
            <h2 className="text-xl font-bold text-stone-100">Tahap 1: Berhenti Sejenak (Pause)</h2>
          </div>

          <div className="space-y-4 text-stone-300 leading-relaxed">
            <p>
              Otak kita dirancang untuk memproses informasi dan mencari rasa aman. Namun terkadang, pikiran bekerja terlalu keras memutar skenario yang belum tentu terjadi.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
              <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  ✓ Berpikir Produktif
                </span>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Fokus pada pemecahan masalah, mencari fakta, menghasilkan keputusan konkret, dan memiliki titik henti yang jelas.
                </p>
              </div>

              <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  🔄 Berpikir Berulang (Overthinking)
                </span>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Memutar kejadian yang sama berulang kali, mengandaikan skenario buruk, ragu bertindak, dan membuat kepala terasa penuh.
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-400 italic">
              *Ingat: Tidak semua pikiran yang muncul adalah fakta. Kesadaran membantu kita memilih pikiran mana yang layak diberi perhatian.
            </p>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="bg-indigo-600 hover:bg-indigo-500 text-stone-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg"
            >
              Saya Siap, Lanjutkan <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: SADARI NAPAS & TUBUH */}
      {currentStep === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 text-center shadow-lg"
        >
          <div className="flex items-center justify-center gap-2 text-indigo-400">
            <Wind className="w-6 h-6" />
            <h2 className="text-xl font-bold text-stone-100">Tahap 2: Sadari Napas & Tubuh</h2>
          </div>

          <p className="text-stone-300 max-w-lg mx-auto text-sm md:text-base">
            Ketika kepala terasa ramai oleh pikiran, alihkan fokus sebentar ke hembusan napas untuk mengistirahatkan ketegangan batin.
          </p>

          <div className="my-8 flex flex-col items-center justify-center">
            <motion.div
              animate={{
                scale: breathingPhase === 'Inhale' ? 1.25 : breathingPhase === 'Hold' ? 1.25 : 1.0,
              }}
              transition={{ duration: breathingPhase === 'Hold' ? 0.2 : 4, ease: 'easeInOut' }}
              className="w-36 h-36 rounded-full bg-gradient-to-br from-indigo-500/20 to-indigo-900/40 border-2 border-indigo-500/50 flex flex-col items-center justify-center shadow-2xl shadow-indigo-950"
            >
              <span className="text-xs uppercase tracking-widest text-indigo-300 font-semibold">
                {breathingPhase === 'Inhale' && 'Tarik Napas'}
                {breathingPhase === 'Hold' && 'Tahan Sejenak'}
                {breathingPhase === 'Exhale' && 'Hembuskan Perlahan'}
              </span>
              <span className="text-3xl font-bold text-stone-100 mt-1">{breathingSeconds}</span>
            </motion.div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-stone-800">
            <button
              onClick={() => setCurrentStep(1)}
              className="text-stone-400 hover:text-stone-200 text-sm font-medium"
            >
              Kembali
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="bg-indigo-600 hover:bg-indigo-500 text-stone-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
            >
              Napas Sudah Tenang <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 3: KENALI PIKIRAN YANG SEDANG MUNCUL */}
      {currentStep === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg"
        >
          <div className="flex items-center gap-3 text-indigo-400 border-b border-stone-800 pb-4">
            <RefreshCw className="w-6 h-6" />
            <h2 className="text-xl font-bold text-stone-100">Tahap 3: Kenali Pikiran Berulang</h2>
          </div>

          {/* Time Focus */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-stone-200 block">
              Pikiran ini terutama berkaitan dengan fokus waktu mana?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TIME_FOCUS_OPTIONS.map((tf) => (
                <button
                  key={tf.id}
                  type="button"
                  onClick={() => setSelectedTimeFocus(tf.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    selectedTimeFocus === tf.id
                      ? 'bg-indigo-950/60 border-indigo-500 text-stone-100 font-semibold shadow-sm'
                      : 'bg-stone-950/40 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {tf.label}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1 leading-normal">{tf.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Thought Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-200 block">
              Apa pikiran atau isu yang paling banyak menyita kepala Anda saat ini?
            </label>
            <textarea
              value={mainThoughtText}
              onChange={(e) => setMainThoughtText(e.target.value)}
              rows={4}
              placeholder="Tuliskan saja tanpa perlu khawatir kelihatan berantakan..."
              className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3.5 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-indigo-500/80 transition-all"
            />
          </div>

          {/* Severe Symptoms Toggle */}
          <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-4 flex items-start gap-3">
            <input
              type="checkbox"
              id="severeCheck"
              checked={isSevereOrPersistent}
              onChange={(e) => setIsSevereOrPersistent(e.target.checked)}
              className="mt-1 rounded border-stone-700 bg-stone-900 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="severeCheck" className="text-xs text-stone-300 leading-relaxed cursor-pointer">
              <span className="font-semibold text-stone-200 block mb-0.5">Overthinking ini berlangsung lama / sangat mengganggu tidur dan harian</span>
              Jika diaktifkan, AI akan menyertakan bahasa rekomendasi berkonsultasi dengan profesional secara ramah dan tenang.
            </label>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-stone-800">
            <button
              onClick={() => setCurrentStep(2)}
              className="text-stone-400 hover:text-stone-200 text-sm font-medium"
            >
              Kembali
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="bg-indigo-600 hover:bg-indigo-500 text-stone-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
            >
              Lanjut Urai Fakta vs Asumsi <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 4: BEDAKAN FAKTA VS ASUMSI / DUGAN */}
      {currentStep === 4 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg"
        >
          <div className="flex items-center gap-3 text-indigo-400 border-b border-stone-800 pb-4">
            <Layers className="w-6 h-6" />
            <h2 className="text-xl font-bold text-stone-100">Tahap 4: Bedakan Fakta vs Asumsi</h2>
          </div>

          <p className="text-stone-300 text-sm leading-relaxed">
            Sering kali overthinking mencampuradukkan antara apa yang <span className="text-emerald-400 font-semibold">nyata terjadi (Fakta)</span> dan apa yang <span className="text-amber-400 font-semibold">baru dibayangkan (Asumsi/Dugaan)</span>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fact Input */}
            <div className="space-y-2 bg-stone-950/60 border border-emerald-900/40 p-4 rounded-xl">
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> 1. Fakta Nyata (Yang Sudah Pasti)
              </label>
              <textarea
                value={userFacts}
                onChange={(e) => setUserFacts(e.target.value)}
                rows={3}
                placeholder="Misal: Saya ada tugas deadline besok jam 5 sore."
                className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2.5 text-xs text-stone-200 focus:outline-none focus:border-emerald-500/80"
              />
            </div>

            {/* Assumption Input */}
            <div className="space-y-2 bg-stone-950/60 border border-amber-900/40 p-4 rounded-xl">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" /> 2. Asumsi / Dugaan (Yang Belum Pasti)
              </label>
              <textarea
                value={userAssumptions}
                onChange={(e) => setUserAssumptions(e.target.value)}
                rows={3}
                placeholder="Misal: Saya yakin hasil karya saya pasti dikritik pedas..."
                className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/80"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-stone-800">
            <button
              onClick={() => setCurrentStep(3)}
              className="text-stone-400 hover:text-stone-200 text-sm font-medium"
            >
              Kembali
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              className="bg-indigo-600 hover:bg-indigo-500 text-stone-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
            >
              Lanjut Kenali Emosi <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 5: PERHATIKAN EMOSI YANG MENYERTAI */}
      {currentStep === 5 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg"
        >
          <div className="flex items-center gap-3 text-indigo-400 border-b border-stone-800 pb-4">
            <Activity className="w-6 h-6" />
            <h2 className="text-xl font-bold text-stone-100">Tahap 5: Perhatikan Emosi Yang Menyertai</h2>
          </div>

          <p className="text-stone-300 text-sm">
            Emosi apa saja yang biasanya menyertai ketika pikiran ini berputar? (Pilih yang terasa dominan):
          </p>

          <div className="flex flex-wrap gap-2.5">
            {EMOTION_OPTIONS.map((emo) => {
              const isSelected = selectedEmotions.includes(emo);
              return (
                <button
                  key={emo}
                  type="button"
                  onClick={() => toggleEmotion(emo)}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200 shadow-sm'
                      : 'bg-stone-950/50 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  {emo} {isSelected && '✓'}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-stone-800">
            <button
              onClick={() => setCurrentStep(4)}
              className="text-stone-400 hover:text-stone-200 text-sm font-medium"
            >
              Kembali
            </button>
            <button
              onClick={() => setCurrentStep(6)}
              className="bg-indigo-600 hover:bg-indigo-500 text-stone-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
            >
              Lanjut Hal Dalam Kendali <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 6: HAL YANG DALAM KENDALI VS LUAR KENDALI */}
      {currentStep === 6 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg"
        >
          <div className="flex items-center gap-3 text-indigo-400 border-b border-stone-800 pb-4">
            <CheckSquare className="w-6 h-6" />
            <h2 className="text-xl font-bold text-stone-100">Tahap 6: Tentukan Hal Dalam Kendali</h2>
          </div>

          <div className="space-y-4">
            <p className="text-stone-300 text-sm">
              Bagian mana dari isu ini yang benar-benar masih berada dalam kendali langsung Anda saat ini?
            </p>

            <input
              type="text"
              value={perceivedControllable}
              onChange={(e) => setPerceivedControllable(e.target.value)}
              placeholder="Misal: Tindakan saya selama 10 menit ke depan, respons saya..."
              className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3.5 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-indigo-500/80"
            />

            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block">
                Tindakan kecil 2 menit apa yang bisa Anda lakukan sekarang? (Opsional):
              </label>
              <input
                type="text"
                value={microStepInput}
                onChange={(e) => setMicroStepInput(e.target.value)}
                placeholder="Misal: Minum air hangat, menulis 1 kalimat, atau merapikan meja..."
                className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3.5 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-indigo-500/80"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-stone-800">
            <button
              onClick={() => setCurrentStep(5)}
              className="text-stone-400 hover:text-stone-200 text-sm font-medium"
            >
              Kembali
            </button>
            <button
              onClick={handleProcessReflection}
              className="bg-indigo-600 hover:bg-indigo-500 text-stone-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg"
            >
              Proses Analisis AI <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 7: SINTESIS & HASIL REFLEKSI AI GEMINI */}
      {currentStep === 7 && (
        <div className="space-y-6">
          {isLoading ? (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center space-y-4 shadow-xl">
              <Sparkles className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
              <h3 className="text-lg font-bold text-stone-200">Mengurai Pola Overthinking...</h3>
              <p className="text-sm text-stone-400 max-w-md mx-auto">
                LEGA AI sedang memisahkan fakta vs asumsi, mengenali hal dalam kendali, dan menyusun saran langkah kecil realistis.
              </p>
            </div>
          ) : reflectionResult ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Professional Consult Recommendation if severe */}
              {reflectionResult.professionalConsultRecommendation && (
                <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-4 flex items-start gap-3 text-amber-200 text-xs md:text-sm">
                  <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-1">Rekomendasi Bantuan Profesional:</span>
                    {reflectionResult.professionalConsultRecommendation}
                  </div>
                </div>
              )}

              {/* Main Summary Card */}
              <div className="bg-stone-900 border border-indigo-800/40 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-lg">
                    <RefreshCw className="w-6 h-6" /> Analisis Pola Overthinking
                  </div>
                  <span className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full">
                    {selectedTimeFocus}
                  </span>
                </div>

                <div className="space-y-4 text-stone-200 leading-relaxed text-sm md:text-base">
                  <p className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl text-stone-300 italic">
                    "{reflectionResult.summary}"
                  </p>

                  {/* Fact vs Assumption Breakdown */}
                  {reflectionResult.breakdown && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="bg-stone-950/50 border border-emerald-900/40 p-4 rounded-xl space-y-1.5">
                        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Fakta Objektif:
                        </h4>
                        <p className="text-xs text-stone-300 leading-relaxed">
                          {reflectionResult.breakdown.facts}
                        </p>
                      </div>

                      <div className="bg-stone-950/50 border border-amber-900/40 p-4 rounded-xl space-y-1.5">
                        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4" /> Asumsi & Skenario Bayangan:
                        </h4>
                        <p className="text-xs text-stone-300 leading-relaxed">
                          {reflectionResult.breakdown.assumptionsAndWorries}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Controllable vs Uncontrollable */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-stone-950/50 border border-stone-800 p-4 rounded-xl space-y-1">
                      <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Zap className="w-4 h-4" /> Berada Dalam Kendali Anda:
                      </h4>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        {reflectionResult.controllableFactors}
                      </p>
                    </div>

                    <div className="bg-stone-950/50 border border-stone-800 p-4 rounded-xl space-y-1">
                      <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Shield className="w-4 h-4" /> Perlu Dilepaskan / Diterima:
                      </h4>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        {reflectionResult.uncontrollableFactors}
                      </p>
                    </div>
                  </div>

                  {/* Micro Action */}
                  <div className="bg-indigo-950/40 border border-indigo-500/40 p-5 rounded-xl space-y-1">
                    <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-indigo-400" /> Satu Langkah Kecil Pilihan Hari Ini:
                    </h4>
                    <p className="text-xs md:text-sm text-stone-100 font-bold leading-relaxed">
                      "{reflectionResult.microAction}"
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-stone-800 flex flex-wrap gap-3 items-center justify-between">
                  <button
                    onClick={handleSaveToJournal}
                    disabled={journalSaved}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      journalSaved
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                        : 'bg-stone-800 hover:bg-stone-700 text-stone-100 border border-stone-700'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    {journalSaved ? 'Tersimpan di Jurnal ✓' : 'Simpan Ke LEGA Journal'}
                  </button>

                  <button
                    onClick={resetExercise}
                    className="text-stone-400 hover:text-stone-200 text-xs flex items-center gap-1 bg-stone-800 px-4 py-2 rounded-xl transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Mula Refleksi Baru
                  </button>
                </div>
              </div>

              {/* Audio & Recommended Modules */}
              {reflectionResult.recommendedAudioTheme && (
                <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] uppercase tracking-wider text-indigo-400 font-semibold block">
                      Audio Terpandu Rekomendasi
                    </span>
                    <p className="text-xs text-stone-200 font-bold">
                      Naskah Audio: "{reflectionResult.recommendedAudioTheme}"
                    </p>
                  </div>
                  <button
                    onClick={() => onSelectModule('audio-ai')}
                    className="bg-stone-800 hover:bg-stone-700 text-indigo-300 border border-indigo-500/30 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition"
                  >
                    <Volume2 className="w-4 h-4" /> Buka Audio AI
                  </button>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Latihan Lanjutan Terhubung:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {reflectionResult.recommendedModules?.map((mod: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => onSelectModule(mod.targetModuleKey)}
                      className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 hover:border-indigo-500/50 text-left space-y-1 group transition-all"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-indigo-300 group-hover:text-indigo-200">
                        <span>{mod.moduleName}</span>
                        <ChevronRight className="w-4 h-4 text-stone-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-[11px] text-stone-400 leading-normal">{mod.reason}</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      )}
    </div>
  );
};
