/**
 * LEGA - Account Status & 24-Hour Demo Banner
 * SHAQILA DIGITAL 99
 */

import React from 'react';
import { Clock, Key, ShieldCheck, CheckCircle2, ChevronRight, Crown, Sparkles, AlertCircle } from 'lucide-react';
import { useDemoAuth } from '../lib/demoAuthManager';

export interface ActiveAccountInfo {
  name: string;
  email: string;
  role?: string;
  plan?: string;
  isDemo?: boolean;
  status?: string;
}

interface DemoBannerProps {
  demoState: ReturnType<typeof useDemoAuth>;
  activeAccount?: ActiveAccountInfo | null;
  onOpenModal: () => void;
  onSelectModule?: (mod: any) => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({
  demoState,
  activeAccount,
  onOpenModal,
  onSelectModule,
}) => {
  const { isDemoActive, session, timeRemaining, isDemoAllowed, demoBlockedReason } = demoState;

  // 1. If User is Logged In as an Official / Developer / Lifetime Member Account
  const isOfficialAccount =
    activeAccount &&
    !activeAccount.isDemo &&
    (activeAccount.role === 'DEVELOPER' ||
      activeAccount.role === 'ADMIN' ||
      activeAccount.role === 'VIP' ||
      activeAccount.plan === 'LIFETIME' ||
      activeAccount.email.toLowerCase() === 'dindasafitri.pixel98@gmail.com');

  if (isOfficialAccount) {
    return (
      <div className="bg-gradient-to-r from-amber-950/80 via-stone-900 to-amber-950/80 border-b border-amber-500/40 px-3.5 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 shadow-sm text-amber-200">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="p-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Crown className="w-3.5 h-3.5" />
          </div>
          <span className="font-extrabold tracking-wider text-amber-300 uppercase text-[10px] sm:text-[11px] flex items-center gap-1.5">
            <span>AKUN RESMI DEVELOPER & OWNER</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-400 text-stone-950 font-black text-[9px]">
              LIFETIME
            </span>
          </span>
          <span className="text-stone-400 hidden sm:inline">&bull;</span>
          <span className="text-[11px] text-stone-200">
            Pengguna: <strong className="text-white">{activeAccount.name}</strong> ({activeAccount.email})
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            STATUS: AKTIF PERMANEN
          </span>
        </div>

        {onSelectModule && (
          <button
            onClick={() => onSelectModule('admin')}
            className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-200 rounded-lg transition text-[10px] font-bold flex items-center gap-1 active:scale-95"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Pusat Kendali Admin</span>
          </button>
        )}
      </div>
    );
  }

  // 2. If Public Demo Mode is Turned OFF by Developer / Admin
  if (!isDemoAllowed) {
    return (
      <div className="bg-stone-900 border-b border-stone-800 px-3.5 py-1 text-xs flex items-center justify-between gap-2 text-stone-400">
        <div className="flex items-center gap-2 text-[11px]">
          <AlertCircle className="w-3.5 h-3.5 text-stone-500" />
          <span>Mode Demo Publik Sedang Dinonaktifkan oleh Administrator.</span>
        </div>
        <span className="text-[10px] font-mono text-stone-500">SHAQILA DIGITAL 99</span>
      </div>
    );
  }

  // 3. If 24-Hour Demo Account is Active and Allowed
  if (isDemoActive) {
    const isLowTime = timeRemaining.hours < 3;

    return (
      <div
        onClick={onOpenModal}
        className={`cursor-pointer border-b px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 transition select-none ${
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
            <span className="text-[11px]">AKUN DEMO (24 JAM):</span>
            <span className="font-mono tracking-wider font-extrabold text-amber-300 bg-stone-950/80 px-2 py-0.5 rounded-md border border-stone-800 text-[11px]">
              {timeRemaining.formatted}
            </span>
          </span>
          <span className="text-[11px] text-stone-300 hidden md:inline">
            • Pengguna: <strong className="text-white">{session?.accountName}</strong> ({session?.accountEmail})
          </span>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60 hidden sm:inline">
            Hak Akses Uji Coba Penuh
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-stone-300 hover:text-white font-medium flex items-center gap-1">
            <span>Detail Sesi</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    );
  }

  // 4. Default Standby State (When user is guest and demo is allowed)
  return (
    <div className="bg-gradient-to-r from-stone-900 via-emerald-950/60 to-stone-900 border-b border-stone-800 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2 text-stone-300">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span className="text-[11px]">
          Ingin mencoba fitur lengkap? <strong className="text-emerald-300">Akun Demo 24 Jam</strong> tersedia gratis dengan hak akses penuh.
        </span>
      </div>
      <button
        onClick={onOpenModal}
        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold rounded-lg transition flex items-center gap-1.5 shadow-sm text-[11px]"
      >
        <Key className="w-3 h-3" />
        <span>Buka Akun Demo 24 Jam</span>
      </button>
    </div>
  );
};
