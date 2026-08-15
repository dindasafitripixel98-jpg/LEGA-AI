import React, { useState, useEffect } from 'react';
import {
  GitFork,
  BrainCircuit,
  Eye,
  Activity,
  Heart,
  Flame,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Layers,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Compass,
  Volume2,
  Wind,
  Shield,
  Smile,
  Zap,
  RefreshCw,
  Sliders,
  ChevronRight,
  Info,
  CheckSquare,
  Sparkle
} from 'lucide-react';
import { ModuleType, JournalEntry, PatternAwarenessData, PatternAnalysisResult, EmotionCategory } from '../types';
import { analyzePatternAwareness } from '../lib/geminiApi';
import { VoiceGuideButton } from './VoiceGuideButton';
import { playCalmMeditationChime } from '../lib/audioEngine';

interface LegaPatternAwarenessProps {
  onSelectModule?: (module: ModuleType | string) => void;
  onAddJournal?: (entry: JournalEntry) => void;
  onOpenCrisis?: () => void;
}

const PRESET_SCENARIOS = [
  {
    id: 'pesan-tidak-dibalas',
    title: '📱 Pesan Tidak Kunjung Dibalas',
    category: 'Hubungan & Komunikasi',
    event: 'Seseorang yang penting tidak membalas pesan saya selama berjam-jam meskipun terlihat online.',
    impactfulPart: 'Perasaan diabaikan dan tidak dianggap prioritas.',
    factVsInterpretation: 'Fakta: Pesan belum dibalas. Interpretasi: Dia sengaja menghindar dan tidak menghargai saya.',
    thought: 'Dia tidak menghargai saya dan hubungan ini tidak penting baginya.',
    selfTalk: 'Kenapa saya selalu diperlakukan seperti ini? Lebih baik saya tidak usah menghubunginya lagi.',
    emotions: ['Kecewa', 'Cemas', 'Marah'],
    bodySensations: ['Dada Terasa Berat & Sesak', 'Ketegangan di Bahu & Leher'],
    bodyLocation: 'Dada & Leher',
    impulses: ['Ingin menarik diri & berhenti membalas', 'Ingin mengirim pesan menyindir'],
    response: 'Mendiamkan orang tersebut berhari-hari dan bersikap dingin ketika dia akhirnya membalas.',
    consequences: 'Hubungan menjadi renggang, suasana canggung, dan saya tetap merasa cemas.',
    hasSimilarPast: 'ya' as const,
    pastSimilarExperience: 'Pernah terjadi dengan teman dekat tahun lalu ketika ada perbedaan kesibukan.',
    underlyingNeeds: {
      expected: 'Kepastian kabar dan perhatian yang konsisten.',
      needed: 'Rasa aman emosional dan dihargai dalam hubungan.',
      feared: 'Ditinggalkan, diabaikan, atau tidak dianggap berharga.',
      protecting: 'Harga diri agar tidak terlihat terlalu membutuhkan.',
      avoiding: 'Rasa sakit akibat penolakan.'
    },
    learning: 'Saya cenderung menyimpulkan motif buruk orang lain terlalu cepat saat cemas melanda.',
    newResponseChoices: [
      'Memberi jeda napas 3 kali sebelum berasumsi',
      'Mengingat bahwa kesibukan orang lain bukan penolakan terhadap saya',
      'Mengirim klarifikasi santai atau melanjutkan aktivitas pribadi'
    ]
  },
  {
    id: 'kritik-pekerjaan',
    title: '💼 Menerima Kritik / Masukan di Tempat Kerja',
    category: 'Pekerjaan & Kinerja',
    event: 'Atasan atau rekan kerja memberikan revisi banyak dan kritik terhadap laporan yang sudah saya kerjakan seharian.',
    impactfulPart: 'Komentar bahwa analisis saya belum cukup tajam di hadapan tim.',
    factVsInterpretation: 'Fakta: Dokumen memerlukan revisi data. Interpretasi: Saya tidak kompeten dan gagal total.',
    thought: 'Saya tidak kompeten, semua kerja keras saya tidak dihargai, dan posisi saya terancam.',
    selfTalk: 'Saya memang tidak pantas di pekerjaan ini, orang lain jauh lebih pintar.',
    emotions: ['Malu', 'Takut', 'Kecewa', 'Sedih'],
    bodySensations: ['Sensasi Panas di Wajah & Telinga', 'Perut Terasa Mual / Tegang'],
    bodyLocation: 'Wajah & Perut',
    impulses: ['Ingin segera membela diri & berdebat', 'Ingin menghindar dari rapat berikutnya'],
    response: 'Mengiyakan dengan nada ketus, lalu mengurung diri dan bekerja lembur berlebihan dengan rasa bersalah.',
    consequences: 'Tubuh sangat lelah, stres berlanjut, dan kehilangan motivasi kerja selama beberapa hari.',
    hasSimilarPast: 'ya' as const,
    pastSimilarExperience: 'Setiap kali menerima masukan evaluasi sejak masa kuliah selalu merasa diserang secara personal.',
    underlyingNeeds: {
      expected: 'Pujian atau pengakuan atas usaha keras yang sudah dilakukan.',
      needed: 'Rasa aman terhadap kompetensi diri dan lingkungan kerja yang mendukung.',
      feared: 'Dianggap tidak mampu atau dikeluarkan dari tim.',
      protecting: 'Identitas sebagai orang yang teliti dan dapat diandalkan.',
      avoiding: 'Rasa malu akibat terlihat berbuat salah.'
    },
    learning: 'Kritik terhadap pekerjaan adalah masukan teknis dokumen, bukan vonis atas nilai kemanusiaan saya.',
    newResponseChoices: [
      'Memisahkan identitas diri dari dokumen kerja',
      'Mencatat poin masukan secara objektif sebagai daftar perbaikan',
      'Meminta waktu 10 menit untuk menenangkan diri sebelum merevisi'
    ]
  },
  {
    id: 'konflik-keluarga',
    title: '🏡 Perbedaan Pendapat dengan Keluarga / Pasangan',
    category: 'Keluarga & Relasi Dekat',
    event: 'Pasangan atau anggota keluarga mengkritik cara saya mengatur waktu atau keuangan.',
    impactfulPart: 'Nada suara yang meninggi saat menyampaikan ketidaksetujuan.',
    factVsInterpretation: 'Fakta: Ada perbedaan sudut pandang pengeluaran. Interpretasi: Mereka meremehkan usaha saya.',
    thought: 'Mereka selalu menuntut dan tidak pernah melihat apa yang sudah saya korbankan.',
    selfTalk: 'Percuma bicara baik-baik, mereka tidak akan pernah mengerti sudut pandang saya.',
    emotions: ['Marah', 'Frustrasi', 'Kecewa'],
    bodySensations: ['Ketegangan di Rahang & Kepalan Tangan', 'Detak Jantung Meningkat Cepat'],
    bodyLocation: 'Rahang, Tangan & Jantung',
    impulses: ['Ingin membalas dengan ungkapan pedas', 'Ingin membanting pintu dan pergi'],
    response: 'Menaikkan nada bicara, mengungkit kesalahan masa lalu, lalu berdiam diri seharian (silent treatment).',
    consequences: 'Masalah inti keuangan tidak terselesaikan dan suasana rumah menjadi tegang berhari-hari.',
    hasSimilarPast: 'ya' as const,
    pastSimilarExperience: 'Pola perdebatan yang sama sering berulang setiap akhir bulan saat membahas anggaran.',
    underlyingNeeds: {
      expected: 'Apresiasi dan pengertian atas beban yang sedang saya pikul.',
      needed: 'Komunikasi yang saling menghormati dan ruang untuk didengarkan.',
      feared: 'Kehilangan kendali dan merasa diperlakukan tidak adil.',
      protecting: 'Rasa otonomi dan harga diri di dalam keluarga.',
      avoiding: 'Merasa lemah atau dipojokkan.'
    },
    learning: 'Silent treatment dan mengungkit masa lalu tidak pernah menyelesaikan masalah, hanya memperbesar luka.',
    newResponseChoices: [
      'Menyepakati jeda 15 menit ketika emosi mulai memanas',
      'Fokus hanya pada topik saat ini tanpa membawa masa lalu',
      'Mengungkapkan kebutuhan dengan kalimat "Saya merasa..." alih-alih menyerang'
    ]
  },
  {
    id: 'prokrastinasi-cemas',
    title: '⏳ Menunda Pekerjaan Penting (Prokrastinasi)',
    category: 'Kebiasaan & Produktivitas',
    event: 'Memiliki tenggat waktu proyek penting yang harus diselesaikan dalam 2 hari, namun terus membuka media sosial.',
    impactfulPart: 'Waktu terus berjalan sementara dokumen masih kosong.',
    factVsInterpretation: 'Fakta: Proyek belum selesai. Interpretasi: Hasil kerja saya pasti buruk jadi lebih baik tidak mulai sekarang.',
    thought: 'Proyek ini terlalu rumit, jika hasilnya tidak sempurna saya akan sangat malu.',
    selfTalk: 'Nanti saja saat suasana hati lebih baik. Sekarang saya belum siap.',
    emotions: ['Cemas', 'Bersalah', 'Gelisah'],
    bodySensations: ['Rasa Berat di Kepala', 'Napas Terasa Dangkal'],
    bodyLocation: 'Kepala & Dada',
    impulses: ['Ingin lari ke hiburan cepat (scrolling HP, nonton)'],
    response: 'Menunda pengerjaan hingga malam terakhir, lalu panik dan menyelesaikannya terburu-buru.',
    consequences: 'Kualitas kerja menurun, kurang tidur, dan rasa bersalah yang mendalam terhadap diri sendiri.',
    hasSimilarPast: 'ya' as const,
    pastSimilarExperience: 'Selalu menunda tugas-tugas besar sejak masa sekolah karena perfeksionisme.',
    underlyingNeeds: {
      expected: 'Hasil kerja yang langsung sempurna tanpa cela.',
      needed: 'Rasa aman bahwa hasil yang tidak sempurna tetap bernilai dan bisa diperbaiki.',
      feared: 'Menghadapi kegagalan atau ketidaksempurnaan.',
      protecting: 'Citra diri yang pintar dan perfeksionis.',
      avoiding: 'Ketidaknyamanan proses belajar dan evaluasi.'
    },
    learning: 'Menunda bukan karena malas, tetapi karena sistem saraf menghindari kecemasan akan kegagalan.',
    newResponseChoices: [
      'Memecah tugas menjadi langkah kecil 5 menit pertama',
      'Menerima bahwa draf awal boleh tidak sempurna',
      'Bernapas dan melepaskan standar perfeksionis yang mencekik'
    ]
  }
];

const EMOTIONS_LIST: string[] = [
  'Kecewa',
  'Marah',
  'Cemas',
  'Sedih',
  'Takut',
  'Malu',
  'Bersalah',
  'Frustrasi',
  'Iri',
  'Dendam',
  'Panik',
  'Kosong',
  'Lelah',
  'Gelisah',
  'Bingung',
  'Kesepian'
];

const SENSATIONS_LIST: string[] = [
  'Dada Terasa Berat & Sesak',
  'Ketegangan di Bahu & Leher',
  'Sensasi Panas di Wajah / Kepala',
  'Perut Terasa Mual / Kembung / Kram',
  'Rahang Rapat & Mengeras',
  'Kepalan Tangan Kaku',
  'Detak Jantung Berdegup Cepat',
  'Napas Terasa Dangkal & Cepat',
  'Sensasi Dingin di Telapak Tangan',
  'Tenggorokan Terasa Mengganjal'
];

const IMPULSES_LIST: string[] = [
  'Ingin membalas atau menyerang balik',
  'Ingin menarik diri & mengunci diri',
  'Ingin menangis tersedu-sedu',
  'Ingin diam membisu (silent treatment)',
  'Ingin menjelaskan diri panjang lebar',
  'Ingin menghindar dan pura-pura tidak terjadi apa-apa',
  'Ingin menyalahkan orang lain',
  'Ingin mengendalikan situasi secara kaku',
  'Ingin mencari hiburan pengalihan (scrolling/makan)'
];

const NEW_CHOICES_LIST: string[] = [
  'Berhenti sejenak & ambil 3 tarikan napas sadar',
  'Memisahkan fakta nyata kejadian dari asumsi pikiran',
  'Mengamati dan memvalidasi emosi tanpa langsung bereaksi',
  'Mengklarifikasi keadaan dengan komunikasi tenang dan asertif',
  'Menetapkan batasan pribadi yang sehat dan jelas',
  'Mengambil jeda/jarak yang sehat untuk menenangkan diri',
  'Meminta bantuan atau perspektif dari orang terpercaya',
  'Mengakui kebutuhan diri tanpa menuntut kesempurnaan'
];

const STEPS_NAV = [
  { step: 0, label: '1. Peristiwa', short: 'Peristiwa', icon: Info },
  { step: 1, label: '2. Pikiran', short: 'Pikiran', icon: BrainCircuit },
  { step: 2, label: '3. Emosi', short: 'Emosi', icon: Heart },
  { step: 3, label: '4. Sensasi Tubuh', short: 'Tubuh', icon: Activity },
  { step: 4, label: '5. Dorongan', short: 'Dorongan', icon: Zap },
  { step: 5, label: '6. Respons', short: 'Respons', icon: Sliders },
  { step: 6, label: '7. Akibat', short: 'Akibat', icon: AlertCircle },
  { step: 7, label: '8. Pola Serupa', short: 'Pola', icon: GitFork },
  { step: 8, label: '9. Gali Kebutuhan', short: 'Kebutuhan', icon: Compass },
  { step: 9, label: '10. Pembelajaran', short: 'Belajar', icon: Sparkles },
  { step: 10, label: '11. Respons Baru', short: 'Pilihan Baru', icon: CheckSquare },
  { step: 11, label: '12. Hadir Saat Ini', short: 'Grounding', icon: Wind }
];

export const LegaPatternAwareness: React.FC<LegaPatternAwarenessProps> = ({
  onSelectModule,
  onAddJournal,
  onOpenCrisis
}) => {
  const [activeTab, setActiveTab] = useState<'flow' | 'matrix' | 'scenarios' | 'grounding'>('flow');
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Form State
  const [event, setEvent] = useState<string>('');
  const [impactfulPart, setImpactfulPart] = useState<string>('');
  const [factVsInterpretation, setFactVsInterpretation] = useState<string>('');

  const [thought, setThought] = useState<string>('');
  const [selfTalk, setSelfTalk] = useState<string>('');

  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [customEmotion, setCustomEmotion] = useState<string>('');

  const [selectedSensations, setSelectedSensations] = useState<string[]>([]);
  const [bodyLocation, setBodyLocation] = useState<string>('');

  const [selectedImpulses, setSelectedImpulses] = useState<string[]>([]);
  const [customImpulse, setCustomImpulse] = useState<string>('');

  const [userResponse, setUserResponse] = useState<string>('');
  const [consequences, setConsequences] = useState<string>('');

  const [hasSimilarPast, setHasSimilarPast] = useState<'ya' | 'tidak' | 'mungkin'>('mungkin');
  const [pastSimilarExperience, setPastSimilarExperience] = useState<string>('');

  const [expectedNeed, setExpectedNeed] = useState<string>('');
  const [actualNeed, setActualNeed] = useState<string>('');
  const [fearedLoss, setFearedLoss] = useState<string>('');
  const [protectingWhat, setProtectingWhat] = useState<string>('');
  const [avoidingWhat, setAvoidingWhat] = useState<string>('');

  const [learning, setLearning] = useState<string>('');
  const [selectedNewChoices, setSelectedNewChoices] = useState<string[]>([]);
  const [customNewChoice, setCustomNewChoice] = useState<string>('');

  const [presentMomentNotes, setPresentMomentNotes] = useState<string>('');

  // AI Output State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<PatternAnalysisResult | null>(null);

  // Grounding Interactive Loop
  const [isGroundingActive, setIsGroundingActive] = useState<boolean>(false);
  const [groundingPhase, setGroundingPhase] = useState<'Tarik Napas' | 'Tahan Sejenak' | 'Hembuskan Perlahan'>('Tarik Napas');
  const [groundingSeconds, setGroundingSeconds] = useState<number>(0);
  const [isSavedToJournal, setIsSavedToJournal] = useState<boolean>(false);

  // Breathing loop timer
  useEffect(() => {
    let interval: any = null;
    if (isGroundingActive) {
      interval = setInterval(() => {
        setGroundingSeconds((prev) => {
          const next = prev + 1;
          const cycle = next % 12; // 4 in, 2 hold, 6 out
          if (cycle < 4) {
            setGroundingPhase('Tarik Napas');
          } else if (cycle < 6) {
            setGroundingPhase('Tahan Sejenak');
          } else {
            setGroundingPhase('Hembuskan Perlahan');
          }
          return next;
        });
      }, 1000);
    } else {
      setGroundingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isGroundingActive]);

  const handleApplyPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    setEvent(preset.event);
    setImpactfulPart(preset.impactfulPart);
    setFactVsInterpretation(preset.factVsInterpretation);
    setThought(preset.thought);
    setSelfTalk(preset.selfTalk);
    setSelectedEmotions(preset.emotions);
    setSelectedSensations(preset.bodySensations);
    setBodyLocation(preset.bodyLocation);
    setSelectedImpulses(preset.impulses);
    setUserResponse(preset.response);
    setConsequences(preset.consequences);
    setHasSimilarPast(preset.hasSimilarPast);
    setPastSimilarExperience(preset.pastSimilarExperience);
    setExpectedNeed(preset.underlyingNeeds.expected);
    setActualNeed(preset.underlyingNeeds.needed);
    setFearedLoss(preset.underlyingNeeds.feared);
    setProtectingWhat(preset.underlyingNeeds.protecting);
    setAvoidingWhat(preset.underlyingNeeds.avoiding);
    setLearning(preset.learning);
    setSelectedNewChoices(preset.newResponseChoices);
    setAnalysisResult(null);
    setIsSavedToJournal(false);
    setActiveTab('flow');
    setCurrentStep(0);
    playCalmMeditationChime();
  };

  const toggleItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleNextStep = () => {
    if (currentStep < STEPS_NAV.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRunAiAnalysis = async () => {
    setIsProcessing(true);
    playCalmMeditationChime();

    const patternPayload: PatternAwarenessData = {
      event: event || 'Pengalaman yang sedang diobservasi',
      impactfulPart,
      factVsInterpretation,
      thought: thought || 'Pikiran yang langsung muncul',
      selfTalk,
      emotions: selectedEmotions.length > 0 ? selectedEmotions : ['Kecewa', 'Cemas'],
      bodySensations: selectedSensations,
      bodyLocation,
      impulses: selectedImpulses,
      response: userResponse || 'Respons yang biasa diambil',
      consequences: consequences || 'Dampak yang dirasakan',
      hasSimilarPast,
      pastSimilarExperience,
      underlyingNeeds: {
        expected: expectedNeed,
        needed: actualNeed,
        feared: fearedLoss,
        protecting: protectingWhat,
        avoiding: avoidingWhat
      },
      learning,
      newResponseChoices: selectedNewChoices,
      presentMomentNotes
    };

    const result = await analyzePatternAwareness(patternPayload);
    setAnalysisResult(result);
    setIsProcessing(false);
  };

  const handleSaveToJournal = () => {
    if (!onAddJournal) return;
    const dateStr = new Date().toISOString().split('T')[0];
    const journalTitle = `Refleksi Pola: ${event.slice(0, 45) || 'Pengamatan Pola Reaksi'}...`;
    
    const entryContent = `
### 🌿 LEGA PATTERN AWARENESS — REFLEKSI POLA BERULANG
**Tanggal:** ${dateStr}
**Status Pola:** ${hasSimilarPast === 'ya' ? 'Pola Berulang Teridentifikasi' : hasSimilarPast === 'mungkin' ? 'Kemiripan Dinamika' : 'Pengalaman Baru'}

---
#### 1. Peristiwa & Fakta
- **Peristiwa:** ${event || '-'}
- **Bagian Paling Membekas:** ${impactfulPart || '-'}
- **Pembeda Fakta vs Interpretasi:** ${factVsInterpretation || '-'}

#### 2. Pikiran & Self-Talk
- **Pikiran Spontan:** ${thought || '-'}
- **Self-Talk:** ${selfTalk || '-'}

#### 3. Emosi & Sensasi Tubuh
- **Emosi:** ${selectedEmotions.join(', ') || '-'}
- **Sensasi Fisik:** ${selectedSensations.join(', ') || '-'} (${bodyLocation || 'Tubuh'})

#### 4. Dorongan & Respons
- **Dorongan Awal:** ${selectedImpulses.join(', ') || '-'}
- **Respons Nyata:** ${userResponse || '-'}
- **Akibat / Konsekuensi:** ${consequences || '-'}

#### 5. Eksplorasi Pola Serupa
- **Kemiripan Masa Lalu:** ${hasSimilarPast.toUpperCase()}
- **Catatan Pengalaman Sebelumnya:** ${pastSimilarExperience || '-'}

#### 6. Gali Kebutuhan & Perlindungan
- **Kebutuhan Sejati:** ${actualNeed || expectedNeed || '-'}
- **Yang Dilindungi:** ${protectingWhat || '-'}
- **Kekhawatiran:** ${fearedLoss || avoidingWhat || '-'}

#### 7. Pembelajaran & Pilihan Respons Baru
- **Pembelajaran Diri:** ${learning || '-'}
- **Pilihan Respons Sadar:**
${selectedNewChoices.map((c, i) => `  ${i + 1}. ${c}`).join('\n')}

#### 8. Hadir Saat Ini (Grounding)
${presentMomentNotes || 'Saat ini saya melepaskan kebutuhan menyelesaikan semuanya, hadir aman bersama napas di tubuh.'}
    `.trim();

    const moodCategory: EmotionCategory = (selectedEmotions[0]?.toLowerCase() as EmotionCategory) || 'lega';

    onAddJournal({
      id: `pattern-${Date.now()}`,
      title: journalTitle,
      content: entryContent,
      date: dateStr,
      mood: moodCategory,
      tags: ['Pattern Awareness', 'LEGA', 'Kesadaran Diri', 'Refleksi'],
      aiFeedback: analysisResult ? {
        reflection: analysisResult.summary,
        keyInsight: analysisResult.learningSummary,
        gentleSuggestion: analysisResult.groundingGuidance
      } : undefined
    });

    setIsSavedToJournal(true);
    playCalmMeditationChime();
  };

  const handleReset = () => {
    setEvent('');
    setImpactfulPart('');
    setFactVsInterpretation('');
    setThought('');
    setSelfTalk('');
    setSelectedEmotions([]);
    setSelectedSensations([]);
    setBodyLocation('');
    setSelectedImpulses([]);
    setUserResponse('');
    setConsequences('');
    setHasSimilarPast('mungkin');
    setPastSimilarExperience('');
    setExpectedNeed('');
    setActualNeed('');
    setFearedLoss('');
    setProtectingWhat('');
    setAvoidingWhat('');
    setLearning('');
    setSelectedNewChoices([]);
    setPresentMomentNotes('');
    setAnalysisResult(null);
    setIsSavedToJournal(false);
    setCurrentStep(0);
  };

  // Voice narration text generator for current step
  const getStepVoiceText = (): string => {
    switch (currentStep) {
      case 0:
        return "Tahap satu: Peristiwa. Amati apa yang sebenarnya terjadi. Bagian mana yang paling membekas? Bedakan antara kejadian nyata dan interpretasi pikiran Anda.";
      case 1:
        return "Tahap dua: Pikiran. Apa yang langsung terlintas di benak Anda saat kejadian? Apa yang Anda katakan kepada diri sendiri saat itu?";
      case 2:
        return "Tahap tiga: Emosi. Akui emosi yang benar-benar Anda rasakan tanpa perlu mengubahnya sepihak.";
      case 3:
        return "Tahap empat: Sensasi tubuh. Di bagian tubuh mana Anda merasakannya? Apakah terasa berat, tegang, atau sesak? Amati sebagai sensasi netral.";
      case 4:
        return "Tahap lima: Dorongan. Dorongan apa yang sempat muncul di dalam diri Anda saat itu?";
      case 5:
        return "Tahap enam: Respons. Apa yang akhirnya Anda lakukan setelah merasakan hal tersebut?";
      case 6:
        return "Tahap tujuh: Akibat. Apa yang terjadi setelah respons tersebut? Apakah respons itu membantu Anda?";
      case 7:
        return "Tahap delapan: Pengenalan pola. Apakah pengalaman serupa pernah terjadi sebelumnya? Mari kita amati kemiripannya tanpa menyalahkan siapa pun.";
      case 8:
        return "Tahap sembilan: Gali kebutuhan. Apa yang sebenarnya Anda butuhkan dan ingin Anda lindungi di balik situasi tersebut?";
      case 9:
        return "Tahap sepuluh: Pembelajaran. Apa yang baru Anda sadari tentang diri Anda dari pengalaman ini?";
      case 10:
        return "Tahap sebelas: Pilihan respons baru. Jika situasi serupa terjadi lagi, bagaimana Anda ingin merespons dengan lebih sadar?";
      case 11:
        return "Tahap dua belas: Hadir saat ini. Untuk beberapa saat, lepaskan kebutuhan menyelesaikan semuanya. Rasakan napas dan tubuh Anda yang aman di saat ini.";
      default:
        return "LEGA Pattern Awareness membantu Anda mengamati pola berulang dengan kesadaran dan pembelajaran yang utuh.";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-stone-100">
      {/* Module Banner / Header */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 md:p-8 mb-8 shadow-2xl relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 text-xs font-semibold tracking-wide uppercase">
              <GitFork className="w-3.5 h-3.5" />
              LEGA Pattern Awareness • SHAQILA DIGITAL 99
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              Kesadaran & Eksplorasi Pola Berulang
            </h1>
            <p className="text-sm md:text-base text-stone-300 max-w-3xl leading-relaxed">
              Membantu mengenali pola dalam pikiran, emosi, sensasi tubuh, perilaku, dan cara merespons pengalaman hidup. Pola bukan untuk menyalahkan diri atau orang lain, melainkan bahan pengamatan untuk memilih respons yang lebih sadar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <VoiceGuideButton
              text={analysisResult?.summary || getStepVoiceText()}
              label="Panduan Suara"
            />
            {onSelectModule && (
              <button
                onClick={() => onSelectModule('emotional-release')}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-xs font-medium transition flex items-center gap-2"
                title="Beri ruang pada emosi yang sangat kuat"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                Ruang Emosi (LEGA Release)
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 pt-6 border-t border-stone-800/80 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === 'flow'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40'
                : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            Alur Siklus Pola (12 Tahap)
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === 'matrix'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40'
                : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300'
            }`}
          >
            <GitFork className="w-4 h-4" />
            Matriks Perbandingan Pola
          </button>
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === 'scenarios'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40'
                : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Skenario Nyata Populer
          </button>
          <button
            onClick={() => setActiveTab('grounding')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === 'grounding'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40'
                : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300'
            }`}
          >
            <Wind className="w-4 h-4" />
            Latihan Hadir Saat Ini
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* TAB 1: 12-STEP CYCLE FLOW */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'flow' && (
        <div className="space-y-6">
          {/* Step Timeline Indicator */}
          <div className="bg-stone-900/70 border border-stone-800 rounded-2xl p-4 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[700px] gap-2">
              {STEPS_NAV.map((s, idx) => {
                const IconComponent = s.icon;
                const isCurrent = currentStep === idx;
                const isPassed = currentStep > idx;
                return (
                  <button
                    key={s.step}
                    onClick={() => setCurrentStep(idx)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl text-center transition flex-1 ${
                      isCurrent
                        ? 'bg-cyan-950/80 border border-cyan-500/60 text-cyan-300 font-semibold'
                        : isPassed
                        ? 'text-stone-300 hover:text-stone-100'
                        : 'text-stone-500 hover:text-stone-400'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                        isCurrent
                          ? 'bg-cyan-500 text-stone-950 font-bold'
                          : isPassed
                          ? 'bg-stone-800 text-cyan-400'
                          : 'bg-stone-800/50 text-stone-500'
                      }`}
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] whitespace-nowrap">{s.short}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Step Card */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 md:p-8 shadow-xl">
            {/* Step 0: PERISTIWA */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-cyan-300 font-bold">
                      1
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">1. Peristiwa (Apa yang Terjadi)</h2>
                      <p className="text-xs text-stone-400">Bantu melihat apa yang sebenarnya terjadi tanpa mengubah cerita.</p>
                    </div>
                  </div>
                  <span className="text-xs text-stone-500">Tahap 1 / 12</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-200 mb-2">
                      Apa yang sebenarnya terjadi?
                    </label>
                    <textarea
                      value={event}
                      onChange={(e) => setEvent(e.target.value)}
                      placeholder="Contoh: Seseorang membatalkan janji pertemuan secara mendadak melalui pesan singkat..."
                      rows={3}
                      className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-cyan-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-200 mb-2">
                      Bagian mana dari kejadian tersebut yang paling membekas bagi Anda?
                    </label>
                    <input
                      type="text"
                      value={impactfulPart}
                      onChange={(e) => setImpactfulPart(e.target.value)}
                      placeholder="Contoh: Alasan yang diberikan terasa singkat dan tidak ada permintaan maaf..."
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-cyan-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-200 mb-2">
                      Apakah Anda dapat membedakan antara kejadian yang benar-benar terjadi (Fakta) dan interpretasi Anda?
                    </label>
                    <textarea
                      value={factVsInterpretation}
                      onChange={(e) => setFactVsInterpretation(e.target.value)}
                      placeholder="Fakta: Janji dibatalkan 1 jam sebelumnya. Interpretasi: Dia tidak menganggap saya penting..."
                      rows={2}
                      className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-cyan-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: PIKIRAN */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-cyan-300 font-bold">
                      2
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">2. Pikiran & Self-Talk</h2>
                      <p className="text-xs text-stone-400">Mengenali pikiran yang langsung melintas. Pikiran bukan fakta mutlak.</p>
                    </div>
                  </div>
                  <span className="text-xs text-stone-500">Tahap 2 / 12</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-200 mb-2">
                      Apa yang langsung terlintas di pikiran Anda saat peristiwa itu terjadi?
                    </label>
                    <textarea
                      value={thought}
                      onChange={(e) => setThought(e.target.value)}
                      placeholder="Contoh: Dia sengaja menyepelekan saya, semua orang selalu memperlakukan saya seperti ini..."
                      rows={3}
                      className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-cyan-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-200 mb-2">
                      Apa yang Anda katakan kepada diri sendiri saat itu (Self-talk)?
                    </label>
                    <input
                      type="text"
                      value={selfTalk}
                      onChange={(e) => setSelfTalk(e.target.value)}
                      placeholder="Contoh: Lebih baik saya menarik diri dan tidak usah peduli lagi..."
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-cyan-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: EMOSI */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-cyan-300 font-bold">
                      3
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">3. Emosi yang Hadir</h2>
                      <p className="text-xs text-stone-400">Identifikasi emosi yang benar-benar Anda rasakan tanpa menghakimi.</p>
                    </div>
                  </div>
                  <span className="text-xs text-stone-500">Tahap 3 / 12</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-200 mb-3">
                    Pilih satu atau beberapa emosi yang hadir:
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {EMOTIONS_LIST.map((emo) => {
                      const isSelected = selectedEmotions.includes(emo);
                      return (
                        <button
                          key={emo}
                          onClick={() => toggleItem(selectedEmotions, setSelectedEmotions, emo)}
                          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition ${
                            isSelected
                              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950'
                              : 'bg-stone-950 border border-stone-800 text-stone-300 hover:border-stone-700'
                          }`}
                        >
                          {emo}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={customEmotion}
                      onChange={(e) => setCustomEmotion(e.target.value)}
                      placeholder="Emosi lain yang belum terdaftar di atas..."
                      className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      onClick={() => {
                        if (customEmotion.trim()) {
                          setSelectedEmotions([...selectedEmotions, customEmotion.trim()]);
                          setCustomEmotion('');
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200"
                    >
                      + Tambah
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: SENSASI TUBUH */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-cyan-300 font-bold">
                      4
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">4. Sensasi Tubuh (Somatis)</h2>
                      <p className="text-xs text-stone-400">Amati tubuh sebagai sinyal alami. Bukan merupakan diagnosis medis.</p>
                    </div>
                  </div>
                  <span className="text-xs text-stone-500">Tahap 4 / 12</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-200 mb-3">
                    Sensasi apa yang terasa di tubuh saat pengalaman ini berlangsung?
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {SENSATIONS_LIST.map((sens) => {
                      const isSelected = selectedSensations.includes(sens);
                      return (
                        <button
                          key={sens}
                          onClick={() => toggleItem(selectedSensations, setSelectedSensations, sens)}
                          className={`p-3 rounded-xl text-xs md:text-sm text-left font-medium transition flex items-center justify-between ${
                            isSelected
                              ? 'bg-cyan-950/80 border border-cyan-500/60 text-cyan-200'
                              : 'bg-stone-950 border border-stone-800 text-stone-300 hover:border-stone-700'
                          }`}
                        >
                          <span>{sens}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs font-medium text-stone-400 mb-1.5">
                      Lokasi spesifik di tubuh (opsional):
                    </label>
                    <input
                      type="text"
                      value={bodyLocation}
                      onChange={(e) => setBodyLocation(e.target.value)}
                      placeholder="Contoh: Di ulu hati, pangkal tenggorokan, atau pundak sebelah kiri..."
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: DORONGAN */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-cyan-300 font-bold">
                      5
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">5. Dorongan Spontan (Impulse)</h2>
                      <p className="text-xs text-stone-400">Dorongan adalah dorongan awal sebelum tindakan benar-benar diambil.</p>
                    </div>
                  </div>
                  <span className="text-xs text-stone-500">Tahap 5 / 12</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-200 mb-3">
                    Apa yang paling ingin Anda lakukan ketika rasa itu memuncak?
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {IMPULSES_LIST.map((imp) => {
                      const isSelected = selectedImpulses.includes(imp);
                      return (
                        <button
                          key={imp}
                          onClick={() => toggleItem(selectedImpulses, setSelectedImpulses, imp)}
                          className={`p-3 rounded-xl text-xs md:text-sm text-left font-medium transition flex items-center justify-between ${
                            isSelected
                              ? 'bg-cyan-950/80 border border-cyan-500/60 text-cyan-200'
                              : 'bg-stone-950 border border-stone-800 text-stone-300 hover:border-stone-700'
                          }`}
                        >
                          <span>{imp}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={customImpulse}
                      onChange={(e) => setCustomImpulse(e.target.value)}
                      placeholder="Dorongan lain..."
                      className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      onClick={() => {
                        if (customImpulse.trim()) {
                          setSelectedImpulses([...selectedImpulses, customImpulse.trim()]);
                          setCustomImpulse('');
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200"
                    >
                      + Tambah
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: RESPONS */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-cyan-300 font-bold">
                      6
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">6. Respons Nyata yang Diambil</h2>
                      <p className="text-xs text-stone-400">Apa yang biasanya atau akhirnya Anda lakukan setelah merasakan hal tersebut?</p>
                    </div>
                  </div>
                  <span className="text-xs text-stone-500">Tahap 6 / 12</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-200 mb-2">
                    Apakah Anda berbicara, diam, menjauh, menyerang, menghindar, atau melakukan hal lainnya?
                  </label>
                  <textarea
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    placeholder="Contoh: Saya membalas dengan kata-kata singkat dan dingin, lalu mematikan notifikasi ponsel selama beberapa hari..."
                    rows={4}
                    className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-cyan-500 text-sm"
                  />
                </div>
              </div>
            )}

            {/* Step 6: AKIBAT */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-cyan-300 font-bold">
                      7
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">7. Akibat & Konsekuensi</h2>
                      <p className="text-xs text-stone-400">Melihat dampak respons tersebut tanpa menghakimi diri sendiri.</p>
                    </div>
                  </div>
                  <span className="text-xs text-stone-500">Tahap 7 / 12</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-200 mb-2">
                    Apa yang terjadi setelah Anda merespons seperti itu? Apakah ada konsekuensi yang tidak Anda inginkan?
                  </label>
                  <textarea
                    value={consequences}
                    onChange={(e) => setConsequences(e.target.value)}
                    placeholder="Contoh: Hubungan menjadi canggung, masalah inti tidak selesai, dan saya merasa lelah karena terus memikirkannya..."
                    rows={4}
                    className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-cyan-500 text-sm"
                  />
                </div>
              </div>
            )}

            {/* Step 7: PENGENALAN POLA */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-cyan-300 font-bold">
                      8
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">8. Pengenalan Pola & Kemiripan</h2>
                      <p className="text-xs text-stone-400">Eksplorasi apakah pengalaman serupa pernah terjadi sebelumnya.</p>
                    </div>
                  </div>
                  <span className="text-xs text-stone-500">Tahap 8 / 12</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-200 mb-2">
                      Apakah pengalaman seperti ini pernah terjadi sebelumnya?
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['ya', 'mungkin', 'tidak'] as const).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setHasSimilarPast(opt)}
                          className={`p-3 rounded-xl text-xs md:text-sm font-semibold capitalize transition ${
                            hasSimilarPast === opt
                              ? 'bg-cyan-600 text-white shadow-md'
                              : 'bg-stone-950 border border-stone-800 text-stone-300 hover:border-stone-700'
                          }`}
                        >
                          {opt === 'ya' ? '✓ Ya, Pernah' : opt === 'mungkin' ? '≈ Ada Kemiripan' : '✕ Tidak, Baru Pertama'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-200 mb-2">
                      Jika pernah atau ada kemiripan, situasi seperti apa yang mirip di masa lalu?
                    </label>
                    <textarea
                      value={pastSimilarExperience}
                      onChange={(e) => setPastSimilarExperience(e.target.value)}
                      placeholder="Contoh: Saat di tempat kerja lama atau dalam hubungan sebelumnya, ketika merasa diabaikan saya selalu memilih menarik diri..."
                      rows={3}
                      className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-cyan-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 8: GALI KEBUTUHAN */}
            {currentStep === 8 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-cyan-300 font-bold">
                      9
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">9. Gali Kebutuhan & Niat Perlindungan</h2>
                      <p className="text-xs text-stone-400">Di balik setiap pola, ada kebutuhan rasa aman yang ingin dilindungi.</p>
                    </div>
                  </div>
                  <span className="text-xs text-stone-500">Tahap 9 / 12</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1.5">
                      Apa yang sebenarnya Anda harapkan / butuhkan saat itu?
                    </label>
                    <input
                      type="text"
                      value={actualNeed}
                      onChange={(e) => setActualNeed(e.target.value)}
                      placeholder="Kebutuhan akan kejelasan, dihargai, rasa aman..."
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1.5">
                      Apa yang paling Anda takutkan jika situasi ini berlanjut?
                    </label>
                    <input
                      type="text"
                      value={fearedLoss}
                      onChange={(e) => setFearedLoss(e.target.value)}
                      placeholder="Ditinggalkan, dianggap lemah, kehilangan kendali..."
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1.5">
                      Apa yang sedang ingin Anda lindungi dari diri Anda?
                    </label>
                    <input
                      type="text"
                      value={protectingWhat}
                      onChange={(e) => setProtectingWhat(e.target.value)}
                      placeholder="Harga diri, integritas batasan, ruang kenyamanan..."
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1.5">
                      Apa yang ingin Anda hindari?
                    </label>
                    <input
                      type="text"
                      value={avoidingWhat}
                      onChange={(e) => setAvoidingWhat(e.target.value)}
                      placeholder="Konflik terbuka, rasa sakit akibat ditolak..."
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 9: PEMBELAJARAN */}
            {currentStep === 9 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-cyan-300 font-bold">
                      10
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">10. Pembelajaran & Wawasan Diri</h2>
                      <p className="text-xs text-stone-400">Melihat pengalaman sebagai bahan belajar untuk melangkah lebih tenang.</p>
                    </div>
                  </div>
                  <span className="text-xs text-stone-500">Tahap 10 / 12</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-200 mb-2">
                    Apa yang baru Anda sadari tentang diri Anda dari pengalaman ini?
                  </label>
                  <textarea
                    value={learning}
                    onChange={(e) => setLearning(e.target.value)}
                    placeholder="Contoh: Saya menyadari bahwa saya sering mengambil asumsi terburuk ketika cemas, dan respons menarik diri saya justru memperburuk kesalahpahaman..."
                    rows={4}
                    className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-cyan-500 text-sm"
                  />
                </div>
              </div>
            )}

            {/* Step 10: PILIHAN RESPONS BARU */}
            {currentStep === 10 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-cyan-300 font-bold">
                      11
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">11. Pilihan Respons Baru yang Lebih Sadar</h2>
                      <p className="text-xs text-stone-400">Jika situasi serupa terjadi lagi, opsi sadar apa yang ingin Anda pertimbangkan?</p>
                    </div>
                  </div>
                  <span className="text-xs text-stone-500">Tahap 11 / 12</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-200 mb-3">
                    Pilih opsi respons sadar yang ingin Anda coba:
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {NEW_CHOICES_LIST.map((choice) => {
                      const isSelected = selectedNewChoices.includes(choice);
                      return (
                        <button
                          key={choice}
                          onClick={() => toggleItem(selectedNewChoices, setSelectedNewChoices, choice)}
                          className={`p-3 rounded-xl text-xs md:text-sm text-left font-medium transition flex items-center justify-between ${
                            isSelected
                              ? 'bg-cyan-950/80 border border-cyan-500/60 text-cyan-200'
                              : 'bg-stone-950 border border-stone-800 text-stone-300 hover:border-stone-700'
                          }`}
                        >
                          <span>{choice}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={customNewChoice}
                      onChange={(e) => setCustomNewChoice(e.target.value)}
                      placeholder="Opsi respons sadar lain..."
                      className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      onClick={() => {
                        if (customNewChoice.trim()) {
                          setSelectedNewChoices([...selectedNewChoices, customNewChoice.trim()]);
                          setCustomNewChoice('');
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200"
                    >
                      + Tambah
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 11: HADIR SAAT INI (GROUNDING) */}
            {currentStep === 11 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-cyan-300 font-bold">
                      12
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">12. Hadir Saat Ini (Grounding & Integration)</h2>
                      <p className="text-xs text-stone-400">Kembalikan perhatian Anda ke tubuh dan napas saat ini.</p>
                    </div>
                  </div>
                  <span className="text-xs text-stone-500">Tahap 12 / 12</span>
                </div>

                <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-6 text-center space-y-4">
                  <div className="inline-flex p-3 rounded-full bg-cyan-950 border border-cyan-800/60 text-cyan-400">
                    <Wind className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-base font-semibold text-stone-100">
                      "Untuk beberapa saat, lepaskan kebutuhan untuk menyelesaikan semuanya."
                    </p>
                    <p className="text-sm text-stone-400 max-w-xl mx-auto">
                      Rasakan napas Anda. Rasakan tubuh Anda. Sadari bahwa saat ini Anda sedang berada di sini dengan aman.
                    </p>
                  </div>

                  {/* Interactive Mini Grounding Breath */}
                  <div className="pt-2">
                    <button
                      onClick={() => setIsGroundingActive(!isGroundingActive)}
                      className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 mx-auto ${
                        isGroundingActive
                          ? 'bg-amber-600 text-white'
                          : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                      }`}
                    >
                      <Wind className="w-4 h-4" />
                      {isGroundingActive ? `Sedang Berjalan (${groundingPhase}) — Hentikan` : 'Mulai Latihan Napas 3 Siklus'}
                    </button>

                    {isGroundingActive && (
                      <div className="mt-4 p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/50 max-w-sm mx-auto animate-fade-in">
                        <div className="text-xl font-bold text-cyan-300 tracking-wider">
                          {groundingPhase}
                        </div>
                        <div className="text-xs text-stone-400 mt-1">
                          Siklus Napas Grounding • Detik ke-{groundingSeconds}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 text-left">
                    <label className="block text-xs font-medium text-stone-300 mb-1.5">
                      Apa yang Anda rasakan di tubuh dan pikiran Anda sekarang?
                    </label>
                    <textarea
                      value={presentMomentNotes}
                      onChange={(e) => setPresentMomentNotes(e.target.value)}
                      placeholder="Contoh: Napas terasa lebih lapang, dada lebih rileks, dan pikiran lebih tenang..."
                      rows={2}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-cyan-500 text-xs"
                    />
                  </div>
                </div>

                {/* Final Run Button */}
                <div className="pt-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-stone-400">
                    Semua 12 tahap telah diisi. Klik tombol di kanan untuk memproses pemaknaan pola dengan LEGA AI.
                  </div>
                  <button
                    onClick={handleRunAiAnalysis}
                    disabled={isProcessing}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold text-sm shadow-xl shadow-cyan-950 flex items-center gap-2 transition disabled:opacity-50"
                  >
                    <Sparkles className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                    {isProcessing ? 'Menganalisis Pola Kesadaran...' : 'Analisis Pemaknaan Pola dengan LEGA AI'}
                  </button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 pt-4 border-t border-stone-800/80 flex items-center justify-between">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition disabled:opacity-30 disabled:pointer-events-none"
              >
                ← Kembali
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-2 rounded-xl text-stone-500 hover:text-stone-300 text-xs transition flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>

                {currentStep < STEPS_NAV.length - 1 && (
                  <button
                    onClick={handleNextStep}
                    className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-950 transition flex items-center gap-1.5"
                  >
                    Lanjut ke {STEPS_NAV[currentStep + 1]?.short} →
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* AI Pattern Analysis Output Display */}
          {analysisResult && (
            <div className="bg-stone-900/90 border border-cyan-800/60 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-800 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-700/50 text-cyan-300 text-xs font-bold uppercase mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Hasil Analisis & Pemaknaan Pola
                  </div>
                  <h3 className="text-xl font-bold text-white">Ringkasan Kesadaran Pola (LEGA AI)</h3>
                </div>

                <div className="flex items-center gap-2">
                  <VoiceGuideButton
                    text={analysisResult.summary + '. ' + analysisResult.learningSummary}
                    label="Dengarkan Insight"
                  />
                  <button
                    onClick={handleSaveToJournal}
                    disabled={isSavedToJournal}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      isSavedToJournal
                        ? 'bg-emerald-950 border border-emerald-700/60 text-emerald-300'
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-950'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {isSavedToJournal ? '✓ Tersimpan di Jurnal' : 'Simpan ke Jurnal'}
                  </button>
                </div>
              </div>

              {/* Main Summary */}
              <div className="p-5 rounded-2xl bg-stone-950/80 border border-stone-800 text-stone-200 leading-relaxed text-sm md:text-base">
                {analysisResult.summary}
              </div>

              {/* 3 Pillars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pillar 1: Pattern Recognition */}
                <div className="p-5 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-3">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                    <GitFork className="w-4 h-4" />
                    Eksplorasi Kemiripan Pola
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {analysisResult.patternRecognition.similarityInsight}
                  </p>
                  <div className="pt-2 border-t border-stone-800/80 text-[11px] text-stone-400">
                    <strong>Niat Perlindungan:</strong> {analysisResult.patternRecognition.protectiveIntent}
                  </div>
                </div>

                {/* Pillar 2: Deeper Needs */}
                <div className="p-5 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-3">
                  <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                    <Compass className="w-4 h-4" />
                    Kebutuhan Sejati di Balik Pola
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {analysisResult.deeperNeedsAnalysis.coreNeed}
                  </p>
                  <div className="pt-2 border-t border-stone-800/80 text-[11px] text-stone-400">
                    <strong>Yang Dijaga:</strong> {analysisResult.deeperNeedsAnalysis.whatIsProtected}
                  </div>
                </div>

                {/* Pillar 3: Learning Summary */}
                <div className="p-5 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    Pembelajaran Diri (Insight)
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {analysisResult.learningSummary}
                  </p>
                </div>
              </div>

              {/* Conscious Choices Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-stone-200 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                  Rekomendasi Pilihan Respons Baru yang Lebih Sadar:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {analysisResult.consciousResponseChoices?.map((opt, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 space-y-2">
                      <div className="text-xs font-bold text-cyan-300">{opt.title}</div>
                      <p className="text-[11px] text-stone-300 leading-relaxed">{opt.description}</p>
                      <div className="text-[10px] text-stone-400 pt-1 border-t border-cyan-900/40">
                        <strong>Aksi:</strong> {opt.practicalAction}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grounding Guidance */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 flex items-start gap-3">
                <Wind className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-stone-300 leading-relaxed">
                  <strong className="text-emerald-300 block mb-1">Panduan Hadir Saat Ini:</strong>
                  {analysisResult.groundingGuidance}
                </div>
              </div>

              {/* Next Recommended Module Bridge */}
              {analysisResult.recommendedNextModule && onSelectModule && (
                <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
                  <span className="text-xs text-stone-400">
                    Latihan lanjutan yang disarankan: <strong>{analysisResult.recommendedNextModule.moduleName}</strong> ({analysisResult.recommendedNextModule.reason})
                  </span>
                  <button
                    onClick={() => onSelectModule(analysisResult.recommendedNextModule!.targetModuleKey)}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-bold text-stone-200 flex items-center gap-1.5 transition"
                  >
                    Buka {analysisResult.recommendedNextModule.moduleName} →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 2: PATTERN COMPARISON MATRIX */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'matrix' && (
        <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Matriks Perbandingan Pola Siklus</h2>
            <p className="text-xs text-stone-400">
              Membandingkan alur respons saat ini dengan respons sadar baru yang dipilih.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1: Pola Reaktif Lama */}
            <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-900/40 space-y-4">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                <AlertCircle className="w-4 h-4" />
                Pola Respons Otomatis / Reaktif (Lama)
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800">
                  <span className="text-stone-500 block mb-1">1. Peristiwa & Interpretasi</span>
                  <p className="text-stone-200 font-medium">{event || 'Peristiwa yang memicu rasa tidak nyaman'}</p>
                  <p className="text-stone-400 mt-1 italic">{thought || 'Pikiran yang langsung menyimpulkan tanpa jeda'}</p>
                </div>

                <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800">
                  <span className="text-stone-500 block mb-1">2. Emosi & Sensasi Tubuh</span>
                  <p className="text-rose-200 font-medium">{selectedEmotions.join(', ') || 'Kecewa, Cemas, Marah'}</p>
                  <p className="text-stone-400 mt-1">{selectedSensations.join(', ') || 'Tubuh terasa tegang dan sesak'}</p>
                </div>

                <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800">
                  <span className="text-stone-500 block mb-1">3. Respons & Akibat</span>
                  <p className="text-stone-200">{userResponse || 'Menyerang, menarik diri, atau silent treatment'}</p>
                  <p className="text-stone-400 mt-1">{consequences || 'Ketegangan berlanjut dan masalah tidak terselesaikan'}</p>
                </div>
              </div>
            </div>

            {/* Column 2: Pola Respons Sadar Baru */}
            <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-900/40 space-y-4">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Pola Respons Sadar (Baru)
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800">
                  <span className="text-stone-500 block mb-1">1. Jeda & Pengamatan</span>
                  <p className="text-stone-200 font-medium">Memisahkan fakta nyata kejadian dari asumsi pikiran.</p>
                  <p className="text-emerald-300 mt-1">Mengambil 3 tarikan napas sebelum memberikan respons.</p>
                </div>

                <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800">
                  <span className="text-stone-500 block mb-1">2. Validasi Kebutuhan</span>
                  <p className="text-stone-200">Mengakui emosi yang hadir sebagai hal wajar tanpa menolak.</p>
                  <p className="text-emerald-300 mt-1">Menyadari kebutuhan rasa aman ({actualNeed || 'kejelasan & penghargaan'}).</p>
                </div>

                <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800">
                  <span className="text-stone-500 block mb-1">3. Pilihan Tindakan Sadar</span>
                  <ul className="list-disc list-inside text-stone-200 space-y-1 mt-1">
                    {selectedNewChoices.length > 0 ? (
                      selectedNewChoices.map((c, i) => <li key={i}>{c}</li>)
                    ) : (
                      <li>Berkomunikasi tenang, menetapkan batasan, atau mengambil jarak sehat.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-stone-300 flex items-center justify-between">
            <span>Ingin merefleksikan alur ini secara mendalam langkah demi langkah?</span>
            <button
              onClick={() => {
                setActiveTab('flow');
                setCurrentStep(0);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition text-xs"
            >
              Buka Alur 12 Tahap →
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 3: POPULAR SCENARIOS */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'scenarios' && (
        <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Katalog Skenario Pola Kehidupan Nyata</h2>
            <p className="text-xs text-stone-400">
              Pilih salah satu template skenario umum di bawah untuk langsung mempelajari dinamika siklus polanya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRESET_SCENARIOS.map((preset) => (
              <div
                key={preset.id}
                className="p-5 rounded-2xl bg-stone-950 border border-stone-800 hover:border-cyan-700/60 transition space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800/50">
                      {preset.category}
                    </span>
                    <span className="text-xs text-stone-500">Pola Berulang</span>
                  </div>
                  <h3 className="font-bold text-stone-100 text-sm md:text-base">{preset.title}</h3>
                  <p className="text-xs text-stone-300 leading-relaxed line-clamp-2">{preset.event}</p>
                </div>

                <div className="pt-3 border-t border-stone-900 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {preset.emotions.map((e, idx) => (
                      <span key={idx} className="text-[10px] text-stone-400 bg-stone-900 px-2 py-0.5 rounded-md">
                        {e}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleApplyPreset(preset)}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-600/80 hover:bg-cyan-500 text-white text-xs font-semibold transition flex items-center gap-1"
                  >
                    Gunakan Skenario →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 4: GROUNDING & PRESENCE */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'grounding' && (
        <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 md:p-12 shadow-xl text-center space-y-8 max-w-2xl mx-auto">
          <div className="space-y-3">
            <div className="inline-flex p-4 rounded-full bg-cyan-950 border border-cyan-700/50 text-cyan-300">
              <Wind className="w-8 h-8 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-white">Ruang Hadir Saat Ini (LEGA Grounding)</h2>
            <p className="text-sm text-stone-300 leading-relaxed">
              Setelah merefleksikan pola, luangkan 1-2 menit untuk melepaskan segala kebutuhan untuk memperbaiki semuanya sekaligus. Rasakan tubuh dan napas Anda saat ini.
            </p>
          </div>

          {/* Visual Breathing Ring */}
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
            <div
              className={`absolute inset-0 rounded-full border-4 border-cyan-500/30 transition-all duration-1000 ${
                isGroundingActive && groundingPhase === 'Tarik Napas'
                  ? 'scale-110 border-cyan-400'
                  : isGroundingActive && groundingPhase === 'Tahan Sejenak'
                  ? 'scale-110 border-amber-400 animate-pulse'
                  : 'scale-90 border-teal-500/50'
              }`}
            />
            <div className="space-y-1">
              <div className="text-lg font-bold text-cyan-300">
                {isGroundingActive ? groundingPhase : 'Siap Mulai'}
              </div>
              <div className="text-xs text-stone-400">
                {isGroundingActive ? `${groundingSeconds}s` : '3 Siklus Napas'}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setIsGroundingActive(!isGroundingActive);
                playCalmMeditationChime();
              }}
              className={`px-6 py-3 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
                isGroundingActive
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-xl shadow-cyan-950'
              }`}
            >
              <Wind className="w-4 h-4" />
              {isGroundingActive ? 'Hentikan Latihan' : 'Mulai Latihan Grounding Sekarang'}
            </button>

            {onSelectModule && (
              <button
                onClick={() => onSelectModule('mindfulness')}
                className="px-5 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition"
              >
                Buka LEGA Presence →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
