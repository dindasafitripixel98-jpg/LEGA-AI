import React, { useState } from 'react';
import {
  CloudRain,
  Heart,
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
  Sun,
  Smile,
  Coffee,
  Feather,
  Anchor,
  UserCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { reflectSadness } from '../lib/geminiApi';
import { JournalEntry } from '../types';
import { VoiceGuideButton } from './VoiceGuideButton';

interface LegaSadnessProps {
  onSelectModule: (module: string) => void;
  onAddJournal?: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
}

const SADNESS_CAUSES = [
  'Kehilangan orang tercinta',
  'Perpisahan / Putus hubungan',
  'Kekecewaan mendalam',
  'Penolakan',
  'Perubahan hidup yang besar',
  'Harapan / Cita-cita yang belum tercapai',
  'Kegagalan dalam tugas / pekerjaan',
  'Kesepian / Merasa terasing',
  'Empati terhadap penderitaan orang lain',
  'Kelelahan fisik & emosional'
];

const THOUGHT_RESPONSES = [
  'Sulit berkonsentrasi',
  'Terus mengingat masa lalu / kenangan',
  'Merasa kehilangan & hampa',
  'Menyalahkan diri sendiri',
  'Merasa putus asa / hilang arah'
];

const EMOTIONAL_RESPONSES = [
  'Sedih mendalam',
  'Perasaan hampa / kosong',
  'Kecewa terhadap situasi',
  'Kecewa terhadap diri sendiri',
  'Kesepian / merasa sendiri',
  'Rindu yang tak tersampaikan'
];

const PHYSICAL_RESPONSES = [
  'Tubuh terasa lemas & berat',
  'Dada terasa sesak / berat',
  'Air mata menetes / ingin menangis',
  'Gangguan tidur (insomnia / tidur berlebih)',
  'Perubahan nafsu makan',
  'Energi fisik sangat menurun'
];

const BEHAVIORAL_RESPONSES = [
  'Menarik diri dari lingkungan',
  'Lebih banyak diam / melamun',
  'Menangis secara berkala',
  'Sulit menikmati aktivitas favorit',
  'Mengurangi interaksi sosial / pesan'
];

const SADNESS_AUDIO_TRACKS = [
  {
    title: 'Audio Menemani Kesedihan',
    description: 'Panduan lembut untuk hadir dan merangkul rasa sedih tanpa harus menolaknya.',
    duration: '4 min',
    textPrompt: 'Duduklah dengan nyaman. Tarik napas lembut... Kesedihan yang hadir saat ini bukanlah kelemahan atau kegagalan. Ia adalah bukti bahwa Anda adalah manusia yang memiliki hati yang tulus dan mampu merasakan.'
  },
  {
    title: 'Audio Melepaskan Kesedihan',
    description: 'Napas terpandu mengalirkan rasa hangat ke dada yang terasa berat.',
    duration: '5 min',
    textPrompt: 'Rasakan kehangatan di area dada Anda... Bayangkan setiap kali Anda menghembuskan napas, sebahagian rasa berat dan kesedihan perlahan-lahan mengalir keluar seperti air telaga yang tenang.'
  },
  {
    title: 'Audio Belas Kasih kepada Diri',
    description: 'Menumbuhkan dekapan kasih dan rasa terima pada diri sendiri.',
    duration: '4 min',
    textPrompt: 'Letakkan satu telapak tangan Anda di dada... Bisikkan secara lembut pada diri Anda: "Saya menghargai semua yang telah saya lalui. Saya tidak harus sempurna, dan saya mengizinkan diri saya beristirahat hari ini."'
  },
  {
    title: 'Audio Menghadapi Kehilangan',
    description: 'Renungan lembut memahami perubahan dan menghormati kenangan berharga.',
    duration: '5 min',
    textPrompt: 'Kehilangan dan perubahan adalah bagian dari siklus kehidupan. Kenangan indah yang pernah ada tetap tersimpan aman di dalam sanubari Anda, memberikan kekuatan di setiap langkah kecil Anda.'
  },
  {
    title: 'Audio Syukur dalam Proses',
    description: 'Mengenali titik terang kecil tanpa memaksakan kebahagiaan semu.',
    duration: '4 min',
    textPrompt: 'Anda tidak perlu memaksa diri untuk merasa bahagia saat ini. Cukup sadari keberadaan hal-hal kecil di sekitar Anda: udara yang Anda hirup, kenyamanan tempat Anda duduk, dan napas yang terus setia menemani.'
  },
  {
    title: 'Audio Sebelum Tidur',
    description: 'Relaksasi lembut menenangkan pikiran dan melepas beban sebelum beristirahat.',
    duration: '6 min',
    textPrompt: 'Malam ini, biarkan tubuh dan pikiran Anda beristirahat sepenuhnya. Lepaskan semua kekhawatiran dan kenangan hari ini. Rehatlah dalam kedamaian dan kehangatan tempat tidur Anda.'
  }
];

export const LegaSadness: React.FC<LegaSadnessProps> = ({
  onSelectModule,
  onAddJournal,
}) => {
  const [activeTab, setActiveTab] = useState<'education' | 'deep-sadness' | 'reflection' | 'audio' | 'professional'>('education');

  // Form states (V2.0 Refleksi 6 Pertanyaan)
  const [sadnessReason, setSadnessReason] = useState<string>('');
  const [sinceWhen, setSinceWhen] = useState<string>('');
  const [missedOrHoped, setMissedOrHoped] = useState<string>('');
  const [currentNeeds, setCurrentNeeds] = useState<string>('');
  const [supportPerson, setSupportPerson] = useState<string>('');
  const [selfKindnessAct, setSelfKindnessAct] = useState<string>('');

  // 4 Domains
  const [selectedThought, setSelectedThought] = useState<string[]>([]);
  const [selectedEmotional, setSelectedEmotional] = useState<string[]>([]);
  const [selectedPhysical, setSelectedPhysical] = useState<string[]>([]);
  const [selectedBehavioral, setSelectedBehavioral] = useState<string[]>([]);

  // Flags
  const [isDeepSadness, setIsDeepSadness] = useState<boolean>(false);
  const [isCrisisRisk, setIsCrisisRisk] = useState<boolean>(false);

  // Deep Sadness Micro-Step Counter
  const [deepSadnessStep, setDeepSadnessStep] = useState<number>(1);

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

    const result = await reflectSadness({
      sadnessReason,
      sinceWhen,
      missedOrHoped,
      currentNeeds,
      supportPerson,
      selfKindnessAct,
      thoughtSymptoms: selectedThought,
      emotionalSymptoms: selectedEmotional,
      bodySymptoms: selectedPhysical,
      behaviorSymptoms: selectedBehavioral,
      isDeepSadness,
      isCrisisRisk
    });

    setReflectionResult(result);
    setIsLoading(false);
  };

  const handleSaveToJournal = () => {
    if (!onAddJournal || !reflectionResult) return;

    const content = `=== REFLEKSI LEGA SADNESS (V2.0) ===
Alasan / Kejadian: ${sadnessReason || '-'}
Dirasakan Sejak: ${sinceWhen || '-'}
Yang Dirindukan / Diharapkan: ${missedOrHoped || '-'}

Dampak Yang Dirasakan (4 Ranah):
- Pikiran: ${selectedThought.join(', ') || '-'}
- Emosi: ${selectedEmotional.join(', ') || '-'}
- Tubuh: ${selectedPhysical.join(', ') || '-'}
- Perilaku: ${selectedBehavioral.join(', ') || '-'}

Kebutuhan Batin Saat Ini: ${currentNeeds || '-'}
Bentuk Kebaikan Diri Hari Ini: ${selfKindnessAct || '-'}

Sintesis & Insight AI:
${reflectionResult.summary || '-'}

Penerimaan Emosi & Langkah Kecil:
${reflectionResult.reflectiveInsights?.emotionalAcceptance || '-'}
Langkah Kecil: ${reflectionResult.reflectiveInsights?.gentleNextStep || '-'}`;

    onAddJournal({
      title: 'Refleksi LEGA Sadness V2.0',
      content,
      mood: 'sedih',
      tags: ['Sadness', 'Sedih', 'BelasKasihDiri', 'Penerimaan', 'Pemulihan']
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

    const track = SADNESS_AUDIO_TRACKS[index];
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-blue-950/60 via-slate-900 to-indigo-950/50 border border-blue-800/40 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <CloudRain className="w-48 h-48 text-blue-400" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold tracking-wide uppercase">
            <CloudRain className="w-3.5 h-3.5" />
            LEGA Sadness • Version 2.0
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-100">
            Kesadaran & Pemulihan Emosi Sedih
          </h1>
          <p className="text-sm md:text-base text-stone-300 leading-relaxed max-w-2xl">
            Memahami kesedihan sebagai respon alami pengalaman hidup, merawat rasa berat di tubuh dan pikiran, serta melatih penerimaan diri secara bertahap.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-stone-400">
            <VoiceGuideButton
              text="Selamat datang di modul LEGA Sadness. Kesedihan adalah bukti bahwa Anda adalah manusia yang memiliki hati dan kepedulian mendalam. Berikan ruang bagi air mata atau rasa hampa Anda, rangkul diri Anda dengan kehangatan tanpa penghakiman."
              title="Panduan LEGA Sadness"
              subtitle="Kesadaran & Pemulihan Emosi Sedih"
              variant="pill"
            />
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-blue-400" /> Emosi Alami • Bukan Kelemahan
            </span>
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-400" /> Respon 4 Ranah
            </span>
            <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60 flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-blue-400" /> Belas Kasih Diri
            </span>
          </div>
        </div>
      </div>

      {/* Filosofi LEGA Sadness Card */}
      <div className="bg-stone-900/90 border border-blue-500/30 rounded-2xl p-5 md:p-6 shadow-md space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
          <Compass className="w-4 h-4" /> Filosofi LEGA Sadness
        </span>
        <blockquote className="text-sm md:text-base text-stone-200 font-medium italic leading-relaxed border-l-2 border-blue-500 pl-4 py-1">
          "Kesedihan tidak harus ditolak. Kesedihan tidak harus disembunyikan. Kesedihan tidak harus segera hilang. Kesedihan dapat menjadi bagian dari proses beradaptasi terhadap perubahan atau kehilangan. Dengan menyadari dan memahami pengalaman tersebut, Anda dapat mengambil langkah yang lebih sehat."
        </blockquote>
      </div>

      {/* Emergency Crisis Alert if Crisis Expressed */}
      {isCrisisRisk && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-blue-950/90 border-2 border-blue-600 rounded-2xl p-6 text-stone-100 space-y-4 shadow-2xl"
        >
          <div className="flex items-center gap-3 text-blue-300 font-bold text-lg border-b border-blue-800 pb-3">
            <PhoneCall className="w-6 h-6 animate-pulse text-blue-400" />
            DUKUNGAN KRISIS & KESELAMATAN JIWA
          </div>
          <p className="text-sm leading-relaxed text-stone-200">
            Perasaan terpuruk yang Anda alami sangat berharga untuk didengar oleh tenaga profesional atau sosok terdekat. Jika muncul perasaan bahwa hidup tidak sanggup dilanjutkan atau ada keinginan menyakiti diri, mohon beristirahat sejenak dan hubungi dukungan krisis darurat.
          </p>
          <div className="bg-stone-900/90 border border-blue-800/80 p-4 rounded-xl space-y-2 text-xs md:text-sm">
            <span className="font-bold text-blue-300 block">Layanan Darurat & Pendampingan Jiwa:</span>
            <ul className="space-y-1 text-stone-300">
              <li>• <strong>Layanan Sehat Jiwa Kemenkes RI:</strong> Call Center 119 (Tekan 8)</li>
              <li>• <strong>Into The Light Indonesia (Pencegahan Bunuh Diri):</strong> www.intothelightid.org</li>
              <li>• <strong>Kontak Darurat Nasional:</strong> 112 / 118</li>
              <li>• Hubungi keluarga, teman terdekat, atau profesional kesehatan mental di sekitar Anda.</li>
            </ul>
          </div>
          <p className="text-xs text-blue-300 italic">
            *Latihan refleksi dinonaktifkan demi keselamatan. Jiwa dan keberadaan Anda sangat berarti.
          </p>
        </motion.div>
      )}

      {/* Main Tab Navigation */}
      <div className="flex border-b border-stone-800 overflow-x-auto no-scrollbar gap-2">
        <button
          onClick={() => setActiveTab('education')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'education'
              ? 'border-blue-500 text-blue-300 bg-blue-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Edukasi Kesedihan
        </button>
        <button
          onClick={() => setActiveTab('deep-sadness')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'deep-sadness'
              ? 'border-blue-500 text-blue-300 bg-blue-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Feather className="w-4 h-4" /> Mode Sangat Terpuruk
        </button>
        <button
          onClick={() => setActiveTab('reflection')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'reflection'
              ? 'border-blue-500 text-blue-300 bg-blue-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Refleksi 6 Pertanyaan AI
        </button>
        <button
          onClick={() => setActiveTab('audio')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'audio'
              ? 'border-blue-500 text-blue-300 bg-blue-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Volume2 className="w-4 h-4" /> Audio LEGA Sadness
        </button>
        <button
          onClick={() => setActiveTab('professional')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'professional'
              ? 'border-blue-500 text-blue-300 bg-blue-500/10 rounded-t-lg'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <PhoneCall className="w-4 h-4" /> Bantuan & Krisis
        </button>
      </div>

      {/* TAB 1: EDUKASI KESEDIHAN */}
      {activeTab === 'education' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Hakikat Kesedihan */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-lg">
            <h2 className="text-xl font-bold text-stone-100 flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-blue-400" /> Memahami Hakikat Emosi Sedih
            </h2>
            <p className="text-stone-300 text-sm md:text-base leading-relaxed">
              Kesedihan adalah salah satu emosi dasar manusia yang sangat alami. Kesedihan bukanlah tanda kelemahan, cacat kepribadian, atau kegagalan. Kesedihan adalah bukti bahwa kita peduli pada hal-hal bermakna dalam hidup.
            </p>
            <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl space-y-2 text-xs md:text-sm text-stone-300">
              <span className="font-bold text-blue-300 block">Penyebab Umum Kesedihan Muncul:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <span>• Kehilangan sosok / kesempatan</span>
                <span>• Perpisahan & perenggangan hubungan</span>
                <span>• Kekecewaan & penolakan</span>
                <span>• Perubahan alur hidup yang tak terduga</span>
                <span>• Harapan yang belum terwujud</span>
                <span>• Kesepian & empati terhadap penderitaan</span>
              </div>
            </div>
          </div>

          {/* Respon Kesedihan 4 Ranah */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-stone-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" /> Respon Kesedihan Dalam 4 Ranah
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
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4" /> Emosi
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

          {/* Penerimaan Emosi & Belas Kasih Diri */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-lg">
            <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
              <Feather className="w-5 h-5 text-blue-400" /> Penerimaan Emosi & Belas Kasih Diri
            </h3>
            <p className="text-xs md:text-sm text-stone-300 leading-relaxed">
              LEGA Sadness tidak memaksa Anda untuk segera "move-on" atau berpura-pura bahagia. Pemulihan batin dimulai dari mengakui keberadaan rasa sedih dengan kelembutan.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-stone-950/60 border border-stone-800 p-3 rounded-xl space-y-1">
                <span className="font-bold text-blue-300 block">1. Beri Ruang Tanpa Syarat</span>
                <p className="text-stone-400">Izinkan air mata menetes atau tubuh beristirahat tanpa menghakimi diri.</p>
              </div>
              <div className="bg-stone-950/60 border border-stone-800 p-3 rounded-xl space-y-1">
                <span className="font-bold text-blue-300 block">2. Ucapkan Bahasa Kasih</span>
                <p className="text-stone-400">Gunakan kata-kata lembut kepada diri sendiri sebagaimana kepada sahabat.</p>
              </div>
              <div className="bg-stone-950/60 border border-stone-800 p-3 rounded-xl space-y-1">
                <span className="font-bold text-blue-300 block">3. Atur Ritme Istirahat</span>
                <p className="text-stone-400">Kurangi beban fisik dan mental yang terlalu berat untuk sementara waktu.</p>
              </div>
              <div className="bg-stone-950/60 border border-stone-800 p-3 rounded-xl space-y-1">
                <span className="font-bold text-blue-300 block">4. Temukan Pendamping Warm</span>
                <p className="text-stone-400">Berbagilah dengan sosok terpercaya yang mau mendengarkan tanpa menghakimi.</p>
              </div>
              <div className="bg-stone-950/60 border border-stone-800 p-3 rounded-xl space-y-1">
                <span className="font-bold text-blue-300 block">5. Lakukan Kebaikan Kecil</span>
                <p className="text-stone-400">Minum air hangat, memeluk bantal, atau berjalan santai di bawah sinar matahari.</p>
              </div>
              <div className="bg-stone-950/60 border border-stone-800 p-3 rounded-xl space-y-1">
                <span className="font-bold text-blue-300 block">6. Hargai Proses Waktu</span>
                <p className="text-stone-400">Penyembuhan bukanlah garis lurus; gelombang naik-turun emosi adalah hal alami.</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 2: MODE SANGAT TERPURUK (DEEP SADNESS) */}
      {activeTab === 'deep-sadness' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-blue-800/60 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl"
        >
          <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-lg">
              <Feather className="w-6 h-6 animate-pulse" /> Ruang Teduh Saat Sangat Terpuruk
            </div>
            <span className="text-xs bg-blue-500/10 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full">
              Penerimaan & Depekan Kasih
            </span>
          </div>

          <div className="bg-stone-950/80 border border-blue-900/50 p-4 rounded-xl text-stone-200 text-sm md:text-base leading-relaxed space-y-2">
            <p className="font-bold text-blue-300">
              "Jika hari ini terasa sangat berat untuk dialami:"
            </p>
            <p className="text-xs md:text-sm text-stone-300">
              Anda tidak perlu menjawab banyak pertanyaan atau memaksakan diri tersenyum. Izinkan diri Anda beristirahat di ruang teduh ini.
            </p>
          </div>

          {/* Interactive Gentle Steps */}
          <div className="bg-stone-950/90 border border-stone-800 rounded-xl p-6 text-center space-y-6">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
              Langkah Kelembutan {deepSadnessStep} dari 4
            </span>

            {deepSadnessStep === 1 && (
              <div className="space-y-3 py-4">
                <Coffee className="w-16 h-16 text-amber-400 mx-auto" />
                <h4 className="text-xl font-bold text-stone-100">1. Istirahatkan Semua Beban</h4>
                <p className="text-sm text-stone-300 max-w-md mx-auto">
                  Rebahkan tubuh Anda dengan nyaman. Lepaskan semua tuntutan untuk menjadi kuat atau menyelesaikan tugas hari ini.
                </p>
              </div>
            )}

            {deepSadnessStep === 2 && (
              <div className="space-y-3 py-4">
                <Heart className="w-16 h-16 text-rose-400 mx-auto animate-pulse" />
                <h4 className="text-xl font-bold text-stone-100">2. Dekap Diri Sendiri</h4>
                <p className="text-sm text-stone-300 max-w-md mx-auto">
                  Silangkan kedua tangan di atas dada Anda. Berikan pelukan lembut pada diri sendiri dan biarkan napas mengalir pelan.
                </p>
              </div>
            )}

            {deepSadnessStep === 3 && (
              <div className="space-y-3 py-4">
                <CloudRain className="w-16 h-16 text-blue-400 mx-auto" />
                <h4 className="text-xl font-bold text-stone-100">3. Validasi Air Mata</h4>
                <p className="text-sm text-stone-300 max-w-md mx-auto">
                  Jika air mata menetes, biarkan ia mengalir. Menangis adalah cara alami tubuh melepaskan hawa ketegangan batin.
                </p>
              </div>
            )}

            {deepSadnessStep === 4 && (
              <div className="space-y-3 py-4">
                <Sun className="w-16 h-16 text-amber-300 mx-auto" />
                <h4 className="text-xl font-bold text-stone-100">4. Berikan Satu Kebaikan Kecil</h4>
                <p className="text-sm text-stone-300 max-w-md mx-auto">
                  Minumlah segelas air hangat atau cuci muka dengan air sejuk. Langkah terkecil Anda hari ini sangat berarti.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-stone-800">
              <button
                disabled={deepSadnessStep === 1}
                onClick={() => setDeepSadnessStep((prev) => Math.max(1, prev - 1))}
                className="text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 px-4 py-2 rounded-xl disabled:opacity-40 transition"
              >
                Kembali
              </button>

              <button
                onClick={() => {
                  if (deepSadnessStep < 4) {
                    setDeepSadnessStep((prev) => prev + 1);
                  } else {
                    setActiveTab('reflection');
                    setIsDeepSadness(true);
                  }
                }}
                className="text-xs bg-blue-600 hover:bg-blue-500 text-stone-950 font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-1.5"
              >
                {deepSadnessStep < 4 ? 'Langkah Berikutnya' : 'Lanjut Ke Refleksi Lembut AI'} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 3: REFLEKSI 6 PERTANYAAN AI */}
      {activeTab === 'reflection' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {!isCrisisRisk && (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg">
              <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-lg">
                  <Sparkles className="w-5 h-5" /> 6 Pertanyaan Reflektif LEGA Sadness
                </div>
                <span className="text-xs text-stone-400">Refleksi Belas Kasih Terpandu</span>
              </div>

              {/* Q1: Sadness Reason */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-200 block">
                  1. Apa yang membuat Anda merasa sedih saat ini?
                </label>
                <textarea
                  value={sadnessReason}
                  onChange={(e) => setSadnessReason(e.target.value)}
                  rows={3}
                  placeholder="Ceritakan kejadian, rasa kehilangan, kekecewaan, atau peristiwa yang membebankan batin Anda..."
                  className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3.5 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-blue-500/80"
                />
              </div>

              {/* Q2: Since When */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-200 block">
                  2. Sejak kapan perasaan ini mulai muncul?
                </label>
                <input
                  type="text"
                  value={sinceWhen}
                  onChange={(e) => setSinceWhen(e.target.value)}
                  placeholder="Misal: Sejak tadi pagi, beberapa hari lalu, atau sejak peristiwa tertentu..."
                  className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-blue-500/80"
                />
              </div>

              {/* Q3: Missed or Hoped */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-200 block">
                  3. Apa yang paling Anda rindukan atau harapkan saat ini?
                </label>
                <input
                  type="text"
                  value={missedOrHoped}
                  onChange={(e) => setMissedOrHoped(e.target.value)}
                  placeholder="Misal: Kehadiran seseorang, suasana tenang, atau penerimaan terhadap situasi..."
                  className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-blue-500/80"
                />
              </div>

              {/* Q4 & Q5: Current Needs & Support Person */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-stone-800">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block">
                    4. Apa kebutuhan Anda saat ini?
                  </label>
                  <input
                    type="text"
                    value={currentNeeds}
                    onChange={(e) => setCurrentNeeds(e.target.value)}
                    placeholder="Misal: Istirahat, tempat bercerita, ketenangan batin..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-blue-500/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-blue-300 uppercase tracking-wider block">
                    5. Siapa yang dapat memberikan dukungan?
                  </label>
                  <input
                    type="text"
                    value={supportPerson}
                    onChange={(e) => setSupportPerson(e.target.value)}
                    placeholder="Misal: Sahabat terdekat, pasangan, keluarga, atau diri sendiri..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-blue-500/80"
                  />
                </div>
              </div>

              {/* Q6: Self Kindness Act */}
              <div className="space-y-1.5 pt-2 border-t border-stone-800">
                <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                  6. Apa satu bentuk kebaikan yang dapat Anda berikan kepada diri sendiri hari ini?
                </label>
                <input
                  type="text"
                  value={selfKindnessAct}
                  onChange={(e) => setSelfKindnessAct(e.target.value)}
                  placeholder="Misal: Minum teh hangat, tidur lebih awal, tidak menyalahkan diri..."
                  className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-blue-500/80"
                />
              </div>

              {/* 4 Domains Symptoms Checklist */}
              <div className="space-y-4 pt-2 border-t border-stone-800">
                <label className="text-sm font-bold text-blue-300 block">
                  Dampak yang dirasakan pada tubuh, pikiran, emosi & perilaku:
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
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">Emosi Menyertai</span>
                    <div className="flex flex-wrap gap-1.5">
                      {EMOTIONAL_RESPONSES.map((item) => {
                        const active = selectedEmotional.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleArrayItem(item, selectedEmotional, setSelectedEmotional)}
                            className={`px-2.5 py-1 rounded-md border text-[11px] ${
                              active ? 'bg-blue-500/20 border-blue-500 text-blue-200 font-semibold' : 'bg-stone-950/40 border-stone-800 text-stone-400'
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
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Perilaku</span>
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

              {/* Checkboxes */}
              <div className="space-y-3 pt-2 border-t border-stone-800">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="deepSadnessCheck"
                    checked={isDeepSadness}
                    onChange={(e) => setIsDeepSadness(e.target.checked)}
                    className="rounded border-stone-700 bg-stone-900 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="deepSadnessCheck" className="text-xs text-stone-300 cursor-pointer font-medium">
                    Saya sedang merasa sangat terpuruk / lelah emosional (butuh respon sangat lembut & sederhana)
                  </label>
                </div>

                <div className="flex items-center gap-2 bg-blue-950/40 p-3 rounded-xl border border-blue-900/60">
                  <input
                    type="checkbox"
                    id="crisisCheck"
                    checked={isCrisisRisk}
                    onChange={(e) => setIsCrisisRisk(e.target.checked)}
                    className="rounded border-blue-700 bg-stone-900 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="crisisCheck" className="text-xs text-blue-300 cursor-pointer font-bold">
                    [PENTING] Muncul dorongan menyakiti diri atau merasa hidup tidak layak dilanjutkan
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleProcessReflection}
                  className="bg-blue-600 hover:bg-blue-500 text-stone-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg"
                >
                  Proses Refleksi & Insight AI <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Output Card */}
          {isLoading ? (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center space-y-4 shadow-xl">
              <Sparkles className="w-10 h-10 text-blue-400 animate-spin mx-auto" />
              <h3 className="text-lg font-bold text-stone-200">Merangkul Rasa Sedih...</h3>
              <p className="text-sm text-stone-400 max-w-md mx-auto">
                LEGA AI sedang menyusun pesan empati dan menenangkan pikiran Anda dengan belas kasih.
              </p>
            </div>
          ) : reflectionResult && !isCrisisRisk ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-stone-900 border border-blue-800/40 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-lg">
                    <CloudRain className="w-6 h-6" /> Hasil Sintesis LEGA Sadness
                  </div>
                  <span className="text-xs bg-blue-500/10 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full">
                    Sintesis Empatik AI
                  </span>
                </div>

                <div className="space-y-4 text-stone-200 leading-relaxed text-sm md:text-base">
                  <p className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl text-stone-300 italic">
                    "{reflectionResult.summary}"
                  </p>

                  {/* Identified Causes & Dominant */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-stone-950/50 border border-stone-800 p-4 rounded-xl space-y-1">
                      <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Zap className="w-4 h-4" /> Penyebab Utama:
                      </h4>
                      <p className="text-xs text-stone-300">
                        {reflectionResult.identifiedCauses?.join(', ') || sadnessReason || 'Pengalaman kehilangan / kekecewaan'}
                      </p>
                    </div>

                    <div className="bg-stone-950/50 border border-stone-800 p-4 rounded-xl space-y-1">
                      <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <HeartPulse className="w-4 h-4" /> Emosi Dominan:
                      </h4>
                      <p className="text-xs text-stone-300">
                        {reflectionResult.dominantEmotions?.join(', ') || 'Sedih, Hampa, atau Rindu'}
                      </p>
                    </div>
                  </div>

                  {/* Perceived Needs & Self Kindness */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reflectionResult.perceivedNeeds && (
                      <div className="bg-stone-950/50 border border-blue-900/40 p-4 rounded-xl space-y-1">
                        <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Compass className="w-4 h-4" /> Kebutuhan Batin Saat Ini:
                        </h4>
                        <p className="text-xs text-stone-200 leading-relaxed">
                          {reflectionResult.perceivedNeeds}
                        </p>
                      </div>
                    )}

                    {reflectionResult.selfKindnessAct && (
                      <div className="bg-stone-950/50 border border-amber-900/40 p-4 rounded-xl space-y-1">
                        <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Feather className="w-4 h-4" /> Kebaikan Untuk Diri Hari Ini:
                        </h4>
                        <p className="text-xs text-stone-200 leading-relaxed font-medium">
                          {reflectionResult.selfKindnessAct}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Reflective Insights */}
                  {reflectionResult.reflectiveInsights && (
                    <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl space-y-2">
                      <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Shield className="w-4 h-4" /> Penerimaan & Langkah Kecil Ke Depan:
                      </h4>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        {reflectionResult.reflectiveInsights.emotionalAcceptance}
                      </p>
                      <p className="text-xs text-emerald-300 font-semibold border-t border-stone-800 pt-2 mt-2">
                        • Langkah Kecil: {reflectionResult.reflectiveInsights.gentleNextStep}
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
                            className="bg-stone-950 border border-stone-800 hover:border-blue-500/50 p-3 rounded-xl text-left space-y-1 transition group"
                          >
                            <span className="text-xs font-bold text-blue-300 group-hover:text-blue-200 flex items-center justify-between">
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
                      className="bg-blue-600 hover:bg-blue-500 disabled:bg-stone-800 text-stone-950 disabled:text-stone-500 font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition"
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

      {/* TAB 4: AUDIO LEGA SADNESS */}
      {activeTab === 'audio' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-lg">
            <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-blue-400" /> Audio Panduan LEGA Sadness
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Narasi audio dinamis Bahasa Indonesia untuk menemani kesedihan dan merawat batin.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SADNESS_AUDIO_TRACKS.map((track, index) => {
                const isPlaying = playingTrackIndex === index;
                return (
                  <div
                    key={index}
                    className={`border rounded-xl p-4 space-y-3 transition-all ${
                      isPlaying
                        ? 'bg-blue-950/40 border-blue-500/60 shadow-md'
                        : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-blue-300 block">
                          {track.title}
                        </span>
                        <p className="text-xs text-stone-400 leading-relaxed">
                          {track.description}
                        </p>
                      </div>
                      <span className="text-[10px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" /> {track.duration}
                      </span>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-stone-800/60">
                      <button
                        disabled={isAudioLoading && playingTrackIndex === index}
                        onClick={() => handlePlayAudioTrack(index)}
                        className={`text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                          isPlaying
                            ? 'bg-blue-500 text-stone-950'
                            : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                        }`}
                      >
                        {isAudioLoading && playingTrackIndex === index ? (
                          <>
                            <Sparkles className="w-3.5 h-3.5 animate-spin" /> Mengurai TTS...
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

                      <span className="text-[11px] text-stone-500 italic">Gemini Voice • Kore</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 5: BANTUAN & LAYANAN DARURAT */}
      {activeTab === 'professional' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg"
        >
          <div className="border-b border-stone-800 pb-4">
            <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-blue-400" /> Informasi Bantuan Profesional & Layanan Darurat
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              LEGA Sadness adalah sarana edukasi dan refleksi diri. Apabila rasa sedih berlangsung sangat lama, terasa semakin berat, atau mengganggu fungsi aktivitas harian, mohon berkonsultasi dengan profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-stone-950/80 border border-stone-800 p-4 rounded-xl space-y-2">
              <span className="font-bold text-blue-300 block text-sm">
                Layanan Sehat Jiwa Kemenkes RI
              </span>
              <p className="text-stone-300">
                Layanan resmi konseling dan bantuan kesehatan jiwa dari Kementerian Kesehatan Republik Indonesia.
              </p>
              <div className="bg-stone-900 p-2.5 rounded-lg border border-stone-800 text-stone-200 font-mono">
                Call Center: 119 (Tekan 8)
              </div>
            </div>

            <div className="bg-stone-950/80 border border-stone-800 p-4 rounded-xl space-y-2">
              <span className="font-bold text-blue-300 block text-sm">
                Into The Light Indonesia
              </span>
              <p className="text-stone-300">
                Komunitas pencegahan bunuh diri dan edukasi kesehatan mental inklusif di Indonesia.
              </p>
              <div className="bg-stone-900 p-2.5 rounded-lg border border-stone-800 text-stone-200 font-mono">
                Situs: www.intothelightid.org
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
