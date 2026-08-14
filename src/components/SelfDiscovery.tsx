import React, { useState } from 'react';
import {
  Compass,
  CheckCircle,
  HelpCircle,
  Sparkles,
  PieChart,
  Save,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { SELF_DISCOVERY_QUESTIONS } from '../data/initialData';
import { SelfDiscoveryItem } from '../types';
import { VoiceGuideButton } from './VoiceGuideButton';

export const SelfDiscovery: React.FC = () => {
  const [items, setItems] = useState<SelfDiscoveryItem[]>(SELF_DISCOVERY_QUESTIONS);
  const [activeAnswers, setActiveAnswers] = useState<Record<string, string>>({});
  const [wheelScores, setWheelScores] = useState<Record<string, number>>({
    'Kedamaian Batin': 7,
    'Kesehatan Fisik': 6,
    'Regulasi Emosi': 5,
    'Kualitas Hubungan': 8,
    'Pertumbuhan Diri': 7,
    'Keseimbangan Kerja': 6,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAnswerChange = (id: string, text: string) => {
    setActiveAnswers((prev) => ({ ...prev, [id]: text }));
  };

  const handleWheelChange = (key: string, val: number) => {
    setWheelScores((prev) => ({ ...prev, [key]: val }));
  };

  const handleSaveAll = () => {
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        userAnswer: activeAnswers[item.id] || item.userAnswer,
      }))
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-8 text-stone-100 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-bold text-stone-100 flex items-center gap-2">
            <Compass className="w-6 h-6 text-emerald-400" />
            <span>Mengenal Diri (Self Discovery)</span>
          </h2>
          <p className="text-xs md:text-sm text-stone-400">
            Refleksi terpandu untuk mengenali pola pikir, pemicu utama, nilai hidup, dan keseimbangan batinmu.
          </p>
        </div>

        <VoiceGuideButton
          text="Selamat datang di modul Mengenal Diri LEGA. Perjalanan mengenal diri adalah fondasi kedamaian sejati. Luangkan waktu untuk menilai roda keseimbangan hidup Anda dan renungkan pertanyaan batin berikut dengan kejujuran dan welas asih pada diri sendiri."
          title="Panduan Mengenal Diri LEGA"
          subtitle="Refleksi Eksplorasi Batin"
          variant="pill"
        />
      </div>

      {/* Wheel of Life Balance Assessment */}
      <div className="bg-stone-900/80 p-6 rounded-2xl border border-stone-800 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-stone-100 flex items-center gap-2 text-sm md:text-base">
            <PieChart className="w-5 h-5 text-teal-400" />
            <span>Roda Keseimbangan Kesadaran Diri</span>
          </h3>
          <span className="text-xs text-stone-400">Skala 1 - 10</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(wheelScores).map(([key, val]) => (
            <div key={key} className="p-4 rounded-xl bg-stone-800/60 border border-stone-700/60 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-stone-200">{key}</span>
                <span className="font-bold text-emerald-400">{val}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={val}
                onChange={(e) => handleWheelChange(key, Number(e.target.value))}
                className="w-full accent-emerald-500 bg-stone-700 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Guided Self Assessment Questions */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-stone-100 text-sm md:text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Pertanyaan Refleksi Kedalaman Diri</span>
          </h3>
          {savedSuccess && (
            <span className="text-xs font-medium text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full">
              ✓ Refleksi Tersimpan!
            </span>
          )}
        </div>

        <div className="space-y-4">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className="font-semibold text-sm text-stone-200">{item.title}</h4>
                </div>

                <VoiceGuideButton
                  text={`Pertanyaan ke-${idx + 1}: ${item.title}. ${item.question}. ${item.reflectionNote ? `Catatan refleksi: ${item.reflectionNote}` : ''}`}
                  title={`${item.title}`}
                  subtitle="Bimbingan Pertanyaan Refleksi"
                  variant="compact"
                />
              </div>

              <p className="text-xs text-stone-300 leading-relaxed font-medium">
                {item.question}
              </p>

              <textarea
                value={activeAnswers[item.id] ?? item.userAnswer ?? ''}
                onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                placeholder="Tuliskan refleksi jujurmu di sini..."
                rows={3}
                className="w-full bg-stone-800/70 border border-stone-700 focus:border-emerald-500 rounded-xl p-3 text-xs text-stone-100 placeholder-stone-500 outline-none transition"
              />

              {item.reflectionNote && (
                <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800 text-[11px] text-stone-400 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item.reflectionNote}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleSaveAll}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Seluruh Refleksi Diri</span>
        </button>
      </div>
    </div>
  );
};
