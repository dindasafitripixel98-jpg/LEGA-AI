import React, { useState } from 'react';
import {
  Flame,
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
  Layers,
  PauseCircle,
  HelpCircle,
  Clock,
  BatteryCharging,
  UserCheck,
  Heart,
  Dumbbell,
  Apple,
  Users,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { reflectStress } from '../lib/geminiApi';
import { JournalEntry } from '../types';

interface LegaStressProps {
  onSelectModule: (module: string) => void;
  onAddJournal?: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
}

const STRESS_SOURCES_OPTIONS = [
  'Pekerjaan',
  'Kuliah',
  'Sekolah',
  'Bisnis / Usaha',
  'Keuangan / Ekonomi',
  'Hubungan / Pasangan',
  'Keluarga',
  'Penyakit / Kondisi Tubuh',
  'Konflik / Perselisihan',
  'Trauma / Pengalaman Masa Lalu',
  'Perubahan Hidup Besar',
  'Beban Tanggung Jawab Berat',
  'Kurang Tidur / Kelelahan Kronis',
  'Kesepian / Isolasi Sosial'
];

const THOUGHT_RESPONSES = [
  'Sulit fokus',
  'Overthinking',
  'Mudah lupa / linglung',
  'Sulit mengambil keputusan'
];

const EMOTIONAL_RESPONSES = [
  'Marah / mudah emosional',
  'Sedih / hampa',
  'Cemas / gelisah',
  'Kecewa',
  'Frustrasi / tertekan',
  'Mudah tersinggung'
];

const PHYSICAL_RESPONSES = [
  'Jantung berdebar',
  'Tegang leher / bahu',
  'Nyeri kepala / pusing',
  'Gangguan tidur / insomnia',
  'Gangguan lambung / mual',
  'Lelah / lemas berkepanjangan'
];

const BEHAVIORAL_RESPONSES = [
  'Menunda pekerjaan (procrastination)',
  'Makan berlebihan',
  'Tidak nafsu makan',
  'Menarik diri dari lingkungan',
  'Bekerja terus-menerus tanpa jeda'
];

export const LegaStress: React.FC<LegaStressProps> = ({
  onSelectModule,
  onAddJournal,
}) => {
  const [activeTab, setActiveTab] = useState<'education' | 'reflection' | 'burnout-pause' | 'professional'>('education');

  // Form states (V2.0 Refleksi)
  const [mainStressor, setMainStressor] = useState<string>('');
  const [stressDuration, setStressDuration] = useState<string>('Beberapa hari terakhir');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedThought, setSelectedThought] = useState<string[]>([]);
  const [selectedEmotional, setSelectedEmotional] = useState<string[]>([]);
  const [selectedPhysical, setSelectedPhysical] = useState<string[]>([]);
  const [selectedBehavioral, setSelectedBehavioral] = useState<string[]>([]);

  const [uncontrollableAspects, setUncontrollableAspects] = useState<string>('');
  const [controllableActions, setControllableActions] = useState<string>('');
  const [primaryNeed, setPrimaryNeed] = useState<string>('');

  // Flags
  const [isBurnoutOrSevere, setIsBurnoutOrSevere] = useState<boolean>(false);
  const [isChronicStress, setIsChronicStress] = useState<boolean>(false);
  const [isSelfHarmExpressed, setIsSelfHarmExpressed] = useState<boolean>(false);

  // Micro Pause step counter
  const [pauseStep, setPauseStep] = useState<number>(1);

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

    const result = await reflectStress({
      mainStressor,
      stressDuration,
      stressSources: selectedSources,
      thoughtSymptoms: selectedThought,
      emotionalSymptoms: selectedEmotional,
      bodySymptoms: selectedPhysical,
      behaviorSymptoms: selectedBehavioral,
      uncontrollableAspects,
      controllableActions,
      primaryNeed,
      isBurnoutOrSevere,
      isChronicStress,
      isSelfHarmExpressed
    });

    setReflectionResult(result);
    setIsLoading(false);
  };

  const handleSaveToJournal = () => {
    if (!onAddJournal || !reflectionResult) return;

    const content = `=== REFLEKSI LEGA STRESS (V2.0) ===
Beban Utama: ${mainStressor || '-'}
Durasi Tekanan: ${stressDuration}
Sumber Stres: ${selectedSources.join(', ') || '-'}

Dampak Yang Dirasakan (4 Ranah):
- Pikiran: ${selectedThought.join(', ') || '-'}
- Emosi: ${selectedEmotional.join(', ') || '-'}
- Tubuh: ${selectedPhysical.join(', ') || '-'}
- Perilaku: ${selectedBehavioral.join(', ') || '-'}

Analisis & Edukasi AI:
${reflectionResult.summary || '-'}

Di Luar Kendali:
${reflectionResult.reflectiveInsights?.outOfControl || uncontrollableAspects || '-'}

Dalam Kendali Hari Ini:
${reflectionResult.reflectiveInsights?.inControl || controllableActions || '-'}

Kebutuhan Utama:
${reflectionResult.reflectiveInsights?.primaryNeed || primaryNeed || '-'}

Langkah Mikro Hari Ini:
${reflectionResult.reflectiveInsights?.microAction || '-'}`;

    onAddJournal({
      title: 'Refleksi LEGA Stress V2.0',
      content,
      mood: 'lelah',
      tags: ['Stress', 'Stres', 'Psychoeducation', 'RegulasiEmosi', 'ManajemenStres']
    });

    setJournalSaved(true);
  };

  const resetForm = () => {
    setMainStressor('');
    setStressDuration('Beberapa hari terakhir');
    setSelectedSources([]);
    setSelectedThought([]);
    setSelectedEmotional([]);
    setSelectedPhysical([]);
    setSelectedBehavioral([]);
    setUncontrollableAspects('');
    setControllableActions('');
    setPrimaryNeed('');
    setIsBurnoutOrSevere(false);
    setIsChronicStress(false);
    setIsSelfHarmExpressed(false);
    setReflectionResult(null);
    setJournalSaved(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-amber-950/40 via-stone-900 to-rose-950/40 border border-amber-800/40 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Flame className="w-48 h-48 text-amber-300" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide uppercase">
            <Flame className="w-3.5 h-3.5" />
            LEGA Stress • Version 2.0
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-100">
            Edukasi & Pengelolaan Stres Terpandu
          </h1>
          <p className="text-sm md:text-base text-stone-300 leading-relaxed max-w-2xl">
            Memahami stres secara ilmiah, mengenali sumbernya, memahami respon tubuh, pikiran, emosi, dan perilaku, serta mempelajari latihan kesadaran untuk mengelola stres.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs text-stone-400">
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400" /> Bersifat Edukatif • Tanpa Diagnosis
            </span>
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <BatteryCharging className="w-3.5 h-3.5 text-amber-400" /> 4 Ranah Respon Stres
            </span>
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <PauseCircle className="w-3.5 h-3.5 text-amber-400" /> Panduan Jeda Kelelahan (Burnout)
            </span>
          </div>
        </div>
      </div>

      {/* Filosofi LEGA Card */}
      <div className="bg-stone-900/90 border border-amber-500/30 rounded-2xl p-5 md:p-6 shadow-md space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <Compass className="w-4 h-4" /> Filosofi LEGA Stress
        </span>
        <blockquote className="text-sm md:text-base text-stone-200 font-medium italic leading-relaxed border-l-2 border-amber-500 pl-4 py-1">
          "Stres bukan musuh. Stres adalah sinyal. Tubuh sedang berusaha beradaptasi. Pikiran sedang berusaha melindungi. Kesadaran membantu kita memahami sinyal tersebut. Dengan memahami sinyal, kita dapat memilih respon yang lebih bijaksana."
        </blockquote>
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
            Kesehatan dan keselamatan Anda adalah hal yang paling berharga. Jika Anda sedang merasa sangat kewalahan, berada dalam krisis batin yang mendalam, atau memiliki dorongan untuk menyakiti diri, mohon ketahuilah bahwa Anda tidak sendirian.
          </p>
          <div className="bg-stone-900/90 border border-rose-800/80 p-4 rounded-xl space-y-2 text-xs md:text-sm">
            <span className="font-bold text-rose-300 block">Layanan Kesehatan Mental & Layanan Darurat:</span>
            <ul className="space-y-1 text-stone-300">
              <li>• <strong>Layanan Sehat Jiwa Kemenkes RI:</strong> Call Center 119 (Tekan 8)</li>
              <li>• <strong>Layanan Darurat Indonesia:</strong> 112 / 118</li>
              <li>• Hubungi keluarga, sahabat, atau orang terdekat yang Anda percayai untuk hadir mendampingi Anda saat ini.</li>
            </ul>
          </div>
          <p className="text-xs text-rose-300 italic">
            *Latihan refleksi dinonaktifkan sementara demi keselamatan Anda. Mohon segera hubungi kontak bantuan di atas.
          </p>
        </motion.div>
      )}

      {/* Main Tab Navigation */}
      <div className="flex border-b border-stone-800 overflow-x-auto no-scrollbar gap-2">
        <button
          onClick={() => setActiveTab('education')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'education'
              ? 'border-amber-500 text-amber-300 bg-amber-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Edukasi Stres V2.0
        </button>
        <button
          onClick={() => setActiveTab('reflection')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'reflection'
              ? 'border-amber-500 text-amber-300 bg-amber-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Refleksi 7 Pertanyaan AI
        </button>
        <button
          onClick={() => setActiveTab('burnout-pause')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'burnout-pause'
              ? 'border-amber-500 text-amber-300 bg-amber-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <PauseCircle className="w-4 h-4" /> Jeda Kelelahan (Burnout)
        </button>
        <button
          onClick={() => setActiveTab('professional')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'professional'
              ? 'border-amber-500 text-amber-300 bg-amber-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <PhoneCall className="w-4 h-4" /> Bantuan Profesional
        </button>
      </div>

      {/* TAB 1: EDUKASI STRES V2.0 */}
      {activeTab === 'education' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Apa itu Stres */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-lg">
            <h2 className="text-xl font-bold text-stone-100 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" /> Memahami Apa Itu Stres
            </h2>
            <p className="text-stone-300 text-sm md:text-base leading-relaxed">
              Stres merupakan respon normal tubuh terhadap tekanan atau tuntutan hidup. Respon tersebut secara ilmiah melibatkan koordinasi kompleks antara <strong>Pikiran, Emosi, Sistem Saraf, Hormon, Tubuh, dan Perilaku</strong>.
            </p>
          </div>

          {/* Jenis Stres */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-lg">
            <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" /> Jenis-Jenis Stres
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm">
              <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl space-y-2">
                <span className="font-bold text-amber-300 text-sm block">1. Stres Akut</span>
                <p className="text-stone-300 leading-relaxed">
                  Stres jangka pendek akibat tuntutan atau tantangan yang baru terjadi/akan segera dihadapi. Contoh: ujian besok pagi, presentasi dadakan.
                </p>
              </div>

              <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl space-y-2">
                <span className="font-bold text-amber-400 text-sm block">2. Stres Episodik</span>
                <p className="text-stone-300 leading-relaxed">
                  Stres akut yang terjadi berulang kali secara konstan dalam kehidupan sehari-hari, menyebabkan individu merasa selalu terburu-buru atau kacau.
                </p>
              </div>

              <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl space-y-2">
                <span className="font-bold text-rose-400 text-sm block">3. Stres Kronis</span>
                <p className="text-stone-300 leading-relaxed">
                  Stres berkepanjangan yang berlangsung dalam jangka waktu lama (berbulan-bulan/bertahun-tahun), menguras daya tahan fisik dan mental.
                </p>
              </div>
            </div>
          </div>

          {/* Sumber Stres */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-lg">
            <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" /> Sumber & Pemicu Stres
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {STRESS_SOURCES_OPTIONS.map((source, idx) => (
                <span
                  key={idx}
                  className="bg-stone-950 border border-stone-800 px-3 py-1.5 rounded-lg text-stone-300"
                >
                  • {source}
                </span>
              ))}
            </div>
          </div>

          {/* Respon Stres (4 Ranah) */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-stone-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" /> Respon Stres Dalam 4 Ranah
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Pikiran */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block flex items-center gap-1.5">
                  <Brain className="w-4 h-4" /> Pikiran
                </span>
                <ul className="text-xs text-stone-300 space-y-1.5 list-disc pl-4">
                  <li>Sulit fokus</li>
                  <li>Overthinking</li>
                  <li>Mudah lupa</li>
                  <li>Sulit mengambil keputusan</li>
                </ul>
              </div>

              {/* Emosi */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block flex items-center gap-1.5">
                  <Flame className="w-4 h-4" /> Emosi
                </span>
                <ul className="text-xs text-stone-300 space-y-1.5 list-disc pl-4">
                  <li>Marah</li>
                  <li>Sedih</li>
                  <li>Cemas</li>
                  <li>Kecewa & Frustrasi</li>
                </ul>
              </div>

              {/* Tubuh */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4" /> Tubuh
                </span>
                <ul className="text-xs text-stone-300 space-y-1.5 list-disc pl-4">
                  <li>Jantung berdebar</li>
                  <li>Tegang leher/bahu</li>
                  <li>Nyeri kepala/lambung</li>
                  <li>Gangguan tidur & lelah</li>
                </ul>
              </div>

              {/* Perilaku */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> Perilaku
                </span>
                <ul className="text-xs text-stone-300 space-y-1.5 list-disc pl-4">
                  <li>Menunda pekerjaan</li>
                  <li>Makan berlebihan/kurang</li>
                  <li>Menarik diri</li>
                  <li>Bekerja terus-menerus</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Faktor Pelindung (Protective Factors) */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-lg">
            <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" /> Faktor Pelindung (Protective Factors)
            </h3>
            <p className="text-xs md:text-sm text-stone-300">
              Elemen pemulih yang dapat memperkuat daya tahan tubuh dan pikiran dari dampak negatif stres:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-stone-950/60 border border-stone-800 p-3 rounded-xl flex items-center gap-2.5">
                <Bed className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-stone-200 font-semibold">Tidur Cukup</span>
              </div>
              <div className="bg-stone-950/60 border border-stone-800 p-3 rounded-xl flex items-center gap-2.5">
                <Dumbbell className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-stone-200 font-semibold">Olahraga / Gerak</span>
              </div>
              <div className="bg-stone-950/60 border border-stone-800 p-3 rounded-xl flex items-center gap-2.5">
                <Apple className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-stone-200 font-semibold">Nutrisi & Hidrasi</span>
              </div>
              <div className="bg-stone-950/60 border border-stone-800 p-3 rounded-xl flex items-center gap-2.5">
                <Users className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-stone-200 font-semibold">Hubungan Sosial</span>
              </div>
              <div className="bg-stone-950/60 border border-stone-800 p-3 rounded-xl flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-stone-200 font-semibold">Manajemen Waktu</span>
              </div>
              <div className="bg-stone-950/60 border border-stone-800 p-3 rounded-xl flex items-center gap-2.5">
                <Brain className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-stone-200 font-semibold">Kesadaran Diri</span>
              </div>
              <div className="bg-stone-950/60 border border-stone-800 p-3 rounded-xl flex items-center gap-2.5">
                <Coffee className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-stone-200 font-semibold">Istirahat Berkala</span>
              </div>
              <div className="bg-stone-950/60 border border-stone-800 p-3 rounded-xl flex items-center gap-2.5">
                <Wind className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-stone-200 font-semibold">Relaksasi & Napas</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 2: REFLEKSI 7 PERTANYAAN AI */}
      {activeTab === 'reflection' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {!isSelfHarmExpressed && (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg">
              <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
                  <Sparkles className="w-5 h-5" /> 7 Pertanyaan Reflektif LEGA Stress
                </div>
                <span className="text-xs text-stone-400">Refleksi Kesadaran Terpandu</span>
              </div>

              {/* Q1: Main Stressor */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-200 block">
                  1. Apa yang sedang memberi tekanan terbesar bagi Anda saat ini?
                </label>
                <textarea
                  value={mainStressor}
                  onChange={(e) => setMainStressor(e.target.value)}
                  rows={3}
                  placeholder="Ceritakan situasi, tuntutan, atau tenggat waktu yang saat ini paling menguras pikiran dan energi Anda..."
                  className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3.5 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/80"
                />
              </div>

              {/* Q2: Duration */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-200 block">
                  2. Sudah berapa lama tekanan ini berlangsung?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Baru hari ini', 'Beberapa hari terakhir', 'Beberapa minggu ini', 'Sudah berbulan-bulan'].map((duration) => (
                    <button
                      key={duration}
                      type="button"
                      onClick={() => setStressDuration(duration)}
                      className={`p-2.5 rounded-xl border text-xs text-center transition-all ${
                        stressDuration === duration
                          ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold'
                          : 'bg-stone-950/50 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      {duration}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q3: Stress Sources */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-200 block">
                  3. Pilih sumber pemicu stres yang relevan:
                </label>
                <div className="flex flex-wrap gap-2">
                  {STRESS_SOURCES_OPTIONS.map((item) => {
                    const active = selectedSources.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleArrayItem(item, selectedSources, setSelectedSources)}
                        className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                          active
                            ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-semibold'
                            : 'bg-stone-950/50 border-stone-800 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        {item} {active && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Q4: 4 Domains Symptoms */}
              <div className="space-y-4 pt-2 border-t border-stone-800">
                <label className="text-sm font-bold text-amber-300 block">
                  4. Bagaimana tubuh, pikiran, emosi, dan perilaku Anda meresponnya?
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Pikiran */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">Pikiran</span>
                    <div className="flex flex-wrap gap-1.5">
                      {THOUGHT_RESPONSES.map((item) => {
                        const active = selectedThought.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleArrayItem(item, selectedThought, setSelectedThought)}
                            className={`px-2.5 py-1 rounded-md border text-[11px] ${
                              active ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200 font-semibold' : 'bg-stone-950/40 border-stone-800 text-stone-400'
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Emosi */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">Emosi Dominan</span>
                    <div className="flex flex-wrap gap-1.5">
                      {EMOTIONAL_RESPONSES.map((item) => {
                        const active = selectedEmotional.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleArrayItem(item, selectedEmotional, setSelectedEmotional)}
                            className={`px-2.5 py-1 rounded-md border text-[11px] ${
                              active ? 'bg-rose-500/20 border-rose-500 text-rose-200 font-semibold' : 'bg-stone-950/40 border-stone-800 text-stone-400'
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tubuh */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Respon Tubuh</span>
                    <div className="flex flex-wrap gap-1.5">
                      {PHYSICAL_RESPONSES.map((item) => {
                        const active = selectedPhysical.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleArrayItem(item, selectedPhysical, setSelectedPhysical)}
                            className={`px-2.5 py-1 rounded-md border text-[11px] ${
                              active ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-semibold' : 'bg-stone-950/40 border-stone-800 text-stone-400'
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Perilaku */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Respon Perilaku</span>
                    <div className="flex flex-wrap gap-1.5">
                      {BEHAVIORAL_RESPONSES.map((item) => {
                        const active = selectedBehavioral.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleArrayItem(item, selectedBehavioral, setSelectedBehavioral)}
                            className={`px-2.5 py-1 rounded-md border text-[11px] ${
                              active ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-semibold' : 'bg-stone-950/40 border-stone-800 text-stone-400'
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Q5 & Q6: Controllable vs Uncontrollable */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-stone-800">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                    5. Apa yang tidak berada dalam kendali Anda?
                  </label>
                  <input
                    type="text"
                    value={uncontrollableAspects}
                    onChange={(e) => setUncontrollableAspects(e.target.value)}
                    placeholder="Misal: Ekspektasi orang lain, situasi masa lalu, kebijakan..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                    6. Apa yang masih berada dalam kendali Anda?
                  </label>
                  <input
                    type="text"
                    value={controllableActions}
                    onChange={(e) => setControllableActions(e.target.value)}
                    placeholder="Misal: Cara bersikap, mengambil jeda, mengatur waktu, minum air..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500/80"
                  />
                </div>
              </div>

              {/* Q7: Primary Need */}
              <div className="space-y-1.5 pt-2 border-t border-stone-800">
                <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  7. Apa kebutuhan Anda yang paling mendesak saat ini?
                </label>
                <input
                  type="text"
                  value={primaryNeed}
                  onChange={(e) => setPrimaryNeed(e.target.value)}
                  placeholder="Misal: Istirahat mental, tidur cukup, bercerita pada teman, keheningan..."
                  className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500/80"
                />
              </div>

              {/* Conditions checkboxes */}
              <div className="space-y-3 pt-2 border-t border-stone-800">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="burnoutCheck"
                    checked={isBurnoutOrSevere}
                    onChange={(e) => setIsBurnoutOrSevere(e.target.checked)}
                    className="rounded border-stone-700 bg-stone-900 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="burnoutCheck" className="text-xs text-stone-300 cursor-pointer font-medium">
                    Saya mengalami kelelahan berat (burnout) & membutuhkan panduan jeda
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="chronicCheck"
                    checked={isChronicStress}
                    onChange={(e) => setIsChronicStress(e.target.checked)}
                    className="rounded border-stone-700 bg-stone-900 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="chronicCheck" className="text-xs text-stone-300 cursor-pointer">
                    Stres ini sudah berlangsung sangat lama (kronis) & mengganggu aktivitas harian
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
                    [PENTING] Saya sedang merasa sangat kewalahan / ada dorongan menyakiti diri
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleProcessReflection}
                  className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg"
                >
                  Proses Refleksi & Edukasi AI <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Output Card */}
          {isLoading ? (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center space-y-4 shadow-xl">
              <Sparkles className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
              <h3 className="text-lg font-bold text-stone-200">Menyusun Edukasi LEGA Stress...</h3>
              <p className="text-sm text-stone-400 max-w-md mx-auto">
                LEGA AI sedang mengurai sinyal stres Anda dan memetakan langkah pemulihan yang tepat.
              </p>
            </div>
          ) : reflectionResult && !isSelfHarmExpressed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-stone-900 border border-amber-800/40 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
                    <Flame className="w-6 h-6" /> Hasil Analisis & Refleksi Stres
                  </div>
                  <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full">
                    Sintesis Edukatif AI
                  </span>
                </div>

                <div className="space-y-4 text-stone-200 leading-relaxed text-sm md:text-base">
                  <p className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl text-stone-300 italic">
                    "{reflectionResult.summary}"
                  </p>

                  {/* Stress Type Explanation */}
                  {reflectionResult.stressTypeExplanation && (
                    <div className="bg-stone-950/50 border border-amber-900/40 p-4 rounded-xl space-y-1">
                      <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> Klasifikasi Kategori Stres:
                      </h4>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        {reflectionResult.stressTypeExplanation}
                      </p>
                    </div>
                  )}

                  {/* Symptoms Breakdown 4 Domains */}
                  {reflectionResult.symptomsBreakdown && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-stone-950/50 border border-stone-800 p-3 rounded-xl space-y-1">
                        <span className="text-[11px] font-bold text-indigo-400 block">Pikiran</span>
                        <p className="text-xs text-stone-300">{reflectionResult.symptomsBreakdown.thought}</p>
                      </div>
                      <div className="bg-stone-950/50 border border-stone-800 p-3 rounded-xl space-y-1">
                        <span className="text-[11px] font-bold text-rose-400 block">Emosi</span>
                        <p className="text-xs text-stone-300">{reflectionResult.symptomsBreakdown.emotion}</p>
                      </div>
                      <div className="bg-stone-950/50 border border-stone-800 p-3 rounded-xl space-y-1">
                        <span className="text-[11px] font-bold text-amber-400 block">Tubuh</span>
                        <p className="text-xs text-stone-300">{reflectionResult.symptomsBreakdown.body}</p>
                      </div>
                      <div className="bg-stone-950/50 border border-stone-800 p-3 rounded-xl space-y-1">
                        <span className="text-[11px] font-bold text-emerald-400 block">Perilaku</span>
                        <p className="text-xs text-stone-300">{reflectionResult.symptomsBreakdown.behavior}</p>
                      </div>
                    </div>
                  )}

                  {/* Reflective Insights */}
                  {reflectionResult.reflectiveInsights && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-stone-950/50 border border-stone-800 p-4 rounded-xl space-y-1">
                        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Shield className="w-4 h-4" /> Di Luar Kendali (Dilepaskan):
                        </h4>
                        <p className="text-xs text-stone-400 leading-relaxed">
                          {reflectionResult.reflectiveInsights.outOfControl}
                        </p>
                      </div>

                      <div className="bg-stone-950/50 border border-amber-900/40 p-4 rounded-xl space-y-1">
                        <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Zap className="w-4 h-4" /> Langkah Mikro Hari Ini (Dalam Kendali):
                        </h4>
                        <p className="text-xs text-stone-200 leading-relaxed font-medium">
                          {reflectionResult.reflectiveInsights.microAction || reflectionResult.reflectiveInsights.inControl}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Protective Factors Tips */}
                  {reflectionResult.protectiveFactorTips && reflectionResult.protectiveFactorTips.length > 0 && (
                    <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl space-y-2">
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Shield className="w-4 h-4" /> Rekomendasi Faktor Pelindung:
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs text-stone-300">
                        {reflectionResult.protectiveFactorTips.map((tip: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Professional consult guide */}
                  {reflectionResult.professionalConsultGuide && (
                    <div className="bg-amber-950/40 border border-amber-800/60 p-4 rounded-xl text-xs text-amber-200 space-y-1">
                      <span className="font-bold block flex items-center gap-1.5 text-amber-300">
                        <PhoneCall className="w-4 h-4" /> Panduan Konsultasi Profesional:
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
                    <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold block">
                      Rekomendasi Audio LEGA:
                    </span>
                    <p className="text-xs text-stone-200 font-bold">
                      Tema: "{reflectionResult.recommendedAudioTheme}"
                    </p>
                  </div>
                  <button
                    onClick={() => onSelectModule('audio-ai')}
                    className="bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition"
                  >
                    <Volume2 className="w-4 h-4" /> Buka LEGA Audio
                  </button>
                </div>
              )}

              {/* Recommended Modules */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Rekomendasi Latihan LEGA Terhubung:
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
          ) : null}
        </motion.div>
      )}

      {/* TAB 3: JEDA KELELAHAN / BURNOUT */}
      {activeTab === 'burnout-pause' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg"
        >
          <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
              <PauseCircle className="w-6 h-6" /> Panduan Jeda Saat Kelelahan Berat (Burnout)
            </div>
            <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full">
              Pemulihan Berkelanjutan
            </span>
          </div>

          <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl text-xs md:text-sm text-stone-300 leading-relaxed">
            Jika pikiran terasa sangat buntu dan tubuh kehabisan energi:
            <strong className="text-stone-100 block mt-1">
              "Beri diri Anda izin untuk berhenti sejenak. Menyediakan jeda bukan tanda malas, melainkan cara yang paling rasional untuk merawat stamina jiwa dan raga."
            </strong>
          </div>

          {/* Micro-Pause Step Guide */}
          <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400">
              <span>Langkah Jeda Pemulihan {pauseStep} dari 5</span>
              <span>Protokol Jeda Singkat</span>
            </div>

            {pauseStep === 1 && (
              <div className="space-y-3 text-center py-4">
                <PauseCircle className="w-12 h-12 text-amber-400 mx-auto" />
                <h4 className="text-lg font-bold text-stone-100">1. Berhenti Sejenak Dari Layar & Tugas</h4>
                <p className="text-sm text-stone-300 max-w-md mx-auto">
                  Tutup gawai Anda atau alihkan pandangan dari meja kerja selama 2 menit. Biarkan mata dan pikiran terbebas dari rangsangan informasi.
                </p>
              </div>
            )}

            {pauseStep === 2 && (
              <div className="space-y-3 text-center py-4">
                <Wind className="w-12 h-12 text-indigo-400 mx-auto animate-pulse" />
                <h4 className="text-lg font-bold text-stone-100">2. Sadari Napas & Lemaskan Bahu</h4>
                <p className="text-sm text-stone-300 max-w-md mx-auto">
                  Turunkan bahu Anda yang tegang. Tarik napas perlahan, dan bayangkan ketegangan di area leher perlahan melorot saat Anda menghembuskan napas.
                </p>
              </div>
            )}

            {pauseStep === 3 && (
              <div className="space-y-3 text-center py-4">
                <Layers className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-stone-100">3. Kurangi Tuntutan Sementara</h4>
                <p className="text-sm text-stone-300 max-w-md mx-auto">
                  Tanyakan pada diri: "Apa 1 hal non-esensial yang bisa saya tunda atau abaikan hari ini?" Bebaskan diri dari kesempurnaan.
                </p>
              </div>
            )}

            {pauseStep === 4 && (
              <div className="space-y-3 text-center py-4">
                <Coffee className="w-12 h-12 text-rose-400 mx-auto" />
                <h4 className="text-lg font-bold text-stone-100">4. Penuhi Kebutuhan Fisik Paling Mendesak</h4>
                <p className="text-sm text-stone-300 max-w-md mx-auto">
                  Minum segelas air putih, makan camilan sehat, atau lakukan peregangan tubuh sederhana. Penuhi kebutuhan paling dasar yang terabaikan.
                </p>
              </div>
            )}

            {pauseStep === 5 && (
              <div className="space-y-3 text-center py-4">
                <Smile className="w-12 h-12 text-amber-400 mx-auto" />
                <h4 className="text-lg font-bold text-stone-100">5. Tentukan Satu Tindakan Sangat Sederhana</h4>
                <p className="text-sm text-stone-300 max-w-md mx-auto">
                  Jangan mencoba menyelesaikan semua sekaligus. Pilih 1 tugas terkecil yang berdurasi 2 menit, lalu kerjakan tanpa terburu-buru.
                </p>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-stone-800">
              <button
                disabled={pauseStep === 1}
                onClick={() => setPauseStep((prev) => Math.max(1, prev - 1))}
                className="text-stone-400 hover:text-stone-200 text-xs disabled:opacity-30"
              >
                Sebelumnya
              </button>
              {pauseStep < 5 ? (
                <button
                  onClick={() => setPauseStep((prev) => Math.min(5, prev + 1))}
                  className="bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5"
                >
                  Langkah Berikutnya <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setPauseStep(1)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5"
                >
                  Selesai & Ulangi Jeda
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onSelectModule('body-awareness')}
              className="bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2"
            >
              <HeartPulse className="w-4 h-4" /> LEGA Body Awareness (Scan Tubuh)
            </button>
            <button
              onClick={() => onSelectModule('audio-ai')}
              className="bg-stone-800 hover:bg-stone-700 text-indigo-300 border border-indigo-500/30 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4" /> LEGA Audio Pelepasan Ketegangan
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
              <PhoneCall className="w-5 h-5 text-amber-400" /> Stres Berkelanjutan & Konsultasi Profesional
            </h2>

            <p className="text-stone-300 text-sm leading-relaxed">
              Stres yang berlangsung sangat lama (stres kronis) tanpa jeda dapat menekan sistem kekebalan tubuh dan mengganggu kualitas hidup. Sangat dianjurkan untuk menemui profesional (psikolog klinis, psikiater, atau dokter) apabila stres yang Anda alami:
            </p>

            <div className="space-y-3">
              <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm text-stone-200">
                  <span className="font-bold block text-stone-100">Mengganggu Pekerjaan / Sekolah / Kuliah</span>
                  Membuat produktivitas menurun drastis, memicu ketakutan berlebih terhadap tugas, atau sering absen.
                </div>
              </div>

              <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm text-stone-200">
                  <span className="font-bold block text-stone-100">Merusak Hubungan Sosial / Keluarga</span>
                  Memicu konflik berulang, kemarahan yang tak terkendali, atau isolasi diri sepenuhnya.
                </div>
              </div>

              <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm text-stone-200">
                  <span className="font-bold block text-stone-100">Menyebabkan Gangguan Tidur & Kesehatan Kronis</span>
                  Insomnia parah, pusing berkepanjangan, atau gangguan lambung/pencernaan yang tak kunjung sembuh.
                </div>
              </div>

              <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm text-stone-200">
                  <span className="font-bold block text-stone-100">Memunculkan Perasaan Hampa / Putus Asa</span>
                  Merasa tidak ada jalan keluar dan kehilangan kegembiraan dalam hal-hal yang biasanya Anda sukai.
                </div>
              </div>
            </div>

            {/* Helpline Info */}
            <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <PhoneCall className="w-4 h-4" /> Layanan Bantuan & Kesehatan Darurat
              </h4>
              <ul className="text-xs text-stone-300 space-y-2">
                <li>• <strong>Layanan Sehat Jiwa Kemenkes RI:</strong> Hotline 119 (Ext 8)</li>
                <li>• <strong>Layanan Darurat Nasional:</strong> 112 / 118</li>
                <li>• <strong>Fasilitas Kesehatan Terdekat:</strong> Kunjungi Puskesmas atau Poli Jiwa/Psikologi di Rumah Sakit terdekat Anda.</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
