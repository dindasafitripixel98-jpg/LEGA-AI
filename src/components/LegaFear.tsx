import React, { useState } from 'react';
import {
  AlertTriangle,
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
  Compass,
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
  Stethoscope,
  Radio,
  Flame,
  ShieldAlert
} from 'lucide-react';
import { motion } from 'motion/react';
import { reflectFear } from '../lib/geminiApi';
import { JournalEntry } from '../types';
import { VoiceGuideButton } from './VoiceGuideButton';

interface LegaFearProps {
  onSelectModule: (module: string) => void;
  onAddJournal?: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
}

const FEAR_TYPES_LIST = [
  { type: 'Bahaya Nyata', desc: 'Ancaman fisik atau keselamatan nyata yang memerlukan perlindungan segera.' },
  { type: 'Ketidakpastian', desc: 'Rasa cemas terhadap masa depan dan hal-hal yang belum diketahui.' },
  { type: 'Kegagalan', desc: 'Ketakutan tidak mencapai target, membuat kesalahan, atau mengecewakan diri.' },
  { type: 'Penolakan', desc: 'Kekhawatiran ditolak, tidak diterima, atau diasingkan oleh lingkungan.' },
  { type: 'Kehilangan', desc: 'Rasa takut kehilangan hubungan, orang terkasih, posisi, atau rasa aman.' },
  { type: 'Bicara Depan Umum', desc: 'Kecemasan sosial saat tampil, berbicara, atau dinilai oleh banyak orang.' },
  { type: 'Konflik', desc: 'Ketakutan akan perselisihan, ketegangan antarmanusia, atau kemarahan orang lain.' },
  { type: 'Pengambilan Keputusan', desc: 'Ragu dan takut salah mengambil langkah atau arah hidup.' },
  { type: 'Perubahan', desc: 'Rasa tidak nyaman saat beralih ke situasi baru yang belum dikenal.' },
  { type: 'Penilaian Orang Lain', desc: 'Kepekaan berlebihan terhadap kritik, persepsi, atau prasangka orang lain.' }
];

const FEAR_RESPONSES = [
  {
    category: 'Pikiran (Mental)',
    items: [
      '"Apa yang akan terjadi nanti?"',
      '"Bagaimana kalau sesuatu yang buruk terjadi?"',
      '"Aku tidak sanggup menghadapinya"',
      '"Aku harus menghindari situasi ini secepatnya"'
    ]
  },
  {
    category: 'Emosi (Perasaan)',
    items: [
      'Rasa takut dan tegang',
      'Kecemasan yang membendung',
      'Gelisah dan kekhawatiran',
      'Perasaan tidak berdaya'
    ]
  },
  {
    category: 'Sensasi Tubuh (Fisik)',
    items: [
      'Jantung berdebar kencang',
      'Napas menjadi pendek atau cepat',
      'Otot-otot menegang kuat',
      'Berkeringat dingin, gemetar, atau perut mual'
    ]
  },
  {
    category: 'Perilaku (Aksi)',
    items: [
      'Menghindari objek atau situasi pemicu',
      'Menunda-nunda keputusan penting',
      'Mencari kepastian/validasi berulang kali',
      'Membatasi aktivitas dan mengisolasi diri'
    ]
  }
];

const FEAR_AUDIO_TRACKS = [
  {
    title: 'Audio Mengenali Rasa Takut',
    description: 'Menyapa emosi takut sebagai sinyal perlindungan alami tanpa panik atau melawannya.',
    duration: '4 min',
    textPrompt: 'Napas masuk dengan tenang, napas keluar dengan lembut... Sadari rasa takut yang hadir di batin Anda. Ketahuilah bahwa takut adalah sinyal alami tubuh untuk melindungi Anda. Anda aman untuk mengamatinya saat ini.'
  },
  {
    title: 'Audio Kembali ke Saat Ini',
    description: 'Grounding panca indra membawa pikiran dari bayangan buruk masa depan ke kenyataan saat ini.',
    duration: '5 min',
    textPrompt: 'Dengarkan suara di sekitar Anda, rasakan pakan kaki di lantai... Pikiran Anda mungkin sedang membayangkan kemungkinan buruk di masa depan, namun saat ini, di ruangan ini, Anda aman dan utuh.'
  },
  {
    title: 'Audio Menenangkan Tubuh',
    description: 'Merelaksasikan detak jantung, napas, dan otot yang menegang akibat respon takut.',
    duration: '5 min',
    textPrompt: 'Lepaskan ketegangan di bahu Anda... Biarkan napas mengalir perlahan. Dengan setiap hembusan napas, izinkan otot-otot dada dan perut mengendur dengan alami.'
  },
  {
    title: 'Audio Menghadapi Ketidakpastian',
    description: 'Berdamai dengan hal-hal yang tidak dapat diprediksi tanpa kehilangan rasa aman batin.',
    duration: '5 min',
    textPrompt: 'Anda tidak harus mengetahui semua jawaban saat ini. Izinkan diri Anda melangkah satu demi satu, berlabuh pada apa yang bisa Anda kendalikan hari ini.'
  },
  {
    title: 'Audio Sebelum Menghadapi Situasi Sulit',
    description: 'Penguatan mental & kejernihan pikiran sebelum memasuki momen yang menantang.',
    duration: '5 min',
    textPrompt: 'Bayangkan diri Anda memasuki situasi tersebut dengan tenang. Anda memiliki daya resilience dan kemampuan untuk mengambil langkah aman secara rasional.'
  },
  {
    title: 'Audio Setelah Mengalami Ketakutan',
    description: 'Masa pemulihan dan mendinginkan sistem saraf setelah melewati momen yang menakutkan.',
    duration: '4 min',
    textPrompt: 'Gelombang ketakutan telah berlalu. Berikan apresiasi pada tubuh dan pikiran Anda yang telah berjuang. Istirahatlah dengan lembut.'
  },
  {
    title: 'Audio Napas Sadar',
    description: 'Ritme pernapasan terpandu untuk meregulasi sistem saraf parasimpatik.',
    duration: '4 min',
    textPrompt: 'Hirup udara segar... Tahan sejenak... Hembuskan perlahan. Biarkan irama napas menjadi jangkar penenang dalam diri Anda.'
  },
  {
    title: 'Audio Tidur dengan Pikiran Lebih Tenang',
    description: 'Melepaskan beban kekhawatiran dan membiarkan tubuh beristirahat dalam rasa aman.',
    duration: '6 min',
    textPrompt: 'Malam ini, biarkan seluruh prediksi buruk dan ketakutan mengendur. Anda diizinkan untuk melepaskan kendali dan tertidur dengan damai.'
  }
];

export const LegaFear: React.FC<LegaFearProps> = ({
  onSelectModule,
  onAddJournal,
}) => {
  const [activeTab, setActiveTab] = useState<'education' | 'reality' | 'reflection' | 'gradual' | 'audio'>('education');

  // Form states (8 Core Reflective Questions for LEGA Fear)
  const [whatIsFeared, setWhatIsFeared] = useState<string>('');
  const [isRealDangerNow, setIsRealDangerNow] = useState<boolean>(false);
  const [imaginedScenario, setImaginedScenario] = useState<string>('');
  const [evidenceForWorry, setEvidenceForWorry] = useState<string>('');
  const [unknowns, setUnknowns] = useState<string>('');
  const [pastExperienceLink, setPastExperienceLink] = useState<string>('');
  const [thingsInControl, setThingsInControl] = useState<string>('');
  const [safestStep, setSafestStep] = useState<string>('');

  // Special Flags
  const [isHealthFear, setIsHealthFear] = useState<boolean>(false);
  const [isPanicState, setIsPanicState] = useState<boolean>(false);
  const [isCrisisRisk, setIsCrisisRisk] = useState<boolean>(false);

  // Audio State
  const [playingTrackIndex, setPlayingTrackIndex] = useState<number | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
  const [audioObject, setAudioObject] = useState<HTMLAudioElement | null>(null);

  // Async AI Reflection state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reflectionResult, setReflectionResult] = useState<any>(null);
  const [journalSaved, setJournalSaved] = useState<boolean>(false);

  const handleProcessReflection = async () => {
    setIsLoading(true);

    const result = await reflectFear({
      whatIsFeared,
      isRealDangerNow,
      imaginedScenario,
      evidenceForWorry,
      unknowns,
      pastExperienceLink,
      thingsInControl,
      safestStep,
      isHealthFear,
      isPanicState,
      isCrisisRisk
    });

    setReflectionResult(result);
    setIsLoading(false);
  };

  const handleSaveToJournal = () => {
    if (!onAddJournal || !reflectionResult) return;

    const content = `=== REFLEKSI LEGA FEAR (V2.0) ===
Yang Ditakuti: ${whatIsFeared || '-'}
Status Bahaya Nyata: ${isRealDangerNow ? 'BAHAYA NYATA TERDETEKSI (Memerlukan Keselamatan)' : 'Tidak ada bahaya nyata langsung'}

Skenario & Bukti:
- Bayangan / Skenario Buruk: ${imaginedScenario || '-'}
- Bukti Pendukung: ${evidenceForWorry || '-'}
- Ketidakpastian / Belum Diketahui: ${unknowns || '-'}
- Kaitan Pengalaman Masa Lalu: ${pastExperienceLink || '-'}

Peta Kendali & Langkah Aman:
- Dalam Kendali: ${thingsInControl || '-'}
- Langkah Aman & Realistis: ${safestStep || '-'}

Sintesis & Insight AI:
${reflectionResult.summary || '-'}

Langkah Aman Disarankan:
${reflectionResult.suggestedSafeAction || '-'}`;

    onAddJournal({
      title: 'Refleksi LEGA Fear V2.0',
      content,
      mood: 'cemas',
      tags: ['Fear', 'RasaTakut', 'Keselamatan', 'Grounding', 'PetaKendali']
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

    const track = FEAR_AUDIO_TRACKS[index];
    setIsAudioLoading(true);
    setPlayingTrackIndex(index);

    try {
      const res = await fetch('/api/gemini/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: track.textPrompt,
          voiceName: 'rina'
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
      <div className="bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-950 border border-amber-800/40 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <AlertTriangle className="w-48 h-48 text-amber-400" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide uppercase">
            <AlertTriangle className="w-3.5 h-3.5" />
            LEGA Fear • Version 2.0
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-100">
            Memahami Rasa Takut & Merespons Secara Sadar & Aman
          </h1>
          <p className="text-sm md:text-base text-stone-300 leading-relaxed max-w-2xl">
            Mengenali pemicu ketakutan, membedakan bahaya nyata dari kekhawatiran/prediksi, serta mengembangkan langkah bertahap yang realistis tanpa paksaan.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-stone-400">
            <VoiceGuideButton
              text="Selamat datang di modul LEGA Fear. Rasa takut adalah bagian alami dari sistem perlindungan manusia. Takut bukan kelemahan. Di sini kita belajar membedakan bahaya nyata dari kekhawatiran pikiran, serta melangkah bertahap secara aman."
              title="Panduan LEGA Fear"
              subtitle="Kesadaran & Keberanian Terpandu"
              variant="pill"
            />
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Bahaya Nyata vs Kekhawatiran
            </span>
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" /> Peta Kendali Diri
            </span>
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <Footprints className="w-3.5 h-3.5 text-amber-400" /> Langkah Bertahap
            </span>
          </div>
        </div>
      </div>

      {/* Filosofi LEGA Fear Card */}
      <div className="bg-stone-900/90 border border-amber-500/30 rounded-2xl p-5 md:p-6 shadow-md space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <Compass className="w-4 h-4" /> Filosofi LEGA Fear
        </span>
        <blockquote className="text-sm md:text-base text-stone-200 font-medium italic leading-relaxed border-l-2 border-amber-500 pl-4 py-1">
          "Takut bukan kelemahan. Takut adalah bagian alami dari sistem perlindungan manusia. Rasa takut tidak harus selalu dilawan, dan tidak harus selalu diikuti. Kesadaran membantu kita berhenti sejenak, memahami apa yang sedang terjadi, lalu memilih respons yang sesuai dengan keadaan nyata."
        </blockquote>
      </div>

      {/* Real Danger Warning if Checked */}
      {isRealDangerNow && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-950/90 border-2 border-red-600 rounded-2xl p-6 text-stone-100 space-y-3 shadow-2xl"
        >
          <div className="flex items-center gap-3 text-red-300 font-bold text-lg border-b border-red-800 pb-3">
            <ShieldAlert className="w-6 h-6 animate-pulse text-red-400" />
            PERHATIAN: BAHAYA NYATA TERDETEKSI!
          </div>
          <p className="text-sm leading-relaxed text-stone-200 font-medium">
            Jika Anda sedang berada dalam ancaman fisik atau situasi bahaya nyata saat ini, <strong>JANGAN bertahan dalam situasi berbahaya demi "menghadapi rasa takut"</strong>.
          </p>
          <div className="bg-stone-900/90 border border-red-800/80 p-4 rounded-xl space-y-2 text-xs md:text-sm">
            <span className="font-bold text-red-300 block">Tindakan Keselamatan Utama:</span>
            <ul className="space-y-1 text-stone-300 list-disc pl-4">
              <li>Segera cari lokasi yang aman atau menjauh dari sumber bahaya.</li>
              <li>Hubungi bantuan orang dipercaya atau pihak berwenang terdekat (Polisi 110 / Darurat 112).</li>
              <li>Utamakan keselamatan fisik sebelum melakukan refleksi pikiran.</li>
            </ul>
          </div>
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
            Rasa takut yang sangat hebat atau keputusasaan terkadang terasa begitu membendung. Keberadaan dan jiwa Anda sangat berharga. Jika muncul dorongan menyakiti diri atau merasa tidak sanggup lagi, mohon istirahat sejenak dan hubungi bantuan krisis resmi.
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
              ? 'border-amber-500 text-amber-300 bg-amber-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Edukasi Rasa Takut
        </button>
        <button
          onClick={() => setActiveTab('reality')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'reality'
              ? 'border-amber-500 text-amber-300 bg-amber-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Bahaya vs Kekhawatiran
        </button>
        <button
          onClick={() => setActiveTab('reflection')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'reflection'
              ? 'border-amber-500 text-amber-300 bg-amber-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Refleksi 8 Pertanyaan AI
        </button>
        <button
          onClick={() => setActiveTab('gradual')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'gradual'
              ? 'border-amber-500 text-amber-300 bg-amber-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Footprints className="w-4 h-4" /> Menghadapi Bertahap & Grounding
        </button>
        <button
          onClick={() => setActiveTab('audio')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'audio'
              ? 'border-amber-500 text-amber-300 bg-amber-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Volume2 className="w-4 h-4" /> Audio LEGA Fear
        </button>
      </div>

      {/* TAB 1: EDUKASI RASA TAKUT */}
      {activeTab === 'education' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Apa itu Rasa Takut */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-lg">
            <h2 className="text-xl font-bold text-stone-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> Memahami Fungsi Alami Rasa Takut
            </h2>
            <p className="text-stone-300 text-sm md:text-base leading-relaxed">
              Rasa takut adalah respon emosional alami terhadap ancaman atau kemungkinan ancaman. Sistem saraf kita dirancang untuk mengaktifkan ketakutan agar kita tetap selamat.
            </p>

            <div className="bg-amber-950/30 border border-amber-800/50 p-4 rounded-xl text-xs md:text-sm text-stone-300 leading-relaxed">
              <strong>Penyebab Umum Munculnya Rasa Takut:</strong> Bahaya nyata, ketidakpastian masa depan, pengalaman traumatis masa lalu, ketakutan akan kegagalan, penolakan, kehilangan, konflik, atau perubahan situasi hidup.
            </div>
          </div>

          {/* 10 Jenis Ketakutan */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-lg">
            <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" /> 10 Jenis Pengalaman Rasa Takut
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {FEAR_TYPES_LIST.map((item, idx) => (
                <div key={idx} className="bg-stone-950/60 border border-stone-800 p-3.5 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                    • {item.type}
                  </span>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Respon Dalam 4 Ranah */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-lg">
            <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" /> Spektrum Respon Takut dalam 4 Ranah Diri
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {FEAR_RESPONSES.map((res, idx) => (
                <div key={idx} className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
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

      {/* TAB 2: BAHAYA VS KEKHAWATIRAN & PETA KENDALI */}
      {activeTab === 'reality' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg"
        >
          <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
              <ShieldCheck className="w-5 h-5" /> Membedakan Bahaya Nyata vs Kekhawatiran
            </div>
            <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full">
              Pemeriksaan Rasional
            </span>
          </div>

          <p className="text-sm text-stone-300 leading-relaxed">
            Otak kita terkadang memperlakukan bayangan kekhawatiran seolah-olah merupakan ancaman fisik nyata yang mengintai saat ini. Gunakan perbedaan berikut untuk mengevaluasi:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
            <div className="bg-red-950/30 border border-red-800/60 p-5 rounded-xl space-y-2">
              <span className="font-bold text-red-300 block flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-400" /> BAHAYA NYATA (Real Danger)
              </span>
              <p className="text-stone-300">
                Ancaman fisik atau keselamatan yang sedang terjadi secara langsung saat ini.
              </p>
              <ul className="text-xs text-stone-400 space-y-1 list-disc pl-4 pt-1">
                <li>Respon tepat: Prioritaskan keselamatan fisik, menjauh, cari bantuan.</li>
                <li>Tidak perlu memaksakan "menghadapi ketakutan" di dalam situasi bahaya.</li>
              </ul>
            </div>

            <div className="bg-amber-950/30 border border-amber-800/50 p-5 rounded-xl space-y-2">
              <span className="font-bold text-amber-300 block flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-amber-400" /> KEKHAWATIRAN / PREDIKSI
              </span>
              <p className="text-stone-300">
                Pikiran tentang hal buruk yang <em>mungkin</em> terjadi di masa depan atau pengalaman masa lalu.
              </p>
              <ul className="text-xs text-stone-400 space-y-1 list-disc pl-4 pt-1">
                <li>Respon tepat: Grounding ke saat ini, evaluasi bukti, fokus pada hal dalam kendali.</li>
                <li>Gunakan langkah bertahap yang aman untuk melatih ketahanan batin.</li>
              </ul>
            </div>
          </div>

          {/* Peta Kendali Diri */}
          <div className="border-t border-stone-800 pt-5 space-y-3">
            <h4 className="text-sm font-bold text-stone-200 flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" /> Peta Kendali Diri saat Merasa Takut
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-stone-950/70 border border-emerald-900/50 p-4 rounded-xl space-y-1">
                <span className="font-bold text-emerald-300 uppercase tracking-wider block">
                  ✓ Dalam Kendali Anda:
                </span>
                <ul className="text-stone-300 space-y-1 list-disc pl-4">
                  <li>Ritme napas dan posisi berdiri/duduk Anda saat ini</li>
                  <li>Langkah kecil yang bisa dilakukan 5 menit ke depan</li>
                  <li>Keputusan untuk mencari bantuan atau berbicara dengan seseorang</li>
                  <li>Sikap lembut dan pengertian pada diri sendiri</li>
                </ul>
              </div>

              <div className="bg-stone-950/70 border border-stone-800 p-4 rounded-xl space-y-1">
                <span className="font-bold text-stone-400 uppercase tracking-wider block">
                  ✕ Di Luar Kendali Anda:
                </span>
                <ul className="text-stone-400 space-y-1 list-disc pl-4">
                  <li>Kepastian mutlak mengenai kejadian di masa depan</li>
                  <li>Tindakan, pendapat, atau respon orang lain</li>
                  <li>Kejadian buruk yang telah berlalu di masa lalu</li>
                  <li>Sensasi refleks otomatis sistem saraf secara instan</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 3: REFLEKSI 8 PERTANYAAN AI */}
      {activeTab === 'reflection' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {!isCrisisRisk && (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg">
              <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
                  <Sparkles className="w-5 h-5" /> 8 Pertanyaan Reflektif LEGA Fear
                </div>
                <span className="text-xs text-stone-400">Pemeriksaan Objektif Terpandu</span>
              </div>

              {/* Q1: What is Feared */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-200 block">
                  1. Apa yang sedang Anda takuti saat ini?
                </label>
                <textarea
                  value={whatIsFeared}
                  onChange={(e) => setWhatIsFeared(e.target.value)}
                  rows={2}
                  placeholder="Gambarkan situasi, kejadian, atau hal yang memicu rasa takut Anda..."
                  className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3.5 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/80"
                />
              </div>

              {/* Q2: Is Real Danger */}
              <div className="bg-red-950/20 border border-red-900/40 p-4 rounded-xl space-y-2">
                <label className="text-xs font-bold text-red-300 uppercase tracking-wider block">
                  2. Apakah ada BAHAYA NYATA / ancaman fisik langsung saat ini?
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRealDangerNow(true)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                      isRealDangerNow
                        ? 'bg-red-600 text-white border-red-500'
                        : 'bg-stone-950 text-stone-400 border-stone-800 hover:border-red-800'
                    }`}
                  >
                    YA, ADA BAHAYA NYATA
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRealDangerNow(false)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                      !isRealDangerNow
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-stone-950 text-stone-400 border-stone-800 hover:border-emerald-800'
                    }`}
                  >
                    TIDAK (Ini Kekhawatiran / Prediksi)
                  </button>
                </div>
              </div>

              {/* Q3 & Q4: Imagined Scenario & Evidence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-stone-800 pt-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                    3. Apa yang Anda bayangkan akan terjadi?
                  </label>
                  <input
                    type="text"
                    value={imaginedScenario}
                    onChange={(e) => setImaginedScenario(e.target.value)}
                    placeholder="Skenario buruk yang diprediksikan oleh pikiran..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-blue-300 uppercase tracking-wider block">
                    4. Apa bukti nyata yang mendukung kekhawatiran tersebut?
                  </label>
                  <input
                    type="text"
                    value={evidenceForWorry}
                    onChange={(e) => setEvidenceForWorry(e.target.value)}
                    placeholder="Fakta objektif yang memang mendukung (atau ketiadaan bukti)..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500/80"
                  />
                </div>
              </div>

              {/* Q5 & Q6: Unknowns & Past Link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-stone-800 pt-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
                    5. Apa yang belum Anda ketahui saat ini?
                  </label>
                  <input
                    type="text"
                    value={unknowns}
                    onChange={(e) => setUnknowns(e.target.value)}
                    placeholder="Ketidakpastian atau informasi yang masih misteri..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                    6. Apakah berkaitan dengan pengalaman masa lalu?
                  </label>
                  <input
                    type="text"
                    value={pastExperienceLink}
                    onChange={(e) => setPastExperienceLink(e.target.value)}
                    placeholder="Pengalaman buruk terdahulu yang membayangi..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500/80"
                  />
                </div>
              </div>

              {/* Q7 & Q8: Things in Control & Safest Step */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-stone-800 pt-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                    7. Apa yang masih berada dalam kendali Anda?
                  </label>
                  <input
                    type="text"
                    value={thingsInControl}
                    onChange={(e) => setThingsInControl(e.target.value)}
                    placeholder="Sikap, ritme napas, persiapan kecil, atau respon Anda..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                    8. Apa langkah paling aman & realistis yang dapat dilakukan?
                  </label>
                  <input
                    type="text"
                    value={safestStep}
                    onChange={(e) => setSafestStep(e.target.value)}
                    placeholder="Satu tindakan kecil yang realistis saat ini..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500/80"
                  />
                </div>
              </div>

              {/* Checkboxes & Flags */}
              <div className="space-y-3 border-t border-stone-800 pt-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="healthFearCheck"
                    checked={isHealthFear}
                    onChange={(e) => setIsHealthFear(e.target.checked)}
                    className="rounded border-stone-700 bg-stone-900 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="healthFearCheck" className="text-xs text-stone-300 cursor-pointer font-medium">
                    Ketakutan ini berkaitan dengan gejala atau kekhawatiran fisik/kesehatan
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="panicStateCheck"
                    checked={isPanicState}
                    onChange={(e) => setIsPanicState(e.target.checked)}
                    className="rounded border-stone-700 bg-stone-900 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="panicStateCheck" className="text-xs text-stone-300 cursor-pointer font-medium">
                    Saya sedang merasa sangat cemas / mendekati kondisi panik saat ini
                  </label>
                </div>

                <div className="flex items-center gap-2 bg-amber-950/40 p-3 rounded-xl border border-amber-900/60">
                  <input
                    type="checkbox"
                    id="crisisFearCheck"
                    checked={isCrisisRisk}
                    onChange={(e) => setIsCrisisRisk(e.target.checked)}
                    className="rounded border-amber-700 bg-stone-900 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="crisisFearCheck" className="text-xs text-amber-300 cursor-pointer font-bold">
                    [PENTING] Ketakutan memicu dorongan menyakiti diri atau keputusasaan berat
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleProcessReflection}
                  className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg"
                >
                  Proses Refleksi & Insight AI <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Output Card */}
          {isLoading ? (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center space-y-4 shadow-xl">
              <Sparkles className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
              <h3 className="text-lg font-bold text-stone-200">Menyusun Pendampingan Dengan Kejernihan Batin...</h3>
              <p className="text-sm text-stone-400 max-w-md mx-auto">
                LEGA AI sedang mengevaluasi bahaya nyata vs kekhawatiran dan memetakan langkah aman untuk Anda.
              </p>
            </div>
          ) : reflectionResult && !isCrisisRisk ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-stone-900 border border-amber-800/40 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
                    <AlertTriangle className="w-6 h-6" /> Hasil Evaluasi & Insight LEGA Fear
                  </div>
                  <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full">
                    Sintesis Refleksi Objektif
                  </span>
                </div>

                <div className="space-y-4 text-stone-200 leading-relaxed text-sm md:text-base">
                  <p className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl text-stone-300 italic">
                    "{reflectionResult.summary}"
                  </p>

                  {/* Real Danger Check Status */}
                  {reflectionResult.realDangerCheck && (
                    <div className={`p-4 rounded-xl space-y-1 border ${
                      reflectionResult.realDangerCheck.isRealDanger
                        ? 'bg-red-950/40 border-red-800/80 text-red-200'
                        : 'bg-emerald-950/30 border-emerald-800/50 text-emerald-200'
                    }`}>
                      <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" /> Evaluasi Bahaya Nyata:
                      </h4>
                      <p className="text-xs leading-relaxed">
                        {reflectionResult.realDangerCheck.safetyAdvice}
                      </p>
                    </div>
                  )}

                  {/* Control Analysis */}
                  {reflectionResult.controlAnalysis && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-stone-950/50 border border-emerald-900/40 p-4 rounded-xl space-y-1">
                        <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Compass className="w-4 h-4" /> Berada dalam Kendali Anda:
                        </h4>
                        <ul className="text-xs text-stone-300 space-y-1 list-disc pl-4">
                          {reflectionResult.controlAnalysis.inControl?.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-stone-950/50 border border-stone-800 p-4 rounded-xl space-y-1">
                        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Info className="w-4 h-4" /> Di Luar Kendali Anda:
                        </h4>
                        <ul className="text-xs text-stone-400 space-y-1 list-disc pl-4">
                          {reflectionResult.controlAnalysis.outOfControl?.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Suggested Safe Action */}
                  {reflectionResult.suggestedSafeAction && (
                    <div className="bg-amber-950/30 border border-amber-800/50 p-4 rounded-xl space-y-1">
                      <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Footprints className="w-4 h-4" /> Langkah Paling Aman & Realistis:
                      </h4>
                      <p className="text-xs text-stone-200 font-medium leading-relaxed">
                        {reflectionResult.suggestedSafeAction}
                      </p>
                    </div>
                  )}

                  {/* Gradual Facing Steps */}
                  {reflectionResult.gradualFacingSteps && reflectionResult.gradualFacingSteps.length > 0 && (
                    <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl space-y-2">
                      <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Footprints className="w-4 h-4" /> Langkah Bertahap Menghadapi Ketakutan:
                      </h4>
                      <ol className="text-xs text-stone-300 space-y-1.5 list-decimal pl-4">
                        {reflectionResult.gradualFacingSteps.map((step: string, i: number) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
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
                            className="bg-stone-950 border border-stone-800 hover:border-amber-500/50 p-3 rounded-xl text-left space-y-1 transition group"
                          >
                            <span className="text-xs font-bold text-amber-300 group-hover:text-amber-200 flex items-center justify-between">
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
                      className="bg-amber-600 hover:bg-amber-500 disabled:bg-stone-800 text-stone-950 disabled:text-stone-500 font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition"
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

      {/* TAB 4: MENGHADAPI BERTAHAP & GROUNDING */}
      {activeTab === 'gradual' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg"
        >
          <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
              <Footprints className="w-5 h-5" /> Pendekatan Bertahap & Grounding Saat Panik
            </div>
            <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full">
              Latihan Mandiri Aman
            </span>
          </div>

          <div className="space-y-4 text-xs md:text-sm text-stone-300">
            {/* Latihan Bertahap */}
            <div className="bg-stone-950/70 border border-stone-800 p-4 rounded-xl space-y-2">
              <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
                <Footprints className="w-4 h-4 text-amber-400" /> Prinsip Menghadapi Ketakutan Tanpa Paksaan
              </h4>
              <p className="text-stone-400">
                LEGA AI tidak memaksakan Anda melakukan konfrontasi langsung terhadap pemicu takut. Jika Anda siap melangkah, gunakan formula bertahap ini:
              </p>
              <ol className="text-stone-300 space-y-1 list-decimal pl-4">
                <li>Kenali ketakutan & tingkat kesulitan (skala 1-10).</li>
                <li>Tentukan langkah paling kecil (10% aksi) yang terasa aman.</li>
                <li>Lakukan dengan napas tenang, lalu evaluasi respon tubuh.</li>
                <li>Berikan jeda istirahat dan lanjutkan hanya jika merasa siap.</li>
              </ol>
            </div>

            {/* Grounding Panik 5-4-3-2-1 */}
            <div className="bg-stone-950/70 border border-stone-800 p-4 rounded-xl space-y-2">
              <h4 className="font-bold text-blue-300 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-blue-400" /> Panduan Grounding Jika Merasa Cemas / Panik
              </h4>
              <p className="text-stone-400">
                Saat pikiran membayangkan bayangan buruk, ajak panca indra kembali ke saat ini:
              </p>
              <ul className="text-stone-300 space-y-1 list-disc pl-4">
                <li><strong>5 Benda:</strong> Perhatikan 5 benda fisik di sekitar ruangan Anda.</li>
                <li><strong>4 Sensasi:</strong> Rasakan 4 tekstur/sensasi fisik (pijakan kaki, pakaian, suhu udara).</li>
                <li><strong>3 Suara:</strong> Dengarkan 3 suara lembut di sekitar Anda.</li>
                <li><strong>2 Aroma/Rasa:</strong> Sadari aroma atau rasa di mulut Anda.</li>
                <li><strong>1 Napas Sadar:</strong> Hirup napas lembut dan hembuskan dengan perlahan.</li>
              </ul>
            </div>

            {/* Disclaimer Kesehatan & Trauma */}
            <div className="bg-stone-950/70 border border-stone-800 p-4 rounded-xl space-y-2">
              <h4 className="font-bold text-purple-300 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-purple-400" /> Catatan Kesehatan & Trauma Masa Lalu
              </h4>
              <p className="text-stone-400">
                • Untuk ketakutan yang berhubungan dengan gejala kesehatan fisik baru atau mengkhawatirkan, disarankan berkonsultasi dengan profesional medis.<br />
                • Untuk ketakutan berat yang berkaitan dengan trauma mendalam, disarankan melakukan latihan bersama psikolog/terapis profesional.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 5: AUDIO LEGA FEAR */}
      {activeTab === 'audio' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg">
            <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
                <Volume2 className="w-5 h-5" /> Audio Panduan LEGA Fear (Audio Narasi Terpadu)
              </div>
              <span className="text-xs text-stone-400">Suara Terpandu Bahasa Indonesia</span>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed">
              Dengarkan panduan audio terpandu untuk meregulasi ketegangan fisik, menenangkan pikiran dari bayangan buruk, dan membawa kembali kesadaran ke momen saat ini:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FEAR_AUDIO_TRACKS.map((track, index) => {
                const isPlaying = playingTrackIndex === index;
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border transition-all ${
                      isPlaying
                        ? 'bg-amber-950/60 border-amber-500'
                        : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
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
                            ? 'bg-amber-500 text-stone-950'
                            : 'bg-stone-800 hover:bg-stone-700 text-amber-300'
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
    </div>
  );
};
