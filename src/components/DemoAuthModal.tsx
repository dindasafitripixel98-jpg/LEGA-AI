/**
 * LEGA - 24-Hour Demo Account Authentication & Session Modal
 * Modal Masuk, Status Akses, dan Countdown 24 Jam
 * SHAQILA DIGITAL 99
 */

import React, { useState } from 'react';
import {
  Clock,
  Key,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  LogOut,
  X,
  Copy,
  Check,
  AlertTriangle,
  ChevronRight,
  User,
  Mail,
  Zap,
  Lock
} from 'lucide-react';
import {
  useDemoAuth,
  DEFAULT_DEMO_CREDENTIALS,
  UNLOCKED_DEMO_FEATURES,
  DemoAccountSession,
  DemoTimeRemaining
} from '../lib/demoAuthManager';

interface DemoAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  demoState: ReturnType<typeof useDemoAuth>;
}

export const DemoAuthModal: React.FC<DemoAuthModalProps> = ({
  isOpen,
  onClose,
  demoState
}) => {
  const {
    isDemoActive,
    isDemoSession,
    session,
    timeRemaining,
    loginDemo,
    quickStartDemo,
    resetDemoSession,
    logoutDemo,
    simulateExpiration,
  } = demoState;

  const [mode, setMode] = useState<'status' | 'login' | 'custom'>('status');
  const [identifier, setIdentifier] = useState(DEFAULT_DEMO_CREDENTIALS.email);
  const [accessCode, setAccessCode] = useState(DEFAULT_DEMO_CREDENTIALS.accessCode);
  const [customName, setCustomName] = useState('Teman Refleksi LEGA');
  const [customEmail, setCustomEmail] = useState('demo.user@lega.id');
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleQuickLogin = () => {
    quickStartDemo(customName, customEmail);
    setLoginMessage('✓ Akun demo 24 jam berhasil diaktifkan!');
    setTimeout(() => {
      setLoginMessage(null);
      onClose();
    }, 1200);
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = loginDemo(identifier, accessCode);
    setLoginMessage(res.message);
    if (res.success) {
      setTimeout(() => {
        setLoginMessage(null);
        onClose();
      }, 1200);
    }
  };

  const handleCopyCredentials = () => {
    navigator.clipboard.writeText(
      `Akun Demo LEGA 24 Jam\nEmail: ${DEFAULT_DEMO_CREDENTIALS.email}\nKode Akses: ${DEFAULT_DEMO_CREDENTIALS.accessCode}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-xl bg-stone-900 border border-stone-700/80 rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xl shadow-black relative overflow-hidden text-stone-100">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -mt-10" />

        {/* Header */}
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-950/90 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shadow-inner">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Akun Demo LEGA (24 Jam)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Akses 24 Jam
                </span>
              </div>
              <p className="text-xs text-stone-400">
                SHAQILA DIGITAL 99 • Masa Uji Coba Eksklusif Seluruh Fitur
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-950/90 rounded-2xl border border-stone-800 text-xs font-semibold relative z-10">
          <button
            onClick={() => setMode('status')}
            className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
              mode === 'status'
                ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/60'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Status 24 Jam</span>
          </button>

          <button
            onClick={() => setMode('login')}
            className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/60'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Masuk Akun</span>
          </button>

          <button
            onClick={() => setMode('custom')}
            className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
              mode === 'custom'
                ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/60'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Aktivasi Baru</span>
          </button>
        </div>

        {/* Content based on Mode */}
        {mode === 'status' && (
          <div className="space-y-4 relative z-10">
            {/* Active Demo Timer Card */}
            {isDemoActive ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-stone-950 via-emerald-950/40 to-stone-950 border border-emerald-600/50 space-y-3.5 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Sesi Akun Demo Sedang Aktif
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-900 border border-stone-800 text-stone-300">
                    Durasi: 24 Jam Penuh
                  </span>
                </div>

                {/* Big Live Countdown */}
                <div className="text-center py-2 space-y-1">
                  <p className="text-[11px] text-stone-400">Sisa Waktu Akses Demo:</p>
                  <div className="text-3xl sm:text-4xl font-black font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-sky-200 to-cyan-300">
                    {timeRemaining.formatted}
                  </div>
                  <p className="text-xs text-stone-400 font-sans">
                    ({timeRemaining.shortFormatted})
                  </p>
                </div>

                {/* Progress Bar of 24 Hours */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
                    <span>Mulai: {session ? new Date(session.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '00:00'}</span>
                    <span className="text-emerald-400 font-bold">Tersisa {Math.round(timeRemaining.percentRemaining)}%</span>
                    <span>Habis: {session ? new Date(session.expiresAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '24:00'}</span>
                  </div>
                  <div className="w-full h-2.5 bg-stone-950 rounded-full overflow-hidden border border-stone-800">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-sky-400 transition-all duration-500 rounded-full"
                      style={{ width: `${Math.max(2, timeRemaining.percentRemaining)}%` }}
                    />
                  </div>
                </div>

                {/* User & Expiry Metadata */}
                <div className="pt-2 border-t border-stone-800/80 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-stone-400 block">Pengguna Demo:</span>
                    <span className="text-stone-200 font-semibold">{session?.accountName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Waktu Berakhir:</span>
                    <span className="text-amber-300 font-medium">
                      {session?.expiresAt ? new Date(session.expiresAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* No Active Demo / Expired Banner */
              <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-stone-900 border border-stone-700 flex items-center justify-center text-stone-400 mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-200">Belum Ada Sesi Demo Aktif</h4>
                  <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                    Aktifkan akun demo sekarang untuk mendapatkan hak akses 24 jam penuh ke seluruh fitur dan modul refleksi LEGA.
                  </p>
                </div>
                <button
                  onClick={handleQuickLogin}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 mx-auto shadow-md"
                >
                  <Zap className="w-4 h-4 fill-stone-950" />
                  <span>Aktifkan Akun Demo 24 Jam Instan</span>
                </button>
              </div>
            )}

            {/* Unlocked Features List */}
            <div className="p-3.5 bg-stone-950/70 rounded-2xl border border-stone-800 space-y-2">
              <div className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Hak Akses Penuh Selama 24 Jam:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-stone-300">
                {UNLOCKED_DEMO_FEATURES.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-tight">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            {isDemoActive && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={resetDemoSession}
                    className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl border border-stone-700 transition flex items-center gap-1.5"
                    title="Perpanjang / Mulai ulang waktu 24 jam dari sekarang"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Reset 24 Jam</span>
                  </button>

                  <button
                    onClick={simulateExpiration}
                    className="px-3 py-2 bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 text-[11px] font-medium rounded-xl border border-amber-800/50 transition flex items-center gap-1"
                    title="Simulasikan tampilan saat 24 jam habis"
                  >
                    <span>Tes Expired</span>
                  </button>
                </div>

                <button
                  onClick={logoutDemo}
                  className="px-3.5 py-2 bg-stone-950 hover:bg-stone-800 text-stone-400 hover:text-red-300 text-xs font-medium rounded-xl border border-stone-800 transition flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar Demo</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mode: Login via Preset Credentials */}
        {mode === 'login' && (
          <form onSubmit={handleFormLogin} className="space-y-4 relative z-10">
            <div className="p-3.5 bg-emerald-950/40 border border-emerald-700/50 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Kredensial Default Akun Demo 24 Jam:
                </span>
                <button
                  type="button"
                  onClick={handleCopyCredentials}
                  className="text-[11px] text-stone-300 hover:text-white flex items-center gap-1 px-2 py-0.5 bg-stone-900 rounded-md border border-stone-700"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-stone-950/80 rounded-xl border border-stone-800">
                  <span className="text-[10px] text-stone-400 font-sans block">Email/User:</span>
                  <span className="text-stone-200 font-bold">{DEFAULT_DEMO_CREDENTIALS.email}</span>
                </div>
                <div className="p-2 bg-stone-950/80 rounded-xl border border-stone-800">
                  <span className="text-[10px] text-stone-400 font-sans block">Kode Akses:</span>
                  <span className="text-emerald-400 font-bold">{DEFAULT_DEMO_CREDENTIALS.accessCode}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Email atau Username Demo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="demo@lega.id"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 pl-9 text-xs text-stone-100 outline-none focus:border-emerald-500 font-mono"
                    required
                  />
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Kode Akses Demo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="LEGA24H"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 pl-9 text-xs text-stone-100 outline-none focus:border-emerald-500 font-mono uppercase"
                    required
                  />
                  <Key className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            {loginMessage && (
              <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-center font-medium text-emerald-300">
                {loginMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="submit"
                className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-md"
              >
                <Key className="w-3.5 h-3.5 fill-stone-950" />
                <span>Masuk dengan Kredensial</span>
              </button>

              <button
                type="button"
                onClick={handleQuickLogin}
                className="py-3 px-4 bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold text-xs rounded-xl border border-stone-600 transition flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>1-Click Masuk Demo 24 Jam</span>
              </button>
            </div>
          </form>
        )}

        {/* Mode: Custom 24H Activation */}
        {mode === 'custom' && (
          <div className="space-y-4 relative z-10">
            <p className="text-xs text-stone-300 leading-relaxed">
              Buat akun demo baru yang disesuaikan dengan nama Anda. Akun ini akan aktif selama <strong>tepat 24 jam</strong> dari saat aktivasi.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Nama Anda / Panggilan
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 pl-9 text-xs text-stone-100 outline-none focus:border-emerald-500"
                  />
                  <User className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Email Demo
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="user.demo@lega.id"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 pl-9 text-xs text-stone-100 outline-none focus:border-emerald-500 font-mono"
                  />
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleQuickLogin}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60"
            >
              <Zap className="w-4 h-4 fill-stone-950" />
              <span>Mulai Akses Demo 24 Jam untuk {customName}</span>
            </button>
          </div>
        )}

        {/* Footer Note */}
        <div className="pt-2 border-t border-stone-800 text-center text-[11px] text-stone-400 relative z-10 flex items-center justify-between">
          <span>LEGA AI • SHAQILA DIGITAL 99</span>
          <span className="text-stone-300">Batasan Akses: 24 Jam Otomatis</span>
        </div>
      </div>
    </div>
  );
};
