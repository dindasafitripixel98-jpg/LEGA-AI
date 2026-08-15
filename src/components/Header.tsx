import React from 'react';
import { Menu, PhoneCall, Sparkles, Flame, User, Smartphone, Wifi, WifiOff, Clock, Key } from 'lucide-react';
import { ModuleType, UserProfile } from '../types';
import { usePwa } from '../lib/pwaManager';
import { useDemoAuth } from '../lib/demoAuthManager';

interface HeaderProps {
  currentModule: ModuleType;
  userProfile: UserProfile;
  onToggleMobile: () => void;
  onOpenCrisis: () => void;
  onSelectModule: (module: ModuleType) => void;
  onOpenPwaModal?: () => void;
  demoState?: ReturnType<typeof useDemoAuth>;
  onOpenDemoModal?: () => void;
}

const MODULE_TITLES: Record<ModuleType, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard Utama', subtitle: 'Ruang tenang untuk mengecek kondisi emosi & rutinitas kesadaran diri' },
  'ai-coach': { title: 'AI Coach (LEGA)', subtitle: 'Pendamping refleksi dialogis yang tenang, ramah, dan bebas menghakimi' },
  'emotion-analysis': { title: 'Analisis Emosi', subtitle: 'Pahami kaitan antara emosi, pemicu, dan sensasi fisik tubuhmu' },
  'self-discovery': { title: 'Mengenal Diri', subtitle: 'Eksplorasi nilai hidup, pola pikir, dan kompas kebutuhan batin' },
  journal: { title: 'Jurnal Refleksi', subtitle: 'Tumpahkan isi pikiran dan dapatkan refleksi lembut berbasis AI' },
  'ai-insights': { title: 'Insight AI Mingguan', subtitle: 'Sintesis tren emosional dan pertumbuhan kesadaran dirimu' },
  mindfulness: { title: 'LEGA Presence', subtitle: 'Kembali hadir secara utuh pada momen saat ini melalui panca indra' },
  gratitude: { title: 'LEGA Gratitude', subtitle: 'Membangun kebiasaan bersyukur melalui refleksi sadar, realistis, dan tulus' },
  forgiveness: { title: 'LEGA Forgiveness', subtitle: 'Mengeksplorasi proses memaafkan, penerimaan, dan penguraian beban emosional' },
  'inner-child': { title: 'LEGA Inner Child', subtitle: 'Refleksi pengalaman masa lalu, kenangan, dan belas kasih merawat diri saat ini' },
  overthinking: { title: 'LEGA Overthinking', subtitle: 'Mengenali pola pikiran berulang, mengurai fakta vs asumsi, dan kembali ke saat ini' },
  anxiety: { title: 'LEGA Anxiety', subtitle: 'Edukasi kecemasan, kenali gejala & pemicu, serta latihan regulasi emosi terpandu' },
  stress: { title: 'LEGA Stress', subtitle: 'Edukasi stres, kenali sumber & respon tubuh, serta latihan kesadaran mengelola stres' },
  anger: { title: 'LEGA Anger', subtitle: 'Memahami emosi marah, kenali pemicu & respon tubuh, serta merespons dengan sadar' },
  sadness: { title: 'LEGA Sadness', subtitle: 'Memahami emosi sedih, memberi ruang bagi perasaan, dan melatih pemulihan bertahap' },
  guilt: { title: 'LEGA Guilt', subtitle: 'Memahami rasa bersalah, membedakan fakta vs penilaian diri, dan menemukan langkah perbaikan yang sehat' },
  shame: { title: 'LEGA Shame', subtitle: 'Memahami rasa malu, memisahkan identitas diri dari penilaian negatif, dan membangun penerimaan diri' },
  fear: { title: 'LEGA Fear', subtitle: 'Memahami rasa takut, membedakan bahaya nyata vs kekhawatiran, dan merespons secara aman & sadar' },
  'life-purpose': { title: 'LEGA Life Purpose', subtitle: 'Mengeksplorasi arah hidup, nilai pribadi, kekuatan, makna, dan menyusun tujuan secara bertahap' },
  'spiritual-reflection': { title: 'LEGA Spiritual Reflection', subtitle: 'Refleksi diri bernuansa Islami (muhasabah, sabar, syukur, ikhtiar & tawakal)' },
  observer: { title: 'LEGA Observer', subtitle: 'Latihan menjadi saksi terhadap pikiran, emosi, dan sensasi tubuh tanpa menghakimi' },
  'body-awareness': { title: 'LEGA Body Awareness', subtitle: 'Kesadaran somatis, pemindaian tubuh, dan pelepasan ketegangan fisik' },
  breathing: { title: 'Latihan Pernapasan', subtitle: 'Visualisasi ritme napas terpandu untuk meregulasi sistem saraf' },
  'emotional-release': { title: 'Pelepasan Emosi', subtitle: 'Wadah aman untuk mengekspresikan dan melepaskan beban pikiran' },
  'audio-ai': { title: 'Audio AI & Relaksasi', subtitle: 'Pendengaran terpandu, lanskap suara alam, dan narasi Gemini TTS' },
  'mind-body': { title: 'Emosi & Kesehatan Somatis', subtitle: 'Peta interaktif hubungan emosi dan sensasi fisik pada tubuh' },
  articles: { title: 'Artikel Psikoedukasi', subtitle: 'Pengetahuan praktis tentang regulasi emosi dan kesehatan mental' },
  progress: { title: 'Progress & Statistik', subtitle: 'Grafik perjalanan kesadaran diri dan konsistensi refleksi' },
  profile: { title: 'Profil Saya', subtitle: 'Atur preferensi refleksi dan histori kesadaran diri' },
  settings: { title: 'Pengaturan', subtitle: 'Konfigurasi aplikasi, persona AI, dan privasi data' },
  admin: { title: 'Admin Panel & Lisensi', subtitle: 'Informasi pengembang SHAQILA DIGITAL 99 & integrasi Gemini API' },
};

export const Header: React.FC<HeaderProps> = ({
  currentModule,
  userProfile,
  onToggleMobile,
  onOpenCrisis,
  onSelectModule,
  onOpenPwaModal,
  demoState,
  onOpenDemoModal,
}) => {
  const { isOnline, isInstalled } = usePwa();

  const currentInfo = MODULE_TITLES[currentModule] || {
    title: 'LEGA SHAQILA DIGITAL 99',
    subtitle: 'Lepaskan • Eksplorasi • Gali • Amati',
  };

  return (
    <header className="sticky top-0 z-30 bg-stone-900/90 backdrop-blur-md border-b border-stone-800/80 px-4 py-3.5 flex items-center justify-between transition-all">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="md:hidden p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base md:text-lg font-bold text-stone-100 flex items-center gap-2">
            {currentInfo.title}
          </h2>
          <p className="text-xs text-stone-400 hidden sm:block">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* 24-Hour Demo Account Quick Status / Trigger Button */}
        {onOpenDemoModal && (
          <button
            onClick={onOpenDemoModal}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-sm ${
              demoState?.isDemoActive
                ? 'bg-emerald-950/80 border-emerald-600/70 text-emerald-300 hover:bg-emerald-900'
                : 'bg-stone-800 hover:bg-stone-700 border-amber-500/40 text-amber-300'
            }`}
            title="Kelola Akun Demo 24 Jam"
          >
            <Clock className={`w-3.5 h-3.5 ${demoState?.isDemoActive ? 'animate-pulse text-emerald-400' : 'text-amber-400'}`} />
            {demoState?.isDemoActive ? (
              <span className="font-mono tracking-wider text-[11px] font-bold">
                {demoState.timeRemaining.formatted}
              </span>
            ) : (
              <span className="text-[11px] font-medium hidden sm:inline">Demo 24 Jam</span>
            )}
          </button>
        )}

        {/* PWA / Offline Status Indicator */}
        {onOpenPwaModal && (
          <button
            onClick={onOpenPwaModal}
            className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition active:scale-95 ${
              !isOnline
                ? 'bg-amber-950/50 border-amber-800/60 text-amber-300 hover:bg-amber-900/60'
                : isInstalled
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/50'
                : 'bg-stone-800 hover:bg-stone-700 border-stone-700 text-stone-300'
            }`}
            title={
              !isOnline
                ? 'Mode Offline Aktif (Klik info PWA)'
                : isInstalled
                ? 'Aplikasi LEGA Terpasang (PWA)'
                : 'Pasang Aplikasi LEGA (PWA)'
            }
          >
            {!isOnline ? (
              <WifiOff className="w-4 h-4 text-amber-400" />
            ) : (
              <Smartphone className="w-4 h-4 text-emerald-400" />
            )}
            <span className="hidden sm:inline text-[11px]">
              {!isOnline ? 'Offline' : isInstalled ? 'PWA Aktif' : 'Pasang App'}
            </span>
          </button>
        )}

        {/* Streak Counter */}
        <div
          onClick={() => onSelectModule('progress')}
          className="cursor-pointer bg-stone-800/80 hover:bg-stone-800 border border-stone-700/60 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs text-stone-200 transition"
          title="Hari Berturut-turut Melakukan Refleksi"
        >
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="font-semibold text-amber-400">{userProfile.streakDays}</span>
          <span className="text-[11px] text-stone-400 hidden sm:inline">Hari</span>
        </div>

        {/* Quick Crisis Hotline */}
        <button
          onClick={onOpenCrisis}
          className="p-2 sm:px-3 sm:py-1.5 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/60 text-rose-300 rounded-xl text-xs font-medium flex items-center gap-1.5 transition"
        >
          <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">119 Krisis</span>
        </button>

        {/* Profile Shortcut */}
        <button
          onClick={() => onSelectModule('profile')}
          className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 transition flex items-center justify-center"
          title="Profil Saya"
        >
          <User className="w-4 h-4 text-emerald-400" />
        </button>
      </div>
    </header>
  );
};
