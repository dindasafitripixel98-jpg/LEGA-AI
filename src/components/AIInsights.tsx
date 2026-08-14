import React, { useState } from 'react';
import { Sparkles, BrainCircuit, RefreshCw, CheckCircle, Lightbulb } from 'lucide-react';
import { EmotionLog, JournalEntry } from '../types';
import { generateAiInsight } from '../lib/geminiApi';
import { VoiceGuideButton } from './VoiceGuideButton';

interface AIInsightsProps {
  emotionLogs: EmotionLog[];
  journals: JournalEntry[];
}

export const AIInsights: React.FC<AIInsightsProps> = ({ emotionLogs, journals }) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<any>({
    overallTrend: 'Kamu menunjukkan komitmen luar biasa untuk menyadari emosi dan jeda setiap hari.',
    dominantEmotions: ['cemas', 'tenang', 'lelah'],
    mainTriggers: ['pekerjaan', 'tenggat waktu', 'kurang tidur'],
    growthProgress: 'Terjadi peningkatan waktu pemulihan (recovery time) setelah emosi cemas muncul.',
    weeklyWisdom: 'Kemajuan tidak selalu diukur dari seberapa tenang kamu setiap saat, melainkan seberapa cepat kamu menyadari dan menyayangi dirimu saat badai emosi datang.',
  });

  const handleGenerateInsight = async () => {
    setLoading(true);
    const data = await generateAiInsight(emotionLogs, journals);
    setInsight(data);
    setLoading(false);
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 text-stone-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-bold text-stone-100 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            <span>Insight AI & Pertumbuhan Kesadaran</span>
          </h2>
          <p className="text-xs md:text-sm text-stone-400">
            Sintesis pola emosi, pemicu utama, dan hikmah refleksi mingguan dari Gemini 3.1.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <VoiceGuideButton
            text={`Insight mingguan Anda: ${insight.overallTrend} Pesan refleksi: ${insight.weeklyWisdom}`}
            title="Narasi Insight AI"
            subtitle="Ringkasan Pola & Pertumbuhan Emosi"
            variant="pill"
          />
          <button
            onClick={handleGenerateInsight}
            disabled={loading}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-950/40 w-fit"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{loading ? 'Membuat Insight...' : 'Generasi Insight Baru'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall Trend Card */}
        <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <BrainCircuit className="w-5 h-5" />
            <span>Kecenderungan Emosional</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            {insight.overallTrend}
          </p>
        </div>

        {/* Growth Progress Card */}
        <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-teal-400 font-semibold text-sm">
            <CheckCircle className="w-5 h-5" />
            <span>Progres Pertumbuhan Diri</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            {insight.growthProgress}
          </p>
        </div>

        {/* Dominant Emotions & Triggers */}
        <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
          <h4 className="font-semibold text-xs text-stone-400 uppercase tracking-wider">
            Emosi Dominan & Pemicu Utama
          </h4>
          <div className="space-y-2">
            <p className="text-xs text-stone-400">Emosi Terbanyak:</p>
            <div className="flex flex-wrap gap-2">
              {insight.dominantEmotions?.map((e: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg text-xs capitalize font-medium"
                >
                  {e}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-stone-400">Pemicu Utama:</p>
            <div className="flex flex-wrap gap-2">
              {insight.mainTriggers?.map((t: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-amber-950 text-amber-300 border border-amber-800 rounded-lg text-xs capitalize font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Wisdom Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-stone-900 to-emerald-950/60 border border-emerald-800/80 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <Lightbulb className="w-5 h-5" />
            <span>Pesan Bijak Refleksi Mingguan</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-200 italic leading-relaxed">
            "{insight.weeklyWisdom}"
          </p>
        </div>
      </div>
    </div>
  );
};
