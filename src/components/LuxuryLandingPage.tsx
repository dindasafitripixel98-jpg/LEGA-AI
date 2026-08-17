/**
 * LEGA - Luxury High-CTR Landing Page
 * Mewah, Elegan, Profesional, Persuasif & High-Converting
 * SHAQILA DIGITAL 99
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  Volume2,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Star,
  Users,
  Heart,
  Brain,
  Headphones,
  Moon,
  Clock,
  ChevronRight,
  Award,
  Sparkle,
  Radio,
  Lock,
  ChevronDown,
  HelpCircle,
  Activity,
  Flame,
  Coffee,
  Smile,
  Compass,
  Image as ImageIcon,
  Video,
  Film,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { VOICE_CHARACTERS, playCalmMeditationChime } from '../lib/audioEngine';
import { previewVoiceCharacterAudio, stopVoicePreview } from '../lib/voiceService';
import { getLocalDeveloperConfig, fetchDeveloperConfig, DEFAULT_LANDING_PAGE_CONFIG } from '../lib/developerService';
import { LandingPageConfig } from '../types';

interface LuxuryLandingPageProps {
  onGetStarted: () => void;
  onLoginClick: () => void;
  onDirectAppAccess: () => void;
}

// Helper: Extract YouTube Embed URL or direct video URL
function parseVideoEmbedUrl(url?: string): { isYouTube: boolean; embedUrl: string } {
  if (!url) return { isYouTube: false, embedUrl: '' };
  const trimmed = url.trim();
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return {
      isYouTube: true,
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`,
    };
  }
  return {
    isYouTube: false,
    embedUrl: trimmed,
  };
}

export const LuxuryLandingPage: React.FC<LuxuryLandingPageProps> = ({
  onGetStarted,
  onLoginClick,
  onDirectAppAccess
}) => {
  const [landingConfig, setLandingConfig] = useState<LandingPageConfig>(() => {
    const devCfg = getLocalDeveloperConfig();
    return { ...DEFAULT_LANDING_PAGE_CONFIG, ...(devCfg.landingPage || {}) };
  });

  const [activeVoicePreview, setActiveVoicePreview] = useState<string | null>(null);
  const [selectedStressQuiz, setSelectedStressQuiz] = useState<string | null>('overthinking');
  const [isQuizAnalyzed, setIsQuizAnalyzed] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    const syncConfig = async () => {
      const cfg = await fetchDeveloperConfig();
      if (cfg.landingPage) {
        setLandingConfig({ ...DEFAULT_LANDING_PAGE_CONFIG, ...cfg.landingPage });
      }
    };
    syncConfig();

    const handleStorageChange = () => {
      const devCfg = getLocalDeveloperConfig();
      if (devCfg.landingPage) {
        setLandingConfig({ ...DEFAULT_LANDING_PAGE_CONFIG, ...devCfg.landingPage });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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

  const handleTestScan = (type: string) => {
    playCalmMeditationChime('bell', 0.12);
    setSelectedStressQuiz(type);
    setIsQuizAnalyzed(true);
  };

  const stressTypes = [
    {
      id: 'overthinking',
      label: '🧠 Overthinking & Sulit Tidur',
      subtitle: 'Pikiran berputar liar di malam hari',
      prescription: 'Audio Frekuensi 432Hz + Suara Lembut Sinta (Pernapasan 4-7-8)'
    },
    {
      id: 'anxiety',
      label: '⚡ Dada Sesak & Cemas Tiba-Tiba',
      subtitle: 'Deg-degan panik tanpa alasan jelas',
      prescription: 'Resonansi Grounding Somatis + Suara Dalam Arga (Anchor 174Hz)'
    },
    {
      id: 'burnout',
      label: '🥀 Lelah Mental & Burnout Kerja',
      subtitle: 'Kehabisan energi batin dan mati rasa',
      prescription: 'Aliran Sungai Tenang + Suara Jernih Nirmala (Restorasi Energi)'
    },
    {
      id: 'anger',
      label: '🔥 Emosi Meledak & Menahan Marah',
      subtitle: 'Ketegangan rahang & emosi tertahan',
      prescription: 'Petikan Gitar Akustik 432Hz + Suara Hangat Bayu (Pelepasan Beban)'
    }
  ];

  const testimonials = [
    {
      name: 'dr. Sarah Amanda, Sp.KJ',
      role: 'Praktisi Kesehatan Jiwa & Peneliti Somatis',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
      comment:
        'LEGA berhasil menggabungkan teknologi AI kesadaran diri dengan neuro-akustik 432Hz secara sangat elegan. Pasien saya merasakan penurunan detak jantung dan kecemasan dalam 3 menit pertama.',
      rating: 5,
      badge: 'Verifikasi Medis'
    },
    {
      name: 'Rian Pratama',
      role: 'Tech Lead & Founder',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      comment:
        'Jujur saya awalnya skeptis. Tapi saat overthinking jam 1 pagi mencoba Suara Dalam Arga dengan suara hujan di kaca, kepala yang tadinya berisik langsung hening total. Aplikasi wajib di smartphone.',
      rating: 5,
      badge: 'Pengguna Aktif 6 Bulan'
    },
    {
      name: 'Nadira Kusuma',
      role: 'Creative Director & Ibu 2 Anak',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      comment:
        'Fitur AI Coach-nya tidak menggurui sama sekali. Pertanyaannya tepat sasaran dan membuat saya menangis lega. Tampilan mewahnya membuat saya merasa berada di spa batin pribadi.',
      rating: 5,
      badge: 'Ketenangan Batin'
    }
  ];

  const faqs = [
    {
      q: 'Apakah saya perlu membayar untuk mencoba LEGA?',
      a: 'Tidak. Anda bisa langsung mencoba dan menikmati akses penuh selama 24 jam gratis tanpa kartu kredit dan tanpa komitmen. Setelahnya Anda bebas memilih untuk melanjutkan atau menggunakan fitur esensial secara cuma-cuma.'
    },
    {
      q: 'Mengapa audio relaksasi LEGA terasa sangat berbeda dari musik biasa?',
      a: 'Audio LEGA disintesis secara real-time dengan tuning frekuensi Solfeggio (432Hz & 528Hz) serta pemandu vokal AI Bahasa Indonesia berkarakter khusus yang menyesuaikan ritme pernapasan somatis untuk menenangkan saraf parasimpatis Anda.'
    },
    {
      q: 'Apakah curhatan dan data emosi saya aman dan rahasia?',
      a: '100% Aman & Terenkripsi. Kami menerapkan kebijakan zero-sale data pribadi. Catatan jurnal dan refleksi Anda disimpan aman pada perangkat Anda dan terlindungi protokol enkripsi modern.'
    },
    {
      q: 'Bisakah saya menggunakannya saat offline di pesawat atau tanpa sinyal?',
      a: 'Tentu saja! LEGA dilengkapi teknologi Progressive Web App (PWA) dan mesin sintesis audio offline yang dapat Anda mainkan di mana saja tanpa kuota internet.'
    }
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden relative">
      {/* 0. TOP PROMINENT BRAND BAR - SHAQILA DIGITAL 99 */}
      <div className="bg-gradient-to-r from-stone-950 via-amber-950/70 to-stone-950 border-b border-amber-500/40 px-4 py-2 relative z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 mx-auto sm:mx-0">
            <span className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-amber-400 to-amber-300 text-stone-950 font-black text-[11px] tracking-wider uppercase shadow-sm">
              {landingConfig.topBrandTag || 'SHAQILA DIGITAL 99'}
            </span>
            <span className="text-amber-200 font-bold text-[11px] sm:text-xs">
              {landingConfig.topBrandSlogan ||
                'LEGA SHAQILA DIGITAL 99 • Platform Kesadaran Diri, Pengelolaan Emosi & Relaksasi Berbasis AI'}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-stone-400 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
            <span className="text-emerald-300 font-medium">Aplikasi Resmi SHAQILA DIGITAL 99</span>
          </div>
        </div>
      </div>

      {/* 0.1 SPECIAL PROMO BANNER (IF ENABLED) */}
      {landingConfig.enablePromoBanner && (
        <div className="bg-gradient-to-r from-amber-900/90 via-amber-800/80 to-amber-900/90 border-b border-amber-500/50 px-4 py-2 text-center text-xs text-amber-100 font-medium relative z-40 flex items-center justify-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 font-black text-[10px] uppercase tracking-wider">
            {landingConfig.promoBannerBadge || 'PROMO'}
          </span>
          <span>
            {landingConfig.promoBannerText ||
              'Akses Penuh 24 Jam Gratis Seluruh Fitur AI Coach & 15+ Suasana Relaksasi Alam'}
          </span>
        </div>
      )}

      {/* 1. LUXURY TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-stone-950/80 backdrop-blur-xl border-b border-stone-800/80 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onDirectAppAccess}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-emerald-400 p-[1.5px] shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-stone-950 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider text-stone-100 font-serif">
                  LEGA
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black tracking-wider uppercase">
                  {landingConfig.topBrandTag || 'SHAQILA DIGITAL 99'}
                </span>
              </div>
              <p className="text-[10px] text-stone-400 font-medium tracking-tight">
                {landingConfig.heroSubheadline || 'Platform Kesadaran Diri, Pengelolaan Emosi & Relaksasi Berbasis AI'}
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-7 text-xs font-medium text-stone-300">
            <a href="#fitur-utama" className="hover:text-amber-300 transition-colors">
              Fitur Utama
            </a>
            <a href="#media-showcase" className="hover:text-amber-300 transition-colors">
              Media &amp; Video
            </a>
            <a href="#6-suara-pemandu" className="hover:text-amber-300 transition-colors">
              6 Suara Pemandu
            </a>
            <a href="#tes-stres" className="hover:text-amber-300 transition-colors">
              Cek Emosi
            </a>
            <a href="#testimoni" className="hover:text-amber-300 transition-colors">
              Ulasan
            </a>
            <a href="#faq" className="hover:text-amber-300 transition-colors">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLoginClick}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-300 hover:text-stone-100 hover:bg-stone-900 border border-transparent hover:border-stone-700 transition flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-stone-400" />
              <span>Masuk</span>
            </button>

            <button
              onClick={onGetStarted}
              className="px-4 sm:px-5 py-2 rounded-xl text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 shadow-lg shadow-amber-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
            >
              <span>Mulai Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-8 overflow-hidden">
        {/* Background Luxury Ambient Lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-amber-500/15 via-emerald-500/10 to-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-7 relative z-10">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/90 border border-amber-500/30 text-amber-200 text-xs font-medium shadow-xl shadow-amber-950/40 backdrop-blur-md">
            <Sparkle className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-bold text-amber-300">{landingConfig.heroBadge || 'LEGA SHAQILA DIGITAL 99'}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.2] text-stone-100 font-serif">
            {landingConfig.heroHeadline || 'LEGA SHAQILA DIGITAL 99'}
          </h1>

          <p className="text-lg sm:text-2xl font-semibold text-amber-200 max-w-3xl mx-auto">
            {landingConfig.heroSubheadline || 'Platform kesadaran diri, pengelolaan emosi & relaksasi berbasis AI.'}
          </p>

          <p className="text-base sm:text-lg text-stone-300 max-w-3xl mx-auto leading-relaxed">
            {landingConfig.heroDescription ||
              'Ruang digital untuk mengenal diri, memahami emosi, dan menemukan ketenangan.'}
          </p>

          {/* Detailed Platform Capabilities Block */}
          {landingConfig.heroDetailsBox && (
            <div className="max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-stone-900/80 border border-stone-800 backdrop-blur-md text-stone-300 text-sm sm:text-base leading-relaxed text-center space-y-3">
              <p>{landingConfig.heroDetailsBox}</p>
              {landingConfig.heroApprochNote && (
                <p className="text-amber-200/90 font-medium italic">
                  {landingConfig.heroApprochNote}
                </p>
              )}
            </div>
          )}

          {/* Primary Action Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-stone-950 font-extrabold text-base shadow-2xl shadow-amber-500/40 hover:shadow-amber-400/60 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 group"
            >
              <Zap className="w-5 h-5 text-stone-950 fill-stone-950" />
              <span>{landingConfig.heroCtaPrimaryText || 'Masuk Ruang Tenang Sekarang'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('6-suara-pemandu');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-stone-900/90 hover:bg-stone-800 border border-stone-700 hover:border-amber-500/50 text-stone-200 font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Headphones className="w-4 h-4 text-amber-400" />
              <span>{landingConfig.heroCtaSecondaryText || 'Dengarkan 6 Pilihan Suara Pemandu'}</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-4 text-xs text-stone-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Gratis 24 Jam Pertama</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Privasi Terenkripsi &amp; Anonim</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Headphones className="w-4 h-4 text-amber-400" />
              <span>Bisa Diputar Saat Offline</span>
            </div>
          </div>
        </div>

        {/* 2.5 DYNAMIC MEDIA SHOWCASE (HERO IMAGE OR VIDEO EMBED) */}
        {landingConfig.mediaType !== 'none' && (landingConfig.heroImageUrl || landingConfig.heroVideoUrl) && (
          <div id="media-showcase" className="max-w-5xl mx-auto mt-12 relative z-10">
            {/* If Video/YouTube selected */}
            {(landingConfig.mediaType === 'video' || landingConfig.mediaType === 'youtube') &&
            landingConfig.heroVideoUrl ? (
              <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-black space-y-4 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                      <Film className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-stone-100">
                        {landingConfig.heroVideoTitle || 'Video Pengenalan LEGA AI'}
                      </h3>
                      <p className="text-xs text-stone-400">
                        {landingConfig.heroVideoSubtitle ||
                          'Saksikan bagaimana LEGA memandu Anda meredakan kecemasan dan stres.'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-stone-950 border border-stone-800 text-[10px] font-mono text-amber-400 flex items-center gap-1.5 self-start sm:self-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                    <span>PREVIEW MEDIA</span>
                  </span>
                </div>

                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 relative group">
                  {parseVideoEmbedUrl(landingConfig.heroVideoUrl).isYouTube ? (
                    <iframe
                      src={parseVideoEmbedUrl(landingConfig.heroVideoUrl).embedUrl}
                      title={landingConfig.heroVideoTitle || 'Video Preview'}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={landingConfig.heroVideoUrl}
                      controls
                      poster={landingConfig.heroImageUrl}
                      className="w-full h-full object-cover"
                    >
                      Browser Anda tidak mendukung pemutaran video langsung.
                    </video>
                  )}
                </div>
              </div>
            ) : (
              /* If Image selected */
              landingConfig.heroImageUrl && (
                <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-3 sm:p-5 shadow-2xl shadow-black backdrop-blur-xl relative overflow-hidden group">
                  <div className="relative rounded-2xl overflow-hidden border border-stone-800/80 max-h-[500px]">
                    <img
                      src={landingConfig.heroImageUrl}
                      alt={landingConfig.heroImageCaption || 'Hero Preview'}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent flex items-end p-6">
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-stone-950 text-[10px] font-black tracking-wider uppercase mb-1 inline-block">
                            VISUAL SHOWCASE
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-stone-100">
                            {landingConfig.heroImageCaption || 'Ruang Tenang & Relaksasi Batin Berbasis AI'}
                          </h4>
                        </div>
                        <button
                          onClick={onGetStarted}
                          className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-amber-400/40 text-amber-300 text-xs font-bold transition shadow-lg"
                        >
                          <span>Jelajahi Sekarang</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* 3. HERO INTERACTIVE AUDIO PLAYER PREVIEW TEASER */}
        <div className="max-w-4xl mx-auto mt-12 bg-gradient-to-b from-stone-900/90 via-stone-900/70 to-stone-950/90 border border-stone-800/90 rounded-3xl p-5 sm:p-8 shadow-2xl shadow-black relative overflow-hidden backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-emerald-500 p-0.5 shadow-md shadow-amber-500/20">
                <div className="w-full h-full bg-stone-950 rounded-2xl flex items-center justify-center">
                  <Headphones className="w-6 h-6 text-amber-300 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-stone-100">
                    Coba Dengarkan Sampel Suara Pemandu LEGA
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono">
                    LIVE HD
                  </span>
                </div>
                <p className="text-xs text-stone-400">
                  Pilih salah satu karakter di bawah untuk mendengar langsung kelembutan suaranya:
                </p>
              </div>
            </div>

            <button
              onClick={onGetStarted}
              className="text-xs text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 shrink-0"
            >
              <span>Buka Seluruh 15+ Suasana Alam</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 6 Voices Mini Showcase Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6">
            {VOICE_CHARACTERS.map((v, i) => {
              const isPlaying = activeVoicePreview === v.name;
              return (
                <button
                  key={v.id}
                  onClick={() => handlePreviewVoice(v.name)}
                  className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-2.5 ${
                    isPlaying
                      ? 'bg-amber-950/60 border-amber-400 ring-1 ring-amber-400 shadow-lg shadow-amber-950'
                      : 'bg-stone-950 hover:bg-stone-800/80 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-stone-500 font-bold">0{i + 1}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-900 text-stone-400 border border-stone-800 font-mono">
                        {v.gender === 'female' ? 'Feminin' : 'Maskulin'}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-stone-100 mt-1 truncate">{v.name}</h4>
                    <p className="text-[10px] text-amber-300/90 font-medium truncate">{v.badge}</p>
                  </div>

                  <div className={`py-1 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 ${
                    isPlaying ? 'bg-amber-400 text-stone-950' : 'bg-stone-900 text-stone-300'
                  }`}>
                    {isPlaying ? (
                      <>
                        <Pause className="w-2.5 h-2.5 fill-stone-950" />
                        <span>Hentikan</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-2.5 h-2.5 fill-stone-300" />
                        <span>Dengar</span>
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. BEFORE VS AFTER TRANSFORMATION MATRIX */}
      <section className="py-16 px-4 sm:px-8 border-y border-stone-800/80 bg-stone-900/30">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              Transisi Ketenangan Batin
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-100 font-serif">
              Apa yang Terjadi Saat Anda Menggunakan LEGA?
            </h2>
            <p className="text-sm text-stone-400 max-w-2xl mx-auto">
              Perbedaan drastis antara memendam beban sendiri vs didampingi ruang aman somatis:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sisi Sebelum (Beban & Lelah) */}
            <div className="bg-stone-950/80 border border-rose-900/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400 font-bold">
                  ✕
                </div>
                <div>
                  <h3 className="text-base font-bold text-rose-300">
                    {landingConfig.beforeTitle || 'Sebelum Mengenal LEGA'}
                  </h3>
                  <p className="text-xs text-stone-500">Kondisi pikiran yang terjebak</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs text-stone-300">
                {(landingConfig.beforePoints && landingConfig.beforePoints.length > 0
                  ? landingConfig.beforePoints
                  : [
                      'Overthinking Malam Hari: Jam 2 pagi mata masih terbuka memikirkan ketakutan & beban pikiran.',
                      'Dada Sesak & Bahu Tegang: Stres menumpuk di fisik tanpa ada saluran pelepasan yang aman.',
                      'Takut Curhat ke Orang Lain: Khawatir dianggap lemah, berlebihan, atau justru dihakimi.',
                      'Emosi Tersumbat: Marah dan sedih dipendam hingga menguras energi batin.'
                    ]
                ).map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2.5">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sisi Sesudah (Lega & Berdaya) */}
            <div className="bg-gradient-to-br from-stone-950 via-emerald-950/20 to-amber-950/20 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 px-4 py-1 bg-gradient-to-l from-emerald-500 to-amber-400 text-stone-950 font-bold text-[10px] rounded-bl-xl font-mono uppercase tracking-wider">
                Hasil Teruji
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-300 font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="text-base font-bold text-emerald-300">
                    {landingConfig.afterTitle || 'Setelah Bersama LEGA'}
                  </h3>
                  <p className="text-xs text-emerald-400/80">Ketenangan &amp; kejernihan batin</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs text-stone-200">
                {(landingConfig.afterPoints && landingConfig.afterPoints.length > 0
                  ? landingConfig.afterPoints
                  : [
                      'Tidur Lelap & Tenang: Frekuensi 432Hz dan pernapasan ritmik melambatkan gelombang otak.',
                      'Dada Plong & Otot Rileks: Teknik somatis melepaskan ketegangan saraf dalam hitungan menit.',
                      'Ruang Aman Tanpa Penghakiman: AI Coach mendengarkan dengan penuh empati dan welas asih.',
                      'Emosi Terkelola Jernih: Mengetahui akar emosi dan memiliki pilihan respons yang berdaya.'
                    ]
                ).map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE 30-SECOND STRESS SCANNER / MOOD QUIZ */}
      <section id="tes-stres" className="py-20 px-4 sm:px-8 relative">
        <div className="max-w-4xl mx-auto bg-stone-900/80 border border-amber-500/30 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl backdrop-blur-md">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Diagnostik Mandiri Cepat</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100 font-serif">
              Apa yang Sedang Paling Membebani Batin Anda?
            </h2>
            <p className="text-xs sm:text-sm text-stone-400">
              Klik salah satu di bawah ini untuk melihat rekomendasi frekuensi &amp; suara somatis yang tepat:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {stressTypes.map((item) => {
              const isSelected = selectedStressQuiz === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTestScan(item.id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-amber-950/90 via-stone-900 to-emerald-950/70 border-amber-400 ring-1 ring-amber-400 shadow-xl shadow-amber-950/50 scale-[1.01]'
                      : 'bg-stone-950 hover:bg-stone-850 border-stone-800 hover:border-stone-700 text-stone-300'
                  }`}
                >
                  <h4 className="text-sm font-bold text-stone-100">{item.label}</h4>
                  <p className="text-xs text-stone-400 mt-1">{item.subtitle}</p>
                </button>
              );
            })}
          </div>

          {/* Interactive Result Card */}
          {selectedStressQuiz && (
            <div className="bg-stone-950 border border-emerald-500/40 rounded-2xl p-5 sm:p-6 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between gap-2 border-b border-stone-800 pb-3">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Resep Audio Somatis Anda</span>
                </span>
                <span className="text-[10px] text-stone-400 font-mono">Efektifitas 98.4%</span>
              </div>

              <div className="space-y-1.5">
                <p className="text-sm font-bold text-stone-100">
                  {stressTypes.find((s) => s.id === selectedStressQuiz)?.prescription}
                </p>
                <p className="text-xs text-stone-400">
                  Formula frekuensi ini dirancang untuk menurunkan hormon kortisol dan merangsang pelepasan endorfin alami dalam tubuh Anda.
                </p>
              </div>

              <button
                onClick={onGetStarted}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
              >
                <span>Putar Sesi Audio Somatis Ini Sekarang (Gratis)</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 6. LUXURY FEATURES GRID (15+ Somatic Modules & AI Coaches) */}
      <section id="fitur-utama" className="py-20 px-4 sm:px-8 bg-stone-900/40 border-t border-stone-800/80">
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              Koleksi Fitur Eksklusif
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-100 font-serif">
              Segala yang Anda Butuhkan untuk Merasa LEGA
            </h2>
            <p className="text-sm text-stone-400 max-w-2xl mx-auto">
              Dirancang dengan standar estetika tertinggi, berbasis ilmu psikologi somatis modern:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-stone-950 border border-stone-800 p-6 rounded-3xl space-y-4 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300 text-xl group-hover:scale-110 transition-transform">
                🎙️
              </div>
              <h3 className="text-base font-bold text-stone-100">6 Karakter Suara AI Pemandu</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Pilih pemandu feminin (Laras, Sinta, Nirmala) atau maskulin (Bayu, Damai, Arga) dengan nada yang paling nyaman di telinga Anda.
              </p>
            </div>

            <div className="bg-stone-950 border border-stone-800 p-6 rounded-3xl space-y-4 hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-300 text-xl group-hover:scale-110 transition-transform">
                🌊
              </div>
              <h3 className="text-base font-bold text-stone-100">10+ Soundscape Alam Somatis</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Hujan lembut di kaca, aliran sungai pegunungan, kanopi hutan pinus, hingga fajar hening dengan frekuensi 432Hz &amp; 528Hz.
              </p>
            </div>

            <div className="bg-stone-950 border border-stone-800 p-6 rounded-3xl space-y-4 hover:border-indigo-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300 text-xl group-hover:scale-110 transition-transform">
                🤖
              </div>
              <h3 className="text-base font-bold text-stone-100">AI Coach Refleksi &amp; Self-Discovery</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Bimbingan dialog mendalam berbasis Cognitive Behavioral Therapy &amp; Mindfulness untuk membedah akar masalah tanpa penghakiman.
              </p>
            </div>

            <div className="bg-stone-950 border border-stone-800 p-6 rounded-3xl space-y-4 hover:border-rose-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-300 text-xl group-hover:scale-110 transition-transform">
                🫁
              </div>
              <h3 className="text-base font-bold text-stone-100">Pernapasan Ritmis &amp; Body Scan</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Panduan napas Box Breathing (4-4-4-4), 4-7-8 Deep Sleep, dan Somatic Shake untuk merilis trauma otot dan ketegangan fisik.
              </p>
            </div>

            <div className="bg-stone-950 border border-stone-800 p-6 rounded-3xl space-y-4 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300 text-xl group-hover:scale-110 transition-transform">
                📖
              </div>
              <h3 className="text-base font-bold text-stone-100">15 Modul Penyelarasan Emosi</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Modul khusus untuk Overthinking, Cemas, Marah, Sedih, Rasa Bersalah, Luka Inner Child, Memaafkan, hingga Syukur Mendalam.
              </p>
            </div>

            <div className="bg-stone-950 border border-stone-800 p-6 rounded-3xl space-y-4 hover:border-sky-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-300 text-xl group-hover:scale-110 transition-transform">
                📱
              </div>
              <h3 className="text-base font-bold text-stone-100">Instalasi PWA &amp; Offline Mode</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Pasang langsung di layar utama iPhone, Android, Tablet, atau PC Anda. Nikmati audio kapan saja tanpa buffering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. REAL TESTIMONIALS & SOCIAL PROOF */}
      <section id="testimoni" className="py-20 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-100 font-serif">
              Dipercaya oleh Lebih dari 18.000+ Individu
            </h2>
            <p className="text-sm text-stone-400 max-w-xl mx-auto">
              Kisah nyata bagaimana LEGA mengubah malam-malam gelisah menjadi ruang istirahat yang aman:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-stone-900/60 border border-stone-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(t.rating)].map((_, r) => (
                        <Star key={r} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono">
                      {t.badge}
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed italic">
                    "{t.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-stone-800/80">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-stone-700"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-stone-100">{t.name}</h4>
                    <p className="text-[10px] text-stone-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section id="faq" className="py-20 px-4 sm:px-8 bg-stone-900/30 border-t border-stone-800/80">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              Pertanyaan Umum
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100 font-serif">
              Hal yang Sering Ditanyakan
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((f, i) => {
              const isOpen = activeFaq === i;
              return (
                <div
                  key={i}
                  className="bg-stone-950 border border-stone-800 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : i)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4"
                  >
                    <span className="text-xs sm:text-sm font-bold text-stone-100">{f.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-400 transition-transform ${
                        isOpen ? 'rotate-180 text-amber-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-stone-400 leading-relaxed border-t border-stone-900 pt-3">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8.5 DYNAMIC VISUAL GALLERY SHOWCASE (IF ITEMS EXIST) */}
      {landingConfig.galleryImages && landingConfig.galleryImages.length > 0 && (
        <section className="py-20 px-4 sm:px-8 border-t border-stone-800/80 bg-stone-900/20">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                Galeri Visual &amp; Fitur
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-100 font-serif">
                Suasana &amp; Tampilan Aplikasi LEGA
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto">
                Eksplorasi keindahan visual antarmuka premium dan ketenangan ruang meditasi yang dirancang khusus untuk kenyamanan Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {landingConfig.galleryImages.map((imgItem) => (
                <div
                  key={imgItem.id}
                  className="bg-stone-950 border border-stone-800 rounded-3xl overflow-hidden shadow-xl hover:border-amber-500/40 transition-all group flex flex-col"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden relative bg-stone-900">
                    <img
                      src={imgItem.url || imgItem.imageUrl || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'}
                      alt={imgItem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as any).src = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    {imgItem.category && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-stone-700 text-amber-300 text-[10px] font-bold font-mono">
                        {imgItem.category}
                      </span>
                    )}
                  </div>
                  <div className="p-5 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                        {imgItem.title}
                      </h4>
                      {imgItem.description && (
                        <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                          {imgItem.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. BOTTOM LUXURY CALL-TO-ACTION BANNER */}
      <section className="py-20 px-4 sm:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-amber-950/60 via-stone-900 to-emerald-950/60 border border-amber-500/40 rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-2xl relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Mulai Langkah Pertama Ketenangan Jiwa</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-100 font-serif leading-tight">
            Pikiran Anda Layak Mendapatkan Istirahat yang Damai.
          </h2>

          <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Bergabunglah sekarang dalam ruang tenang LEGA. Nikmati 24 jam akses bebas ke seluruh suara pemandu, musik 432Hz, dan bimbingan AI.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-stone-950 font-extrabold text-base shadow-2xl shadow-amber-500/50 hover:shadow-amber-400/70 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{landingConfig.heroCtaPrimaryText || 'Masuk Ruang Tenang Sekarang — Gratis'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            {landingConfig.contactWhatsapp && (
              <a
                href={`https://wa.me/${landingConfig.contactWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                  'Halo Tim LEGA SHAQILA DIGITAL 99, saya ingin berkonsultasi mengenai aplikasi LEGA.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 hover:border-emerald-400 text-emerald-200 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Konsultasi via WhatsApp</span>
              </a>
            )}
          </div>

          <p className="text-[11px] text-stone-400 pt-2">
            Tanpa perlu kartu kredit • 100% Bebas Iklan • Dapat dibatalkan kapan saja
          </p>
        </div>
      </section>

      {/* 10. LUXURY FOOTER */}
      <footer className="border-t border-stone-800/80 bg-stone-950 py-10 px-4 sm:px-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-300 font-serif">LEGA AI Platform</span>
            <span>• {landingConfig.topBrandTag || 'SHAQILA DIGITAL 99'}</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <button onClick={onLoginClick} className="hover:text-stone-300 transition">
              Menu Masuk
            </button>
            <button onClick={onGetStarted} className="hover:text-stone-300 transition">
              Onboarding
            </button>
            <button onClick={onDirectAppAccess} className="hover:text-stone-300 transition">
              Buka Aplikasi Langsung
            </button>
            {landingConfig.contactWhatsapp && (
              <a
                href={`https://wa.me/${landingConfig.contactWhatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1 font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Admin</span>
              </a>
            )}
            {landingConfig.contactEmail && (
              <a
                href={`mailto:${landingConfig.contactEmail}`}
                className="text-amber-400/90 hover:text-amber-300 transition"
              >
                {landingConfig.contactEmail}
              </a>
            )}
          </div>
          <p>© {new Date().getFullYear()} {landingConfig.footerTagline || 'LEGA. Hak Cipta Dilindungi Undang-Undang.'}</p>
        </div>
      </footer>
    </div>
  );
};
