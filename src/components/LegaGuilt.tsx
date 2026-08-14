import React, { useState } from 'react';
import {
  Scale,
  Sparkles,
  BookOpen,
  Volume2,
  Heart,
  Shield,
  HelpCircle,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  PhoneCall,
  Activity,
  ArrowRight,
  ChevronRight,
  Brain,
  Feather,
  Compass,
  Zap,
  Info,
  ShieldCheck,
  Check,
  Play,
  VolumeX,
  RefreshCw,
  UserCheck,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';
import { reflectGuilt } from '../lib/geminiApi';
import { JournalEntry } from '../types';

interface LegaGuiltProps {
  onSelectModule: (module: string) => void;
  onAddJournal?: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
}

const GUILT_SOURCES = [
  'Ucapan / Tindakan yang menyakiti orang lain',
  'Keputusan di masa lalu yang disesali',
  'Tidak memenuhi tanggung jawab / JANJI',
  'Melanggar nilai pribadi / moral',
  'Merasa mengecewakan keluarga / teman',
  'Merasa tidak cukup baik / kurang berusaha',
  'Rasa bersalah yang diwariskan dari tekanan sosial',
  'Ekspektasi & standar kesempurnaan yang terlalu tinggi'
];

const GUILT_AUDIO_TRACKS = [
  {
    title: 'Audio Memahami Rasa Bersalah',
    description: 'Napas terpandu memahami rasa bersalah sebagai sinyal nilai pribadi, bukan identitas diri.',
    duration: '4 min',
    textPrompt: 'Duduklah dengan tenang dan pejamkan mata sejenak... Rasa bersalah yang hadir saat ini menunjukkan bahwa Anda adalah insan yang memiliki kepekaan batin dan peduli pada nilai-nilai kebaikan. Namun, tindakan yang disesali bukanlah seluruh identitas Anda.'
  },
  {
    title: 'Audio Berdamai dengan Kesalahan',
    description: 'Panduan menerima kenyataan masa lalu tanpa membebani pikiran dengan pengandaian.',
    duration: '5 min',
    textPrompt: 'Masa lalu adalah lembaran yang tidak dapat diubah kembali. Mengakui kesalahan tanpa menghakimi diri sendiri adalah pintu awal menuju kedamaian dan pemulihan batin.'
  },
  {
    title: 'Audio Memaafkan Diri',
    description: 'Merawat rasa sesal dan mengalirkan pengampunan pada diri sendiri.',
    duration: '5 min',
    textPrompt: 'Letakkan satu telapak tangan di dada Anda... Bisikkan secara lembut: "Saya memaafkan diri saya untuk hal-hal yang tidak saya ketahui di masa lalu. Saya belajar dan terus tumbuh setiap hari."'
  },
  {
    title: 'Audio Melepaskan Beban Penyesalan',
    description: 'Visualisasi pelepasan beban rasa bersalah dari bahu dan dada.',
    duration: '4 min',
    textPrompt: 'Rasakan ketegangan di area bahu dan dada Anda. Hembuskan napas secara perlahan... Bayangkan setiap kali hembusan napas, sebahagian beban berat penyesalan dilepaskan dengan ikhlas.'
  },
  {
    title: 'Audio Belajar dari Masa Lalu',
    description: 'Memetik hikmah berharga dan fokus pada tindakan nyata saat ini.',
    duration: '4 min',
    textPrompt: 'Alihkan fokus Anda dari penghukuman diri menuju pertumbuhan. Apa satu pelajaran berharga yang diajarkan oleh pengalaman ini untuk perjalanan hidup Anda ke depan?'
  },
  {
    title: 'Audio Self-Compassion',
    description: 'Mengembangkan tutur kata yang lembut dan penuh belas kasih kepada diri.',
    duration: '5 min',
    textPrompt: 'Bicara pada diri Anda seperti berbicara kepada seorang sahabat sejati yang sedang belajar dari kesalahannya. Berikan pengertian dan ruang untuk bertumbuh.'
  },
  {
    title: 'Audio Sebelum Tidur',
    description: 'Relaksasi melepas penyesalan sebelum tidur malam.',
    duration: '6 min',
    textPrompt: 'Malam ini, biarkan tubuh dan pikiran Anda beristirahat sepenuhnya dari beban penyesalan. Anda telah berjuang sebaik mungkin. Rehatlah dalam kedamaian.'
  }
];

export const LegaGuilt: React.FC<LegaGuiltProps> = ({
  onSelectModule,
  onAddJournal,
}) => {
  const [activeTab, setActiveTab] = useState<'education' | 'reality' | 'reflection' | 'audio' | 'repair'>('education');

  // Form states (V2.0 Refleksi 7 Pertanyaan)
  const [guiltReason, setGuiltReason] = useState<string>('');
  const [whatHappenedFacts, setWhatHappenedFacts] = useState<string>('');
  const [realResponsibility, setRealResponsibility] = useState<string>('');
  const [outsideControlParts, setOutsideControlParts] = useState<string>('');
  const [canBeRepaired, setCanBeRepaired] = useState<string>('');
  const [futureChanges, setFutureChanges] = useState<string>('');
  const [lessonsLearned, setLessonsLearned] = useState<string>('');

  // Flags
  const [isExcessiveGuilt, setIsExcessiveGuilt] = useState<boolean>(false);
  const [isCrisisRisk, setIsCrisisRisk] = useState<boolean>(false);

  // Audio state
  const [playingTrackIndex, setPlayingTrackIndex] = useState<number | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
  const [audioObject, setAudioObject] = useState<HTMLAudioElement | null>(null);

  // Async AI Reflection state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reflectionResult, setReflectionResult] = useState<any>(null);
  const [journalSaved, setJournalSaved] = useState<boolean>(false);

  const handleProcessReflection = async () => {
    setIsLoading(true);

    const result = await reflectGuilt({
      guiltReason,
      whatHappenedFacts,
      realResponsibility,
      outsideControlParts,
      canBeRepaired,
      futureChanges,
      lessonsLearned,
      isExcessiveGuilt,
      isCrisisRisk
    });

    setReflectionResult(result);
    setIsLoading(false);
  };

  const handleSaveToJournal = () => {
    if (!onAddJournal || !reflectionResult) return;

    const content = `=== REFLEKSI LEGA GUILT (V2.0) ===
Alasan Rasa Bersalah: ${guiltReason || '-'}
Fakta Sebenarnya: ${whatHappenedFacts || '-'}

Tanggung Jawab vs Luar Kendali:
- Tanggung Jawab Nyata: ${realResponsibility || '-'}
- Hal Di Luar Kendali: ${outsideControlParts || '-'}

Rencana Perbaikan & Langkah Depan:
- Perbaikan / Permintaan Maaf: ${canBeRepaired || '-'}
- Tindakan Berbeda: ${futureChanges || '-'}
- Pelajaran Dipetik: ${lessonsLearned || '-'}

Sintesis & Insight AI:
${reflectionResult.summary || '-'}

Self-Compassion Insight:
${reflectionResult.selfCompassionMessage || '-'}`;

    onAddJournal({
      title: 'Refleksi LEGA Guilt V2.0',
      content,
      mood: 'cemas',
      tags: ['Guilt', 'RasaBersalah', 'Responsibility', 'BelasKasihDiri', 'MemaafkanDiri']
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

    const track = GUILT_AUDIO_TRACKS[index];
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
      <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-800/40 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Scale className="w-48 h-48 text-indigo-400" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase">
            <Scale className="w-3.5 h-3.5" />
            LEGA Guilt • Version 2.0
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-100">
            Memahami Rasa Bersalah & Tanggung Jawab Sehat
          </h1>
          <p className="text-sm md:text-base text-stone-300 leading-relaxed max-w-2xl">
            Mengurai rasa bersalah secara objektif, membedakan fakta tindakan dari penilaian diri yang berlebihan, serta melatih langkah perbaikan tanpa terus-menerus menghukum diri.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs text-stone-400">
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Fakta vs Asumsi
            </span>
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-indigo-400" /> Tanggung Jawab Nyata
            </span>
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-indigo-400" /> Self-Compassion
            </span>
          </div>
        </div>
      </div>

      {/* Filosofi LEGA Guilt Card */}
      <div className="bg-stone-900/90 border border-indigo-500/30 rounded-2xl p-5 md:p-6 shadow-md space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
          <Compass className="w-4 h-4" /> Filosofi LEGA Guilt
        </span>
        <blockquote className="text-sm md:text-base text-stone-200 font-medium italic leading-relaxed border-l-2 border-indigo-500 pl-4 py-1">
          "Rasa bersalah dapat memberikan informasi, namun ia bukan identitas diri. Melakukan kesalahan tidak berarti seseorang adalah orang yang sepenuhnya buruk. Kesalahan dapat diakui, diperbaiki bila memungkinkan, dan pelajaran dapat diambil. Setelah itu, Anda berhak melanjutkan hidup tanpa terus-menerus menghukum diri sendiri."
        </blockquote>
      </div>

      {/* Emergency Crisis Alert if Crisis Expressed */}
      {isCrisisRisk && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-indigo-950/90 border-2 border-indigo-600 rounded-2xl p-6 text-stone-100 space-y-4 shadow-2xl"
        >
          <div className="flex items-center gap-3 text-indigo-300 font-bold text-lg border-b border-indigo-800 pb-3">
            <PhoneCall className="w-6 h-6 animate-pulse text-indigo-400" />
            DUKUNGAN KRISIS & KESELAMATAN JIWA
          </div>
          <p className="text-sm leading-relaxed text-stone-200">
            Penyesalan atau beban bersalah yang sangat berat terkadang terasa menghimpit. Keberadaan dan jiwa Anda sangat berharga. Jika muncul keinginan menyakiti diri atau keputusasaan berat, mohon istirahat sejenak dan hubungi bantuan krisis resmi.
          </p>
          <div className="bg-stone-900/90 border border-indigo-800/80 p-4 rounded-xl space-y-2 text-xs md:text-sm">
            <span className="font-bold text-indigo-300 block">Layanan Darurat & Pendampingan Jiwa:</span>
            <ul className="space-y-1 text-stone-300">
              <li>• <strong>Layanan Sehat Jiwa Kemenkes RI:</strong> Call Center 119 (Tekan 8)</li>
              <li>• <strong>Into The Light Indonesia:</strong> www.intothelightid.org</li>
              <li>• <strong>Kontak Darurat Nasional:</strong> 112 / 118</li>
            </ul>
          </div>
          <p className="text-xs text-indigo-300 italic">
            *Latihan refleksi dinonaktifkan demi keselamatan Anda.
          </p>
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
          <BookOpen className="w-4 h-4" /> Edukasi Guilt vs Shame
        </button>
        <button
          onClick={() => setActiveTab('reality')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'reality'
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Scale className="w-4 h-4" /> Analisis Realitas (Fakta vs Asumsi)
        </button>
        <button
          onClick={() => setActiveTab('reflection')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'reflection'
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Refleksi 7 Pertanyaan AI
        </button>
        <button
          onClick={() => setActiveTab('audio')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'audio'
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Volume2 className="w-4 h-4" /> Audio LEGA Guilt
        </button>
        <button
          onClick={() => setActiveTab('repair')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'repair'
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Award className="w-4 h-4" /> Perbaikan & Self-Compassion
        </button>
      </div>

      {/* TAB 1: EDUKASI GUILT VS SHAME */}
      {activeTab === 'education' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Membedakan Guilt dan Shame */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-lg">
            <h2 className="text-xl font-bold text-stone-100 flex items-center gap-2">
              <Scale className="w-5 h-5 text-indigo-400" /> Perbedaan Utama: Guilt vs Shame
            </h2>
            <p className="text-stone-300 text-sm md:text-base leading-relaxed">
              Memahami perbedaan antara <strong>Rasa Bersalah (Guilt)</strong> dan <strong>Rasa Malu Diri (Shame)</strong> adalah kunci penting agar kita tidak terjebak dalam hukuman diri yang tidak sehat.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-indigo-950/40 border border-indigo-800/60 p-5 rounded-xl space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 block flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" /> GUILT (Rasa Bersalah)
                </span>
                <p className="text-sm font-semibold text-stone-200 italic">
                  "Aku melakukan sesuatu yang menurutku salah."
                </p>
                <ul className="text-xs text-stone-300 space-y-1.5 list-disc pl-4 pt-1">
                  <li>Berfokus pada <strong>tindakan atau perilaku spesifik</strong>.</li>
                  <li>Dapat mendorong evaluasi objektif & perbaikan nyata.</li>
                  <li>Memisahkan tindakan dari harga diri yang utuh.</li>
                </ul>
              </div>

              <div className="bg-rose-950/30 border border-rose-900/50 p-5 rounded-xl space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-300 block flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" /> SHAME (Rasa Malu Diri)
                </span>
                <p className="text-sm font-semibold text-stone-200 italic">
                  "Aku adalah orang yang buruk / cacat."
                </p>
                <ul className="text-xs text-stone-300 space-y-1.5 list-disc pl-4 pt-1">
                  <li>Cenderung menyerang <strong>identitas & harga diri</strong>.</li>
                  <li>Memicu dorongan bersembunyi, menarik diri, atau membenci diri.</li>
                  <li>Sering kali membuat orang merasa tidak berdaya.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sumber-Sumber Rasa Bersalah */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-lg">
            <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400" /> Sumber Rasa Bersalah Yang Umum
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-300">
              {GUILT_SOURCES.map((source, idx) => (
                <div key={idx} className="bg-stone-950/60 border border-stone-800 p-3 rounded-xl flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                  <span>{source}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 2: ANALISIS REALITAS (FAKTA VS ASUMSI) */}
      {activeTab === 'reality' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg"
        >
          <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-lg">
              <Scale className="w-5 h-5" /> Panduan Analisis Realitas LEGA
            </div>
            <span className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full">
              Pemeriksaan Objektif
            </span>
          </div>

          <p className="text-sm text-stone-300 leading-relaxed">
            Sebelum mengambil kesimpulan atau menyalahkan diri sendiri, gunakan kerangka pertanyaan objektif ini untuk mengurai fakta situasi:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
            <div className="bg-stone-950/70 border border-stone-800 p-4 rounded-xl space-y-2">
              <span className="font-bold text-indigo-300 block flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400" /> 1. Memeriksa Fakta Objektif
              </span>
              <p className="text-stone-400">
                Apa yang benar-benar terjadi? Tindakan apa yang spesifik Anda lakukan atau tidak lakukan? Apa bukti konkret yang ada?
              </p>
            </div>

            <div className="bg-stone-950/70 border border-stone-800 p-4 rounded-xl space-y-2">
              <span className="font-bold text-amber-300 block flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-amber-400" /> 2. Memisahkan Asumsi
              </span>
              <p className="text-stone-400">
                Bagian mana yang hanya merupakan asumsi pikiran Anda? Apakah Anda mengandaikan pikiran orang lain tanpa bukti langsung?
              </p>
            </div>

            <div className="bg-stone-950/70 border border-stone-800 p-4 rounded-xl space-y-2">
              <span className="font-bold text-blue-300 block flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-blue-400" /> 3. Pemetaan Tanggung Jawab
              </span>
              <p className="text-stone-400">
                Apakah Anda sepenuhnya bertanggung jawab, atau terdapat faktor lingkungan, respon orang lain, atau situasi yang di luar kendali Anda?
              </p>
            </div>

            <div className="bg-stone-950/70 border border-stone-800 p-4 rounded-xl space-y-2">
              <span className="font-bold text-emerald-300 block flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-400" /> 4. Evaluasi Standar Diri
              </span>
              <p className="text-stone-400">
                Apakah Anda sedang menuntut kesempurnaan mutlak pada diri sendiri? Mengakui keterbatasan adalah bagian dari menjadi manusia.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 3: REFLEKSI 7 PERTANYAAN AI */}
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
                  <Sparkles className="w-5 h-5" /> 7 Pertanyaan Reflektif LEGA Guilt
                </div>
                <span className="text-xs text-stone-400">Pemeriksaan Objektif Terpandu</span>
              </div>

              {/* Q1: Guilt Reason */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-200 block">
                  1. Apa yang membuat Anda merasa bersalah saat ini?
                </label>
                <textarea
                  value={guiltReason}
                  onChange={(e) => setGuiltReason(e.target.value)}
                  rows={2}
                  placeholder="Jelaskan penyesalan, tindakan, atau peristiwa yang mengganggu pikiran Anda..."
                  className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3.5 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-indigo-500/80"
                />
              </div>

              {/* Q2: Facts */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-200 block">
                  2. Apa yang sebenarnya terjadi (fakta objektif)?
                </label>
                <textarea
                  value={whatHappenedFacts}
                  onChange={(e) => setWhatHappenedFacts(e.target.value)}
                  rows={2}
                  placeholder="Sebutkan tindakan konkret tanpa menggunakan kata-kata penghakiman seperti 'aku bodoh'..."
                  className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3.5 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-indigo-500/80"
                />
              </div>

              {/* Q3 & Q4: Real Responsibility & Outside Control */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-stone-800 pt-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
                    3. Bagian mana yang benar-benar tanggung jawab Anda?
                  </label>
                  <input
                    type="text"
                    value={realResponsibility}
                    onChange={(e) => setRealResponsibility(e.target.value)}
                    placeholder="Perilaku atau kata-kata yang memang berasal dari Anda..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-indigo-500/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                    4. Bagian mana yang di luar kendali Anda?
                  </label>
                  <input
                    type="text"
                    value={outsideControlParts}
                    onChange={(e) => setOutsideControlParts(e.target.value)}
                    placeholder="Reaksi orang lain, ekspektasi eksternal, atau situasi tak terduga..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-indigo-500/80"
                  />
                </div>
              </div>

              {/* Q5 & Q6: Can Be Repaired & Future Changes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-stone-800 pt-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                    5. Apakah ada hal yang dapat diperbaiki saat ini?
                  </label>
                  <input
                    type="text"
                    value={canBeRepaired}
                    onChange={(e) => setCanBeRepaired(e.target.value)}
                    placeholder="Misal: Meminta maaf dengan tulus, mengganti kerugian, atau meluruskan miskomunikasi..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-indigo-500/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-blue-300 uppercase tracking-wider block">
                    6. Apa yang ingin Anda lakukan secara berbeda ke depannya?
                  </label>
                  <input
                    type="text"
                    value={futureChanges}
                    onChange={(e) => setFutureChanges(e.target.value)}
                    placeholder="Misal: Lebih berhati-hati berbicara, menetapkan batasan jelas..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-indigo-500/80"
                  />
                </div>
              </div>

              {/* Q7: Lessons Learned */}
              <div className="space-y-1.5 border-t border-stone-800 pt-3">
                <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block">
                  7. Apa pelajaran berharga yang dapat Anda petik dari pengalaman ini?
                </label>
                <input
                  type="text"
                  value={lessonsLearned}
                  onChange={(e) => setLessonsLearned(e.target.value)}
                  placeholder="Hikmah untuk pendewasaan batin dan pertumbuhan diri Anda..."
                  className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-indigo-500/80"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 border-t border-stone-800 pt-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="excessiveGuiltCheck"
                    checked={isExcessiveGuilt}
                    onChange={(e) => setIsExcessiveGuilt(e.target.checked)}
                    className="rounded border-stone-700 bg-stone-900 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="excessiveGuiltCheck" className="text-xs text-stone-300 cursor-pointer font-medium">
                    Saya merasa rasa bersalah ini sangat berlebihan / merasa menghukum diri sendiri terus-menerus
                  </label>
                </div>

                <div className="flex items-center gap-2 bg-indigo-950/40 p-3 rounded-xl border border-indigo-900/60">
                  <input
                    type="checkbox"
                    id="crisisGuiltCheck"
                    checked={isCrisisRisk}
                    onChange={(e) => setIsCrisisRisk(e.target.checked)}
                    className="rounded border-indigo-700 bg-stone-900 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="crisisGuiltCheck" className="text-xs text-indigo-300 cursor-pointer font-bold">
                    [PENTING] Beban penyesalan memicu dorongan menyakiti diri atau merasa tidak berdaya
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleProcessReflection}
                  className="bg-indigo-600 hover:bg-indigo-500 text-stone-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg"
                >
                  Proses Refleksi & Insight AI <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Output Card */}
          {isLoading ? (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center space-y-4 shadow-xl">
              <Sparkles className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
              <h3 className="text-lg font-bold text-stone-200">Mengevaluasi Situasi Secara Jernih...</h3>
              <p className="text-sm text-stone-400 max-w-md mx-auto">
                LEGA AI sedang memetakan fakta, tanggung jawab nyata, serta menyusun pesan belas kasih diri.
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
                    <Scale className="w-6 h-6" /> Hasil Evaluasi & Insight LEGA Guilt
                  </div>
                  <span className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full">
                    Sintesis Refleksi Objektif
                  </span>
                </div>

                <div className="space-y-4 text-stone-200 leading-relaxed text-sm md:text-base">
                  <p className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl text-stone-300 italic">
                    "{reflectionResult.summary}"
                  </p>

                  {/* Guilt vs Shame Notice */}
                  {reflectionResult.guiltVsShameNotice && (
                    <div className="bg-indigo-950/30 border border-indigo-800/50 p-4 rounded-xl space-y-1">
                      <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Info className="w-4 h-4" /> Pengingat Guilt vs Shame:
                      </h4>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        {reflectionResult.guiltVsShameNotice.explanation}
                      </p>
                    </div>
                  )}

                  {/* Responsibility Breakdown */}
                  {reflectionResult.responsibilityBreakdown && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-stone-950/50 border border-indigo-900/40 p-4 rounded-xl space-y-1">
                        <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Tanggung Jawab Nyata Anda:
                        </h4>
                        <ul className="text-xs text-stone-300 space-y-1 list-disc pl-4">
                          {reflectionResult.responsibilityBreakdown.userResponsibility?.map((item: string, idx: number) => (
                            <li key={idx}>{item}</li>
                          )) || <li>Tindakan objektif yang perlu dievaluasi</li>}
                        </ul>
                      </div>

                      <div className="bg-stone-950/50 border border-amber-900/40 p-4 rounded-xl space-y-1">
                        <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Compass className="w-4 h-4" /> Hal Di Luar Kendali Anda:
                        </h4>
                        <ul className="text-xs text-stone-300 space-y-1 list-disc pl-4">
                          {reflectionResult.responsibilityBreakdown.outsideControl?.map((item: string, idx: number) => (
                            <li key={idx}>{item}</li>
                          )) || <li>Respon lingkungan dan ekspektasi di luar batas kendali</li>}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Repair & Self Compassion */}
                  {reflectionResult.selfCompassionMessage && (
                    <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl space-y-2">
                      <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Feather className="w-4 h-4" /> Pesan Self-Compassion:
                      </h4>
                      <p className="text-xs text-stone-200 leading-relaxed font-medium">
                        {reflectionResult.selfCompassionMessage}
                      </p>
                    </div>
                  )}

                  {/* Recommended Modules */}
                  {reflectionResult.recommendedModules && reflectionResult.recommendedModules.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                        Latihan LEGA Yang Direkomendasikan:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {reflectionResult.recommendedModules.map((mod: any, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => onSelectModule(mod.targetModuleKey)}
                            className="bg-stone-950 border border-stone-800 hover:border-indigo-500/50 p-3 rounded-xl text-left space-y-1 transition group"
                          >
                            <span className="text-xs font-bold text-indigo-300 group-hover:text-indigo-200 flex items-center justify-between">
                              {mod.moduleName} <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                            </span>
                            <p className="text-[11px] text-stone-400 line-clamp-2">
                              {mod.reason}
                            </p>
                          </button>
                        ))}
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
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-stone-800 text-stone-950 disabled:text-stone-500 font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition"
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

      {/* TAB 4: AUDIO LEGA GUILT */}
      {activeTab === 'audio' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg">
            <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-lg">
                <Volume2 className="w-5 h-5" /> Audio Panduan LEGA Guilt (Dinamis Gemini TTS)
              </div>
              <span className="text-xs text-stone-400">Suara Terpandu Bahasa Indonesia</span>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed">
              Dengarkan narasi audio terpandu untuk membantu melepaskan beban penyesalan, menenangkan pikiran dari penghukuman diri, dan melatih belas kasih pada diri sendiri:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GUILT_AUDIO_TRACKS.map((track, index) => {
                const isPlaying = playingTrackIndex === index;
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border transition-all ${
                      isPlaying
                        ? 'bg-indigo-950/60 border-indigo-500'
                        : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
                          {track.duration}
                        </span>
                        <h4 className="text-sm font-bold text-stone-200">{track.title}</h4>
                        <p className="text-xs text-stone-400">{track.description}</p>
                      </div>

                      <button
                        disabled={isAudioLoading && playingTrackIndex === index}
                        onClick={() => handlePlayAudioTrack(index)}
                        className={`p-3 rounded-full shrink-0 transition ${
                          isPlaying
                            ? 'bg-indigo-500 text-stone-950'
                            : 'bg-stone-800 hover:bg-stone-700 text-indigo-300'
                        }`}
                      >
                        {isAudioLoading && playingTrackIndex === index ? (
                          <Sparkles className="w-4 h-4 animate-spin" />
                        ) : isPlaying ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 5: PERBAIKAN & SELF-COMPASSION */}
      {activeTab === 'repair' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg"
        >
          <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-lg">
              <Award className="w-5 h-5" /> Panduan Perbaikan & Self-Compassion
            </div>
            <span className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full">
              Langkah Konstruktif
            </span>
          </div>

          <div className="space-y-4 text-xs md:text-sm text-stone-300">
            <div className="bg-stone-950/70 border border-stone-800 p-4 rounded-xl space-y-2">
              <h4 className="font-bold text-indigo-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" /> 1. Langkah Perbaikan Sehat (Jika Ada Kesalahan Nyata)
              </h4>
              <ul className="space-y-1 list-disc pl-4 text-stone-400">
                <li><strong>Mengakui Tindakan:</strong> Mengakuinya secara jujur tanpa mencari alasan berlebihan.</li>
                <li><strong>Meminta Maaf Bila Tepat:</strong> Menyampaikan permohonan maaf yang tulus dan fokus pada dampak yang dialami pihak lain.</li>
                <li><strong>Memperbaiki Kerugian:</strong> Melakukan tindakan nyata untuk memperbaiki akibat dari kesalahan bila memungkinkan.</li>
                <li><strong>Mencegah Pengulangan:</strong> Menyusun komitmen pribadi agar tidak mengulangi kekhilafan serupa di masa mendatang.</li>
              </ul>
            </div>

            <div className="bg-stone-950/70 border border-stone-800 p-4 rounded-xl space-y-2">
              <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
                <Feather className="w-4 h-4 text-amber-400" /> 2. Afirmasi Self-Compassion LEGA
              </h4>
              <blockquote className="border-l-2 border-amber-500 pl-3 py-1 text-stone-200 italic space-y-1">
                <p>"Anda boleh mengakui kesalahan tanpa harus membenci diri sendiri."</p>
                <p>"Kesalahan adalah bagian dari proses belajar manusia, bukan vonis abadi atas nilai diri Anda."</p>
                <p>"Anda dapat memperbaiki sesuatu dan melangkah maju tanpa harus terus menghukum diri."</p>
              </blockquote>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
