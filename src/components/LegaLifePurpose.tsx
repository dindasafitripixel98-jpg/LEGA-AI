import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  BookOpen,
  Volume2,
  Heart,
  Shield,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  PhoneCall,
  Activity,
  ChevronRight,
  Brain,
  Feather,
  Zap,
  Info,
  ShieldCheck,
  Play,
  VolumeX,
  UserCheck,
  HeartHandshake,
  Footprints,
  Eye,
  Wind,
  Target,
  Award,
  Layers,
  ArrowRight,
  TrendingUp,
  Sliders,
  CheckSquare,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { reflectLifePurpose } from '../lib/geminiApi';
import { JournalEntry } from '../types';

interface LegaLifePurposeProps {
  onSelectModule: (module: string) => void;
  onAddJournal?: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
}

const LIFE_VALUES_LIST = [
  'Keluarga', 'Kebebasan', 'Keamanan', 'Kejujuran', 'Pertumbuhan',
  'Ilmu & Wawasan', 'Kreativitas', 'Keadilan', 'Pelayanan', 'Spiritualitas',
  'Kemandirian', 'Kontribusi', 'Stabilitas', 'Hubungan Tokcer', 'Prestasi', 'Ketenangan Batin'
];

const EXPLORATION_AREAS = [
  {
    title: '1. Nilai Hidup (Values)',
    desc: 'Prinsip utama yang menjadi kompas pendorong keputusan dan gaya hidup Anda.',
    examples: 'Keluarga, kebebasan, kejujuran, pertumbuhan, ketenangan, kontribusi.'
  },
  {
    title: '2. Kekuatan Diri (Strengths)',
    desc: 'Kemampuan, keterampilan, karakter positif, dan pengalaman beradaptasi yang Anda miliki.',
    examples: 'Kepekaan emosional, pemecahan masalah, kreativitas, daya ingat, komunikasi.'
  },
  {
    title: '3. Minat & Ketertarikan (Interests)',
    desc: 'Topik, rasa penasaran, atau aktivitas yang membuat Anda merasa bersemangat dan lupa waktu.',
    examples: 'Seni, psikologi, teknologi, alam, memasak, olahraga, filsafat.'
  },
  {
    title: '4. Makna & Kontribusi (Meaning)',
    desc: 'Momen berkesan saat Anda merasa hidup ini berarti, berguna bagi sesama, dan berharga.',
    examples: 'Membantu orang lain, menyelesaikan proyek impian, membimbing sesama.'
  },
  {
    title: '5. Pengalaman Hidup (Life Experience)',
    desc: 'Pembelajaran berharga dari dinamika keberhasilan, kesulitan, dan keputusan penting.',
    examples: 'Resilience dari kegagalan masa lalu, titik balik keputusan karir/hidup.'
  }
];

const VALUE_VS_GOAL_EXAMPLES = [
  {
    value: 'Kesehatan (Nilai)',
    direction: 'Merawat dan menjaga kebugaran fisik',
    goal: 'Berjalan kaki 30 menit 3 kali seminggu (Tujuan)',
    habit: 'Menyiapkan sepatu olahraga sebelum tidur'
  },
  {
    value: 'Belajar & Pertumbuhan (Nilai)',
    direction: 'Mengembangkan wawasan dan ilmu baru',
    goal: 'Menyelesaikan 1 kursus/buku dalam sebulan (Tujuan)',
    habit: 'Membaca 15 halaman setiap pagi'
  },
  {
    value: 'Keluarga & Hubungan (Nilai)',
    direction: 'Membangun kehangatan dan kehadiran penuh',
    goal: 'Meluangkan waktu khusus tanpa gadget setiap akhir pekan (Tujuan)',
    habit: 'Makan malam bersama tanpa ponsel'
  },
  {
    value: 'Kontribusi & Pelayanan (Nilai)',
    direction: 'Berbagi kebermanfaatan dengan sesama',
    goal: 'Menjadi relawan/mentor 2 jam setiap bulan (Tujuan)',
    habit: 'Menanyakan kabar 1 teman/kerabat setiap minggu'
  }
];

const LIFE_PURPOSE_AUDIO_TRACKS = [
  {
    title: 'Audio Mengenal Arah Hidup',
    description: 'Orientasi lembut membuka wawasan mengenai kompas hidup dan makna keberadaan.',
    duration: '5 min',
    textPrompt: 'Napas masuk dengan tenang... Sadari bahwa Anda tidak harus mengetahui seluruh jalan masa depan saat ini. Cukup kenali satu langkah yang paling jujur bagi diri Anda hari ini.'
  },
  {
    title: 'Audio Menemukan Nilai Diri',
    description: 'Menelusuri prinsip dan hal yang paling hakiki dan penting dalam batin Anda.',
    duration: '5 min',
    textPrompt: 'Apakah yang paling Anda hargai? Kebebasan, kejujuran, atau kehangatan keluarga? Rasakan nilai tersebut bergetar lembut di dada Anda saat ini.'
  },
  {
    title: 'Audio Mengenal Apa yang Bermakna',
    description: 'Mengingat momen-momen saat hidup terasa berguna, penuh arti, dan membahagiakan.',
    duration: '5 min',
    textPrompt: 'Ingatlah kembali saat Anda membantu seseorang atau menyelesaikan hal kecil dengan tulus. Di situlah jejak makna hidup Anda berakar.'
  },
  {
    title: 'Audio Refleksi Masa Depan',
    description: 'Visualisasi positif kehidupan yang selaras dan damai dalam beberapa tahun ke depan.',
    duration: '5 min',
    textPrompt: 'Bayangkan diri Anda beberapa tahun ke depan, hidup dengan tenang, melakukan hal yang dicintai, dan dikelilingi kedamaian. Izinkan gambaran itu memberi inspirasi.'
  },
  {
    title: 'Audio Menentukan Prioritas',
    description: 'Menyaring hal yang benar-benar penting dan melepaskan ekspektasi luar yang membebani.',
    duration: '4 min',
    textPrompt: 'Anda tidak perlu menyenangkan semua orang. Fokuskan energi Anda pada prioritas yang selaras dengan nilai batin Anda sendiri.'
  },
  {
    title: 'Audio Menemukan Langkah Berikutnya',
    description: 'Menerjemahkan cita-cita besar menjadi tindakan kecil yang dapat dilakukan hari ini.',
    duration: '4 min',
    textPrompt: 'Sebuah perjalanan ribuan mil dimulai dari satu langkah kecil. Apa satu tindakan 5 menit yang bisa Anda lakukan dengan mudah sekarang?'
  },
  {
    title: 'Audio Menjalani Hidup dengan Sadar',
    description: 'Hadir sepenuhnya dalam setiap aktivitas harian dengan rasa penuh kesyukuran.',
    duration: '5 min',
    textPrompt: 'Menjalani hidup dengan sadar berarti menikmati setiap prosesnya, bukan sekadar memburu hasil akhir. Nikmati napas Anda saat ini.'
  }
];

export const LegaLifePurpose: React.FC<LegaLifePurposeProps> = ({
  onSelectModule,
  onAddJournal,
}) => {
  const [activeTab, setActiveTab] = useState<'education' | 'value-vs-goal' | 'reflection' | 'vision-score' | 'audio'>('education');

  // Form states (8 Core Reflective Questions for LEGA Life Purpose)
  const [selectedValues, setSelectedValues] = useState<string[]>(['Pertumbuhan', 'Keluarga', 'Ketenangan Batin']);
  const [strengths, setStrengths] = useState<string>('');
  const [interests, setInterests] = useState<string>('');
  const [meaningfulMoments, setMeaningfulMoments] = useState<string>('');
  const [peopleToHelp, setPeopleToHelp] = useState<string>('');
  const [idealFutureVision, setIdealFutureVision] = useState<string>('');
  const [currentObstacles, setCurrentObstacles] = useState<string>('');
  const [smallStepToday, setSmallStepToday] = useState<string>('');

  // Special Flags
  const [isLostOrEmpty, setIsLostOrEmpty] = useState<boolean>(false);
  const [isCrisisRisk, setIsCrisisRisk] = useState<boolean>(false);

  // Audio State
  const [playingTrackIndex, setPlayingTrackIndex] = useState<number | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
  const [audioObject, setAudioObject] = useState<HTMLAudioElement | null>(null);

  // Async AI Reflection state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reflectionResult, setReflectionResult] = useState<any>(null);
  const [journalSaved, setJournalSaved] = useState<boolean>(false);

  const toggleValueSelection = (val: string) => {
    if (selectedValues.includes(val)) {
      setSelectedValues(selectedValues.filter(v => v !== val));
    } else {
      if (selectedValues.length < 5) {
        setSelectedValues([...selectedValues, val]);
      } else {
        alert('Maksimal memilih 5 nilai utama agar refleksi lebih fokus.');
      }
    }
  };

  const handleProcessReflection = async () => {
    setIsLoading(true);

    const result = await reflectLifePurpose({
      selectedValues,
      strengths,
      interests,
      meaningfulMoments,
      peopleToHelp,
      idealFutureVision,
      currentObstacles,
      smallStepToday,
      isLostOrEmpty,
      isCrisisRisk
    });

    setReflectionResult(result);
    setIsLoading(false);
  };

  const handleSaveToJournal = () => {
    if (!onAddJournal || !reflectionResult) return;

    const content = `=== REFLEKSI LEGA LIFE PURPOSE (V2.0) ===
Nilai Utama: ${selectedValues.join(', ')}
Kekuatan Diri: ${strengths || '-'}
Minat: ${interests || '-'}
Aktivitas Bermakna: ${meaningfulMoments || '-'}
Siapa yang Ingin Dibantu: ${peopleToHelp || '-'}
Visi Masa Depan: ${idealFutureVision || '-'}
Langkah Kecil Hari Ini: ${smallStepToday || '-'}

Pernyataan Tujuan Sementara (Tentative Purpose Statement):
"${reflectionResult.tentativePurposeStatement || '-'}"

Sintesis AI Insight:
${reflectionResult.summary || '-'}

Visi & Goals Translation:
- Jangka Pendek (1-3 bulan): ${reflectionResult.lifeVision?.shortTermGoals?.join('; ') || '-'}
- Jangka Menengah (6-12 bulan): ${reflectionResult.lifeVision?.mediumTermGoals?.join('; ') || '-'}
- Kebiasaan Pendukung: ${reflectionResult.lifeVision?.supportingHabits?.join('; ') || '-'}`;

    onAddJournal({
      title: 'Refleksi LEGA Life Purpose V2.0',
      content,
      mood: 'netral',
      tags: ['LifePurpose', 'NilaiHidup', 'Visi', 'SelfGrowth', 'GoalTranslation']
    });

    setJournalSaved(true);
  };

  const handlePlayAudioTrack = async (index: number) => {
    if (playingTrackIndex === index && audioObject) {
      audioObject.pause();
      setPlayingTrackIndex(null);
      return;
    }

    if (audioObject) {
      audioObject.pause();
    }

    const track = LIFE_PURPOSE_AUDIO_TRACKS[index];
    setIsAudioLoading(true);
    setPlayingTrackIndex(index);

    try {
      const res = await fetch('/api/gemini/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: track.textPrompt,
          voiceName: 'Kore'
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.audioBase64) {
        throw new Error(data.error || 'Gagal menghasilkan audio TTS');
      }

      const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
      audio.onended = () => setPlayingTrackIndex(null);
      await audio.play();
      setAudioObject(audio);
    } catch (err: any) {
      console.error('Audio play error:', err);
      alert('Gagal memutar audio TTS: ' + (err.message || 'Terjadi kesalahan'));
      setPlayingTrackIndex(null);
    } finally {
      setIsAudioLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-800/40 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Compass className="w-48 h-48 text-indigo-400" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase">
            <Compass className="w-3.5 h-3.5" />
            LEGA Life Purpose • Version 2.0
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-100">
            Mengeksplorasi Arah Hidup, Nilai Diri & Tujuan Bermakna
          </h1>
          <p className="text-sm md:text-base text-stone-300 leading-relaxed max-w-2xl">
            Menemukan kompas internal melalui pemetaan nilai, kekuatan, minat, makna, serta menyusun tujuan realistis yang dapat dilangkah secara bertahap.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs text-stone-400">
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" /> Nilai vs Tujuan
            </span>
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" /> Goal Translation
            </span>
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-400" /> Purpose Statement
            </span>
          </div>
        </div>
      </div>

      {/* Filosofi LEGA Life Purpose Card */}
      <div className="bg-stone-900/90 border border-indigo-500/30 rounded-2xl p-5 md:p-6 shadow-md space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
          <Compass className="w-4 h-4" /> Filosofi LEGA Life Purpose
        </span>
        <blockquote className="text-sm md:text-base text-stone-200 font-medium italic leading-relaxed border-l-2 border-indigo-500 pl-4 py-1">
          "Tujuan hidup bukan sesuatu yang harus langsung ditemukan secara instan. Tujuan hidup dibangun melalui pengalaman, apa yang kita pedulikan, lakukan, siapa yang dibantu, dipelajari, dan diperjuangkan. Tidak semua orang harus memiliki tujuan hidup yang sama."
        </blockquote>
      </div>

      {/* Gentle Empathy Banner if Lost/Empty checked */}
      {isLostOrEmpty && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-950/60 border border-indigo-800/60 rounded-2xl p-5 text-stone-200 space-y-2 shadow-lg"
        >
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
            <HeartHandshake className="w-5 h-5 text-indigo-400" /> Pendampingan Saat Merasa Kehilangan Arah
          </div>
          <p className="text-xs md:text-sm text-stone-300 leading-relaxed">
            "Anda tidak harus menemukan semua jawabannya hari ini. Mari kita mulai dari apa yang paling penting bagi Anda saat ini, dari hal kecil yang ada di sekitar Anda."
          </p>
        </motion.div>
      )}

      {/* Emergency Crisis Alert if Crisis Expressed */}
      {isCrisisRisk && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-purple-950/90 border-2 border-purple-600 rounded-2xl p-6 text-stone-100 space-y-4 shadow-2xl"
        >
          <div className="flex items-center gap-3 text-purple-300 font-bold text-lg border-b border-purple-800 pb-3">
            <PhoneCall className="w-6 h-6 animate-pulse text-purple-400" />
            DUKUNGAN KRISIS & KESELAMATAN JIWA
          </div>
          <p className="text-sm leading-relaxed text-stone-200">
            Perasaan hampa yang sangat berat atau keputusasaan terkadang terasa membendung. Keberadaan dan jiwa Anda sangat berharga. Jika muncul dorongan menyakiti diri atau merasa tidak sanggup lagi, mohon istirahat sejenak dan hubungi bantuan krisis resmi.
          </p>
          <div className="bg-stone-900/90 border border-purple-800/80 p-4 rounded-xl space-y-2 text-xs md:text-sm">
            <span className="font-bold text-purple-300 block">Layanan Darurat & Pendampingan Jiwa:</span>
            <ul className="space-y-1 text-stone-300">
              <li>• <strong>Layanan Sehat Jiwa Kemenkes RI:</strong> Call Center 119 (Tekan 8)</li>
              <li>• <strong>Into The Light Indonesia:</strong> www.intothelightid.org</li>
              <li>• <strong>Kontak Darurat Nasional:</strong> 112 / 118</li>
            </ul>
          </div>
        </motion.div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-stone-800 overflow-x-auto no-scrollbar gap-2">
        <button
          onClick={() => setActiveTab('education')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'education'
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Edukasi & 5 Area
        </button>
        <button
          onClick={() => setActiveTab('value-vs-goal')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'value-vs-goal'
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Layers className="w-4 h-4" /> Nilai vs Tujuan
        </button>
        <button
          onClick={() => setActiveTab('reflection')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'reflection'
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Refleksi AI & Purpose
        </button>
        <button
          onClick={() => setActiveTab('vision-score')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'vision-score'
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Target className="w-4 h-4" /> Visi & Purpose Score
        </button>
        <button
          onClick={() => setActiveTab('audio')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'audio'
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Volume2 className="w-4 h-4" /> Audio LEGA Purpose
        </button>
      </div>

      {/* TAB 1: EDUKASI & 5 AREA EKSPLORASI */}
      {activeTab === 'education' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-lg">
            <h2 className="text-xl font-bold text-stone-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400" /> 5 Area Eksplorasi Arah Hidup
            </h2>
            <p className="text-stone-300 text-sm md:text-base leading-relaxed">
              Memahami tujuan hidup tidak dicapai lewat teori semata, melainkan lewat mengeksplorasi 5 dimensi utama dalam pengalaman sehari-hari Anda:
            </p>

            <div className="space-y-3 pt-2">
              {EXPLORATION_AREAS.map((area, idx) => (
                <div key={idx} className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl space-y-1">
                  <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                    {area.title}
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {area.desc}
                  </p>
                  <span className="text-[11px] text-stone-500 italic block pt-1">
                    Contoh: {area.examples}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 2: NILAI VS TUJUAN & GOAL TRANSLATION */}
      {activeTab === 'value-vs-goal' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg"
        >
          <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-lg">
              <Layers className="w-5 h-5" /> Perbedaan Nilai Diri vs Tujuan Konkret
            </div>
            <span className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full">
              Pola Goal Translation
            </span>
          </div>

          <p className="text-sm text-stone-300 leading-relaxed">
            Banyak orang bingung karena mencampuradukkan <strong>Nilai</strong> (kompas batin) dengan <strong>Tujuan</strong> (target fisik). LEGA AI membantu Anda menghubungkannya:
          </p>

          <div className="bg-stone-950/70 border border-indigo-900/50 p-4 rounded-xl space-y-3">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
              Formula Harta Karun Goal Translation:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-stone-200 text-center py-2 bg-stone-900 rounded-lg border border-stone-800">
              <span className="text-indigo-400">NILAI</span> <ArrowRight className="w-3.5 h-3.5 text-stone-600" />
              <span className="text-blue-400">ARAH</span> <ArrowRight className="w-3.5 h-3.5 text-stone-600" />
              <span className="text-emerald-400">TUJUAN</span> <ArrowRight className="w-3.5 h-3.5 text-stone-600" />
              <span className="text-amber-400">KEBIASAAN</span> <ArrowRight className="w-3.5 h-3.5 text-stone-600" />
              <span className="text-purple-400">TINDAKAN</span>
            </div>
          </div>

          {/* Table / Grid Example */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Contoh Penerjemahan Nilai Menjadi Langkah Konkret:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {VALUE_VS_GOAL_EXAMPLES.map((ex, idx) => (
                <div key={idx} className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-indigo-300 block border-b border-stone-800 pb-1">
                    • {ex.value}
                  </span>
                  <div className="text-xs space-y-1 text-stone-300">
                    <p><strong className="text-blue-300">Arah Prinsip:</strong> {ex.direction}</p>
                    <p><strong className="text-emerald-300">Tujuan Target:</strong> {ex.goal}</p>
                    <p><strong className="text-amber-300">Kebiasaan Harian:</strong> {ex.habit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 3: REFLEKSI 8 PERTANYAAN & AI PURPOSE */}
      {activeTab === 'reflection' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {!isCrisisRisk && (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg">
              <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-lg">
                  <Sparkles className="w-5 h-5" /> Refleksi Eksplorasi LEGA Life Purpose
                </div>
                <span className="text-xs text-stone-400">Pernyataan Tujuan Sementara</span>
              </div>

              {/* Values Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
                  1. Pilih 3 - 5 Nilai Utama Yang Paling Anda Hargai:
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {LIFE_VALUES_LIST.map((val, idx) => {
                    const isSelected = selectedValues.includes(val);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleValueSelection(val)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                            : 'bg-stone-950 text-stone-400 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        {isSelected ? '✓ ' : ''}{val}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Strengths & Interests */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-stone-800 pt-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                    2. Apa kekuatan, keterampilan, atau karakter positif Anda?
                  </label>
                  <input
                    type="text"
                    value={strengths}
                    onChange={(e) => setStrengths(e.target.value)}
                    placeholder="Kemampuan analisis, mendengarkan, komunikasi, seni..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-indigo-500/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                    3. Topik / minat apa yang membuat Anda penasaran?
                  </label>
                  <input
                    type="text"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="Hal yang suka dipelajari atau dicari di waktu luang..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-indigo-500/80"
                  />
                </div>
              </div>

              {/* Meaningful Moments & People to Help */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-stone-800 pt-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-blue-300 uppercase tracking-wider block">
                    4. Pengalaman / aktivitas apa yang terasa bermakna?
                  </label>
                  <input
                    type="text"
                    value={meaningfulMoments}
                    onChange={(e) => setMeaningfulMoments(e.target.value)}
                    placeholder="Momen saat merasa berguna dan hidup terasa bernilai..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-indigo-500/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
                    5. Siapa / kelompok apa yang ingin Anda bantu?
                  </label>
                  <input
                    type="text"
                    value={peopleToHelp}
                    onChange={(e) => setPeopleToHelp(e.target.value)}
                    placeholder="Anak-anak, sesama rekan kerja, lansia, hewan, lingkungan..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-indigo-500/80"
                  />
                </div>
              </div>

              {/* Future Vision & Small Step */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-stone-800 pt-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
                    6. Gambaran kehidupan ideal Anda beberapa tahun ke depan?
                  </label>
                  <input
                    type="text"
                    value={idealFutureVision}
                    onChange={(e) => setIdealFutureVision(e.target.value)}
                    placeholder="Kehidupan yang berjalan baik, damai, dan seimbang..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-indigo-500/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                    7. Satu langkah kecil 5 menit yang bisa dilakukan hari ini?
                  </label>
                  <input
                    type="text"
                    value={smallStepToday}
                    onChange={(e) => setSmallStepToday(e.target.value)}
                    placeholder="Membaca 1 artikel, merapikan meja, menyapa teman..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-indigo-500/80"
                  />
                </div>
              </div>

              {/* Checkboxes & Flags */}
              <div className="space-y-3 border-t border-stone-800 pt-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="lostOrEmptyCheck"
                    checked={isLostOrEmpty}
                    onChange={(e) => setIsLostOrEmpty(e.target.checked)}
                    className="rounded border-stone-700 bg-stone-900 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="lostOrEmptyCheck" className="text-xs text-stone-300 cursor-pointer font-medium">
                    Saya sedang merasa agak ragu, bingung, atau kehilangan arah saat ini
                  </label>
                </div>

                <div className="flex items-center gap-2 bg-purple-950/40 p-3 rounded-xl border border-purple-900/60">
                  <input
                    type="checkbox"
                    id="crisisPurposeCheck"
                    checked={isCrisisRisk}
                    onChange={(e) => setIsCrisisRisk(e.target.checked)}
                    className="rounded border-purple-700 bg-stone-900 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="crisisPurposeCheck" className="text-xs text-purple-300 cursor-pointer font-bold">
                    [PENTING] Rasa hampa memicu keputusasaan berat atau dorongan menyakiti diri
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleProcessReflection}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg"
                >
                  Proses Arah Hidup & Insight AI <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Output Card */}
          {isLoading ? (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center space-y-4 shadow-xl">
              <Sparkles className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
              <h3 className="text-lg font-bold text-stone-200">Memetakan Kompas & Visi Kehidupan Anda...</h3>
              <p className="text-sm text-stone-400 max-w-md mx-auto">
                LEGA AI sedang merajut nilai, kekuatan, dan minat Anda menjadi Pernyataan Tujuan Sementara.
              </p>
            </div>
          ) : reflectionResult && !isCrisisRisk ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-stone-900 border border-indigo-800/40 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-lg">
                    <Compass className="w-6 h-6" /> Hasil Evaluasi LEGA Life Purpose
                  </div>
                  <span className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full">
                    Life Purpose Statement
                  </span>
                </div>

                <div className="space-y-4 text-stone-200 leading-relaxed text-sm md:text-base">
                  {/* Tentative Purpose Statement */}
                  {reflectionResult.tentativePurposeStatement && (
                    <div className="bg-gradient-to-r from-indigo-950/80 to-slate-900 border-2 border-indigo-500/50 p-5 rounded-2xl space-y-2 text-stone-100">
                      <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-indigo-400" /> Pernyataan Tujuan Hidup Sementara:
                      </span>
                      <p className="text-base font-medium italic text-indigo-100 leading-relaxed">
                        "{reflectionResult.tentativePurposeStatement}"
                      </p>
                    </div>
                  )}

                  {/* Summary */}
                  <p className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl text-stone-300 italic">
                    "{reflectionResult.summary}"
                  </p>

                  {/* Value to Goal Map */}
                  {reflectionResult.valueToGoalMap && reflectionResult.valueToGoalMap.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4" /> Pemetaan Nilai Menjadi Langkah Realistis:
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {reflectionResult.valueToGoalMap.map((item: any, i: number) => (
                          <div key={i} className="bg-stone-950/80 border border-stone-800 p-4 rounded-xl text-xs space-y-1">
                            <span className="font-bold text-indigo-300 block">Nilai: {item.value}</span>
                            <p><strong className="text-blue-300">Arah:</strong> {item.direction}</p>
                            <p><strong className="text-emerald-300">Tujuan Target:</strong> {item.goal}</p>
                            <p><strong className="text-amber-300">Kebiasaan:</strong> {item.habit}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Life Vision */}
                  {reflectionResult.lifeVision && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-stone-800 pt-3">
                      <div className="bg-stone-950/50 border border-stone-800 p-3.5 rounded-xl space-y-1">
                        <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                          Jangka Pendek (1-3 Bulan):
                        </span>
                        <ul className="text-xs text-stone-300 space-y-1 list-disc pl-4">
                          {reflectionResult.lifeVision.shortTermGoals?.map((g: string, i: number) => (
                            <li key={i}>{g}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-stone-950/50 border border-stone-800 p-3.5 rounded-xl space-y-1">
                        <span className="text-xs font-bold text-blue-300 uppercase tracking-wider block">
                          Jangka Menengah (6-12 Bulan):
                        </span>
                        <ul className="text-xs text-stone-300 space-y-1 list-disc pl-4">
                          {reflectionResult.lifeVision.mediumTermGoals?.map((g: string, i: number) => (
                            <li key={i}>{g}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-stone-950/50 border border-stone-800 p-3.5 rounded-xl space-y-1">
                        <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                          Kebiasaan Pendukung:
                        </span>
                        <ul className="text-xs text-stone-300 space-y-1 list-disc pl-4">
                          {reflectionResult.lifeVision.supportingHabits?.map((h: string, i: number) => (
                            <li key={i}>{h}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Save to Journal & Actions */}
                  <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone-800">
                    <button
                      onClick={() => {
                        setReflectionResult(null);
                        setJournalSaved(false);
                      }}
                      className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Ulangi Refleksi
                    </button>

                    <button
                      disabled={journalSaved}
                      onClick={handleSaveToJournal}
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-stone-800 text-white disabled:text-stone-500 font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition"
                    >
                      {journalSaved ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Tersimpan di Jurnal
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-3.5 h-3.5" /> Simpan ke Jurnal Refleksi
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </motion.div>
      )}

      {/* TAB 4: VISI KEHIDUPAN & LIFE PURPOSE SCORE */}
      {activeTab === 'vision-score' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg"
        >
          <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-lg">
              <Award className="w-5 h-5" /> Life Purpose Score (Alat Refleksi Mandiri)
            </div>
            <span className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full">
              Bukan Ukuran Kelayakan
            </span>
          </div>

          <p className="text-xs md:text-sm text-stone-300 leading-relaxed">
            Skor di bawah ini merupakan indikator refleksi internal untuk melihat area mana yang sudah jelas dan area mana yang memerlukan perhatian lebih lanjut:
          </p>

          <div className="space-y-4 pt-1">
            {[
              { label: 'Kejelasan Nilai (Value Clarity)', score: reflectionResult?.lifePurposeScores?.valueClarity || 80, desc: 'Pemahaman akan prinsip dan nilai utama hidup Anda.' },
              { label: 'Kejelasan Arah (Direction Clarity)', score: reflectionResult?.lifePurposeScores?.directionClarity || 75, desc: 'Visi mengenai orientasi dan jalur yang ingin ditempuh.' },
              { label: 'Keselarasan Aktivitas (Activity Alignment)', score: reflectionResult?.lifePurposeScores?.activityAlignment || 70, desc: 'Seberapa jauh kegiatan harian mencerminkan nilai pribadi Anda.' },
              { label: 'Kejelasan Tujuan (Goal Clarity)', score: reflectionResult?.lifePurposeScores?.goalClarity || 70, desc: 'Korelatif keberadaan target realistis jangka pendek & menengah.' },
              { label: 'Konsistensi Tindakan (Action Consistency)', score: reflectionResult?.lifePurposeScores?.actionConsistency || 65, desc: 'Langkah nyata dan kebiasaan harian yang dilakukan.' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5 bg-stone-950/60 p-3.5 rounded-xl border border-stone-800">
                <div className="flex justify-between text-xs font-bold text-stone-200">
                  <span>{item.label}</span>
                  <span className="text-indigo-400">{item.score}%</span>
                </div>
                <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <p className="text-[11px] text-stone-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* TAB 5: AUDIO LEGA LIFE PURPOSE */}
      {activeTab === 'audio' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg"
        >
          <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-lg">
              <Volume2 className="w-5 h-5" /> Audio Terpandu LEGA Life Purpose
            </div>
            <span className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full">
              Gemini TTS Audio
            </span>
          </div>

          <p className="text-xs md:text-sm text-stone-300 leading-relaxed">
            Dengarkan narasi audio terpandu untuk merefleksikan nilai, ketenangan, serta visi masa depan Anda secara mendalam.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {LIFE_PURPOSE_AUDIO_TRACKS.map((track, idx) => {
              const isPlaying = playingTrackIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-stone-950/80 border border-stone-800 hover:border-indigo-500/50 p-4 rounded-xl space-y-3 transition group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-stone-200 group-hover:text-indigo-300 transition">
                        {track.title}
                      </h4>
                      <span className="text-[11px] text-stone-500">{track.duration} • Suara Kore</span>
                    </div>

                    <button
                      disabled={isAudioLoading && playingTrackIndex === idx}
                      onClick={() => handlePlayAudioTrack(idx)}
                      className={`p-2.5 rounded-full text-white transition ${
                        isPlaying
                          ? 'bg-amber-600 hover:bg-amber-500'
                          : 'bg-indigo-600 hover:bg-indigo-500'
                      }`}
                    >
                      {isAudioLoading && playingTrackIndex === idx ? (
                        <Sparkles className="w-4 h-4 animate-spin" />
                      ) : isPlaying ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-stone-400 leading-relaxed">
                    {track.description}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};
