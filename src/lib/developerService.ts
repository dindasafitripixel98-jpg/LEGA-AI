/**
 * Developer Control Panel Service
 * LEGA - AI Self Awareness Platform
 * SHAQILA DIGITAL 99
 */

import { CustomerAccount, DeveloperConfig, ServiceHealthStatus } from '../types';

const DEV_CONFIG_STORAGE_KEY = 'lega_dev_custom_config_v1';
const DEV_USERS_STORAGE_KEY = 'lega_dev_customer_accounts_v1';
const DEV_AUTH_SESSION_KEY = 'lega_dev_authenticated_session';

const DEFAULT_DEV_CONFIG: DeveloperConfig = {
  geminiApiKey: '',
  noizApiKey: 'ZDM2Njk3ZWYtYzdiMS00YzJhLWEwZjUtM2NhMjM1NGM5MDMwJHJpbmFva3Rhdmlhbmkubm92YTk3QGdtYWlsLmNvbQ==',
  openaiApiKey: '',
  isCustomGeminiSet: false,
  isCustomNoizSet: true,
  appTitle: 'LEGA SHAQILA DIGITAL 99',
  appTagline: 'Platform Kesadaran Diri, Manajemen Emosi & Relaksasi AI',
  developerName: 'SHAQILA DIGITAL 99',
  developerEmail: 'dindasafitri.pixel98@gmail.com',
  defaultVoice: 'rina',
  defaultMasterVolume: 0.5,
  enableSpiritualModule: true,
  enableCrisisHotline: true,
  enableDemoMode24h: true,
  customAiCoachPrompt:
    'Anda adalah LEGA AI Coach, sahabat refleksi diri penuh welas asih, hangat, dan ilmiah dalam psikologi kesadaran diri Indonesia.',
};

const INITIAL_CUSTOMERS: CustomerAccount[] = [
  {
    id: 'CUST-001',
    name: 'Dinda Safitri (Owner & Developer)',
    email: 'dindasafitri.pixel98@gmail.com',
    phone: '+62 812-9988-7766',
    role: 'DEVELOPER',
    plan: 'LIFETIME',
    status: 'ACTIVE',
    licenseKey: 'LEGA-DEV-99001-OWNER',
    createdAt: '2026-08-01',
    expiresAt: '2099-12-31',
    maxDevices: 10,
    notes: 'Pemilik & Developer Utama Aplikasi LEGA',
    streakCount: 28,
    lastLogin: 'Hari ini, 04:30 WIB',
  },
  {
    id: 'CUST-002',
    name: 'Rina Sastrawan',
    email: 'rina.sastra@example.com',
    phone: '+62 813-4455-6677',
    role: 'PREMIUM',
    plan: 'YEARLY',
    status: 'ACTIVE',
    licenseKey: 'LEGA-YEAR-88219-X72',
    createdAt: '2026-08-10',
    expiresAt: '2027-08-10',
    maxDevices: 3,
    notes: 'Pelanggan Paket Tahunan - Fokus Manajemen Kecemasan',
    streakCount: 9,
    lastLogin: 'Kemarin, 21:15 WIB',
  },
  {
    id: 'CUST-003',
    name: 'Budi Kurniawan, M.Psi',
    email: 'budi.psych@example.com',
    phone: '+62 811-2233-4455',
    role: 'VIP',
    plan: 'LIFETIME',
    status: 'ACTIVE',
    licenseKey: 'LEGA-LIFE-99102-M00',
    createdAt: '2026-08-05',
    expiresAt: '2099-12-31',
    maxDevices: 5,
    notes: 'Praktisi Konseling & Mitra Relaksasi',
    streakCount: 14,
    lastLogin: '3 jam lalu',
  },
  {
    id: 'CUST-004',
    name: 'Dewi Lestari',
    email: 'dewi.lestari@example.com',
    phone: '+62 856-7788-9900',
    role: 'USER',
    plan: 'MONTHLY',
    status: 'ACTIVE',
    licenseKey: 'LEGA-MTH-33104-A12',
    createdAt: '2026-08-12',
    expiresAt: '2026-09-12',
    maxDevices: 2,
    notes: 'Langganan Bulanan Mandiri',
    streakCount: 4,
    lastLogin: '1 hari lalu',
  },
];

// Helper: Get stored developer config
export function getLocalDeveloperConfig(): DeveloperConfig {
  if (typeof window === 'undefined') return DEFAULT_DEV_CONFIG;
  try {
    const raw = localStorage.getItem(DEV_CONFIG_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_DEV_CONFIG, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to parse local dev config', e);
  }
  return DEFAULT_DEV_CONFIG;
}

// Helper: Save local developer config
export function saveLocalDeveloperConfig(config: DeveloperConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DEV_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save dev config to localStorage', e);
  }
}

// Helper: Get customer list
export function getLocalCustomerAccounts(): CustomerAccount[] {
  if (typeof window === 'undefined') return INITIAL_CUSTOMERS;
  try {
    const raw = localStorage.getItem(DEV_USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse local customer accounts', e);
  }
  return INITIAL_CUSTOMERS;
}

// Helper: Save customer list
export function saveLocalCustomerAccounts(accounts: CustomerAccount[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DEV_USERS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save customer accounts to localStorage', e);
  }
}

/**
 * Fetch developer config from server with local storage fallback
 */
export async function fetchDeveloperConfig(): Promise<DeveloperConfig> {
  const localConfig = getLocalDeveloperConfig();
  try {
    const res = await fetch('/api/developer/config');
    if (res.ok) {
      const serverData = await res.json();
      if (serverData.success && serverData.config) {
        const merged = { ...localConfig, ...serverData.config };
        saveLocalDeveloperConfig(merged);
        return merged;
      }
    }
  } catch (e) {
    // server unreachable or standalone client
  }
  return localConfig;
}

/**
 * Save updated developer config to both server and localStorage
 */
export async function updateDeveloperConfig(config: Partial<DeveloperConfig>): Promise<{ success: boolean; message: string; config: DeveloperConfig }> {
  const current = getLocalDeveloperConfig();
  const updated: DeveloperConfig = {
    ...current,
    ...config,
    isCustomGeminiSet: !!(config.geminiApiKey || current.geminiApiKey),
    isCustomNoizSet: !!(config.noizApiKey || current.noizApiKey),
  };

  saveLocalDeveloperConfig(updated);

  try {
    const res = await fetch('/api/developer/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: updated }),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, message: 'Konfigurasi berhasil disimpan ke Server & Browser!', config: updated };
    }
  } catch (err: any) {
    console.warn('Server sync not available, saved locally', err?.message);
  }

  return { success: true, message: 'Konfigurasi berhasil diperbarui secara lokal di browser!', config: updated };
}

/**
 * Test service connectivity (Gemini or Noiz AI)
 */
export async function testServiceConnection(
  service: 'gemini' | 'noiz',
  customKey?: string
): Promise<{ success: boolean; latencyMs: number; message: string; details?: any }> {
  const startTime = Date.now();
  try {
    const res = await fetch('/api/developer/test-connection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service, apiKey: customKey }),
    });

    const latencyMs = Date.now() - startTime;
    if (res.ok) {
      const data = await res.json();
      return {
        success: data.success,
        latencyMs: data.latencyMs || latencyMs,
        message: data.message || (data.success ? 'Koneksi Berhasil!' : 'Koneksi Gagal'),
        details: data.details,
      };
    } else {
      return {
        success: false,
        latencyMs,
        message: `HTTP Error ${res.status}: Server tidak dapat memverifikasi koneksi.`,
      };
    }
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    return {
      success: false,
      latencyMs,
      message: `Gagal tersambung: ${err?.message || 'Periksa jaringan internet'}`,
    };
  }
}

/**
 * Fetch customer accounts
 */
export async function fetchCustomerAccounts(): Promise<CustomerAccount[]> {
  const localAccounts = getLocalCustomerAccounts();
  try {
    const res = await fetch('/api/developer/users');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        saveLocalCustomerAccounts(data.users);
        return data.users;
      }
    }
  } catch (err) {
    // fallback
  }
  return localAccounts;
}

/**
 * Create a new customer/user account
 */
export async function createCustomerAccount(accountData: Omit<CustomerAccount, 'id' | 'createdAt' | 'streakCount'>): Promise<{ success: boolean; account: CustomerAccount }> {
  const accounts = getLocalCustomerAccounts();
  const newAccount: CustomerAccount = {
    ...accountData,
    id: `CUST-${Date.now().toString().slice(-5)}`,
    createdAt: new Date().toISOString().split('T')[0],
    streakCount: 0,
    lastLogin: 'Belum pernah login',
  };

  const updatedAccounts = [newAccount, ...accounts];
  saveLocalCustomerAccounts(updatedAccounts);

  try {
    await fetch('/api/developer/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: newAccount }),
    });
  } catch (e) {
    // saved locally
  }

  return { success: true, account: newAccount };
}

/**
 * Update an existing customer account
 */
export async function updateCustomerAccount(id: string, updates: Partial<CustomerAccount>): Promise<{ success: boolean }> {
  const accounts = getLocalCustomerAccounts();
  const updated = accounts.map((acc) => (acc.id === id ? { ...acc, ...updates } : acc));
  saveLocalCustomerAccounts(updated);

  try {
    await fetch(`/api/developer/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates }),
    });
  } catch (e) {
    // saved locally
  }

  return { success: true };
}

/**
 * Delete a customer account
 */
export async function deleteCustomerAccount(id: string): Promise<{ success: boolean }> {
  const accounts = getLocalCustomerAccounts();
  const filtered = accounts.filter((acc) => acc.id !== id);
  saveLocalCustomerAccounts(filtered);

  try {
    await fetch(`/api/developer/users/${id}`, {
      method: 'DELETE',
    });
  } catch (e) {
    // saved locally
  }

  return { success: true };
}

/**
 * Generate a randomized secure license key
 */
export function generateLicenseKey(plan: string): string {
  const prefix = plan.toUpperCase().slice(0, 4);
  const part1 = Math.floor(10000 + Math.random() * 90000);
  const part2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LEGA-${prefix}-${part1}-${part2}`;
}

/**
 * Check if developer passcode or email is authorized
 */
export function verifyDeveloperAuth(passcode: string): boolean {
  // Accepted master passwords for developer access
  const validPasscodes = ['shaqila99', 'lega2026', 'dinda99', 'developer99', 'admin'];
  const isValid = validPasscodes.includes(passcode.trim().toLowerCase());
  if (isValid && typeof window !== 'undefined') {
    sessionStorage.setItem(DEV_AUTH_SESSION_KEY, 'true');
  }
  return isValid;
}

export function isDeveloperSessionUnlocked(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(DEV_AUTH_SESSION_KEY) === 'true';
}

export function lockDeveloperSession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(DEV_AUTH_SESSION_KEY);
}
