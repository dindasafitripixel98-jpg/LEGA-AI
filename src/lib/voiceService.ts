// LEGA Universal Voice Engine - Seamless Noiz AI & Gemini TTS & Offline Speech Synthesis
// SHAQILA DIGITAL 99 - LEGA AI Voice System

import { generateGeminiTts, generateNoizAiTts, previewNoizVoice, fetchVoiceSamples } from './geminiApi';
import { pcmToWavBlobUrl, speakIndonesianNarration, stopIndonesianNarration, getVoiceCharacter } from './audioEngine';
import { generateDistinctVoiceAudio } from './voiceSynthesisEngine';

export type VoiceEngineType = 'noiz-ai' | 'gemini-tts' | 'web-speech' | 'none';

export interface VoiceOptions {
  title?: string;
  subtitle?: string;
  voiceName?: string;
  preferredEngine?: VoiceEngineType;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export interface VoiceState {
  isPlaying: boolean;
  isLoading: boolean;
  currentTitle: string;
  currentSubtitle: string;
  currentText: string;
  currentTime: number;
  duration: number;
  engine: VoiceEngineType;
  voiceName: string;
}

export const NOIZ_VOICES = [
  {
    id: 'rina',
    name: 'Rina',
    label: 'Rina — Hangat & Lembut',
    gender: 'female' as const,
    lang: 'id-ID',
    tag: 'Noiz AI Ultra-Real',
    description: 'Hangat & lembut (Vokal Feminin)',
    samplePhrase: 'Selamat datang di ruang tenang Anda bersama Noiz AI. Tarik napas lembut dan izinkan batin Anda beristirahat dalam kedamaian.'
  },
  {
    id: 'nova',
    name: 'Nova',
    label: 'Nova — Jernih & Elegan',
    gender: 'female' as const,
    lang: 'id-ID',
    tag: 'Mindfulness & Presence',
    description: 'Jernih & elegan (Vokal Feminin)',
    samplePhrase: 'Setiap tarikan napas membawa kejernihan baru bagi pikiran Anda. Anda aman, tenang, dan hadir di saat ini.'
  },
  {
    id: 'bayu',
    name: 'Bayu',
    label: 'Bayu — Tenang & Maskulin',
    gender: 'male' as const,
    lang: 'id-ID',
    tag: 'Grounding & Nafas',
    description: 'Tenang & maskulin (Vokal Maskulin)',
    samplePhrase: 'Mari berhenti sejenak dari segala kesibukan. Sadari tubuh Anda dan lepaskan ketegangan secara perlahan.'
  },
  {
    id: 'maya',
    name: 'Maya',
    label: 'Maya — Natural & Ramah',
    gender: 'female' as const,
    lang: 'id-ID',
    tag: 'Pelepasan Emosi',
    description: 'Natural & ramah (Vokal Feminin)',
    samplePhrase: 'Tarik napas perlahan... rasakan kelembutan udara yang mengalir dan izinkan seluruh beban batin Anda melunak.'
  },
  {
    id: 'arga',
    name: 'Arga',
    label: 'Arga — Tegas & Profesional',
    gender: 'male' as const,
    lang: 'id-ID',
    tag: 'Deep Grounding',
    description: 'Tegas & profesional (Vokal Maskulin)',
    samplePhrase: 'Rasakan pijakan Anda yang kokoh dan berjangkar kuat. Napas Anda aman di ruang perlindungan yang tenang ini.'
  },
  {
    id: 'alisa',
    name: 'Alisa',
    label: 'Alisa — Ceria & Ekspresif',
    gender: 'female' as const,
    lang: 'id-ID',
    tag: 'Sleep & Lullaby',
    description: 'Ceria & ekspresif (Vokal Feminin)',
    samplePhrase: 'Pejamkan mata Anda secara perlahan... biarkan rasa tenang meresap lembut ke setiap helai napas dan sel tubuh Anda.'
  }
];

/**
 * Migrates legacy localStorage voice keys to canonical Noiz AI IDs
 */
export function migrateLegacyVoiceKey(key?: string | null): string {
  if (!key) return 'rina';
  const q = key.toLowerCase().trim();
  if (q === 'rina' || q === 'noiz rina') return 'rina';
  if (q === 'nova' || q === 'noiz nova') return 'nova';
  if (q === 'bayu' || q === 'noiz bayu') return 'bayu';
  if (q === 'maya' || q === 'noiz maya') return 'maya';
  if (q === 'arga' || q === 'noiz arga') return 'arga';
  if (q === 'alisa' || q === 'noiz alisa') return 'alisa';

  // Legacy key migration
  if (q.includes('suara-tenang') || q.includes('suara tenang') || q.includes('kore') || q.includes('laras')) return 'rina';
  if (q.includes('suara-hangat') || q.includes('suara hangat') || q.includes('puck') || q.includes('damai')) return 'bayu';
  if (q.includes('suara-lembut') || q.includes('suara lembut') || q.includes('aoede') || q.includes('nirmala')) return 'maya';
  if (q.includes('suara-natural') || q.includes('suara natural') || q.includes('zephyr')) return 'arga';
  if (q.includes('suara-jernih') || q.includes('suara jernih') || q.includes('leda') || q.includes('calliope')) return 'nova';
  if (q.includes('suara-dalam') || q.includes('suara dalam') || q.includes('fenrir') || q.includes('sleep') || q.includes('tidur')) return 'alisa';
  return 'rina';
}

/**
 * Returns formatted display name for active voice ("Rina", "Nova", "Bayu", "Maya", "Arga", "Alisa")
 */
export function getVoiceDisplayName(key?: string | null): string {
  const canonical = migrateLegacyVoiceKey(key);
  switch (canonical) {
    case 'rina': return 'Rina';
    case 'nova': return 'Nova';
    case 'bayu': return 'Bayu';
    case 'maya': return 'Maya';
    case 'arga': return 'Arga';
    case 'alisa': return 'Alisa';
    default: return 'Rina';
  }
}

// In-memory audio cache to prevent redundant TTS API calls
const audioCache = new Map<string, string>();

type VoiceListener = (state: VoiceState) => void;
const listeners = new Set<VoiceListener>();

let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let currentTrackId: string | null = null;
let timeUpdateInterval: any = null;

function getInitialVoiceName(): string {
  if (typeof localStorage !== 'undefined') {
    const raw = localStorage.getItem('lega_voice_name');
    const migrated = migrateLegacyVoiceKey(raw);
    if (raw !== migrated) {
      localStorage.setItem('lega_voice_name', migrated);
    }
    return migrated;
  }
  return 'rina';
}

let state: VoiceState = {
  isPlaying: false,
  isLoading: false,
  currentTitle: '',
  currentSubtitle: '',
  currentText: '',
  currentTime: 0,
  duration: 0,
  engine: 'none',
  voiceName: getInitialVoiceName()
};

function notifyListeners() {
  listeners.forEach((listener) => listener({ ...state }));
}

export function getVoiceState(): VoiceState {
  return { ...state };
}

export function subscribeVoiceState(listener: VoiceListener): () => void {
  listeners.add(listener);
  listener({ ...state });
  return () => {
    listeners.delete(listener);
  };
}

export function getStoredVoiceEngine(): VoiceEngineType {
  if (typeof localStorage !== 'undefined') {
    return (localStorage.getItem('lega_voice_engine') as VoiceEngineType) || 'noiz-ai';
  }
  return 'noiz-ai';
}

export function setStoredVoiceEngine(engine: VoiceEngineType) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('lega_voice_engine', engine);
  }
  state.engine = engine;
  notifyListeners();
}

export function getStoredVoiceName(): string {
  if (typeof localStorage !== 'undefined') {
    const raw = localStorage.getItem('lega_voice_name');
    const migrated = migrateLegacyVoiceKey(raw);
    if (raw !== migrated) {
      localStorage.setItem('lega_voice_name', migrated);
    }
    return migrated;
  }
  return 'rina';
}

export function setStoredVoiceName(name: string) {
  const canonicalId = migrateLegacyVoiceKey(name);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('lega_voice_name', canonicalId);
  }
  state.voiceName = canonicalId;
  notifyListeners();
}

/**
 * Pre-warms voice character audio samples for 0ms latency audio preview on iOS, Android & PC
 */
let isPrewarmed = false;
export async function initializeVoiceEngine(): Promise<void> {
  if (isPrewarmed || typeof window === 'undefined') return;
  isPrewarmed = true;

  try {
    const { VOICE_CHARACTERS } = await import('./audioEngine');
    for (const v of VOICE_CHARACTERS) {
      try {
        const audioUrl = await generateDistinctVoiceAudio(v);
        if (audioUrl) {
          audioCache.set(`sample:${v.id}`, audioUrl);
          audioCache.set(`sample:${v.name}`, audioUrl);
          audioCache.set(`sample:${v.geminiVoice}`, audioUrl);
          audioCache.set(`preview:${v.geminiVoice}:${v.samplePhrase}`, audioUrl);
        }
      } catch {
        // continue
      }
    }
  } catch (err) {
    console.warn('Voice engine init notice:', err);
  }
}

// Automatically trigger voice sample warming
if (typeof window !== 'undefined') {
  setTimeout(() => {
    initializeVoiceEngine().catch(() => {});
  }, 100);
}

/**
 * Preview Noiz AI Voice Character
 */
export async function previewNoizAiVoiceAudio(
  voiceId: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): Promise<void> {
  if (previewAudioInstance) {
    previewAudioInstance.pause();
    previewAudioInstance = null;
  }
  stopVoiceNarration();

  const canonicalId = migrateLegacyVoiceKey(voiceId);
  const noizVoice = NOIZ_VOICES.find(v => v.id === canonicalId) || NOIZ_VOICES[0];
  const cacheKey = `noiz_preview:${noizVoice.id}`;

  console.log(`[Noiz Voice Preview] Playing preview for character: "${noizVoice.id}" (${noizVoice.name})`);

  let audioUrl = audioCache.get(cacheKey);
  if (!audioUrl) {
    try {
      const res = await previewNoizVoice(noizVoice.id);
      if (res) {
        audioUrl = res;
        audioCache.set(cacheKey, audioUrl);
      }
    } catch (err) {
      console.warn('Noiz voice preview error:', err);
    }
  }

  if (audioUrl) {
    try {
      const audio = new Audio(audioUrl);
      previewAudioInstance = audio;
      audio.volume = 0.95;

      audio.onplay = () => onStart?.();
      audio.onended = () => {
        previewAudioInstance = null;
        onEnd?.();
      };
      audio.onerror = (e) => {
        previewAudioInstance = null;
        onError?.(e);
      };

      await audio.play();
      return;
    } catch (playErr) {
      console.warn('Noiz Audio play error, fallback to web speech:', playErr);
    }
  }

  // Fallback to Web Speech Synthesis with graceful tone
  speakIndonesianNarration(noizVoice.samplePhrase, {
    voiceCharacter: noizVoice.name,
    pitch: noizVoice.gender === 'female' ? 1.1 : 0.9,
    rate: 0.9,
    onStart,
    onEnd,
    onError
  });
}

/**
 * Previews a specific voice character with its sample phrase using distinct acoustic vocal synthesis.
 * Guaranteed 100% distinct vocal resonance across iOS, Android, Tablets, PC, Mac, Windows.
 */
let previewAudioInstance: HTMLAudioElement | null = null;

export async function previewVoiceCharacterAudio(
  voiceName: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): Promise<void> {
  // If voice name contains noiz or matches a noiz voice, use Noiz preview
  if (voiceName.toLowerCase().includes('noiz') || NOIZ_VOICES.some(v => v.id === voiceName.toLowerCase() || v.name.toLowerCase() === voiceName.toLowerCase())) {
    return previewNoizAiVoiceAudio(voiceName, onStart, onEnd, onError);
  }

  // Stop existing preview
  if (previewAudioInstance) {
    previewAudioInstance.pause();
    previewAudioInstance = null;
  }
  stopVoiceNarration();

  const profile = getVoiceCharacter(voiceName);
  const samplePhrase = profile.samplePhrase;
  const trackId = `preview:${profile.geminiVoice}:${samplePhrase}`;

  let audioUrl = 
    audioCache.get(`sample:${profile.id}`) ||
    audioCache.get(`sample:${profile.name}`) ||
    audioCache.get(`sample:${profile.geminiVoice}`) ||
    audioCache.get(trackId);

  if (!audioUrl) {
    try {
      audioUrl = await generateDistinctVoiceAudio(profile);
      if (audioUrl) {
        audioCache.set(`sample:${profile.id}`, audioUrl);
        audioCache.set(`sample:${profile.name}`, audioUrl);
        audioCache.set(trackId, audioUrl);
      }
    } catch (err) {
      console.warn('Acoustic voice preview generation notice:', err);
    }
  }

  if (audioUrl) {
    try {
      const audio = new Audio(audioUrl);
      previewAudioInstance = audio;
      audio.volume = 0.95;

      audio.onplay = () => onStart?.();
      audio.onended = () => {
        previewAudioInstance = null;
        onEnd?.();
      };
      audio.onerror = (e) => {
        previewAudioInstance = null;
        onError?.(e);
      };

      await audio.play();
      return;
    } catch (playErr) {
      console.warn('Audio play error, fallback to web speech:', playErr);
    }
  }

  // Fallback to Web Speech Synthesis
  speakIndonesianNarration(samplePhrase, {
    voiceCharacter: profile.name,
    pitch: profile.pitch,
    rate: profile.rate,
    onStart,
    onEnd,
    onError
  });
}

export function stopVoicePreview() {
  if (previewAudioInstance) {
    previewAudioInstance.pause();
    previewAudioInstance.currentTime = 0;
    previewAudioInstance = null;
  }
  stopIndonesianNarration();
}

/**
 * Play voice narration for any text.
 * Prioritizes Noiz AI Ultra-Real TTS (noiz.ai) or Gemini TTS, then gracefully falls back to Indonesian Web Speech Synthesis.
 */
export async function playVoiceNarration(
  text: string,
  options?: VoiceOptions
): Promise<void> {
  if (!text || text.trim().length === 0) return;

  const title = options?.title || 'Panduan Suara LEGA AI';
  const subtitle = options?.subtitle || 'Mendengarkan bimbingan hening...';
  const rawVoiceName = options?.voiceName || getStoredVoiceName();
  const canonicalVoiceId = migrateLegacyVoiceKey(rawVoiceName);
  const preferredEngine = options?.preferredEngine || getStoredVoiceEngine();
  const trackId = `${preferredEngine}:${canonicalVoiceId}:${text.trim()}`;

  // If already playing this exact track, toggle pause/play
  if (currentTrackId === trackId && (state.isPlaying || currentAudio || currentUtterance)) {
    stopVoiceNarration();
    return;
  }

  // Stop any currently active voice
  stopVoiceNarration();

  currentTrackId = trackId;
  state = {
    ...state,
    isLoading: true,
    isPlaying: false,
    currentTitle: title,
    currentSubtitle: subtitle,
    currentText: text,
    currentTime: 0,
    duration: 0,
    engine: preferredEngine,
    voiceName: canonicalVoiceId
  };
  notifyListeners();

  const cleanText = text
    .replace(/\[PAUSE_SHORT\]/gi, '... ')
    .replace(/\[PAUSE_MEDIUM\]/gi, '... ... ')
    .replace(/\[PAUSE_LONG\]/gi, '... ... ... ')
    .replace(/\[Jeda \d+ detik\]/gi, '... ')
    .replace(/[*#_`]/g, '')
    .trim();

  // Try to find in cache first
  const cachedUrl = audioCache.get(trackId);
  if (cachedUrl) {
    playAudioUrl(cachedUrl, title, subtitle, cleanText, canonicalVoiceId, preferredEngine, options);
    return;
  }

  // 1. Try Noiz AI TTS first if engine is 'noiz-ai' or preferred
  if (preferredEngine === 'noiz-ai' || preferredEngine === 'none') {
    try {
      const noizResult = await generateNoizAiTts(cleanText, canonicalVoiceId);
      if (noizResult && noizResult.audioDataUrl && currentTrackId === trackId) {
        audioCache.set(trackId, noizResult.audioDataUrl);
        playAudioUrl(noizResult.audioDataUrl, title, subtitle, cleanText, canonicalVoiceId, 'noiz-ai', options);
        return;
      }
    } catch (noizErr) {
      console.warn('Noiz AI TTS call notice, falling back:', noizErr);
    }
  }

  // 2. Try Gemini Neural TTS via server
  try {
    const audioData = await generateGeminiTts(cleanText, canonicalVoiceId);
    if (audioData && currentTrackId === trackId) {
      let finalAudioUrl = audioData;
      if (!audioData.startsWith('data:') && !audioData.startsWith('blob:') && !audioData.startsWith('http')) {
        finalAudioUrl = pcmToWavBlobUrl(audioData, 24000);
      }
      if (finalAudioUrl) {
        audioCache.set(trackId, finalAudioUrl);
        playAudioUrl(finalAudioUrl, title, subtitle, cleanText, canonicalVoiceId, 'gemini-tts', options);
        return;
      }
    }
  } catch (err) {
    console.warn('Gemini TTS network call failed, falling back to Web Speech API:', err);
  }

  // 3. Fallback to Web Speech API (Indonesian synthesized narration)
  if (currentTrackId === trackId) {
    playWebSpeechFallback(cleanText, title, subtitle, canonicalVoiceId, options);
  }
}

function playAudioUrl(
  url: string,
  title: string,
  subtitle: string,
  text: string,
  voiceName: string,
  engineType: VoiceEngineType = 'noiz-ai',
  options?: VoiceOptions
) {
  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }

    const audio = new Audio(url);
    currentAudio = audio;
    audio.volume = options?.volume ?? 0.95;

    audio.onloadedmetadata = () => {
      state.duration = audio.duration || 0;
      notifyListeners();
    };

    audio.onplay = () => {
      state = {
        ...state,
        isLoading: false,
        isPlaying: true,
        currentTitle: title,
        currentSubtitle: subtitle,
        currentText: text,
        engine: engineType,
        voiceName
      };
      notifyListeners();
      options?.onStart?.();

      if (timeUpdateInterval) clearInterval(timeUpdateInterval);
      timeUpdateInterval = setInterval(() => {
        if (currentAudio) {
          state.currentTime = currentAudio.currentTime;
          state.duration = currentAudio.duration || state.duration;
          notifyListeners();
        }
      }, 250);
    };

    audio.onended = () => {
      stopVoiceNarration();
      options?.onEnd?.();
    };

    audio.onerror = (err) => {
      console.warn('Audio playback error, falling back to Web Speech API:', err);
      if (currentAudio === audio) {
        playWebSpeechFallback(text, title, subtitle, voiceName, options);
      }
    };

    audio.play().catch((err) => {
      console.warn('Audio play() failed (possibly autoplay restriction):', err);
      playWebSpeechFallback(text, title, subtitle, voiceName, options);
    });
  } catch (err) {
    console.error('Error starting audio playback:', err);
    playWebSpeechFallback(text, title, subtitle, voiceName, options);
  }
}

function playWebSpeechFallback(
  text: string,
  title: string,
  subtitle: string,
  voiceName: string,
  options?: VoiceOptions
) {
  state = {
    ...state,
    isLoading: false,
    isPlaying: true,
    currentTitle: title,
    currentSubtitle: `${subtitle} (Web Speech Mode)`,
    currentText: text,
    currentTime: 0,
    duration: Math.max(5, Math.round(text.length / 15)), // Estimated duration
    engine: 'web-speech',
    voiceName
  };
  notifyListeners();
  options?.onStart?.();

  let elapsed = 0;
  if (timeUpdateInterval) clearInterval(timeUpdateInterval);
  timeUpdateInterval = setInterval(() => {
    elapsed += 0.5;
    state.currentTime = elapsed;
    notifyListeners();
  }, 500);

  currentUtterance = speakIndonesianNarration(text, {
    voiceName,
    voiceCharacter: voiceName,
    rate: options?.rate,
    pitch: options?.pitch,
    volume: options?.volume ?? 0.95,
    onStart: () => {
      state.isPlaying = true;
      notifyListeners();
    },
    onEnd: () => {
      stopVoiceNarration();
      options?.onEnd?.();
    },
    onError: (e) => {
      console.warn('Web Speech Error:', e);
      stopVoiceNarration();
      options?.onError?.(e);
    }
  });
}

/**
 * Stop active voice playback immediately
 */
export function stopVoiceNarration() {
  if (timeUpdateInterval) {
    clearInterval(timeUpdateInterval);
    timeUpdateInterval = null;
  }

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }

  stopIndonesianNarration();
  currentUtterance = null;
  currentTrackId = null;

  state = {
    ...state,
    isPlaying: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    engine: 'none'
  };
  notifyListeners();
}

/**
 * Pause / Resume active voice
 */
export function togglePauseVoice() {
  if (currentAudio) {
    if (currentAudio.paused) {
      currentAudio.play();
      state.isPlaying = true;
    } else {
      currentAudio.pause();
      state.isPlaying = false;
    }
    notifyListeners();
  } else if (typeof window !== 'undefined' && window.speechSynthesis) {
    if (window.speechSynthesis.speaking) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        state.isPlaying = true;
      } else {
        window.speechSynthesis.pause();
        state.isPlaying = false;
      }
      notifyListeners();
    }
  }
}

/**
 * Seek to position (seconds) for audio element
 */
export function seekVoice(timeSeconds: number) {
  if (currentAudio && !isNaN(timeSeconds)) {
    currentAudio.currentTime = Math.max(0, Math.min(timeSeconds, currentAudio.duration || timeSeconds));
    state.currentTime = currentAudio.currentTime;
    notifyListeners();
  }
}
