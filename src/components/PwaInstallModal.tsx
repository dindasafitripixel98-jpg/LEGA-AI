import React, { useState } from 'react';
import {
  X,
  Download,
  Smartphone,
  CheckCircle2,
  Share,
  PlusSquare,
  Sparkles,
  WifiOff,
  HardDrive,
  Laptop,
  Check
} from 'lucide-react';
import { usePwa } from '../lib/pwaManager';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({ isOpen, onClose }) => {
  const {
    isInstallable,
    isInstalled,
    isIos,
    triggerInstall,
    storageEstimate,
    clearPwaCache,
    refreshStorageEstimate
  } = usePwa();

  const [installStatus, setInstallStatus] = useState<'idle' | 'success' | 'dismissed'>('idle');
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>(
    isIos ? 'ios' : 'android'
  );
  const [clearingCache, setClearingCache] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const res = await triggerInstall();
    if (res === 'accepted') {
      setInstallStatus('success');
      setTimeout(() => {
        onClose();
      }, 1500);
    } else if (res === 'dismissed') {
      setInstallStatus('dismissed');
    }
  };

  const handleClearCache = async () => {
    setClearingCache(true);
    await clearPwaCache();
    await refreshStorageEstimate();
    setClearingCache(false);
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl p-6 md:p-8 text-stone-100 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-full transition"
          aria-label="Tutup Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center shadow-lg shadow-emerald-950/40 p-2.5 border border-emerald-500/30">
            <img src="/icons/icon-192.svg" alt="LEGA App Icon" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-stone-100">Pasang Aplikasi LEGA</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PWA Mode
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Progressive Web App • Akses Cepat &amp; Dukungan Offline
            </p>
          </div>
        </div>

        {/* Status Card */}
        {isInstalled ? (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-300">
                Aplikasi LEGA Sudah Terpasang!
              </p>
              <p className="text-xs text-emerald-200/70 mt-0.5">
                Anda sedang menjalankan LEGA dalam mode aplikasi mandiri (*Standalone App*).
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {isInstallable && (
              <button
                onClick={handleInstallClick}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition active:scale-95 text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Pasang Aplikasi Sekarang (1-Klik)</span>
              </button>
            )}

            {installStatus === 'success' && (
              <p className="text-xs text-emerald-400 text-center font-medium">
                Pemasangan berhasil! Ikon LEGA telah ditambahkan ke perangkat Anda.
              </p>
            )}
          </div>
        )}

        {/* Keunggulan PWA */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tanpa Download Berat</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-snug">
              Instalasi instan &lt; 2 MB tanpa membebani memori HP atau laptop.
            </p>
          </div>

          <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80 space-y-1">
            <div className="flex items-center gap-1.5 text-teal-400 text-xs font-semibold">
              <WifiOff className="w-3.5 h-3.5" />
              <span>Dukungan Offline</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-snug">
              Latihan napas, relaksasi suara alam &amp; jurnal tetap aktif tanpa internet.
            </p>
          </div>

          <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Tampilan Layar Penuh</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-snug">
              Bebas dari bilah URL browser, fokus penuh pada ketenangan diri.
            </p>
          </div>

          <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80 space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-semibold">
              <HardDrive className="w-3.5 h-3.5" />
              <span>Penyimpanan Lokal</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-snug">
              Catatan emosi &amp; refleksi tersimpan privat di perangkat Anda.
            </p>
          </div>
        </div>

        {/* Petunjuk Manual Instalasi */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <span className="text-xs font-semibold text-stone-300">
              Panduan Pasang Berdasarkan Perangkat:
            </span>
            <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800">
              <button
                onClick={() => setActiveTab('android')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                  activeTab === 'android'
                    ? 'bg-stone-800 text-emerald-400 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Android
              </button>
              <button
                onClick={() => setActiveTab('ios')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                  activeTab === 'ios'
                    ? 'bg-stone-800 text-emerald-400 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                iOS / Safari
              </button>
              <button
                onClick={() => setActiveTab('desktop')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                  activeTab === 'desktop'
                    ? 'bg-stone-800 text-emerald-400 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Desktop
              </button>
            </div>
          </div>

          {activeTab === 'android' && (
            <div className="text-xs text-stone-300 space-y-2 bg-stone-950/40 p-3.5 rounded-2xl border border-stone-800/60">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-stone-800 text-emerald-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                  1
                </span>
                <p>
                  Buka LEGA di <strong>Google Chrome</strong> atau <strong>Brave Browser</strong>.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-stone-800 text-emerald-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                  2
                </span>
                <p>
                  Tekan menu titik tiga (⋮) di pojok kanan atas layar browser.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-stone-800 text-emerald-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                  3
                </span>
                <p>
                  Pilih <strong>"Pasang aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'ios' && (
            <div className="text-xs text-stone-300 space-y-2 bg-stone-950/40 p-3.5 rounded-2xl border border-stone-800/60">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-stone-800 text-emerald-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                  1
                </span>
                <p>
                  Buka LEGA menggunakan browser <strong>Safari</strong> di iPhone atau iPad Anda.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-stone-800 text-emerald-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                  2
                </span>
                <div className="flex items-center gap-1.5">
                  <p>
                    Tekan tombol <strong>Share</strong> (ikon kotak berpanah ke atas)
                  </p>
                  <Share className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-stone-800 text-emerald-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                  3
                </span>
                <div className="flex items-center gap-1.5">
                  <p>
                    Gulir ke bawah dan pilih <strong>"Add to Home Screen"</strong> (Tambah ke Layar Utama).
                  </p>
                  <PlusSquare className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'desktop' && (
            <div className="text-xs text-stone-300 space-y-2 bg-stone-950/40 p-3.5 rounded-2xl border border-stone-800/60">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-stone-800 text-emerald-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                  1
                </span>
                <p>
                  Buka di <strong>Google Chrome</strong>, <strong>Microsoft Edge</strong>, atau <strong>Brave</strong>.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-stone-800 text-emerald-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                  2
                </span>
                <div className="flex items-center gap-1.5">
                  <p>
                    Klik ikon <strong>Install / Pasang</strong> di sebelah kanan bilah alamat (URL bar).
                  </p>
                  <Laptop className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-stone-800 text-emerald-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                  3
                </span>
                <p>
                  Konfirmasi <strong>"Install"</strong> untuk membuka LEGA di jendela aplikasi mandiri.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Storage & Cache Management */}
        <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
          <div>
            <span>Penggunaan Memori Cache: </span>
            <span className="text-stone-200 font-medium">
              {storageEstimate ? `${storageEstimate.usageMB} MB` : 'Aktif (Tersedia)'}
            </span>
          </div>
          <button
            onClick={handleClearCache}
            disabled={clearingCache}
            className="text-stone-400 hover:text-rose-300 text-[11px] underline transition"
          >
            {clearingCache ? 'Membersihkan...' : cacheCleared ? 'Cache Dibersihkan!' : 'Bersihkan Cache'}
          </button>
        </div>
      </div>
    </div>
  );
};
