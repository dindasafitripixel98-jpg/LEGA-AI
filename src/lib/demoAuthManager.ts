/**
 * LEGA - 24-Hour Demo Account Authentication & Session Manager
 * Platform Kesadaran Diri & Emosi AI Indonesia
 * SHAQILA DIGITAL 99
 */

import { useState, useEffect, useCallback } from 'react';

export interface DemoAccountSession {
  isDemo: boolean;
  accountName: string;
  accountEmail: string;
  sessionToken: string;
  createdAt: number; // Unix timestamp in ms
  expiresAt: number; // Unix timestamp in ms (createdAt + 24 * 60 * 60 * 1000)
  durationHours: number; // 24 hours
  plan: 'DEMO_24H';
  featuresUnlocked: string[];
}

export interface DemoTimeRemaining {
  totalMs: number;
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string; // e.g. "23:45:12"
  shortFormatted: string; // e.g. "23j 45m"
  isExpired: boolean;
  percentElapsed: number; // 0 to 100%
  percentRemaining: number; // 100% to 0%
}

const STORAGE_KEY = 'lega_24h_demo_session';
const DEMO_DURATION_MS = 24 * 60 * 60 * 1000; // 24 Hours in milliseconds

export const DEFAULT_DEMO_CREDENTIALS = {
  email: 'demo@lega.id',
  username: 'demo',
  accessCode: 'LEGA24H',
  name: 'Pengguna Demo 24 Jam',
};

export const UNLOCKED_DEMO_FEATURES = [
  'AI Coach LEGA (Refleksi Percakapan Dialogis 10 Tahap)',
  'Audio Relaksasi Universal (LEGA CALM NATURE)',
  'Analisis Emosi & Pola Somatis Tubuh Berbasis AI',
  '14 Modul Regulasi Emosi Lengkap (Cemas, Marah, Sedih, Rasa Malu, dll.)',
  'LEGA Spiritual Reflection & Muhasabah',
  'Jurnal Refleksi & Feedback AI Otomatis',
  'Pemindai Tubuh Somatis & Latihan Pernapasan',
  'Akses PWA Mode Offline & Sinkronisasi Lokal'
];

/**
 * Retrieve saved demo session from localStorage
 */
export function getStoredDemoSession(): DemoAccountSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session: DemoAccountSession = JSON.parse(raw);
    if (!session || !session.expiresAt) return null;
    return session;
  } catch (e) {
    console.error('[DemoAuth] Failed to parse demo session', e);
    return null;
  }
}

/**
 * Save demo session to localStorage
 */
export function saveDemoSession(session: DemoAccountSession | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!session) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
  } catch (e) {
    console.error('[DemoAuth] Failed to save demo session', e);
  }
}

/**
 * Start or reset a 24-Hour Demo Account
 */
export function create24HDemoSession(
  name: string = DEFAULT_DEMO_CREDENTIALS.name,
  email: string = DEFAULT_DEMO_CREDENTIALS.email
): DemoAccountSession {
  const now = Date.now();
  const session: DemoAccountSession = {
    isDemo: true,
    accountName: name || DEFAULT_DEMO_CREDENTIALS.name,
    accountEmail: email || DEFAULT_DEMO_CREDENTIALS.email,
    sessionToken: `DEMO24-${now.toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    createdAt: now,
    expiresAt: now + DEMO_DURATION_MS,
    durationHours: 24,
    plan: 'DEMO_24H',
    featuresUnlocked: UNLOCKED_DEMO_FEATURES,
  };
  saveDemoSession(session);
  return session;
}

/**
 * Validate credentials for demo login
 */
export function validateDemoLogin(identifier: string, passOrCode: string): { success: boolean; message: string; session?: DemoAccountSession } {
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPass = (passOrCode || '').trim().toUpperCase();

  const isIdentifierValid =
    cleanId === 'demo@lega.id' ||
    cleanId === 'demo' ||
    cleanId === 'demo24' ||
    cleanId === 'demo.24h@lega.id' ||
    cleanId.startsWith('demo-') ||
    cleanId.includes('demo');

  const isPassValid =
    cleanPass === 'LEGA24H' ||
    cleanPass === 'DEMO' ||
    cleanPass === 'DEMO123' ||
    cleanPass === 'LEGA2026' ||
    cleanPass === 'LEGA-DEMO-24' ||
    cleanPass.startsWith('DEMO24-');

  if (isIdentifierValid && (isPassValid || cleanPass === '')) {
    const session = create24HDemoSession(
      cleanId.includes('@') ? cleanId.split('@')[0] : 'Pengguna Demo 24 Jam',
      cleanId.includes('@') ? cleanId : DEFAULT_DEMO_CREDENTIALS.email
    );
    return {
      success: true,
      message: 'Berhasil masuk ke Akun Demo 24 Jam LEGA.',
      session,
    };
  }

  // Allow fast 1-click login if identifier is "DEMO"
  if (cleanId === 'demo' || cleanPass === 'LEGA24H') {
    const session = create24HDemoSession();
    return {
      success: true,
      message: 'Berhasil mengaktifkan Akun Demo 24 Jam.',
      session,
    };
  }

  return {
    success: false,
    message: 'Kredensial demo tidak valid. Gunakan email: demo@lega.id dan kode: LEGA24H atau klik Masuk Cepat Demo.',
  };
}

/**
 * Calculate remaining time for a given demo session
 */
export function calculateDemoTimeRemaining(session: DemoAccountSession | null): DemoTimeRemaining {
  if (!session || !session.expiresAt) {
    return {
      totalMs: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formatted: '00:00:00',
      shortFormatted: '0j 0m',
      isExpired: true,
      percentElapsed: 100,
      percentRemaining: 0,
    };
  }

  const now = Date.now();
  const totalMs = Math.max(0, session.expiresAt - now);
  const isExpired = totalMs <= 0;

  const hours = Math.floor(totalMs / (1000 * 60 * 60));
  const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  const shortFormatted = `${hours}j ${minutes}m ${seconds}d`;

  const totalDuration = DEMO_DURATION_MS;
  const elapsed = Math.min(totalDuration, Math.max(0, now - session.createdAt));
  const percentElapsed = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  const percentRemaining = Math.max(0, 100 - percentElapsed);

  return {
    totalMs,
    hours,
    minutes,
    seconds,
    formatted,
    shortFormatted,
    isExpired,
    percentElapsed,
    percentRemaining,
  };
}

/**
 * React Hook to manage 24-Hour Demo Account state & countdown
 */
export function useDemoAuth() {
  const [session, setSession] = useState<DemoAccountSession | null>(getStoredDemoSession);
  const [timeRemaining, setTimeRemaining] = useState<DemoTimeRemaining>(() => calculateDemoTimeRemaining(session));

  // Auto-tick countdown every 1 second
  useEffect(() => {
    const updateCountdown = () => {
      const currentSession = getStoredDemoSession();
      setSession(currentSession);
      const remaining = calculateDemoTimeRemaining(currentSession);
      setTimeRemaining(remaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const loginDemo = useCallback((identifier: string = 'demo@lega.id', accessCode: string = 'LEGA24H') => {
    const res = validateDemoLogin(identifier, accessCode);
    if (res.success && res.session) {
      setSession(res.session);
      setTimeRemaining(calculateDemoTimeRemaining(res.session));
    }
    return res;
  }, []);

  const quickStartDemo = useCallback((name?: string, email?: string) => {
    const newSession = create24HDemoSession(name, email);
    setSession(newSession);
    setTimeRemaining(calculateDemoTimeRemaining(newSession));
    return newSession;
  }, []);

  const resetDemoSession = useCallback(() => {
    const newSession = create24HDemoSession(session?.accountName, session?.accountEmail);
    setSession(newSession);
    setTimeRemaining(calculateDemoTimeRemaining(newSession));
    return newSession;
  }, [session]);

  const logoutDemo = useCallback(() => {
    saveDemoSession(null);
    setSession(null);
    setTimeRemaining(calculateDemoTimeRemaining(null));
  }, []);

  // For testing: force-expire the session immediately
  const simulateExpiration = useCallback(() => {
    if (!session) return;
    const expiredSession: DemoAccountSession = {
      ...session,
      createdAt: Date.now() - DEMO_DURATION_MS - 1000,
      expiresAt: Date.now() - 1000,
    };
    saveDemoSession(expiredSession);
    setSession(expiredSession);
    setTimeRemaining(calculateDemoTimeRemaining(expiredSession));
  }, [session]);

  return {
    isDemoActive: !!session && !timeRemaining.isExpired,
    isDemoSession: !!session,
    isExpired: !!session && timeRemaining.isExpired,
    session,
    timeRemaining,
    loginDemo,
    quickStartDemo,
    resetDemoSession,
    logoutDemo,
    simulateExpiration,
  };
}
