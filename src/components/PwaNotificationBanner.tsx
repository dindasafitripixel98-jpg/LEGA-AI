import React, { useState } from 'react';
import {
  WifiOff,
  RefreshCw,
  Download,
  X,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { usePwa } from '../lib/pwaManager';

interface PwaNotificationBannerProps {
  onOpenPwaModal: () => void;
}

export const PwaNotificationBanner: React.FC<PwaNotificationBannerProps> = ({
  onOpenPwaModal,
}) => {
  const {
    isOnline,
    isUpdateAvailable,
    isInstallable,
    isInstalled,
    applyUpdate,
    triggerInstall,
  } = usePwa();

  const [dismissInstallBanner, setDismissInstallBanner] = useState<boolean>(false);

  return (
    <aside aria-label="Notifikasi PWA dan Status Jaringan" className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40 space-y-2 pointer-events-none">
      {/* 1. Offline Mode Active Notice */}
      {!isOnline && (
        <div className="pointer-events-auto bg-amber-950/95 border border-amber-800/90 text-amber-200 p-3 rounded-2xl shadow-xl backdrop-blur-md flex items-center justify-between gap-3 text-xs animate-slide-up">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-900/80 rounded-xl flex-shrink-0 text-amber-400">
              <WifiOff className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-amber-200">Mode Offline Aktif</p>
              <p className="text-[11px] text-amber-300/80 leading-tight">
                Latihan napas, relaksasi suara alam synth &amp; jurnal tetap dapat digunakan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. PWA Update Ready Notice */}
      {isUpdateAvailable && (
        <div className="pointer-events-auto bg-emerald-950/95 border border-emerald-800/90 text-emerald-100 p-3 rounded-2xl shadow-xl backdrop-blur-md flex items-center justify-between gap-3 text-xs animate-slide-up">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-900/80 rounded-xl flex-shrink-0 text-emerald-400">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
            </div>
            <div>
              <p className="font-semibold text-emerald-200">Pembaruan LEGA Siap</p>
              <p className="text-[11px] text-emerald-300/80 leading-tight">
                Versi baru telah diunduh di latar belakang.
              </p>
            </div>
          </div>
          <button
            onClick={applyUpdate}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-xs transition flex-shrink-0"
          >
            Perbarui
          </button>
        </div>
      )}

      {/* 3. Non-intrusive Install Suggestion Floating Pill (If not installed and installable) */}
      {!isInstalled && !dismissInstallBanner && isInstallable && (
        <div className="pointer-events-auto bg-stone-900/95 border border-stone-700/80 text-stone-100 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-xs animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center p-1.5 border border-emerald-500/30 flex-shrink-0">
              <img src="/icons/icon-192.svg" alt="LEGA" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="font-semibold text-stone-100 flex items-center gap-1.5">
                <span>Pasang Aplikasi LEGA</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PWA
                </span>
              </p>
              <p className="text-[11px] text-stone-400 leading-tight">
                Akses cepat di layar utama &amp; nikmati fitur offline.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={onOpenPwaModal}
              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-semibold rounded-xl text-xs flex items-center gap-1 transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Pasang</span>
            </button>
            <button
              onClick={() => setDismissInstallBanner(true)}
              className="p-1.5 text-stone-400 hover:text-stone-200 rounded-lg hover:bg-stone-800 transition"
              aria-label="Tutup saran instalasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
