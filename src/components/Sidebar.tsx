import React from 'react';
import {
  LayoutDashboard,
  Bot,
  BrainCircuit,
  Compass,
  BookOpen,
  Sparkles,
  Wind,
  Activity,
  Eye,
  Flame,
  Volume2,
  FileText,
  HeartPulse,
  LineChart,
  User,
  Settings,
  ShieldCheck,
  PhoneCall,
  Menu,
  X,
  Sun,
  HeartHandshake,
  Baby,
  RefreshCw,
  ShieldAlert,
  CloudRain,
  Scale,
  EyeOff,
  AlertTriangle,
  Moon
} from 'lucide-react';
import { ModuleType } from '../types';

interface SidebarProps {
  currentModule: ModuleType;
  onSelectModule: (module: ModuleType) => void;
  isOpenMobile: boolean;
  onToggleMobile: () => void;
  onOpenCrisis: () => void;
}

interface NavItem {
  id: ModuleType;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onSelectModule,
  isOpenMobile,
  onToggleMobile,
  onOpenCrisis
}) => {
  const categories: { title: string; items: NavItem[] }[] = [
    {
      title: 'UTAMA',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'ai-coach', label: 'AI Coach (LEGA)', icon: Bot, badge: 'AI' },
        { id: 'emotion-analysis', label: 'Analisis Emosi', icon: BrainCircuit }
      ]
    },
    {
      title: 'REFLEKSI & AI',
      items: [
        { id: 'self-discovery', label: 'Mengenal Diri', icon: Compass },
        { id: 'gratitude', label: 'LEGA Gratitude', icon: Sun, badge: 'Syukur' },
        { id: 'forgiveness', label: 'LEGA Forgiveness', icon: HeartHandshake, badge: 'Memaafkan' },
        { id: 'inner-child', label: 'LEGA Inner Child', icon: Baby, badge: 'Inner Child' },
        { id: 'overthinking', label: 'LEGA Overthinking', icon: RefreshCw, badge: 'Pikiran' },
        { id: 'anxiety', label: 'LEGA Anxiety', icon: ShieldAlert, badge: 'Cemas' },
        { id: 'stress', label: 'LEGA Stress', icon: Flame, badge: 'Stres' },
        { id: 'anger', label: 'LEGA Anger', icon: Flame, badge: 'Marah' },
        { id: 'sadness', label: 'LEGA Sadness', icon: CloudRain, badge: 'Sedih' },
        { id: 'guilt', label: 'LEGA Guilt', icon: Scale, badge: 'Bersalah' },
        { id: 'shame', label: 'LEGA Shame', icon: EyeOff, badge: 'Malu' },
        { id: 'fear', label: 'LEGA Fear', icon: AlertTriangle, badge: 'Takut' },
        { id: 'life-purpose', label: 'LEGA Life Purpose', icon: Compass, badge: 'Tujuan' },
        { id: 'spiritual-reflection', label: 'LEGA Spiritual', icon: Moon, badge: 'Spiritual' },
        { id: 'journal', label: 'Jurnal Refleksi', icon: BookOpen },
        { id: 'ai-insights', label: 'Insight AI', icon: Sparkles }
      ]
    },
    {
      title: 'LATIHAN & RELAKSASI',
      items: [
        { id: 'mindfulness', label: 'LEGA Presence', icon: Activity },
        { id: 'observer', label: 'LEGA Observer', icon: Eye },
        { id: 'body-awareness', label: 'LEGA Body Awareness', icon: HeartPulse },
        { id: 'breathing', label: 'Latihan Pernapasan', icon: Wind },
        { id: 'emotional-release', label: 'Pelepasan Emosi', icon: Flame },
        { id: 'audio-ai', label: 'Audio AI', icon: Volume2 }
      ]
    },
    {
      title: 'EDUKASI & SOMATIS',
      items: [
        { id: 'mind-body', label: 'Emosi & Kesehatan', icon: HeartPulse },
        { id: 'articles', label: 'Artikel Psikoedukasi', icon: FileText },
        { id: 'progress', label: 'Progress & Statistik', icon: LineChart }
      ]
    },
    {
      title: 'PENGATURAN & LISENSI',
      items: [
        { id: 'profile', label: 'Profil Saya', icon: User },
        { id: 'settings', label: 'Pengaturan', icon: Settings },
        { id: 'admin', label: 'Admin & Lisensi', icon: ShieldCheck }
      ]
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-stone-900 text-stone-200 w-64 border-r border-stone-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-stone-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-900/30">
            L
          </div>
          <div>
            <h1 className="font-bold text-stone-100 tracking-wide text-lg flex items-center gap-1.5">
              LEGA <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/80 text-emerald-300 font-normal">v1.0</span>
            </h1>
            <p className="text-[11px] text-stone-400 truncate">SHAQILA DIGITAL 99</p>
          </div>
        </div>
        <button
          onClick={onToggleMobile}
          className="md:hidden text-stone-400 hover:text-stone-200 p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-stone-800">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-stone-500 tracking-wider">
              {cat.title}
            </p>
            {cat.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectModule(item.id);
                    if (isOpenMobile) onToggleMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 font-semibold shadow-sm'
                      : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-stone-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] rounded font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Crisis Button & Info */}
      <div className="p-3.5 border-t border-stone-800/80 bg-stone-950/40 space-y-2">
        <button
          onClick={onOpenCrisis}
          className="w-full py-2 px-3 bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition"
        >
          <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
          <span>Bantuan Krisis 119</span>
        </button>
        <p className="text-[10px] text-center text-stone-500">
          Powered by Gemini 3.1 & Gemini TTS
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm"
            onClick={onToggleMobile}
          />
          <div className="relative z-50 h-full max-w-xs w-full animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
