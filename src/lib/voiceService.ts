// LEGA Universal Voice Engine - Seamless Gemini TTS & Offline Speech Synthesis
// SHAQILA DIGITAL 99 - LEGA AI Voice System

import { generateGeminiTts } from './geminiApi';
import { pcmToWavBlobUrl, speakIndonesianNarration, stopIndonesianNarration } from './audioEngine';

export interface VoiceOptions {
  title?: string;
  subtitle?: string;
  voiceName?: 'Kore' | 'Aoede' | 'Puck' | 'Fenrir' | 'Leda' | 'Charon';
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
  engine: 'gemini-tts' | 'web-speech' | 'none';
  voiceName: string;
}

// In-memory audio cache to prevent redundant TTS API calls
const audioCache = new Map<string, string>();

type VoiceListener = (state: VoiceState) => void;
const listeners = new Set<VoiceListener>();

let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let currentTrackId: string | null = null;
let timeUpdateInterval: any = null;

let state: VoiceState = {
  isPlaying: false,
  isLoading: false,
  currentTitle: '',
  currentSubtitle: '',
  currentText: '',
  currentTime: 0,
  duration: 0,
  engine: 'none',
  voiceName: typeof localStorage !== 'undefined' ? localStorage.getItem('lega_voice_name') || 'Kore' : 'Kore'
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

export function getStoredVoiceName(): string {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('lega_voice_name') || 'Kore';
  }
  return 'Kore';
}

export function setStoredVoiceName(name: string) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('lega_voice_name', name);
  }
  state.voiceName = name;
  notifyListeners();
}

/**
 * Play voice narration for any text.
 * Automatically tries Gemini 3.1 Flash Neural TTS first, then gracefully falls back to Indonesian Web Speech Synthesis.
 */
export async function playVoiceNarration(
  text: string,
  options?: VoiceOptions
): Promise<void> {
  if (!text || text.trim().length === 0) return;

  const title = options?.title || 'Panduan Suara LEGA AI';
  const subtitle = options?.subtitle || 'Mendengarkan bimbingan hening...';
  const voiceName = (options?.voiceName || getStoredVoiceName()) as any;
  const trackId = `${voiceName}:${text.trim()}`;

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
    engine: 'none',
    voiceName
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
    playAudioUrl(cachedUrl, title, subtitle, cleanText, voiceName, options);
    return;
  }

  // Try Gemini Neural TTS via server
  try {
    const audioData = await generateGeminiTts(cleanText, voiceName);
    if (audioData && currentTrackId === trackId) {
      let finalAudioUrl = audioData;
      if (!audioData.startsWith('data:') && !audioData.startsWith('blob:') && !audioData.startsWith('http')) {
        finalAudioUrl = pcmToWavBlobUrl(audioData, 24000);
      }
      if (finalAudioUrl) {
        audioCache.set(trackId, finalAudioUrl);
        playAudioUrl(finalAudioUrl, title, subtitle, cleanText, voiceName, options);
        return;
      }
    }
  } catch (err) {
    console.warn('Gemini TTS network call failed, falling back to Web Speech API:', err);
  }

  // Fallback to Web Speech API (Indonesian synthesized narration)
  if (currentTrackId === trackId) {
    playWebSpeechFallback(cleanText, title, subtitle, voiceName, options);
  }
}

function playAudioUrl(
  url: string,
  title: string,
  subtitle: string,
  text: string,
  voiceName: string,
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
        engine: 'gemini-tts',
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
    rate: options?.rate ?? 0.88,
    pitch: options?.pitch ?? 0.95,
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
