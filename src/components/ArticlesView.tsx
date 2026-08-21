import React, { useState } from 'react';
import {
  FileText,
  Search,
  Clock,
  User,
  Tag,
  X,
  Sparkles,
  BookOpen,
  Volume2,
  PenTool,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Eye,
  ShieldCheck,
  Layers,
  Globe,
  Sun,
  Heart,
  ArrowRight,
  Bookmark,
  Share2
} from 'lucide-react';
import { INITIAL_ARTICLES } from '../data/initialData';
import { Article, ArticleReference } from '../types';
import { generateLegaArticle, generateGeminiTts } from '../lib/geminiApi';
import { speakIndonesianNarration, stopIndonesianNarration } from '../lib/audioEngine';
import { getStoredVoiceName } from '../lib/voiceService';
import { VoiceGuideButton } from './VoiceGuideButton';

const MASTER_CATEGORIES = [
  'Semua',
  'Self Awareness',
  'Emotion',
  'Emotional Regulation',
  'Body & Health',
  'Personal Growth',
  'Spiritual Reflection',
  'LEGA Overthinking',
  'Regulasi Emosi'
];

export const ArticlesView: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [showGenerator, setShowGenerator] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'reader' | 'seo' | 'references'>('reader');

  // Generator form state
  const [genTopic, setGenTopic] = useState('');
  const [genCategory, setGenCategory] = useState('Self Awareness');
  const [genReadingLevel, setGenReadingLevel] = useState<'Pemula' | 'Menengah' | 'Lanjutan'>('Pemula');
  const [genWordCount, setGenWordCount] = useState<'mini' | 'standard' | 'deep'>('standard');
  const [genIsSpiritual, setGenIsSpiritual] = useState(false);
  const [genAudience, setGenAudience] = useState('Masyarakat umum yang ingin memahami regulasi emosi');
  const [genCustomPrompt, setGenCustomPrompt] = useState('');

  // Audio modal state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  // Journal feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.summary.toLowerCase().includes(search.toLowerCase()) ||
      (a.tags && a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())));
    const matchesCategory =
      selectedCategory === 'Semua' ? true : a.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const handleGenerateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genTopic.trim()) {
      showToast('Mohon masukkan topik atau judul artikel.');
      return;
    }

    setIsGenerating(true);
    try {
      const generated = await generateLegaArticle({
        topic: genTopic,
        category: genCategory,
        readingLevel: genReadingLevel,
        wordCountTarget: genWordCount,
        isSpiritual: genIsSpiritual,
        targetAudience: genAudience,
        customPrompt: genCustomPrompt,
      });

      const newArticle: Article = {
        id: `art-${Date.now()}`,
        title: generated.articleTitle || genTopic,
        category: generated.category || genCategory,
        readTime: genWordCount === 'mini' ? '3-5 menit' : genWordCount === 'deep' ? '10-15 menit' : '6-8 menit',
        summary: generated.summary || 'Ringkasan artikel psikoedukasi LEGA.',
        content: generated.content || 'Konten artikel sedang diproses...',
        author: 'LEGA AI Article Generator (v2.0)',
        tags: [generated.primaryKeyword || 'Psikoedukasi', ...(generated.secondaryKeywords || ['LEGA', 'Mindfulness'])],
        status: 'PUBLISHED',
        readingLevel: generated.readingLevel || genReadingLevel,
        seoTitle: generated.seoTitle,
        metaDescription: generated.metaDescription,
        slug: generated.slug,
        primaryKeyword: generated.primaryKeyword,
        secondaryKeywords: generated.secondaryKeywords,
        keyTakeaways: generated.keyTakeaways,
        reflectionQuestions: generated.reflectionQuestions,
        recommendedExercise: generated.recommendedExercise,
        recommendedAudio: generated.recommendedAudio,
        relatedModules: generated.relatedModules,
        relatedArticles: generated.relatedArticles,
        references: generated.references,
        safetyNote: generated.safetyNote,
        publishedAt: new Date().toISOString().split('T')[0],
      };

      setArticles([newArticle, ...articles]);
      setActiveArticle(newArticle);
      setShowGenerator(false);
      setIsGenerating(false);
      showToast('Artikel LEGA berhasil dibuat!');

      // Reset form
      setGenTopic('');
      setGenCustomPrompt('');
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
      showToast('Gagal menghasilkan artikel. Silakan coba lagi.');
    }
  };

  const handlePlayAudioScript = async (scriptText: string) => {
    setIsPlayingAudio(true);
    showToast('Memutar narasi audio refleksi...');
    try {
      const activeVoice = getStoredVoiceName() || 'rina';
      const audioData = await generateGeminiTts(scriptText, activeVoice);
      if (audioData) {
        const audioUrl = audioData.startsWith('data:') || audioData.startsWith('blob:') || audioData.startsWith('http')
          ? audioData
          : `data:audio/wav;base64,${audioData}`;
        const audio = new Audio(audioUrl);
        audio.play().catch(() => {
          speakIndonesianNarration(scriptText, {
            onEnd: () => setIsPlayingAudio(false),
            onError: () => setIsPlayingAudio(false)
          });
        });
        audio.onended = () => setIsPlayingAudio(false);
      } else {
        speakIndonesianNarration(scriptText, {
          onEnd: () => setIsPlayingAudio(false),
          onError: () => setIsPlayingAudio(false)
        });
      }
    } catch {
      speakIndonesianNarration(scriptText, {
        onEnd: () => setIsPlayingAudio(false),
        onError: () => setIsPlayingAudio(false)
      });
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 text-stone-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-950 border border-emerald-500 text-emerald-200 px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-800">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-bold text-stone-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <span>LEGA Article Generator & Education</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
              v2.0 Master Prompt 26
            </span>
          </h2>
          <p className="text-xs md:text-sm text-stone-400">
            Artikel psikoedukasi terstruktur, berbasis bukti ilmiah, netral, dan aman untuk pemahaman kesehatan mental.
          </p>
        </div>

        <button
          onClick={() => setShowGenerator(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-900/30 shrink-0 self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Buat Artikel AI Baru</span>
        </button>
      </div>

      {/* Search and Category Filter */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-3 bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 text-xs focus-within:border-emerald-500 transition">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari topik artikel psikoedukasi, kata kunci, atau tag..."
              className="bg-transparent outline-none w-full text-xs text-stone-100 placeholder-stone-500"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-stone-500 hover:text-stone-300">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Categories horizontal bar */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          {MASTER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/50'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            onClick={() => {
              setActiveArticle(art);
              setActiveTab('reader');
            }}
            className="group cursor-pointer p-5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-emerald-500/50 transition space-y-3.5 flex flex-col justify-between hover:shadow-lg hover:shadow-stone-950/50"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-stone-400 flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-md font-medium">
                    {art.category}
                  </span>
                  {art.readingLevel && (
                    <span className="px-2 py-0.5 bg-stone-800 text-stone-300 rounded-md text-[10px]">
                      {art.readingLevel}
                    </span>
                  )}
                </div>
                <span className="flex items-center gap-1 text-stone-500">
                  <Clock className="w-3 h-3" /> {art.readTime}
                </span>
              </div>

              <h3 className="font-bold text-sm md:text-base text-stone-100 group-hover:text-emerald-300 transition line-clamp-2">
                {art.title}
              </h3>

              <p className="text-xs text-stone-400 line-clamp-3 leading-relaxed">
                {art.summary}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-stone-800/80">
              <div className="flex items-center justify-between text-[10px] text-stone-500">
                <span className="flex items-center gap-1 text-stone-400">
                  <User className="w-3 h-3 text-stone-500" /> {art.author || 'LEGA Edukasi'}
                </span>
                <span className="text-emerald-400 font-semibold group-hover:translate-x-1 transition flex items-center gap-1">
                  Baca Artikel <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              {art.tags && art.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {art.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-stone-800/60 text-stone-400 rounded text-[10px]">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12 bg-stone-900 border border-stone-800 rounded-2xl space-y-3 p-6">
          <BookOpen className="w-8 h-8 text-stone-600 mx-auto" />
          <p className="text-sm font-semibold text-stone-300">Tidak ada artikel yang cocok</p>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Gunakan tombol "Buat Artikel AI Baru" di atas untuk menghasilkan artikel psikoedukasi baru berdasarkan topik yang Anda butuhkan.
          </p>
        </div>
      )}

      {/* GENERATOR MODAL */}
      {showGenerator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-6 text-stone-100 relative my-8">
            <button
              onClick={() => setShowGenerator(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-200 p-2"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg md:text-xl font-bold text-stone-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>LEGA Article Generator (v2.0)</span>
              </h3>
              <p className="text-xs text-stone-400">
                Membuat artikel psikoedukasi terstruktur, netral, berbasis bukti, dan ramah pembaca.
              </p>
            </div>

            <form onSubmit={handleGenerateArticle} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300">Topik / Judul Utama Artikel *</label>
                <input
                  type="text"
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  placeholder="Contoh: Mengapa Kita Sering Overthinking?"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-100 outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-300">Kategori Artikel LEGA</label>
                  <select
                    value={genCategory}
                    onChange={(e) => setGenCategory(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100 outline-none focus:border-emerald-500"
                  >
                    <option value="Self Awareness">Self Awareness</option>
                    <option value="Emotion">Emotion</option>
                    <option value="Emotional Regulation">Emotional Regulation</option>
                    <option value="Body & Health">Body & Health</option>
                    <option value="Personal Growth">Personal Growth</option>
                    <option value="Spiritual Reflection">Spiritual Reflection</option>
                    <option value="LEGA Overthinking">LEGA Overthinking</option>
                    <option value="LEGA Anxiety">LEGA Anxiety</option>
                    <option value="LEGA Stress">LEGA Stress</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-300">Tingkat Pembaca</label>
                  <select
                    value={genReadingLevel}
                    onChange={(e) => setGenReadingLevel(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100 outline-none focus:border-emerald-500"
                  >
                    <option value="Pemula">Pemula (Bahasa sangat sederhana & contoh)</option>
                    <option value="Menengah">Menengah (Penjelasan lebih mendalam)</option>
                    <option value="Lanjutan">Lanjutan (Detail & istilah ilmiah)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-300">Panjang Artikel</label>
                  <select
                    value={genWordCount}
                    onChange={(e) => setGenWordCount(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100 outline-none focus:border-emerald-500"
                  >
                    <option value="mini">Mini (500–800 kata)</option>
                    <option value="standard">Standar (1.000–1.500 kata)</option>
                    <option value="deep">Mendalam (1.800–3.000 kata)</option>
                  </select>
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={() => setGenIsSpiritual(!genIsSpiritual)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                      genIsSpiritual
                        ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300 ring-1 ring-emerald-500'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Sun className="w-4 h-4 text-emerald-400" />
                      <span>Nuansa Spiritual (Islami)</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${genIsSpiritual ? 'bg-emerald-900 text-emerald-200' : 'bg-stone-900 text-stone-500'}`}>
                      {genIsSpiritual ? 'AKTIF' : 'NON-AKTIF'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300">Target Audiens</label>
                <input
                  type="text"
                  value={genAudience}
                  onChange={(e) => setGenAudience(e.target.value)}
                  placeholder="misal: Pekerja muda, mahasiswa, umum..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300">Catatan Khusus Tambahan (Opsional)</label>
                <textarea
                  value={genCustomPrompt}
                  onChange={(e) => setGenCustomPrompt(e.target.value)}
                  rows={2}
                  placeholder="Tambahkan instruksi khusus, contoh situasi, atau poin yang ingin ditekankan..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowGenerator(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-800 text-stone-400 hover:bg-stone-800 text-xs font-semibold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-900/30"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyusun Artikel...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Hasilkan Artikel</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL ARTICLE READER MODAL (Master Prompt 26 Adaptive Layout) */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-3xl w-full p-6 md:p-8 space-y-6 text-stone-100 relative my-8 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-200 p-2 bg-stone-800/80 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header badges & Title */}
            <div className="space-y-3 border-b border-stone-800 pb-5">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="px-3 py-1 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-full font-semibold">
                  {activeArticle.category}
                </span>
                {activeArticle.readingLevel && (
                  <span className="px-2.5 py-0.5 bg-stone-800 text-stone-300 rounded-md font-mono text-[11px]">
                    Level: {activeArticle.readingLevel}
                  </span>
                )}
                {activeArticle.status && (
                  <span className="px-2.5 py-0.5 bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 rounded-md font-mono text-[10px]">
                    STATUS: {activeArticle.status}
                  </span>
                )}
              </div>

              <h1 className="text-xl md:text-2xl font-extrabold text-stone-100 leading-snug">
                {activeArticle.title}
              </h1>

              <div className="flex items-center gap-4 text-xs text-stone-400 flex-wrap pt-1">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-400" /> {activeArticle.author || 'Tim LEGA'}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-500" /> Waktu Baca: {activeArticle.readTime}
                </span>
                {activeArticle.publishedAt && (
                  <span className="text-stone-500">
                    Diterbitkan: {activeArticle.publishedAt}
                  </span>
                )}
              </div>
            </div>

            {/* Reader Tab Navigation */}
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-stone-800/80 pb-2 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('reader')}
                  className={`px-3 py-1.5 rounded-xl font-medium transition flex items-center gap-1.5 ${
                    activeTab === 'reader'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Baca Artikel</span>
                </button>

                {(activeArticle.seoTitle || activeArticle.primaryKeyword) && (
                  <button
                    onClick={() => setActiveTab('seo')}
                    className={`px-3 py-1.5 rounded-xl font-medium transition flex items-center gap-1.5 ${
                      activeTab === 'seo'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>SEO & Metadata</span>
                  </button>
                )}

                {activeArticle.references && activeArticle.references.length > 0 && (
                  <button
                    onClick={() => setActiveTab('references')}
                    className={`px-3 py-1.5 rounded-xl font-medium transition flex items-center gap-1.5 ${
                      activeTab === 'references'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Referensi ({activeArticle.references.length})</span>
                  </button>
                )}
              </div>

              <VoiceGuideButton
                text={`Mendengarkan artikel: ${activeArticle.title}. ${activeArticle.summary}. ${activeArticle.content.slice(0, 500)}`}
                title={activeArticle.title}
                subtitle={`Artikel oleh ${activeArticle.author || 'Tim LEGA'}`}
                variant="compact"
              />
            </div>

            {/* TAB CONTENT: READER */}
            {activeTab === 'reader' && (
              <div className="space-y-6">
                {/* Summary Box */}
                <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-1.5">
                  <span className="text-[10px] font-bold font-mono tracking-wider text-emerald-400 uppercase">
                    Ringkasan Artikel
                  </span>
                  <p className="text-xs md:text-sm text-stone-200 leading-relaxed font-medium">
                    {activeArticle.summary}
                  </p>
                </div>

                {/* Key Takeaways Box (if available) */}
                {activeArticle.keyTakeaways && activeArticle.keyTakeaways.length > 0 && (
                  <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/60 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Poin Kunci Utama (Key Takeaways):</span>
                    </span>
                    <ul className="space-y-1.5 text-xs text-stone-300">
                      {activeArticle.keyTakeaways.map((takeaway, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Main Article Content */}
                <div className="text-xs md:text-sm text-stone-300 leading-relaxed whitespace-pre-wrap space-y-4 font-normal">
                  {activeArticle.content}
                </div>

                {/* LEGA Feature Integration Toolbar */}
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                  <span className="text-[11px] font-bold text-stone-300 block">
                    Integrasi Fitur LEGA Relevan:
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {/* Audio Integration */}
                    <button
                      onClick={() =>
                        handlePlayAudioScript(
                          activeArticle.recommendedAudio || activeArticle.summary || activeArticle.title
                        )
                      }
                      disabled={isPlayingAudio}
                      className="px-3.5 py-2 rounded-xl bg-emerald-950 border border-emerald-800 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold transition flex items-center gap-2"
                    >
                      <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse text-emerald-400' : ''}`} />
                      <span>{isPlayingAudio ? 'Memutar Audio...' : 'Mulai Audio (LEGA TTS)'}</span>
                    </button>

                    {/* Journal Integration */}
                    {activeArticle.reflectionQuestions && activeArticle.reflectionQuestions.length > 0 && (
                      <button
                        onClick={() => {
                          const qText = activeArticle.reflectionQuestions?.join('\n- ') || '';
                          navigator.clipboard.writeText(`Pertanyaan Refleksi Artikel: ${activeArticle.title}\n- ${qText}`);
                          showToast('Pertanyaan refleksi disalin ke clipboard untuk Jurnal!');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-200 text-xs font-semibold transition flex items-center gap-2"
                      >
                        <PenTool className="w-4 h-4 text-emerald-400" />
                        <span>Refleksikan Sekarang (Jurnal)</span>
                      </button>
                    )}
                  </div>

                  {/* Reflection Questions List */}
                  {activeArticle.reflectionQuestions && activeArticle.reflectionQuestions.length > 0 && (
                    <div className="pt-2 border-t border-stone-800/80 space-y-1">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                        Pertanyaan Refleksi Diri (Muhasabah):
                      </span>
                      <ul className="list-disc list-inside text-xs text-stone-300 space-y-1">
                        {activeArticle.reflectionQuestions.map((q, idx) => (
                          <li key={idx}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommended Exercise */}
                  {activeArticle.recommendedExercise && (
                    <div className="pt-2 border-t border-stone-800/80 text-xs text-stone-300 flex items-center gap-2">
                      <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>Latihan Relevan: <strong className="text-stone-100">{activeArticle.recommendedExercise}</strong></span>
                    </div>
                  )}

                  {/* Related LEGA Modules */}
                  {activeArticle.relatedModules && activeArticle.relatedModules.length > 0 && (
                    <div className="pt-2 border-t border-stone-800/80 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-stone-400 font-medium">Modul Terkait:</span>
                      {activeArticle.relatedModules.map((mod, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-stone-900 border border-stone-800 rounded text-[10px] text-emerald-400 font-mono">
                          {mod}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Safety & Crisis Disclaimer Note */}
                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/40 text-amber-300/90 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <p className="leading-relaxed text-[11px]">
                    {activeArticle.safetyNote ||
                      'Artikel ini bertujuan memberikan informasi edukasi umum dan bukan merupakan pengganti konseling psikologis, diagnosis medis, atau terapi profesional.'}
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: SEO */}
            {activeTab === 'seo' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                  <h4 className="font-bold text-stone-100 text-sm flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span>Metadata & SEO Engine (Master Prompt 26)</span>
                  </h4>

                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] text-stone-500 block uppercase font-mono">SEO Title</span>
                      <p className="text-stone-200 font-semibold">{activeArticle.seoTitle || activeArticle.title}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-500 block uppercase font-mono">Meta Description</span>
                      <p className="text-stone-300">{activeArticle.metaDescription || activeArticle.summary}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-500 block uppercase font-mono">URL Slug</span>
                      <p className="text-emerald-400 font-mono">{activeArticle.slug || '/artikel/' + activeArticle.id}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-800">
                      <div>
                        <span className="text-[10px] text-stone-500 block uppercase font-mono">Primary Keyword</span>
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded font-mono">
                          {activeArticle.primaryKeyword || 'psikoedukasi'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 block uppercase font-mono">Secondary Keywords</span>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {activeArticle.secondaryKeywords?.map((kw, i) => (
                            <span key={i} className="px-1.5 py-0.5 bg-stone-800 text-stone-300 rounded text-[10px]">
                              {kw}
                            </span>
                          )) || '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: REFERENCES */}
            {activeTab === 'references' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                  <h4 className="font-bold text-stone-100 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Referensi Terverifikasi & Sumber Ilmiah</span>
                  </h4>

                  <p className="text-stone-400 text-[11px]">
                    Setiap klaim kesehatan dan edukasi dalam artikel ini merujuk pada publikasi ilmiah dan pedoman lembaga kesehatan resmi yang dapat diverifikasi:
                  </p>

                  <div className="space-y-2.5">
                    {activeArticle.references?.map((ref, idx) => (
                      <div key={idx} className="p-3 bg-stone-900 border border-stone-800 rounded-xl space-y-1">
                        <div className="flex items-center justify-between font-semibold text-stone-200">
                          <span>{ref.title}</span>
                          {ref.year && <span className="text-[10px] text-stone-500 font-mono">({ref.year})</span>}
                        </div>
                        <p className="text-[11px] text-stone-400">
                          Penulis/Lembaga: <strong className="text-stone-300">{ref.authorOrOrg}</strong>
                          {ref.publication ? ` • ${ref.publication}` : ''}
                        </p>
                        {ref.urlOrDoi && (
                          <a
                            href={ref.urlOrDoi}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-mono pt-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>{ref.urlOrDoi}</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tags footer */}
            <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs flex-wrap gap-2">
              <div className="flex flex-wrap gap-1.5">
                {activeArticle.tags?.map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-stone-800 text-stone-400 rounded-lg text-[11px]">
                    #{tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.href} (${activeArticle.title})`);
                  showToast('Tautan artikel telah disalin!');
                }}
                className="px-3 py-1.5 rounded-xl border border-stone-800 hover:bg-stone-800 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Bagikan Artikel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
