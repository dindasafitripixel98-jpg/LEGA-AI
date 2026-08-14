import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Loader2, Sparkles, Pause, Play, Radio } from 'lucide-react';
import { playVoiceNarration, stopVoiceNarration, subscribeVoiceState, VoiceState, VoiceOptions } from '../lib/voiceService';

interface VoiceGuideButtonProps {
  text: string;
  title?: string;
  subtitle?: string;
  label?: string;
  variant?: 'pill' | 'compact' | 'icon' | 'banner' | 'card';
  voiceName?: 'Kore' | 'Aoede' | 'Puck' | 'Fenrir' | 'Leda' | 'Charon';
  className?: string;
  onPlay?: () => void;
}

export const VoiceGuideButton: React.FC<VoiceGuideButtonProps> = ({
  text,
  title,
  subtitle,
  label = 'Dengarkan Panduan Suara',
  variant = 'pill',
  voiceName,
  className = '',
  onPlay
}) => {
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

  useEffect(() => {
    const unsubscribe = subscribeVoiceState(setVoiceState);
    return () => unsubscribe();
  }, []);

  const isCurrentText = voiceState.currentText === text || (voiceState.currentTitle === title && title !== undefined);
  const isPlayingThis = isCurrentText && voiceState.isPlaying;
  const isLoadingThis = isCurrentText && voiceState.isLoading;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlayingThis || isLoadingThis) {
      stopVoiceNarration();
    } else {
      onPlay?.();
      playVoiceNarration(text, {
        title: title || label,
        subtitle: subtitle || 'Bimbingan Hening LEGA AI',
        voiceName
      });
    }
  };

  // Soundwave animated bars
  const SoundWave = () => (
    <div className="flex items-center gap-0.5 h-3.5 px-0.5">
      <span className="w-0.5 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
      <span className="w-0.5 h-3.5 bg-current rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
      <span className="w-0.5 h-1.5 bg-current rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
      <span className="w-0.5 h-3 bg-current rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
    </div>
  );

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        disabled={!text}
        title={isPlayingThis ? 'Hentikan Suara' : isLoadingThis ? 'Memproses Suara Gemini...' : label}
        className={`p-2 rounded-xl transition active:scale-95 flex items-center justify-center ${
          isPlayingThis
            ? 'bg-emerald-500 text-stone-950 shadow-lg shadow-emerald-500/30'
            : isLoadingThis
            ? 'bg-stone-800 text-emerald-400 animate-pulse'
            : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-emerald-300 border border-stone-700/60'
        } ${className}`}
      >
        {isLoadingThis ? (
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
        ) : isPlayingThis ? (
          <SoundWave />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        disabled={!text}
        className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition active:scale-95 ${
          isPlayingThis
            ? 'bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-950/40'
            : isLoadingThis
            ? 'bg-emerald-950/70 border border-emerald-700/60 text-emerald-300'
            : 'bg-stone-800/90 hover:bg-stone-700 text-stone-300 hover:text-emerald-300 border border-stone-700/70'
        } ${className}`}
      >
        {isLoadingThis ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
        ) : isPlayingThis ? (
          <SoundWave />
        ) : (
          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
        )}
        <span>{isPlayingThis ? 'Heningkan' : isLoadingThis ? 'Memuat...' : label}</span>
      </button>
    );
  }

  if (variant === 'banner') {
    return (
      <div
        onClick={handleClick}
        className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
          isPlayingThis
            ? 'bg-emerald-950/60 border-emerald-700/70 shadow-lg shadow-emerald-950/40'
            : 'bg-stone-900/90 hover:bg-stone-850 border-stone-800 hover:border-emerald-800/60'
        } ${className}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isPlayingThis
                ? 'bg-emerald-500 text-stone-950 font-bold shadow-md'
                : 'bg-emerald-950/80 border border-emerald-800/60 text-emerald-400'
            }`}
          >
            {isLoadingThis ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            ) : isPlayingThis ? (
              <SoundWave />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-stone-200 truncate flex items-center gap-1.5">
              <span>{title || label}</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Gemini Voice
              </span>
            </p>
            <p className="text-[11px] text-stone-400 truncate">
              {subtitle || (isPlayingThis ? 'Sedang membimbing narasi...' : 'Klik untuk mendengarkan panduan audio')}
            </p>
          </div>
        </div>

        <button
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 transition ${
            isPlayingThis
              ? 'bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/60'
              : 'bg-emerald-600 hover:bg-emerald-500 text-stone-950'
          }`}
        >
          {isPlayingThis ? (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span>Stop</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Putar</span>
            </>
          )}
        </button>
      </div>
    );
  }

  // Default 'pill' variant
  return (
    <button
      onClick={handleClick}
      disabled={!text}
      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition active:scale-95 ${
        isPlayingThis
          ? 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/20'
          : isLoadingThis
          ? 'bg-stone-800 text-emerald-400 border border-emerald-700/60 animate-pulse'
          : 'bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/60 hover:border-emerald-700'
      } ${className}`}
    >
      {isLoadingThis ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
      ) : isPlayingThis ? (
        <SoundWave />
      ) : (
        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
      )}
      <span>{isPlayingThis ? 'Hentikan Suara' : isLoadingThis ? 'Memuat Narasi...' : label}</span>
    </button>
  );
};
