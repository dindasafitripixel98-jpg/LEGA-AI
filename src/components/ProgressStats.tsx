import React, { useState, useEffect } from 'react';
import {
  LineChart as LineChartIcon,
  Flame,
  BrainCircuit,
  BookOpen,
  Download,
  Sparkles,
  Calendar,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Compass,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Moon,
  TrendingUp,
  Activity,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';
import { EmotionLog, UserProfile, JournalEntry } from '../types';
import { generateProgressAnalysis } from '../lib/geminiApi';

interface ProgressStatsProps {
  userProfile: UserProfile;
  emotionLogs: EmotionLog[];
  journals?: JournalEntry[];
  onSelectModule?: (moduleKey: string) => void;
}

export const ProgressStats: React.FC<ProgressStatsProps> = ({
  userProfile,
  emotionLogs,
  journals = [],
  onSelectModule,
}) => {
  const [period, setPeriod] = useState<'7_days' | '14_days' | '30_days' | '90_days' | 'custom'>('7_days');
  const [isSpiritualMode, setIsSpiritualMode] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Trigger initial progress analysis or update on period change
  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await generateProgressAnalysis({
        period,
        userProfile,
        emotionLogs,
        journalEntries: journals,
        audioListened: [],
        spiritualMode: isSpiritualMode,
      });
      setAnalysisResult(result);
    } catch (err) {
      console.error('Error generating progress analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    handleRunAnalysis();
  }, [period, isSpiritualMode]);

  // Chart Data preparation based on selected period
  const getFilteredLogs = () => {
    const now = Date.now();
    let days = 7;
    if (period === '14_days') days = 14;
    if (period === '30_days') days = 30;
    if (period === '90_days') days = 90;
    if (period === 'custom') days = 365;

    const cutoff = now - days * 24 * 60 * 60 * 1000;
    return emotionLogs.filter((log) => new Date(log.timestamp).getTime() >= cutoff);
  };

  const filteredLogs = getFilteredLogs();

  const chartData = filteredLogs.map((log) => ({
    date: new Date(log.timestamp).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    }),
    intensitas: log.intensity,
    emosi: log.emotion,
  }));

  // Emotion count distribution
  const emotionCounts: Record<string, number> = {};
  filteredLogs.forEach((log) => {
    emotionCounts[log.emotion] = (emotionCounts[log.emotion] || 0) + 1;
  });

  const barData = Object.entries(emotionCounts).map(([key, value]) => ({
    emosi: key.toUpperCase(),
    jumlah: value,
  }));

  const handleExportData = () => {
    const exportPayload = {
      userProfile,
      emotionLogs,
      journals,
      progressAnalysis: analysisResult,
      exportedAt: new Date().toISOString(),
    };
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `LEGA_Progress_Export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence?.toUpperCase()) {
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Data Menunjukkan (Tinggi)
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Terlihat Kecenderungan (Sedang)
          </span>
        );
      case 'LOW':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 text-[10px] font-medium flex items-center gap-1">
            <HelpCircle className="w-3 h-3" /> Mungkin (Eksploratif)
          </span>
        );
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 text-stone-100">
      {/* Header & Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-stone-900 border border-stone-800 p-5 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <LineChartIcon className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl md:text-2xl font-bold text-stone-100">LEGA Progress Analysis</h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
              v2.0
            </span>
          </div>
          <p className="text-xs md:text-sm text-stone-400">
            Analisis perkembangan kebiasaan refleksi & regulasi emosi secara objektif dan non-judgmental.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Period Selector */}
          <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
            <button
              onClick={() => setPeriod('7_days')}
              className={`px-2.5 py-1.5 rounded-lg transition font-medium ${
                period === '7_days' ? 'bg-emerald-600 text-white' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              7 Hari
            </button>
            <button
              onClick={() => setPeriod('14_days')}
              className={`px-2.5 py-1.5 rounded-lg transition font-medium ${
                period === '14_days' ? 'bg-emerald-600 text-white' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              14 Hari
            </button>
            <button
              onClick={() => setPeriod('30_days')}
              className={`px-2.5 py-1.5 rounded-lg transition font-medium ${
                period === '30_days' ? 'bg-emerald-600 text-white' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              30 Hari
            </button>
            <button
              onClick={() => setPeriod('90_days')}
              className={`px-2.5 py-1.5 rounded-lg transition font-medium ${
                period === '90_days' ? 'bg-emerald-600 text-white' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              90 Hari
            </button>
          </div>

          {/* Spiritual Mode Toggle */}
          <button
            onClick={() => setIsSpiritualMode(!isSpiritualMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition flex items-center gap-1.5 ${
              isSpiritualMode
                ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-amber-400" />
            <span>Spiritual Islami</span>
          </button>

          {/* Export Button */}
          <button
            onClick={handleExportData}
            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl text-xs font-medium transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ekspor</span>
          </button>
        </div>
      </div>

      {/* Primary Principle & Disclaimer Banner */}
      <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300/90 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-emerald-300">Prinsip LEGA Progress: </span>
          Progress adalah gambaran kebiasaan refleksi aplikasi dari waktu ke waktu, bukan ukuran nilai diri,
          bukan diagnosis kesehatan mental, dan bukan tingkat kesembuhan klinis.
        </div>
      </div>

      {/* Progress Level Card */}
      {analysisResult?.progressLevel && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-900 to-stone-900 border border-emerald-500/30 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Layers className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold">
                  Tingkat Kebiasaan Refleksi
                </span>
                <h3 className="text-lg font-bold text-emerald-300">
                  {analysisResult.progressLevel.title || 'LEVEL 1: MULAI SADAR'}
                </h3>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              Tahap {analysisResult.progressLevel.level || 1} dari 6
            </span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed pt-1">
            {analysisResult.progressLevel.description}
          </p>
        </div>
      )}

      {/* Minimum Data Alert */}
      {analysisResult?.dataMinimumMet === false && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-200 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-300">Data Masih Terbatas</p>
            <p className="text-amber-200/80 leading-relaxed">
              {analysisResult.minimumDataMessage ||
                'Data Anda masih terlalu sedikit untuk melihat pola perkembangan jangka panjang. Lakukan setidaknya 3 pencatatan emosi untuk membuka tren otomatis.'}
            </p>
          </div>
        </div>
      )}

      {/* Key Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-400 font-medium">Rutinitas</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-400">{userProfile.streakDays} Hari</p>
          <p className="text-[10px] text-stone-500">Konsistensi harian</p>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-400 font-medium">Refleksi Emosi</span>
            <BrainCircuit className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">{filteredLogs.length} Sesi</p>
          <p className="text-[10px] text-stone-500">Dalam {period.replace('_days', ' Hari')}</p>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-400 font-medium">Catatan Jurnal</span>
            <BookOpen className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-sky-400">{journals.length} Entri</p>
          <p className="text-[10px] text-stone-500">Ungkapan jujur batin</p>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-400 font-medium">Regulasi Emosi</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-400">
            {analysisResult?.emotionTrends?.trendDirection || 'Stabil'}
          </p>
          <p className="text-[10px] text-stone-500">
            Rata-rata: {analysisResult?.emotionTrends?.intensityAverage || 'Sedang'}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart: Intensity Trend */}
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Tren Intensitas Emosi</span>
            </h3>
            <span className="text-[10px] text-stone-500">Skala 1 - 10</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#71717a" fontSize={10} />
                <YAxis domain={[0, 10]} stroke="#71717a" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#27272a',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#f4f4f5',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="intensitas"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ fill: '#10b981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Emotion Frequency */}
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-400" />
              <span>Distribusi Emosi Utamamu</span>
            </h3>
            <span className="text-[10px] text-stone-500">Frekuensi kemunculan</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="emosi" stroke="#71717a" fontSize={10} />
                <YAxis stroke="#71717a" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#27272a',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#f4f4f5',
                  }}
                />
                <Bar dataKey="jumlah" fill="#14b8a6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Key Insights Section (DATA -> POLA -> INTERPRETASI -> REKOMENDASI) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>AI Insight Perkembangan Refleksi</span>
          </h3>

          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Menganalisis...' : 'Perbarui Insight'}</span>
          </button>
        </div>

        {isAnalyzing ? (
          <div className="p-8 rounded-2xl bg-stone-900 border border-stone-800 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-emerald-400 animate-bounce mx-auto" />
            <p className="text-xs text-stone-300">
              Menganalisis pola refleksi, emosi, dan kebiasaan latihan Anda secara objektif...
            </p>
          </div>
        ) : analysisResult?.keyInsights?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysisResult.keyInsights.map((insight: any, idx: number) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3 relative flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                      Insight {idx + 1}
                    </span>
                    {getConfidenceBadge(insight.confidence)}
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="font-semibold text-stone-400">DATA: </span>
                      <span className="text-stone-200">{insight.data}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-emerald-400">POLA: </span>
                      <span className="text-stone-300">{insight.pattern}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-sky-400">KEMUNGKINAN MAKNA: </span>
                      <span className="text-stone-300/90">{insight.possibleMeaning}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-800 text-xs">
                  <span className="font-semibold text-amber-300">REKOMENDASI: </span>
                  <span className="text-stone-300">{insight.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Period Insight Format Summary Box */}
      {analysisResult?.periodInsightFormat && (
        <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm border-b border-stone-800 pb-3">
            <Calendar className="w-4 h-4" />
            <span>
              {analysisResult.periodInsightFormat.title || 'Rangkuman Perkembangan Periode Ini'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 space-y-1">
              <p className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                Sering Muncul
              </p>
              <p className="font-medium text-stone-200">
                {analysisResult.periodInsightFormat.mostFrequent}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 space-y-1">
              <p className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                Latihan Terbanyak
              </p>
              <p className="font-medium text-emerald-300">
                {analysisResult.periodInsightFormat.mostUsedPractice}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 space-y-1">
              <p className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                Hal yang Terlihat
              </p>
              <p className="font-medium text-stone-300">
                {analysisResult.periodInsightFormat.observedPattern}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2 text-xs">
            <div>
              <span className="text-sky-400 font-semibold">Bahan Pertimbangan: </span>
              <span className="text-stone-300">
                "{analysisResult.periodInsightFormat.reflectionToConsider}"
              </span>
            </div>
            <div>
              <span className="text-amber-400 font-semibold">Langkah Kecil Berikutnya: </span>
              <span className="text-stone-200 font-medium">
                {analysisResult.periodInsightFormat.nextSmallStep}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Next Actions / Modules */}
      {analysisResult?.recommendedExercises?.length > 0 && (
        <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Rekomendasi Latihan Berdasarkan Data Refleksimu</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {analysisResult.recommendedExercises.map((ex: string, idx: number) => (
              <button
                key={idx}
                onClick={() => {
                  if (onSelectModule) {
                    if (ex.toLowerCase().includes('presence')) onSelectModule('mindfulness');
                    else if (ex.toLowerCase().includes('breathing')) onSelectModule('breathing');
                    else if (ex.toLowerCase().includes('overthinking')) onSelectModule('overthinking');
                    else if (ex.toLowerCase().includes('journal')) onSelectModule('journal');
                    else onSelectModule('mindfulness');
                  }
                }}
                className="p-3.5 rounded-xl bg-stone-950 hover:bg-stone-800/80 border border-stone-800 transition text-left group flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-emerald-300 group-hover:text-emerald-200">
                    {ex}
                  </p>
                  <p className="text-[10px] text-stone-500">Klik untuk mulai latihan</p>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-emerald-400 transition transform group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Safety Disclaimer Footer */}
      <div className="text-[11px] text-stone-500 text-center leading-relaxed pt-2">
        {analysisResult?.safetyDisclaimer ||
          'Analisis progress ini adalah cerminan kebiasaan refleksi aplikasi LEGA dan bukan diagnosis medis atau indikator kesehatan mental klinis.'}
      </div>
    </div>
  );
};
