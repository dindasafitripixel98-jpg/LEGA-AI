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
  PauseCircle,
  Clock,
  BatteryCharging,
  Compass,
  ChevronRight,
  VolumeX,
  Play,
  HeartHandshake,
  AlertCircle,
  Layers,
  HelpCircle,
  Eye,
  Sun
} from 'lucide-react';
import { motion } from 'motion/react';
import { reflectAnger } from '../lib/geminiApi';
import { JournalEntry } from '../types';

interface LegaAngerProps {
  onSelectModule: (module: string) => void;
  onAddJournal?: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
}

const ANGER_TRIGGERS = [
  'Konflik / Berdebat',
  'Penolakan',
  'Pengkhianatan',
  'Perasaan tidak dihargai',
  'Kelelahan fisik / mental',
  'Stres berlebihan',
  'Tekanan pekerjaan / tugas',
  'Masalah keluarga',
  'Ketidakadilan',
  'Kekecewaan mendalam',
  'Harapan yang tidak terpenuhi',
  'Batasan pribadi dilanggar'
];

const UNDERLYING_EMOTIONS = [
  'Kecewa',
  'Sedih / Terluka',
  'Takut / Cemas',
  'Terancam',
  'Malu / Merasa Kerdil',
  'Frustrasi / Tertekan',
  'Benci / Dendam',
  'Bingung'
];

const THOUGHT_RESPONSES = [
  'Sulit berpikir jernih',
  'Ingin menyalahkan orang lain',
  'Membesar-besarkan masalah (catastrophizing)',
  'Sulit melihat sudut pandang lain'
];

const EMOTIONAL_RESPONSES = [
  'Kesal / Jengkel',
  'Frustrasi berat',
  'Benci / Muak',
  'Kecewa mendalam'
];

const PHYSICAL_RESPONSES = [
  'Jantung berdebar kencang',
  'Napas pendek dan cepat',
  'Otot-otot tubuh menegang',
  'Wajah atau telinga memanas',
  'Rahang mengencang / menggertak',
  'Tangan otomatis mengepal'
];

const BEHAVIORAL_RESPONSES = [
  'Berteriak / membentak',
  'Diam berkepanjangan (silent treatment)',
  'Menjauh / pergi tiba-tiba',
  'Menyalahkan & menyerang balik',
  'Adu mulut / berdebat keras',
  'Bertindak impulsif / melempar barang'
];

const ANGER_AUDIO_TRACKS = [
  {
    title: 'Audio Mengenali Kemarahan',
    description: 'Panduan menyadari kehadiran emosi marah tanpa rasa bersalah atau menghakimi.',
    duration: '3 min',
    textPrompt: 'Beri diri Anda izin untuk menyadari emosi marah yang hadir saat ini. Tarik napas lembut... Marah bukanlah musuh atau kejahatan, melainkan sinyal jujur dari batin bahwa ada hal penting yang sedang membutuhkan perhatian Anda.'
  },
  {
    title: 'Audio Menenangkan Tubuh',
    description: 'Pelepasan ketegangan fisik pada otot bahu, rahang, dan kepalan tangan.',
    duration: '4 min',
    textPrompt: 'Saat marah, tubuh kita sedang bersiap membela diri. Sekarang, perlahan-lahan lemaskan otot rahang Anda... Biarkan gigi atas dan bawah tidak saling bersentuhan. Kendurkan kedua bahu Anda ke bawah, dan buka kepalan tangan Anda.'
  },
  {
    title: 'Audio Melepaskan Ketegangan',
    description: 'Napas terpandu untuk menurunkan detak jantung dan meredakan gejolak fisik.',
    duration: '5 min',
    textPrompt: 'Hembuskan napas panjang melalui mulut... Bayangkan setiap kali Anda menghembuskan napas, sebahagian hawa panas dan tekanan di dada keluar dengan perlahan. Tubuh Anda berangsur-angsur kembali tenang dan aman.'
  },
  {
    title: 'Audio Hadir Saat Marah',
    description: 'Menjadi saksi tenang terhadap gelombang kemarahan tanpa dorongan impulsif.',
    duration: '4 min',
    textPrompt: 'Amatilah emosi marah ini seperti gelombang di lautan. Gelombang ini naik tinggi, tetapi pada waktunya ia akan mereda. Anda tidak perlu langsung bertindak atau melampiaskannya. Cukup hadir di sini dan bernapas.'
  },
  {
    title: 'Audio Sebelum Berdiskusi',
    description: 'Menyiapkan pikiran jernih dan niat asertif sebelum berbicara dengan orang lain.',
    duration: '4 min',
    textPrompt: 'Sebelum membuka percakapan, tanyakan pada diri sendiri: Apa tujuan utama saya berbicara? Ingatlah bahwa menyampaikan batasan diri secara tenang jauh lebih efektif daripada meluapkan amarah.'
  },
  {
    title: 'Audio Setelah Konflik',
    description: 'Menenangkan batin dan mengurai rasa lelah setelah situasi ketegangan emosional.',
    duration: '5 min',
    textPrompt: 'Kini konflik telah berlalu. Berikan penghargaan pada diri Anda karena telah bertahan. Tarik napas dalam-dalam, biarkan pikiran beristirahat, dan lepaskan beban yang tersisa.'
  }
];

export const LegaAnger: React.FC<LegaAngerProps> = ({
  onSelectModule,
  onAddJournal,
}) => {
  const [activeTab, setActiveTab] = useState<'education' | 'high-anger' | 'reflection' | 'audio' | 'professional'>('education');

  // Form states (V2.0 Refleksi 7 Pertanyaan)
  const [situation, setSituation] = useState<string>('');
  const [mainTrigger, setMainTrigger] = useState<string>('');
  const [selectedUnderlying, setSelectedUnderlying] = useState<string[]>([]);
  const [unmetNeeds, setUnmetNeeds] = useState<string>('');
  const [violatedValues, setViolatedValues] = useState<string>('');
  const [controllableAspects, setControllableAspects] = useState<string>('');
  const [desiredWiseResponse, setDesiredWiseResponse] = useState<string>('');

  // 4 Domains
  const [selectedThought, setSelectedThought] = useState<string[]>([]);
  const [selectedEmotional, setSelectedEmotional] = useState<string[]>([]);
  const [selectedPhysical, setSelectedPhysical] = useState<string[]>([]);
  const [selectedBehavioral, setSelectedBehavioral] = useState<string[]>([]);

  // Flags
  const [isHighAnger, setIsHighAnger] = useState<boolean>(false);
  const [isHarmExpressed, setIsHarmExpressed] = useState<boolean>(false);

  // High Anger Micro-Pause Counter
  const [highAngerStep, setHighAngerStep] = useState<number>(1);

  // Audio state
  const [playingTrackIndex, setPlayingTrackIndex] = useState<number | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
  const [audioObject, setAudioObject] = useState<HTMLAudioElement | null>(null);

  // Async AI Reflection state
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

    const result = await reflectAnger({
      situation,
      mainTrigger,
      underlyingEmotions: selectedUnderlying,
      unmetNeeds,
      violatedValues,
      controllableAspects,
      desiredWiseResponse,
      thoughtSymptoms: selectedThought,
      emotionalSymptoms: selectedEmotional,
      bodySymptoms: selectedPhysical,
      behaviorSymptoms: selectedBehavioral,
      isHighAnger,
      isHarmExpressed
    });

    setReflectionResult(result);
    setIsLoading(false);
  };

  const handleSaveToJournal = () => {
    if (!onAddJournal || !reflectionResult) return;

    const content = `=== REFLEKSI LEGA ANGER (V2.0) ===
Situasi Kejadian: ${situation || '-'}
Pemicu Utama: ${mainTrigger || '-'}
Emosi Di Balik Marah: ${selectedUnderlying.join(', ') || '-'}

Dampak Yang Dirasakan (4 Ranah):
- Pikiran: ${selectedThought.join(', ') || '-'}
- Emosi: ${selectedEmotional.join(', ') || '-'}
- Tubuh: ${selectedPhysical.join(', ') || '-'}
- Perilaku: ${selectedBehavioral.join(', ') || '-'}

Kebutuhan Batin / Batasan Yang Dilanggar:
${unmetNeeds || violatedValues || '-'}

Analisis & Insight AI:
${reflectionResult.summary || '-'}

Hal Dalam Kendali Hari Ini:
${reflectionResult.reflectiveInsights?.inControl || controllableAspects || '-'}

Rekomendasi Respon Sadar (Asertif):
${reflectionResult.reflectiveInsights?.wiseResponse || desiredWiseResponse || '-'}`;

    onAddJournal({
      title: 'Refleksi LEGA Anger V2.0',
      content,
      mood: 'marah',
      tags: ['Anger', 'Marah', 'RegulasiEmosi', 'ResponSadar', 'Asertif']
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

    const track = ANGER_AUDIO_TRACKS[index];
    setIsAudioLoading(true);
    setPlayingTrackIndex(index);

    try {
      const res = await fetch('/api/gemini/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: track.textPrompt,
          voiceName: 'Kore' // Warm calm female voice
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

  const resetForm = () => {
    setSituation('');
    setMainTrigger('');
    setSelectedUnderlying([]);
    setUnmetNeeds('');
    setViolatedValues('');
    setControllableAspects('');
    setDesiredWiseResponse('');
    setSelectedThought([]);
    setSelectedEmotional([]);
    setSelectedPhysical([]);
    setSelectedBehavioral([]);
    setIsHighAnger(false);
    setIsHarmExpressed(false);
    setReflectionResult(null);
    setJournalSaved(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-rose-950/50 via-stone-900 to-amber-950/40 border border-rose-800/40 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Flame className="w-48 h-48 text-rose-400" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold tracking-wide uppercase">
            <Flame className="w-3.5 h-3.5" />
            LEGA Anger • Version 2.0
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-100">
            Kesadaran & Regulasi Emosi Marah
          </h1>
          <p className="text-sm md:text-base text-stone-300 leading-relaxed max-w-2xl">
            Memahami emosi marah, mengenali pemicunya, mengamati respon tubuh dan pikiran, serta mempelajari cara merespons kemarahan secara lebih sadar.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs text-stone-400">
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-rose-400" /> Emosi Normal • Bukan Dosa
            </span>
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-rose-400" /> Respon 4 Ranah
            </span>
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <PauseCircle className="w-3.5 h-3.5 text-rose-400" /> Mode Jeda Sangat Marah
            </span>
          </div>
        </div>
      </div>

      {/* Filosofi LEGA Anger Card */}
      <div className="bg-stone-900/90 border border-rose-500/30 rounded-2xl p-5 md:p-6 shadow-md space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
          <Compass className="w-4 h-4" /> Filosofi LEGA Anger
        </span>
        <blockquote className="text-sm md:text-base text-stone-200 font-medium italic leading-relaxed border-l-2 border-rose-500 pl-4 py-1">
          "Marah bukan musuh. Marah bukan dosa. Marah adalah sinyal. Marah dapat menunjukkan adanya kebutuhan, nilai, batasan, atau harapan yang terasa terganggu. Tidak semua kemarahan perlu dilampiaskan, tidak semua kemarahan perlu ditekan. Marah dapat diamati, dipahami, dan dikelola dengan kesadaran."
        </blockquote>
      </div>

      {/* Emergency Crisis Alert if Harm Expressed */}
      {isHarmExpressed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-rose-950/90 border-2 border-rose-600 rounded-2xl p-6 text-stone-100 space-y-4 shadow-2xl"
        >
          <div className="flex items-center gap-3 text-rose-300 font-bold text-lg border-b border-rose-800 pb-3">
            <PhoneCall className="w-6 h-6 animate-pulse text-rose-400" />
            PROTOKOL KESELAMATAN & DUKUNGAN DARURAT
          </div>
          <p className="text-sm leading-relaxed text-stone-200">
            Keselamatan Anda dan orang-orang di sekitar Anda adalah prioritas paling utama. Jika gejolak emosi saat ini menciptakan dorongan untuk melukai diri sendiri atau melukai orang lain, mohon hentikan latihan ini dan segera jarakkan diri dari situasi konflik.
          </p>
          <div className="bg-stone-900/90 border border-rose-800/80 p-4 rounded-xl space-y-2 text-xs md:text-sm">
            <span className="font-bold text-rose-300 block">Layanan Darurat & Bantuan Langsung:</span>
            <ul className="space-y-1 text-stone-300">
              <li>• <strong>Layanan Sehat Jiwa Kemenkes RI:</strong> Call Center 119 (Tekan 8)</li>
              <li>• <strong>Layanan Darurat Indonesia:</strong> 112 / 118</li>
              <li>• Hubungi orang terdekat atau pihak berwenang untuk mendampingi Anda hingga emosi mereda.</li>
            </ul>
          </div>
          <p className="text-xs text-rose-300 italic">
            *Latihan refleksi dinonaktifkan demi keselamatan. Mohon gunakan kontak darurat di atas.
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
          <BookOpen className="w-4 h-4" /> Edukasi Marah
        </button>
        <button
          onClick={() => setActiveTab('high-anger')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'high-anger'
              ? 'border-rose-500 text-rose-300 bg-rose-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <PauseCircle className="w-4 h-4" /> Mode Sangat Marah
        </button>
        <button
          onClick={() => setActiveTab('reflection')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'reflection'
              ? 'border-rose-500 text-rose-300 bg-rose-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Refleksi 7 Pertanyaan AI
        </button>
        <button
          onClick={() => setActiveTab('audio')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'audio'
              ? 'border-rose-500 text-rose-300 bg-rose-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Volume2 className="w-4 h-4" /> Audio LEGA Anger
        </button>
        <button
          onClick={() => setActiveTab('professional')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'professional'
              ? 'border-rose-500 text-rose-300 bg-rose-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <PhoneCall className="w-4 h-4" /> Bantuan & Darurat
        </button>
      </div>

      {/* TAB 1: EDUKASI MARAH */}
      {activeTab === 'education' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Hakikat Marah */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-lg">
            <h2 className="text-xl font-bold text-stone-100 flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-400" /> Memahami Hakikat Emosi Marah
            </h2>
            <p className="text-stone-300 text-sm md:text-base leading-relaxed">
              Marah adalah salah satu emosi dasar manusia yang sehat dan protektif. Marah sendiri bukanlah sebuah kesalahan atau tindakan buruk. Yang menentukan dampaknya adalah <strong>bagaimana kita memilih untuk merespons emosi tersebut</strong>.
            </p>
            <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl space-y-2 text-xs md:text-sm text-stone-300">
              <span className="font-bold text-rose-300 block">Marah Biasanya Muncul Ketika Seseorang Merasa:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <span>• Tidak dihargai / diremehkan</span>
                <span>• Disakiti secara fisik maupun emosional</span>
                <span>• Diperlakukan tidak adil</span>
                <span>• Merasa terancam / terpojok</span>
                <span>• Dikecewakan secara mendalam</span>
                <span>• Batas pribadinya dilanggar</span>
              </div>
            </div>
          </div>

          {/* Pemicu Kemarahan */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-lg">
            <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-rose-400" /> Pemicu Kemarahan Umum
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {ANGER_TRIGGERS.map((trigger, idx) => (
                <span key={idx} className="bg-stone-950 border border-stone-800 px-3 py-1.5 rounded-lg text-stone-300">
                  • {trigger}
                </span>
              ))}
            </div>
          </div>

          {/* Respon Marah 4 Ranah */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-stone-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-400" /> Respon Marah Dalam 4 Ranah
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Pikiran */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block flex items-center gap-1.5">
                  <Brain className="w-4 h-4" /> Pikiran
                </span>
                <ul className="text-xs text-stone-300 space-y-1.5 list-disc pl-4">
                  {THOUGHT_RESPONSES.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              </div>

              {/* Emosi */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block flex items-center gap-1.5">
                  <Flame className="w-4 h-4" /> Emosi
                </span>
                <ul className="text-xs text-stone-300 space-y-1.5 list-disc pl-4">
                  {EMOTIONAL_RESPONSES.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              </div>

              {/* Tubuh */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4" /> Tubuh
                </span>
                <ul className="text-xs text-stone-300 space-y-1.5 list-disc pl-4">
                  {PHYSICAL_RESPONSES.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              </div>

              {/* Perilaku */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> Perilaku
                </span>
                <ul className="text-xs text-stone-300 space-y-1.5 list-disc pl-4">
                  {BEHAVIORAL_RESPONSES.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              </div>
            </div>
          </div>

          {/* Membangun Respons yang Sehat */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-lg">
            <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
              <Shield className="w-5 h-5 text-rose-400" /> Membangun Respons Yang Sehat
            </h3>
            <p className="text-xs md:text-sm text-stone-300 leading-relaxed">
              Tujuan LEGA Anger bukan menekan emosi hingga meledak di kemudian hari, melainkan menjeda reaksi impulsif agar kita bisa menyampaikan pesan secara asertif dan bijaksana.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-stone-950/60 border border-stone-800 p-3 rounded-xl space-y-1">
                <span className="font-bold text-rose-300 block">1. Berhenti Sejenak (Time-out)</span>
                <p className="text-stone-400">Jarakkan diri dari pemicu selama 5-15 menit sebelum menanggapi.</p>
              </div>
              <div className="bg-stone-950/60 border border-stone-800 p-3 rounded-xl space-y-1">
                <span className="font-bold text-rose-300 block">2. Mengatur Napas</span>
                <p className="text-stone-400">Hembuskan napas lebih panjang untuk menurunkan detak jantung.</p>
              </div>
              <div className="bg-stone-950/60 border border-stone-800 p-3 rounded-xl space-y-1">
                <span className="font-bold text-rose-300 block">3. Mengamati Sensasi Tubuh</span>
                <p className="text-stone-400">Lemaskan rahang, bahu, dan buka kepalan tangan yang tegang.</p>
              </div>
              <div className="bg-stone-950/60 border border-stone-800 p-3 rounded-xl space-y-1">
                <span className="font-bold text-rose-300 block">4. Identifikasi Kebutuhan</span>
                <p className="text-stone-400">Pahami kebutuhan batin apa yang sebenarnya sedang terluka.</p>
              </div>
              <div className="bg-stone-950/60 border border-stone-800 p-3 rounded-xl space-y-1">
                <span className="font-bold text-rose-300 block">5. Komunikasi Asertif</span>
                <p className="text-stone-400">Sampaikan batasan diri tanpa menyerang atau menghina lawan bicara.</p>
              </div>
              <div className="bg-stone-950/60 border border-stone-800 p-3 rounded-xl space-y-1">
                <span className="font-bold text-rose-300 block">6. Pilih Waktu Tepat</span>
                <p className="text-stone-400">Diskusi terbaik dilakukan saat kedua belah pihak sudah sama-sama tenang.</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 2: MODE SANGAT MARAH (HIGH ANGER PAUSE) */}
      {activeTab === 'high-anger' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-rose-800/60 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl"
        >
          <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-lg">
              <PauseCircle className="w-6 h-6 animate-pulse" /> Mode Jeda Saat Sangat Marah
            </div>
            <span className="text-xs bg-rose-500/10 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full">
              Jeda Darurat Emosi
            </span>
          </div>

          <div className="bg-stone-950/80 border border-rose-900/50 p-4 rounded-xl text-stone-200 text-sm md:text-base leading-relaxed space-y-2">
            <p className="font-bold text-rose-300">
              "Jika emosi Anda saat ini sedang sangat tinggi:"
            </p>
            <ul className="space-y-1.5 text-xs md:text-sm text-stone-300 list-disc pl-5">
              <li><strong>JANGAN mengambil keputusan besar</strong> saat ini.</li>
              <li><strong>TUNDA mengetik pesan / balasan panas</strong> di gawai Anda.</li>
              <li>Fokuskan perhatian hanya pada ketenangan tubuh dan hembusan napas.</li>
            </ul>
          </div>

          {/* Interactive Pause Steps */}
          <div className="bg-stone-950/90 border border-stone-800 rounded-xl p-6 text-center space-y-6">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
              Langkah Penyelamat Emosi {highAngerStep} dari 4
            </span>

            {highAngerStep === 1 && (
              <div className="space-y-3 py-4">
                <PauseCircle className="w-16 h-16 text-rose-400 mx-auto animate-bounce" />
                <h4 className="text-xl font-bold text-stone-100">1. Hentikan Kontak & Beri Jeda</h4>
                <p className="text-sm text-stone-300 max-w-md mx-auto">
                  Letakkan gawai Anda. Jarakkan diri Anda secara fisik dari ruangan atau orang yang memicu kemarahan selama beberapa menit.
                </p>
              </div>
            )}

            {highAngerStep === 2 && (
              <div className="space-y-3 py-4">
                <Wind className="w-16 h-16 text-indigo-400 mx-auto animate-pulse" />
                <h4 className="text-xl font-bold text-stone-100">2. Lemaskan Rahang & Kepalan Tangan</h4>
                <p className="text-sm text-stone-300 max-w-md mx-auto">
                  Sensasi fisik marah berpusat di rahang dan tangan. Pisahkan gigi atas dan bawah Anda, lemaskan bahu, dan buka kedua telapak tangan Anda.
                </p>
              </div>
            )}

            {highAngerStep === 3 && (
              <div className="space-y-3 py-4">
                <HeartPulse className="w-16 h-16 text-amber-400 mx-auto animate-pulse" />
                <h4 className="text-xl font-bold text-stone-100">3. Tarik Napas Lambat (4-7-8)</h4>
                <p className="text-sm text-stone-300 max-w-md mx-auto">
                  Tarik napas lembut melalui hidung... tahan sejenak... lalu hembuskan panjang lewat mulut. Biarkan detak jantung berangsur melambat.
                </p>
              </div>
            )}

            {highAngerStep === 4 && (
              <div className="space-y-3 py-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
                <h4 className="text-xl font-bold text-stone-100">4. Sadari Pijakan Kaki di Lantai</h4>
                <p className="text-sm text-stone-300 max-w-md mx-auto">
                  Rasakan kedua telapak kaki Anda menempel erat di lantai. Anda berada di sini, aman, dan memegang penuh kendali atas respon Anda.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-stone-800">
              <button
                disabled={highAngerStep === 1}
                onClick={() => setHighAngerStep((prev) => Math.max(1, prev - 1))}
                className="text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 px-4 py-2 rounded-xl disabled:opacity-40 transition"
              >
                Kembali
              </button>

              <button
                onClick={() => {
                  if (highAngerStep < 4) {
                    setHighAngerStep((prev) => prev + 1);
                  } else {
                    setActiveTab('reflection');
                    setIsHighAnger(true);
                  }
                }}
                className="text-xs bg-rose-600 hover:bg-rose-500 text-stone-950 font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-1.5"
              >
                {highAngerStep < 4 ? 'Langkah Berikutnya' : 'Lanjut Ke Refleksi AI Singkat'} <ArrowRight className="w-3.5 h-3.5" />
              </button>
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
          {!isHarmExpressed && (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg">
              <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-lg">
                  <Sparkles className="w-5 h-5" /> 7 Pertanyaan Reflektif LEGA Anger
                </div>
                <span className="text-xs text-stone-400">Refleksi Kesadaran Terpandu</span>
              </div>

              {/* Q1: Situation */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-200 block">
                  1. Apa yang sebenarnya terjadi? (Peristiwa / Situasi)
                </label>
                <textarea
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  rows={3}
                  placeholder="Ceritakan kejadian, perkataan orang lain, atau situasi yang memicu rasa marah Anda..."
                  className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3.5 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-rose-500/80"
                />
              </div>

              {/* Q2: Main Trigger */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-200 block">
                  2. Apa pemicu utama kemarahan Anda?
                </label>
                <div className="flex flex-wrap gap-2">
                  {ANGER_TRIGGERS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setMainTrigger(item)}
                      className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                        mainTrigger === item
                          ? 'bg-rose-500/20 border-rose-500 text-rose-200 font-semibold'
                          : 'bg-stone-950/50 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      {item} {mainTrigger === item && '✓'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q3: Underlying Emotions */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-200 block">
                  3. Emosi apa yang berada di balik rasa marah tersebut?
                </label>
                <div className="flex flex-wrap gap-2">
                  {UNDERLYING_EMOTIONS.map((item) => {
                    const active = selectedUnderlying.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleArrayItem(item, selectedUnderlying, setSelectedUnderlying)}
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

              {/* Q4 & Q5: Unmet Needs & Violated Values */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-stone-800">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block">
                    4. Kebutuhan apa yang belum terpenuhi?
                  </label>
                  <input
                    type="text"
                    value={unmetNeeds}
                    onChange={(e) => setUnmetNeeds(e.target.value)}
                    placeholder="Misal: Kebutuhan akan apresiasi, rasa aman, keheningan..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-rose-500/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-rose-300 uppercase tracking-wider block">
                    5. Nilai / Batasan apa yang terasa dilanggar?
                  </label>
                  <input
                    type="text"
                    value={violatedValues}
                    onChange={(e) => setViolatedValues(e.target.value)}
                    placeholder="Misal: Kejujuran, rasa saling menghormati, kesopanan..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-rose-500/80"
                  />
                </div>
              </div>

              {/* 4 Domains Symptoms Checklist */}
              <div className="space-y-4 pt-2 border-t border-stone-800">
                <label className="text-sm font-bold text-rose-300 block">
                  Respon yang Anda rasakan pada tubuh, pikiran, emosi & perilaku:
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
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">Emosi Menyertai</span>
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
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Dorongan Perilaku</span>
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

              {/* Q6 & Q7: Controllables & Desired Wise Response */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-stone-800">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block">
                    6. Apa yang masih berada dalam kendali Anda?
                  </label>
                  <input
                    type="text"
                    value={controllableAspects}
                    onChange={(e) => setControllableAspects(e.target.value)}
                    placeholder="Misal: Memberi jeda, mengatur suara, menunda balasan..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-rose-500/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-rose-300 uppercase tracking-wider block">
                    7. Bagaimana Anda ingin merespons agar selaras dengan nilai diri?
                  </label>
                  <input
                    type="text"
                    value={desiredWiseResponse}
                    onChange={(e) => setDesiredWiseResponse(e.target.value)}
                    placeholder="Misal: Menyampaikan keberatan dengan tenang & asertif..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-rose-500/80"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 pt-2 border-t border-stone-800">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="highAngerCheck"
                    checked={isHighAnger}
                    onChange={(e) => setIsHighAnger(e.target.checked)}
                    className="rounded border-stone-700 bg-stone-900 text-rose-600 focus:ring-rose-500"
                  />
                  <label htmlFor="highAngerCheck" className="text-xs text-stone-300 cursor-pointer font-medium">
                    Saya sedang dalam kondisi emosi sangat tinggi (butuh saran sangat singkat & tenang)
                  </label>
                </div>

                <div className="flex items-center gap-2 bg-rose-950/40 p-3 rounded-xl border border-rose-900/60">
                  <input
                    type="checkbox"
                    id="harmCheck"
                    checked={isHarmExpressed}
                    onChange={(e) => setIsHarmExpressed(e.target.checked)}
                    className="rounded border-rose-700 bg-stone-900 text-rose-600 focus:ring-rose-500"
                  />
                  <label htmlFor="harmCheck" className="text-xs text-rose-300 cursor-pointer font-bold">
                    [PENTING] Ada risiko melukai diri sendiri atau melukai orang lain
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleProcessReflection}
                  className="bg-rose-600 hover:bg-rose-500 text-stone-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg"
                >
                  Proses Refleksi & Insight AI <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Output Card */}
          {isLoading ? (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center space-y-4 shadow-xl">
              <Sparkles className="w-10 h-10 text-rose-400 animate-spin mx-auto" />
              <h3 className="text-lg font-bold text-stone-200">Mengurai Gejolak Kemarahan...</h3>
              <p className="text-sm text-stone-400 max-w-md mx-auto">
                LEGA AI sedang merangkum pesan dari emosi Anda dan memetakan langkah respon asertif yang bijaksana.
              </p>
            </div>
          ) : reflectionResult && !isHarmExpressed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-stone-900 border border-rose-800/40 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-lg">
                    <Flame className="w-6 h-6" /> Hasil Analisis & Refleksi LEGA Anger
                  </div>
                  <span className="text-xs bg-rose-500/10 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full">
                    Sintesis Edukatif AI
                  </span>
                </div>

                <div className="space-y-4 text-stone-200 leading-relaxed text-sm md:text-base">
                  <p className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl text-stone-300 italic">
                    "{reflectionResult.summary}"
                  </p>

                  {/* Identified Triggers & Underlying */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-stone-950/50 border border-stone-800 p-4 rounded-xl space-y-1">
                      <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Zap className="w-4 h-4" /> Pemicu Utama:
                      </h4>
                      <p className="text-xs text-stone-300">
                        {reflectionResult.triggersIdentified?.join(', ') || mainTrigger || 'Konflik / Rasa tidak dihargai'}
                      </p>
                    </div>

                    <div className="bg-stone-950/50 border border-stone-800 p-4 rounded-xl space-y-1">
                      <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <HeartPulse className="w-4 h-4" /> Emosi Di Balik Marah:
                      </h4>
                      <p className="text-xs text-stone-300">
                        {reflectionResult.underlyingEmotions?.join(', ') || 'Kecewa, Terluka, atau Terancam'}
                      </p>
                    </div>
                  </div>

                  {/* Unmet Needs / Values */}
                  {reflectionResult.unmetNeedOrValue && (
                    <div className="bg-stone-950/50 border border-rose-900/40 p-4 rounded-xl space-y-1">
                      <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Compass className="w-4 h-4" /> Pesan Kebutuhan & Batasan Diri:
                      </h4>
                      <p className="text-xs text-stone-200 leading-relaxed">
                        {reflectionResult.unmetNeedOrValue}
                      </p>
                    </div>
                  )}

                  {/* Reflective Insights */}
                  {reflectionResult.reflectiveInsights && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-stone-950/50 border border-stone-800 p-4 rounded-xl space-y-1">
                        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Shield className="w-4 h-4" /> Hal Dalam Kendali:
                        </h4>
                        <p className="text-xs text-stone-300 leading-relaxed">
                          {reflectionResult.reflectiveInsights.inControl}
                        </p>
                      </div>

                      <div className="bg-stone-950/50 border border-emerald-900/40 p-4 rounded-xl space-y-1">
                        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Rekomendasi Respon Sadar (Asertif):
                        </h4>
                        <p className="text-xs text-stone-100 leading-relaxed font-medium">
                          {reflectionResult.reflectiveInsights.wiseResponse}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Healthy Response Tips */}
                  {reflectionResult.healthyResponseTips && reflectionResult.healthyResponseTips.length > 0 && (
                    <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl space-y-2">
                      <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Shield className="w-4 h-4" /> Langkah Pengelolaan Kemarahan:
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs text-stone-300">
                        {reflectionResult.healthyResponseTips.map((tip: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
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

      {/* TAB 4: AUDIO LEGA ANGER */}
      {activeTab === 'audio' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-lg">
                <Volume2 className="w-6 h-6" /> Audio Relaksasi & Panduan LEGA Anger
              </div>
              <span className="text-xs bg-rose-500/10 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full">
                Gemini TTS Bahasa Indonesia
              </span>
            </div>
            <p className="text-xs md:text-sm text-stone-300 leading-relaxed">
              Dengarkan audio terpandu ini untuk membantu meredakan gejolak emosi marah, merelaksasi fisik yang tegang, serta menyiapkan pikiran jernih sebelum berdiskusi.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {ANGER_AUDIO_TRACKS.map((track, idx) => {
                const isPlaying = playingTrackIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all space-y-3 ${
                      isPlaying
                        ? 'bg-rose-950/40 border-rose-500'
                        : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-stone-200 block">{track.title}</span>
                        <p className="text-[11px] text-stone-400 leading-snug">{track.description}</p>
                      </div>
                      <span className="text-[10px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded-full shrink-0">
                        {track.duration}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-800/80">
                      <button
                        onClick={() => handlePlayAudioTrack(idx)}
                        disabled={isAudioLoading && playingTrackIndex === idx}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                          isPlaying
                            ? 'bg-rose-600 text-stone-950 shadow-lg'
                            : 'bg-stone-800 hover:bg-stone-700 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {isAudioLoading && playingTrackIndex === idx ? (
                          <>
                            <Sparkles className="w-3.5 h-3.5 animate-spin" /> Memuat Voice...
                          </>
                        ) : isPlaying ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" /> Hentikan Audio
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" /> Putar Audio TTS
                          </>
                        )}
                      </button>

                      {isPlaying && (
                        <span className="text-[11px] text-rose-400 flex items-center gap-1.5 animate-pulse">
                          <Volume2 className="w-3.5 h-3.5" /> Memutar...
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 5: BANTUAN & DARURAT */}
      {activeTab === 'professional' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg"
        >
          <div className="border-b border-stone-800 pb-4 flex items-center gap-2 text-rose-400 font-bold text-lg">
            <PhoneCall className="w-6 h-6" /> Panduan Bantuan Profesional & Layanan Darurat
          </div>

          <div className="space-y-4 text-xs md:text-sm text-stone-300 leading-relaxed">
            <p>
              LEGA Anger dirancang sebagai modul psikoedukasi dan pendamping refleksi pribadi. Apabila kemarahan Anda terasa sangat kuat, sering terjadi berulang kali, mengganggu hubungan interpersonal, atau sulit dikendalikan secara mandiri, berkonsultasi dengan profesional kesehatan mental (Psikolog Klinis atau Psikiater) sangat disarankan.
            </p>

            <div className="bg-stone-950/80 border border-rose-800/60 p-5 rounded-xl space-y-3">
              <span className="font-bold text-rose-300 text-sm block">Kontak Bantuan Kesehatan Mental & Darurat Indonesia:</span>
              <ul className="space-y-2 text-stone-200">
                <li className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-rose-400 shrink-0" />
                  <span><strong>Layanan Sehat Jiwa Kemenkes RI:</strong> Call Center 119 (Ext. 8)</span>
                </li>
                <li className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-rose-400 shrink-0" />
                  <span><strong>Layanan Darurat Terpadu:</strong> 112 / 118</span>
                </li>
                <li className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-rose-400 shrink-0" />
                  <span><strong>Konsultasi Psikolog Klinis:</strong> Kunjungi Puskesmas, Rumah Sakit Umum, atau platform Telemedicine resmi.</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
