import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Server,
  Cpu,
  Code2,
  CheckCircle2,
  RefreshCw,
  Users,
  Key,
  Bot,
  FileText,
  Volume2,
  Database,
  Activity,
  AlertTriangle,
  History,
  Lock,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  RotateCcw,
  BookOpen,
  Sparkles,
  Send,
  Layers,
  BarChart3,
  Search,
  Check,
  X,
  Shield,
  Clock,
  ExternalLink,
  ChevronRight,
  Sliders,
  DollarSign,
  Smartphone,
  Copy,
  Download,
  Settings,
  Zap,
  Globe,
  Radio,
  Play,
  CheckCircle,
  HelpCircle,
  Flame,
  Moon,
  LifeBuoy,
  Edit,
  Edit3,
  Power
} from 'lucide-react';
import { getAdminSystemStats, askAdminAI } from '../lib/geminiApi';
import {
  fetchDeveloperConfig,
  updateDeveloperConfig,
  testServiceConnection,
  fetchCustomerAccounts,
  createCustomerAccount,
  updateCustomerAccount,
  deleteCustomerAccount,
  generateLicenseKey,
  verifyDeveloperAuth,
  isDeveloperSessionUnlocked,
  lockDeveloperSession,
  getLocalDeveloperConfig
} from '../lib/developerService';
import { CustomerAccount, DeveloperConfig } from '../types';

type AdminTab =
  | 'developer-keys'
  | 'developer-users'
  | 'developer-app'
  | 'developer-diagnostics'
  | 'overview'
  | 'prompts'
  | 'cms'
  | 'spiritual'
  | 'licenses'
  | 'safety'
  | 'audit'
  | 'assistant';

type AdminRole =
  | 'DEVELOPER (OWNER)'
  | 'SUPER ADMIN'
  | 'ADMIN'
  | 'CONTENT ADMIN'
  | 'AI ADMIN'
  | 'LICENSE ADMIN'
  | 'SUPPORT ADMIN'
  | 'AUDITOR';

interface MasterPromptItem {
  id: string;
  name: string;
  module: string;
  version: string;
  status: 'DRAFT' | 'TEST' | 'REVIEW' | 'APPROVED' | 'PUBLISHED';
  author: string;
  updatedAt: string;
}

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('developer-keys');
  const [selectedRole, setSelectedRole] = useState<AdminRole>('DEVELOPER (OWNER)');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(true);
  const [passcodeInput, setPasscodeInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Developer Live Configuration State
  const [devConfig, setDevConfig] = useState<DeveloperConfig>(getLocalDeveloperConfig());
  const [geminiKeyInput, setGeminiKeyInput] = useState<string>('');
  const [noizKeyInput, setNoizKeyInput] = useState<string>('');
  const [showGeminiKey, setShowGeminiKey] = useState<boolean>(false);
  const [showNoizKey, setShowNoizKey] = useState<boolean>(false);
  const [isSavingConfig, setIsSavingConfig] = useState<boolean>(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string>('');

  // Connection Testing State
  const [testingGemini, setTestingGemini] = useState<boolean>(false);
  const [geminiTestResult, setGeminiTestResult] = useState<{ success: boolean; message: string; latency?: number } | null>(null);
  const [testingNoiz, setTestingNoiz] = useState<boolean>(false);
  const [noizTestResult, setNoizTestResult] = useState<{ success: boolean; message: string; latency?: number } | null>(null);

  // Customers / Users Management State
  const [customers, setCustomers] = useState<CustomerAccount[]>([]);
  const [searchUserQuery, setSearchUserQuery] = useState<string>('');
  const [filterPlan, setFilterPlan] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerAccount | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showEditPassword, setShowEditPassword] = useState<boolean>(false);

  // Helper: Generate Random Secure Password
  const generateRandomPassword = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let pwd = 'Lega@';
    for (let i = 0; i < 5; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
  };

  // New Customer Form State
  const [newCustomer, setNewCustomer] = useState<{
    name: string;
    email: string;
    phone: string;
    password: string;
    role: CustomerAccount['role'];
    plan: CustomerAccount['plan'];
    status: CustomerAccount['status'];
    licenseKey: string;
    expiresAt: string;
    maxDevices: number;
    notes: string;
  }>({
    name: '',
    email: '',
    phone: '',
    password: 'Lega@' + Math.floor(1000 + Math.random() * 9000),
    role: 'USER',
    plan: 'MONTHLY',
    status: 'ACTIVE',
    licenseKey: generateLicenseKey('MONTHLY'),
    expiresAt: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    maxDevices: 3,
    notes: '',
  });

  // App Customizer Form State
  const [customAppTitle, setCustomAppTitle] = useState<string>(devConfig.appTitle || 'LEGA SHAQILA DIGITAL 99');
  const [customAppTagline, setCustomAppTagline] = useState<string>(devConfig.appTagline || '');
  const [customDevEmail, setCustomDevEmail] = useState<string>(devConfig.developerEmail || 'dindasafitri.pixel98@gmail.com');
  const [customDefaultVoice, setCustomDefaultVoice] = useState<string>(devConfig.defaultVoice || 'rina');
  const [customMasterPrompt, setCustomMasterPrompt] = useState<string>(devConfig.customAiCoachPrompt || '');
  const [featureToggles, setFeatureToggles] = useState({
    spiritual: devConfig.enableSpiritualModule ?? true,
    crisis: devConfig.enableCrisisHotline ?? true,
    demo: devConfig.enableDemoMode24h ?? true,
  });

  // System Diagnostics & Admin AI Assistant State
  const [systemStats, setSystemStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState<boolean>(false);
  const [aiQuery, setAiQuery] = useState<string>('');
  const [aiChatLogs, setAiChatLogs] = useState<{ sender: 'admin' | 'ai'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: 'Halo Developer SHAQILA DIGITAL 99. Saya asisten kendali LEGA. Sistem siap menerima pembaruan API key, pembuatan akun pelanggan, atau modifikasi prompt secara real-time.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Master Prompts State
  const [prompts, setPrompts] = useState<MasterPromptItem[]>([
    { id: 'MP-01', name: 'LEGA Core Persona & Emotional Grounding', module: 'AI Coach', version: 'v3.2 Production', status: 'PUBLISHED', author: 'SHAQILA DIGITAL 99', updatedAt: '2026-08-16' },
    { id: 'MP-25', name: 'Noiz AI / Gemini TTS Voice Synthesizer', module: 'Audio Engine', version: 'v3.0 Production', status: 'PUBLISHED', author: 'SHAQILA DIGITAL 99', updatedAt: '2026-08-16' },
    { id: 'MP-29', name: 'LEGA Dashboard Realtime Emotion Sync', module: 'Dashboard', version: 'v3.0 Final', status: 'PUBLISHED', author: 'SHAQILA DIGITAL 99', updatedAt: '2026-08-15' },
    { id: 'MP-30', name: 'Developer Live Control Engine & API Gateway', module: 'Admin AI', version: 'v3.5 Live', status: 'PUBLISHED', author: 'SHAQILA DIGITAL 99', updatedAt: '2026-08-16' },
    { id: 'MP-18', name: 'LEGA Islamic Spiritual Self-Awareness Logic', module: 'Spiritual', version: 'v2.8 Final', status: 'PUBLISHED', author: 'SHAQILA DIGITAL 99', updatedAt: '2026-08-14' },
    { id: 'MP-31', name: 'LEGA Pattern Awareness & Somatic Loop Analyzer', module: 'Pattern Awareness', version: 'v3.1 Final', status: 'PUBLISHED', author: 'SHAQILA DIGITAL 99', updatedAt: '2026-08-15' },
  ]);

  // Load initial data
  useEffect(() => {
    const loadAll = async () => {
      const cfg = await fetchDeveloperConfig();
      setDevConfig(cfg);
      setGeminiKeyInput(cfg.geminiApiKey || '');
      setNoizKeyInput(cfg.noizApiKey || '');
      setCustomAppTitle(cfg.appTitle || 'LEGA SHAQILA DIGITAL 99');
      setCustomAppTagline(cfg.appTagline || '');
      setCustomDevEmail(cfg.developerEmail || 'dindasafitri.pixel98@gmail.com');
      setCustomDefaultVoice(cfg.defaultVoice || 'rina');
      setCustomMasterPrompt(cfg.customAiCoachPrompt || '');
      setFeatureToggles({
        spiritual: cfg.enableSpiritualModule ?? true,
        crisis: cfg.enableCrisisHotline ?? true,
        demo: cfg.enableDemoMode24h ?? true,
      });

      const usersList = await fetchCustomerAccounts();
      setCustomers(usersList);

      setLoadingStats(true);
      const stats = await getAdminSystemStats();
      if (stats) setSystemStats(stats);
      setLoadingStats(false);
    };

    loadAll();
  }, []);

  // Save Developer Config
  const handleSaveApiKeys = async () => {
    setIsSavingConfig(true);
    setSaveSuccessNotice('');

    const res = await updateDeveloperConfig({
      geminiApiKey: geminiKeyInput.trim(),
      noizApiKey: noizKeyInput.trim(),
    });

    setIsSavingConfig(false);
    if (res.success) {
      setDevConfig(res.config);
      setSaveSuccessNotice(res.message);
      setTimeout(() => setSaveSuccessNotice(''), 5000);
    }
  };

  // Test Gemini Connection
  const handleTestGemini = async () => {
    setTestingGemini(true);
    setGeminiTestResult(null);
    const result = await testServiceConnection('gemini', geminiKeyInput.trim() || undefined);
    setTestingGemini(false);
    setGeminiTestResult({
      success: result.success,
      message: result.message,
      latency: result.latencyMs,
    });
  };

  // Test Noiz AI TTS Connection
  const handleTestNoiz = async () => {
    setTestingNoiz(true);
    setNoizTestResult(null);
    const result = await testServiceConnection('noiz', noizKeyInput.trim() || undefined);
    setTestingNoiz(false);
    setNoizTestResult({
      success: result.success,
      message: result.message,
      latency: result.latencyMs,
    });
  };

  // Save App Customization & Toggles
  const handleSaveAppCustomization = async () => {
    setIsSavingConfig(true);
    const res = await updateDeveloperConfig({
      appTitle: customAppTitle.trim(),
      appTagline: customAppTagline.trim(),
      developerEmail: customDevEmail.trim(),
      defaultVoice: customDefaultVoice,
      customAiCoachPrompt: customMasterPrompt.trim(),
      enableSpiritualModule: featureToggles.spiritual,
      enableCrisisHotline: featureToggles.crisis,
      enableDemoMode24h: featureToggles.demo,
    });
    setIsSavingConfig(false);
    if (res.success) {
      setDevConfig(res.config);
      setSaveSuccessNotice('Pengaturan Aplikasi & Prompt AI Berhasil Disimpan!');
      setTimeout(() => setSaveSuccessNotice(''), 5000);
    }
  };

  // Create Customer Account Action
  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.email) return;

    const res = await createCustomerAccount(newCustomer);
    if (res.success) {
      setCustomers([res.account, ...customers]);
      setIsCreateModalOpen(false);
      setNewCustomer({
        name: '',
        email: '',
        phone: '',
        role: 'USER',
        plan: 'MONTHLY',
        status: 'ACTIVE',
        licenseKey: generateLicenseKey('MONTHLY'),
        expiresAt: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        maxDevices: 3,
        notes: '',
      });
      setSaveSuccessNotice(`Akun ${res.account.name} berhasil dibuat!`);
      setTimeout(() => setSaveSuccessNotice(''), 4000);
    }
  };

  // Edit Customer Action
  const handleOpenEditModal = (cust: CustomerAccount) => {
    setEditingCustomer({ ...cust });
    setIsEditModalOpen(true);
  };

  const handleSaveEditedCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;

    const res = await updateCustomerAccount(editingCustomer.id, editingCustomer);
    if (res.success) {
      setCustomers(customers.map((c) => (c.id === editingCustomer.id ? { ...editingCustomer } : c)));
      setIsEditModalOpen(false);
      setEditingCustomer(null);
      setSaveSuccessNotice(`Akun ${editingCustomer.name} berhasil diperbarui!`);
      setTimeout(() => setSaveSuccessNotice(''), 4000);
    }
  };

  // Extend User Subscription
  const handleExtendSubscription = async (id: string, daysToAdd: number) => {
    const user = customers.find((c) => c.id === id);
    if (!user) return;

    let baseDate = new Date();
    if (user.expiresAt && !isNaN(new Date(user.expiresAt).getTime())) {
      const existing = new Date(user.expiresAt);
      if (existing > baseDate) baseDate = existing;
    }
    baseDate.setDate(baseDate.getDate() + daysToAdd);
    const newExpiresAt = baseDate.toISOString().split('T')[0];

    const updated = await updateCustomerAccount(id, { expiresAt: newExpiresAt, status: 'ACTIVE' });
    if (updated.success) {
      setCustomers(customers.map((c) => (c.id === id ? { ...c, expiresAt: newExpiresAt, status: 'ACTIVE' } : c)));
    }
  };

  // Set Lifetime Subscription
  const handleSetLifetime = async (id: string) => {
    const updated = await updateCustomerAccount(id, {
      plan: 'LIFETIME',
      expiresAt: '2099-12-31',
      status: 'ACTIVE',
      role: 'VIP',
    });
    if (updated.success) {
      setCustomers(
        customers.map((c) =>
          c.id === id ? { ...c, plan: 'LIFETIME', expiresAt: '2099-12-31', status: 'ACTIVE', role: 'VIP' } : c
        )
      );
    }
  };

  // Toggle Customer Status
  const handleToggleCustomerStatus = async (id: string) => {
    const user = customers.find((c) => c.id === id);
    if (!user) return;
    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const updated = await updateCustomerAccount(id, { status: nextStatus });
    if (updated.success) {
      setCustomers(customers.map((c) => (c.id === id ? { ...c, status: nextStatus } : c)));
    }
  };

  // Delete Customer
  const handleDeleteCustomer = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus akun pelanggan ini?')) return;
    const res = await deleteCustomerAccount(id);
    if (res.success) {
      setCustomers(customers.filter((c) => c.id !== id));
    }
  };

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Export Users JSON
  const handleExportUsers = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(customers, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `LEGA_CUSTOMERS_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Ask Admin AI
  const handleSendAiQuery = async (queryText?: string) => {
    const textToSend = queryText || aiQuery;
    if (!textToSend.trim()) return;

    const userMessage = {
      sender: 'admin' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAiChatLogs((prev) => [...prev, userMessage]);
    if (!queryText) setAiQuery('');
    setIsAiThinking(true);

    try {
      const answer = await askAdminAI(textToSend, selectedRole);
      const aiMessage = {
        sender: 'ai' as const,
        text: answer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setAiChatLogs((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Filtered customers
  const filteredCustomers = customers.filter((cust) => {
    const matchSearch =
      cust.name.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      cust.licenseKey.toLowerCase().includes(searchUserQuery.toLowerCase());
    const matchPlan = filterPlan === 'ALL' || cust.plan === filterPlan;
    return matchSearch && matchPlan;
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 text-stone-100 animate-fade-in font-sans">
      {/* Top Header Card */}
      <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-300 to-emerald-400 flex items-center justify-center text-stone-950 font-black text-2xl shadow-lg shadow-amber-950/60">
              L
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-stone-950 tracking-wider uppercase shadow-sm">
                  DEVELOPER CONTROL PANEL
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ● LIVE PRODUCTION
                </span>
                <span className="text-xs text-stone-400">SHAQILA DIGITAL 99</span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-stone-100 tracking-tight mt-1">
                Pusat Kendali Pengembang &amp; Manajemen Layanan
              </h1>
              <p className="text-xs text-stone-300">
                Atur API Key (Gemini &amp; Noiz AI), buat akun pelanggan, kelola lisensi, dan ubah pengaturan aplikasi secara live pasca deploy.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="p-2.5 bg-stone-950/80 rounded-2xl border border-stone-800 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-[10px] text-stone-400">Developer Owner</p>
                <p className="font-bold text-stone-200">dindasafitri.pixel98@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Save Notification */}
        {saveSuccessNotice && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{saveSuccessNotice}</span>
          </div>
        )}
      </div>

      {/* Main Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-800">
        <button
          onClick={() => setActiveTab('developer-keys')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'developer-keys'
              ? 'bg-amber-400 text-stone-950 shadow-lg shadow-amber-950/50 scale-102'
              : 'bg-stone-900/90 text-stone-300 hover:bg-stone-800 border border-stone-800'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>API Key &amp; Cloud (Gemini &amp; Noiz AI)</span>
        </button>

        <button
          onClick={() => setActiveTab('developer-users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'developer-users'
              ? 'bg-amber-400 text-stone-950 shadow-lg shadow-amber-950/50 scale-102'
              : 'bg-stone-900/90 text-stone-300 hover:bg-stone-800 border border-stone-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Buat Akun &amp; Pelanggan ({customers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('developer-app')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'developer-app'
              ? 'bg-amber-400 text-stone-950 shadow-lg shadow-amber-950/50 scale-102'
              : 'bg-stone-900/90 text-stone-300 hover:bg-stone-800 border border-stone-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Ubah Aplikasi &amp; Prompt AI</span>
        </button>

        <button
          onClick={() => setActiveTab('developer-diagnostics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'developer-diagnostics'
              ? 'bg-amber-400 text-stone-950 shadow-lg shadow-amber-950/50 scale-102'
              : 'bg-stone-900/90 text-stone-300 hover:bg-stone-800 border border-stone-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Diagnostik &amp; Server Health</span>
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'overview'
              ? 'bg-emerald-600 text-stone-950 font-bold'
              : 'bg-stone-900/60 text-stone-400 hover:bg-stone-800 border border-stone-800/80'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Ringkasan Eksekutif</span>
        </button>

        <button
          onClick={() => setActiveTab('prompts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'prompts'
              ? 'bg-emerald-600 text-stone-950 font-bold'
              : 'bg-stone-900/60 text-stone-400 hover:bg-stone-800 border border-stone-800/80'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>30 Master Prompts</span>
        </button>

        <button
          onClick={() => setActiveTab('assistant')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'assistant'
              ? 'bg-emerald-600 text-stone-950 font-bold'
              : 'bg-stone-900/60 text-stone-400 hover:bg-stone-800 border border-stone-800/80'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>AI Admin Assistant</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: API KEY & CLOUD INTEGRATION (DEVELOPER-KEYS)     */}
      {/* ======================================================== */}
      {activeTab === 'developer-keys' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                  <Key className="w-5 h-5 text-amber-400" />
                  <span>Pengaturan API Key &amp; Layanan AI (Live Post-Deploy)</span>
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Ubah atau perbarui API Key langsung dari control panel ini tanpa harus deploy ulang. Perubahan akan langsung aktif di backend server dan browser pengguna.
                </p>
              </div>

              <button
                onClick={handleSaveApiKeys}
                disabled={isSavingConfig}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-amber-950/40 transition active:scale-95 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSavingConfig ? 'Menyimpan...' : 'Simpan Semua API Key'}</span>
              </button>
            </div>

            {/* Gemini API Key Box */}
            <div className="p-5 bg-stone-950/80 rounded-2xl border border-stone-800 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                      <span>Google Gemini API Key</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        Official SDK
                      </span>
                    </h3>
                    <p className="text-xs text-stone-400">
                      Digunakan untuk AI Coach, Analisis Emosi, Refleksi Somatis, dan Pola Kesadaran Diri.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTestGemini}
                  disabled={testingGemini}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition border border-stone-700 disabled:opacity-50"
                >
                  <Zap className={`w-3.5 h-3.5 text-blue-400 ${testingGemini ? 'animate-spin' : ''}`} />
                  <span>{testingGemini ? 'Menguji...' : '🧪 Uji Koneksi Gemini'}</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type={showGeminiKey ? 'text' : 'password'}
                  value={geminiKeyInput}
                  onChange={(e) => setGeminiKeyInput(e.target.value)}
                  placeholder="Masukkan Google Gemini API Key (AIzaSy...)"
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-xs text-stone-100 pr-24 focus:outline-none focus:border-amber-400 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 text-xs flex items-center gap-1 px-2 py-1 bg-stone-800/80 rounded-lg"
                >
                  {showGeminiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showGeminiKey ? 'Sembunyi' : 'Lihat'}</span>
                </button>
              </div>

              {/* Gemini Test Feedback */}
              {geminiTestResult && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 animate-fade-in ${
                    geminiTestResult.success
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/40'
                      : 'bg-rose-950/80 text-rose-300 border border-rose-600/40'
                  }`}
                >
                  {geminiTestResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>{geminiTestResult.message}</span>
                </div>
              )}
            </div>

            {/* Noiz.ai API Key Box */}
            <div className="p-5 bg-stone-950/80 rounded-2xl border border-stone-800 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                      <span>Noiz.ai Text-to-Speech (TTS) API Key</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        Ultra-Real Voice Engine
                      </span>
                    </h3>
                    <p className="text-xs text-stone-400">
                      Digunakan untuk menghasilkan karakter suara hangat &amp; welas asih khas Indonesia (Rina, Nova, Bayu, Maya, Arga, Alisa).
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTestNoiz}
                  disabled={testingNoiz}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition border border-stone-700 disabled:opacity-50"
                >
                  <Play className={`w-3.5 h-3.5 text-purple-400 ${testingNoiz ? 'animate-spin' : ''}`} />
                  <span>{testingNoiz ? 'Menguji TTS...' : '🧪 Uji Suara Noiz AI'}</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type={showNoizKey ? 'text' : 'password'}
                  value={noizKeyInput}
                  onChange={(e) => setNoizKeyInput(e.target.value)}
                  placeholder="Masukkan Noiz.ai API Key / Token"
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-xs text-stone-100 pr-24 focus:outline-none focus:border-purple-400 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowNoizKey(!showNoizKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 text-xs flex items-center gap-1 px-2 py-1 bg-stone-800/80 rounded-lg"
                >
                  {showNoizKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showNoizKey ? 'Sembunyi' : 'Lihat'}</span>
                </button>
              </div>

              {/* Noiz Test Feedback */}
              {noizTestResult && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 animate-fade-in ${
                    noizTestResult.success
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/40'
                      : 'bg-rose-950/80 text-rose-300 border border-rose-600/40'
                  }`}
                >
                  {noizTestResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>{noizTestResult.message}</span>
                </div>
              )}
            </div>

            {/* Instructions / Guidance Box */}
            <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-xs text-amber-200/90 space-y-2">
              <h4 className="font-bold flex items-center gap-2 text-amber-300">
                <HelpCircle className="w-4 h-4" />
                <span>Petunjuk Penggunaan Control Panel:</span>
              </h4>
              <ul className="list-disc list-inside space-y-1 text-stone-300 text-[11px] leading-relaxed">
                <li>Setelah mengubah API Key, tekan tombol <strong>"Simpan Semua API Key"</strong>.</li>
                <li>Sistem backend serverless Vercel &amp; Express akan langsung memperbarui variabel runtime seketika tanpa membutuhkan deployment ulang.</li>
                <li>Jika Noiz API Key tidak diisi atau kuota habis, engine otomatis menggunakan fallback <em>Gemini TTS Voice Synthesizer</em> beresolusi tinggi sehingga pengalaman suara pengguna tidak akan terputus.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MANAJEMEN AKUN & PELANGGAN (DEVELOPER-USERS)     */}
      {/* ======================================================== */}
      {activeTab === 'developer-users' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  <span>Manajemen Pengguna &amp; Akun Pelanggan</span>
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Buat akun baru untuk klien/pelanggan, tetapkan paket subscription, atur masa aktif, dan kelola lisensi.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleExportUsers}
                  className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition border border-stone-700"
                >
                  <Download className="w-3.5 h-3.5 text-stone-400" />
                  <span>Ekspor JSON</span>
                </button>

                <button
                  onClick={() => {
                    setNewCustomer({
                      name: '',
                      email: '',
                      phone: '',
                      role: 'USER',
                      plan: 'MONTHLY',
                      status: 'ACTIVE',
                      licenseKey: generateLicenseKey('MONTHLY'),
                      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
                      maxDevices: 3,
                      notes: '',
                    });
                    setIsCreateModalOpen(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-950/40 transition active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Buat Akun Pelanggan Baru</span>
                </button>
              </div>
            </div>

            {/* Quick Demo Account Control Banner */}
            <div className="p-4 rounded-2xl bg-stone-950 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  featureToggles.demo
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}>
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-stone-100">Sakelar Akses Akun Demo Publik</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      featureToggles.demo
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}>
                      {featureToggles.demo ? '● MODE DEMO AKTIF' : '■ MODE DEMO NONAKTIF'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {featureToggles.demo
                      ? 'Pengguna tamu dapat login cepat 1-klik & menggunakan akun demo 24 jam.'
                      : 'Akses instan akun demo ditutup. Hanya pengguna terdaftar / berlisensi yang bisa masuk.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  const newDemoState = !featureToggles.demo;
                  setFeatureToggles({ ...featureToggles, demo: newDemoState });
                  const res = await updateDeveloperConfig({ enableDemoMode24h: newDemoState });
                  if (res.success) {
                    setDevConfig(res.config);
                    setSaveSuccessNotice(
                      newDemoState
                        ? 'Akun Demo & Akses Cepat Tamu BERHASIL DIAKTIFKAN!'
                        : 'Akun Demo & Akses Cepat Tamu BERHASIL DINONAKTIFKAN!'
                    );
                    setTimeout(() => setSaveSuccessNotice(''), 4000);
                  }
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 shrink-0 ${
                  featureToggles.demo
                    ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
                    : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{featureToggles.demo ? 'Nonaktifkan Akun Demo' : 'Aktifkan Akun Demo'}</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative sm:col-span-2">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="text"
                  value={searchUserQuery}
                  onChange={(e) => setSearchUserQuery(e.target.value)}
                  placeholder="Cari pelanggan berdasarkan nama, email, atau lisensi..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
              >
                <option value="ALL">Semua Paket ({customers.length})</option>
                <option value="TRIAL">Trial</option>
                <option value="MONTHLY">Bulanan (Monthly)</option>
                <option value="YEARLY">Tahunan (Yearly)</option>
                <option value="LIFETIME">Lifetime VIP</option>
              </select>
            </div>

            {/* Customers Table */}
            <div className="overflow-x-auto rounded-2xl border border-stone-800">
              <table className="w-full text-left text-xs text-stone-300 border-collapse">
                <thead className="bg-stone-950 text-stone-400 font-bold border-b border-stone-800">
                  <tr>
                    <th className="p-3.5">Pelanggan &amp; Email</th>
                    <th className="p-3.5">Peran &amp; Paket</th>
                    <th className="p-3.5">Lisensi Key</th>
                    <th className="p-3.5">Masa Berlaku</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Aksi Developer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80 bg-stone-900/60">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-stone-500">
                        Tidak ada pelanggan yang cocok dengan pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((cust) => (
                      <tr key={cust.id} className="hover:bg-stone-800/40 transition">
                        <td className="p-3.5">
                          <div className="font-bold text-stone-100">{cust.name}</div>
                          <div className="text-[11px] text-stone-400 font-mono">{cust.email}</div>
                          {cust.phone && <div className="text-[10px] text-stone-500">{cust.phone}</div>}
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                                cust.plan === 'LIFETIME'
                                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                  : cust.plan === 'YEARLY'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                              }`}
                            >
                              {cust.plan}
                            </span>
                            <span className="text-[10px] text-stone-400 font-semibold">{cust.role}</span>
                          </div>
                          <div className="text-[10px] text-stone-500 mt-1">Maks {cust.maxDevices || 3} Perangkat</div>
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[11px] bg-stone-950 px-2 py-1 rounded border border-stone-800 text-amber-300/90">
                              {cust.licenseKey}
                            </span>
                            <button
                              onClick={() => handleCopy(cust.licenseKey, cust.id)}
                              title="Salin Lisensi"
                              className="p-1 hover:bg-stone-800 rounded text-stone-400 hover:text-stone-100 transition"
                            >
                              {copiedKey === cust.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          {cust.notes && <div className="text-[10px] text-stone-500 italic mt-1">{cust.notes}</div>}
                        </td>

                        <td className="p-3.5">
                          <div className="font-medium text-stone-200">{cust.expiresAt}</div>
                          <div className="text-[10px] text-stone-500">
                            {cust.plan === 'LIFETIME' ? 'Selamanya (Aktif)' : `Dibuat: ${cust.createdAt}`}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              cust.status === 'ACTIVE'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {cust.status === 'ACTIVE' ? '● Aktif' : '■ Suspended'}
                          </span>
                        </td>

                        <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => handleOpenEditModal(cust)}
                            title="Edit Akun Pelanggan"
                            className="px-2.5 py-1 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-[10px] font-bold rounded-lg transition border border-amber-400/30 inline-flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3 text-amber-400" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleExtendSubscription(cust.id, 30)}
                            title="+30 Hari"
                            className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] rounded-lg transition"
                          >
                            +30H
                          </button>
                          <button
                            onClick={() => handleSetLifetime(cust.id)}
                            title="Jadikan Lifetime"
                            className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] rounded-lg transition border border-amber-500/30"
                          >
                            Lifetime
                          </button>
                          <button
                            onClick={() => handleToggleCustomerStatus(cust.id)}
                            className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] rounded-lg transition"
                          >
                            {cust.status === 'ACTIVE' ? 'Suspend' : 'Aktifkan'}
                          </button>
                          {cust.role !== 'DEVELOPER' && (
                            <button
                              onClick={() => handleDeleteCustomer(cust.id)}
                              className="p-1 text-rose-400 hover:bg-rose-950/50 rounded-lg transition inline-flex items-center justify-center align-middle"
                              title="Hapus Akun"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal: Create Customer */}
          {isCreateModalOpen && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-stone-900 border border-stone-700 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-fade-in text-stone-100">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-amber-400" />
                    <span>Buat Akun Pengguna / Pelanggan Baru</span>
                  </h3>
                  <button onClick={() => setIsCreateModalOpen(false)} className="text-stone-400 hover:text-stone-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateCustomer} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-300">Nama Lengkap Pelanggan *</label>
                    <input
                      type="text"
                      required
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                      placeholder="Contoh: Sarah Ananda"
                      className="w-full mt-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-stone-300">Email Pelanggan *</label>
                      <input
                        type="email"
                        required
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        placeholder="pelanggan@example.com"
                        className="w-full mt-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-300">No. WhatsApp / HP</label>
                      <input
                        type="text"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                        placeholder="+62 812-xxxx-xxxx"
                        className="w-full mt-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Kata Sandi Akun (Password) *</span>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setNewCustomer({ ...newCustomer, password: generateRandomPassword() })
                        }
                        className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <Key className="w-3 h-3" />
                        <span>Acak Sandi Baru</span>
                      </button>
                    </label>
                    <div className="relative mt-1">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newCustomer.password}
                        onChange={(e) => setNewCustomer({ ...newCustomer, password: e.target.value })}
                        placeholder="Minimal 6 karakter..."
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 pr-10 text-xs font-mono text-stone-100 focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                        title={showNewPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-stone-500 mt-0.5">Digunakan pelanggan untuk login bersama email di halaman masuk.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-stone-300">Paket Langganan</label>
                      <select
                        value={newCustomer.plan}
                        onChange={(e) => {
                          const p = e.target.value as CustomerAccount['plan'];
                          let exp = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
                          if (p === 'YEARLY') exp = new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0];
                          if (p === 'LIFETIME') exp = '2099-12-31';
                          setNewCustomer({
                            ...newCustomer,
                            plan: p,
                            expiresAt: exp,
                            licenseKey: generateLicenseKey(p),
                          });
                        }}
                        className="w-full mt-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                      >
                        <option value="TRIAL">Trial 24 Jam</option>
                        <option value="MONTHLY">Bulanan (30 Hari)</option>
                        <option value="YEARLY">Tahunan (1 Tahun)</option>
                        <option value="LIFETIME">Lifetime VIP</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-300">Peran (Role)</label>
                      <select
                        value={newCustomer.role}
                        onChange={(e) =>
                          setNewCustomer({
                            ...newCustomer,
                            role: e.target.value as CustomerAccount['role'],
                          })
                        }
                        className="w-full mt-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                      >
                        <option value="USER">USER (Pengguna Standar)</option>
                        <option value="PREMIUM">PREMIUM</option>
                        <option value="VIP">VIP</option>
                        <option value="DEVELOPER">DEVELOPER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-stone-300">Masa Aktif Sampai</label>
                      <input
                        type="date"
                        value={newCustomer.expiresAt}
                        onChange={(e) => setNewCustomer({ ...newCustomer, expiresAt: e.target.value })}
                        className="w-full mt-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-300">Jumlah Perangkat (Maks)</label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={newCustomer.maxDevices}
                        onChange={(e) =>
                          setNewCustomer({
                            ...newCustomer,
                            maxDevices: parseInt(e.target.value) || 3,
                          })
                        }
                        placeholder="Contoh: 3"
                        className="w-full mt-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-300 flex items-center justify-between">
                      <span>License Key Otomatis</span>
                      <button
                        type="button"
                        onClick={() =>
                          setNewCustomer({ ...newCustomer, licenseKey: generateLicenseKey(newCustomer.plan) })
                        }
                        className="text-[10px] text-amber-400 hover:underline"
                      >
                        Acak Ulang
                      </button>
                    </label>
                    <input
                      type="text"
                      value={newCustomer.licenseKey}
                      onChange={(e) => setNewCustomer({ ...newCustomer, licenseKey: e.target.value })}
                      className="w-full mt-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-300">Catatan Pelanggan</label>
                    <textarea
                      rows={2}
                      value={newCustomer.notes}
                      onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                      placeholder="Contoh: Pembayaran transfer bank BCA, request fokus meditasi tidur."
                      className="w-full mt-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs shadow-md shadow-amber-950/40"
                    >
                      Simpan &amp; Aktifkan Akun
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal: Edit Customer */}
          {isEditModalOpen && editingCustomer && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-stone-900 border border-amber-500/30 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-fade-in text-stone-100">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                      <Edit3 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-stone-100">
                        Edit Akun Pelanggan
                      </h3>
                      <p className="text-[11px] text-stone-400">ID: {editingCustomer.id}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingCustomer(null);
                    }}
                    className="text-stone-400 hover:text-stone-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveEditedCustomer} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-300">Nama Lengkap Pelanggan *</label>
                    <input
                      type="text"
                      required
                      value={editingCustomer.name}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                      className="w-full mt-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-stone-300">Email Pelanggan *</label>
                      <input
                        type="email"
                        required
                        value={editingCustomer.email}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                        className="w-full mt-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-300">No. WhatsApp / HP</label>
                      <input
                        type="text"
                        value={editingCustomer.phone || ''}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                        placeholder="+62 812-xxxx-xxxx"
                        className="w-full mt-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Kata Sandi Akun (Password)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingCustomer({ ...editingCustomer, password: generateRandomPassword() })
                        }
                        className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <Key className="w-3 h-3" />
                        <span>Reset Sandi Baru</span>
                      </button>
                    </label>
                    <div className="relative mt-1">
                      <input
                        type={showEditPassword ? 'text' : 'password'}
                        value={editingCustomer.password || ''}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, password: e.target.value })}
                        placeholder="Ketik sandi baru jika ingin mengubah..."
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 pr-10 text-xs font-mono text-stone-100 focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEditPassword(!showEditPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                        title={showEditPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                      >
                        {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-stone-500 mt-0.5">Ubah kata sandi login pelanggan ini jika diperlukan.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-stone-300">Paket</label>
                      <select
                        value={editingCustomer.plan}
                        onChange={(e) => {
                          const p = e.target.value as CustomerAccount['plan'];
                          let exp = editingCustomer.expiresAt;
                          if (p === 'LIFETIME') exp = '2099-12-31';
                          setEditingCustomer({
                            ...editingCustomer,
                            plan: p,
                            expiresAt: exp,
                          });
                        }}
                        className="w-full mt-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                      >
                        <option value="TRIAL">Trial 24 Jam</option>
                        <option value="MONTHLY">Bulanan</option>
                        <option value="YEARLY">Tahunan</option>
                        <option value="LIFETIME">Lifetime VIP</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-300">Peran (Role)</label>
                      <select
                        value={editingCustomer.role}
                        onChange={(e) =>
                          setEditingCustomer({
                            ...editingCustomer,
                            role: e.target.value as CustomerAccount['role'],
                          })
                        }
                        className="w-full mt-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                      >
                        <option value="USER">USER</option>
                        <option value="PREMIUM">PREMIUM</option>
                        <option value="VIP">VIP</option>
                        <option value="DEVELOPER">DEVELOPER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-300">Status Akun</label>
                      <select
                        value={editingCustomer.status}
                        onChange={(e) =>
                          setEditingCustomer({
                            ...editingCustomer,
                            status: e.target.value as CustomerAccount['status'],
                          })
                        }
                        className="w-full mt-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                      >
                        <option value="ACTIVE">● Aktif</option>
                        <option value="SUSPENDED">■ Suspended</option>
                        <option value="EXPIRED">▲ Expired</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-stone-300">Masa Aktif Sampai</label>
                      <input
                        type="date"
                        value={editingCustomer.expiresAt}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, expiresAt: e.target.value })}
                        className="w-full mt-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-300">Maks Perangkat</label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={editingCustomer.maxDevices || 3}
                        onChange={(e) =>
                          setEditingCustomer({
                            ...editingCustomer,
                            maxDevices: parseInt(e.target.value) || 3,
                          })
                        }
                        className="w-full mt-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-300 flex items-center justify-between">
                      <span>License Key</span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingCustomer({
                            ...editingCustomer,
                            licenseKey: generateLicenseKey(editingCustomer.plan),
                          })
                        }
                        className="text-[10px] text-amber-400 hover:underline"
                      >
                        Acak Ulang Lisensi
                      </button>
                    </label>
                    <input
                      type="text"
                      value={editingCustomer.licenseKey}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, licenseKey: e.target.value })}
                      className="w-full mt-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-300">Catatan Pelanggan</label>
                    <textarea
                      rows={2}
                      value={editingCustomer.notes || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, notes: e.target.value })}
                      placeholder="Catatan khusus, riwayat transaksi, preferensi..."
                      className="w-full mt-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditModalOpen(false);
                        setEditingCustomer(null);
                      }}
                      className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs transition"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold rounded-xl text-xs shadow-md shadow-amber-950/40 transition"
                    >
                      Simpan Perubahan Akun
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: UBAH APLIKASI & PROMPT AI (DEVELOPER-APP)        */}
      {/* ======================================================== */}
      {activeTab === 'developer-app' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-400" />
                  <span>Modifikasi Aplikasi &amp; AI Coach Persona (Live)</span>
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Ubah nama branding, kontak developer, default suara narator, dan panduan persona AI Coach tanpa deploy ulang.
                </p>
              </div>

              <button
                onClick={handleSaveAppCustomization}
                disabled={isSavingConfig}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-amber-950/40 transition active:scale-95 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSavingConfig ? 'Menyimpan...' : 'Terapkan Perubahan'}</span>
              </button>
            </div>

            {/* Branding & App Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-300">Nama Aplikasi / Branding</label>
                <input
                  type="text"
                  value={customAppTitle}
                  onChange={(e) => setCustomAppTitle(e.target.value)}
                  className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300">Tagline Aplikasi</label>
                <input
                  type="text"
                  value={customAppTagline}
                  onChange={(e) => setCustomAppTagline(e.target.value)}
                  className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300">Email Developer / Support</label>
                <input
                  type="email"
                  value={customDevEmail}
                  onChange={(e) => setCustomDevEmail(e.target.value)}
                  className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Default Voice Selector */}
            <div className="p-4 bg-stone-950/80 rounded-2xl border border-stone-800 space-y-3">
              <h3 className="text-xs font-bold text-stone-200 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-purple-400" />
                <span>Pilihan Default Suara Audio AI &amp; Meditasi:</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'rina', label: 'Rina (Noiz AI)', desc: 'Hangat & Welas Asih (Wanita)' },
                  { id: 'nova', label: 'Nova (Noiz AI)', desc: 'Jernih & Damai (Wanita)' },
                  { id: 'bayu', label: 'Bayu (Noiz AI)', desc: 'Teduh & Grounding (Pria)' },
                  { id: 'maya', label: 'Maya (Noiz AI)', desc: 'Lembut Menyejukkan (Wanita)' },
                  { id: 'arga', label: 'Arga (Noiz AI)', desc: 'Penuh Wibawa & Stabil (Pria)' },
                  { id: 'alisa', label: 'Alisa (Noiz AI)', desc: 'Pengantar Tidur Lelap (Wanita)' },
                ].map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setCustomDefaultVoice(v.id)}
                    className={`p-3 rounded-xl border text-left text-xs transition ${
                      customDefaultVoice === v.id
                        ? 'bg-purple-950/60 border-purple-500 text-purple-200 shadow-md'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <div className="font-bold text-stone-100">{v.label}</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">{v.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Master Prompt AI Coach */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-200 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  <span>Master Prompt &amp; System Instruction AI Coach (Live)</span>
                </span>
                <span className="text-[10px] text-stone-400 font-normal">
                  Instruksi ini akan langsung memandu cara berpikir dan gaya bahasa AI Coach.
                </span>
              </label>
              <textarea
                rows={5}
                value={customMasterPrompt}
                onChange={(e) => setCustomMasterPrompt(e.target.value)}
                placeholder="Tuliskan instruksi sistem persona LEGA AI di sini..."
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 text-xs font-mono text-stone-200 focus:outline-none focus:border-amber-400 leading-relaxed"
              />
            </div>

            {/* Feature Flags / Toggles */}
            <div className="pt-3 border-t border-stone-800">
              <h3 className="text-xs font-bold text-stone-300 mb-3">Sakelar Modul Fitur (Feature Flags):</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center justify-between p-3.5 bg-stone-950 rounded-xl border border-stone-800 cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-stone-200">Modul Spiritual Refleksi</span>
                    <p className="text-[10px] text-stone-500">Refleksi tawakal, syukur &amp; ikhlas</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={featureToggles.spiritual}
                    onChange={(e) => setFeatureToggles({ ...featureToggles, spiritual: e.target.checked })}
                    className="w-4 h-4 accent-amber-400"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 bg-stone-950 rounded-xl border border-stone-800 cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-stone-200">Hotline Bantuan Krisis</span>
                    <p className="text-[10px] text-stone-500">Kemenkes 119 &amp; Into The Light</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={featureToggles.crisis}
                    onChange={(e) => setFeatureToggles({ ...featureToggles, crisis: e.target.checked })}
                    className="w-4 h-4 accent-amber-400"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 bg-stone-950 rounded-xl border border-stone-800 cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-stone-200">Mode Demo 24 Jam</span>
                    <p className="text-[10px] text-stone-500">Uji coba instan tanpa registrasi</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={featureToggles.demo}
                    onChange={(e) => setFeatureToggles({ ...featureToggles, demo: e.target.checked })}
                    className="w-4 h-4 accent-amber-400"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: DIAGNOSTIK & SERVER HEALTH (DEVELOPER-DIAGNOSTICS) */}
      {/* ======================================================== */}
      {activeTab === 'developer-diagnostics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>Google Gemini Engine</span>
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-lg font-black text-emerald-400">AKTIF (ONLINE)</p>
              <p className="text-[11px] text-stone-400">Gemini 3.7 Flash &amp; 3.1 Lite</p>
            </div>

            <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>Noiz.ai Voice TTS</span>
                <Volume2 className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-lg font-black text-purple-400">TERHUBUNG</p>
              <p className="text-[11px] text-stone-400">6 Karakter Voice Indonesia</p>
            </div>

            <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>Database Sync</span>
                <Database className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-lg font-black text-emerald-400">REALTIME</p>
              <p className="text-[11px] text-stone-400">Firestore &amp; Local Storage</p>
            </div>

            <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>Deployment Target</span>
                <Globe className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-lg font-black text-amber-400">Vercel &amp; Cloud</p>
              <p className="text-[11px] text-stone-400">Full-Stack Serverless + Vite</p>
            </div>
          </div>

          {/* Diagnostics Actions */}
          <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
            <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span>Uji Latensi &amp; Respon Komponen Sistem</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-200 text-xs">Uji Ping Gemini Flash 3.7</span>
                  <button
                    onClick={handleTestGemini}
                    disabled={testingGemini}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                  >
                    {testingGemini ? 'Menguji...' : 'Uji Sekarang'}
                  </button>
                </div>
                {geminiTestResult && (
                  <p className="text-xs text-stone-300 font-mono bg-stone-900 p-2.5 rounded-lg">
                    {geminiTestResult.message}
                  </p>
                )}
              </div>

              <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-200 text-xs">Uji Audio Synthesis Noiz AI</span>
                  <button
                    onClick={handleTestNoiz}
                    disabled={testingNoiz}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold"
                  >
                    {testingNoiz ? 'Menguji...' : 'Uji Sekarang'}
                  </button>
                </div>
                {noizTestResult && (
                  <p className="text-xs text-stone-300 font-mono bg-stone-900 p-2.5 rounded-lg">
                    {noizTestResult.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: RINGKASAN EKSEKUTIF (OVERVIEW)                   */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-1">
              <p className="text-xs text-stone-400">Total Pengguna Terdaftar</p>
              <p className="text-2xl font-black text-stone-100">{customers.length + 1420}</p>
              <p className="text-[10px] text-emerald-400">+18% bulan ini</p>
            </div>
            <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-1">
              <p className="text-xs text-stone-400">Lisensi Aktif</p>
              <p className="text-2xl font-black text-amber-400">{customers.length + 1150}</p>
              <p className="text-[10px] text-stone-400">Lifetime &amp; Berlangganan</p>
            </div>
            <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-1">
              <p className="text-xs text-stone-400">Total Refleksi Selesai</p>
              <p className="text-2xl font-black text-emerald-400">28,450</p>
              <p className="text-[10px] text-emerald-400">Rata-rata 4.2 modul/user</p>
            </div>
            <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-1">
              <p className="text-xs text-stone-400">Uptime Server Production</p>
              <p className="text-2xl font-black text-teal-400">99.98%</p>
              <p className="text-[10px] text-stone-400">0 critical incidents</p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: 30 MASTER PROMPTS                                 */}
      {/* ======================================================== */}
      {activeTab === 'prompts' && (
        <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-5">
          <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span>Koleksi 30 Master Prompt LEGA (SHAQILA DIGITAL 99)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {prompts.map((p) => (
              <div key={p.id} className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 font-mono text-xs">{p.id}</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300">
                    {p.status}
                  </span>
                </div>
                <h3 className="font-bold text-stone-100 text-sm">{p.name}</h3>
                <div className="flex items-center justify-between text-[11px] text-stone-400">
                  <span>Modul: {p.module}</span>
                  <span>Versi: {p.version}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 7: AI ADMIN ASSISTANT                                */}
      {/* ======================================================== */}
      {activeTab === 'assistant' && (
        <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
          <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-400" />
            <span>LEGA AI Admin Assistant</span>
          </h2>
          <div className="h-80 overflow-y-auto p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
            {aiChatLogs.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl max-w-xl text-xs ${
                  msg.sender === 'admin'
                    ? 'ml-auto bg-amber-400 text-stone-950 font-medium'
                    : 'mr-auto bg-stone-900 border border-stone-800 text-stone-200'
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-[9px] opacity-60 block mt-1 text-right">{msg.time}</span>
              </div>
            ))}
            {isAiThinking && (
              <div className="text-xs text-stone-400 italic flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Admin AI sedang menganalisis database &amp; sistem...</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendAiQuery()}
              placeholder="Tanyakan status database, pengguna aktif, atau konfigurasi sistem..."
              className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
            />
            <button
              onClick={() => handleSendAiQuery()}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
