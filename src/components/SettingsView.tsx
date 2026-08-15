import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Database,
  Check,
  Smartphone,
  Wifi,
  WifiOff,
  HardDrive,
  Download,
  Trash2,
  Sparkles,
  Layers,
  RefreshCw,
  CheckCircle2,
  Mic
} from 'lucide-react';
import { usePwa } from '../lib/pwaManager';
import { LegaVoiceSelector } from './LegaVoiceSelector';

interface SettingsViewProps {
  onOpenPwaModal?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenPwaModal }) => {
  const {
    isInstalled,
    isInstallable,
    isOnline,
    isSupported,
    storageEstimate,
    clearPwaCache,
    refreshStorageEstimate,
    applyUpdate,
    isUpdateAvailable
  } = usePwa();

  const [isClearing, setIsClearing] = useState(false);
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleClearCache = async () => {
    setIsClearing(true);
    await clearPwaCache();
    await refreshStorageEstimate();
    setIsClearing(false);
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 3000);
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6 text-stone-100 animate-fade-in">
      <div className="space-y-1">
        <h2 className="text-xl md:text-2xl font-bold text-stone-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-400" />
          <span>Pengaturan &amp; PWA Mode</span>
        </h2>
        <p className="text-xs md:text-sm text-stone-400">
          Konfigurasi sistem Progressive Web App (PWA), mode offline, dan privasi data LEGA.
        </p>
      </div>

      <div className="space-y-5">
        {/* PWA & Offline Status Card */}
        <div className="p-5 md:p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm md:text-base font-bold text-stone-100 flex items-center gap-2">
                  <span>PWA &amp; Akses Aplikasi Mandiri</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    PWA Ready
                  </span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Pasang LEGA langsung ke layar utama ponsel atau desktop tanpa toko aplikasi.
                </p>
              </div>
            </div>

            {onOpenPwaModal && (
              <button
                onClick={onOpenPwaModal}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold rounded-xl text-xs transition active:scale-95 shadow-md shadow-emerald-950/40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isInstalled ? 'Status PWA' : 'Pasang Aplikasi'}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 bg-stone-950/80 rounded-2xl border border-stone-800/80 space-y-1">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>Mode Aplikasi</span>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-sm font-semibold text-stone-200">
                {isInstalled ? 'Standalone (Terpasang)' : 'Web Browser'}
              </p>
              <p className="text-[11px] text-stone-500">
                {isInstalled ? 'Tampilan layar penuh aktif' : 'Dapat dipasang ke layar utama'}
              </p>
            </div>

            <div className="p-3.5 bg-stone-950/80 rounded-2xl border border-stone-800/80 space-y-1">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>Status Jaringan</span>
                {isOnline ? (
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                )}
              </div>
              <p className={`text-sm font-semibold ${isOnline ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isOnline ? 'Online (Terhubung)' : 'Offline (Lokal Aktif)'}
              </p>
              <p className="text-[11px] text-stone-500">
                {isOnline ? 'Semua fitur AI siap digunakan' : 'Fitur lokal tetap berfungsi'}
              </p>
            </div>

            <div className="p-3.5 bg-stone-950/80 rounded-2xl border border-stone-800/80 space-y-1">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>Cache &amp; Offline Service</span>
                <HardDrive className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <p className="text-sm font-semibold text-teal-300">
                {isSupported ? 'Service Worker Aktif' : 'Tersedia'}
              </p>
              <p className="text-[11px] text-stone-500">
                {storageEstimate ? `Penggunaan: ${storageEstimate.usageMB} MB` : 'Penyimpanan lokal aman'}
              </p>
            </div>
          </div>

          {/* Action Row for Mobile / Desktop */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-800/80">
            <div className="flex items-center gap-2">
              {onOpenPwaModal && (
                <button
                  onClick={onOpenPwaModal}
                  className="sm:hidden px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isInstalled ? 'Status PWA' : 'Pasang App'}</span>
                </button>
              )}

              {isUpdateAvailable && (
                <button
                  onClick={applyUpdate}
                  className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Perbarui Versi Baru</span>
                </button>
              )}
            </div>

            <button
              onClick={handleClearCache}
              disabled={isClearing}
              className="px-3 py-1.5 rounded-xl border border-stone-800 bg-stone-950 hover:bg-stone-800 text-stone-400 hover:text-rose-300 text-xs flex items-center gap-1.5 transition ml-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isClearing ? 'Membersihkan...' : clearedNotice ? 'Cache Berhasil Dibersihkan' : 'Bersihkan Cache Offline'}</span>
            </button>
          </div>
        </div>

        {/* 6 Pilihan Suara Narasi LEGA */}
        <div className="p-5 md:p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 shadow-xl">
          <LegaVoiceSelector />
        </div>

        {/* Offline Features Guarantee */}
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
          <div className="flex items-center gap-2 text-teal-400 font-semibold text-sm">
            <Layers className="w-5 h-5" />
            <span>Kesiapan Fitur Saat Offline (Tanpa Kuota/Internet)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-stone-200">Latihan Pernapasan Sadar (Breathing)</p>
                <p className="text-stone-400 text-[11px] mt-0.5">Visualisasi ritme napas 4-7-8, box breathing &amp; penenang saraf berjalan 100% offline.</p>
              </div>
            </div>

            <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-stone-200">Audio Meditasi &amp; Lanskap Suara Synth</p>
                <p className="text-stone-400 text-[11px] mt-0.5">Generator audio Web Audio API menghasilkan deru ombak, hujan, &amp; nada solfeggio tanpa download audio besar.</p>
              </div>
            </div>

            <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-stone-200">Jurnal Refleksi &amp; Pencatatan Emosi</p>
                <p className="text-stone-400 text-[11px] mt-0.5">Seluruh entri tersimpan aman di browser/perangkat Anda dan tidak akan hilang saat offline.</p>
              </div>
            </div>

            <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-stone-200">Pemindaian Tubuh &amp; Observer Mind</p>
                <p className="text-stone-400 text-[11px] mt-0.5">Panduan teks somatis dan refleksi pelepasan emosi siap digunakan kapan saja.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Card */}
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <Shield className="w-5 h-5" />
            <span>Privasi &amp; Keamanan Data</span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            Seluruh catatan jurnal dan emosi disimpan secara lokal pada perangkat Anda. Permintaan AI dikirimkan ke server-side proxy tanpa menyertakan identitas pribadi Anda, menjamin kenyamanan dan kerahasiaan penuh.
          </p>
        </div>

        {/* Gemini API Card */}
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-teal-400 font-semibold text-sm">
            <Database className="w-5 h-5" />
            <span>Integrasi Gemini API Status</span>
          </div>
          <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs text-stone-300 flex items-center justify-between">
            <span>Model Teks: Gemini 3.6 Flash / Gemini 3.1 Pro</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Terkoneksi
            </span>
          </div>
          <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs text-stone-300 flex items-center justify-between">
            <span>Model Suara Narasi: Engine Suara LEGA</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Terkoneksi
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
