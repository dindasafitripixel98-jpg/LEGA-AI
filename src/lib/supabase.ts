/**
 * Supabase Database & Backend Client for LEGA SHAQILA DIGITAL 99
 * Handles connection, authentication, real-time sync, and PostgreSQL database operations.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CustomerAccount, EmotionLog, JournalEntry, UserProfile, SupabaseConfig, DeveloperConfig } from '../types';
import { getLocalDeveloperConfig } from './developerService';

const SUPABASE_STORAGE_CONFIG_KEY = 'lega_supabase_config_v1';

// Default / fallback Supabase config
export const DEFAULT_SUPABASE_CONFIG: SupabaseConfig = {
  url: (typeof process !== 'undefined' && process.env?.SUPABASE_URL) || (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_SUPABASE_URL) || '',
  anonKey: (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY) || (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY) || '',
  serviceRoleKey: (typeof process !== 'undefined' && process.env?.SUPABASE_SERVICE_ROLE_KEY) || '',
  isEnabled: true,
  autoSync: true,
  tablePrefix: 'lega_'
};

/**
 * SQL Schema Migration Script to create all necessary tables in Supabase SQL Editor
 */
export const SUPABASE_SCHEMA_SQL = `-- ========================================================
-- LEGA SHAQILA DIGITAL 99 - SUPABASE DATABASE SCHEMA
-- Jalankan skrip ini di: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ========================================================

-- 1. Table: User Profiles (Profil Pengguna LEGA)
CREATE TABLE IF NOT EXISTS public.lega_user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    bio TEXT,
    preferred_tone TEXT DEFAULT 'hangat',
    preferred_voice TEXT DEFAULT 'rina',
    primary_emotion_focus TEXT,
    daily_reminder_time TEXT DEFAULT '08:00',
    enable_soundscapes BOOLEAN DEFAULT true,
    streak_days INTEGER DEFAULT 1,
    total_reflections INTEGER DEFAULT 0,
    registered_date TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table: Customer Accounts & Subscriptions (Lisensi & Akun Pelanggan)
CREATE TABLE IF NOT EXISTS public.lega_customer_accounts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT,
    role TEXT DEFAULT 'USER',
    plan TEXT DEFAULT 'TRIAL',
    status TEXT DEFAULT 'ACTIVE',
    license_key TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    max_devices INTEGER DEFAULT 1,
    notes TEXT,
    streak_count INTEGER DEFAULT 0,
    last_login TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table: Emotion Logs (Catatan Pelacak Emosi)
CREATE TABLE IF NOT EXISTS public.lega_emotion_logs (
    id TEXT PRIMARY KEY,
    user_email TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    category TEXT NOT NULL,
    emotion TEXT NOT NULL,
    intensity INTEGER DEFAULT 5,
    triggers JSONB DEFAULT '[]'::jsonb,
    physical_sensations JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    suggested_exercise TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table: Journal Entries (Jurnal Refleksi Diri)
CREATE TABLE IF NOT EXISTS public.lega_journals (
    id TEXT PRIMARY KEY,
    user_email TEXT NOT NULL,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    content TEXT NOT NULL,
    prompt TEXT,
    mood TEXT,
    dominant_emotion TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Table: App Settings & Developer Config (Konfigurasi Global & Landing Page)
CREATE TABLE IF NOT EXISTS public.lega_app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Table: Audio & Session History (Riwayat Sesi Relaksasi Audio)
CREATE TABLE IF NOT EXISTS public.lega_audio_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    track_id TEXT NOT NULL,
    track_title TEXT NOT NULL,
    category TEXT,
    duration_seconds INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for fast queries
CREATE INDEX IF NOT EXISTS idx_lega_emotion_logs_email ON public.lega_emotion_logs(user_email);
CREATE INDEX IF NOT EXISTS idx_lega_journals_email ON public.lega_journals(user_email);
CREATE INDEX IF NOT EXISTS idx_lega_customer_accounts_email ON public.lega_customer_accounts(email);

-- Enable Row Level Security (RLS) - Optional (Bisa diatur sesuai kebutuhan autentikasi)
ALTER TABLE public.lega_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lega_customer_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lega_emotion_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lega_journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lega_app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lega_audio_history ENABLE ROW LEVEL SECURITY;

-- Default Policies (Allow anon reads/writes for connected client API key)
DROP POLICY IF EXISTS "Public access to lega_user_profiles" ON public.lega_user_profiles;
CREATE POLICY "Public access to lega_user_profiles" ON public.lega_user_profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access to lega_customer_accounts" ON public.lega_customer_accounts;
CREATE POLICY "Public access to lega_customer_accounts" ON public.lega_customer_accounts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access to lega_emotion_logs" ON public.lega_emotion_logs;
CREATE POLICY "Public access to lega_emotion_logs" ON public.lega_emotion_logs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access to lega_journals" ON public.lega_journals;
CREATE POLICY "Public access to lega_journals" ON public.lega_journals FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access to lega_app_settings" ON public.lega_app_settings;
CREATE POLICY "Public access to lega_app_settings" ON public.lega_app_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access to lega_audio_history" ON public.lega_audio_history;
CREATE POLICY "Public access to lega_audio_history" ON public.lega_audio_history FOR ALL USING (true) WITH CHECK (true);
`;

/**
 * Get active Supabase configuration
 */
export function getStoredSupabaseConfig(): SupabaseConfig {
  try {
    const devCfg = getLocalDeveloperConfig();
    if (devCfg?.supabase && devCfg.supabase.url && devCfg.supabase.anonKey) {
      return devCfg.supabase;
    }

    const saved = localStorage.getItem(SUPABASE_STORAGE_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_SUPABASE_CONFIG, ...parsed };
    }
  } catch (err) {
    console.warn('Could not read Supabase config from storage:', err);
  }
  return DEFAULT_SUPABASE_CONFIG;
}

/**
 * Save Supabase configuration to local storage
 */
export function saveStoredSupabaseConfig(config: SupabaseConfig): void {
  try {
    localStorage.setItem(SUPABASE_STORAGE_CONFIG_KEY, JSON.stringify(config));
    // Also update developer config
    const devCfg = getLocalDeveloperConfig();
    devCfg.supabase = config;
    localStorage.setItem('lega_dev_custom_config_v1', JSON.stringify(devCfg));
  } catch (err) {
    console.warn('Could not save Supabase config to storage:', err);
  }
}

let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

/**
 * Get or initialize Supabase Client
 */
export function getSupabaseClient(customConfig?: SupabaseConfig): SupabaseClient | null {
  const config = customConfig || getStoredSupabaseConfig();

  if (!config.url || !config.anonKey) {
    return null;
  }

  // Reuse cached client if URL & Key haven't changed
  if (cachedClient && lastUsedUrl === config.url && lastUsedKey === config.anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    lastUsedUrl = config.url;
    lastUsedKey = config.anonKey;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

/**
 * Test connectivity to Supabase backend
 */
export async function testSupabaseConnection(
  config?: SupabaseConfig
): Promise<{ success: boolean; latencyMs: number; message: string; tableCount?: number }> {
  const startTime = Date.now();
  const activeConfig = config || getStoredSupabaseConfig();

  if (!activeConfig.url || !activeConfig.anonKey) {
    return {
      success: false,
      latencyMs: 0,
      message: 'Supabase URL dan Anon Key belum dikonfigurasi. Masukkan kredensial Supabase Anda di panel pengaturan.'
    };
  }

  try {
    const client = getSupabaseClient(activeConfig);
    if (!client) {
      throw new Error('Inisialisasi Supabase client gagal.');
    }

    // Try a simple ping query to user profiles or app settings table
    const { data, error } = await client.from('lega_app_settings').select('key').limit(1);

    const latencyMs = Date.now() - startTime;

    if (error) {
      // If table doesn't exist yet, but connection reached Supabase (404/PGRST204)
      if (error.code === '42P01' || error.message.includes('relation') || error.message.includes('does not exist')) {
        return {
          success: true,
          latencyMs,
          message: `Koneksi Supabase terhubung (${latencyMs}ms), namun tabel belum dibuat. Silakan salin & jalankan Skrip SQL Schema di SQL Editor Supabase.`
        };
      }

      // Invalid API Key / Auth Error
      if (error.code === 'PGRST301' || error.message.includes('JWT') || error.message.includes('apiKey')) {
        return {
          success: false,
          latencyMs,
          message: `Otentikasi Supabase ditolak: ${error.message}. Periksa Anon Public Key.`
        };
      }

      return {
        success: false,
        latencyMs,
        message: `Peringatan dari Supabase: ${error.message} (${error.code || 'Error'})`
      };
    }

    return {
      success: true,
      latencyMs,
      message: `Berhasil terhubung ke Supabase PostgreSQL (${latencyMs}ms)! Database siap digunakan.`
    };
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    return {
      success: false,
      latencyMs,
      message: `Gagal menghubungi server Supabase: ${err?.message || 'Pastikan URL Supabase valid'}`
    };
  }
}

/**
 * Sync User Profile to Supabase
 */
export async function syncUserProfileToSupabase(profile: UserProfile): Promise<boolean> {
  try {
    const client = getSupabaseClient();
    if (!client) return false;

    const row = {
      email: profile.email || 'anon@lega.id',
      name: profile.name,
      avatar: profile.avatar || '',
      bio: profile.bio || '',
      preferred_tone: profile.preferredTone,
      preferred_voice: profile.preferredVoice || 'rina',
      primary_emotion_focus: profile.primaryEmotionFocus || '',
      daily_reminder_time: profile.dailyReminderTime || '08:00',
      enable_soundscapes: profile.enableSoundscapes ?? true,
      streak_days: profile.streakDays || 1,
      total_reflections: profile.totalReflections || 0,
      updated_at: new Date().toISOString()
    };

    const { error } = await client.from('lega_user_profiles').upsert(row, { onConflict: 'email' });
    if (error) {
      console.warn('Supabase sync profile error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase sync user profile exception:', err);
    return false;
  }
}

/**
 * Sync Emotion Log to Supabase
 */
export async function syncEmotionLogToSupabase(log: EmotionLog, userEmail: string): Promise<boolean> {
  try {
    const client = getSupabaseClient();
    if (!client) return false;

    const row = {
      id: log.id,
      user_email: userEmail || 'user@lega.id',
      timestamp: log.timestamp || new Date().toISOString(),
      emotion: log.emotion,
      intensity: log.intensity,
      triggers: log.triggers || [],
      physical_sensations: log.physicalSensations || [],
      notes: log.notes || '',
      suggested_exercise: log.aiAnalysis?.suggestedExercise || '',
      created_at: new Date().toISOString()
    };

    const { error } = await client.from('lega_emotion_logs').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase sync emotion log error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase sync emotion log exception:', err);
    return false;
  }
}

/**
 * Sync Journal Entry to Supabase
 */
export async function syncJournalToSupabase(entry: JournalEntry, userEmail: string): Promise<boolean> {
  try {
    const client = getSupabaseClient();
    if (!client) return false;

    const row = {
      id: entry.id,
      user_email: userEmail || 'user@lega.id',
      title: entry.title,
      date: entry.date,
      content: entry.content,
      mood: entry.mood || '',
      tags: entry.tags || [],
      ai_feedback: entry.aiFeedback ? JSON.stringify(entry.aiFeedback) : null,
      updated_at: new Date().toISOString()
    };

    const { error } = await client.from('lega_journals').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase sync journal error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase sync journal exception:', err);
    return false;
  }
}

/**
 * Sync Customer Accounts to Supabase
 */
export async function syncCustomerAccountsToSupabase(accounts: CustomerAccount[]): Promise<boolean> {
  try {
    const client = getSupabaseClient();
    if (!client || !accounts || accounts.length === 0) return false;

    const rows = accounts.map((acc) => ({
      id: acc.id,
      name: acc.name,
      email: acc.email,
      phone: acc.phone || '',
      password_hash: acc.password || '',
      role: acc.role,
      plan: acc.plan,
      status: acc.status,
      license_key: acc.licenseKey,
      created_at: acc.createdAt,
      expires_at: acc.expiresAt,
      max_devices: acc.maxDevices || 1,
      notes: acc.notes || '',
      streak_count: acc.streakCount || 0,
      last_login: acc.lastLogin || '',
      updated_at: new Date().toISOString()
    }));

    const { error } = await client.from('lega_customer_accounts').upsert(rows, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase sync customer accounts error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase sync customer accounts exception:', err);
    return false;
  }
}

/**
 * Sync Developer Config & Landing Page to Supabase
 */
export async function syncDeveloperConfigToSupabase(config: DeveloperConfig): Promise<boolean> {
  try {
    const client = getSupabaseClient();
    if (!client) return false;

    const payload = {
      key: 'developer_config',
      value: config,
      updated_at: new Date().toISOString()
    };

    const { error } = await client.from('lega_app_settings').upsert(payload, { onConflict: 'key' });
    if (error) {
      console.warn('Supabase sync developer config error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase sync developer config exception:', err);
    return false;
  }
}
