/**
 * LEGA - 24-Hour Demo Account Top Banner & Status Indicator
 * SHAQILA DIGITAL 99
 */

import React from 'react';
import { Clock, Key, Zap, ShieldCheck, AlertTriangle, ChevronRight } from 'lucide-react';
import { useDemoAuth } from '../lib/demoAuthManager';

interface DemoBannerProps {
  demoState: ReturnType<typeof useDemoAuth>;
  onOpenDemoModal: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({
  demoState,
  onOpenDemoModal
}) => {
  const { isDemoActive, session, timeRemaining } = demoState;

  if (!isDemoActive) {
    return (
      <div className="bg-gradient-to-r from-stone-900 via-emerald-950/60 to-stone-900 border-b border-stone-800 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-stone-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>
            Ingin mencoba fitur lengkap? <strong className="text-emerald-300">Akun Demo 24 Jam</strong> tersedia gratis dengan hak akses penuh.
          </span>
        </div>
        <button
          onClick={onOpenDemoModal}
          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold rounded-lg transition flex items-center gap-1.5 shadow-sm text-[11px]"
        >
          <Key className="w-3 h-3" />
          <span>Buka Akun Demo 24 Jam</span>
        </button>
      </div>
    );
  }

  const isLowTime = timeRemaining.hours < 3;

  return (
    <div
      onClick={onOpenDemoModal}
      className={`cursor-pointer border-b px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 transition select-none ${
        isLowTime
          ? 'bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border-amber-600/50 text-amber-200 hover:bg-amber-900/40'
          : 'bg-gradient-to-r from-emerald-950/90 via-stone-900 to-sky-950/90 border-emerald-600/40 text-emerald-200 hover:bg-emerald-900/40'
      }`}
    >
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className={`p-1 rounded-lg ${isLowTime ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
          <Clock className="w-3.5 h-3.5 animate-pulse" />
        </div>
        <span className="font-bold text-white flex items-center gap-1.5">
          <span>AKUN DEMO (24 JAM):</span>
          <span className="font-mono tracking-wider font-extrabold text-amber-300 bg-stone-950/80 px-2 py-0.5 rounded-md border border-stone-800">
            {timeRemaining.formatted}
          </span>
        </span>
        <span className="text-[11px] text-stone-300 hidden md:inline">
          • Pengguna: <strong className="text-white">{session?.accountName}</strong> ({session?.accountEmail})
        </span>
        <span className="text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60 hidden sm:inline">
          Hak Akses Penuh Aktif
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[11px] text-stone-300 hover:text-white font-medium flex items-center gap-1">
          <span>Detail & Kelola Sesi</span>
          <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};
