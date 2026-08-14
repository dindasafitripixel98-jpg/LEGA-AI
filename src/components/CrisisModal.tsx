import React from 'react';
import { ShieldAlert, PhoneCall, Heart, X, ExternalLink } from 'lucide-react';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-rose-100 dark:border-rose-900/40 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 text-rose-600 dark:text-rose-400">
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 rounded-xl">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
              Dukungan Kesehatan Jiwa Darurat
            </h3>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
              Kamu tidak sendirian. Bantuan profesional selalu tersedia.
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
          LEGA AI adalah pendamping refleksi dan kesadaran diri, bukan pengganti penanganan medis atau psikologi klinis. Jika kamu sedang mengalami krisis emosional berat atau membutuhkan teman bicara langsung, silakan hubungi krisis bantuan resmi di Indonesia berikut:
        </p>

        <div className="space-y-3 mb-6">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PhoneCall className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Layanan Sehat Jiwa Kemenkes RI
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Bantuan Konseling Darurat 24 Jam
                </p>
              </div>
            </div>
            <a
              href="tel:119"
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5"
            >
              119 (Ext 8)
            </a>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-rose-500" />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Into The Light Indonesia
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Panduan & Layanan Pencegahan Bunuh Diri
                </p>
              </div>
            </div>
            <a
              href="https://www.intothelightid.org/cari-bantuan"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg text-xs font-medium transition flex items-center gap-1"
            >
              Kunjungi <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-xl border border-amber-200 dark:border-amber-800/50 mb-5">
          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            <strong>Catatan Keselamatan LEGA:</strong> Luangkan waktu sejenak untuk menarik napas dalam-dalam. Menemui psikolog atau psikiater adalah bentuk cinta dan kepedulian terbesar untuk dirimu sendiri.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition"
        >
          Saya Mengerti, Kembali ke LEGA
        </button>
      </div>
    </div>
  );
};
