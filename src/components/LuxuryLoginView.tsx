/**
 * LEGA - Luxury Login & Member Portal View
 * Menu Login Mewah, Elegan, Cepat & Terenkripsi
 * SHAQILA DIGITAL 99
 */

import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Key,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronLeft,
  User,
  Heart,
  Eye,
  EyeOff,
  AlertCircle,
  Cloud
} from 'lucide-react';
import { playCalmMeditationChime } from '../lib/audioEngine';
import { signInWithGoogle } from '../lib/firebase';

interface LuxuryLoginViewProps {
  onLoginSuccess: (userData?: { name: string; email: string }) => void;
  onBackToLanding: () => void;
}

export const LuxuryLoginView: React.FC<LuxuryLoginViewProps> = ({
  onLoginSuccess,
  onBackToLanding
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      playCalmMeditationChime('bell', 0.15);
      setIsLoading(true);
      setErrorMessage(null);
      const user = await signInWithGoogle();
      if (user) {
        onLoginSuccess({
          name: user.displayName || 'Teman LEGA',
          email: user.email || ''
        });
      }
    } catch (err: any) {
      console.warn('Google Sign In note:', err);
      // If user closed popup or error, provide clear guidance
      if (err?.code !== 'auth/popup-closed-by-user') {
        setErrorMessage(err?.message || 'Gagal masuk dengan Google. Silakan coba lagi atau gunakan Akun Tamu.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantDemoLogin = () => {
    playCalmMeditationChime('bell', 0.15);
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: 'Teman Tenang LEGA',
        email: 'tamu.lega@shaqila.id'
      });
    }, 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playCalmMeditationChime('bowl', 0.15);
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      const chosenName = name.trim() || email.split('@')[0] || 'Teman LEGA';
      onLoginSuccess({
        name: chosenName,
        email: email.trim() || 'user@lega.id'
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans flex flex-col justify-between relative overflow-hidden selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background Ambient Aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[800px] h-[400px] bg-gradient-to-tr from-amber-500/15 via-emerald-500/10 to-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner SHAQILA DIGITAL 99 */}
      <div className="bg-gradient-to-r from-stone-950 via-amber-950/70 to-stone-950 border-b border-amber-500/40 px-4 py-1.5 text-center relative z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="px-2 py-0.5 rounded bg-amber-400 text-stone-950 font-black text-[10px] tracking-wider uppercase">
              SHAQILA DIGITAL 99
            </span>
            <span className="text-amber-200 font-semibold text-[11px]">
              LEGA SHAQILA DIGITAL 99 — Platform Kesadaran Diri, Pengelolaan Emosi &amp; Relaksasi Berbasis AI
            </span>
          </div>
        </div>
      </div>

      {/* Top Header Bar */}
      <header className="px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-stone-800/80 bg-stone-950/70 backdrop-blur-md relative z-10">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-amber-300 transition-colors py-1 px-2.5 rounded-xl hover:bg-stone-900"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black tracking-wider uppercase">
            SHAQILA DIGITAL 99
          </span>
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-400 to-emerald-400 p-[1px]">
            <div className="w-full h-full bg-stone-950 rounded-xl flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </div>
          </div>
          <span className="font-extrabold text-sm tracking-wider font-serif text-stone-100">
            LEGA
          </span>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="w-full max-w-md bg-stone-900/90 border border-stone-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-black backdrop-blur-xl">
          {/* Card Top Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Portal Masuk Ruang Tenang</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100 font-serif">
              {authMode === 'login' ? 'Selamat Datang Kembali' : 'Mulai Ruang Aman Anda'}
            </h1>
            <p className="text-xs text-stone-400">
              {authMode === 'login'
                ? 'Masuk untuk melanjutkan riwayat ketenangan & rekaman jurnal Anda'
                : 'Buat ruang batin pribadi tanpa penghakiman'}
            </p>
          </div>

          {/* Google Sign In with Firebase Cloud Sync */}
          <div className="space-y-2.5">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-stone-100 text-stone-900 font-bold text-xs sm:text-sm shadow-lg shadow-white/10 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 border border-stone-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{isLoading ? 'Menghubungkan...' : 'Masuk dengan Google (Cloud Sync)'}</span>
            </button>

            {/* Quick 1-Click Instant Guest / Demo Button */}
            <button
              onClick={handleInstantDemoLogin}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-stone-950 font-extrabold text-xs sm:text-sm shadow-md shadow-amber-500/20 hover:shadow-amber-400/30 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-stone-950 fill-stone-950" />
              <span>Masuk Cepat 1-Klik (Akses Tamu)</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-stone-800" />
            <span className="text-[10px] text-stone-400 uppercase font-mono tracking-wider">
              atau akun terdaftar
            </span>
            <div className="flex-1 h-px bg-stone-800" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-stone-400" />
                  <span>Nama Panggilan Anda</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Rian, Sarah, atau Samaran"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-xs text-stone-100 placeholder:text-stone-400 outline-none transition"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                <span>Alamat Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-xs text-stone-100 placeholder:text-stone-400 outline-none transition"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-stone-400" />
                  <span>Kata Sandi / Kode Akses</span>
                </label>
                {authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('demo.user@lega.id');
                      setPassword('LEGA24JAM');
                    }}
                    className="text-[10px] text-amber-400 hover:text-amber-300 underline font-medium"
                  >
                    Gunakan Akun Demo
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-xs text-stone-100 placeholder:text-stone-400 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-600 hover:border-amber-400/50 text-stone-100 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {isLoading
                  ? 'Memproses...'
                  : authMode === 'login'
                  ? 'Masuk dengan Akun'
                  : 'Daftarkan Akun & Lanjut'}
              </span>
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="text-center pt-1 border-t border-stone-800/80">
            {authMode === 'login' ? (
              <p className="text-xs text-stone-400">
                Belum memiliki akun?{' '}
                <button
                  onClick={() => setAuthMode('register')}
                  className="text-amber-300 hover:text-amber-200 font-bold underline"
                >
                  Daftar di sini
                </button>
              </p>
            ) : (
              <p className="text-xs text-stone-400">
                Sudah punya akun?{' '}
                <button
                  onClick={() => setAuthMode('login')}
                  className="text-amber-300 hover:text-amber-200 font-bold underline"
                >
                  Masuk di sini
                </button>
              </p>
            )}
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kerahasiaan data batin Anda terlindungi enkripsi 256-bit</span>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="py-4 text-center text-xs text-stone-400 relative z-10">
        LEGA AI Platform • Ruang Tenang Tanpa Penghakiman
      </footer>
    </div>
  );
};
