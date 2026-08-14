import React from 'react';
import { Settings, Shield, Bell, Database, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6 text-stone-100">
      <div className="space-y-1">
        <h2 className="text-xl md:text-2xl font-bold text-stone-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-400" />
          <span>Pengaturan Aplikasi</span>
        </h2>
        <p className="text-xs md:text-sm text-stone-400">
          Konfigurasi sistem, keamanan, dan preferensi privasi LEGA.
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <Shield className="w-5 h-5" />
            <span>Privasi & Keamanan Data</span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            Seluruh catatan jurnal dan emosi disimpan secara lokal pada browser Anda. Permintaan AI dikirimkan ke server-side proxy tanpa menyertakan identitas pribadi Anda.
          </p>
        </div>

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
            <span>Model Suara TTS: Gemini 3.1 Flash TTS</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Terkoneksi
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
