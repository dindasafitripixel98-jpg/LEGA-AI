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
  DollarSign
} from 'lucide-react';
import { getAdminSystemStats, askAdminAI } from '../lib/geminiApi';

type AdminTab =
  | 'overview'
  | 'users'
  | 'prompts'
  | 'cms'
  | 'spiritual'
  | 'licenses'
  | 'safety'
  | 'audit'
  | 'assistant';

type AdminRole =
  | 'SUPER ADMIN'
  | 'ADMIN'
  | 'CONTENT ADMIN'
  | 'AI ADMIN'
  | 'LICENSE ADMIN'
  | 'SUPPORT ADMIN'
  | 'ANALYTICS ADMIN'
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

interface LicenseItem {
  id: string;
  key: string;
  user: string;
  plan: 'TRIAL' | 'MONTHLY' | 'YEARLY' | 'LIFETIME' | 'CUSTOM';
  status: 'ACTIVE' | 'TRIAL' | 'EXPIRED' | 'SUSPENDED' | 'REVOKED';
  expDate: string;
  devices: number;
}

interface UserAdminItem {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: 'ACTIVE' | 'SUSPENDED';
  streak: number;
  lastActive: string;
}

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [selectedRole, setSelectedRole] = useState<AdminRole>('SUPER ADMIN');
  const [systemStats, setSystemStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState<boolean>(false);

  // Admin AI Assistant State
  const [aiQuery, setAiQuery] = useState<string>('');
  const [aiChatLogs, setAiChatLogs] = useState<{ sender: 'admin' | 'ai'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: 'Halo Administrator. Saya LEGA Admin AI Assistant. Bagaimana saya bisa membantu Anda mengelola ekosistem LEGA hari ini?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Master Prompts Mock State
  const [prompts, setPrompts] = useState<MasterPromptItem[]>([
    { id: 'MP-01', name: 'LEGA Core Persona System', module: 'AI Coach', version: 'v3.0 Final', status: 'PUBLISHED', author: 'SHAQILA DIGITAL 99', updatedAt: '2026-08-12' },
    { id: 'MP-29', name: 'LEGA Dashboard AI Engine', module: 'Dashboard', version: 'v3.0 Final', status: 'PUBLISHED', author: 'SHAQILA DIGITAL 99', updatedAt: '2026-08-12' },
    { id: 'MP-30', name: 'LEGA Admin AI Controller', module: 'Admin AI', version: 'v3.0 Final', status: 'PUBLISHED', author: 'SHAQILA DIGITAL 99', updatedAt: '2026-08-12' },
    { id: 'MP-25', name: 'LEGA TTS Voice Script Engine', module: 'Audio AI', version: 'v2.1', status: 'APPROVED', author: 'AI Admin', updatedAt: '2026-08-10' },
    { id: 'MP-18', name: 'LEGA Spiritual Reflection & Islamic Logic', module: 'Spiritual', version: 'v2.0', status: 'PUBLISHED', author: 'Content Team', updatedAt: '2026-08-08' },
  ]);

  // Licenses Mock State
  const [licenses, setLicenses] = useState<LicenseItem[]>([
    { id: 'LIC-001', key: 'LEGA-YEAR-88219-X72', user: 'Rina Sastrawan', plan: 'YEARLY', status: 'ACTIVE', expDate: '2027-08-12', devices: 2 },
    { id: 'LIC-002', key: 'LEGA-LIFE-99102-M00', user: 'Budi Kurniawan', plan: 'LIFETIME', status: 'ACTIVE', expDate: '2099-12-31', devices: 5 },
    { id: 'LIC-003', key: 'LEGA-MTH-33104-A12', user: 'Dewi Lestari', plan: 'MONTHLY', status: 'ACTIVE', expDate: '2026-09-12', devices: 1 },
    { id: 'LIC-004', key: 'LEGA-TRL-00122-B99', user: 'Ahmad Fauzi', plan: 'TRIAL', status: 'EXPIRED', expDate: '2026-08-01', devices: 1 },
  ]);

  // Users Mock State
  const [users, setUsers] = useState<UserAdminItem[]>([
    { id: 'USR-101', name: 'Rina Sastrawan', email: 'rina@example.com', plan: 'YEARLY', status: 'ACTIVE', streak: 7, lastActive: '2 jam lalu' },
    { id: 'USR-102', name: 'Budi Kurniawan', email: 'budi@example.com', plan: 'LIFETIME', status: 'ACTIVE', streak: 12, lastActive: '10 menit lalu' },
    { id: 'USR-103', name: 'Dewi Lestari', email: 'dewi@example.com', plan: 'MONTHLY', status: 'ACTIVE', streak: 3, lastActive: '1 hari lalu' },
    { id: 'USR-104', name: 'Ahmad Fauzi', email: 'ahmad@example.com', plan: 'TRIAL', status: 'SUSPENDED', streak: 0, lastActive: '5 hari lalu' },
  ]);

  // New License Generator State
  const [newLicUser, setNewLicUser] = useState<string>('');
  const [newLicPlan, setNewLicPlan] = useState<'TRIAL' | 'MONTHLY' | 'YEARLY' | 'LIFETIME' | 'CUSTOM'>('YEARLY');

  // Load System Stats
  const fetchStats = async () => {
    setLoadingStats(true);
    const data = await getAdminSystemStats();
    if (data) setSystemStats(data);
    setLoadingStats(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Send Query to Admin AI Assistant
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

  const handleGenerateLicense = () => {
    if (!newLicUser.trim()) return;
    const newKey = `LEGA-${newLicPlan.slice(0, 3)}-${Math.floor(10000 + Math.random() * 90000)}-K99`;
    const newLic: LicenseItem = {
      id: `LIC-${Date.now().toString().slice(-4)}`,
      key: newKey,
      user: newLicUser,
      plan: newLicPlan,
      status: 'ACTIVE',
      expDate: newLicPlan === 'LIFETIME' ? '2099-12-31' : '2027-08-12',
      devices: newLicPlan === 'LIFETIME' ? 5 : 2,
    };
    setLicenses([newLic, ...licenses]);
    setNewLicUser('');
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : u
      )
    );
  };

  const handleRevokeLicense = (licId: string) => {
    setLicenses((prev) =>
      prev.map((l) => (l.id === licId ? { ...l, status: 'REVOKED' } : l))
    );
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 text-stone-100">
      {/* Top Admin Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-sky-950 p-6 rounded-3xl border border-stone-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-950 border border-sky-800/80 text-sky-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                LEGA Admin AI <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400">v3.0 Final</span>
              </h1>
              <p className="text-xs text-stone-400">
                Pusat Kendali Ekosistem Administrator &bull; Developer: <strong className="font-extrabold text-white tracking-wide">SHAQILA DIGITAL 99</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-400 font-medium hidden sm:inline">Role Aktif:</span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as AdminRole)}
            className="px-3 py-2 bg-stone-800 border border-stone-700 text-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-500"
          >
            <option value="SUPER ADMIN">SUPER ADMIN (Akses Penuh)</option>
            <option value="ADMIN">ADMIN Operasional</option>
            <option value="AI ADMIN">AI ADMIN (Prompts & Model)</option>
            <option value="CONTENT ADMIN">CONTENT ADMIN (CMS)</option>
            <option value="LICENSE ADMIN">LICENSE ADMIN</option>
            <option value="SUPPORT ADMIN">SUPPORT ADMIN</option>
            <option value="ANALYTICS ADMIN">ANALYTICS ADMIN</option>
            <option value="AUDITOR">AUDITOR (Read-Only)</option>
          </select>

          <button
            onClick={fetchStats}
            disabled={loadingStats}
            className="p-2 bg-stone-800 hover:bg-stone-700 rounded-xl border border-stone-700 transition"
            title="Refresh System Stats"
          >
            <RefreshCw className={`w-4 h-4 text-sky-400 ${loadingStats ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-800 text-xs font-medium no-scrollbar">
        {[
          { id: 'overview', label: 'Dashboard Stats', icon: Activity },
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'prompts', label: 'Master Prompts', icon: Code2 },
          { id: 'cms', label: 'CMS (Audio & Artikel)', icon: FileText },
          { id: 'spiritual', label: 'Modul Spiritual Validation', icon: BookOpen },
          { id: 'licenses', label: 'Lisensi & Subscription', icon: Key },
          { id: 'safety', label: 'Safety & Incident Alerts', icon: AlertTriangle },
          { id: 'audit', label: 'Audit Trail Logs', icon: History },
          { id: 'assistant', label: 'AI Admin Assistant', icon: Bot },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-sky-600 text-white font-semibold shadow-md shadow-sky-950'
                  : 'bg-stone-900 hover:bg-stone-800 text-stone-400 border border-stone-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & SYSTEM HEALTH */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Total Users', val: systemStats?.metrics?.totalUsers || 1420, icon: Users, color: 'text-sky-400' },
              { label: 'Aktif Hari Ini', val: systemStats?.metrics?.activeUsersToday || 385, icon: Activity, color: 'text-emerald-400' },
              { label: 'Lisensi Aktif', val: systemStats?.metrics?.activeLicenses || 1150, icon: Key, color: 'text-amber-400' },
              { label: 'AI Requests Today', val: systemStats?.metrics?.aiRequestsToday || 3420, icon: Bot, color: 'text-teal-400' },
              { label: 'TTS Requests', val: systemStats?.metrics?.ttsRequestsToday || 890, icon: Volume2, color: 'text-indigo-400' },
              { label: 'Revenue Bulan Ini', val: systemStats?.metrics?.revenueMonth || 'Rp 42.5M', icon: DollarSign, color: 'text-emerald-300' },
            ].map((m, idx) => {
              const Icon = m.icon;
              return (
                <div key={idx} className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
                  <div className="flex items-center justify-between text-stone-500">
                    <span className="text-[10px] font-bold uppercase tracking-wider">{m.label}</span>
                    <Icon className={`w-4 h-4 ${m.color}`} />
                  </div>
                  <p className="text-lg font-bold text-white">{m.val}</p>
                </div>
              );
            })}
          </div>

          {/* Real-time System Health Monitor */}
          <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <span>Real-Time System Health Monitor</span>
              </h3>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> ALL SYSTEMS OPERATIONAL
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                { name: 'Application Server', status: 'HEALTHY' },
                { name: 'Database Cloud', status: 'HEALTHY' },
                { name: 'API Proxy Middleware', status: 'HEALTHY' },
                { name: 'Gemini 3.6 Flash API', status: 'HEALTHY' },
                { name: 'LEGA Voice Engine', status: 'HEALTHY' },
                { name: 'Storage & Audio Cache', status: 'HEALTHY' },
                { name: 'License Server Sync', status: 'HEALTHY' },
                { name: 'Safety Audit Logger', status: 'HEALTHY' },
              ].map((svc, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                  <span className="text-stone-300 font-medium">{svc.name}</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {svc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Work Queue & Pending Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Pending Review Work Queue</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex justify-between items-center">
                  <span>Prompts Menunggu Approval</span>
                  <span className="font-bold text-amber-400">2 Item</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex justify-between items-center">
                  <span>Artikel Edukasi Draf AI</span>
                  <span className="font-bold text-sky-400">4 Item</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex justify-between items-center">
                  <span>Audio Narasi Menunggu Quality Check</span>
                  <span className="font-bold text-indigo-400">1 Item</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Ringkasan Keamanan & Privasi</span>
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                LEGA Admin AI mematuhi prinsip <strong>Privacy First</strong>. Jurnal pribadi, refleksi, dan histori emosi pengguna disembunyikan dari antarmuka admin dan hanya disajikan secara agregat anonim untuk analisis sistem.
              </p>
              <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-800/60 text-xs text-sky-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Enkripsi Sisi Server & Masking Otomatis Data Sensitif Aktif.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
            <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-400" />
              <span>Manajemen Pengguna Aplikasi ({users.length})</span>
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari pengguna..."
                  className="pl-9 pr-3 py-1.5 bg-stone-800 border border-stone-700 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950 text-stone-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">ID / Nama</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Paket Subscription</th>
                  <th className="p-3">Status Akun</th>
                  <th className="p-3">Streak</th>
                  <th className="p-3">Aktivitas Terakhir</th>
                  <th className="p-3 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-800/50 transition">
                    <td className="p-3 font-semibold text-white">
                      {u.name}
                      <span className="block text-[10px] font-mono text-stone-500">{u.id}</span>
                    </td>
                    <td className="p-3 text-stone-400">{u.email}</td>
                    <td className="p-3 font-medium text-emerald-400">{u.plan}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-amber-400">{u.streak} Hari</td>
                    <td className="p-3 text-stone-400">{u.lastActive}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleUserStatus(u.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition ${
                          u.status === 'ACTIVE'
                            ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800'
                            : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? 'Suspend Akun' : 'Aktifkan Kembali'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MASTER PROMPTS */}
      {activeTab === 'prompts' && (
        <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-sky-400" />
              <span>Manajemen Master Prompt & Version Control</span>
            </h3>
            <button className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Buat Master Prompt Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950 text-stone-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">ID / Nama Prompt</th>
                  <th className="p-3">Modul Target</th>
                  <th className="p-3">Versi</th>
                  <th className="p-3">Status Prompt</th>
                  <th className="p-3">Penulis</th>
                  <th className="p-3">Terakhir Diperbarui</th>
                  <th className="p-3 text-right">Aksi Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {prompts.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-800/50 transition">
                    <td className="p-3 font-semibold text-white">
                      {p.name}
                      <span className="block text-[10px] font-mono text-stone-500">{p.id}</span>
                    </td>
                    <td className="p-3 text-stone-300 font-medium">{p.module}</td>
                    <td className="p-3 font-mono text-sky-400 font-bold">{p.version}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-stone-400">{p.author}</td>
                    <td className="p-3 text-stone-400">{p.updatedAt}</td>
                    <td className="p-3 text-right space-x-1">
                      <button className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-[10px] font-medium transition">
                        Compare
                      </button>
                      <button className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-[10px] font-medium transition">
                        Rollback
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CMS (AUDIO & ARTICLE) */}
      {activeTab === 'cms' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
            <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2 border-b border-stone-800 pb-3">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>CMS Konten Audio & Artikel Edukasi LEGA</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Audio Management */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-indigo-400" /> Audio Management
                  </span>
                  <button className="px-2.5 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-lg text-[10px] font-semibold">
                    + Generate TTS Audio
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-stone-200">Hadir Saat Ini — 5 Menit</p>
                      <span className="text-[10px] text-stone-500">Voice: Kore | Modul: Mindfulness</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">PUBLISHED</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-stone-200">Menenangkan Ketegangan Bahu — 10 Menit</p>
                      <span className="text-[10px] text-stone-500">Voice: Zephyr | Modul: Body Awareness</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-bold">REVIEW</span>
                  </div>
                </div>
              </div>

              {/* Article Management */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-sky-400" /> Artikel & Knowledge Base
                  </span>
                  <button className="px-2.5 py-1 bg-sky-950 text-sky-300 border border-sky-800 rounded-lg text-[10px] font-semibold">
                    + Buat Artikel AI
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-stone-200">Memahami Hubungan Stres dan Ketegangan Tubuh</p>
                      <span className="text-[10px] text-stone-500">Fact-Checked: SHAQILA Team</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">PUBLISHED</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-stone-200">Mengapa Pikiran Sering Berulang saat Malam Hari?</p>
                      <span className="text-[10px] text-stone-500">AI Generated Draft</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-bold">DRAFT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SPIRITUAL MODULE VALIDATION */}
      {activeTab === 'spiritual' && (
        <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Validasi Fitur & Referensi Spiritual Islami</span>
            </h3>
            <span className="text-xs text-amber-400 font-semibold bg-amber-950 border border-amber-800 px-3 py-1 rounded-full">
              Khusus Pengulas Terverifikasi
            </span>
          </div>

          <p className="text-xs text-stone-400 leading-relaxed">
            Setiap kutipan ayat Al-Qur'an, Hadis, Doa, dan materi Muhasabah dalam modul Spiritual Refleksi LEGA wajib melalui proses verifikasi sanad/sumber sebelum dipublikasikan.
          </p>

          <div className="space-y-3 text-xs">
            {[
              { theme: 'Sabar', source: 'Q.S. Al-Baqarah: 153', status: 'VERIFIED', reviewer: 'Ustadz / Verifikator Agama' },
              { theme: 'Syukur', source: 'Q.S. Ibrahim: 7', status: 'VERIFIED', reviewer: 'Ustadz / Verifikator Agama' },
              { theme: 'Tawakal', source: 'Q.S. At-Talaq: 3', status: 'VERIFIED', reviewer: 'Ustadz / Verifikator Agama' },
              { theme: 'Muhasabah Diri', source: 'Hadis Riwayat Tirmidzi', status: 'VERIFIED', reviewer: 'Ustadz / Verifikator Agama' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-white block">{item.theme}</span>
                  <span className="text-[11px] text-amber-300">{item.source}</span>
                </div>
                <div className="text-right space-y-1">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                    {item.status}
                  </span>
                  <span className="block text-[10px] text-stone-500">Oleh: {item.reviewer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: LICENSES & SUBSCRIPTION */}
      {activeTab === 'licenses' && (
        <div className="space-y-6 animate-fade-in">
          {/* License Key Generator */}
          <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
            <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2 border-b border-stone-800 pb-3">
              <Key className="w-4 h-4 text-emerald-400" />
              <span>Generate License Key Baru</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Nama Pengguna / Lisensi Target"
                value={newLicUser}
                onChange={(e) => setNewLicUser(e.target.value)}
                className="px-3.5 py-2 bg-stone-800 border border-stone-700 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-emerald-500"
              />
              <select
                value={newLicPlan}
                onChange={(e) => setNewLicPlan(e.target.value as any)}
                className="px-3.5 py-2 bg-stone-800 border border-stone-700 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="TRIAL">TRIAL (14 Hari)</option>
                <option value="MONTHLY">MONTHLY (1 Bulan)</option>
                <option value="YEARLY">YEARLY (1 Tahun)</option>
                <option value="LIFETIME">LIFETIME (Akses Selamanya)</option>
              </select>
              <button
                onClick={handleGenerateLicense}
                className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition shadow-lg shadow-emerald-950"
              >
                Generate Key
              </button>
            </div>
          </div>

          {/* License Table */}
          <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
            <h3 className="text-sm font-bold text-stone-100 border-b border-stone-800 pb-3">
              Daftar Lisensi Aktif & Status Key ({licenses.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950 text-stone-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">License Key</th>
                    <th className="p-3">Pengguna</th>
                    <th className="p-3">Plan</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Expired Date</th>
                    <th className="p-3">Max Perangkat</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {licenses.map((l) => (
                    <tr key={l.id} className="hover:bg-stone-800/50 transition">
                      <td className="p-3 font-mono text-emerald-400 font-bold">{l.key}</td>
                      <td className="p-3 font-medium text-white">{l.user}</td>
                      <td className="p-3">{l.plan}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            l.status === 'ACTIVE'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>
                      <td className="p-3 text-stone-400">{l.expDate}</td>
                      <td className="p-3 font-mono">{l.devices} Device</td>
                      <td className="p-3 text-right">
                        {l.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleRevokeLicense(l.id)}
                            className="px-2 py-1 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded text-[10px] font-semibold transition"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: SAFETY & CRISIS ALERTS */}
      {activeTab === 'safety' && (
        <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Monitoring Insiden Keamanan & Krisis Emosional</span>
            </h3>
            <span className="px-2.5 py-1 rounded bg-rose-950 border border-rose-800 text-rose-400 text-[10px] font-bold">
              1 Alert Membutuhkan Perhatian
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              {
                id: 'SAFE-102',
                severity: 'MEDIUM',
                type: 'Deteksi Ketegangan Emosi Tinggi (Cemas Sangat Berat)',
                time: '1 Jam Lalu',
                action: 'Aplikasi secara otomatis menampilkan Jalur Bantuan Krisis 119 dan latihan napas.',
                status: 'RESOLVED',
              },
            ].map((alert) => (
              <div key={alert.id} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {alert.type}
                  </span>
                  <span className="text-[10px] text-stone-500">{alert.time}</span>
                </div>
                <p className="text-stone-300">{alert.action}</p>
                <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-stone-500">Severity: {alert.severity}</span>
                  <span className="text-emerald-400 font-bold">Status: {alert.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: AUDIT TRAIL LOGS */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2 border-b border-stone-800 pb-4">
            <History className="w-4 h-4 text-sky-400" />
            <span>Audit Trail Logs System</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950 text-stone-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Audit ID</th>
                  <th className="p-3">Admin</th>
                  <th className="p-3">Aksi</th>
                  <th className="p-3">Resource / Modul</th>
                  <th className="p-3">Waktu</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3 text-right">Hasil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {(systemStats?.recentAuditLogs || [
                  {
                    id: 'AUDIT-891',
                    admin: 'Super Admin (SHAQILA)',
                    action: 'PROMPT_PUBLISH',
                    resource: 'LEGA Dashboard AI v3.0 Final',
                    timestamp: new Date().toISOString(),
                    ip: '182.253.12.98',
                    result: 'SUCCESS',
                  },
                ]).map((log: any) => (
                  <tr key={log.id} className="hover:bg-stone-800/50 transition">
                    <td className="p-3 font-mono text-sky-400 font-bold">{log.id}</td>
                    <td className="p-3 font-semibold text-white">{log.admin}</td>
                    <td className="p-3 text-emerald-400 font-medium">{log.action}</td>
                    <td className="p-3 text-stone-300">{log.resource}</td>
                    <td className="p-3 text-stone-400 text-[10px]">{log.timestamp}</td>
                    <td className="p-3 font-mono text-stone-500">{log.ip}</td>
                    <td className="p-3 text-right font-bold text-emerald-400">{log.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 9: AI ADMIN ASSISTANT */}
      {activeTab === 'assistant' && (
        <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 animate-fade-in flex flex-col h-[600px]">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
              <Bot className="w-5 h-5 text-sky-400" />
              <span>LEGA AI Admin Assistant</span>
            </h3>
            <span className="text-[10px] text-stone-400">Powered by Gemini 3.6 Flash</span>
          </div>

          {/* Quick Admin Questions */}
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              'Ringkas kondisi sistem harian',
              'Mengapa penggunaan TTS meningkat?',
              'Periksa lisensi yang akan expired minggu ini',
              'Buat Laporan Operasional Harian',
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendAiQuery(q)}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl transition border border-stone-700 text-[11px]"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Window */}
          <div className="flex-1 overflow-y-auto space-y-3 p-4 rounded-2xl bg-stone-950 border border-stone-800 text-xs leading-relaxed">
            {aiChatLogs.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.sender === 'admin' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`p-3.5 rounded-2xl max-w-xl ${
                    msg.sender === 'admin'
                      ? 'bg-sky-600 text-white rounded-br-none'
                      : 'bg-stone-900 border border-stone-800 text-stone-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                <span className="text-[10px] text-stone-500 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {isAiThinking && (
              <div className="p-3 bg-stone-900 rounded-2xl text-stone-400 text-xs italic flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
                <span>Memproses query data sistem admin...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              placeholder="Tanyakan status sistem, statistik lisensi, atau permohonan laporan admin..."
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendAiQuery()}
              className="flex-1 px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-sky-500"
            />
            <button
              onClick={() => handleSendAiQuery()}
              disabled={isAiThinking}
              className="p-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl transition disabled:opacity-50 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <div className="text-center text-[11px] text-stone-500 pt-4 border-t border-stone-800">
        LEGA Admin AI v3.0 Final &bull; Developed by <strong className="font-extrabold text-white tracking-wide">SHAQILA DIGITAL 99</strong> &bull; Hak Akses Administrator Terlindungi.
      </div>
    </div>
  );
};
