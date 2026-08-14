import React, { useState } from 'react';
import {
  Moon,
  Sparkles,
  BookOpen,
  Volume2,
  Shield,
  RotateCcw,
  CheckCircle2,
  PhoneCall,
  Feather,
  Info,
  Play,
  VolumeX,
  HeartHandshake,
  Footprints,
  Bookmark,
  Sun,
  Flame,
  Frown,
  AlertTriangle,
  Heart,
  HelpCircle,
  Compass,
  CheckSquare,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { reflectSpiritual } from '../lib/geminiApi';
import { JournalEntry } from '../types';
import { VoiceGuideButton } from './VoiceGuideButton';

interface LegaSpiritualReflectionProps {
  onSelectModule: (module: string) => void;
  onAddJournal?: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
}

const CORE_SPIRITUAL_CONCEPTS = [
  {
    key: 'muhasabah',
    title: 'Muhasabah (Refleksi Niat & Tindakan)',
    desc: 'Meninjau kembali pikiran, ucapan, tindakan, dan niat secara jujur untuk mengambil pelajaran tanpa menghakimi diri.',
    icon: Moon
  },
  {
    key: 'sabar',
    title: 'Sabar (Keteguhan & Respons Baik)',
    desc: 'Menghadapi kesulitan dengan keteguhan dan respons yang baik, bukan berarti tidak boleh merasa sedih, marah, atau takut.',
    icon: Shield
  },
  {
    key: 'syukur',
    title: 'Syukur (Menyadari Nikmat)',
    desc: 'Kesadaran dan penghargaan terhadap nikmat Allah dalam hati, ucapan, dan perbuatan, tanpa menolak penderitaan.',
    icon: Sun
  },
  {
    key: 'ikhtiar',
    title: 'Ikhtiar (Tindakan Dalam Kendali)',
    desc: 'Melakukan usaha nyata dan bertanggung jawab atas hal-hal yang berada dalam wilayah kendali diri.',
    icon: Compass
  },
  {
    key: 'tawakal',
    title: 'Tawakal (Berserah Bersama Ikhtiar)',
    desc: 'Melakukan ikhtiar yang wajar sambil menyerahkan hasil akhir kepada Allah. Bukan berarti pasif atau berhenti berusaha.',
    icon: HeartHandshake
  },
  {
    key: 'ikhlas',
    title: 'Ikhlas (Kemurnian Niat)',
    desc: 'Merefleksikan niat bertindak semata-mata demi kebaikan, nilai kemanusiaan, dan ridha Allah SWT.',
    icon: Feather
  }
];

const TEN_STEPS_FLOW = [
  { step: 1, title: 'Berhenti Sejenak', desc: 'Mengistirahatkan pikiran dan hiruk pikuk ruang sekitar.' },
  { step: 2, title: 'Sadari Kondisi Diri', desc: 'Hadir utuh di momen saat ini dengan kelembutan.' },
  { step: 3, title: 'Kenali Emosi', desc: 'Memberi nama pada perasaan yang sedang singgah tanpa menolaknya.' },
  { step: 4, title: 'Amati Respons Tubuh', desc: 'Memperhatikan ketegangan fisik atau detak napas.' },
  { step: 5, title: 'Refleksikan Pengalaman', desc: 'Meninjau dinamika peristiwa secara objektif.' },
  { step: 6, title: 'Hubungkan Nilai Islam', desc: 'Menghubungkan dengan nilai sabar, syukur, atau ikhlas.' },
  { step: 7, title: 'Identifikasi Pelajaran', desc: 'Menemukan hikmah dan poin pembelajaran pribadi.' },
  { step: 8, title: 'Tentukan Ikhtiar', desc: 'Menyusun tindakan konkret yang berada dalam batas kendali.' },
  { step: 9, title: 'Tawakal & Berserah', desc: 'Menyerahkan hasil akhir di luar kendali kepada Allah SWT.' },
  { step: 10, title: 'Doa & Penutup', desc: 'Mengakhiri refleksi dengan doa dan rasa tenang.' }
];

const FORMULA_STEPS = [
  { label: 'SADARI', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', desc: 'Akui emosi & sensasi tubuh' },
  { label: 'PAHAMI', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40', desc: 'Konteks tanpa menghakimi' },
  { label: 'REFLEKSIKAN', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40', desc: 'Hubungkan nilai Islami' },
  { label: 'IKHTIARKAN', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', desc: 'Langkah dalam kendali' },
  { label: 'SYUKURI', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', desc: 'Nikmat kecil yang ada' },
  { label: 'SABARI', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40', desc: 'Tahan reaksi impulsif' },
  { label: 'TAWAKALKAN', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40', desc: 'Serahkan hasil kepada Allah' },
  { label: 'MELANGKAH', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40', desc: 'Melangkah dengan sadar' }
];

const EMOTION_HANDLING_GUIDES = [
  {
    emotion: 'Marah',
    icon: Flame,
    color: 'text-amber-400',
    guide: 'Berhenti sejenak, amati sensasi tubuh. Jangan langsung bereaksi. Pertimbangkan tindakan yang sesuai akhlak. Jika tidak aman, utamakan keselamatan.'
  },
  {
    emotion: 'Sedih',
    icon: Frown,
    color: 'text-blue-400',
    guide: 'Jangan memaksakan langsung bersyukur. Kesedihan adalah pengalaman manusiawi ("Anda boleh merasakan kesedihan ini"). Saat siap, cari 1 hal kecil yang disyukuri.'
  },
  {
    emotion: 'Takut & Cemas',
    icon: AlertTriangle,
    color: 'text-purple-400',
    guide: 'Bedakan bahaya nyata vs risiko vs kekhawatiran. Lakukan ikhtiar untuk hal yang dapat dikendalikan, dan tawakalkan hasil yang tidak dapat dikendalikan.'
  },
  {
    emotion: 'Kecewa',
    icon: HelpCircle,
    color: 'text-teal-400',
    guide: 'Akui rasa kecewa. Tanyakan: Apa yang diharapkan? Apa yang terjadi? Apa yang masih dapat dilakukan, dipelajari, dan diserahkan?'
  },
  {
    emotion: 'Merasa Bersalah',
    icon: Heart,
    color: 'text-rose-400',
    guide: 'Bedakan kesalahan nyata vs penyesalan berlebihan. Jika ada kesalahan: akui, perbaiki bila memungkinkan, minta maaf bila tepat, belajar, dan jangan terus menghukum diri.'
  },
  {
    emotion: 'Merasa Gagal',
    icon: Compass,
    color: 'text-emerald-400',
    guide: '"Kita tidak dapat mengetahui secara pasti makna setiap kejadian dalam hidup. Namun pengalaman ini dapat menjadi kesempatan untuk belajar dan memperbaiki langkah berikutnya."'
  }
];

const SPIRITUAL_AUDIO_TRACKS = [
  {
    title: 'Muhasabah Pagi',
    description: 'Renungan lembut mengawali hari dengan niat baik, kesadaran batin, dan kejelasan tujuan.',
    duration: '5 min',
    textPrompt: 'Bismillah... Awali pagi ini dengan menarik napas perlahan. Luruskan niat untuk melangkah dengan santun, menjaga lisan, dan berikhtiar sebaik-baiknya hari ini.'
  },
  {
    title: 'Muhasabah Malam',
    description: 'Meninjau perjalanan hari, memaafkan diri sendiri, dan mengistirahatkan pikiran.',
    duration: '5 min',
    textPrompt: 'Alhamdulillah atas seluruh rangkaian hari ini. Maafkanlah kekhilafan diri, lepaskan lelah, dan sandarkan malam ini dalam perlindungan Allah SWT.'
  },
  {
    title: 'Refleksi Sabar',
    description: 'Penguat batin saat menghadapi gejolak rasa atau ujian yang menekan.',
    duration: '5 min',
    textPrompt: 'Sabar adalah keteguhan hati dalam merespons kesulitan, bukan kepasifan. Tarik napas... Tahan sejenak... Responlah dengan ketenangan dan keteguhan.'
  },
  {
    title: 'Refleksi Syukur',
    description: 'Menyadari nikmat napas, kesehatan, dan kehangatan sederhana di sekitar kita.',
    duration: '5 min',
    textPrompt: 'Perhatikan udara yang mengalir lembut ke paru-paru Anda. Nikmat napas ini hadir tanpa perlu kita minta. Ucapkan Alhamdulillah dengan tulus dari kedalaman hati.'
  },
  {
    title: 'Refleksi Tawakal',
    description: 'Melepaskan beban kecemasan akan hasil akhir setelah berusaha maksimal.',
    duration: '5 min',
    textPrompt: 'Lakukan ikhtiar terbaik yang ada dalam kendali Anda. Setelah itu, serahkan hasil akhirnya kepada Allah SWT dengan hati yang lapang.'
  },
  {
    title: 'Menenangkan Hati',
    description: 'Dzikir dan napas terpandu untuk meredakan kekhawatiran dan ketegangan.',
    duration: '4 min',
    textPrompt: 'Ingatlah bahwa hanya dengan mengingat Allah hati menjadi tenteram. Bernapaslah dengan tenang... Rasakan kedamaian mengalir memenuhi batin Anda.'
  },
  {
    title: 'Hadir dan Mengingat Allah',
    description: 'Melatih kehadiran penuh di momen saat ini dengan kesadaran spiritual.',
    duration: '5 min',
    textPrompt: 'Di manapun Anda berada saat ini, sadarilah keberadaan Anda. Rasakan pijakan kaki di lantai dan kehadiran Allah yang senantiasa dekat dengan hamba-Nya.'
  },
  {
    title: 'Refleksi Setelah Kesalahan',
    description: 'Memperbaiki niat, memohon ampunan (istighfar), dan bangkit kembali.',
    duration: '4 min',
    textPrompt: 'Setiap manusia dapat berbuat salah. Yang terbaik adalah mereka yang mau menyadari, memohon ampunan, dan belajar memperbaiki langkah besok pagi.'
  },
  {
    title: 'Refleksi Setelah Kekecewaan',
    description: 'Mengolah harapan yang patah, memahami kenyataan, dan melangkah kembali.',
    duration: '5 min',
    textPrompt: 'Kecewa adalah pertanda adanya harapan yang tidak terwujud. Luangkan waktu untuk menerima rasa ini, ambil ikhtiar yang masih tersisa, dan serahkan sisanya kepada-Nya.'
  },
  {
    title: 'Menutup Hari dengan Syukur',
    description: 'Melakukan rekapitulasi kebaikan dan menutup hari dengan rasa cukup.',
    duration: '4 min',
    textPrompt: 'Sebelum memejamkan mata, sebutkan satu hal kecil yang membuat Anda tersenyum hari ini. Tutup hari ini dengan rasa syukur dan kedamaian.'
  }
];

export const LegaSpiritualReflection: React.FC<LegaSpiritualReflectionProps> = ({
  onAddJournal,
}) => {
  const [activeTab, setActiveTab] = useState<'education' | 'flow' | 'reflection' | 'journal-doa' | 'audio'>('education');

  // Form State
  const [currentCondition, setCurrentCondition] = useState<string>('');
  const [currentEmotion, setCurrentEmotion] = useState<string>('Netral & Tenang');
  const [bodyMindResponse, setBodyMindResponse] = useState<string>('');
  const [experienceStory, setExperienceStory] = useState<string>('');
  const [focusConcept, setFocusConcept] = useState<string>('muhasabah');
  const [plannedIkhtiar, setPlannedIkhtiar] = useState<string>('');
  const [userDoaRequest, setUserDoaRequest] = useState<string>('');

  // Special Flags
  const [isCrisisRisk, setIsCrisisRisk] = useState<boolean>(false);

  // Audio State
  const [playingTrackIndex, setPlayingTrackIndex] = useState<number | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
  const [audioObject, setAudioObject] = useState<HTMLAudioElement | null>(null);

  // AI State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reflectionResult, setReflectionResult] = useState<any>(null);
  const [journalSaved, setJournalSaved] = useState<boolean>(false);

  const handleProcessSpiritualReflect = async () => {
    setIsLoading(true);

    const result = await reflectSpiritual({
      currentCondition,
      currentEmotion,
      bodyMindResponse,
      experienceStory,
      focusConcept,
      plannedIkhtiar,
      userDoaRequest,
      isCrisisRisk
    });

    setReflectionResult(result);
    setIsLoading(false);
  };

  const handleSaveToJournal = () => {
    if (!onAddJournal || !reflectionResult) return;

    const content = `=== JURNAL LEGA SPIRITUAL REFLECTION (V3.0 FINAL) ===
Kondisi Saya Sekarang:
- Perasaan & Emosi: ${currentEmotion}
- Kondisi Hadir: ${currentCondition || 'Hadir sejenak dalam keheningan'}
- Respons Tubuh & Pikiran: ${bodyMindResponse || 'Mengamati sensasi tanpa menghakimi'}

Apa Yang Sedang Saya Hadapi:
${experienceStory || 'Dinamika perjalanan hidup hari ini.'}

Apa Yang Dapat Saya Kendalikan & Ikhtiar Saya:
${plannedIkhtiar || reflectionResult.actionableIkhtiar?.join('; ') || 'Berfokus pada respon terbaik hari ini.'}

Apa Yang Ingin Saya Syukuri:
${reflectionResult.syukurReflection || 'Nikmat napas, kesehatan, dan kesempatan belajar.'}

Apa Yang Ingin Saya Perbaiki & Pembelajaran Hari Ini:
- ${reflectionResult.discoveredLessons?.join('\n- ') || 'Menjaga kesadaran batin.'}

Apa Yang Ingin Saya Serahkan Kepada Allah (Tawakal):
${reflectionResult.tawakalReflection || 'Menyerahkan hasil akhir setelah ikhtiar maksimal.'}

Doa Pribadi:
"${userDoaRequest || reflectionResult.recommendedDoa?.arabicOrTranslation || 'Ya Allah, lapangkanlah dadaku dan karuniakanlah ketenangan batin.'}"
(Sumber Rujukan: ${reflectionResult.recommendedDoa?.source || 'QS. Thaha: 25-26'})`;

    onAddJournal({
      title: `Muhasabah Spiritual (${focusConcept.toUpperCase()})`,
      content,
      mood: 'tentram',
      tags: ['Spiritual', 'Muhasabah', 'Sabar', 'Syukur', 'Ikhtiar', 'Tawakal']
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

    const track = SPIRITUAL_AUDIO_TRACKS[index];
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
      <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-emerald-800/40 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Moon className="w-48 h-48 text-emerald-400" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide uppercase">
            <Moon className="w-3.5 h-3.5" />
            LEGA Spiritual Reflection • Version 3.0 — FINAL
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-100">
            Refleksi Diri, Muhasabah & Kesadaran Spiritual
          </h1>
          <p className="text-sm md:text-base text-stone-300 leading-relaxed max-w-2xl">
            Menghubungkan pengalaman hidup, emosi, dan kesadaran diri dengan nilai-nilai Islami secara lembut, bertanggung jawab, serta tidak menghakimi (Sabar, Syukur, Ikhtiar & Tawakal).
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-stone-400">
            <VoiceGuideButton
              text="Selamat datang di modul LEGA Spiritual Reflection. Muhasabah adalah dialog hening yang penuh kerendahan hati dengan Sang Pencipta. Menyadari keterbatasan diri, mengikhtiarkan yang terbaik, dan memasrahkan hasil akhir dalam tawakal yang menenangkan."
              title="Panduan LEGA Spiritual Reflection"
              subtitle="Muhasabah, Sabar, Syukur & Tawakal"
              variant="pill"
            />
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-emerald-400" /> Muhasabah
            </span>
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> Sabar
            </span>
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-emerald-400" /> Syukur
            </span>
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-400" /> Ikhtiar
            </span>
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" /> Tawakal
            </span>
          </div>
        </div>
      </div>

      {/* Disclaimers & Limits Card */}
      <div className="bg-stone-900/90 border border-emerald-500/30 rounded-2xl p-5 md:p-6 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-stone-800 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Info className="w-4 h-4" /> Batasan Etis & Kerendahan Hati Modul
          </span>
          <span className="text-[11px] text-stone-400">Bukan Fatwa / Pengganti Ulama</span>
        </div>
        <p className="text-xs md:text-sm text-stone-300 leading-relaxed">
          Modul ini adalah <strong>pendamping refleksi pribadi</strong> dan <strong>BUKAN fatwa agama</strong> atau pengganti ulama/profesional medis. LEGA AI tidak menyamakan kesehatan mental dengan tingkat iman, tidak mengaitkan emosi negatif dengan "kurang tawakal", serta tidak memaksa rasa syukur di tengah penderitaan yang mendalam.
        </p>
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
            Keselamatan diri Anda adalah prioritas utama. Jika Anda mengalami penderitaan yang teramat berat atau dorongan menyakiti diri, luangkan waktu untuk beristirahat dan hubungi bantuan profesional/darurat terdekat secara langsung.
          </p>
          <div className="bg-stone-900/90 border border-purple-800/80 p-4 rounded-xl space-y-2 text-xs md:text-sm">
            <span className="font-bold text-purple-300 block">Layanan Darurat & Pendampingan Kesehatan Jiwa:</span>
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
              ? 'border-emerald-500 text-emerald-300 bg-emerald-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Edukasi & Panduan Emosi
        </button>
        <button
          onClick={() => setActiveTab('flow')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'flow'
              ? 'border-emerald-500 text-emerald-300 bg-emerald-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Footprints className="w-4 h-4" /> Alur Formula Respons
        </button>
        <button
          onClick={() => setActiveTab('reflection')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'reflection'
              ? 'border-emerald-500 text-emerald-300 bg-emerald-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Refleksi AI & Muhasabah
        </button>
        <button
          onClick={() => setActiveTab('journal-doa')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'journal-doa'
              ? 'border-emerald-500 text-emerald-300 bg-emerald-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Bookmark className="w-4 h-4" /> Doa & Rujukan Terverifikasi
        </button>
        <button
          onClick={() => setActiveTab('audio')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'audio'
              ? 'border-emerald-500 text-emerald-300 bg-emerald-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Volume2 className="w-4 h-4" /> Audio LEGA Spiritual
        </button>
      </div>

      {/* TAB 1: EDUKASI & PANDUAN EMOSI */}
      {activeTab === 'education' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Core Concepts Grid */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-lg">
            <h2 className="text-xl font-bold text-stone-100 flex items-center gap-2">
              <Moon className="w-5 h-5 text-emerald-400" /> 6 Konsep Utama Spiritual Reflection
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed">
              Konsep-konsep berikut menjadi pilar refleksi batin tanpa menghakimi atau menyederhanakan dinamika hidup:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {CORE_SPIRITUAL_CONCEPTS.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="bg-stone-950/70 border border-stone-800 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                      <IconComponent className="w-4 h-4 text-emerald-400" />
                      {item.title}
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Emotion Specific Handling Cards */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-lg">
            <h2 className="text-xl font-bold text-stone-100 flex items-center gap-2">
              <Heart className="w-5 h-5 text-emerald-400" /> Panduan Menyikapi Emosi Spesifik
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed">
              Emosi bukanlah ukuran keimanan. LEGA AI membantu Anda mengolah gejolak emosi secara bijak:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {EMOTION_HANDLING_GUIDES.map((e, idx) => {
                const IconComp = e.icon;
                return (
                  <div key={idx} className="bg-stone-950/80 border border-stone-800 p-4 rounded-xl space-y-2">
                    <div className={`flex items-center gap-2 font-bold text-sm ${e.color}`}>
                      <IconComp className="w-4 h-4" />
                      Saat Merasakan: {e.emotion}
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {e.guide}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 2: ALUR FORMULA RESPONS (8 TAHAP) */}
      {activeTab === 'flow' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg"
        >
          <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
              <Footprints className="w-5 h-5" /> Formula Respons 8-Tahap Mandatori
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full">
              Versi 3.0 Final
            </span>
          </div>

          <p className="text-xs md:text-sm text-stone-300 leading-relaxed">
            Setiap analisis dan refleksi spiritual dalam LEGA disusun secara terstruktur mengikuti 8 formula pergerakan batin:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            {FORMULA_STEPS.map((f, idx) => (
              <div key={idx} className="bg-stone-950/80 border border-stone-800 p-3.5 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${f.color}`}>
                    {idx + 1}. {f.label}
                  </span>
                </div>
                <p className="text-xs text-stone-300 pt-1">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-stone-800 pt-4 space-y-3">
            <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4" /> Alur Praktis Tawakal
            </h4>
            <div className="bg-stone-950/80 p-4 rounded-xl text-xs text-stone-300 space-y-2">
              <p className="font-semibold text-stone-200">
                KENALI SITUASI → TENTUKAN APA YANG DAPAT DIKENDALIKAN → LAKUKAN IKHTIAR → TERIMA KETERBATASAN KENDALI → SERAHKAN HASIL KEPADA ALLAH → LANJUTKAN KEHIDUPAN DENGAN SADAR
              </p>
              <p className="text-stone-400">
                Tawakal bukanlah kepasifan tanpa tindakan, melainkan muara tenang setelah melakukan ikhtiar yang wajar dan realistis.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 3: REFLEKSI AI & MUHASABAH */}
      {activeTab === 'reflection' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {!isCrisisRisk && (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg">
              <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
                  <Sparkles className="w-5 h-5" /> Formulir Muhasabah & Refleksi Spiritual
                </div>
                <span className="text-xs text-stone-400">Kerangka Nilai Islam</span>
              </div>

              {/* Concept Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                  1. Pilih Fokus Konsep Utama Refleksi:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                  {[
                    { id: 'muhasabah', label: 'Muhasabah' },
                    { id: 'sabar', label: 'Sabar' },
                    { id: 'syukur', label: 'Syukur' },
                    { id: 'ikhtiar', label: 'Ikhtiar' },
                    { id: 'tawakal', label: 'Tawakal' },
                    { id: 'ikhlas', label: 'Ikhlas' }
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setFocusConcept(c.id)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                        focusConcept === c.id
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                          : 'bg-stone-950 text-stone-400 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Emotion & Condition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-stone-800 pt-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                    2. Emosi yang Sedang Hadir Saat Ini:
                  </label>
                  <input
                    type="text"
                    value={currentEmotion}
                    onChange={(e) => setCurrentEmotion(e.target.value)}
                    placeholder="Sedih, marah, cemas, bingung, bersyukur..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-emerald-500/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-blue-300 uppercase tracking-wider block">
                    3. Keadaan Tubuh & Pikiran:
                  </label>
                  <input
                    type="text"
                    value={bodyMindResponse}
                    onChange={(e) => setBodyMindResponse(e.target.value)}
                    placeholder="Napas sedikit tegang, lelah, atau pusing..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-emerald-500/80"
                  />
                </div>
              </div>

              {/* Experience Story */}
              <div className="space-y-1.5 border-t border-stone-800 pt-3">
                <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
                  4. Ceritakan Pengalaman / Peristiwa Yang Sedang Dihadapi:
                </label>
                <textarea
                  rows={3}
                  value={experienceStory}
                  onChange={(e) => setExperienceStory(e.target.value)}
                  placeholder="Pengalaman harian, tantangan kerja, hubungan keluarga, atau pertanyaan dalam batin..."
                  className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-emerald-500/80"
                />
              </div>

              {/* Ikhtiar & Doa */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-stone-800 pt-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                    5. Bentuk Ikhtiar (Usaha Nyata) yang Ingin Dilakukan:
                  </label>
                  <input
                    type="text"
                    value={plannedIkhtiar}
                    onChange={(e) => setPlannedIkhtiar(e.target.value)}
                    placeholder="Menjaga lisan, meminta maaf, belajar, beristirahat..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-emerald-500/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
                    6. Harapan Doa / Permohonan Kepada Allah:
                  </label>
                  <input
                    type="text"
                    value={userDoaRequest}
                    onChange={(e) => setUserDoaRequest(e.target.value)}
                    placeholder="Diberi ketenangan, kelapangan dada, kemudahan jalan..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-emerald-500/80"
                  />
                </div>
              </div>

              {/* Crisis Risk Checkbox */}
              <div className="border-t border-stone-800 pt-3">
                <div className="flex items-center gap-2 bg-purple-950/40 p-3 rounded-xl border border-purple-900/60">
                  <input
                    type="checkbox"
                    id="crisisSpiritualCheck"
                    checked={isCrisisRisk}
                    onChange={(e) => setIsCrisisRisk(e.target.checked)}
                    className="rounded border-purple-700 bg-stone-900 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="crisisSpiritualCheck" className="text-xs text-purple-300 cursor-pointer font-bold">
                    [PENTING] Mengalami penderitaan yang teramat berat / dorongan menyakiti diri
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleProcessSpiritualReflect}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg"
                >
                  Proses Muhasabah & Insight AI <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Output Card */}
          {isLoading ? (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center space-y-4 shadow-xl">
              <Sparkles className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
              <h3 className="text-lg font-bold text-stone-200">Menyusun Muhasabah & Refleksi Spiritual...</h3>
              <p className="text-sm text-stone-400 max-w-md mx-auto">
                LEGA AI sedang merajut peristiwa hidup Anda dengan Formula 8 Tahap (Sadari, Pahami, Refleksikan, Ikhtiarkan, Syukuri, Sabari, Tawakalkan, Melangkah).
              </p>
            </div>
          ) : reflectionResult && !isCrisisRisk ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-stone-900 border border-emerald-800/40 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
                    <Moon className="w-6 h-6" /> Hasil Muhasabah LEGA Spiritual (V3.0 Final)
                  </div>
                  <span className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full">
                    Refleksi Personal
                  </span>
                </div>

                {/* Formula Response Visualizer */}
                {reflectionResult.responseFormula && (
                  <div className="bg-stone-950/90 border border-stone-800 rounded-2xl p-4 space-y-3">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block border-b border-stone-800 pb-2">
                      Rangkaian Formula Respons Batin (8 Tahap)
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1 bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
                        <span className="font-bold text-emerald-300">1. SADARI:</span>
                        <p className="text-stone-300">{reflectionResult.responseFormula.sadari}</p>
                      </div>
                      <div className="space-y-1 bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
                        <span className="font-bold text-blue-300">2. PAHAMI:</span>
                        <p className="text-stone-300">{reflectionResult.responseFormula.pahami}</p>
                      </div>
                      <div className="space-y-1 bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
                        <span className="font-bold text-indigo-300">3. REFLEKSIKAN:</span>
                        <p className="text-stone-300">{reflectionResult.responseFormula.refleksikan}</p>
                      </div>
                      <div className="space-y-1 bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
                        <span className="font-bold text-amber-300">4. IKHTIARKAN:</span>
                        <p className="text-stone-300">{reflectionResult.responseFormula.ikhtiarkan}</p>
                      </div>
                      <div className="space-y-1 bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
                        <span className="font-bold text-emerald-300">5. SYUKURI:</span>
                        <p className="text-stone-300">{reflectionResult.responseFormula.syukuri}</p>
                      </div>
                      <div className="space-y-1 bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
                        <span className="font-bold text-teal-300">6. SABARI:</span>
                        <p className="text-stone-300">{reflectionResult.responseFormula.sabari}</p>
                      </div>
                      <div className="space-y-1 bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
                        <span className="font-bold text-purple-300">7. TAWAKALKAN:</span>
                        <p className="text-stone-300">{reflectionResult.responseFormula.tawakalkan}</p>
                      </div>
                      <div className="space-y-1 bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
                        <span className="font-bold text-rose-300">8. MELANGKAH:</span>
                        <p className="text-stone-300">{reflectionResult.responseFormula.melangkah}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4 text-stone-200 leading-relaxed text-sm md:text-base">
                  {/* Summary */}
                  <p className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl text-stone-300 italic">
                    "{reflectionResult.summary}"
                  </p>

                  {/* Lessons */}
                  {reflectionResult.discoveredLessons && reflectionResult.discoveredLessons.length > 0 && (
                    <div className="bg-stone-950/80 border border-stone-800 p-4 rounded-xl space-y-2">
                      <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                        Pelajaran & Hikmah Spiritual:
                      </span>
                      <ul className="text-xs text-stone-300 space-y-1 list-disc pl-4">
                        {reflectionResult.discoveredLessons.map((l: string, i: number) => (
                          <li key={i}>{l}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actionable Ikhtiar & Tawakal */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-stone-800 pt-3">
                    <div className="bg-stone-950/50 border border-stone-800 p-3.5 rounded-xl space-y-1">
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                        Ikhtiar Konkret:
                      </span>
                      <ul className="text-xs text-stone-300 space-y-1 list-disc pl-4">
                        {reflectionResult.actionableIkhtiar?.map((a: string, i: number) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-stone-950/50 border border-stone-800 p-3.5 rounded-xl space-y-1">
                      <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                        Refleksi Tawakal:
                      </span>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        {reflectionResult.tawakalReflection}
                      </p>
                    </div>
                  </div>

                  {/* Recommended Doa */}
                  {reflectionResult.recommendedDoa && (
                    <div className="bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-600/40 p-4 rounded-2xl space-y-2">
                      <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                        Doa & Refleksi Rujukan ({reflectionResult.recommendedDoa.source}):
                      </span>
                      <p className="text-sm font-semibold italic text-stone-100">
                        "{reflectionResult.recommendedDoa.arabicOrTranslation}"
                      </p>
                      <p className="text-xs text-stone-300">
                        {reflectionResult.recommendedDoa.meaning}
                      </p>
                    </div>
                  )}

                  {/* Save to Journal */}
                  <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone-800">
                    <button
                      onClick={() => {
                        setReflectionResult(null);
                        setJournalSaved(false);
                      }}
                      className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Ulangi Muhasabah
                    </button>

                    <button
                      disabled={journalSaved}
                      onClick={handleSaveToJournal}
                      className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-800 text-white disabled:text-stone-500 font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition"
                    >
                      {journalSaved ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Tersimpan di Jurnal Spiritual
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-3.5 h-3.5" /> Simpan ke Jurnal Spiritual
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

      {/* TAB 4: DOA & RUJUKAN TERVERIFIKASI */}
      {activeTab === 'journal-doa' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg"
        >
          <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
              <Bookmark className="w-5 h-5" /> Rujukan Al-Qur'an & Hadits Terverifikasi
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full">
              Tanpa Mengarang Ayat
            </span>
          </div>

          <p className="text-xs md:text-sm text-stone-300 leading-relaxed">
            LEGA AI hanya menampilkan rujukan Al-Qur'an dan Hadits yang terverifikasi untuk menjadi cermin penenang batin:
          </p>

          <div className="space-y-4 pt-1">
            {[
              {
                source: 'QS. Al-Baqarah: 153',
                type: 'Al-Qur\'an',
                meaning: '"Wahai orang-orang yang beriman, mohonlah pertolongan (kepada Allah) dengan sabar dan shalat. Sungguh, Allah beserta orang-orang yang sabar."',
                note: 'Menjadikan kesabaran dan ibadah sebagai jangkar kekuatan batin.'
              },
              {
                source: 'QS. Al-Insyirah: 5-6',
                type: 'Al-Qur\'an',
                meaning: '"Maka sesungguhnya bersama kesulitan ada kemudahan. Sesungguhnya bersama kesulitan ada kemudahan."',
                note: 'Pengingat optimisme bahwa kesulitan tidak bersifat abadi.'
              },
              {
                source: 'HR. Muslim (no. 2999)',
                type: 'Hadits',
                meaning: '"Sungguh menakjubkan urusan seorang mukmin, seluruh urusannya adalah baik baginya... Jika ia mendapatkan kesenangan ia bersyukur, dan jika ia tertimpa kesulitan ia bersabar..."',
                note: 'Menyikapi setiap peristiwa hidup dengan syukur atau sabar.'
              }
            ].map((ref, idx) => (
              <div key={idx} className="bg-stone-950/80 border border-stone-800 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">{ref.source}</span>
                  <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded">{ref.type}</span>
                </div>
                <p className="text-xs italic text-stone-200 leading-relaxed">
                  {ref.meaning}
                </p>
                <p className="text-[11px] text-stone-400">
                  Hikmah: {ref.note}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* TAB 5: AUDIO LEGA SPIRITUAL REFLECTION */}
      {activeTab === 'audio' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg"
        >
          <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
              <Volume2 className="w-5 h-5" /> 10 Audio Terpandu LEGA Spiritual Reflection
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full">
              Gemini TTS Bahasa Indonesia
            </span>
          </div>

          <p className="text-xs md:text-sm text-stone-300 leading-relaxed">
            Dengarkan narasi muhasabah audio terpandu untuk merefleksikan kesabaran, rasa syukur, dan ketenangan batin Anda secara mendalam.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {SPIRITUAL_AUDIO_TRACKS.map((track, idx) => {
              const isPlaying = playingTrackIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-stone-950/80 border border-stone-800 hover:border-emerald-500/50 p-4 rounded-xl space-y-3 transition group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-stone-200 group-hover:text-emerald-300 transition">
                        {idx + 1}. {track.title}
                      </h4>
                      <span className="text-[11px] text-stone-500">{track.duration} • Suara Kore</span>
                    </div>

                    <button
                      disabled={isAudioLoading && playingTrackIndex === idx}
                      onClick={() => handlePlayAudioTrack(idx)}
                      className={`p-2.5 rounded-full text-white transition ${
                        isPlaying
                          ? 'bg-amber-600 hover:bg-amber-500'
                          : 'bg-emerald-600 hover:bg-emerald-500'
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
