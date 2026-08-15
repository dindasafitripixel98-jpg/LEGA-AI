import React, { useEffect, useState } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  X,
  Sparkles,
  Radio,
  RotateCcw,
  Loader2,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import {
  subscribeVoiceState,
  stopVoiceNarration,
  togglePauseVoice,
  seekVoice,
  VoiceState
} from '../lib/voiceService';

export const GlobalVoiceBar: React.FC = () => {
  const [voiceState, setVoiceState] = useState<VoiceState>(() => ({
    isPlaying: false,
    isLoading: false,
    currentTitle: '',
    currentSubtitle: '',
    currentText: '',
    currentTime: 0,
    duration: 0,
    engine: 'none',
    voiceName: 'Kore'
  }));

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeVoiceState(setVoiceState);
    return () => unsubscribe();
  }, []);

  // Show if audio is active or loading
  if (!voiceState.isPlaying && !voiceState.isLoading && voiceState.currentTime === 0) {
    return null;
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = voiceState.duration > 0
    ? Math.min(100, (voiceState.currentTime / voiceState.duration) * 100)
    : 0;

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-slide-up">
      <div className="bg-stone-900/95 backdrop-blur-xl border border-emerald-800/80 rounded-2xl shadow-2xl shadow-stone-950/80 overflow-hidden text-stone-100 transition-all">
        {/* Top Progress Bar */}
        <div
          className="w-full h-1 bg-stone-800 cursor-pointer relative group"
          onClick={(e) => {
            if (voiceState.duration > 0) {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              seekVoice(pos * voiceState.duration);
            }
          }}
        >
          <div
            className="h-full bg-emerald-500 transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Main Bar Content */}
        <div className="p-3 flex items-center justify-between gap-3">
          {/* Track Info */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
              {voiceState.isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              ) : voiceState.isPlaying ? (
                <div className="flex items-center gap-0.5 h-3 px-0.5">
                  <span className="w-0.5 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="w-0.5 h-3.5 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                  <span className="w-0.5 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
              ) : (
                <Volume2 className="w-4 h-4 text-stone-400" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-stone-100 truncate">
                  {voiceState.currentTitle || 'Panduan Suara LEGA'}
                </p>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                  {voiceState.engine === 'gemini-tts' ? 'Gemini TTS' : 'Web Speech'}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 truncate">
                {voiceState.currentSubtitle || (voiceState.isLoading ? 'Menyiapkan suara AI...' : 'Sedang memutar audio...')}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => togglePauseVoice()}
              disabled={voiceState.isLoading}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold transition active:scale-95 flex items-center justify-center"
              title={voiceState.isPlaying ? 'Jeda' : 'Lanjutkan'}
            >
              {voiceState.isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
              title={isExpanded ? 'Tutup Teks' : 'Lihat Teks Narasi'}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>

            <button
              onClick={() => stopVoiceNarration()}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-rose-300 transition"
              title="Hentikan Audio"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expanded View: Full Narration Script Text */}
        {isExpanded && voiceState.currentText && (
          <div className="px-3.5 pb-3.5 pt-1 border-t border-stone-800/80 space-y-2 animate-fade-in">
            <div className="flex items-center justify-between text-[11px] text-stone-400">
              <span>Naskah Narasi Bimbingan:</span>
              <span>
                {formatTime(voiceState.currentTime)} / {formatTime(voiceState.duration)}
              </span>
            </div>
            <div className="max-h-32 overflow-y-auto p-2.5 rounded-xl bg-stone-950/80 border border-stone-800/80 text-xs text-stone-300 leading-relaxed custom-scrollbar">
              {voiceState.currentText}
            </div>
            <div className="p-2 rounded-lg bg-sky-950/60 border border-sky-600/30 text-[10px] text-sky-200 flex items-center gap-1.5">
              <span>🎧</span>
              <span>Gunakan headset atau earphone untuk pengalaman LEGA yang lebih optimal.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
