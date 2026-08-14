import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Tag,
  Sparkles,
  Calendar,
  Smile,
  RefreshCw,
  X
} from 'lucide-react';
import { EmotionCategory, JournalEntry } from '../types';
import { reflectJournal } from '../lib/geminiApi';

interface JournalViewProps {
  journals: JournalEntry[];
  onAddJournal: (entry: JournalEntry) => void;
}

export const JournalView: React.FC<JournalViewProps> = ({ journals, onAddJournal }) => {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<EmotionCategory>('tenang');
  const [tagsInput, setTagsInput] = useState('Refleksi, Jeda');
  const [gettingAiReflect, setGettingAiReflect] = useState(false);

  const filteredJournals = journals.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.content.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag ? j.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const handleSaveJournal = async () => {
    if (!title.trim() || !content.trim()) return;

    setGettingAiReflect(true);
    const tagsArray = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

    const aiFeedback = await reflectJournal({
      title,
      content,
      mood,
      tags: tagsArray,
    });

    const newEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      title,
      content,
      date: new Date().toISOString().split('T')[0],
      mood,
      tags: tagsArray,
      aiFeedback,
    };

    onAddJournal(newEntry);
    setGettingAiReflect(false);
    setIsModalOpen(false);

    // Reset Form
    setTitle('');
    setContent('');
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 text-stone-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-bold text-stone-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <span>Jurnal Refleksi Kesadaran</span>
          </h2>
          <p className="text-xs md:text-sm text-stone-400">
            Tumpahkan narasi harimu dan dapatkan pemaknaan hangat dari LEGA AI.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-amber-950/40 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Jurnal Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-200">
        <Search className="w-4 h-4 text-stone-400 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari dalam tulisan jurnal..."
          className="bg-transparent outline-none w-full text-xs text-stone-100 placeholder-stone-500"
        />
      </div>

      {/* Journal Cards List */}
      <div className="space-y-4">
        {filteredJournals.map((j) => (
          <div
            key={j.id}
            className="p-5 md:p-6 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4 hover:border-stone-700 transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
              <div className="space-y-1">
                <h3 className="font-semibold text-base text-stone-100">{j.title}</h3>
                <div className="flex items-center gap-2 text-[11px] text-stone-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-400" /> {j.date}
                  </span>
                  {j.mood && (
                    <span className="px-2 py-0.5 bg-stone-800 rounded text-stone-300 capitalize font-medium">
                      Mood: {j.mood}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {j.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-amber-950/60 border border-amber-800/60 text-amber-300 rounded-md text-[10px] font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed whitespace-pre-wrap">
              {j.content}
            </p>

            {/* AI Feedback Box */}
            {j.aiFeedback && (
              <div className="p-4 bg-stone-950/80 rounded-xl border border-stone-800 text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Refleksi LEGA AI:</span>
                </div>
                <p className="text-stone-300 italic">"{j.aiFeedback.reflection}"</p>
                <div className="pt-2 border-t border-stone-800/80 text-[11px] text-amber-300/90 font-medium">
                  <strong>Insight Utama:</strong> {j.aiFeedback.keyInsight}
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredJournals.length === 0 && (
          <p className="text-xs text-stone-500 py-12 text-center">
            Tidak ada jurnal yang sesuai dengan pencarian.
          </p>
        )}
      </div>

      {/* Modal New Journal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-sm p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 space-y-4 text-stone-100 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-base text-stone-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>Tulis Jurnal Refleksi Baru</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-400 block mb-1">
                  Judul Refleksi
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Momen Jeda Siang Hari..."
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-xs text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-400 block mb-1">
                  Isi Catatan Jurnal
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan cerita atau apa yang kamu alami..."
                  rows={5}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl p-3 text-xs text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-400 block mb-1">
                    Mood
                  </label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value as EmotionCategory)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-xs text-stone-100 outline-none"
                  >
                    <option value="tenang">Tenang</option>
                    <option value="bersyukur">Bersyukur</option>
                    <option value="cemas">Cemas</option>
                    <option value="sedih">Sedih</option>
                    <option value="marah">Marah</option>
                    <option value="lelah">Lelah</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-400 block mb-1">
                    Tag (Dipisahkan Koma)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Refleksi, Pekerjaan"
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-xs text-stone-100 outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveJournal}
              disabled={gettingAiReflect || !title.trim() || !content.trim()}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-800 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2"
            >
              {gettingAiReflect ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Meminta Refleksi LEGA AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Simpan & Buat Refleksi AI</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
