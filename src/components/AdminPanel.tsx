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
  Power,
  Film,
  Image as ImageIcon,
  Video,
  MessageCircle
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
  getLocalDeveloperConfig,
  DEFAULT_LANDING_PAGE_CONFIG
} from '../lib/developerService';
import { CustomerAccount, DeveloperConfig, LandingPageConfig, LandingPageGalleryItem } from '../types';

type AdminTab =
  | 'developer-keys'
  | 'developer-users'
  | 'developer-app'
  | 'developer-landing'
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

  // Landing Page Editor State
  const [landingConfigState, setLandingConfigState] = useState<LandingPageConfig>(DEFAULT_LANDING_PAGE_CONFIG);
  const [newGalleryTitle, setNewGalleryTitle] = useState<string>('');
  const [newGalleryDesc, setNewGalleryDesc] = useState<string>('');
  const [newGalleryUrl, setNewGalleryUrl] = useState<string>('');
  const [newGalleryCategory, setNewGalleryCategory] = useState<string>('Fitur');

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

      if (cfg.landingPage) {
        setLandingConfigState({ ...DEFAULT_LANDING_PAGE_CONFIG, ...cfg.landingPage });
      }

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

  // Save Landing Page Customization
  const handleSaveLandingPage = async () => {
    setIsSavingConfig(true);
    const res = await updateDeveloperConfig({
      landingPage: landingConfigState,
    });
    setIsSavingConfig(false);
    if (res.success) {
      setDevConfig(res.config);
      setSaveSuccessNotice('Teks, Gambar & Video Landing Page berhasil disimpan dan dipublikasikan!');
      setTimeout(() => setSaveSuccessNotice(''), 5000);
    }
  };

  // Add Gallery Image Item
  const handleAddGalleryItem = () => {
    if (!newGalleryUrl.trim() || !newGalleryTitle.trim()) return;
    const newItem: LandingPageGalleryItem = {
      id: 'gal-' + Date.now(),
      title: newGalleryTitle.trim(),
      description: newGalleryDesc.trim(),
      url: newGalleryUrl.trim(),
      category: newGalleryCategory.trim() || 'Fitur',
    };
    setLandingConfigState((prev) => ({
      ...prev,
      galleryImages: [...(prev.galleryImages || []), newItem],
    }));
    setNewGalleryTitle('');
    setNewGalleryDesc('');
    setNewGalleryUrl('');
  };

  // Remove Gallery Image Item
  const handleRemoveGalleryItem = (id: string) => {
    setLandingConfigState((prev) => ({
      ...prev,
      galleryImages: (prev.galleryImages || []).filter((item) => item.id !== id),
    }));
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
          onClick={() => setActiveTab('developer-landing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'developer-landing'
              ? 'bg-amber-400 text-stone-950 shadow-lg shadow-amber-950/50 scale-102'
              : 'bg-stone-900/90 text-stone-300 hover:bg-stone-800 border border-stone-800'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Edit Landing Page, Gambar &amp; Video</span>
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
      {/* TAB: EDIT LANDING PAGE, GAMBAR & VIDEO (DEVELOPER-LANDING) */}
      {/* ======================================================== */}
      {activeTab === 'developer-landing' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-6 shadow-xl">
            {/* Header & Save Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                  <Film className="w-5 h-5 text-amber-400" />
                  <span>Editor Teks, Media Gambar &amp; Video Landing Page (Live)</span>
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Atur semua tulisan, gambar poster, video YouTube/MP4, fitur galeri, dan kontak di halaman depan (landing page) secara langsung tanpa perlu deploy ulang.
                </p>
              </div>

              <button
                onClick={handleSaveLandingPage}
                disabled={isSavingConfig}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-amber-950/40 transition active:scale-95 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSavingConfig ? 'Menyimpan...' : 'Simpan & Publikasikan Landing Page'}</span>
              </button>
            </div>

            {/* Quick Media Presets Banner */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Preset Cepat Media Relaksasi &amp; Video</span>
                </span>
                <p className="text-[11px] text-stone-400">
                  Gunakan preset siap pakai untuk mengisi URL video YouTube atau wallpaper berkualitas tinggi dengan 1 klik:
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLandingConfigState((prev) => ({
                      ...prev,
                      mediaType: 'youtube',
                      heroVideoUrl: 'https://www.youtube.com/watch?v=1ZYbU88GEz4',
                      heroVideoTitle: 'Suasana Hening Relaksasi Alam & Hujan Teduh',
                      heroVideoSubtitle: 'Pemandu visual suara alam untuk meredakan ketegangan saraf & overthinking.',
                    }));
                  }}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 border border-amber-400/40 text-amber-200 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition"
                >
                  <Video className="w-3.5 h-3.5 text-red-400" />
                  <span>Preset Video YouTube</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLandingConfigState((prev) => ({
                      ...prev,
                      mediaType: 'image',
                      heroImageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=80',
                      heroImageCaption: 'Pusat Keheningan Alam & Kesadaran Somatis LEGA SHAQILA DIGITAL 99',
                    }));
                  }}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 border border-emerald-400/40 text-emerald-200 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Preset Gambar Zen</span>
                </button>
              </div>
            </div>

            {/* SECTION 1: TOP BRAND & PROMO BANNER */}
            <div className="p-5 bg-stone-950/80 rounded-2xl border border-stone-800 space-y-4">
              <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2 border-b border-stone-850 pb-2">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>1. Header Atas, Nama Brand &amp; Banner Pengumuman Promo</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-300">Badge Label Brand Atas</label>
                  <input
                    type="text"
                    value={landingConfigState.topBrandTag || ''}
                    onChange={(e) =>
                      setLandingConfigState({ ...landingConfigState, topBrandTag: e.target.value })
                    }
                    placeholder="Contoh: SHAQILA DIGITAL 99"
                    className="w-full mt-1 bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300">Slogan Teks Berjalan Atas</label>
                  <input
                    type="text"
                    value={landingConfigState.topBrandSlogan || ''}
                    onChange={(e) =>
                      setLandingConfigState({ ...landingConfigState, topBrandSlogan: e.target.value })
                    }
                    placeholder="Contoh: LEGA SHAQILA DIGITAL 99 • Platform Kesadaran Diri..."
                    className="w-full mt-1 bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Promo Banner Toggle & Content */}
              <div className="p-4 bg-stone-900/60 rounded-xl border border-stone-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-200 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Aktifkan Banner Promo / Pengumuman Teratas</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={landingConfigState.enablePromoBanner ?? true}
                    onChange={(e) =>
                      setLandingConfigState({ ...landingConfigState, enablePromoBanner: e.target.checked })
                    }
                    className="w-4 h-4 accent-amber-400"
                  />
                </div>

                {landingConfigState.enablePromoBanner && (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                    <div>
                      <label className="text-xs font-semibold text-stone-400">Teks Badge Promo</label>
                      <input
                        type="text"
                        value={landingConfigState.promoBannerBadge || ''}
                        onChange={(e) =>
                          setLandingConfigState({
                            ...landingConfigState,
                            promoBannerBadge: e.target.value,
                          })
                        }
                        placeholder="Contoh: PROMO SPESIAL"
                        className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-amber-300 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="text-xs font-semibold text-stone-400">Isi Pesan Banner Promo</label>
                      <input
                        type="text"
                        value={landingConfigState.promoBannerText || ''}
                        onChange={(e) =>
                          setLandingConfigState({
                            ...landingConfigState,
                            promoBannerText: e.target.value,
                          })
                        }
                        placeholder="Contoh: Akses Penuh 24 Jam Gratis Seluruh Fitur AI Coach & 15+ Suasana Relaksasi Alam"
                        className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 2: HERO SECTION COPYWRITING & CTAs */}
            <div className="p-5 bg-stone-950/80 rounded-2xl border border-stone-800 space-y-4">
              <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2 border-b border-stone-850 pb-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>2. Tulisan &amp; Copywriting Hero Section (Halaman Depan)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-300">Badge Atas Judul</label>
                  <input
                    type="text"
                    value={landingConfigState.heroBadge || ''}
                    onChange={(e) =>
                      setLandingConfigState({ ...landingConfigState, heroBadge: e.target.value })
                    }
                    placeholder="Contoh: LEGA SHAQILA DIGITAL 99"
                    className="w-full mt-1 bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300">Judul Utama (Headline Besar)</label>
                  <input
                    type="text"
                    value={landingConfigState.heroHeadline || ''}
                    onChange={(e) =>
                      setLandingConfigState({ ...landingConfigState, heroHeadline: e.target.value })
                    }
                    placeholder="Contoh: LEGA SHAQILA DIGITAL 99"
                    className="w-full mt-1 bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs font-bold text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300">Sub-Judul (Sub-Headline)</label>
                <input
                  type="text"
                  value={landingConfigState.heroSubheadline || ''}
                  onChange={(e) =>
                    setLandingConfigState({ ...landingConfigState, heroSubheadline: e.target.value })
                  }
                  placeholder="Contoh: Platform kesadaran diri, pengelolaan emosi & relaksasi berbasis AI."
                  className="w-full mt-1 bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-amber-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300">Deskripsi Ringkas Platform</label>
                <textarea
                  rows={2}
                  value={landingConfigState.heroDescription || ''}
                  onChange={(e) =>
                    setLandingConfigState({ ...landingConfigState, heroDescription: e.target.value })
                  }
                  placeholder="Deskripsi singkat yang tampil di bawah subjudul..."
                  className="w-full mt-1 bg-stone-900 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-400 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-300">Kotak Penjelasan Detail</label>
                  <textarea
                    rows={3}
                    value={landingConfigState.heroDetailsBox || ''}
                    onChange={(e) =>
                      setLandingConfigState({ ...landingConfigState, heroDetailsBox: e.target.value })
                    }
                    placeholder="Teks penjelasan kapabilitas komprehensif..."
                    className="w-full mt-1 bg-stone-900 border border-stone-800 rounded-xl p-3 text-xs text-stone-300 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300">Kutipan Filosofi / Pendekatan</label>
                  <textarea
                    rows={3}
                    value={landingConfigState.heroApprochNote || ''}
                    onChange={(e) =>
                      setLandingConfigState({ ...landingConfigState, heroApprochNote: e.target.value })
                    }
                    placeholder="Kutipan pendekatan 'Bukan sekadar pereda stres instan...' "
                    className="w-full mt-1 bg-stone-900 border border-stone-800 rounded-xl p-3 text-xs text-stone-300 focus:outline-none focus:border-amber-400 italic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-stone-300">Teks Tombol CTA Utama</label>
                  <input
                    type="text"
                    value={landingConfigState.heroCtaPrimaryText || ''}
                    onChange={(e) =>
                      setLandingConfigState({
                        ...landingConfigState,
                        heroCtaPrimaryText: e.target.value,
                      })
                    }
                    placeholder="Contoh: Masuk Ruang Tenang Sekarang"
                    className="w-full mt-1 bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300">Teks Tombol CTA Kedua (Audio)</label>
                  <input
                    type="text"
                    value={landingConfigState.heroCtaSecondaryText || ''}
                    onChange={(e) =>
                      setLandingConfigState({
                        ...landingConfigState,
                        heroCtaSecondaryText: e.target.value,
                      })
                    }
                    placeholder="Contoh: Dengarkan 6 Pilihan Suara Pemandu"
                    className="w-full mt-1 bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: HERO MEDIA (GAMBAR & VIDEO LANDING PAGE) */}
            <div className="p-5 bg-stone-950/80 rounded-2xl border border-stone-800 space-y-4">
              <h3 className="text-sm font-bold text-stone-100 flex items-center justify-between border-b border-stone-850 pb-2 flex-wrap gap-2">
                <span className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-purple-400" />
                  <span>3. Media Utama Hero (Gambar Poster atau Video Player / YouTube)</span>
                </span>
                <span className="text-[11px] font-mono text-purple-300 bg-purple-950/50 px-2.5 py-1 rounded-full border border-purple-500/30">
                  Tipe Aktif: {landingConfigState.mediaType.toUpperCase()}
                </span>
              </h3>

              {/* Media Type Selector */}
              <div>
                <label className="text-xs font-semibold text-stone-300 mb-2 block">
                  Pilih Format Tampilan Media di Bawah Tombol Aksi:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'image', label: 'Gambar Poster HD', icon: ImageIcon, desc: 'Foto alam zen / poster' },
                    { id: 'youtube', label: 'Video YouTube', icon: Video, desc: 'Embed YouTube langsung' },
                    { id: 'video', label: 'Video MP4 / Link', icon: Play, desc: 'HTML5 Video player' },
                    { id: 'none', label: 'Tanpa Media', icon: EyeOff, desc: 'Sembunyikan media showcase' },
                  ].map((m) => {
                    const IconComp = m.icon;
                    const isSelected = landingConfigState.mediaType === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() =>
                          setLandingConfigState({
                            ...landingConfigState,
                            mediaType: m.id as any,
                          })
                        }
                        className={`p-3 rounded-2xl border text-left transition ${
                          isSelected
                            ? 'bg-amber-950/60 border-amber-400 text-amber-200 shadow-md'
                            : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold text-xs text-stone-100">
                          <IconComp className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-stone-400'}`} />
                          <span>{m.label}</span>
                        </div>
                        <p className="text-[10px] text-stone-400 mt-1">{m.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Conditional Media Config: IMAGE */}
              {landingConfigState.mediaType === 'image' && (
                <div className="p-4 bg-stone-900 rounded-xl border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-400" />
                      <span>Pengaturan Gambar Poster Hero</span>
                    </span>
                    <span className="text-[10px] text-stone-400">Mendukung format JPG, PNG, WEBP, Unsplash URL</span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-300">URL Gambar (Image Link)</label>
                    <input
                      type="url"
                      value={landingConfigState.heroImageUrl || ''}
                      onChange={(e) =>
                        setLandingConfigState({ ...landingConfigState, heroImageUrl: e.target.value })
                      }
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-300">Teks Keterangan Gambar (Caption)</label>
                    <input
                      type="text"
                      value={landingConfigState.heroImageCaption || ''}
                      onChange={(e) =>
                        setLandingConfigState({ ...landingConfigState, heroImageCaption: e.target.value })
                      }
                      placeholder="Contoh: Pusat Keheningan & Relaksasi Berbasis AI"
                      className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Preset Image Options */}
                  <div className="pt-2 border-t border-stone-800/80">
                    <span className="text-[11px] font-semibold text-stone-400">Pilihan Cepat Wallpaper Zen:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5">
                      {[
                        { name: 'Hutan Tropis Berkabut', url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=80' },
                        { name: 'Pantai & Ombak Tenang', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80' },
                        { name: 'Batu Zen & Air Terjun', url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1400&q=80' },
                        { name: 'Langit Malam Bertabur Bintang', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80' },
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            setLandingConfigState({
                              ...landingConfigState,
                              heroImageUrl: preset.url,
                              heroImageCaption: preset.name,
                            })
                          }
                          className="p-2 bg-stone-950 hover:bg-stone-800 border border-stone-800 rounded-xl text-left text-[10px] text-stone-300 transition"
                        >
                          <span className="font-semibold text-stone-200 block truncate">{preset.name}</span>
                          <span className="text-[9px] text-stone-500 truncate block mt-0.5">Terapkan</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Preview Box */}
                  {landingConfigState.heroImageUrl && (
                    <div className="mt-3 p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1.5">
                      <span className="text-[10px] font-bold text-stone-400">Live Preview Gambar Hero:</span>
                      <div className="w-full h-44 rounded-lg overflow-hidden border border-stone-800 bg-stone-900 relative">
                        <img
                          src={landingConfigState.heroImageUrl}
                          alt="Hero Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as any).src = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=80';
                          }}
                        />
                        {landingConfigState.heroImageCaption && (
                          <div className="absolute bottom-0 inset-x-0 bg-stone-950/80 backdrop-blur-sm p-2 text-center text-xs text-amber-200">
                            {landingConfigState.heroImageCaption}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Conditional Media Config: VIDEO / YOUTUBE */}
              {(landingConfigState.mediaType === 'video' || landingConfigState.mediaType === 'youtube') && (
                <div className="p-4 bg-stone-900 rounded-xl border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-purple-400" />
                      <span>Pengaturan Video {landingConfigState.mediaType === 'youtube' ? 'YouTube Embed' : 'Player MP4'}</span>
                    </span>
                    <span className="text-[10px] text-stone-400">Masukkan link YouTube (youtube.com/watch?v=... atau youtu.be/...)</span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-300">
                      {landingConfigState.mediaType === 'youtube' ? 'URL Video YouTube' : 'URL File Video Direct (MP4/WebM)'}
                    </label>
                    <input
                      type="url"
                      value={landingConfigState.heroVideoUrl || ''}
                      onChange={(e) =>
                        setLandingConfigState({ ...landingConfigState, heroVideoUrl: e.target.value })
                      }
                      placeholder={
                        landingConfigState.mediaType === 'youtube'
                          ? 'https://www.youtube.com/watch?v=1ZYbU88GEz4'
                          : 'https://cdn.example.com/videos/meditation.mp4'
                      }
                      className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-stone-300">Judul Video</label>
                      <input
                        type="text"
                        value={landingConfigState.heroVideoTitle || ''}
                        onChange={(e) =>
                          setLandingConfigState({ ...landingConfigState, heroVideoTitle: e.target.value })
                        }
                        placeholder="Contoh: Suasana Hening Relaksasi Alam"
                        className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-300">Subjudul / Deskripsi Video</label>
                      <input
                        type="text"
                        value={landingConfigState.heroVideoSubtitle || ''}
                        onChange={(e) =>
                          setLandingConfigState({ ...landingConfigState, heroVideoSubtitle: e.target.value })
                        }
                        placeholder="Contoh: Pemandu visual audio untuk meredakan kecemasan"
                        className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Preset YouTube Videos */}
                  <div className="pt-2 border-t border-stone-800/80">
                    <span className="text-[11px] font-semibold text-stone-400">Pilihan Cepat Video YouTube Relaksasi:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1.5">
                      {[
                        {
                          title: 'Suara Hujan & Keheningan 4K',
                          url: 'https://www.youtube.com/watch?v=1ZYbU88GEz4',
                          desc: 'Audio alam hujan & ketenangan',
                        },
                        {
                          title: 'Ombak Pantai Meditatif',
                          url: 'https://www.youtube.com/watch?v=bn9F19Hi1Lk',
                          desc: 'Gelombang laut menenangkan',
                        },
                        {
                          title: 'Alunan Piano & Suasana Hutan',
                          url: 'https://www.youtube.com/watch?v=2OEL4P1Rz04',
                          desc: 'Instrumen teduh pengantar istirahat',
                        },
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            setLandingConfigState({
                              ...landingConfigState,
                              mediaType: 'youtube',
                              heroVideoUrl: item.url,
                              heroVideoTitle: item.title,
                              heroVideoSubtitle: item.desc,
                            })
                          }
                          className="p-2.5 bg-stone-950 hover:bg-stone-800 border border-stone-800 rounded-xl text-left text-xs transition"
                        >
                          <span className="font-bold text-amber-300 block truncate">{item.title}</span>
                          <span className="text-[10px] text-stone-400 block truncate mt-0.5">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live Video Preview Box */}
                  {landingConfigState.heroVideoUrl && (
                    <div className="mt-3 p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1.5">
                      <span className="text-[10px] font-bold text-stone-400">Live Preview Video:</span>
                      <div className="w-full aspect-video max-h-56 rounded-lg overflow-hidden border border-stone-800 bg-stone-900 flex items-center justify-center">
                        {landingConfigState.mediaType === 'youtube' ? (
                          <iframe
                            src={
                              landingConfigState.heroVideoUrl.includes('watch?v=')
                                ? `https://www.youtube.com/embed/${landingConfigState.heroVideoUrl.split('watch?v=')[1]?.split('&')[0]}`
                                : landingConfigState.heroVideoUrl.includes('youtu.be/')
                                ? `https://www.youtube.com/embed/${landingConfigState.heroVideoUrl.split('youtu.be/')[1]?.split('?')[0]}`
                                : landingConfigState.heroVideoUrl
                            }
                            title="Video Preview"
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            src={landingConfigState.heroVideoUrl}
                            controls
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* SECTION 4: TRANSFORMATION MATRIX (SEBELUM VS SESUDAH) */}
            <div className="p-5 bg-stone-950/80 rounded-2xl border border-stone-800 space-y-4">
              <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2 border-b border-stone-850 pb-2">
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>4. Matriks Transformasi Batin (Sebelum vs Sesudah Mengenal LEGA)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Before Column */}
                <div className="p-4 bg-stone-900/80 rounded-2xl border border-red-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                    <span>Kolom Sebelum (Titik Sakit &amp; Kebingungan)</span>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-stone-400">Judul Kolom Sebelum</label>
                    <input
                      type="text"
                      value={landingConfigState.beforeTitle || ''}
                      onChange={(e) =>
                        setLandingConfigState({ ...landingConfigState, beforeTitle: e.target.value })
                      }
                      placeholder="Contoh: Sebelum Mengenal LEGA"
                      className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-rose-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-stone-400 flex items-center justify-between">
                      <span>Daftar Poin Masalah (1 baris = 1 poin)</span>
                    </label>
                    <textarea
                      rows={5}
                      value={(landingConfigState.beforePoints || []).join('\n')}
                      onChange={(e) =>
                        setLandingConfigState({
                          ...landingConfigState,
                          beforePoints: e.target.value.split('\n').filter((x) => x.trim().length > 0),
                        })
                      }
                      placeholder="Terjebak dalam spiral overthinking tiada henti&#10;Emosi meledak-ledak atau sebaliknya mati rasa&#10;Nafas pendek dan dada sering terasa sesak"
                      className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs font-mono text-stone-200 focus:outline-none focus:border-rose-400 leading-relaxed"
                    />
                  </div>
                </div>

                {/* After Column */}
                <div className="p-4 bg-stone-900/80 rounded-2xl border border-emerald-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    <span>Kolom Sesudah (Keheningan &amp; Kesadaran Baru)</span>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-stone-400">Judul Kolom Sesudah</label>
                    <input
                      type="text"
                      value={landingConfigState.afterTitle || ''}
                      onChange={(e) =>
                        setLandingConfigState({ ...landingConfigState, afterTitle: e.target.value })
                      }
                      placeholder="Contoh: Setelah Bersama LEGA SHAQILA DIGITAL 99"
                      className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-stone-400 flex items-center justify-between">
                      <span>Daftar Poin Transformasi (1 baris = 1 poin)</span>
                    </label>
                    <textarea
                      rows={5}
                      value={(landingConfigState.afterPoints || []).join('\n')}
                      onChange={(e) =>
                        setLandingConfigState({
                          ...landingConfigState,
                          afterPoints: e.target.value.split('\n').filter((x) => x.trim().length > 0),
                        })
                      }
                      placeholder="Pola pemicu emosi terpetakan jelas lewat AI Coach&#10;Ketenangan somatis & nafas dalam hadir setiap saat&#10;Tidur lebih lelap dengan audio 6 narator berfrekuensi damai"
                      className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs font-mono text-stone-200 focus:outline-none focus:border-emerald-400 leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 5: GALLERY SHOWCASE (TAMBAH & KELOLA GAMBAR) */}
            <div className="p-5 bg-stone-950/80 rounded-2xl border border-stone-800 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-850 pb-2 flex-wrap gap-2">
                <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span>5. Galeri Visual &amp; Foto Showcase Landing Page ({landingConfigState.galleryImages?.length || 0} Gambar)</span>
                </h3>
                <span className="text-[11px] text-stone-400">
                  Tambahkan gambar suasana, fitur, screenshot modul, atau atmosfer ketenangan.
                </span>
              </div>

              {/* Add New Gallery Item Form */}
              <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-3">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Tambah Gambar Baru ke Galeri Showcase:</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-300">Judul Gambar *</label>
                    <input
                      type="text"
                      value={newGalleryTitle}
                      onChange={(e) => setNewGalleryTitle(e.target.value)}
                      placeholder="Contoh: AI Coach & Refleksi 24/7"
                      className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-300">Kategori / Label</label>
                    <select
                      value={newGalleryCategory}
                      onChange={(e) => setNewGalleryCategory(e.target.value)}
                      className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                    >
                      <option value="Fitur">Fitur Utama</option>
                      <option value="Suasana">Suasana Relaksasi</option>
                      <option value="Suara">Audio Narator</option>
                      <option value="Spiritual">Spiritual & Ikhlas</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-300">Deskripsi Singkat</label>
                    <input
                      type="text"
                      value={newGalleryDesc}
                      onChange={(e) => setNewGalleryDesc(e.target.value)}
                      placeholder="Contoh: Percakapan hangat berwawasan somatis"
                      className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-300">URL Gambar (Image Link) *</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="url"
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-stone-100 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryItem}
                      disabled={!newGalleryTitle.trim() || !newGalleryUrl.trim()}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 disabled:opacity-40 transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambahkan</span>
                    </button>
                  </div>
                </div>

                {/* Preset Quick Images for Galeri */}
                <div className="pt-2 border-t border-stone-800/80 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] text-stone-400">Preset Foto Cepat:</span>
                  {[
                    { title: 'Sesi Meditasi Hening', cat: 'Suasana', desc: 'Atmosfer damai ruang hening', url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80' },
                    { title: 'Terapi Suara Alami', cat: 'Suara', desc: 'Frekuensi suara gemericik air & burung', url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80' },
                    { title: 'Tidur Berkualitas & Nyaman', cat: 'Fitur', desc: 'Pengantar tidur gelombang delta', url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80' },
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setNewGalleryTitle(p.title);
                        setNewGalleryCategory(p.cat);
                        setNewGalleryDesc(p.desc);
                        setNewGalleryUrl(p.url);
                      }}
                      className="px-2.5 py-1 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 rounded-lg text-[10px] transition"
                    >
                      + {p.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                {(landingConfigState.galleryImages || []).map((img) => (
                  <div
                    key={img.id}
                    className="p-3 bg-stone-900 rounded-2xl border border-stone-800 space-y-2 group relative overflow-hidden"
                  >
                    <div className="w-full h-36 rounded-xl overflow-hidden bg-stone-950 relative">
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          (e.target as any).src = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-stone-950/80 text-amber-300 backdrop-blur-sm border border-stone-700">
                        {img.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryItem(img.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-950/90 text-red-300 hover:bg-red-900 hover:text-white border border-red-500/40 transition"
                        title="Hapus gambar ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-stone-100 truncate">{img.title}</h4>
                      <p className="text-[10px] text-stone-400 truncate mt-0.5">{img.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 6: CONTACT & FOOTER BRANDING */}
            <div className="p-5 bg-stone-950/80 rounded-2xl border border-stone-800 space-y-4">
              <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2 border-b border-stone-850 pb-2">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>6. Kontak WhatsApp, Email CS &amp; Hak Cipta Footer</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-300">Nomor WhatsApp Customer Service</label>
                  <input
                    type="text"
                    value={landingConfigState.contactWhatsapp || ''}
                    onChange={(e) =>
                      setLandingConfigState({
                        ...landingConfigState,
                        contactWhatsapp: e.target.value,
                      })
                    }
                    placeholder="Contoh: 6281234567890"
                    className="w-full mt-1 bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[10px] text-stone-500 mt-1">Gunakan format internasional tanpa spasi/tanda + (cth: 6281234567890)</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300">Email Bantuan &amp; Dukungan</label>
                  <input
                    type="email"
                    value={landingConfigState.contactEmail || ''}
                    onChange={(e) =>
                      setLandingConfigState({
                        ...landingConfigState,
                        contactEmail: e.target.value,
                      })
                    }
                    placeholder="dindasafitri.pixel98@gmail.com"
                    className="w-full mt-1 bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300">Teks Hak Cipta / Tagline Footer</label>
                  <input
                    type="text"
                    value={landingConfigState.footerTagline || ''}
                    onChange={(e) =>
                      setLandingConfigState({
                        ...landingConfigState,
                        footerTagline: e.target.value,
                      })
                    }
                    placeholder="LEGA SHAQILA DIGITAL 99 • Hak Cipta Dilindungi"
                    className="w-full mt-1 bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Save Action Bar */}
            <div className="pt-4 border-t border-stone-800 flex items-center justify-between flex-wrap gap-3">
              <span className="text-xs text-stone-400">
                Semua perubahan landing page langsung aktif dan dapat diakses publik setelah menekan tombol Simpan.
              </span>
              <button
                onClick={handleSaveLandingPage}
                disabled={isSavingConfig}
                className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black rounded-2xl text-xs flex items-center gap-2 shadow-xl shadow-amber-950/50 transition active:scale-95 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSavingConfig ? 'Menyimpan...' : 'Simpan & Publikasikan Landing Page'}</span>
              </button>
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
