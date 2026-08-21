import React, { useState, useEffect } from 'react';
import {
  Mic,
  Play,
  Square,
  Check,
  Sparkles,
  Volume2,
  Headphones,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import {
  VOICE_CHARACTERS,
  VoiceCharacterProfile,
  getVoiceCharacter
} from '../lib/audioEngine';
import {
  getStoredVoiceName,
  setStoredVoiceName,
  subscribeVoiceState,
  stopVoiceNarration,
  previewVoiceCharacterAudio,
  stopVoicePreview
} from '../lib/voiceService';

interface LegaVoiceSelectorProps {
  selectedVoice?: string;
  onVoiceChange?: (voiceName: string) => void;
  showTitle?: boolean;
  compact?: boolean;
}

export const LegaVoiceSelector: React.FC<LegaVoiceSelectorProps> = ({
  selectedVoice,
  onVoiceChange,
  showTitle = true,
  compact = false
}) => {
  const [activeVoice, setActiveVoice] = useState<string>(
    selectedVoice || getStoredVoiceName() || 'rina'
  );
  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);

  useEffect(() => {
    if (selectedVoice) {
      setActiveVoice(selectedVoice);
    }
  }, [selectedVoice]);

  useEffect(() => {
    const unsub = subscribeVoiceState((vState) => {
      if (vState.voiceName && vState.voiceName !== activeVoice && !selectedVoice) {
        setActiveVoice(vState.voiceName);
      }
    });
    return unsub;
  }, [activeVoice, selectedVoice]);

  const handleSelectVoice = (vId: string) => {
    setActiveVoice(vId);
    setStoredVoiceName(vId);
    if (onVoiceChange) {
      onVoiceChange(vId);
    }
  };

  const handlePreviewVoice = (v: VoiceCharacterProfile, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (previewingVoice === v.id || previewingVoice === v.name) {
      stopVoicePreview();
      stopVoiceNarration();
      setPreviewingVoice(null);
      return;
    }

    stopVoicePreview();
    stopVoiceNarration();
    setPreviewingVoice(v.id);

    previewVoiceCharacterAudio(
      v.id,
      () => {
        setPreviewingVoice(v.id);
      },
      () => {
        setPreviewingVoice(null);
      },
      () => {
        setPreviewingVoice(null);
      }
    );
  };

  const currentProfile = getVoiceCharacter(activeVoice);

  return (
    <div className="space-y-4" id="lega-voice-selector-container">
      {showTitle && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎙️</span>
              <h3 className="text-sm md:text-base font-bold text-stone-100 flex items-center gap-2">
                <span>Pilih Karakter Suara Noiz AI</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-700/60 font-mono">
                  6 Karakter Noiz AI Ultra-Real
                </span>
              </h3>
            </div>
            <p className="text-[11px] md:text-xs text-stone-400">
              6 pilihan suara narasi Bahasa Indonesia berkualitas ultra-realistis dari Noiz AI untuk seluruh modul dan bimbingan LEGA.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-stone-400">Aktif:</span>
            <span className="px-2.5 py-1 rounded-xl bg-sky-900/50 border border-sky-500/50 text-sky-200 text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span>{currentProfile.name}</span>
            </span>
          </div>
        </div>
      )}

      {/* Grid of 6 LEGA Voices: Fully responsive for PC, Laptop, Tablet, iOS, Android */}
      <div className={`grid ${compact ? 'grid-cols-1 sm:grid-cols-2 gap-2.5' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5'}`}>
        {VOICE_CHARACTERS.map((v, index) => {
          const isSelected = activeVoice.toLowerCase() === v.id || activeVoice.toLowerCase() === v.name.toLowerCase();
          const isPreviewing = previewingVoice === v.id || previewingVoice === v.name;
          const isFemale = v.gender === 'female';

          return (
            <div
              key={v.id}
              id={`voice-card-${v.id}`}
              onClick={() => handleSelectVoice(v.id)}
              className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-3 relative group ${
                isSelected
                  ? 'bg-gradient-to-br from-sky-950/80 via-stone-900 to-indigo-950/70 border-sky-500 ring-2 ring-sky-500/40 shadow-lg shadow-sky-950/50 scale-[1.01]'
                  : 'bg-stone-950/80 hover:bg-stone-900/90 border-stone-800 hover:border-stone-700 text-stone-300'
              }`}
            >
              {/* Top Row: Index number, Voice Name, and Badge */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-sky-500 text-stone-950 shadow' : 'bg-stone-800 text-stone-400'
                    }`}>
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-stone-100 truncate flex items-center gap-1.5">
                        <span>{v.name}</span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                        )}
                      </h4>
                      <p className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${isFemale ? 'bg-rose-400' : 'bg-sky-400'}`} />
                        <span>{isFemale ? 'Vokal Feminin' : 'Vokal Maskulin'}</span>
                        <span>•</span>
                        <span className="text-sky-400 font-medium">Noiz AI ({v.id})</span>
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold shrink-0 ${
                    isSelected
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      : 'bg-stone-900 text-stone-400 border border-stone-800'
                  }`}>
                    {v.badge}
                  </span>
                </div>

                {/* Tone and Description */}
                <p className="text-xs text-stone-300 leading-relaxed line-clamp-2 min-h-[32px]">
                  {v.description}
                </p>

                {/* Sample phrase quote preview */}
                <div className="p-2 rounded-xl bg-stone-950/60 border border-stone-800/60 text-[11px] text-stone-400 italic leading-snug">
                  "{v.samplePhrase.length > 75 ? v.samplePhrase.slice(0, 75) + '...' : v.samplePhrase}"
                </div>
              </div>

              {/* Bottom Actions: Select Button + Preview Button */}
              <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectVoice(v.id)}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-sky-500 text-stone-950 shadow-md shadow-sky-500/20'
                      : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Dipilih</span>
                    </>
                  ) : (
                    <span>Pilih {v.name}</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={(e) => handlePreviewVoice(v, e)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 shrink-0 ${
                    isPreviewing
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 animate-pulse'
                      : 'bg-stone-900 hover:bg-stone-800 text-sky-400 hover:text-sky-300 border border-stone-800'
                  }`}
                  title={`Dengarkan contoh ${v.name}`}
                >
                  {isPreviewing ? (
                    <>
                      <Square className="w-3 h-3 fill-rose-400 text-rose-400" />
                      <span>Berhenti</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-sky-400 text-sky-400" />
                      <span>▶ Contoh</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cross-Platform Device Guarantee Banner */}
      <div className="p-3.5 rounded-2xl bg-stone-950/90 border border-stone-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-stone-400">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 flex items-center justify-center text-xs font-bold">
            ✓
          </div>
          <div>
            <span className="font-semibold text-stone-200">Kompatibilitas Penuh: </span>
            <span>Tersedia &amp; tersimpan otomatis di PC, Laptop, Android, iOS, &amp; Tablet.</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-sky-400 bg-sky-950/60 px-2.5 py-1 rounded-lg border border-sky-800/40 shrink-0">
          <Sparkles className="w-3 h-3" />
          <span>Digunakan di seluruh modul LEGA</span>
        </div>
      </div>
    </div>
  );
};
