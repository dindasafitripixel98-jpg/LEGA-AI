import React, { useState } from 'react';
import {
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Volume2,
  CheckCircle2,
  RefreshCw,
  HelpCircle,
  ArrowRight,
  Save,
  Check,
  AlertCircle,
  Wind,
  Compass,
  Layers,
  Heart,
  Feather,
  Lock,
  UserX,
  LifeBuoy
} from 'lucide-react';
import { ModuleType, JournalEntry } from '../types';
import { reflectForgiveness } from '../lib/geminiApi';

interface LegaForgivenessProps {
  onSelectModule?: (module: ModuleType) => void;
  onAddJournal?: (journal: Omit<JournalEntry, 'id' | 'date'>) => void;
}

// 6 Area Refleksi
const FORGIVENESS_AREAS = [
  { id: 'diri', name: 'Memaafkan Diri Sendiri', desc: 'Melepaskan penyesalan, ekspektasi berlebih, dan kesalahan masa lalu.' },
  { id: 'orang-lain', name: 'Memaafkan Orang Lain', desc: 'Meringankan beban amarah tanpa harus membenarkan perbuatannya.' },
  { id: 'masa-lalu', name: 'Menerima Masa Lalu', desc: 'Mengakui apa yang telah terjadi tanpa terus melawan kenyataan.' },
  { id: 'penyesalan', name: 'Melepaskan Penyesalan', desc: 'Menerima keputusan masa lalu dengan belas kasih pada diri.' },
  { id: 'batasan', name: 'Membangun Batasan', desc: 'Menetapkan ruang aman dan batas komunikasi yang sehat (Healthy Boundaries).' },
  { id: 'pelajaran', name: 'Belajar dari Pengalaman', desc: 'Memetik kebijaksanaan tanpa perlu mempertahankan luka emosional.' }
];

// Pertanyaan Reflektif Pemandu
const REFLECTIVE_QUESTIONS = [
  'Pengalaman apa yang masih sering hadir dalam ingatan Anda?',
  'Emosi apa yang muncul ketika Anda mengingat peristiwa tersebut?',
  'Bagaimana pengalaman itu memengaruhi kehidupan Anda saat ini?',
  'Apa yang paling Anda butuhkan saat ini agar dapat melangkah ke depan?',
  'Apakah ada hal dalam situasi ini yang masih berada dalam kendali Anda?',
  'Langkah kecil apa yang paling realistis dan ingin Anda lakukan setelah sesi ini?'
];

// Tema Audio Memaafkan
const FORGIVENESS_AUDIO_THEMES = [
  { title: 'Memaafkan Diri Sendiri', desc: 'Merawat luka penyesalan dan memberikan kelembutan pada diri sendiri.', duration: '7 Menit' },
  { title: 'Memaafkan Orang Lain', desc: 'Melepaskan ikatan amarah demi kedamaian batin tanpa membenarkan tindakan.', duration: '10 Menit' },
  { title: 'Melepaskan Penyesalan', desc: 'Menguraikan pengandaian "seandainya" dan berdamai dengan kenyataan.', duration: '5 Menit' },
  { title: 'Membangun Belas Kasih', desc: 'Menumbuhkan pemahaman lembut tanpa mengorbankan batasan diri.', duration: '8 Menit' },
  { title: 'Melangkah ke Depan', desc: 'Menatap masa depan dengan ruang batin yang lebih lapang dan berdaya.', duration: '6 Menit' }
];

export const LegaForgiveness: React.FC<LegaForgivenessProps> = ({
  onSelectModule,
  onAddJournal
}) => {
  // State Management
  const [activeTab, setActiveTab] = useState<'guided' | 'journal' | 'audio'>('guided');
  const [guidedStep, setGuidedStep] = useState<number>(1); // 1 to 7 steps
  const [selectedFocusArea, setSelectedFocusArea] = useState<string>('Memaafkan Diri Sendiri');

  // Option Flags
  const [isNotReadyYet, setIsNotReadyYet] = useState<boolean>(false);
  const [isSevereTrauma, setIsSevereTrauma] = useState<boolean>(false);

  // Form Inputs
  const [experienceText, setExperienceText] = useState<string>('');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(['Kecewa', 'Sedih']);
  const [impactText, setImpactText] = useState<string>('');
  const [needsText, setNeedsText] = useState<string>('');

  // AI Output State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [aiForgivenessOutput, setAiForgivenessOutput] = useState<any | null>(null);
  const [savedJournalSuccess, setSavedJournalSuccess] = useState<boolean>(false);

  // Toggle Emotion Selection
  const toggleEmotion = (emo: string) => {
    if (selectedEmotions.includes(emo)) {
      if (selectedEmotions.length > 1) {
        setSelectedEmotions(selectedEmotions.filter((e) => e !== emo));
      }
    } else {
      setSelectedEmotions([...selectedEmotions, emo]);
    }
  };

  // Submit Forgiveness Reflection
  const handleSubmitReflection = async () => {
    setIsProcessing(true);
    setSavedJournalSuccess(false);

    const result = await reflectForgiveness({
      focusArea: selectedFocusArea,
      experienceText,
      currentEmotions: selectedEmotions,
      impactText,
      needsToMoveForward: needsText,
      isNotReadyYet,
      isSevereTrauma
    });

    setAiForgivenessOutput(result);
    setIsProcessing(false);
    setGuidedStep(7); // Move to Step 7 (Realistic Step & AI Synthesis)
  };

  // Save as LEGA Journal Entry
  const handleSaveToJournal = () => {
    if (!aiForgivenessOutput || !onAddJournal) return;

    const journalNote = aiForgivenessOutput.journalNote || {};
    const journalContent = `--- REFLEKSI MEMAAFKAN (LEGA FORGIVENESS) ---
Area Fokus: ${selectedFocusArea}
Status Kesiapan: ${isNotReadyYet ? 'Belum Siap Memaafkan (Diapresiasi & Divalidasi)' : 'Proses Refleksi Terpandu'}

1. Hal Yang Masih Terasa Berat:
${journalNote.whatStillFeelsHeavy || experienceText || '-'}

2. Kebijaksanaan / Pelajaran Yang Dipelajari:
${journalNote.whatWasLearned || aiForgivenessOutput.lessonsAndBoundaries?.lessonLearned || '-'}

3. Hal Yang Ingin Dilepaskan Bertahap:
${journalNote.whatToRelease || aiForgivenessOutput.lessonsAndBoundaries?.whatIsToRelease || '-'}

4. Batasan Yang Ingin Dibangun (Healthy Boundary):
${journalNote.boundaryToBuild || aiForgivenessOutput.lessonsAndBoundaries?.healthyBoundaryToBuild || '-'}

5. Harapan Untuk Masa Depan:
${journalNote.futureHope || aiForgivenessOutput.realisticNextStep || '-'}`;

    onAddJournal({
      title: `Jurnal Memaafkan: ${selectedFocusArea}`,
      content: journalContent,
      mood: isNotReadyYet ? 'cemas' : 'tenang',
      tags: ['Memaafkan', 'LEGA Forgiveness', 'Refleksi']
    });

    setSavedJournalSuccess(true);
    setTimeout(() => setSavedJournalSuccess(false), 3000);
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 text-stone-100">
      {/* Header Banner */}
      <div className="bg-stone-900/90 border border-stone-800 p-5 md:p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-400 rounded-2xl">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-stone-100 flex items-center gap-2">
                LEGA Forgiveness
                <span className="text-xs bg-rose-900/80 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-700 font-mono">
                  v1.0
                </span>
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Mengeksplorasi proses memaafkan, merawat luka emosional & membangun batasan yang sehat secara terpandu
              </p>
            </div>
          </div>

          {/* Quick Option Switches */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsNotReadyYet(!isNotReadyYet)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                isNotReadyYet
                  ? 'bg-amber-950 border-amber-800 text-amber-300 shadow-md'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <UserX className="w-3.5 h-3.5" />
              <span>{isNotReadyYet ? 'Opsi: Belum Siap Memaafkan' : 'Belum Siap Memaafkan?'}</span>
            </button>

            <button
              onClick={() => setIsSevereTrauma(!isSevereTrauma)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                isSevereTrauma
                  ? 'bg-red-950 border-red-800 text-red-300 shadow-md'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>{isSevereTrauma ? 'Mode Trauma / Pendampingan Profesi' : 'Merasa Sangat Berat / Trauma?'}</span>
            </button>
          </div>
        </div>

        {/* Essential Philosophy & Boundaries Disclaimer */}
        <div className="p-4 bg-rose-950/20 border border-rose-800/40 rounded-2xl text-xs space-y-1.5 text-rose-200/90 leading-relaxed">
          <p className="font-bold text-rose-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-rose-400" /> Prinsip Memaafkan dalam LEGA:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-300 pt-1">
            <div className="flex items-start gap-1.5">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>BUKAN Membenarkan:</strong> Memaafkan tidak menghapus kesalahan atau tanggung jawab pihak lain.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>BUKAN Melupakan:</strong> Mengakui kenyataan pahit tanpa terus terikat oleh amarah.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>BUKAN Rekonsiliasi:</strong> Memaafkan tidak mewajibkan Anda kembali berhubungan.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>Tetap Butuh Batasan:</strong> Anda berhak penuh membangun batasan yang aman (Healthy Boundaries).</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-800 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('guided')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'guided'
                ? 'border-rose-400 text-rose-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Alur Refleksi Terpandu (7-Tahap)</span>
          </button>

          <button
            onClick={() => setActiveTab('journal')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'journal'
                ? 'border-rose-400 text-rose-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Jurnal Memaafkan</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'audio'
                ? 'border-rose-400 text-rose-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Audio Memaafkan AI</span>
          </button>
        </div>
      </div>

      {/* SPECIAL NOTICE: IF USER IS NOT READY YET */}
      {isNotReadyYet && (
        <div className="p-5 bg-amber-950/40 border border-amber-800/80 rounded-3xl space-y-3 text-amber-200 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-amber-300">Keputusan Anda Sepenuhnya Valid & Dihormati</h3>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            LEGA tidak pernah memaksa Anda untuk memaafkan. Memaafkan bukanlah kewajiban instan atau tanda kelemahan jika Anda belum siap. Jika saat ini terasa terlalu berat, Anda berhak mengambil jeda dan fokus merawat diri sendiri terlebih dahulu.
          </p>
          <div className="pt-2 border-t border-amber-900/60 space-y-2">
            <p className="text-[11px] font-bold text-amber-400">Rekomendasi Latihan Alternatif Yang Lebih Ringan:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'LEGA Presence', key: 'mindfulness' },
                { name: 'LEGA Observer', key: 'observer' },
                { name: 'Latihan Pernapasan', key: 'breathing' },
                { name: 'Pelepasan Emosi', key: 'emotional-release' },
                { name: 'LEGA Journal', key: 'journal' }
              ].map((alt, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectModule && onSelectModule(alt.key as ModuleType)}
                  className="px-3 py-1.5 bg-stone-950 hover:bg-stone-900 border border-stone-800 text-amber-300 rounded-xl text-xs font-medium transition flex items-center gap-1.5"
                >
                  <span>{alt.name}</span>
                  <ArrowRight className="w-3 h-3 text-amber-500" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SPECIAL NOTICE: IF SEVERE TRAUMA DETECTED */}
      {isSevereTrauma && (
        <div className="p-5 bg-red-950/40 border border-red-800/80 rounded-3xl space-y-3 text-red-200 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <LifeBuoy className="w-5 h-5 text-red-400" />
            <h3 className="font-bold text-sm text-red-300">Pendampingan Empati & Keselamatan Utama</h3>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            Jika pengalaman ini menimbulkan kilas balik traumatis berulang, rasa cemas ekstrem, atau gangguan serius pada kehidupan sehari-hari, Anda tidak perlu memaksakan diri mengingat detailnya di sini. LEGA menyarankan Anda untuk berkonsultasi dengan psikolog klinis, terapis, atau konselor profesional dalam ruang yang aman dan terlindungi.
          </p>
        </div>
      )}

      {/* TAB 1: GUIDED 7-STEP FORGIVENESS FLOW */}
      {activeTab === 'guided' && (
        <div className="space-y-6">
          {/* Progress Steps Indicator */}
          <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-2xl flex items-center justify-between overflow-x-auto gap-2 text-xs">
            {[
              { step: 1, label: '1. Berhenti' },
              { step: 2, label: '2. Napas' },
              { step: 3, label: '3. Pengalaman' },
              { step: 4, label: '4. Emosi' },
              { step: 5, label: '5. Dampak' },
              { step: 6, label: '6. Kebutuhan' },
              { step: 7, label: '7. Langkah Small' }
            ].map((s) => (
              <button
                key={s.step}
                onClick={() => setGuidedStep(s.step)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  guidedStep === s.step
                    ? 'bg-rose-700 text-white shadow-md'
                    : guidedStep > s.step
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'bg-stone-950 text-stone-500 border border-stone-800'
                }`}
              >
                {guidedStep > s.step ? <Check className="w-3 h-3 text-rose-400" /> : null}
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          {/* STEP 1: BERHENTI SEJENAK */}
          {guidedStep === 1 && (
            <div className="bg-stone-900/90 border border-stone-800 p-6 rounded-3xl space-y-5 text-center max-w-2xl mx-auto animate-fade-in">
              <div className="w-16 h-16 bg-rose-950/80 border border-rose-800 text-rose-400 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                <HeartHandshake className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-stone-100">Tahap 1: Berhenti Sejenak (Pause)</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Luangkan waktu sejenak ini tanpa penilaian. Duduklah dengan nyaman, rilekskan bahu Anda, dan izinkan diri Anda berada di ruang yang aman ini.
                </p>
              </div>

              <button
                onClick={() => setGuidedStep(2)}
                className="px-6 py-3 bg-rose-700 hover:bg-rose-600 text-white font-bold rounded-2xl text-xs transition shadow-lg flex items-center justify-center gap-2 mx-auto"
              >
                <span>Lanjut ke Tahap 2: Sadari Napas</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: SADARI NAPAS */}
          {guidedStep === 2 && (
            <div className="bg-stone-900/90 border border-stone-800 p-6 rounded-3xl space-y-5 text-center max-w-2xl mx-auto animate-fade-in">
              <div className="w-16 h-16 bg-teal-950/80 border border-teal-800 text-teal-400 rounded-2xl flex items-center justify-center mx-auto shadow-xl animate-pulse">
                <Wind className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-stone-100">Tahap 2: Sadari Napas & Berjangkar</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Tarik napas perlahan... rasakan udara masuk menenangkan pikiran... lalu hembuskan dengan lembut. Napas adalah jangkar aman Anda saat memproses emosi yang berat.
                </p>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setGuidedStep(1)}
                  className="px-4 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-400"
                >
                  Kembali
                </button>
                <button
                  onClick={() => setGuidedStep(3)}
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-2xl text-xs transition shadow-lg flex items-center gap-2"
                >
                  <span>Lanjut ke Tahap 3: Kenali Pengalaman</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: KENALI PENGALAMAN YANG MEMBEKAS & AREA REFLEKSI */}
          {guidedStep === 3 && (
            <div className="bg-stone-900/90 border border-stone-800 p-6 rounded-3xl space-y-5 animate-fade-in">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-stone-100">Tahap 3: Kenali Pengalaman & Area Refleksi</h3>
                <p className="text-xs text-stone-400">
                  Pilih area fokus memaafkan yang ingin Anda eksplorasi hari ini:
                </p>
              </div>

              {/* Area Cards Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {FORGIVENESS_AREAS.map((area) => {
                  const isSelected = selectedFocusArea === area.name;
                  return (
                    <button
                      key={area.id}
                      onClick={() => setSelectedFocusArea(area.name)}
                      className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                        isSelected
                          ? 'bg-rose-950/80 border-rose-700 text-stone-100 shadow-md ring-1 ring-rose-500'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-xs text-rose-300">{area.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-rose-400" />}
                      </div>
                      <p className="text-[11px] text-stone-400 mt-2 leading-relaxed">{area.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Experience Text Area */}
              <div className="space-y-2 pt-2 border-t border-stone-800">
                <label className="text-xs font-semibold text-stone-300">
                  Tuliskan secara singkat peristiwa/pengalaman yang masih membekas (Opsional & Aman):
                </label>
                <textarea
                  value={experienceText}
                  onChange={(e) => setExperienceText(e.target.value)}
                  placeholder="Contoh: Penyesalan atas keputusan pekerjaan di masa lalu, atau rasa sakit akibat perlakuan seseorang..."
                  rows={3}
                  className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3 text-xs text-stone-100 outline-none focus:border-rose-500 leading-relaxed"
                />
              </div>

              <div className="flex justify-between pt-3">
                <button
                  onClick={() => setGuidedStep(2)}
                  className="px-4 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-400"
                >
                  Kembali
                </button>
                <button
                  onClick={() => setGuidedStep(4)}
                  className="px-6 py-2.5 bg-rose-700 hover:bg-rose-600 text-white font-bold rounded-2xl text-xs transition shadow-lg flex items-center gap-2"
                >
                  <span>Lanjut ke Tahap 4: Kenali Emosi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: KENALI EMOSI YANG MUNCUL */}
          {guidedStep === 4 && (
            <div className="bg-stone-900/90 border border-stone-800 p-6 rounded-3xl space-y-5 max-w-2xl mx-auto animate-fade-in">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-stone-100">Tahap 4: Kenali Emosi Yang Hadir</h3>
                <p className="text-xs text-stone-400">
                  Emosi apa yang paling terasa ketika mengingat pengalaman ini? (Pilih satu atau beberapa)
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  'Marah',
                  'Kecewa',
                  'Sedih',
                  'Benci',
                  'Penyesalan',
                  'Merasa Bersalah',
                  'Cemas',
                  'Lelah',
                  'Kecewa pada Diri',
                  'Dikhianati',
                  'Tidak Berdaya',
                  'Ingin Berdamai'
                ].map((emo) => {
                  const isSelected = selectedEmotions.includes(emo);
                  return (
                    <button
                      key={emo}
                      onClick={() => toggleEmotion(emo)}
                      className={`p-3 rounded-xl border text-xs font-medium transition text-center ${
                        isSelected
                          ? 'bg-rose-700 border-rose-600 text-white font-bold shadow-md'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-800'
                      }`}
                    >
                      {emo}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between pt-3 border-t border-stone-800">
                <button
                  onClick={() => setGuidedStep(3)}
                  className="px-4 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-400"
                >
                  Kembali
                </button>
                <button
                  onClick={() => setGuidedStep(5)}
                  className="px-6 py-2.5 bg-rose-700 hover:bg-rose-600 text-white font-bold rounded-2xl text-xs transition shadow-lg flex items-center gap-2"
                >
                  <span>Lanjut ke Tahap 5: Refleksi Dampak</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: REFLEKSIKAN DAMPAK TERHADAP DIRI */}
          {guidedStep === 5 && (
            <div className="bg-stone-900/90 border border-stone-800 p-6 rounded-3xl space-y-5 max-w-2xl mx-auto animate-fade-in">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-stone-100">Tahap 5: Refleksikan Dampak Terhadap Diri</h3>
                <p className="text-xs text-stone-400">
                  Bagaimana beban atau amarah dari peristiwa ini memengaruhi pikiran, hubungan, atau energi Anda sehari-hari?
                </p>
              </div>

              <textarea
                value={impactText}
                onChange={(e) => setImpactText(e.target.value)}
                placeholder="Contoh: Membuat saya sering overthinking, sulit mempercayai orang lain, atau terus menyalahkan diri sendiri..."
                rows={3}
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3.5 text-xs text-stone-100 outline-none focus:border-rose-500 leading-relaxed"
              />

              <div className="flex justify-between pt-3">
                <button
                  onClick={() => setGuidedStep(4)}
                  className="px-4 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-400"
                >
                  Kembali
                </button>
                <button
                  onClick={() => setGuidedStep(6)}
                  className="px-6 py-2.5 bg-rose-700 hover:bg-rose-600 text-white font-bold rounded-2xl text-xs transition shadow-lg flex items-center gap-2"
                >
                  <span>Lanjut ke Tahap 6: Eksplorasi Kebutuhan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: EKSPLORASI KEBUTUHAN MELANGKAH KE DEPAN */}
          {guidedStep === 6 && (
            <div className="bg-stone-900/90 border border-stone-800 p-6 rounded-3xl space-y-5 max-w-2xl mx-auto animate-fade-in">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-stone-100">Tahap 6: Eksplorasi Kebutuhan & Batasan Aman</h3>
                <p className="text-xs text-stone-400">
                  Apa yang paling Anda butuhkan saat ini agar dapat merasa lebih tenang dan melangkah ke depan?
                </p>
              </div>

              <textarea
                value={needsText}
                onChange={(e) => setNeedsText(e.target.value)}
                placeholder="Contoh: Kedamaian batin, membatasi komunikasi dengan orang terkait, atau menerima bahwa masa lalu tidak bisa diubah..."
                rows={3}
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3.5 text-xs text-stone-100 outline-none focus:border-rose-500 leading-relaxed"
              />

              <div className="flex justify-between pt-3">
                <button
                  onClick={() => setGuidedStep(5)}
                  className="px-4 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-400"
                >
                  Kembali
                </button>

                <button
                  onClick={handleSubmitReflection}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-rose-700 hover:bg-rose-600 disabled:bg-stone-800 text-white font-bold rounded-2xl text-xs transition shadow-xl flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sintesis Pendampingan LEGA...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Proses Refleksi & Sintesis LEGA</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: OUTPUT SINTESIS LEGA FORGIVENESS */}
          {guidedStep >= 7 && aiForgivenessOutput && (
            <div className="bg-stone-900/90 border border-stone-800 p-6 rounded-3xl space-y-6 animate-fade-in shadow-xl">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-rose-400" />
                  <h3 className="font-bold text-sm text-stone-100">Tahap 7: Sintesis Refleksi & Batasan Sehat LEGA</h3>
                </div>
                <button
                  onClick={handleSaveToJournal}
                  disabled={savedJournalSuccess}
                  className="px-3.5 py-1.5 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                >
                  {savedJournalSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
                  <span>{savedJournalSuccess ? 'Tersimpan di Jurnal' : 'Simpan ke LEGA Journal'}</span>
                </button>
              </div>

              {/* Summary */}
              <div className="p-4 bg-rose-950/30 border border-rose-800/60 rounded-2xl space-y-2">
                <p className="text-xs text-rose-200 leading-relaxed font-medium italic">
                  "{aiForgivenessOutput.summary}"
                </p>
              </div>

              {/* Emotional Insight */}
              {aiForgivenessOutput.emotionalInsight && (
                <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl space-y-1">
                  <p className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-rose-400" /> Penguraian Kesadaran Emosi:
                  </p>
                  <p className="text-xs text-stone-300 leading-relaxed">{aiForgivenessOutput.emotionalInsight}</p>
                </div>
              )}

              {/* Lessons & Boundaries Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 bg-stone-950 border border-stone-800 rounded-2xl space-y-1">
                  <span className="text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-800 font-semibold">
                    Pelajaran Utama
                  </span>
                  <p className="text-xs text-stone-300 mt-1">
                    {aiForgivenessOutput.lessonsAndBoundaries?.lessonLearned || '-'}
                  </p>
                </div>

                <div className="p-3.5 bg-stone-950 border border-stone-800 rounded-2xl space-y-1">
                  <span className="text-[10px] bg-teal-950 text-teal-300 px-2 py-0.5 rounded border border-teal-800 font-semibold">
                    Batasan Sehat (Boundary)
                  </span>
                  <p className="text-xs text-stone-300 mt-1">
                    {aiForgivenessOutput.lessonsAndBoundaries?.healthyBoundaryToBuild || '-'}
                  </p>
                </div>

                <div className="p-3.5 bg-stone-950 border border-stone-800 rounded-2xl space-y-1">
                  <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800 font-semibold">
                    Hal Yang Dilepaskan
                  </span>
                  <p className="text-xs text-stone-300 mt-1">
                    {aiForgivenessOutput.lessonsAndBoundaries?.whatIsToRelease || '-'}
                  </p>
                </div>
              </div>

              {/* Realistic Next Step */}
              {aiForgivenessOutput.realisticNextStep && (
                <div className="p-4 bg-teal-950/40 border border-teal-800/60 rounded-2xl space-y-1">
                  <p className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" /> Langkah Realistis Berikutnya:
                  </p>
                  <p className="text-xs text-stone-200">{aiForgivenessOutput.realisticNextStep}</p>
                </div>
              )}

              {/* Professional Recommendation if present */}
              {aiForgivenessOutput.professionalTherapyRecommendation && (
                <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-2xl space-y-1">
                  <p className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                    <LifeBuoy className="w-4 h-4 text-red-400" /> Catatan Pendampingan Profesional:
                  </p>
                  <p className="text-xs text-stone-200">{aiForgivenessOutput.professionalTherapyRecommendation}</p>
                </div>
              )}

              {/* Recommended Next Modules */}
              <div className="pt-3 border-t border-stone-800 space-y-2">
                <p className="text-xs font-bold text-stone-400">Rekomendasi Modul LEGA Lanjutan:</p>
                <div className="flex flex-wrap gap-2">
                  {aiForgivenessOutput.recommendedModules?.map((mod: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => onSelectModule && onSelectModule(mod.targetModuleKey)}
                      className="px-3 py-1.5 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-rose-300 rounded-xl text-xs font-medium transition flex items-center gap-1.5"
                    >
                      <span>{mod.moduleName}</span>
                      <ArrowRight className="w-3 h-3 text-stone-500" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FORGIVENESS JOURNAL TEMPLATE */}
      {activeTab === 'journal' && (
        <div className="bg-stone-900/90 border border-stone-800 p-6 rounded-3xl space-y-5 animate-fade-in">
          <div className="space-y-1 border-b border-stone-800 pb-3">
            <h3 className="font-bold text-sm text-stone-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-rose-400" /> Panduan Jurnal Memaafkan LEGA
            </h3>
            <p className="text-xs text-stone-400">
              Menuliskan secara sadar apa yang terasa berat, pelajaran, hal yang dilepaskan, dan batasan sehat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 p-4 bg-stone-950 border border-stone-800 rounded-2xl">
              <span className="text-xs font-bold text-rose-300">1. Apa Yang Masih Terasa Berat:</span>
              <p className="text-xs text-stone-400 leading-relaxed">
                Ruang jujur untuk mengakui beban emosional tanpa rasa bersalah.
              </p>
            </div>

            <div className="space-y-2 p-4 bg-stone-950 border border-stone-800 rounded-2xl">
              <span className="text-xs font-bold text-rose-300">2. Apa Yang Dipelajari:</span>
              <p className="text-xs text-stone-400 leading-relaxed">
                Kebijaksanaan dan kekuatan batin yang tumbuh dari dinamika pengalaman tersebut.
              </p>
            </div>

            <div className="space-y-2 p-4 bg-stone-950 border border-stone-800 rounded-2xl">
              <span className="text-xs font-bold text-rose-300">3. Apa Yang Ingin Dilepaskan:</span>
              <p className="text-xs text-stone-400 leading-relaxed">
                Penyesalan, rasa amarah yang melelahkan, atau ekspektasi yang tidak memulihkan.
              </p>
            </div>

            <div className="space-y-2 p-4 bg-stone-950 border border-stone-800 rounded-2xl">
              <span className="text-xs font-bold text-rose-300">4. Batasan Yang Ditingkatkan:</span>
              <p className="text-xs text-stone-400 leading-relaxed">
                Komitmen menjaga ketenangan batin melalui jarak dan aturan komunikasi yang sehat.
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectModule && onSelectModule('journal')}
            className="w-full py-3 bg-rose-700 hover:bg-rose-600 text-white font-bold rounded-2xl text-xs transition flex items-center justify-center gap-2 shadow-xl"
          >
            <BookOpen className="w-4 h-4" />
            <span>Tulis di LEGA Journal Lengkap</span>
          </button>
        </div>
      )}

      {/* TAB 3: FORGIVENESS AUDIO INTEGRATION */}
      {activeTab === 'audio' && (
        <div className="bg-stone-900/90 border border-stone-800 p-6 rounded-3xl space-y-5 animate-fade-in">
          <div className="space-y-1 border-b border-stone-800 pb-3">
            <h3 className="font-bold text-sm text-stone-100 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-rose-400" /> Audio Panduan Memaafkan LEGA AI
            </h3>
            <p className="text-xs text-stone-400">
              Audio panduan refleksi dan pelepasan emosional disintesis langsung melalui modul LEGA AI Audio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FORGIVENESS_AUDIO_THEMES.map((theme, idx) => (
              <div key={idx} className="p-4 bg-stone-950 border border-stone-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-rose-300">{theme.title}</h4>
                  <span className="text-[10px] text-stone-500 font-mono">{theme.duration}</span>
                </div>
                <p className="text-xs text-stone-400">{theme.desc}</p>
                <button
                  onClick={() => onSelectModule && onSelectModule('audio-ai')}
                  className="px-3 py-1.5 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-xl text-[11px] font-semibold transition flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Dengarkan di LEGA AI Audio</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cross-Module Integration Section */}
      <div className="p-5 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-3">
        <h4 className="font-bold text-xs text-stone-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-rose-400" /> Terhubung dengan Seluruh Ekosistem Modul LEGA:
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'LEGA AI Coach', key: 'ai-coach' },
            { name: 'LEGA Self Awareness', key: 'self-discovery' },
            { name: 'LEGA Emotion Analyzer', key: 'emotion-analysis' },
            { name: 'LEGA Presence', key: 'mindfulness' },
            { name: 'LEGA Observer', key: 'observer' },
            { name: 'LEGA Release', key: 'emotional-release' },
            { name: 'LEGA Gratitude', key: 'gratitude' },
            { name: 'LEGA Journal', key: 'journal' },
            { name: 'LEGA AI Audio', key: 'audio-ai' },
            { name: 'LEGA Insight', key: 'ai-insights' },
            { name: 'LEGA Progress', key: 'progress' }
          ].map((mod, idx) => (
            <button
              key={idx}
              onClick={() => onSelectModule && onSelectModule(mod.key as ModuleType)}
              className="px-3 py-1.5 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-rose-300 rounded-xl text-xs font-medium transition flex items-center gap-1.5"
            >
              <span>{mod.name}</span>
              <ArrowRight className="w-3 h-3 text-stone-500" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
