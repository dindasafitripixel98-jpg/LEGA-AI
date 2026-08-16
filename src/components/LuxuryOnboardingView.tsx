/**
 * LEGA - Luxury Onboarding Experience
 * Personalisasi Ruang Tenang, Pilihan Suara & Frekuensi Somatis
 * SHAQILA DIGITAL 99
 */

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  Headphones,
  Brain,
  Volume2,
  Play,
  Pause,
  Compass,
  Heart,
  Moon,
  Zap,
  ShieldCheck,
  Check
} from 'lucide-react';
import {
  VOICE_CHARACTERS,
  playCalmMeditationChime
} from '../lib/audioEngine';
import { previewVoiceCharacterAudio, stopVoicePreview } from '../lib/voiceService';
import { UserProfile } from '../types';

interface LuxuryOnboardingViewProps {
  initialUserName?: string;
  onCompleteOnboarding: (customProfile: Partial<UserProfile> & { selectedVoice?: string; initialSoundscape?: string }) => void;
  onBackToLogin: () => void;
}

export const LuxuryOnboardingView: React.FC<LuxuryOnboardingViewProps> = ({
  initialUserName = 'Teman LEGA',
  onCompleteOnboarding,
  onBackToLogin
}) => {
  const [step, setStep] = useState<number>(1);
  const [userName, setUserName] = useState<string>(initialUserName);
  const [primaryGoal, setPrimaryGoal] = useState<string>('overthinking');
  const [selectedSoundscape, setSelectedSoundscape] = useState<string>('hujan');
  const [selectedVoice, setSelectedVoice] = useState<string>('Suara Tenang');
  const [activeVoicePreview, setActiveVoicePreview] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  const goalOptions = [
    {
      id: 'overthinking',
      icon: '🧠',
      title: 'Meredakan Overthinking & Sulit Tidur',
      desc: 'Menenangkan pikiran yang terlalu aktif di malam hari'
    },
    {
      id: 'anxiety',
      icon: '⚡',
      title: 'Melepaskan Cemas Berlebih & Dada Sesak',
      desc: 'Menurunkan detak jantung cepat dan ketegangan panik'
    },
    {
      id: 'burnout',
      icon: '🥀',
      title: 'Memulihkan Energi dari Burnout & Lelah Kerja',
      desc: 'Mengisi ulang vitalitas batin dan kejernihan pikiran'
    },
    {
      id: 'emotional_release',
      icon: '🌊',
      title: 'Merilis Marah, Kecewa, atau Sedih Mendalam',
      desc: 'Pelepasan emosi yang aman tanpa rasa bersalah'
    },
    {
      id: 'self_discovery',
      icon: '🧭',
      title: 'Mengenal Diri & Memahami Pola Batin',
      desc: 'Refleksi mendalam untuk pertumbuhan kesadaran diri'
    }
  ];

  const soundscapeOptions = [
    {
      id: 'hujan',
      name: 'Hujan Lembut di Kaca',
      freq: '432 Hz Alpha',
      icon: '🌧️',
      desc: 'Menciptakan selimut suara kedap dari kebisingan luar'
    },
    {
      id: 'sungai',
      name: 'Aliran Sungai Pegunungan',
      freq: '528 Hz Solfeggio',
      icon: '💧',
      desc: 'Aliran air jernih yang membasuh kelelahan mental'
    },
    {
      id: 'hutan',
      name: 'Kanopi Hutan Pinus Teduh',
      freq: '396 Hz Grounding',
      icon: '🌲',
      desc: 'Resonansi alam liar untuk menstabilkan saraf somatis'
    },
    {
      id: 'ombak',
      name: 'Ombak Samudra Lambat',
      freq: '174 Hz Anchor',
      icon: '🌊',
      desc: 'Ritme pasang surut yang menyelaraskan napas lambat'
    },
    {
      id: 'fajar',
      name: 'Hening Fajar Kosmis',
      freq: '639 Hz Harmony',
      icon: '✨',
      desc: 'Frekuensi hening untuk kejernihan batin dan ketenangan'
    }
  ];

  const handlePreviewVoice = (vName: string) => {
    if (activeVoicePreview === vName) {
      stopVoicePreview();
      setActiveVoicePreview(null);
    } else {
      setActiveVoicePreview(vName);
      previewVoiceCharacterAudio(
        vName,
        undefined,
        () => setActiveVoicePreview(null),
        () => setActiveVoicePreview(null)
      );
    }
  };

  const handleNextStep = () => {
    playCalmMeditationChime('bell', 0.12);
    if (step === 3) {
      setIsSynthesizing(true);
      setTimeout(() => {
        setIsSynthesizing(false);
        setStep(4);
      }, 1200);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handleFinish = () => {
    playCalmMeditationChime('bowl', 0.2);
    const selectedGoalObj = goalOptions.find((g) => g.id === primaryGoal);
    onCompleteOnboarding({
      name: userName.trim() || 'Teman LEGA',
      reflectionGoal: selectedGoalObj?.title || 'Menemukan ketenangan batin dan kejernihan pikiran.',
      preferredTone: selectedVoice.toLowerCase().includes('tenang') ? 'tenang' : 'empati',
      selectedVoice: selectedVoice,
      initialSoundscape: selectedSoundscape
    });
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans flex flex-col justify-between relative overflow-hidden selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background Aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-amber-500/15 via-emerald-500/10 to-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner SHAQILA DIGITAL 99 */}
      <div className="bg-gradient-to-r from-stone-950 via-amber-950/70 to-stone-950 border-b border-amber-500/40 px-4 py-1.5 text-center relative z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="px-2 py-0.5 rounded bg-amber-400 text-stone-950 font-black text-[10px] tracking-wider uppercase">
              SHAQILA DIGITAL 99
            </span>
            <span className="text-amber-200 font-semibold text-[11px]">
              LEGA — Personalisasi Ruang Tenang & Audio Relaksasi
            </span>
          </div>
        </div>
      </div>

      {/* Top Bar */}
      <header className="px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-stone-800/80 bg-stone-950/70 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          {step > 1 ? (
            <button
              onClick={() => setStep((prev) => prev - 1)}
              className="flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-stone-100 py-1 px-2.5 rounded-xl hover:bg-stone-900 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>
          ) : (
            <button
              onClick={onBackToLogin}
              className="flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-stone-100 py-1 px-2.5 rounded-xl hover:bg-stone-900 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Ke Menu Masuk</span>
            </button>
          )}
          <span className="hidden sm:inline px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black tracking-wider uppercase">
            SHAQILA DIGITAL 99
          </span>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s === step
                  ? 'w-8 bg-amber-400'
                  : s < step
                  ? 'w-4 bg-emerald-500'
                  : 'w-4 bg-stone-800'
              }`}
            />
          ))}
          <span className="text-[11px] font-mono text-stone-400 ml-2">Langkah {step} dari 4</span>
        </div>
      </header>

      {/* Main Multi-Step Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="w-full max-w-2xl bg-stone-900/90 border border-stone-700/80 rounded-3xl p-6 sm:p-9 space-y-6 shadow-2xl shadow-black backdrop-blur-xl animate-fade-in">
          {/* STEP 1: BEBAN & GOAL */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium">
                  <Brain className="w-3.5 h-3.5 text-amber-400" />
                  <span>Personalisasi Batin • Langkah 1</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100 font-serif">
                  Apa yang Paling Ingin Anda Pulihkan?
                </h2>
                <p className="text-xs sm:text-sm text-stone-400">
                  LEGA akan menyesuaikan kurasi audio, modul somatis, dan dialog AI dengan kondisi batin Anda saat ini:
                </p>
              </div>

              {/* Name Input */}
              <div className="bg-stone-950 border border-stone-800 rounded-2xl p-3.5 space-y-1.5">
                <label className="text-xs font-semibold text-stone-300">
                  Bagaimana Anda ingin disapa dalam sesi relaksasi?
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Nama panggilan atau nama samaran"
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-stone-100 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                />
              </div>

              {/* Goal Selection Cards */}
              <div className="space-y-2.5">
                {goalOptions.map((g) => {
                  const isSelected = primaryGoal === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setPrimaryGoal(g.id)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-950/80 to-stone-900 border-amber-400 ring-1 ring-amber-400 shadow-lg shadow-amber-950'
                          : 'bg-stone-950 hover:bg-stone-850 border-stone-800 hover:border-stone-700 text-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{g.icon}</span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-stone-100">{g.title}</h4>
                          <p className="text-[11px] text-stone-400">{g.desc}</p>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-amber-400 bg-amber-400 text-stone-950'
                            : 'border-stone-700 bg-stone-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleNextStep}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-stone-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/25 transition flex items-center justify-center gap-2"
              >
                <span>Lanjutkan ke Pilihan Suasana Alam</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          )}

          {/* STEP 2: SOUNDSCAPE PREFERENCE */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium">
                  <Headphones className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Akustik Somatis • Langkah 2</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100 font-serif">
                  Pilih Suasana Frekuensi Favorit
                </h2>
                <p className="text-xs sm:text-sm text-stone-400">
                  Suara alam mana yang paling cepat membawa rasa aman ke tubuh dan pikiran Anda?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {soundscapeOptions.map((s) => {
                  const isSelected = selectedSoundscape === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSoundscape(s.id)}
                      className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-2 ${
                        isSelected
                          ? 'bg-gradient-to-br from-emerald-950/80 via-stone-900 to-amber-950/60 border-emerald-400 ring-1 ring-emerald-400 shadow-lg shadow-emerald-950'
                          : 'bg-stone-950 hover:bg-stone-850 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{s.icon}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-900 border border-stone-800 text-amber-300 font-mono">
                          {s.freq}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-stone-100">{s.name}</h4>
                        <p className="text-[10px] text-stone-400 mt-0.5">{s.desc}</p>
                      </div>
                      <div
                        className={`w-full py-1 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 mt-1 ${
                          isSelected ? 'bg-emerald-400 text-stone-950' : 'bg-stone-900 text-stone-400'
                        }`}
                      >
                        {isSelected ? '✓ Terpilih Sebagai Default' : 'Klik untuk Memilih'}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleNextStep}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-stone-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/25 transition flex items-center justify-center gap-2"
              >
                <span>Lanjutkan ke Pilihan 6 Suara Pemandu</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          )}

          {/* STEP 3: 6 VOICE CHARACTERS SELECTION */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium">
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Karakter Suara Pemandu • Langkah 3</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100 font-serif">
                  Pilih Suara Pemandu Batin Anda
                </h2>
                <p className="text-xs sm:text-sm text-stone-400">
                  Dengarkan dan pilih suara yang paling menenangkan telinga Anda (bisa diganti kapan saja):
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                {VOICE_CHARACTERS.map((v) => {
                  const isSelected = selectedVoice === v.name;
                  const isPlaying = activeVoicePreview === v.name;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVoice(v.name)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'bg-gradient-to-br from-amber-950/80 to-stone-900 border-amber-400 ring-1 ring-amber-400 shadow-lg shadow-amber-950'
                          : 'bg-stone-950 hover:bg-stone-850 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs sm:text-sm font-bold text-stone-100">{v.name}</h4>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-400 font-mono">
                              {v.gender === 'female' ? 'Feminin' : 'Maskulin'}
                            </span>
                          </div>
                          <p className="text-[11px] text-amber-300/90 font-medium">{v.badge}</p>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewVoice(v.name);
                          }}
                          className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 transition ${
                            isPlaying
                              ? 'bg-amber-400 text-stone-950 animate-pulse'
                              : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
                          }`}
                        >
                          {isPlaying ? (
                            <>
                              <Pause className="w-3 h-3 fill-stone-950" />
                              <span>Hentikan</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 fill-stone-200" />
                              <span>Tes Suara</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-[11px] text-stone-400 italic bg-stone-900/60 p-2 rounded-xl border border-stone-800/60">
                        "{v.samplePhrase}"
                      </p>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleNextStep}
                disabled={isSynthesizing}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-stone-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/25 transition flex items-center justify-center gap-2"
              >
                <span>{isSynthesizing ? 'Menyiapkan Resonansi Ruang Tenang...' : 'Finalisasi & Buka Ruang Tenang'}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          )}

          {/* STEP 4: SUCCESS & ACTIVATION */}
          {step === 4 && (
            <div className="space-y-6 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-emerald-400 p-[2px] mx-auto shadow-2xl shadow-amber-500/30">
                <div className="w-full h-full bg-stone-950 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  Personalisasi Berhasil Diselaraskan
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100 font-serif">
                  Selamat Datang di Ruang Tenang, {userName}!
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 max-w-lg mx-auto">
                  Seluruh frekuensi somatis, karakter suara pemandu, dan modul emosional telah disesuaikan khusus untuk perjalanan pemulihan Anda.
                </p>
              </div>

              {/* Summary Prescription Card */}
              <div className="bg-stone-950 border border-amber-500/30 rounded-2xl p-4 sm:p-5 text-left space-y-3">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                  <span className="text-xs font-mono text-amber-300 font-bold uppercase">
                    Konfigurasi Batin Anda
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Status: Aktif</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-stone-500 block text-[10px]">Fokus Utama:</span>
                    <strong className="text-stone-200">
                      {goalOptions.find((g) => g.id === primaryGoal)?.title}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">Suara Pemandu:</span>
                    <strong className="text-amber-300">{selectedVoice}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">Soundscape Awal:</span>
                    <strong className="text-emerald-300">
                      {soundscapeOptions.find((s) => s.id === selectedSoundscape)?.name}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">Durasi Akses Penuh:</span>
                    <strong className="text-stone-200">24 Jam Bebas Eksplorasi</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-stone-950 font-extrabold text-sm sm:text-base shadow-2xl shadow-amber-500/40 hover:shadow-amber-400/60 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5"
              >
                <Zap className="w-5 h-5 text-stone-950 fill-stone-950" />
                <span>Masuk ke Aplikasi LEGA Sekarang</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-stone-500 relative z-10">
        LEGA AI Platform • Personalisasi Batin Berbasis Neuro-Akustik
      </footer>
    </div>
  );
};
