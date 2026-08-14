import React, { useState } from 'react';
import {
  EyeOff,
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
  Award,
  UserX,
  HeartHandshake
} from 'lucide-react';
import { motion } from 'motion/react';
import { reflectShame } from '../lib/geminiApi';
import { JournalEntry } from '../types';

interface LegaShameProps {
  onSelectModule: (module: string) => void;
  onAddJournal?: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
}

const SHAME_TRIGGERS = [
  'Kritik / Komentar negatif dari orang lain',
  'Penolakan dalam hubungan atau pekerjaan',
  'Kegagalan / Tidak mencapai target',
  'Perbandingan sosial dengan pencapaian orang lain',
  'Kesalahan di depan umum / Publik',
  'Pengalaman dipermalukan atau perundungan (bullying)',
  'Kecemasan mengenai penampilan fisik / Citra tubuh',
  'Pengalaman kelam / Kesalahan masa lalu',
  'Ekspektasi tinggi & standar kesempurnaan diri'
];

const SHAME_RESPONSES = [
  {
    category: 'Pikiran (Mental)',
    items: ['"Aku tidak cukup baik"', '"Orang pasti menilai & merendahkanku"', '"Aku memalukan dan tidak layak"', '"Semua orang lebih baik dariku"']
  },
  {
    category: 'Emosi (Perasaan)',
    items: ['Rasa malu yang membakar', 'Ketakutan ditolak', 'Kecemasan sosial mendalam', 'Rasa tidak berdaya']
  },
  {
    category: 'Sensasi Tubuh (Fisik)',
    items: ['Wajah & telinga terasa panas', 'Pandangan menunduk / Enggan menatap', 'Dada sesak / Jantung berdebar', 'Ketegangan di seluruh tubuh']
  },
  {
    category: 'Perilaku (Aksi)',
    items: ['Menghindari situasi sosial', 'Menarik diri & mengisolasi diri', 'Mencoba menyenangkan orang secara berlebihan', 'Menolak kesempatan baru karena takut dinilai']
  }
];

const SHAME_AUDIO_TRACKS = [
  {
    title: 'Audio Mengenali Rasa Malu',
    description: 'Napas terpandu menyapa emosi malu sebagai gelombang sementara, bukan identitas diri.',
    duration: '4 min',
    textPrompt: 'Duduklah dengan nyaman dan pejamkan mata secara perlahan... Sadari rasa malu yang mungkin sedang singgah di dada atau tubuh Anda. Ingatlah: Anda sedang mengalami emosi malu, bukan menjadi emosi itu.'
  },
  {
    title: 'Audio Berdamai dengan Penilaian Diri',
    description: 'Mengurai kritik internal yang tajam dan menggantinya dengan kelembutan yang objektif.',
    duration: '5 min',
    textPrompt: 'Perhatikan suara kritik di dalam pikiran Anda saat ini. Alih-alih melawannya, dengarkan dengan lembut lalu katakan: "Terima kasih sudah mencoba melindungiku, tapi aku bisa melihat situasi ini secara lebih seimbang."'
  },
  {
    title: 'Audio Menerima Diri',
    description: 'Panduan merawat martabat diri di tengah ketidaksempurnaan sebagai manusia.',
    duration: '5 min',
    textPrompt: 'Letakkan kedua telapak tangan di dada Anda... Bayangkan rasa hangat mengalir ke pusat batin. Katakan pada diri Anda: "Aku menerima diriku secara utuh, dengan segala proses belajar dan ketidaksempurnaanku."'
  },
  {
    title: 'Audio Mengurangi Kritik Diri',
    description: 'Latihan meredakan teguran tajam dan melatih tutur kata internal yang manusiawi.',
    duration: '4 min',
    textPrompt: 'Napas masuk dengan tenang, napas keluar dengan lembut... Bebaskan diri Anda dari tuntutan kesempurnaan mutlak. Anda diizinkan untuk bertumbuh secara bertahap.'
  },
  {
    title: 'Audio Menghadapi Ketakutan Dinilai',
    description: 'Membangun jangkar ketenangan saat berhadapan dengan penilaian atau pandangan orang lain.',
    duration: '5 min',
    textPrompt: 'Bayangkan pandangan dan penilaian orang lain seperti awan yang lewat di langit luas. Nilai diri Anda yang sejati berada di dalam batin Anda, tidak goyah oleh penilaian luar.'
  },
  {
    title: 'Audio Self-Compassion',
    description: 'Bicara kepada diri sendiri seperti kepada seorang sahabat sejati yang sedang terluka.',
    duration: '5 min',
    textPrompt: 'Bicara pada diri Anda sebagaimana Anda akan merangkul seorang teman baik yang sedang merasa tidak cukup baik. Berikan pengertian, kehangatan, dan penerimaan tanpa syarat.'
  },
  {
    title: 'Audio Hadir Saat Ini',
    description: 'Kembali menyatu dengan momen saat ini melalui jangkar panca indra.',
    duration: '4 min',
    textPrompt: 'Rasakan pijakan kaki Anda di lantai, dengarkan suara di sekitar Anda... Kembalilah ke momen saat ini, di mana Anda aman dan utuh.'
  },
  {
    title: 'Audio Sebelum Tidur',
    description: 'Melepaskan beban penilaian dan rasa malu sebelum beristirahat malam.',
    duration: '6 min',
    textPrompt: 'Malam ini, lepaskan seluruh penilaian, rasa malu, dan ekspektasi yang melelahkan. Rehatlah dalam kedamaian. Diri Anda telah berjuang dengan sangat baik hari ini.'
  }
];

export const LegaShame: React.FC<LegaShameProps> = ({
  onSelectModule,
  onAddJournal,
}) => {
  const [activeTab, setActiveTab] = useState<'education' | 'reality' | 'reflection' | 'audio' | 'acceptance'>('education');

  // Form states (V2.0 Refleksi 7 Pertanyaan)
  const [shameTrigger, setShameTrigger] = useState<string>('');
  const [fearOfOthersThoughts, setFearOfOthersThoughts] = useState<string>('');
  const [selfTalkOnShame, setSelfTalkOnShame] = useState<string>('');
  const [factVsJudgment, setFactVsJudgment] = useState<string>('');
  const [lovingFriendPerspective, setLovingFriendPerspective] = useState<string>('');
  const [neededRightNow, setNeededRightNow] = useState<string>('');
  const [learnAboutSelf, setLearnAboutSelf] = useState<string>('');

  // Flags
  const [isSevereShame, setIsSevereShame] = useState<boolean>(false);
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

    const result = await reflectShame({
      shameTrigger,
      fearOfOthersThoughts,
      selfTalkOnShame,
      factVsJudgment,
      lovingFriendPerspective,
      neededRightNow,
      learnAboutSelf,
      isSevereShame,
      isCrisisRisk
    });

    setReflectionResult(result);
    setIsLoading(false);
  };

  const handleSaveToJournal = () => {
    if (!onAddJournal || !reflectionResult) return;

    const content = `=== REFLEKSI LEGA SHAME (V2.0) ===
Pemicu Rasa Malu: ${shameTrigger || '-'}
Ketakutan Penilaian Orang Lain: ${fearOfOthersThoughts || '-'}

Suara Hati & Realitas:
- Self-Talk / Kritik Diri: ${selfTalkOnShame || '-'}
- Fakta vs Penilaian Diri: ${factVsJudgment || '-'}
- Sudut Pandang Teman Kasih: ${lovingFriendPerspective || '-'}

Kebutuhan & Pembelajaran:
- Kebutuhan Batin Saat Ini: ${neededRightNow || '-'}
- Pelajaran / Pemahaman Diri: ${learnAboutSelf || '-'}

Sintesis & Insight AI:
${reflectionResult.summary || '-'}

Pesan Penerimaan Diri (Self-Compassion):
${reflectionResult.selfCompassionMessage || '-'}`;

    onAddJournal({
      title: 'Refleksi LEGA Shame V2.0',
      content,
      mood: 'cemas',
      tags: ['Shame', 'RasaMalu', 'PenerimaanDiri', 'SelfCompassion', 'NilaiDiri']
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

    const track = SHAME_AUDIO_TRACKS[index];
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
      <div className="bg-gradient-to-br from-purple-950/60 via-slate-900 to-slate-950 border border-purple-800/40 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <EyeOff className="w-48 h-48 text-purple-400" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold tracking-wide uppercase">
            <EyeOff className="w-3.5 h-3.5" />
            LEGA Shame • Version 2.0
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-100">
            Memahami Rasa Malu & Membangun Penerimaan Diri
          </h1>
          <p className="text-sm md:text-base text-stone-300 leading-relaxed max-w-2xl">
            Mengenali pemicu dan pikiran negatif tentang diri sendiri, membedakan kesalahan dari nilai diri, serta belajar memperlakukan diri secara seimbang dan manusiawi.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs text-stone-400">
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-purple-400" /> Identitas vs Perilaku
            </span>
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Bebas dari Kritik Ekstrem
            </span>
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-purple-400" /> Self-Compassion
            </span>
          </div>
        </div>
      </div>

      {/* Filosofi LEGA Shame Card */}
      <div className="bg-stone-900/90 border border-purple-500/30 rounded-2xl p-5 md:p-6 shadow-md space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
          <Compass className="w-4 h-4" /> Filosofi LEGA Shame
        </span>
        <blockquote className="text-sm md:text-base text-stone-200 font-medium italic leading-relaxed border-l-2 border-purple-500 pl-4 py-1">
          "Perasaan malu bukan identitas diri. Melakukan kesalahan tidak berarti seseorang adalah manusia yang buruk. Ditolak seseorang tidak berarti seseorang tidak berharga. Tidak memenuhi harapan orang lain tidak otomatis berarti seseorang gagal sebagai manusia. Pengalaman memalukan dapat dipahami tanpa terus-menerus mengulang penghukuman terhadap diri sendiri."
        </blockquote>
      </div>

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
            Rasa malu yang sangat berat atau pengalaman merasa tidak berharga terkadang terasa begitu menyakitkan. Keberadaan dan jiwa Anda sangat berharga. Jika muncul dorongan menyakiti diri atau keputusasaan berat, mohon istirahat sejenak dan hubungi bantuan krisis resmi.
          </p>
          <div className="bg-stone-900/90 border border-purple-800/80 p-4 rounded-xl space-y-2 text-xs md:text-sm">
            <span className="font-bold text-purple-300 block">Layanan Darurat & Pendampingan Jiwa:</span>
            <ul className="space-y-1 text-stone-300">
              <li>• <strong>Layanan Sehat Jiwa Kemenkes RI:</strong> Call Center 119 (Tekan 8)</li>
              <li>• <strong>Into The Light Indonesia:</strong> www.intothelightid.org</li>
              <li>• <strong>Kontak Darurat Nasional:</strong> 112 / 118</li>
            </ul>
          </div>
          <p className="text-xs text-purple-300 italic">
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
              ? 'border-purple-500 text-purple-300 bg-purple-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Edukasi Shame vs Guilt
        </button>
        <button
          onClick={() => setActiveTab('reality')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'reality'
              ? 'border-purple-500 text-purple-300 bg-purple-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Latihan Realitas & Respon
        </button>
        <button
          onClick={() => setActiveTab('reflection')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'reflection'
              ? 'border-purple-500 text-purple-300 bg-purple-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Refleksi 7 Pertanyaan AI
        </button>
        <button
          onClick={() => setActiveTab('audio')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'audio'
              ? 'border-purple-500 text-purple-300 bg-purple-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Volume2 className="w-4 h-4" /> Audio LEGA Shame
        </button>
        <button
          onClick={() => setActiveTab('acceptance')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'acceptance'
              ? 'border-purple-500 text-purple-300 bg-purple-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Heart className="w-4 h-4" /> Penerimaan Diri & Situasi Khusus
        </button>
      </div>

      {/* TAB 1: EDUKASI SHAME VS GUILT */}
      {activeTab === 'education' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Membedakan Shame dan Guilt */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-lg">
            <h2 className="text-xl font-bold text-stone-100 flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-purple-400" /> Perbedaan Utama: Shame vs Guilt
            </h2>
            <p className="text-stone-300 text-sm md:text-base leading-relaxed">
              Sering kali kita mencampuradukkan rasa bersalah dan rasa malu. Memahami perbedaan fokusnya membantu kita melihat diri secara lebih sehat:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-purple-950/40 border border-purple-800/60 p-5 rounded-xl space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300 block flex items-center gap-1.5">
                  <UserX className="w-4 h-4 text-purple-400" /> SHAME (Rasa Malu Diri)
                </span>
                <p className="text-sm font-semibold text-stone-200 italic">
                  "Ada sesuatu yang salah dengan diriku / Aku orang yang buruk."
                </p>
                <ul className="text-xs text-stone-300 space-y-1.5 list-disc pl-4 pt-1">
                  <li>Berfokus pada <strong>identitas & harga diri</strong>.</li>
                  <li>Memicu kecenderungan bersembunyi, mengisolasi diri, atau merendahkan diri.</li>
                  <li>Jika masalah Anda berfokus pada hal ini, Anda berada di modul yang tepat (LEGA Shame).</li>
                </ul>
              </div>

              <div className="bg-indigo-950/30 border border-indigo-800/50 p-5 rounded-xl space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 block flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" /> GUILT (Rasa Bersalah)
                </span>
                <p className="text-sm font-semibold text-stone-200 italic">
                  "Aku melakukan sesuatu yang menurutku salah."
                </p>
                <ul className="text-xs text-stone-300 space-y-1.5 list-disc pl-4 pt-1">
                  <li>Berfokus pada <strong>tindakan atau perilaku spesifik</strong>.</li>
                  <li>Dapat mendorong evaluasi objektif dan perbaikan nyata.</li>
                  <li>
                    <button
                      onClick={() => onSelectModule('guilt')}
                      className="text-indigo-400 hover:underline font-bold"
                    >
                      Buka LEGA Guilt jika masalah Anda lebih pada tindakan disesali →
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Pemetaan Pemicu & Respon Rasa Malu */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-lg">
            <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-purple-400" /> Respon Rasa Malu dalam 4 Ranah Diri
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {SHAME_RESPONSES.map((res, idx) => (
                <div key={idx} className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
                    {res.category}
                  </span>
                  <ul className="text-xs text-stone-300 space-y-1 list-disc pl-4">
                    {res.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 2: LATIHAN REALITAS & RESPON */}
      {activeTab === 'reality' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg"
        >
          <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-lg">
              <ShieldCheck className="w-5 h-5" /> Panduan Latihan Realitas LEGA
            </div>
            <span className="text-xs bg-purple-500/10 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full">
              Pemeriksaan Objektif
            </span>
          </div>

          <p className="text-sm text-stone-300 leading-relaxed">
            Rasa malu sering kali memperbesar bayangan penilaian negatif. Gunakan kerangka latihan realitas ini untuk melihat situasi secara lebih objektif:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
            <div className="bg-stone-950/70 border border-stone-800 p-4 rounded-xl space-y-2">
              <span className="font-bold text-purple-300 block flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400" /> 1. Mengidentifikasi Fakta
              </span>
              <p className="text-stone-400">
                Apa yang benar-benar terjadi sebagai fakta obyektif tanpa interpretasi atau asumsi buruk?
              </p>
            </div>

            <div className="bg-stone-950/70 border border-stone-800 p-4 rounded-xl space-y-2">
              <span className="font-bold text-amber-300 block flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-amber-400" /> 2. Asumsi Penilaian Orang Lain
              </span>
              <p className="text-stone-400">
                Apa yang Anda bayangkan orang lain pikirkan tentang Anda? Adakah bukti kuat bahwa semua orang menilai demikian?
              </p>
            </div>

            <div className="bg-stone-950/70 border border-stone-800 p-4 rounded-xl space-y-2">
              <span className="font-bold text-blue-300 block flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-400" /> 3. Memisahkan Kejadian dari Identitas
              </span>
              <p className="text-stone-400">
                Satu kesalahan, penolakan, atau kegagalan adalah sebuah pengalaman yang terjadi — bukan keseluruhan nilai diri Anda sebagai manusia.
              </p>
            </div>

            <div className="bg-stone-950/70 border border-stone-800 p-4 rounded-xl space-y-2">
              <span className="font-bold text-emerald-300 block flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-emerald-400" /> 4. Kelembutan Pada Diri
              </span>
              <p className="text-stone-400">
                Apakah Anda akan mengucapkan kata-kata perendahan tersebut kepada sahabat yang Anda sayangi? Perlakukan diri Anda dengan standar yang sama.
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
                <div className="flex items-center gap-2 text-purple-400 font-bold text-lg">
                  <Sparkles className="w-5 h-5" /> 7 Pertanyaan Reflektif LEGA Shame
                </div>
                <span className="text-xs text-stone-400">Pemeriksaan Objektif Terpandu</span>
              </div>

              {/* Q1: Shame Trigger */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-200 block">
                  1. Apa yang membuat Anda merasa malu saat ini?
                </label>
                <textarea
                  value={shameTrigger}
                  onChange={(e) => setShameTrigger(e.target.value)}
                  rows={2}
                  placeholder="Ceritakan kejadian, kritik, penolakan, atau situasi yang memicu rasa malu..."
                  className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3.5 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-purple-500/80"
                />
              </div>

              {/* Q2: Fear of Others Thoughts */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-200 block">
                  2. Apa yang Anda takutkan akan dipikirkan atau dinilai orang lain?
                </label>
                <textarea
                  value={fearOfOthersThoughts}
                  onChange={(e) => setFearOfOthersThoughts(e.target.value)}
                  rows={2}
                  placeholder="Kekhawatiran akan penilaian, persepsi, atau penolakan lingkungan..."
                  className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3.5 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-purple-500/80"
                />
              </div>

              {/* Q3 & Q4: Self-Talk & Fact vs Judgment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-stone-800 pt-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
                    3. Apa yang Anda katakan kepada diri sendiri?
                  </label>
                  <input
                    type="text"
                    value={selfTalkOnShame}
                    onChange={(e) => setSelfTalkOnShame(e.target.value)}
                    placeholder="Contoh: 'Aku bodoh', 'Aku tidak layak', 'Aku selalu merusak segalanya'..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-purple-500/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                    4. Apakah itu fakta atau hanya penilaian/penafsiran diri?
                  </label>
                  <input
                    type="text"
                    value={factVsJudgment}
                    onChange={(e) => setFactVsJudgment(e.target.value)}
                    placeholder="Urai secara rasional fakta yang terjadi vs asumsi buruk pikiran..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-purple-500/80"
                  />
                </div>
              </div>

              {/* Q5 & Q6: Loving Friend & Needed Right Now */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-stone-800 pt-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                    5. Apa yang akan Anda katakan kepada orang yang Anda sayangi dalam posisi ini?
                  </label>
                  <input
                    type="text"
                    value={lovingFriendPerspective}
                    onChange={(e) => setLovingFriendPerspective(e.target.value)}
                    placeholder="Bahasa dukungan dan kehangatan jika teman baik Anda yang mengalaminya..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-purple-500/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-blue-300 uppercase tracking-wider block">
                    6. Apa yang sebenarnya Anda butuhkan saat ini?
                  </label>
                  <input
                    type="text"
                    value={neededRightNow}
                    onChange={(e) => setNeededRightNow(e.target.value)}
                    placeholder="Misal: Rasa aman, penerimaan, ruang beristirahat, atau pelukan lembut..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-purple-500/80"
                  />
                </div>
              </div>

              {/* Q7: Learn About Self */}
              <div className="space-y-1.5 border-t border-stone-800 pt-3">
                <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block">
                  7. Apa yang ingin Anda pahami tentang diri Anda dari pengalaman ini?
                </label>
                <input
                  type="text"
                  value={learnAboutSelf}
                  onChange={(e) => setLearnAboutSelf(e.target.value)}
                  placeholder="Pemahaman tentang kebutuhan batas diri, nilai pribadi, atau pertumbuhan batin..."
                  className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-purple-500/80"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 border-t border-stone-800 pt-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="severeShameCheck"
                    checked={isSevereShame}
                    onChange={(e) => setIsSevereShame(e.target.checked)}
                    className="rounded border-stone-700 bg-stone-900 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="severeShameCheck" className="text-xs text-stone-300 cursor-pointer font-medium">
                    Saya merasa rasa malu ini sangat berat / merasa sangat tidak berharga saat ini
                  </label>
                </div>

                <div className="flex items-center gap-2 bg-purple-950/40 p-3 rounded-xl border border-purple-900/60">
                  <input
                    type="checkbox"
                    id="crisisShameCheck"
                    checked={isCrisisRisk}
                    onChange={(e) => setIsCrisisRisk(e.target.checked)}
                    className="rounded border-purple-700 bg-stone-900 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="crisisShameCheck" className="text-xs text-purple-300 cursor-pointer font-bold">
                    [PENTING] Rasa malu memicu dorongan menyakiti diri atau keputusasaan berat
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleProcessReflection}
                  className="bg-purple-600 hover:bg-purple-500 text-stone-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg"
                >
                  Proses Refleksi & Insight AI <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Output Card */}
          {isLoading ? (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center space-y-4 shadow-xl">
              <Sparkles className="w-10 h-10 text-purple-400 animate-spin mx-auto" />
              <h3 className="text-lg font-bold text-stone-200">Menyusun Pendampingan Dengan Penuh Kehangatan...</h3>
              <p className="text-sm text-stone-400 max-w-md mx-auto">
                LEGA AI sedang memisahkan fakta dari kritik diri dan menyusun pesan penerimaan yang seimbang.
              </p>
            </div>
          ) : reflectionResult && !isCrisisRisk ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-stone-900 border border-purple-800/40 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-lg">
                    <EyeOff className="w-6 h-6" /> Hasil Evaluasi & Insight LEGA Shame
                  </div>
                  <span className="text-xs bg-purple-500/10 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full">
                    Sintesis Refleksi Objektif
                  </span>
                </div>

                <div className="space-y-4 text-stone-200 leading-relaxed text-sm md:text-base">
                  <p className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl text-stone-300 italic">
                    "{reflectionResult.summary}"
                  </p>

                  {/* Shame vs Guilt Notice */}
                  {reflectionResult.shameVsGuiltNotice && (
                    <div className="bg-purple-950/30 border border-purple-800/50 p-4 rounded-xl space-y-1">
                      <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Info className="w-4 h-4" /> Pengingat Shame vs Guilt:
                      </h4>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        {reflectionResult.shameVsGuiltNotice.explanation}
                      </p>
                    </div>
                  )}

                  {/* Self Acceptance Separation */}
                  {reflectionResult.selfAcceptanceSeparation && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-stone-950/50 border border-purple-900/40 p-4 rounded-xl space-y-1">
                        <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4" /> Pemisahan Kejadian dari Identitas:
                        </h4>
                        <p className="text-xs text-stone-300 leading-relaxed">
                          {reflectionResult.selfAcceptanceSeparation.behaviorVsIdentity}
                        </p>
                      </div>

                      <div className="bg-stone-950/50 border border-amber-900/40 p-4 rounded-xl space-y-1">
                        <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Heart className="w-4 h-4" /> Penolakan/Ekspektasi vs Nilai Diri:
                        </h4>
                        <p className="text-xs text-stone-300 leading-relaxed">
                          {reflectionResult.selfAcceptanceSeparation.rejectionVsSelfWorth}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Self Compassion Message */}
                  {reflectionResult.selfCompassionMessage && (
                    <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl space-y-2">
                      <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Feather className="w-4 h-4" /> Pesan Penerimaan Diri (Self-Compassion):
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
                            className="bg-stone-950 border border-stone-800 hover:border-purple-500/50 p-3 rounded-xl text-left space-y-1 transition group"
                          >
                            <span className="text-xs font-bold text-purple-300 group-hover:text-purple-200 flex items-center justify-between">
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
                      className="bg-purple-600 hover:bg-purple-500 disabled:bg-stone-800 text-stone-950 disabled:text-stone-500 font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition"
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

      {/* TAB 4: AUDIO LEGA SHAME */}
      {activeTab === 'audio' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg">
            <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-lg">
                <Volume2 className="w-5 h-5" /> Audio Panduan LEGA Shame (Dinamis Gemini TTS)
              </div>
              <span className="text-xs text-stone-400">Suara Terpandu Bahasa Indonesia</span>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed">
              Dengarkan panduan audio terpandu untuk menenangkan tubuh dan pikiran dari rasa malu, mengurangi kritik diri, serta merawat penerimaan diri:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SHAME_AUDIO_TRACKS.map((track, index) => {
                const isPlaying = playingTrackIndex === index;
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border transition-all ${
                      isPlaying
                        ? 'bg-purple-950/60 border-purple-500'
                        : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
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
                            ? 'bg-purple-500 text-stone-950'
                            : 'bg-stone-800 hover:bg-stone-700 text-purple-300'
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

      {/* TAB 5: PENERIMAAN DIRI & SITUASI KHUSUS */}
      {activeTab === 'acceptance' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg"
        >
          <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-lg">
              <Heart className="w-5 h-5" /> Panduan Penerimaan Diri Dalam Situasi Khusus
            </div>
            <span className="text-xs bg-purple-500/10 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full">
              Pemberdayaan Batin
            </span>
          </div>

          <div className="space-y-4 text-xs md:text-sm text-stone-300">
            <div className="bg-stone-950/70 border border-stone-800 p-4 rounded-xl space-y-2">
              <h4 className="font-bold text-purple-300 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-purple-400" /> Penampilan Fisik & Citra Tubuh
              </h4>
              <p className="text-stone-400">
                Nilai dan martabat Anda sebagai manusia tidak ditentukan oleh standar estetika atau ekspektasi visual dari luar. Tubuh Anda adalah rumah bagi jiwa Anda untuk hidup dan mengalami dunia.
              </p>
            </div>

            <div className="bg-stone-950/70 border border-stone-800 p-4 rounded-xl space-y-2">
              <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" /> Perundungan atau Perlakukan Merendahkan
              </h4>
              <p className="text-stone-400">
                Perilaku buruk, ejekan, atau perlakuan merendahkan dari orang lain adalah cerminan dari kondisi psikologis orang tersebut, bukan bukti bahwa Anda tidak berharga.
              </p>
            </div>

            <div className="bg-stone-950/70 border border-stone-800 p-4 rounded-xl space-y-2">
              <h4 className="font-bold text-emerald-300 flex items-center gap-1.5">
                <Feather className="w-4 h-4 text-emerald-400" /> Bahasa Internal yang Manusiawi & Realistis
              </h4>
              <blockquote className="border-l-2 border-emerald-500 pl-3 py-1 text-stone-200 italic space-y-1">
                <p>"Anda sedang mengalami rasa malu, bukan menjadi rasa malu itu sendiri."</p>
                <p>"Kesalahan atau kegagalan tidak menentukan seluruh nilai diri Anda."</p>
                <p>"Anda boleh belajar dan tumbuh tanpa harus terus-menerus menghukum diri."</p>
              </blockquote>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
