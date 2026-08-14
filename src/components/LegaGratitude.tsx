import React, { useState } from 'react';
import {
  Sun,
  Sparkles,
  Heart,
  HeartHandshake,
  BookOpen,
  Feather,
  Volume2,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
  ArrowRight,
  Send,
  Save,
  Check,
  Smile,
  Zap,
  Wind,
  Compass,
  Layers,
  AlertCircle
} from 'lucide-react';
import { ModuleType, JournalEntry } from '../types';
import { reflectGratitude } from '../lib/geminiApi';
import { VoiceGuideButton } from './VoiceGuideButton';

interface LegaGratitudeProps {
  onSelectModule?: (module: ModuleType) => void;
  onAddJournal?: (journal: Omit<JournalEntry, 'id' | 'date'>) => void;
}

// 14 Area Refleksi
const REFLECTION_AREAS = [
  { id: 'tubuh', name: 'Tubuh', desc: 'Kesetiaan fisik & kemampuan tubuh' },
  { id: 'napas', name: 'Napas', desc: 'Ritme napas yang masih mengalir' },
  { id: 'kesehatan', name: 'Kesehatan', desc: 'Energi & daya tahan hari ini' },
  { id: 'keluarga', name: 'Keluarga', desc: 'Kehadiran atau kenangan hangat' },
  { id: 'teman', name: 'Teman', desc: 'Dukungan & koneksi sesama' },
  { id: 'pekerjaan', name: 'Pekerjaan', desc: 'Usaha, karya & mata pencaharian' },
  { id: 'belajar', name: 'Belajar', desc: 'Pengetahuan & wawasan baru' },
  { id: 'alam', name: 'Alam', desc: 'Sinar matahari, udara & lingkungan' },
  { id: 'waktu', name: 'Waktu', desc: 'Momen luang & kesempatan berhenti' },
  { id: 'pengalaman', name: 'Pengalaman', desc: 'Perjalanan & dinamika kehidupan' },
  { id: 'kesempatan', name: 'Kesempatan', desc: 'Peluang mencoba & memperbaiki' },
  { id: 'nilai', name: 'Nilai Kehidupan', desc: 'Prinsip, integritas & keyakinan' },
  { id: 'pelajaran', name: 'Pelajaran dari Tantangan', desc: 'Kebijaksanaan di balik kesulitan' },
  { id: 'sederhana', name: 'Hal-Hal Sederhana', desc: 'Kopi hangat, senyuman, tempat istirahat' }
];

// Pertanyaan Reflektif Standard
const REFLECTIVE_QUESTIONS = [
  'Apa hal kecil yang Anda syukuri hari ini?',
  'Pengalaman apa yang memberi pelajaran bagi Anda?',
  'Siapa yang telah memberikan kebaikan kepada Anda hari ini?',
  'Apa kemampuan yang Anda miliki dan patut dihargai?',
  'Apa momen sederhana yang membuat hari ini lebih bermakna?',
  'Apa yang ingin Anda jaga atau rawat dalam hidup Anda?'
];

// Tema Audio Syukur (Modul LEGA AI Audio)
const GRATITUDE_AUDIO_THEMES = [
  { title: 'Syukur Pagi', desc: 'Menyambut hari baru dengan kesadaran dan niat tenang.', duration: '5 Menit' },
  { title: 'Syukur Malam', desc: 'Menguraikan beban hari ini dan mengapresiasi perjalanan sebelum tidur.', duration: '10 Menit' },
  { title: 'Syukur Setelah Bekerja', desc: 'Pelepasan ketegangan kerja & mengapresiasi usaha sendiri.', duration: '5 Menit' },
  { title: 'Syukur Bersama Keluarga', desc: 'Menghargai kehangatan dan dinamika relasi terdekat.', duration: '7 Menit' },
  { title: 'Syukur atas Hal-Hal Sederhana', desc: 'Menyadari keindahan kecil dalam keheningan keseharian.', duration: '3 Menit' }
];

export const LegaGratitude: React.FC<LegaGratitudeProps> = ({
  onSelectModule,
  onAddJournal
}) => {
  // State Management
  const [activeTab, setActiveTab] = useState<'guided' | 'journal' | 'audio'>('guided');
  const [guidedStep, setGuidedStep] = useState<number>(1); // 1 to 7 steps
  const [selectedAreas, setSelectedAreas] = useState<string[]>(['Napas', 'Hal-Hal Sederhana']);
  const [isHardshipMode, setIsHardshipMode] = useState<boolean>(false);
  const [reflectionInput, setReflectionInput] = useState<string>('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentEmotion, setCurrentEmotion] = useState<string>('Netral');

  // AI Output State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [aiGratitudeOutput, setAiGratitudeOutput] = useState<any | null>(null);
  const [savedJournalSuccess, setSavedJournalSuccess] = useState<boolean>(false);

  // Toggle Selection Area
  const toggleArea = (areaName: string) => {
    if (selectedAreas.includes(areaName)) {
      if (selectedAreas.length > 1) {
        setSelectedAreas(selectedAreas.filter((a) => a !== areaName));
      }
    } else {
      setSelectedAreas([...selectedAreas, areaName]);
    }
  };

  // Submit Gratitude Reflection
  const handleSubmitReflection = async () => {
    setIsProcessing(true);
    setSavedJournalSuccess(false);

    const result = await reflectGratitude({
      selectedAreas,
      reflectionInput,
      currentEmotion,
      isGoingThroughHardship: isHardshipMode,
      userAnswers: answers
    });

    setAiGratitudeOutput(result);
    setIsProcessing(false);
    setGuidedStep(6); // Move to step 6 (Feel Meaning & AI Synthesis)
  };

  // Save as LEGA Journal Entry
  const handleSaveToJournal = () => {
    if (!aiGratitudeOutput || !onAddJournal) return;

    const journalContent = `--- REFLEKSI SYUKUR LEGA ---
Area: ${selectedAreas.join(', ')}
Kondisi Masa Sulit: ${isHardshipMode ? 'Ya (Pendampingan Hal Sederhana)' : 'Tidak'}

Ringkasan:
${aiGratitudeOutput.summary}

3 Hal Yang Disyukuri:
1. ${aiGratitudeOutput.journalNote?.threeGratitudes?.[0] || '-'}
2. ${aiGratitudeOutput.journalNote?.threeGratitudes?.[1] || '-'}
3. ${aiGratitudeOutput.journalNote?.threeGratitudes?.[2] || '-'}

Pelajaran Hari Ini:
${aiGratitudeOutput.journalNote?.todayLesson || aiGratitudeOutput.lessonsLearned}

Kebaikan Diterima:
${aiGratitudeOutput.journalNote?.kindnessReceived || '-'}

Harapan Esok Hari:
${aiGratitudeOutput.journalNote?.tomorrowHope || '-'}`;

    onAddJournal({
      title: `Jurnal Syukur: ${selectedAreas[0] || 'Refleksi Harian'}`,
      content: journalContent,
      mood: 'bersyukur',
      tags: ['Syukur', 'Refleksi', 'LEGA Gratitude']
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
            <div className="p-3 bg-amber-950/80 border border-amber-800 text-amber-400 rounded-2xl">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-stone-100 flex items-center gap-2">
                LEGA Gratitude
                <span className="text-xs bg-amber-900/80 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-700 font-mono">
                  v1.0
                </span>
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Membangun kebiasaan bersyukur melalui refleksi sadar, realistis, tulus & tanpa toksik-positif
              </p>
            </div>
          </div>

          {/* Hardship Mode Toggle & Voice Guide */}
          <div className="flex items-center gap-2 flex-wrap">
            <VoiceGuideButton
              text="Selamat datang di modul LEGA Gratitude. Bersyukur di sini bukan kepalsuan atau memaksakan rasa senang. Bersyukur adalah menyadari hal-hal nyata yang masih menopang kita di saat ini, sekecil apapun itu, tanpa mengabaikan kesulitan yang sedang dihadapi."
              title="Panduan LEGA Gratitude"
              subtitle="Refleksi Rasa Syukur Realistis"
              variant="pill"
            />
            <button
              onClick={() => setIsHardshipMode(!isHardshipMode)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-semibold border transition flex items-center gap-2 ${
                isHardshipMode
                  ? 'bg-rose-950 border-rose-800 text-rose-300 shadow-md shadow-rose-950/50'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <AlertCircle className={`w-4 h-4 ${isHardshipMode ? 'text-rose-400' : 'text-stone-500'}`} />
              <span>{isHardshipMode ? 'Mode Masa Sulit Aktif' : 'Sedang Masa Sulit / Berat?'}</span>
            </button>
          </div>
        </div>

        {/* Philosophy & Hardship Notice */}
        <div className="p-3.5 bg-amber-950/30 border border-amber-800/50 rounded-2xl text-[11px] text-amber-200/90 leading-relaxed space-y-1">
          <p className="font-semibold text-amber-300">
            {isHardshipMode
              ? ' Mode Masa Sulit: LEGA memahami hari ini terasa sangat berat. Anda tidak dipaksa mencari hal positif besar. Kita cukup mulai dari hal tersederhana seperti keberadaan napas atau kesempatan beristirahat.'
              : ' Filosofi LEGA Gratitude: Syukur lahir dari kesadaran jujur. Syukur tidak menghapus rasa sakit dan tidak menolak emosi, melainkan melihat kehidupan secara lebih seimbang.'}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-800 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('guided')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'guided'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Alur Latihan Terpandu (7-Tahap)</span>
          </button>

          <button
            onClick={() => setActiveTab('journal')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'journal'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Jurnal Syukur</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'audio'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Audio Syukur AI</span>
          </button>
        </div>
      </div>

      {/* TAB 1: GUIDED 7-STEP EXERCISE FLOW */}
      {activeTab === 'guided' && (
        <div className="space-y-6">
          {/* Progress Indicator Steps */}
          <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-2xl flex items-center justify-between overflow-x-auto gap-2 text-xs">
            {[
              { step: 1, label: '1. Berhenti' },
              { step: 2, label: '2. Napas' },
              { step: 3, label: '3. Keadaan' },
              { step: 4, label: '4. Refleksi' },
              { step: 5, label: '5. Apresiasi' },
              { step: 6, label: '6. Makna' },
              { step: 7, label: '7. Niat' }
            ].map((s) => (
              <button
                key={s.step}
                onClick={() => setGuidedStep(s.step)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  guidedStep === s.step
                    ? 'bg-amber-600 text-white shadow-md'
                    : guidedStep > s.step
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-stone-950 text-stone-500 border border-stone-800'
                }`}
              >
                {guidedStep > s.step ? <Check className="w-3 h-3 text-amber-400" /> : null}
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          {/* STEP 1: BERHENTI SEJENAK */}
          {guidedStep === 1 && (
            <div className="bg-stone-900/90 border border-stone-800 p-6 rounded-3xl space-y-5 text-center max-w-2xl mx-auto animate-fade-in">
              <div className="w-16 h-16 bg-amber-950/80 border border-amber-800 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                <Sun className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-stone-100">Tahap 1: Berhenti Sejenak (Pause)</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Lepaskan sejenak kesibukan, gawai, dan tumpukan pikiran. Luangkan 1 menit ini khusus untuk hadir utuh bersama diri sendiri. Tidak ada yang perlu dikejar saat ini.
                </p>
              </div>

              <button
                onClick={() => setGuidedStep(2)}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl text-xs transition shadow-lg flex items-center justify-center gap-2 mx-auto"
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
                <h3 className="text-lg font-bold text-stone-100">Tahap 2: Sadari Napas</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Tarik napas lembut melalui hidung... rasakan udara sejenak memenuhi dada Anda... lalu hembuskan perlahan melalui mulut. Lakukan 3 kali dengan lembut.
                </p>
              </div>

              <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl text-xs text-teal-300 italic">
                "Napas adalah hadiah paling setia yang menemani perjalanan hidup Anda tanpa pernah meminta balasan."
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
                  <span>Lanjut ke Tahap 3: Sadari Keadaan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SADARI KEADAAN SAAT INI */}
          {guidedStep === 3 && (
            <div className="bg-stone-900/90 border border-stone-800 p-6 rounded-3xl space-y-5 max-w-2xl mx-auto animate-fade-in">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-stone-100">Tahap 3: Sadari Keadaan Saat Ini</h3>
                <p className="text-xs text-stone-400">
                  Jujurlah pada perasaan yang sedang hadir saat ini. Tidak perlu memaksa bahagia jika sedang lelah.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-300">Pilih Kondisi Emosi Dominan Saat Ini:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Netral', 'Lelah', 'Cemas', 'Sedih', 'Kecewa', 'Gelisah', 'Tenang', 'Bersyukur'].map((emo) => (
                    <button
                      key={emo}
                      onClick={() => setCurrentEmotion(emo)}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition ${
                        currentEmotion === emo
                          ? 'bg-amber-600 border-amber-500 text-white font-bold shadow-md'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-800'
                      }`}
                    >
                      {emo}
                    </button>
                  ))}
                </div>
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
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl text-xs transition shadow-lg flex items-center gap-2"
                >
                  <span>Lanjut ke Tahap 4: Refleksi Hari Ini</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REFLEKSIKAN PENGALAMAN HARI INI (PILIH 14 AREA) */}
          {guidedStep === 4 && (
            <div className="bg-stone-900/90 border border-stone-800 p-6 rounded-3xl space-y-5 animate-fade-in">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-stone-100">Tahap 4: Refleksikan Area Pengalaman</h3>
                <p className="text-xs text-stone-400">
                  Pilih satu atau beberapa area berikut yang terasa paling bermakna atau ingin Anda sentuh hari ini:
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {REFLECTION_AREAS.map((area) => {
                  const isSelected = selectedAreas.includes(area.name);
                  return (
                    <button
                      key={area.id}
                      onClick={() => toggleArea(area.name)}
                      className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-950/80 border-amber-700 text-stone-100 shadow-md ring-1 ring-amber-500'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-xs text-amber-300">{area.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <p className="text-[10px] text-stone-400 mt-1 line-clamp-2">{area.desc}</p>
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
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl text-xs transition shadow-lg flex items-center gap-2"
                >
                  <span>Lanjut ke Tahap 5: Temukan Hal Yang Dihargai</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: TEMUKAN HAL YANG DIHARGAI & INPUT REFLEKSI */}
          {guidedStep === 5 && (
            <div className="bg-stone-900/90 border border-stone-800 p-6 rounded-3xl space-y-5 max-w-3xl mx-auto animate-fade-in">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-stone-100">Tahap 5: Temukan Hal Yang Ingin Dihargai</h3>
                <p className="text-xs text-stone-400">
                  {isHardshipMode
                    ? 'Dalam masa sulit, tuliskan hal yang sangat sederhana: keberadaan napas, tempat tidur yang aman, atau air hangat.'
                    : 'Tuliskan momen, pertolongan, kebaikan, atau pengalaman yang ingin Anda apresiasi hari ini:'}
                </p>
              </div>

              <div className="space-y-3">
                <textarea
                  value={reflectionInput}
                  onChange={(e) => setReflectionInput(e.target.value)}
                  placeholder={
                    isHardshipMode
                      ? 'Contoh: Hari ini sangat lelah dan penuh tekanan, tapi saya bersyukur setidaknya bisa beristirahat sejenak dan minum teh hangat...'
                      : 'Contoh: Bersyukur atas teman yang mendengarkan cerita saya, pekerjaan yang selesai tepat waktu, dan waktu luang malam ini...'
                  }
                  rows={4}
                  className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3.5 text-xs text-stone-100 outline-none focus:border-amber-500 leading-relaxed"
                />

                {/* Prompt Question Assist */}
                <div className="space-y-1.5 pt-2 border-t border-stone-800">
                  <p className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" /> Pertanyaan Pemandu Reflektif (Opsional):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {REFLECTIVE_QUESTIONS.slice(0, 4).map((q, idx) => (
                      <div key={idx} className="p-2.5 bg-stone-950 border border-stone-800 rounded-xl text-[11px] text-stone-300">
                        {q}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-3">
                <button
                  onClick={() => setGuidedStep(4)}
                  className="px-4 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-400"
                >
                  Kembali
                </button>

                <button
                  onClick={handleSubmitReflection}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-800 text-white font-bold rounded-2xl text-xs transition shadow-xl flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyusun Pendampingan Syukur...</span>
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

          {/* STEP 6 & 7: RASAKAN MAKNA & NIAT (OUTPUT DISPLAY) */}
          {guidedStep >= 6 && aiGratitudeOutput && (
            <div className="bg-stone-900/90 border border-stone-800 p-6 rounded-3xl space-y-6 animate-fade-in shadow-xl">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-sm text-stone-100">Tahap 6 & 7: Pemaknaan & Niat Sadar LEGA</h3>
                </div>
                <button
                  onClick={handleSaveToJournal}
                  disabled={savedJournalSuccess}
                  className="px-3.5 py-1.5 bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-300 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                >
                  {savedJournalSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
                  <span>{savedJournalSuccess ? 'Tersimpan di Jurnal' : 'Simpan ke LEGA Journal'}</span>
                </button>
              </div>

              {/* Summary */}
              <div className="p-4 bg-amber-950/30 border border-amber-800/60 rounded-2xl space-y-2">
                <p className="text-xs text-amber-200 leading-relaxed font-medium italic">
                  "{aiGratitudeOutput.summary}"
                </p>
              </div>

              {/* Gratitude Items & Meanings */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-amber-400" /> Apresiasi & Makna Pengalaman:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {aiGratitudeOutput.gratitudeItems?.map((item: any, idx: number) => (
                    <div key={idx} className="p-3.5 bg-stone-950 border border-stone-800 rounded-2xl space-y-1">
                      <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800 font-semibold">
                        {item.area}
                      </span>
                      <p className="text-xs font-bold text-stone-200">{item.detail}</p>
                      <p className="text-[11px] text-stone-400 italic">{item.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lessons Learned */}
              {aiGratitudeOutput.lessonsLearned && (
                <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl space-y-1.5">
                  <p className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                    <Feather className="w-4 h-4 text-amber-400" /> Kebijaksanaan / Pelajaran Hari Ini:
                  </p>
                  <p className="text-xs text-stone-300 leading-relaxed">{aiGratitudeOutput.lessonsLearned}</p>
                </div>
              )}

              {/* Conscious Next Action */}
              {aiGratitudeOutput.nextAction && (
                <div className="p-4 bg-teal-950/40 border border-teal-800/60 rounded-2xl space-y-1">
                  <p className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" /> Langkah Niat Sadar Berikutnya:
                  </p>
                  <p className="text-xs text-stone-200">{aiGratitudeOutput.nextAction}</p>
                </div>
              )}

              {/* Recommended Next Modules */}
              <div className="pt-3 border-t border-stone-800 space-y-2">
                <p className="text-xs font-bold text-stone-400">Rekomendasi Modul LEGA Lanjutan:</p>
                <div className="flex flex-wrap gap-2">
                  {aiGratitudeOutput.recommendedModules?.map((mod: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => onSelectModule && onSelectModule(mod.targetModuleKey)}
                      className="px-3 py-1.5 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-amber-300 rounded-xl text-xs font-medium transition flex items-center gap-1.5"
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

      {/* TAB 2: GRATITUDE JOURNAL TEMPLATE */}
      {activeTab === 'journal' && (
        <div className="bg-stone-900/90 border border-stone-800 p-6 rounded-3xl space-y-5 animate-fade-in">
          <div className="space-y-1 border-b border-stone-800 pb-3">
            <h3 className="font-bold text-sm text-stone-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" /> Panduan Jurnal Syukur 5-Elemen LEGA
            </h3>
            <p className="text-xs text-stone-400">
              Menuliskan 3 hal disyukuri, pelajaran, kebaikan diterima/diberikan, dan harapan sederhana esok hari.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 p-4 bg-stone-950 border border-stone-800 rounded-2xl">
              <span className="text-xs font-bold text-amber-300">1. Tiga Hal Yang Disyukuri:</span>
              <p className="text-xs text-stone-400 leading-relaxed">
                Mulai dari hal terkecil. Misalnya segelas air segar, senyuman rekan kerja, atau momen hening 5 menit.
              </p>
            </div>

            <div className="space-y-2 p-4 bg-stone-950 border border-stone-800 rounded-2xl">
              <span className="text-xs font-bold text-amber-300">2. Pelajaran Hari Ini:</span>
              <p className="text-xs text-stone-400 leading-relaxed">
                Kebijaksanaan yang disadari dari tantangan atau interaksi hari ini.
              </p>
            </div>

            <div className="space-y-2 p-4 bg-stone-950 border border-stone-800 rounded-2xl">
              <span className="text-xs font-bold text-amber-300">3. Kebaikan Yang Diterima:</span>
              <p className="text-xs text-stone-400 leading-relaxed">
                Bantuan, kata penyemangat, atau kemudahan yang menghampiri Anda.
              </p>
            </div>

            <div className="space-y-2 p-4 bg-stone-950 border border-stone-800 rounded-2xl">
              <span className="text-xs font-bold text-amber-300">4. Kebaikan Yang Diberikan:</span>
              <p className="text-xs text-stone-400 leading-relaxed">
                Hal kecil yang Anda bagikan kepada orang lain atau perlakuan lembut kepada diri sendiri.
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectModule && onSelectModule('journal')}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl text-xs transition flex items-center justify-center gap-2 shadow-xl"
          >
            <BookOpen className="w-4 h-4" />
            <span>Buka LEGA Journal Lengkap</span>
          </button>
        </div>
      )}

      {/* TAB 3: AUDIO SYUKUR INTEGRATION */}
      {activeTab === 'audio' && (
        <div className="bg-stone-900/90 border border-stone-800 p-6 rounded-3xl space-y-5 animate-fade-in">
          <div className="space-y-1 border-b border-stone-800 pb-3">
            <h3 className="font-bold text-sm text-stone-100 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-400" /> Audio Panduan Syukur LEGA AI
            </h3>
            <p className="text-xs text-stone-400">
              Audio panduan relaksasi dan refleksi syukur disintesis langsung melalui modul LEGA AI Audio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GRATITUDE_AUDIO_THEMES.map((theme, idx) => (
              <div key={idx} className="p-4 bg-stone-950 border border-stone-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-amber-300">{theme.title}</h4>
                  <span className="text-[10px] text-stone-500 font-mono">{theme.duration}</span>
                </div>
                <p className="text-xs text-stone-400">{theme.desc}</p>
                <button
                  onClick={() => onSelectModule && onSelectModule('audio-ai')}
                  className="px-3 py-1.5 bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-300 rounded-xl text-[11px] font-semibold transition flex items-center gap-1.5"
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
          <Layers className="w-4 h-4 text-amber-400" /> Terhubung dengan Seluruh Ekosistem Modul LEGA:
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'LEGA AI Coach', key: 'ai-coach' },
            { name: 'LEGA Self Awareness', key: 'self-discovery' },
            { name: 'LEGA Emotion Analyzer', key: 'emotion-analysis' },
            { name: 'LEGA Presence', key: 'mindfulness' },
            { name: 'LEGA Observer', key: 'observer' },
            { name: 'LEGA Release', key: 'emotional-release' },
            { name: 'LEGA Journal', key: 'journal' },
            { name: 'LEGA AI Audio', key: 'audio-ai' },
            { name: 'LEGA Insight', key: 'ai-insights' },
            { name: 'LEGA Progress', key: 'progress' }
          ].map((mod, idx) => (
            <button
              key={idx}
              onClick={() => onSelectModule && onSelectModule(mod.key as ModuleType)}
              className="px-3 py-1.5 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-amber-300 rounded-xl text-xs font-medium transition flex items-center gap-1.5"
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
