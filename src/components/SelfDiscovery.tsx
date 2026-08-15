import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  CheckCircle,
  Check,
  HelpCircle,
  Sparkles,
  PieChart,
  Save,
  RotateCcw,
  BookOpen,
  Copy,
  Download,
  Plus,
  Trash2,
  ArrowRight,
  TrendingUp,
  Heart,
  Shield,
  Lightbulb,
  Layers,
  Flame,
  Feather,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { SELF_DISCOVERY_QUESTIONS } from '../data/initialData';
import { SelfDiscoveryItem, ModuleType, JournalEntry, UserProfile } from '../types';
import { VoiceGuideButton } from './VoiceGuideButton';
import { reflectSelfDiscovery } from '../lib/geminiApi';

interface SelfDiscoveryProps {
  onSelectModule?: (module: ModuleType) => void;
  onAddJournal?: (journal: JournalEntry) => void;
  userProfile?: UserProfile;
}

const STORAGE_KEY_ITEMS = 'lega_self_discovery_items';
const STORAGE_KEY_WHEEL = 'lega_self_discovery_wheel';
const STORAGE_KEY_LAST_SAVED = 'lega_self_discovery_last_saved';
const STORAGE_KEY_INSIGHT = 'lega_self_discovery_ai_insight';

const DEFAULT_WHEEL_SCORES: Record<string, number> = {
  'Kedamaian Batin': 7,
  'Kesehatan Fisik & Energi': 6,
  'Regulasi Emosi': 5,
  'Kualitas Hubungan': 8,
  'Pertumbuhan Diri & Belajar': 7,
  'Keseimbangan Kerja & Waktu': 6,
  'Integritas & Nilai Hidup': 8,
  'Ruang Diri & Istirahat': 5,
};

const EXPANDED_DEFAULT_QUESTIONS: SelfDiscoveryItem[] = [
  ...SELF_DISCOVERY_QUESTIONS,
  {
    id: 'sd-5',
    category: 'kelebihan',
    title: 'Batasan Diri (Boundaries) & Hubungan',
    question: 'Di area hubungan apa kamu merasa paling sulit berkata "tidak", dan apa kekhawatiran batin yang mendasarinya?',
    reflectionNote: 'Mengetahui batasan diri adalah bentuk perlindungan diri tanpa harus menutup hati.'
  },
  {
    id: 'sd-6',
    category: 'kelebihan',
    title: 'Kualitas Diri & Daya Lenting (Resilience)',
    question: 'Kekuatan batin atau kualitas diri apa yang paling kamu syukuri telah membantumu melewati masa-masa sulit sebelumnya?',
    reflectionNote: 'Mengingat ketahanan masa lalu mengingatkan bahwa kita memiliki sumber daya internal.'
  },
  {
    id: 'sd-7',
    category: 'pola-pikir',
    title: 'Dialog Internal & Kelembutan Diri',
    question: 'Ketika kamu membuat kesalahan kecil, bagaimana nada bicara suara batinmu? Apakah cenderung mengkritik tajam atau memaklumi?',
    reflectionNote: 'Suara batin yang penuh welas asih mempercepat pemulihan daripada kritik yang menghukum.'
  },
  {
    id: 'sd-8',
    category: 'nilai-hidup',
    title: 'Visi Ketenangan Hidup Sederhana',
    question: 'Jika hidupmu selaras dengan kedamaian batin, seperti apa satu hari ideal sederhana yang ingin kamu jalani?',
    reflectionNote: 'Kejelasan visi membantu kita mengambil keputusan harian yang sejalan dengan ketenangan.'
  }
];

export const SelfDiscovery: React.FC<SelfDiscoveryProps> = ({
  onSelectModule,
  onAddJournal,
  userProfile
}) => {
  // Load saved state from localStorage or fallback
  const [items, setItems] = useState<SelfDiscoveryItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_ITEMS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Merge with default questions to ensure new questions are present
            const existingIds = new Set(parsed.map((p: any) => p.id));
            const merged = [...parsed];
            EXPANDED_DEFAULT_QUESTIONS.forEach((defQ) => {
              if (!existingIds.has(defQ.id)) {
                merged.push(defQ);
              }
            });
            return merged;
          }
        }
      } catch (e) {
        console.warn('Error reading self-discovery items from localStorage:', e);
      }
    }
    return EXPANDED_DEFAULT_QUESTIONS;
  });

  const [wheelScores, setWheelScores] = useState<Record<string, number>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_WHEEL);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            return { ...DEFAULT_WHEEL_SCORES, ...parsed };
          }
        }
      } catch (e) {
        console.warn('Error reading wheel scores from localStorage:', e);
      }
    }
    return DEFAULT_WHEEL_SCORES;
  });

  const [lastSavedTime, setLastSavedTime] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem(STORAGE_KEY_LAST_SAVED);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [aiInsight, setAiInsight] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_INSIGHT);
        if (saved) return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Track active answers in a local map initialized with items' userAnswer
  const [activeAnswers, setActiveAnswers] = useState<Record<string, string>>(() => {
    const initialMap: Record<string, string> = {};
    items.forEach((it) => {
      if (it.userAnswer) {
        initialMap[it.id] = it.userAnswer;
      }
    });
    return initialMap;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savedJournalSuccess, setSavedJournalSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // New Custom Question Form
  const [customTitle, setCustomTitle] = useState('');
  const [customQuestion, setCustomQuestion] = useState('');
  const [customCategory, setCustomCategory] = useState<'pola-pikir' | 'pemicu' | 'nilai-hidup' | 'kebutuhan' | 'kelebihan'>('pola-pikir');
  const [customNote, setCustomNote] = useState('');

  // Synchronize active answers with items if items change externally
  useEffect(() => {
    setActiveAnswers((prev) => {
      const updated = { ...prev };
      items.forEach((it) => {
        if (it.userAnswer && !updated[it.id]) {
          updated[it.id] = it.userAnswer;
        }
      });
      return updated;
    });
  }, [items]);

  // Handle answer change with auto-draft sync
  const handleAnswerChange = (id: string, text: string) => {
    setActiveAnswers((prev) => {
      const next = { ...prev, [id]: text };
      // Save draft immediately to localStorage so no keystrokes are lost
      try {
        const updatedItems = items.map((item) => ({
          ...item,
          userAnswer: item.id === id ? text : (next[item.id] ?? item.userAnswer ?? '')
        }));
        localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(updatedItems));
      } catch (err) {
        console.warn('Draft auto-save warning:', err);
      }
      return next;
    });
  };

  // Handle wheel score change with auto-draft sync
  const handleWheelChange = (key: string, val: number) => {
    setWheelScores((prev) => {
      const next = { ...prev, [key]: val };
      try {
        localStorage.setItem(STORAGE_KEY_WHEEL, JSON.stringify(next));
      } catch (err) {
        console.warn('Wheel draft auto-save warning:', err);
      }
      return next;
    });
  };

  // Explicit Save All functionality
  const handleSaveAll = () => {
    const updatedItems = items.map((item) => ({
      ...item,
      userAnswer: activeAnswers[item.id] !== undefined ? activeAnswers[item.id] : (item.userAnswer || ''),
    }));

    setItems(updatedItems);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + ' WIB';

    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(updatedItems));
      localStorage.setItem(STORAGE_KEY_WHEEL, JSON.stringify(wheelScores));
      localStorage.setItem(STORAGE_KEY_LAST_SAVED, formattedDate);
      setLastSavedTime(formattedDate);
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  // Save full reflection & wheel assessment to LEGA Journal
  const handleSaveToJournal = () => {
    if (!onAddJournal) return;

    const answeredList = items
      .filter((it) => (activeAnswers[it.id] || it.userAnswer || '').trim().length > 0)
      .map((it, idx) => `${idx + 1}. **${it.title}**\n*Pertanyaan:* ${it.question}\n*Refleksi:* ${activeAnswers[it.id] || it.userAnswer}`);

    const wheelSummary = Object.entries(wheelScores)
      .map(([area, score]) => `- ${area}: ${score}/10`)
      .join('\n');

    const fullContent = `### Refleksi Eksplorasi Mengenal Diri (Self Discovery)\n\n**Roda Keseimbangan Kesadaran Diri (Rata-rata: ${averageScore}/10):**\n${wheelSummary}\n\n**Catatan Refleksi Batin:**\n${
      answeredList.length > 0 ? answeredList.join('\n\n') : 'Belum ada catatan pertanyaan yang terisi detail.'
    }${aiInsight?.summary ? `\n\n**Sintesis Wawasan AI LEGA:**\n"${aiInsight.summary}"` : ''}`;

    const journalEntry: JournalEntry = {
      id: `sd-journal-${Date.now()}`,
      title: `Refleksi Mengenal Diri & Keseimbangan Batin (${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })})`,
      content: fullContent,
      date: new Date().toISOString().split('T')[0],
      mood: 'tenang',
      tags: ['Mengenal Diri', 'Roda Keseimbangan', 'Eksplorasi Batin', 'Nilai Hidup'],
      aiFeedback: aiInsight?.summary
        ? {
            reflection: aiInsight.summary,
            keyInsight: aiInsight.keyStrengths?.[0] || 'Keberanian hadir jujur bagi diri sendiri adalah awal kedamaian sejati.',
            gentleSuggestion: aiInsight.actionAffirmation || 'Rawat area yang sedang membutuhkan pemulihan dengan penuh kelembutan.'
          }
        : undefined
    };

    onAddJournal(journalEntry);
    setSavedJournalSuccess(true);
    setTimeout(() => setSavedJournalSuccess(false), 4000);
  };

  // Generate AI Insight
  const handleGenerateAiInsight = async () => {
    setLoadingAi(true);
    try {
      const mergedItems = items.map((item) => ({
        ...item,
        userAnswer: activeAnswers[item.id] !== undefined ? activeAnswers[item.id] : (item.userAnswer || '')
      }));

      const res = await reflectSelfDiscovery({
        items: mergedItems,
        wheelScores,
        userProfile
      });

      if (res) {
        setAiInsight(res);
        try {
          localStorage.setItem(STORAGE_KEY_INSIGHT, JSON.stringify(res));
        } catch (e) {
          console.warn('Saving AI insight error:', e);
        }
      }
    } catch (err) {
      console.error('AI insight generation failed:', err);
    } finally {
      setLoadingAi(false);
    }
  };

  // Copy all reflection to clipboard
  const handleCopyReflection = () => {
    const formatted = `=== REFLEKSI MENGENAL DIRI (LEGA SELF DISCOVERY) ===\nTanggal: ${lastSavedTime || new Date().toLocaleDateString('id-ID')}\n\n[RODA KESEIMBANGAN HIDUP]\n${Object.entries(wheelScores).map(([k, v]) => `- ${k}: ${v}/10`).join('\n')}\n\n[JAWABAN PERTANYAAN REFLEKSI]\n${items.map((it, i) => `${i + 1}. ${it.title} (${it.category})\nTanya: ${it.question}\nJawab: ${activeAnswers[it.id] || it.userAnswer || '(Belum dijawab)'}\n`).join('\n')}${aiInsight?.summary ? `\n[WAWASAN AI LEGA]\n${aiInsight.summary}` : ''}`;

    navigator.clipboard.writeText(formatted).then(() => {
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 3000);
    });
  };

  // Export as text file
  const handleExportText = () => {
    const formatted = `=== REFLEKSI MENGENAL DIRI (LEGA SELF DISCOVERY) ===\nTanggal: ${lastSavedTime || new Date().toLocaleDateString('id-ID')}\n\n[RODA KESEIMBANGAN HIDUP]\n${Object.entries(wheelScores).map(([k, v]) => `- ${k}: ${v}/10`).join('\n')}\n\n[JAWABAN PERTANYAAN REFLEKSI]\n${items.map((it, i) => `${i + 1}. ${it.title} (${it.category})\nTanya: ${it.question}\nJawab: ${activeAnswers[it.id] || it.userAnswer || '(Belum dijawab)'}\n`).join('\n')}${aiInsight?.summary ? `\n[WAWASAN AI LEGA]\n${aiInsight.summary}` : ''}`;

    const blob = new Blob([formatted], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LEGA-Mengenal-Diri-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Add custom question
  const handleAddCustomQuestion = () => {
    if (!customTitle.trim() || !customQuestion.trim()) return;

    const newItem: SelfDiscoveryItem = {
      id: `custom-sd-${Date.now()}`,
      category: customCategory,
      title: customTitle.trim(),
      question: customQuestion.trim(),
      reflectionNote: customNote.trim() || 'Pertanyaan refleksi personal yang Anda buat sendiri.'
    };

    const updated = [...items, newItem];
    setItems(updated);
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error saving added custom item:', e);
    }

    setCustomTitle('');
    setCustomQuestion('');
    setCustomNote('');
    setShowAddCustomModal(false);
  };

  // Delete custom question
  const handleDeleteItem = (id: string) => {
    const updated = items.filter((it) => it.id !== id);
    setItems(updated);
    setActiveAnswers((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error saving deleted item state:', e);
    }
  };

  // Reset all to defaults
  const handleResetToDefaults = () => {
    setItems(EXPANDED_DEFAULT_QUESTIONS);
    setWheelScores(DEFAULT_WHEEL_SCORES);
    setActiveAnswers({});
    setAiInsight(null);
    setLastSavedTime(null);

    try {
      localStorage.removeItem(STORAGE_KEY_ITEMS);
      localStorage.removeItem(STORAGE_KEY_WHEEL);
      localStorage.removeItem(STORAGE_KEY_LAST_SAVED);
      localStorage.removeItem(STORAGE_KEY_INSIGHT);
    } catch (e) {
      console.warn('Error clearing storage:', e);
    }

    setShowResetConfirm(false);
  };

  // Analytics for the wheel of life
  const wheelEntries = Object.entries(wheelScores) as [string, number][];
  const averageScore = useMemo(() => {
    if (wheelEntries.length === 0) return 0;
    const sum = wheelEntries.reduce((acc, [, score]) => acc + Number(score), 0);
    return Number((sum / wheelEntries.length).toFixed(1));
  }, [wheelEntries]);

  const strongestDimension = useMemo(() => {
    if (wheelEntries.length === 0) return null;
    return [...wheelEntries].sort((a, b) => Number(b[1]) - Number(a[1]))[0];
  }, [wheelEntries]);

  const growthDimension = useMemo(() => {
    if (wheelEntries.length === 0) return null;
    return [...wheelEntries].sort((a, b) => Number(a[1]) - Number(b[1]))[0];
  }, [wheelEntries]);

  // Filtered items
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return items;
    return items.filter((it) => it.category === selectedCategory);
  }, [items, selectedCategory]);

  const answeredCount = items.filter((it) => (activeAnswers[it.id] || it.userAnswer || '').trim().length > 0).length;
  const answeredPercentage = Math.round((answeredCount / (items.length || 1)) * 100);

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-8 text-stone-100 animate-fade-in pb-16">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-xl">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-stone-100 flex items-center gap-2">
                <span>Mengenal Diri (Self Discovery)</span>
              </h2>
              <p className="text-xs md:text-sm text-stone-400">
                Refleksi terpadu untuk mengenali pola pikir, pemicu utama, nilai hidup, dan roda keseimbangan batinmu.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <VoiceGuideButton
            text="Selamat datang di modul Mengenal Diri LEGA. Perjalanan mengenal diri adalah fondasi kedamaian sejati. Luangkan waktu untuk menilai roda keseimbangan hidup Anda dan renungkan pertanyaan batin berikut dengan kejujuran dan welas asih pada diri sendiri. Semua jawaban dan skor Anda tersimpan aman dan privat di perangkat Anda."
            title="Panduan Mengenal Diri LEGA"
            subtitle="Refleksi Eksplorasi Batin"
            variant="pill"
          />

          <button
            onClick={handleCopyReflection}
            className="px-3 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 rounded-xl text-xs font-medium transition flex items-center gap-1.5"
            title="Salin semua refleksi"
          >
            {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
            <span>{copiedSuccess ? 'Tersalin' : 'Salin'}</span>
          </button>

          <button
            onClick={handleExportText}
            className="px-3 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 rounded-xl text-xs font-medium transition flex items-center gap-1.5"
            title="Ekspor sebagai berkas teks"
          >
            <Download className="w-3.5 h-3.5 text-stone-400" />
            <span className="hidden sm:inline">Ekspor</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="p-2 bg-stone-900 hover:bg-red-950/40 border border-stone-800 hover:border-red-800/60 text-stone-400 hover:text-red-300 rounded-xl text-xs transition"
            title="Muat ulang ke pertanyaan bawaan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Save Status & Persistence Notification Banner */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-600/80 rounded-2xl flex items-center justify-between gap-3 shadow-lg shadow-emerald-950/50 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs md:text-sm font-bold text-emerald-200">
                Seluruh Refleksi Diri & Roda Keseimbangan Berhasil Disimpan!
              </p>
              <p className="text-[11px] text-emerald-300/80">
                Data tersimpan secara permanen di penyimpanan lokal perangkat Anda. Tidak akan hilang saat Anda berpindah modul atau membuka ulang aplikasi.
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-900 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-700 font-semibold whitespace-nowrap">
            Tersimpan Aman
          </span>
        </div>
      )}

      {/* Progress & Last Saved Status Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-medium text-stone-400">Progres Refleksi Terisi</span>
            <p className="text-lg font-bold text-emerald-400">{answeredCount} dari {items.length} Pertanyaan</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-stone-800/80 border border-stone-700 flex items-center justify-center text-xs font-bold text-emerald-300">
            {answeredPercentage}%
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-medium text-stone-400">Rata-Rata Keseimbangan</span>
            <p className="text-lg font-bold text-teal-400">{averageScore} / 10</p>
          </div>
          <div className="p-2.5 bg-teal-950/70 border border-teal-800/80 text-teal-400 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-medium text-stone-400">Status Penyimpanan</span>
            <p className="text-xs font-semibold text-stone-200 truncate max-w-[180px]">
              {lastSavedTime ? `Tersimpan: ${lastSavedTime.split(' ')[0]} ${lastSavedTime.split(' ')[1] || ''}` : 'Penyimpanan Aktif'}
            </p>
          </div>
          <div className="p-2.5 bg-emerald-950/70 border border-emerald-800/80 text-emerald-400 rounded-xl">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 1. Wheel of Life Balance Assessment */}
      <div className="bg-stone-900/90 p-5 md:p-6 rounded-3xl border border-stone-800 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-4">
          <div className="space-y-1">
            <h3 className="font-bold text-stone-100 flex items-center gap-2 text-base md:text-lg">
              <PieChart className="w-5 h-5 text-teal-400" />
              <span>Roda Keseimbangan Kesadaran Diri (Wheel of Life)</span>
            </h3>
            <p className="text-xs text-stone-400">
              Geser nilai 1 - 10 untuk mencerminkan kondisi batin Anda saat ini secara jujur tanpa menghakimi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-teal-300 bg-teal-950/80 border border-teal-800 px-3 py-1 rounded-xl">
              Rata-rata: {averageScore}/10
            </span>
          </div>
        </div>

        {/* Wheel Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {strongestDimension && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl flex items-start gap-2.5">
              <Heart className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-300">Jangkar Kekuatan Utama: </span>
                <span className="text-stone-200">{strongestDimension[0]} ({strongestDimension[1]}/10)</span>
                <p className="text-[11px] text-stone-400 mt-0.5">Area ini dapat menjadi sumber stabilitas dan rasa syukur harian.</p>
              </div>
            </div>
          )}

          {growthDimension && (
            <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-2xl flex items-start gap-2.5">
              <Feather className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300">Area Butuh Kelembutan: </span>
                <span className="text-stone-200">{growthDimension[0]} ({growthDimension[1]}/10)</span>
                <p className="text-[11px] text-stone-400 mt-0.5">Beri ruang jeda dan welas asih tanpa perlu memaksakan perubahan drastis.</p>
              </div>
            </div>
          )}
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {(Object.entries(wheelScores) as [string, number][]).map(([key, val]) => {
            const numVal = Number(val);
            return (
              <div
                key={key}
                className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800/80 space-y-2.5 hover:border-stone-700 transition"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-200 truncate pr-2" title={key}>{key}</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    numVal >= 8 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    numVal >= 5 ? 'bg-teal-950 text-teal-300 border border-teal-800' :
                    'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {numVal}/10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={numVal}
                  onChange={(e) => handleWheelChange(key, Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-stone-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-500">
                  <span>1 Rendah</span>
                  <span>5 Cukup</span>
                  <span>10 Optimal</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Guided Self Assessment Questions */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="font-bold text-stone-100 text-base md:text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Pertanyaan Refleksi Kedalaman Diri</span>
            </h3>
            <p className="text-xs text-stone-400">
              Tuliskan refleksi jujur Anda. Jawaban otomatis tersimpan sebagai draf dan tersimpan permanen saat menekan tombol simpan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddCustomModal(true)}
              className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-emerald-300 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Pertanyaan</span>
            </button>

            {savedSuccess && (
              <span className="text-xs font-medium text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full animate-fade-in flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Refleksi Tersimpan!
              </span>
            )}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pb-2">
          {[
            { id: 'all', label: 'Semua Pertanyaan' },
            { id: 'pola-pikir', label: 'Pola Pikir' },
            { id: 'pemicu', label: 'Pemicu Emosi' },
            { id: 'nilai-hidup', label: 'Nilai Hidup' },
            { id: 'kebutuhan', label: 'Kebutuhan Batin' },
            { id: 'kelebihan', label: 'Kekuatan & Batasan' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                selectedCategory === tab.id
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800 hover:border-stone-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Question Cards List */}
        <div className="space-y-4">
          {filteredItems.map((item, idx) => {
            const hasAnswer = (activeAnswers[item.id] || item.userAnswer || '').trim().length > 0;
            const isCustom = item.id.startsWith('custom-');

            return (
              <div
                key={item.id}
                className="p-5 md:p-6 rounded-3xl bg-stone-900/90 border border-stone-800 space-y-4 shadow-lg hover:border-stone-700/80 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className={`w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                      hasAnswer
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-700 shadow-sm'
                        : 'bg-stone-800 text-stone-400 border border-stone-700'
                    }`}>
                      {hasAnswer ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm md:text-base text-stone-100">{item.title}</h4>
                        <span className="text-[10px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded-md uppercase font-medium">
                          {item.category}
                        </span>
                        {isCustom && (
                          <span className="text-[10px] bg-teal-950 text-teal-300 border border-teal-800 px-1.5 py-0.5 rounded font-medium">
                            Kustom
                          </span>
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-stone-300 leading-relaxed font-medium mt-1">
                        {item.question}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <VoiceGuideButton
                      text={`Pertanyaan: ${item.title}. ${item.question}. ${item.reflectionNote ? `Catatan pendalaman: ${item.reflectionNote}` : ''}`}
                      title={`${item.title}`}
                      subtitle="Bimbingan Pertanyaan Refleksi"
                      variant="compact"
                    />

                    {isCustom && (
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 text-stone-500 hover:text-red-400 hover:bg-stone-800 rounded-xl transition"
                        title="Hapus pertanyaan kustom ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <textarea
                    value={activeAnswers[item.id] !== undefined ? activeAnswers[item.id] : (item.userAnswer || '')}
                    onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                    placeholder="Tuliskan renungan dan pengalaman jujurmu di sini..."
                    rows={3}
                    className="w-full bg-stone-950/80 border border-stone-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 rounded-2xl p-3.5 text-xs md:text-sm text-stone-100 placeholder-stone-500 outline-none transition resize-y"
                  />
                  <div className="flex items-center justify-between text-[10px] text-stone-500 px-1">
                    <span>Otomatis tersimpan sebagai draf</span>
                    <span>
                      {(activeAnswers[item.id] !== undefined ? activeAnswers[item.id] : (item.userAnswer || '')).length} karakter
                    </span>
                  </div>
                </div>

                {item.reflectionNote && (
                  <div className="p-3 bg-stone-950/60 rounded-2xl border border-stone-800/80 text-[11px] text-stone-400 flex items-start gap-2.5">
                    <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item.reflectionNote}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Primary Save & Journal Action Bar */}
        <div className="p-5 bg-stone-900/95 border border-stone-800 rounded-3xl space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-stone-400 text-center sm:text-left">
              <span className="font-semibold text-stone-200">
                {lastSavedTime ? `Terakhir disimpan: ${lastSavedTime}` : 'Klik tombol di bawah untuk menyimpan seluruh hasil refleksi'}
              </span>
              <p className="text-[11px] text-stone-500">
                Data disimpan aman di browser Anda dan dapat diekspor kapan saja.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              {onAddJournal && (
                <button
                  onClick={handleSaveToJournal}
                  disabled={savedJournalSuccess}
                  className="flex-1 sm:flex-none px-4 py-3 bg-stone-800 hover:bg-stone-700 text-teal-300 font-semibold rounded-2xl text-xs md:text-sm transition flex items-center justify-center gap-2 border border-stone-700"
                >
                  {savedJournalSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <BookOpen className="w-4 h-4 text-teal-400" />}
                  <span>{savedJournalSuccess ? 'Tersimpan di Jurnal' : 'Simpan ke LEGA Jurnal'}</span>
                </button>
              )}

              <button
                onClick={handleSaveAll}
                className="flex-1 sm:flex-none px-6 py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold rounded-2xl text-xs md:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Seluruh Refleksi Diri</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. AI Self-Discovery Insight Generation Section */}
      <div className="bg-stone-900/90 border border-stone-800 p-6 rounded-3xl space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div className="space-y-1">
            <h3 className="font-bold text-stone-100 flex items-center gap-2 text-base md:text-lg">
              <Sparkles className="w-5 h-5 text-teal-400" />
              <span>Sintesis Wawasan Mengenal Diri (AI LEGA Insight)</span>
            </h3>
            <p className="text-xs text-stone-400">
              Biarkan AI LEGA merangkai pemahaman dari jawaban refleksi dan roda keseimbangan Anda secara hangat dan mendalam.
            </p>
          </div>

          <button
            onClick={handleGenerateAiInsight}
            disabled={loadingAi}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold rounded-2xl text-xs md:text-sm transition flex items-center justify-center gap-2 shadow-md shadow-teal-950/40"
          >
            {loadingAi ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-teal-200" />
                <span>Menganalisis Refleksi...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-teal-200" />
                <span>{aiInsight ? 'Perbarui Wawasan AI' : 'Dapatkan Wawasan Refleksi Diri AI'}</span>
              </>
            )}
          </button>
        </div>

        {/* Render AI Insight Output */}
        {aiInsight && (
          <div className="space-y-5 animate-fade-in pt-2">
            {/* Summary */}
            <div className="p-5 bg-teal-950/30 border border-teal-800/60 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" /> Potret Kesadaran Diri
                </span>
                <VoiceGuideButton
                  text={`Wawasan Refleksi Diri: ${aiInsight.summary}. Afirmasi: ${aiInsight.actionAffirmation || ''}`}
                  title="Wawasan Mengenal Diri"
                  subtitle="Sintesis AI LEGA"
                  variant="compact"
                />
              </div>
              <p className="text-xs md:text-sm text-teal-100 leading-relaxed font-medium">
                "{aiInsight.summary}"
              </p>
            </div>

            {/* Strengths & Growth Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiInsight.keyStrengths && aiInsight.keyStrengths.length > 0 && (
                <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-2xl space-y-2">
                  <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-emerald-400" /> Kekuatan Batin & Nilai Inti:
                  </h4>
                  <ul className="space-y-1.5">
                    {aiInsight.keyStrengths.map((str: string, i: number) => (
                      <li key={i} className="text-xs text-stone-300 flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {aiInsight.growthAreas && aiInsight.growthAreas.length > 0 && (
                <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-2xl space-y-2">
                  <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Feather className="w-4 h-4 text-amber-400" /> Area Membutuhkan Welas Asih:
                  </h4>
                  <ul className="space-y-1.5">
                    {aiInsight.growthAreas.map((area: string, i: number) => (
                      <li key={i} className="text-xs text-stone-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Wheel Analysis & Mind-Body Connection */}
            {(aiInsight.wheelAnalysis || aiInsight.mindBodyConnection) && (
              <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-2xl space-y-2">
                {aiInsight.wheelAnalysis && (
                  <p className="text-xs text-stone-300 leading-relaxed">
                    <strong className="text-stone-200">Keseimbangan Hidup: </strong>
                    {aiInsight.wheelAnalysis}
                  </p>
                )}
                {aiInsight.mindBodyConnection && (
                  <p className="text-xs text-stone-300 leading-relaxed pt-1 border-t border-stone-800">
                    <strong className="text-stone-200">Koneksi Pikiran-Tubuh: </strong>
                    {aiInsight.mindBodyConnection}
                  </p>
                )}
              </div>
            )}

            {/* Reflective Inquiries */}
            {aiInsight.reflectiveInquiries && aiInsight.reflectiveInquiries.length > 0 && (
              <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-teal-400" /> Pertanyaan Pendalaman Lanjutan:
                </h4>
                <div className="space-y-1.5">
                  {aiInsight.reflectiveInquiries.map((q: string, idx: number) => (
                    <div key={idx} className="p-2.5 bg-stone-900 rounded-xl text-xs text-stone-300 italic">
                      "{q}"
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Affirmation */}
            {aiInsight.actionAffirmation && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                  Afirmasi Sadar Diri
                </span>
                <p className="text-xs md:text-sm font-semibold text-emerald-100 italic">
                  "{aiInsight.actionAffirmation}"
                </p>
              </div>
            )}

            {/* Recommended Modules */}
            {aiInsight.recommendedModules && aiInsight.recommendedModules.length > 0 && onSelectModule && (
              <div className="pt-2 space-y-2">
                <p className="text-xs font-bold text-stone-400">Rekomendasi Modul LEGA Terkait:</p>
                <div className="flex flex-wrap gap-2">
                  {aiInsight.recommendedModules.map((mod: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => onSelectModule(mod.targetModuleKey)}
                      className="px-3.5 py-2 bg-stone-950 hover:bg-stone-800 border border-stone-800 hover:border-emerald-800 text-stone-300 hover:text-emerald-300 rounded-xl text-xs font-medium transition flex items-center gap-2"
                    >
                      <span>{mod.moduleName}</span>
                      <ArrowRight className="w-3 h-3 text-stone-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal: Add Custom Question */}
      {showAddCustomModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-bold text-stone-100 flex items-center gap-2 text-sm md:text-base">
                <Plus className="w-4 h-4 text-emerald-400" /> Tambah Pertanyaan Refleksi Personal
              </h3>
              <button
                onClick={() => setShowAddCustomModal(false)}
                className="text-stone-400 hover:text-stone-200 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-stone-300 font-semibold">Judul Refleksi</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Contoh: Pola Relasi & Komunikasi Keluarga"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-300 font-semibold">Kategori</label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as any)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-100 outline-none focus:border-emerald-500"
                >
                  <option value="pola-pikir">Pola Pikir</option>
                  <option value="pemicu">Pemicu Emosi</option>
                  <option value="nilai-hidup">Nilai Hidup</option>
                  <option value="kebutuhan">Kebutuhan Batin</option>
                  <option value="kelebihan">Kekuatan & Batasan</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-stone-300 font-semibold">Pertanyaan Reflektif</label>
                <textarea
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder="Tuliskan pertanyaan mendalam yang ingin Anda renungkan..."
                  rows={3}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-100 outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-300 font-semibold">Catatan / Tips Refleksi (Opsional)</label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Contoh: Perhatikan sensasi tubuh saat memikirkan topik ini."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-100 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
              <button
                onClick={() => setShowAddCustomModal(false)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleAddCustomQuestion}
                disabled={!customTitle.trim() || !customQuestion.trim()}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold"
              >
                Tambahkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Reset Confirmation */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-stone-100 text-base">Muat Ulang Pertanyaan Bawaan?</h3>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Tindakan ini akan mengosongkan jawaban tersimpan dan mengembalikan seluruh pertanyaan dan roda keseimbangan ke nilai standar.
            </p>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleResetToDefaults}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold"
              >
                Ya, Muat Ulang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
