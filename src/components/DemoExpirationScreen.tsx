/**
 * LEGA - 24-Hour Demo Expiration Screen
 * Tampilan saat masa akses akun demo 24 jam telah habis
 * SHAQILA DIGITAL 99
 */

import React from 'react';
import {
  Clock,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Download,
  MessageCircle,
  Key,
  Layers,
  Heart
} from 'lucide-react';
import { DemoAccountSession } from '../lib/demoAuthManager';

interface DemoExpirationScreenProps {
  session: DemoAccountSession | null;
  onResetDemo: () => void;
  onLogout: () => void;
  onExportData?: () => void;
}

export const DemoExpirationScreen: React.FC<DemoExpirationScreenProps> = ({
  session,
  onResetDemo,
  onLogout,
  onExportData,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-xl bg-stone-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-black relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Icon & Title */}
        <div className="relative z-10 text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-inner text-2xl">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-950/90 text-amber-300 border border-amber-600/50">
              Masa Akses 24 Jam Telah Berakhir
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white pt-1">
              Waktu Akun Demo Anda Telah Habis
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
              Terima kasih telah mencoba platform <span className="text-emerald-300 font-semibold">LEGA SHAQILA DIGITAL 99</span> selama 24 jam.
            </p>
          </div>
        </div>

        {/* Session Details Summary */}
        <div className="relative z-10 p-4 bg-stone-950/80 rounded-2xl border border-stone-800 space-y-2.5 text-xs">
          <div className="flex items-center justify-between text-stone-400">
            <span>Nama Akun Demo:</span>
            <span className="text-stone-200 font-semibold">{session?.accountName || 'Pengguna Demo'}</span>
          </div>
          <div className="flex items-center justify-between text-stone-400">
            <span>Email Akun:</span>
            <span className="text-stone-200 font-mono">{session?.accountEmail || 'demo@lega.id'}</span>
          </div>
          <div className="flex items-center justify-between text-stone-400">
            <span>Mulai Sesi:</span>
            <span className="text-stone-300">{session?.createdAt ? new Date(session.createdAt).toLocaleString('id-ID') : '-'}</span>
          </div>
          <div className="flex items-center justify-between text-stone-400">
            <span>Berakhir Pada:</span>
            <span className="text-amber-400 font-bold">{session?.expiresAt ? new Date(session.expiresAt).toLocaleString('id-ID') : '-'}</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-stone-800/80 text-stone-400">
            <span>Status Akses:</span>
            <span className="text-red-400 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Kedaluwarsa (Expired)
            </span>
          </div>
        </div>

        {/* What You Explored in LEGA */}
        <div className="relative z-10 p-3.5 bg-emerald-950/30 rounded-2xl border border-emerald-800/30 text-xs text-stone-300 space-y-1.5">
          <p className="font-semibold text-emerald-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Fitur yang Anda jelajahi selama demo:
          </p>
          <p className="text-[11px] text-stone-400 leading-relaxed">
            AI Coach 10 Tahap LEGA, Lanskap Audio LEGA CALM NATURE, 14 Modul Regulasi Emosi, Jurnal Refleksi Somatis, dan Muhasabah Spiritual.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 space-y-2.5">
          {/* Restart / Refresh 24-Hour Demo */}
          <button
            onClick={onResetDemo}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-stone-950 font-extrabold text-xs sm:text-sm rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/80 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mulai Ulang Sesi Demo 24 Jam Baru</span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {onExportData && (
              <button
                onClick={onExportData}
                className="py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl border border-stone-700 transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-stone-400" />
                <span>Simpan/Ekspor Data Refleksi</span>
              </button>
            )}

            <button
              onClick={onLogout}
              className="py-2.5 px-3 bg-stone-950 hover:bg-stone-800 text-stone-400 hover:text-stone-200 text-xs font-medium rounded-xl border border-stone-800 transition flex items-center justify-center gap-1.5"
            >
              <span>Keluar Mode Demo</span>
            </button>
          </div>
        </div>

        {/* Developer Contact Footer */}
        <div className="relative z-10 pt-2 border-t border-stone-800 text-center space-y-1">
          <p className="text-[11px] text-stone-400">
            Untuk aktivasi akun permanen, enterprise, atau lisensi institusi:
          </p>
          <p className="text-xs font-bold text-emerald-400">
            SHAQILA DIGITAL 99 • info@shaqiladigital.id
          </p>
        </div>
      </div>
    </div>
  );
};
