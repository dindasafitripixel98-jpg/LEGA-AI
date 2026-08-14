import React, { useState } from 'react';
import {
  Baby,
  Heart,
  Wind,
  Sparkles,
  BookOpen,
  Volume2,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Feather,
  Sun,
  Smile,
  Shield,
  Clock,
  Compass,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { reflectInnerChild } from '../lib/geminiApi';
import { JournalEntry } from '../types';

interface LegaInnerChildProps {
  onSelectModule: (module: string) => void;
  onAddJournal?: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
}

const REFLECTION_AREAS = [
  { id: 'Kenangan masa kecil', label: 'Kenangan Masa Kecil', desc: 'Sesuasana, tempat, atau momen hangat/berkesan pada awal kehidupan' },
  { id: 'Hubungan dengan keluarga', label: 'Hubungan Keluarga', desc: 'Dinamika, kebiasaan, atau komunikasi di lingkungan rumah' },
  { id: 'Pengalaman sekolah', label: 'Pengalaman Sekolah', desc: 'Interaksi dengan teman sebaya, guru, dan lingkungan belajar' },
  { id: 'Pengalaman diterima', label: 'Pengalaman Diterima', desc: 'Momen ketika merasa didengar, dihargai, dan diakui secara utuh' },
  { id: 'Pengalaman ditolak', label: 'Pengalaman Ditolak', desc: 'Perasaan dikesampingkan, tidak dimengerti, atau dianggap kurang' },
  { id: 'Pengalaman kehilangan', label: 'Pengalaman Kehilangan', desc: 'Perpisahan, perubahan besar, atau hilangnya rasa nyaman' },
  { id: 'Harapan yang belum terpenuhi', label: 'Harapan Belum Terpenuhi', desc: 'Keinginan atau impian masa lalu yang belum sempat terwujud' },
  { id: 'Nilai yang dipelajari sejak kecil', label: 'Nilai Sejak Kecil', desc: 'Prinsip, keyakinan, atau aturan hidup yang diajarkan' },
  { id: 'Cara menghadapi konflik', label: 'Cara Menghadapi Konflik', desc: 'Pola merespons perselisihan atau tekanan emosional' },
  { id: 'Cara meminta bantuan', label: 'Cara Meminta Bantuan', desc: 'Keberanian mengungkapkan kebutuhan dan mempercayai orang lain' },
  { id: 'Cara menerima kasih sayang', label: 'Menerima Kasih Sayang', desc: 'Kenyamanan menerima perhatian, pujian, atau rasa peduli' },
];

const EMOTION_OPTIONS = [
  'Sedih', 'Kecewa', 'Kangen / Rindu', 'Hangat', 'Rasa Bersalah',
  'Takut / Cemas', 'Ditolak', 'Bingung', 'Terharu', 'Kesepian', 'Marah', 'Damai'
];

const EMOTIONAL_NEEDS_OPTIONS = [
  'Rasa Aman & Kepastian',
  'Penerimaan Tanpa Syarat',
  'Didengar & Dimengerti',
  'Apresiasi & Validasi Usaha',
  'Kehangatan & Pelukan Erat',
  'Kebebasan Mengekspresikan Diri',
  'Keadilan & Perlindungan'
];

export const LegaInnerChild: React.FC<LegaInnerChildProps> = ({
  onSelectModule,
  onAddJournal,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedArea, setSelectedArea] = useState<string>('Kenangan masa kecil');
  const [memoryText, setMemoryText] = useState<string>('');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [customNeedText, setCustomNeedText] = useState<string>('');
  const [selfCareText, setSelfCareText] = useState<string>('');
  
  // Custom answers for guided reflective questions
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({
    lessonCarried: '',
    currentSelfNurturing: ''
  });

  // Safety & State flags
  const [isOverwhelmed, setIsOverwhelmed] = useState<boolean>(false);
  const [isSevereTrauma, setIsSevereTrauma] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reflectionResult, setReflectionResult] = useState<any>(null);
  const [journalSaved, setJournalSaved] = useState<boolean>(false);

  // Breathing timer state for Step 2
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathingSeconds, setBreathingSeconds] = useState<number>(4);

  // Handle Breathing visualizer in step 2
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

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]
    );
  };

  const toggleNeed = (need: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  const handleProcessReflection = async () => {
    setIsLoading(true);
    setCurrentStep(7);
    
    const perceivedNeedCombined = [
      ...selectedNeeds,
      customNeedText.trim() ? customNeedText.trim() : null
    ].filter(Boolean).join(', ');

    const result = await reflectInnerChild({
      focusArea: selectedArea,
      memoryText,
      currentEmotions: selectedEmotions,
      perceivedNeedText: perceivedNeedCombined,
      currentSelfCare: selfCareText,
      isOverwhelmed,
      isSevereTrauma,
      userAnswers
    });

    setReflectionResult(result);
    setIsLoading(false);
  };

  const handleSaveToJournal = () => {
    if (!onAddJournal || !reflectionResult) return;

    const jNote = reflectionResult.journalNote || {};
    const content = `=== REFLEKSI LEGA INNER CHILD ===
Area Refleksi: ${selectedArea}
Kenangan / Pengalaman: ${jNote.memorableMemory || memoryText || '-'}
Emosi Teridentifikasi: ${selectedEmotions.join(', ') || '-'}

Kebutuhan Emosional Disadari:
${jNote.recognizedNeed || selectedNeeds.join(', ') || '-'}

Pelajaran Utama:
${jNote.lessonLearned || reflectionResult.lessonsLearned || '-'}

Bentuk Perhatian & Merawat Diri Hari Ini:
${jNote.selfCareForm || reflectionResult.selfNurturingAction || '-'}

Harapan Masa Depan:
${jNote.futureHope || 'Tumbuh dengan belas kasih dan ruang batin yang lebih sehat.'}`;

    onAddJournal({
      title: `Refleksi Inner Child: ${selectedArea}`,
      content,
      mood: selectedEmotions[0] ? 'tenang' : 'netral',
      tags: ['InnerChild', 'BelasKasih', 'RefleksiMasaLalu']
    });

    setJournalSaved(true);
  };

  const resetExercise = () => {
    setCurrentStep(1);
    setMemoryText('');
    setSelectedEmotions([]);
    setSelectedNeeds([]);
    setCustomNeedText('');
    setSelfCareText('');
    setUserAnswers({ lessonCarried: '', currentSelfNurturing: '' });
    setIsOverwhelmed(false);
    setIsSevereTrauma(false);
    setReflectionResult(null);
    setJournalSaved(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-amber-950/40 via-stone-900 to-amber-900/20 border border-amber-800/40 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Baby className="w-48 h-48 text-amber-300" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide uppercase">
            <Baby className="w-3.5 h-3.5" />
            LEGA Inner Child • Version 1.0
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-100">
            Merefleksikan Pengalaman & Merawat Diri Masa Kini
          </h1>
          <p className="text-sm md:text-base text-stone-300 leading-relaxed max-w-2xl">
            "Inner Child" adalah metafora untuk mengeksplorasi kenangan, kebutuhan emosional, dan pola awal kehidupan.
            Proses ini hadir untuk memberikan belas kasih kepada perjalanan Anda, tanpa menyalahkan siapapun.
          </p>

          {/* Explicit Disclaimers */}
          <div className="pt-2 flex flex-wrap gap-2 text-xs text-stone-400">
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400" /> Bukan Terapi Trauma
            </span>
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" /> Bebas Menghakimi
            </span>
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-amber-400" /> Belas Kasih Diri
            </span>
          </div>
        </div>
      </div>

      {/* Progress Steps Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 shadow-md">
        <div className="flex items-center justify-between text-xs font-medium text-stone-400 mb-2">
          <span>Langkah {currentStep} dari 8</span>
          <span className="text-amber-400 font-semibold">
            {currentStep === 1 && '1. Pause & Kehadiran'}
            {currentStep === 2 && '2. Sadari Napas'}
            {currentStep === 3 && '3. Perhatikan Diri Saat Ini'}
            {currentStep === 4 && '4. Kenali Kenangan & Area'}
            {currentStep === 5 && '5. Kenali Emosi'}
            {currentStep === 6 && '6. Kebutuhan Emosional'}
            {currentStep === 7 && '7. Sintesis & Pelajaran AI'}
            {currentStep === 8 && '8. Langkah Merawat Diri'}
          </span>
        </div>
        <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-600 to-amber-400 h-full transition-all duration-500"
            style={{ width: `${(currentStep / 8) * 100}%` }}
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
          <div className="flex items-center gap-3 text-amber-400 border-b border-stone-800 pb-4">
            <Feather className="w-6 h-6" />
            <h2 className="text-xl font-bold text-stone-100">Tahap 1: Berhenti Sejenak (Pause)</h2>
          </div>

          <div className="space-y-4 text-stone-300 leading-relaxed">
            <p>
              Sebelum melangkah lebih jauh, luangkan waktu sejenak untuk melepaskan segala beban, ekspetasi, dan penilaian terhadap diri sendiri.
            </p>
            <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Prinsip Keselamatan & Kenyamanan Ruang Ini:
              </h3>
              <ul className="text-xs md:text-sm text-stone-300 space-y-2 list-disc list-inside">
                <li>Anda berada di ruang yang aman dan rahasia.</li>
                <li>Refleksi ini dilakukan secara perlahan. Anda bebas berhenti kapan saja.</li>
                <li>AI tidak menyalahkan orang tua, keluarga, atau siapapun dalam hidup Anda.</li>
                <li>Masa lalu tidak dapat diubah, namun cara Anda merawat diri pada masa kini dapat dikembangkan.</li>
              </ul>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg"
            >
              Saya Siap, Lanjutkan <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: SADARI NAPAS */}
      {currentStep === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 text-center shadow-lg"
        >
          <div className="flex items-center justify-center gap-2 text-amber-400">
            <Wind className="w-6 h-6" />
            <h2 className="text-xl font-bold text-stone-100">Tahap 2: Sadari Napas</h2>
          </div>

          <p className="text-stone-300 max-w-lg mx-auto text-sm md:text-base">
            Gunakan napas sebagai jangkar ketenangan Anda. Ambil ritme napas yang rileks dan alami.
          </p>

          <div className="my-8 flex flex-col items-center justify-center">
            <motion.div
              animate={{
                scale: breathingPhase === 'Inhale' ? 1.25 : breathingPhase === 'Hold' ? 1.25 : 1.0,
              }}
              transition={{ duration: breathingPhase === 'Hold' ? 0.2 : 4, ease: 'easeInOut' }}
              className="w-36 h-36 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-900/40 border-2 border-amber-500/50 flex flex-col items-center justify-center shadow-2xl shadow-amber-950"
            >
              <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
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
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
            >
              Napas Sudah Tenang <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 3: PERHATIKAN KONDISI DIRI SAAT INI */}
      {currentStep === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg"
        >
          <div className="flex items-center gap-3 text-amber-400 border-b border-stone-800 pb-4">
            <Compass className="w-6 h-6" />
            <h2 className="text-xl font-bold text-stone-100">Tahap 3: Perhatikan Kondisi Diri Saat Ini</h2>
          </div>

          <p className="text-stone-300 text-sm md:text-base">
            Sebelum mengeksplorasi kenangan, perhatikan kesiapan fisik dan mental Anda saat ini:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                setIsOverwhelmed(false);
                setIsSevereTrauma(false);
              }}
              className={`p-5 rounded-xl border text-left transition-all ${
                !isOverwhelmed && !isSevereTrauma
                  ? 'bg-amber-950/40 border-amber-500/80 text-stone-100 shadow-md'
                  : 'bg-stone-950/50 border-stone-800 text-stone-400 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-amber-300 mb-1">
                <Smile className="w-5 h-5" /> Kondisi Tenang / Cukup Siap
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Pikiran cukup stabil dan siap mengeksplorasi pengalaman hidup secara fleksibel.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOverwhelmed(true);
              }}
              className={`p-5 rounded-xl border text-left transition-all ${
                isOverwhelmed
                  ? 'bg-amber-950/60 border-amber-500 text-amber-200 shadow-md'
                  : 'bg-stone-950/50 border-stone-800 text-stone-400 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-amber-400 mb-1">
                <AlertTriangle className="w-5 h-5" /> Merasa Cemas / Emosi Cukup Kuat
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Sedang merasa lelah atau emosi terasa intens. AI akan memberikan pendampingan ekstra lembut.
              </p>
            </button>
          </div>

          {/* Trauma Option */}
          <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-4 flex items-start gap-3">
            <input
              type="checkbox"
              id="traumaCheck"
              checked={isSevereTrauma}
              onChange={(e) => setIsSevereTrauma(e.target.checked)}
              className="mt-1 rounded border-stone-700 bg-stone-900 text-amber-600 focus:ring-amber-500"
            />
            <label htmlFor="traumaCheck" className="text-xs text-stone-300 leading-relaxed cursor-pointer">
              <span className="font-semibold text-stone-200 block mb-0.5">Pengalaman ini berkaitan dengan trauma berat / kilas balik sangat mengganggu</span>
              Jika diaktifkan, AI tidak akan meminta detail kejadian dan akan memberikan opsi bantuan profesional secara tenang.
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
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
            >
              Lanjutkan Ke Refleksi <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 4: KENALI KENANGAN & AREA REFLEKSI */}
      {currentStep === 4 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg"
        >
          <div className="flex items-center gap-3 text-amber-400 border-b border-stone-800 pb-4">
            <BookOpen className="w-6 h-6" />
            <h2 className="text-xl font-bold text-stone-100">Tahap 4: Pilih Area & Refleksikan Kenangan</h2>
          </div>

          {/* Area Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-stone-200 block">
              11 Area Refleksi Inner Child (Pilih yang paling relevan):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {REFLECTION_AREAS.map((area) => (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => setSelectedArea(area.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedArea === area.id
                      ? 'bg-amber-950/60 border-amber-500 text-stone-100 font-semibold shadow-sm'
                      : 'bg-stone-950/40 border-stone-800/80 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="text-xs font-bold text-amber-300">{area.label}</div>
                  <div className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">{area.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Memory Textarea */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-200 block">
              Pengalaman atau kenangan apa yang ingin Anda refleksikan? (Opsional / Seperlunya):
            </label>
            <textarea
              value={memoryText}
              onChange={(e) => setMemoryText(e.target.value)}
              rows={4}
              placeholder="Ceritakan dengan kata-kata sederhana yang terasa nyaman bagi Anda..."
              className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3.5 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/80 transition-all"
            />
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
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
            >
              Lanjut Kenali Emosi <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 5: KENALI EMOSI YANG MUNCUL */}
      {currentStep === 5 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg"
        >
          <div className="flex items-center gap-3 text-amber-400 border-b border-stone-800 pb-4">
            <Heart className="w-6 h-6" />
            <h2 className="text-xl font-bold text-stone-100">Tahap 5: Kenali Emosi Yang Muncul</h2>
          </div>

          <p className="text-stone-300 text-sm">
            Ketika mengingat pengalaman tersebut, emosi apa saja yang hadir? (Boleh memilih lebih dari satu):
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
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-sm'
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
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
            >
              Lanjut Kebutuhan Emosional <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 6: KEBUTUHAN EMOSIONAL YANG BELUM TERPENUHI */}
      {currentStep === 6 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg"
        >
          <div className="flex items-center gap-3 text-amber-400 border-b border-stone-800 pb-4">
            <Sun className="w-6 h-6" />
            <h2 className="text-xl font-bold text-stone-100">Tahap 6: Kenali Kebutuhan Emosional</h2>
          </div>

          <p className="text-stone-300 text-sm">
            Kebutuhan dasar apa yang mungkin dahulu belum sepenuhnya Anda dapatkan atau rasakan?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {EMOTIONAL_NEEDS_OPTIONS.map((need) => {
              const isSelected = selectedNeeds.includes(need);
              return (
                <button
                  key={need}
                  type="button"
                  onClick={() => toggleNeed(need)}
                  className={`p-3.5 rounded-xl border text-left text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-amber-950/60 border-amber-500 text-amber-200 shadow-sm'
                      : 'bg-stone-950/50 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  {need} {isSelected && '✓'}
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block">
              Atau tuliskan kebutuhan spesifik lainnya:
            </label>
            <input
              type="text"
              value={customNeedText}
              onChange={(e) => setCustomNeedText(e.target.value)}
              placeholder="Misal: Ingin merasa aman dan didengar tanpa rasa takut..."
              className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/80"
            />
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
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg"
            >
              Proses Refleksi AI <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 7: SINTESIS & HASIL REFLEKSI AI GEMINI */}
      {currentStep === 7 && (
        <div className="space-y-6">
          {isLoading ? (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center space-y-4 shadow-xl">
              <Sparkles className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
              <h3 className="text-lg font-bold text-stone-200">Menyusun Sintesis Refleksi Inner Child...</h3>
              <p className="text-sm text-stone-400 max-w-md mx-auto">
                LEGA AI sedang merangkai pemaknaan hangat, mengenali kebutuhan emosional, dan menyusun saran merawat diri tanpa menghakimi.
              </p>
            </div>
          ) : reflectionResult ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Trauma or Overwhelmed Notification */}
              {reflectionResult.professionalTherapyRecommendation && (
                <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-4 flex items-start gap-3 text-amber-200 text-xs md:text-sm">
                  <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-1">Rekomendasi Bantuan Profesional:</span>
                    {reflectionResult.professionalTherapyRecommendation}
                  </div>
                </div>
              )}

              {/* Main Summary Card */}
              <div className="bg-stone-900 border border-amber-800/40 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
                    <Baby className="w-6 h-6" /> Refleksi & Pemaknaan
                  </div>
                  <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full">
                    {selectedArea}
                  </span>
                </div>

                <div className="space-y-4 text-stone-200 leading-relaxed text-sm md:text-base">
                  <p className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl text-stone-300 italic">
                    "{reflectionResult.summary}"
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Recognized Pattern */}
                    <div className="bg-stone-950/50 border border-stone-800 p-4 rounded-xl space-y-1.5">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> Pola Yang Tersadari:
                      </h4>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        {reflectionResult.recognizedPattern}
                      </p>
                    </div>

                    {/* Unmet Need */}
                    <div className="bg-stone-950/50 border border-stone-800 p-4 rounded-xl space-y-1.5">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sun className="w-4 h-4" /> Kebutuhan Emosional Utama:
                      </h4>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        {reflectionResult.unmetEmotionalNeed}
                      </p>
                    </div>
                  </div>

                  {/* Lessons Learned */}
                  <div className="bg-amber-950/20 border border-amber-900/40 p-4 rounded-xl space-y-1">
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Pelajaran & Daya Tahan Diri:
                    </h4>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {reflectionResult.lessonsLearned}
                    </p>
                  </div>

                  {/* Self Nurturing Action */}
                  <div className="bg-stone-950/80 border border-amber-500/30 p-4 rounded-xl space-y-1">
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-amber-400" /> Bentuk Perhatian Kepada Diri Hari Ini:
                    </h4>
                    <p className="text-xs md:text-sm text-stone-200 font-medium leading-relaxed">
                      {reflectionResult.selfNurturingAction}
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
                    onClick={() => setCurrentStep(8)}
                    className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all"
                  >
                    Lanjut Ke Langkah Merawat Diri <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      )}

      {/* STEP 8: LANGKAH MERAWAT DIRI & REKOMENDASI AUDIO/MODUL */}
      {currentStep === 8 && reflectionResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" /> Tahap 8: Langkah Merawat Diri Hari Ini
            </div>
            <button
              onClick={resetExercise}
              className="text-stone-400 hover:text-stone-200 text-xs flex items-center gap-1 bg-stone-800 px-3 py-1.5 rounded-lg transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Mula Sesi Baru
            </button>
          </div>

          <div className="bg-gradient-to-r from-amber-950/40 to-stone-950 border border-amber-800/50 rounded-xl p-5 space-y-2">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <Feather className="w-4 h-4" /> Langkah Kecil Realistis Hari Ini:
            </h3>
            <p className="text-sm text-stone-200 leading-relaxed font-medium">
              "{reflectionResult.realisticNextStep}"
            </p>
          </div>

          {/* Recommended Audio Theme */}
          {reflectionResult.recommendedAudioTheme && (
            <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold block">
                  Audio Terpandu Rekomendasi
                </span>
                <p className="text-xs text-stone-200 font-bold">
                  Naskah Audio: "{reflectionResult.recommendedAudioTheme}"
                </p>
              </div>
              <button
                onClick={() => onSelectModule('audio-ai')}
                className="bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition"
              >
                <Volume2 className="w-4 h-4" /> Buka Audio AI
              </button>
            </div>
          )}

          {/* Module Connections */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Latihan Lanjutan Terhubung:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reflectionResult.recommendedModules?.map((mod: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => onSelectModule(mod.targetModuleKey)}
                  className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 hover:border-amber-500/50 text-left space-y-1 group transition-all"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-amber-300 group-hover:text-amber-200">
                    <span>{mod.moduleName}</span>
                    <ChevronRight className="w-4 h-4 text-stone-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-[11px] text-stone-400 leading-normal">{mod.reason}</p>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
