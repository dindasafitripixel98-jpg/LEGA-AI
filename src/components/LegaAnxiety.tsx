import React, { useState } from 'react';
import {
  ShieldAlert,
  Wind,
  Sparkles,
  BookOpen,
  Volume2,
  HeartPulse,
  Brain,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  PhoneCall,
  Activity,
  Zap,
  Shield,
  LifeBuoy,
  ChevronRight,
  Sun,
  Eye,
  Coffee,
  Bed,
  Smile,
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { reflectAnxiety } from '../lib/geminiApi';
import { JournalEntry } from '../types';

interface LegaAnxietyProps {
  onSelectModule: (module: string) => void;
  onAddJournal?: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
}

const PHYSICAL_SYMPTOMS_OPTIONS = [
  'Jantung berdebar keras',
  'Napas terasa pendek / cepat',
  'Keringat dingin / berlebih',
  'Mulut kering',
  'Ketegangan otot (leher/pundak)',
  'Perut tidak nyaman / mual',
  'Tangan gemetar / tegang',
  'Sulit tidur / terbangun tengah malam',
  'Kepala terasa berat / pusing'
];

const THOUGHT_SYMPTOMS_OPTIONS = [
  'Khawatir terus-menerus',
  'Membayangkan kemungkinan terburuk',
  'Pikiran melompat-lompat / cepat',
  'Sulit berkonsentrasi',
  'Sulit mengambil keputusan',
  'Merasa tidak punya kendali'
];

const EMOTIONAL_SYMPTOMS_OPTIONS = [
  'Gelisah / tidak tenang',
  'Rasa takut berlebihan',
  'Tegang sepanjang hari',
  'Mudah terkejut / panik',
  'Kewalahan oleh situasi',
  'Perasaan tidak aman'
];

const LIFESTYLE_FACTORS_OPTIONS = [
  'Tekanan pekerjaan / akademis',
  'Masalah keluarga / hubungan',
  'Masalah keuangan',
  'Kurang tidur / kelelahan kronis',
  'Penyakit fisik / ketidaknyamanan tubuh',
  'Penggunaan kafein berlebihan (kopi/energy drink)',
  'Perubahan besar dalam hidup',
  'Pengalaman traumatis di masa lalu'
];

const AUDIO_ANXIETY_THEMES = [
  { id: 'Menenangkan Pikiran', label: 'Audio Menenangkan Pikiran', desc: 'Meredakan badai pikiran dan mengembalikan rasa aman' },
  { id: 'Menghadapi Kekhawatiran', label: 'Audio Menghadapi Kekhawatiran', desc: 'Belajar bersahabat dengan rasa takut tanpa terhanyut' },
  { id: 'Napas Sadar', label: 'Audio Napas Sadar', desc: 'Panduan ritme napas lambat untuk mereda kecemasan' },
  { id: 'Hadir Saat Ini', label: 'Audio Hadir Saat Ini', desc: 'Latihan panca indra untuk grounding saat gelisah' },
  { id: 'Sebelum Tidur', label: 'Audio Sebelum Tidur', desc: 'Relaksasi tubuh dan batin menjelang istirahat malam' },
  { id: 'Setelah Serangan Panik', label: 'Audio Setelah Serangan Panik', desc: 'Dukungan pemulihan lembut pasca lonjakan panik' },
];

export const LegaAnxiety: React.FC<LegaAnxietyProps> = ({
  onSelectModule,
  onAddJournal,
}) => {
  const [activeTab, setActiveTab] = useState<'education' | 'reflection' | 'panic-help' | 'professional'>('education');

  // Reflection form state
  const [mainWorry, setMainWorry] = useState<string>('');
  const [uncontrollableAspects, setUncontrollableAspects] = useState<string>('');
  const [controllableActions, setControllableActions] = useState<string>('');
  const [selectedPhysicalSensations, setSelectedPhysicalSensations] = useState<string[]>([]);
  const [selectedThoughtSymptoms, setSelectedThoughtSymptoms] = useState<string[]>([]);
  const [selectedEmotionalSymptoms, setSelectedEmotionalSymptoms] = useState<string[]>([]);
  const [selectedLifestyleFactors, setSelectedLifestyleFactors] = useState<string[]>([]);

  // Special conditions flags
  const [isPanicState, setIsPanicState] = useState<boolean>(false);
  const [isSelfHarmExpressed, setIsSelfHarmExpressed] = useState<boolean>(false);
  const [isSevereOrPersistent, setIsSevereOrPersistent] = useState<boolean>(false);

  // Grounding Step counter for Panic Attack Help
  const [groundingStep, setGroundingStep] = useState<number>(1);

  // Async state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reflectionResult, setReflectionResult] = useState<any>(null);
  const [journalSaved, setJournalSaved] = useState<boolean>(false);

  const toggleArrayItem = (item: string, stateArr: string[], setFn: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (stateArr.includes(item)) {
      setFn(stateArr.filter((i) => i !== item));
    } else {
      setFn([...stateArr, item]);
    }
  };

  const handleProcessReflection = async () => {
    setIsLoading(true);

    const result = await reflectAnxiety({
      mainWorry,
      uncontrollableAspects,
      controllableActions,
      physicalSensations: selectedPhysicalSensations,
      thoughtSymptoms: selectedThoughtSymptoms,
      emotionalSymptoms: selectedEmotionalSymptoms,
      lifestyleFactors: selectedLifestyleFactors,
      isPanicState,
      isSelfHarmExpressed,
      isSevereOrPersistent
    });

    setReflectionResult(result);
    setIsLoading(false);
  };

  const handleSaveToJournal = () => {
    if (!onAddJournal || !reflectionResult) return;

    const content = `=== REFLEKSI LEGA ANXIETY ===
Kekhawatiran Utama: ${mainWorry || '-'}
Sensasi Fisik: ${selectedPhysicalSensations.join(', ') || '-'}
Faktor Pemicu / Gaya Hidup: ${selectedLifestyleFactors.join(', ') || '-'}

Pemahaman AI:
${reflectionResult.summary || '-'}

Hal Di Luar Kendali:
${reflectionResult.reflectiveAnswers?.outOfControl || uncontrollableAspects || '-'}

Hal Dalam Kendali Hari Ini:
${reflectionResult.reflectiveAnswers?.inControl || controllableActions || '-'}

Rekomendasi Gaya Hidup:
${reflectionResult.lifestyleRecommendations?.join('\n• ') || '-'}`;

    onAddJournal({
      title: 'Refleksi LEGA Anxiety',
      content,
      mood: 'cemas',
      tags: ['Anxiety', 'Kecemasan', 'RegulasiEmosi', 'Grounding']
    });

    setJournalSaved(true);
  };

  const resetForm = () => {
    setMainWorry('');
    setUncontrollableAspects('');
    setControllableActions('');
    setSelectedPhysicalSensations([]);
    setSelectedThoughtSymptoms([]);
    setSelectedEmotionalSymptoms([]);
    setSelectedLifestyleFactors([]);
    setIsPanicState(false);
    setIsSelfHarmExpressed(false);
    setIsSevereOrPersistent(false);
    setReflectionResult(null);
    setJournalSaved(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-rose-950/40 via-stone-900 to-indigo-950/40 border border-rose-800/40 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <ShieldAlert className="w-48 h-48 text-rose-300" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold tracking-wide uppercase">
            <ShieldAlert className="w-3.5 h-3.5" />
            LEGA Anxiety • Version 1.0
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-100">
            Edukasi & Regulasi Kecemasan Terpandu
          </h1>
          <p className="text-sm md:text-base text-stone-300 leading-relaxed max-w-2xl">
            Rasa cemas adalah bagian dari pengalaman manusia yang alami — bukan kelemahan dan bukan kegagalan.
            Di sini, kita belajar memahami sinyal tubuh, mengurai pemicu, serta melatih respon yang sadar dan penuh belas kasih.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs text-stone-400">
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-rose-400" /> Bukan Diagnosis & Bukan Terapi
            </span>
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-rose-400" /> Mengenali Sinyal Tubuh
            </span>
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <LifeBuoy className="w-3.5 h-3.5 text-rose-400" /> Pertolongan Panik & Grounding
            </span>
          </div>
        </div>
      </div>

      {/* Emergency Crisis Alert if Self-Harm Expressed */}
      {isSelfHarmExpressed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-rose-950/80 border-2 border-rose-600 rounded-2xl p-6 text-stone-100 space-y-4 shadow-2xl"
        >
          <div className="flex items-center gap-3 text-rose-300 font-bold text-lg border-b border-rose-800 pb-3">
            <PhoneCall className="w-6 h-6 animate-pulse text-rose-400" />
            PROTOKOL KESELAMATAN & DUKUNGAN DARURAT
          </div>
          <p className="text-sm leading-relaxed text-stone-200">
            Kesehatan dan keselamatan Anda adalah yang paling utama. Jika Anda sedang merasa sangat kewalahan, berada dalam krisis batin, atau memiliki dorongan untuk menyakiti diri, mohon ketahuilah bahwa Anda tidak sendirian.
          </p>
          <div className="bg-stone-900/90 border border-rose-800/80 p-4 rounded-xl space-y-2 text-xs md:text-sm">
            <span className="font-bold text-rose-300 block">Layanan Kesehatan Mental & Layanan Darurat:</span>
            <ul className="space-y-1 text-stone-300">
              <li>• <strong>Layanan Sehat Jiwa Kemenkes RI:</strong> Call Center 119 (Tekan 8)</li>
              <li>• <strong>Layanan Darurat Indonesia:</strong> 112 / 118</li>
              <li>• Hubungi keluarga, sahabat, atau orang terdekat yang Anda percayai untuk mendampingi Anda saat ini.</li>
            </ul>
          </div>
          <p className="text-xs text-rose-300 italic">
            *Latihan refleksi dinonaktifkan sementara demi keamanan Anda. Mohon segera hubungi kontak bantuan di atas.
          </p>
        </motion.div>
      )}

      {/* Main Tab Navigation */}
      <div className="flex border-b border-stone-800 overflow-x-auto no-scrollbar gap-2">
        <button
          onClick={() => setActiveTab('education')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'education'
              ? 'border-rose-500 text-rose-300 bg-rose-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Edukasi Kecemasan
        </button>
        <button
          onClick={() => setActiveTab('reflection')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'reflection'
              ? 'border-rose-500 text-rose-300 bg-rose-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Refleksi & Self-Check AI
        </button>
        <button
          onClick={() => setActiveTab('panic-help')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'panic-help'
              ? 'border-rose-500 text-rose-300 bg-rose-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <LifeBuoy className="w-4 h-4" /> Pertolongan Serangan Panik
        </button>
        <button
          onClick={() => setActiveTab('professional')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'professional'
              ? 'border-rose-500 text-rose-300 bg-rose-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <PhoneCall className="w-4 h-4" /> Bantuan Profesional
        </button>
      </div>

      {/* TAB 1: EDUKASI KECEMASAN */}
      {activeTab === 'education' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* What is anxiety */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-lg">
            <h2 className="text-xl font-bold text-stone-100 flex items-center gap-2">
              <Brain className="w-5 h-5 text-rose-400" /> Memahami Apa Itu Kecemasan
            </h2>
            <p className="text-stone-300 text-sm md:text-base leading-relaxed">
              Kecemasan (*anxiety*) adalah respons alami tubuh dan pikiran terhadap ketidakpastian, ancaman, atau tantangan dalam hidup. Pada tingkat tertentu, kecemasan sebenarnya membantu kita lebih waspada dan bersiap.
            </p>
            <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl text-xs md:text-sm text-stone-300 leading-relaxed italic">
              "Kecemasan bukan tanda bahwa Anda lemah atau gagal. Itu adalah sistem alarm tubuh yang berusaha melindungi Anda, meskipun terkadang sistem alarm tersebut terlalu sensitif."
            </div>
          </div>

          {/* Symptoms breakdown grid */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-stone-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-400" /> Gejala Kecemasan Yang Mungkin Muncul
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Thought symptoms */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block flex items-center gap-1.5">
                  <Brain className="w-4 h-4" /> Gejala Pikiran
                </span>
                <ul className="text-xs text-stone-300 space-y-1.5 list-disc pl-4">
                  <li>Sulit berkonsentrasi</li>
                  <li>Khawatir terus-menerus</li>
                  <li>Membayangkan skenario buruk</li>
                  <li>Sulit mengambil keputusan</li>
                </ul>
              </div>

              {/* Emotional symptoms */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> Gejala Emosi
                </span>
                <ul className="text-xs text-stone-300 space-y-1.5 list-disc pl-4">
                  <li>Gelisah & tidak tenang</li>
                  <li>Rasa takut / waswas</li>
                  <li>Perasaan tegang</li>
                  <li>Mudah panik / terkejut</li>
                </ul>
              </div>

              {/* Physical symptoms */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4" /> Gejala Tubuh
                </span>
                <ul className="text-xs text-stone-300 space-y-1.5 list-disc pl-4">
                  <li>Jantung berdebar keras</li>
                  <li>Napas terasa cepat/pendek</li>
                  <li>Keringat berlebih & otot tegang</li>
                  <li>Perut mual / sulit tidur</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Lifestyle Education */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-lg">
            <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-400" /> Kebiasaan Gaya Hidup Pendukung
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm">
              <div className="bg-stone-950/60 border border-stone-800 p-3.5 rounded-xl flex items-start gap-2.5">
                <Bed className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-200 block">Tidur Cukup & Teratur</span>
                  <span className="text-stone-400">Istirahat yang terjadwal membantu menenangkan sistem saraf pusat.</span>
                </div>
              </div>

              <div className="bg-stone-950/60 border border-stone-800 p-3.5 rounded-xl flex items-start gap-2.5">
                <Coffee className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-200 block">Kurangi Kafein Berlebihan</span>
                  <span className="text-stone-400">Kopi/energy drink berlebihan dapat memicu detak jantung dan stimulasi kecemasan.</span>
                </div>
              </div>

              <div className="bg-stone-950/60 border border-stone-800 p-3.5 rounded-xl flex items-start gap-2.5">
                <Activity className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-200 block">Aktivitas Fisik Ringan</span>
                  <span className="text-stone-400">Jalan santai atau pereregangan membantu melepaskan ketegangan otot.</span>
                </div>
              </div>

              <div className="bg-stone-950/60 border border-stone-800 p-3.5 rounded-xl flex items-start gap-2.5">
                <Wind className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-200 block">Kesadaran Napas Rutin</span>
                  <span className="text-stone-400">Latihan napas 5 menit sehari menurunkan hormon stres secara bertahap.</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 2: REFLEKSI & SELF-CHECK AI */}
      {activeTab === 'reflection' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {!isSelfHarmExpressed && (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg">
              <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-lg">
                  <Sparkles className="w-5 h-5" /> Form Refleksi LEGA Anxiety
                </div>
                <span className="text-xs text-stone-400">Edukasi & Kesadaran Diri</span>
              </div>

              {/* 1. Main Worry */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-200 block">
                  1. Apa yang paling membuat Anda merasa khawatir atau cemas saat ini?
                </label>
                <textarea
                  value={mainWorry}
                  onChange={(e) => setMainWorry(e.target.value)}
                  rows={3}
                  placeholder="Tuliskan saja rasa cemas atau ketakutan yang sedang membayangi Anda..."
                  className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3.5 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-rose-500/80"
                />
              </div>

              {/* 2. Physical Sensations Check */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-200 block">
                  2. Sensasi tubuh apa saja yang sedang Anda rasakan?
                </label>
                <div className="flex flex-wrap gap-2">
                  {PHYSICAL_SYMPTOMS_OPTIONS.map((item) => {
                    const active = selectedPhysicalSensations.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleArrayItem(item, selectedPhysicalSensations, setSelectedPhysicalSensations)}
                        className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                          active
                            ? 'bg-rose-500/20 border-rose-500 text-rose-200 font-semibold'
                            : 'bg-stone-950/50 border-stone-800 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        {item} {active && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Lifestyle / Triggers Check */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-200 block">
                  3. Faktor gaya hidup atau pemicu apa yang mungkin memengaruhi rasa cemas ini?
                </label>
                <div className="flex flex-wrap gap-2">
                  {LIFESTYLE_FACTORS_OPTIONS.map((item) => {
                    const active = selectedLifestyleFactors.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleArrayItem(item, selectedLifestyleFactors, setSelectedLifestyleFactors)}
                        className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                          active
                            ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200 font-semibold'
                            : 'bg-stone-950/50 border-stone-800 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        {item} {active && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Controllable vs Uncontrollable */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                    Hal di Luar Kendali (Yang Perlu Dilepaskan)
                  </label>
                  <input
                    type="text"
                    value={uncontrollableAspects}
                    onChange={(e) => setUncontrollableAspects(e.target.value)}
                    placeholder="Misal: Keputusan orang lain, apa yang terjadi besok..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-rose-500/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-rose-300 uppercase tracking-wider block">
                    Hal Dalam Kendali (Tindakan Hari Ini)
                  </label>
                  <input
                    type="text"
                    value={controllableActions}
                    onChange={(e) => setControllableActions(e.target.value)}
                    placeholder="Misal: Istirahat 15 menit, minum air, bernapas..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-rose-500/80"
                  />
                </div>
              </div>

              {/* Conditions checkboxes */}
              <div className="space-y-3 pt-2 border-t border-stone-800">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="panicCheck"
                    checked={isPanicState}
                    onChange={(e) => setIsPanicState(e.target.checked)}
                    className="rounded border-stone-700 bg-stone-900 text-rose-600 focus:ring-rose-500"
                  />
                  <label htmlFor="panicCheck" className="text-xs text-stone-300 cursor-pointer font-medium">
                    Saya sedang merasa panik tinggi / membutuhkan panduan penenangan cepat
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="severeAnxietyCheck"
                    checked={isSevereOrPersistent}
                    onChange={(e) => setIsSevereOrPersistent(e.target.checked)}
                    className="rounded border-stone-700 bg-stone-900 text-rose-600 focus:ring-rose-500"
                  />
                  <label htmlFor="severeAnxietyCheck" className="text-xs text-stone-300 cursor-pointer">
                    Kecemasan ini berlangsung lama / mengganggu tidur & aktivitas harian secara signifikan
                  </label>
                </div>

                <div className="flex items-center gap-2 bg-rose-950/40 p-3 rounded-xl border border-rose-900/60">
                  <input
                    type="checkbox"
                    id="selfHarmCheck"
                    checked={isSelfHarmExpressed}
                    onChange={(e) => setIsSelfHarmExpressed(e.target.checked)}
                    className="rounded border-rose-700 bg-stone-900 text-rose-600 focus:ring-rose-500"
                  />
                  <label htmlFor="selfHarmCheck" className="text-xs text-rose-300 cursor-pointer font-bold">
                    [PENTING] Saya sedang merasa sangat putus asa / ada dorongan menyakiti diri
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleProcessReflection}
                  className="bg-rose-600 hover:bg-rose-500 text-stone-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg"
                >
                  Proses Analisis & Edukasi AI <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Output Card */}
          {isLoading ? (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center space-y-4 shadow-xl">
              <Sparkles className="w-10 h-10 text-rose-400 animate-spin mx-auto" />
              <h3 className="text-lg font-bold text-stone-200">Menyusun Pendampingan LEGA Anxiety...</h3>
              <p className="text-sm text-stone-400 max-w-md mx-auto">
                LEGA AI sedang menganalisis gejala, pemicu, dan menyusun saran regulasi emosi yang hangat.
              </p>
            </div>
          ) : reflectionResult && !isSelfHarmExpressed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-stone-900 border border-rose-800/40 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-lg">
                    <ShieldAlert className="w-6 h-6" /> Hasil Analisis LEGA Anxiety
                  </div>
                  <span className="text-xs bg-rose-500/10 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full">
                    Perspektif Edukatif
                  </span>
                </div>

                <div className="space-y-4 text-stone-200 leading-relaxed text-sm md:text-base">
                  <p className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl text-stone-300 italic">
                    "{reflectionResult.summary}"
                  </p>

                  {/* Anxiety type understanding */}
                  {reflectionResult.anxietyTypeUnderstanding && (
                    <div className="bg-stone-950/50 border border-indigo-900/40 p-4 rounded-xl space-y-1">
                      <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Brain className="w-4 h-4" /> Pemahaman Karakteristik Kecemasan:
                      </h4>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        {reflectionResult.anxietyTypeUnderstanding}
                      </p>
                    </div>
                  )}

                  {/* Symptoms Breakdown */}
                  {reflectionResult.symptomsBreakdown && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-stone-950/50 border border-stone-800 p-3.5 rounded-xl space-y-1">
                        <span className="text-[11px] font-bold text-indigo-400 block">Pikiran</span>
                        <p className="text-xs text-stone-300">{reflectionResult.symptomsBreakdown.thoughtSymptoms}</p>
                      </div>
                      <div className="bg-stone-950/50 border border-stone-800 p-3.5 rounded-xl space-y-1">
                        <span className="text-[11px] font-bold text-rose-400 block">Emosi</span>
                        <p className="text-xs text-stone-300">{reflectionResult.symptomsBreakdown.emotionalSymptoms}</p>
                      </div>
                      <div className="bg-stone-950/50 border border-stone-800 p-3.5 rounded-xl space-y-1">
                        <span className="text-[11px] font-bold text-amber-400 block">Sensasi Tubuh</span>
                        <p className="text-xs text-stone-300">{reflectionResult.symptomsBreakdown.physicalSymptoms}</p>
                      </div>
                    </div>
                  )}

                  {/* Reflective Answers */}
                  {reflectionResult.reflectiveAnswers && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-stone-950/50 border border-stone-800 p-4 rounded-xl space-y-1">
                        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Shield className="w-4 h-4" /> Luar Kendali (Dilepaskan):
                        </h4>
                        <p className="text-xs text-stone-400 leading-relaxed">
                          {reflectionResult.reflectiveAnswers.outOfControl}
                        </p>
                      </div>

                      <div className="bg-stone-950/50 border border-rose-900/40 p-4 rounded-xl space-y-1">
                        <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Zap className="w-4 h-4" /> Dalam Kendali (Fokus Hari Ini):
                        </h4>
                        <p className="text-xs text-stone-200 leading-relaxed font-medium">
                          {reflectionResult.reflectiveAnswers.inControl}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Professional consult guide */}
                  {reflectionResult.professionalConsultGuide && (
                    <div className="bg-amber-950/40 border border-amber-800/60 p-4 rounded-xl text-xs text-amber-200 space-y-1">
                      <span className="font-bold block flex items-center gap-1.5 text-amber-300">
                        <PhoneCall className="w-4 h-4" /> Kapan Berkonsultasi Dengan Profesional:
                      </span>
                      <p className="leading-relaxed">{reflectionResult.professionalConsultGuide}</p>
                    </div>
                  )}
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
                    onClick={resetForm}
                    className="text-stone-400 hover:text-stone-200 text-xs flex items-center gap-1 bg-stone-800 px-4 py-2 rounded-xl transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Ulangi Refleksi
                  </button>
                </div>
              </div>

              {/* Audio Link */}
              {reflectionResult.recommendedAudioTheme && (
                <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] uppercase tracking-wider text-rose-400 font-semibold block">
                      Audio Terpandu Gemini TTS
                    </span>
                    <p className="text-xs text-stone-200 font-bold">
                      Naskah Audio: "{reflectionResult.recommendedAudioTheme}"
                    </p>
                  </div>
                  <button
                    onClick={() => onSelectModule('audio-ai')}
                    className="bg-stone-800 hover:bg-stone-700 text-rose-300 border border-rose-500/30 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition"
                  >
                    <Volume2 className="w-4 h-4" /> Buka Audio AI
                  </button>
                </div>
              )}

              {/* Recommended Modules */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Latihan LEGA Terhubung:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {reflectionResult.recommendedModules?.map((mod: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => onSelectModule(mod.targetModuleKey)}
                      className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 hover:border-rose-500/50 text-left space-y-1 group transition-all"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-rose-300 group-hover:text-rose-200">
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
        </motion.div>
      )}

      {/* TAB 3: PERTOLONGAN SERANGAN PANIK (GROUNDING 5-4-3-2-1) */}
      {activeTab === 'panic-help' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg"
        >
          <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-lg">
              <LifeBuoy className="w-6 h-6" /> Pendampingan Serangan Panik & Grounding
            </div>
            <span className="text-xs bg-rose-500/10 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full">
              Penenangan Cepat
            </span>
          </div>

          <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl text-xs md:text-sm text-stone-300 leading-relaxed">
            Jika jantung Anda berdebar kencang atau batin terasa panik:
            <strong className="text-stone-100 block mt-1">
              "Anda berada di tempat yang aman saat ini. Sensasi ini akan berlalu secara bertahap. Tubuh Anda sedang berusaha mengatur kembali rasa aman."
            </strong>
          </div>

          {/* Grounding 5-4-3-2-1 Interactive Steps */}
          <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between text-xs font-bold text-rose-400">
              <span>Langkah Grounding Panca Indra {groundingStep} dari 5</span>
              <span>Metode 5-4-3-2-1</span>
            </div>

            {groundingStep === 1 && (
              <div className="space-y-3 text-center py-4">
                <Eye className="w-12 h-12 text-rose-400 mx-auto" />
                <h4 className="text-lg font-bold text-stone-100">5 Hal Yang Dilihat</h4>
                <p className="text-sm text-stone-300 max-w-md mx-auto">
                  Lihat sekeliling Anda. Sebutkan dalam hati 5 benda yang berada di dekat Anda saat ini (misal: jam dinding, meja, gelas, pintu, sepatu).
                </p>
              </div>
            )}

            {groundingStep === 2 && (
              <div className="space-y-3 text-center py-4">
                <HeartPulse className="w-12 h-12 text-indigo-400 mx-auto" />
                <h4 className="text-lg font-bold text-stone-100">4 Hal Yang Disentuh</h4>
                <p className="text-sm text-stone-300 max-w-md mx-auto">
                  Rasakan tekstur fisik. Sentuh 4 hal di sekitar Anda (misal: bahan pakaian Anda, permukaan lantai di bawah kaki, tekstur meja, atau kehangatan tangan Anda sendiri).
                </p>
              </div>
            )}

            {groundingStep === 3 && (
              <div className="space-y-3 text-center py-4">
                <Volume2 className="w-12 h-12 text-amber-400 mx-auto" />
                <h4 className="text-lg font-bold text-stone-100">3 Suara Yang Didengar</h4>
                <p className="text-sm text-stone-300 max-w-md mx-auto">
                  Dengarkan baik-baik. Amati 3 suara yang ada di sekitar Anda (misal: deru kipas angin, suara kendaraan di kejauhan, atau detak napas Anda).
                </p>
              </div>
            )}

            {groundingStep === 4 && (
              <div className="space-y-3 text-center py-4">
                <Sparkles className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-stone-100">2 Aroma Yang Dicium</h4>
                <p className="text-sm text-stone-300 max-w-md mx-auto">
                  Rasakan aroma di udara. Cium 2 wewangian di dekat Anda (misal: aroma pakaian, udara segar, atau aroma minuman).
                </p>
              </div>
            )}

            {groundingStep === 5 && (
              <div className="space-y-3 text-center py-4">
                <Wind className="w-12 h-12 text-rose-400 mx-auto animate-pulse" />
                <h4 className="text-lg font-bold text-stone-100">1 Hembusan Napas Dalam</h4>
                <p className="text-sm text-stone-300 max-w-md mx-auto">
                  Tarik napas perlahan melalui hidung selama 4 detik... Tahan 2 detik... Hembuskan perlahan melalui mulut selama 6 detik.
                </p>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-stone-800">
              <button
                disabled={groundingStep === 1}
                onClick={() => setGroundingStep((prev) => Math.max(1, prev - 1))}
                className="text-stone-400 hover:text-stone-200 text-xs disabled:opacity-30"
              >
                Sebelumnya
              </button>
              {groundingStep < 5 ? (
                <button
                  onClick={() => setGroundingStep((prev) => Math.min(5, prev + 1))}
                  className="bg-rose-600 hover:bg-rose-500 text-stone-950 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5"
                >
                  Langkah Berikutnya <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setGroundingStep(1)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5"
                >
                  Selesai & Ulangi Grounding
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onSelectModule('breathing')}
              className="bg-stone-800 hover:bg-stone-700 text-rose-300 border border-rose-500/30 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2"
            >
              <Wind className="w-4 h-4" /> Latihan Pernapasan Terpandu
            </button>
            <button
              onClick={() => onSelectModule('audio-ai')}
              className="bg-stone-800 hover:bg-stone-700 text-indigo-300 border border-indigo-500/30 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4" /> Audio "Setelah Serangan Panik"
            </button>
          </div>
        </motion.div>
      )}

      {/* TAB 4: BANTUAN PROFESIONAL & PANDUAN */}
      {activeTab === 'professional' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg">
            <h2 className="text-xl font-bold text-stone-100 flex items-center gap-2 border-b border-stone-800 pb-4">
              <PhoneCall className="w-5 h-5 text-rose-400" /> Kapan Perlu Mencari Bantuan Profesional?
            </h2>

            <p className="text-stone-300 text-sm leading-relaxed">
              Kecemasan adalah bagian dari pengalaman hidup. Namun, berkonsultasi dengan profesional kesehatan mental (dokter, psikolog, atau psikiater) sangat dianjurkan apabila Anda mengalami kondisi berikut:
            </p>

            <div className="space-y-3">
              <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm text-stone-200">
                  <span className="font-bold block text-stone-100">Berlangsung Dalam Jangka Panjang</span>
                  Rasa cemas intens dirasakan hampir setiap hari selama berminggu-minggu atau berbulan-bulan.
                </div>
              </div>

              <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm text-stone-200">
                  <span className="font-bold block text-stone-100">Mengganggu Fungsi Harian</span>
                  Sangat menyulitkan Anda untuk bekerja, belajar, menjalankan tugas keluarga, atau berinteraksi sosial.
                </div>
              </div>

              <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm text-stone-200">
                  <span className="font-bold block text-stone-100">Mengganggu Kualitas Tidur & Kesehatan Fisik</span>
                  Mengalami insomnia berat, gangguan pencernaan kronis, atau keluhan fisik yang tak kunjung membaik.
                </div>
              </div>

              <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm text-stone-200">
                  <span className="font-bold block text-stone-100">Merasa Tidak Mampu Mengatasinya Sendiri</span>
                  Ketika latihan relaksasi mandiri terasa belum cukup untuk meredakan ketegangan yang teramat sangat.
                </div>
              </div>
            </div>

            {/* Helpline Info */}
            <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2">
                <PhoneCall className="w-4 h-4" /> Kontak Layanan Darurat & Konsultasi
              </h4>
              <ul className="text-xs text-stone-300 space-y-2">
                <li>• <strong>Layanan Sehat Jiwa Kemenkes RI:</strong> Hotline 119 (Ext 8)</li>
                <li>• <strong>Layanan Darurat Nasional:</strong> 112 / 118</li>
                <li>• <strong>Puskemas / Rumah Sakit Terdekat:</strong> Kunjungi poli jiwa / psikologi klinis di fasilitas kesehatan terdekat Anda.</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
