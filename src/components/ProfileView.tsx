import React, { useState, useEffect } from 'react';
import {
  User,
  Save,
  Flame,
  Calendar,
  Sparkles,
  Volume2,
  VolumeX,
  LogOut,
  Mail,
  Heart,
  Brain,
  Compass,
  CheckCircle2,
  Clock,
  Shield,
  Activity,
  AlertTriangle,
  Play,
  Square,
  RefreshCw,
  Sun,
  Smile,
  Leaf,
  Moon,
  Feather,
  Flower2,
  Waves,
  Mountain
} from 'lucide-react';
import { UserProfile } from '../types';
import { VOICE_CHARACTERS } from '../lib/audioEngine';
import {
  previewVoiceCharacterAudio,
  stopVoicePreview,
  getStoredVoiceName,
  setStoredVoiceName
} from '../lib/voiceService';
import { useDemoAuth } from '../lib/demoAuthManager';

interface ProfileViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
  onLogout: () => void;
  demoState?: ReturnType<typeof useDemoAuth>;
}

// Calming Avatar presets
const AVATAR_PRESETS = [
  { id: 'lotus', label: 'Teratai Suci', icon: Flower2, color: 'from-pink-500/30 to-rose-600/30 border-rose-500/50 text-rose-300' },
  { id: 'leaf', label: 'Daun Hening', icon: Leaf, color: 'from-emerald-500/30 to-teal-600/30 border-emerald-500/50 text-emerald-300' },
  { id: 'moon', label: 'Bulan Damai', icon: Moon, color: 'from-indigo-500/30 to-purple-600/30 border-indigo-500/50 text-indigo-300' },
  { id: 'sun', label: 'Mentari Fajar', icon: Sun, color: 'from-amber-500/30 to-orange-600/30 border-amber-500/50 text-amber-300' },
  { id: 'feather', label: 'Keringanan Jiwa', icon: Feather, color: 'from-sky-500/30 to-cyan-600/30 border-sky-500/50 text-sky-300' },
  { id: 'waves', label: 'Samudra Jernih', icon: Waves, color: 'from-blue-500/30 to-teal-600/30 border-blue-500/50 text-blue-300' },
  { id: 'mountain', label: 'Gunung Tegar', icon: Mountain, color: 'from-stone-500/30 to-zinc-600/30 border-stone-500/50 text-stone-300' },
  { id: 'heart', label: 'Kasih Welas Asih', icon: Heart, color: 'from-rose-500/30 to-red-600/30 border-rose-500/50 text-rose-300' }
];

const EMOTION_FOCUS_OPTIONS = [
  { id: 'overthinking', label: 'Meredakan Overthinking & Pikiran Berisik' },
  { id: 'anxiety', label: 'Mengatasi Kecemasan & Ketakutan Masa Depan' },
  { id: 'burnout', label: 'Memulihkan Burnout & Kelelahan Mental' },
  { id: 'emotional-release', label: 'Pelepasan Emosi Pendam & Amarah' },
  { id: 'self-compassion', label: 'Menyembuhkan Inner Child & Memaafkan Diri' },
  { id: 'inner-peace', label: 'Menjaga Ketenangan & Keheningan Batin' }
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  onUpdateProfile,
  onLogout,
  demoState
}) => {
  const [name, setName] = useState(userProfile.name || 'Teman LEGA');
  const [email, setEmail] = useState(userProfile.email || 'user@lega.app');
  const [avatar, setAvatar] = useState(userProfile.avatar || 'lotus');
  const [bio, setBio] = useState(
    userProfile.bio || 'Menemukan keheningan di tengah riuh dunia, menyayangi diri seutuhnya.'
  );
  const [goal, setGoal] = useState(
    userProfile.reflectionGoal || 'Menemukan ketenangan batin dan melepaskan beban pikiran sehari-hari.'
  );
  const [tone, setTone] = useState<'hangat' | 'tenang' | 'fokus'>(
    userProfile.preferredTone || 'tenang'
  );
  const [selectedVoice, setSelectedVoice] = useState<string>(
    userProfile.preferredVoice || getStoredVoiceName() || 'Suara Tenang'
  );
  const [primaryFocus, setPrimaryFocus] = useState<string>(
    userProfile.primaryEmotionFocus || 'overthinking'
  );
  const [dailyReminder, setDailyReminder] = useState<string>(
    userProfile.dailyReminderTime || '21:00'
  );
  const [enableSoundscapes, setEnableSoundscapes] = useState<boolean>(
    userProfile.enableSoundscapes !== false
  );

  const [saved, setSaved] = useState(false);
  const [activeVoicePreview, setActiveVoicePreview] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    return () => {
      stopVoicePreview();
    };
  }, []);

  const handlePreviewVoice = (vName: string) => {
    if (activeVoicePreview === vName) {
      stopVoicePreview();
      setActiveVoicePreview(null);
      return;
    }

    setActiveVoicePreview(vName);
    previewVoiceCharacterAudio(
      vName,
      () => {},
      () => setActiveVoicePreview(null),
      () => setActiveVoicePreview(null)
    );
  };

  const handleSave = () => {
    const updated: UserProfile = {
      ...userProfile,
      name: name.trim() || 'Teman LEGA',
      email: email.trim(),
      avatar,
      bio: bio.trim(),
      reflectionGoal: goal.trim(),
      preferredTone: tone,
      preferredVoice: selectedVoice,
      primaryEmotionFocus: primaryFocus,
      dailyReminderTime: dailyReminder,
      enableSoundscapes
    };

    setStoredVoiceName(selectedVoice);
    onUpdateProfile(updated);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('lega_user_profile', JSON.stringify(updated));
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  const handleExecuteLogout = () => {
    stopVoicePreview();
    setShowLogoutConfirm(false);
    onLogout();
  };

  const currentAvatarPreset = AVATAR_PRESETS.find((a) => a.id === avatar) || AVATAR_PRESETS[0];
  const AvatarIcon = currentAvatarPreset.icon;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 text-stone-100 pb-24">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-stone-900 via-stone-900/90 to-stone-950 p-6 md:p-8 rounded-3xl border border-stone-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-start sm:items-center gap-4">
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${currentAvatarPreset.color} flex items-center justify-center border shadow-xl shrink-0`}>
            <AvatarIcon className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-100 tracking-tight">
                {name || 'Teman LEGA'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Aktif
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-stone-500" />
              <span>{email}</span>
            </p>
            <p className="text-xs text-stone-500 mt-1 italic">
              &quot;{bio}&quot;
            </p>
          </div>
        </div>

        {/* Action Button: Logout Quick Trigger */}
        <div className="relative z-10 flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-95 shadow-md hover:shadow-rose-950/50"
            title="Keluar dari sesi dan kembali ke Landing Page"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Keluar Aplikasi</span>
          </button>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-stone-900/80 p-4 rounded-2xl border border-stone-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Flame className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Streak Refleksi</p>
            <p className="text-lg font-bold text-amber-300">{userProfile.streakDays || 1} Hari</p>
          </div>
        </div>

        <div className="bg-stone-900/80 p-4 rounded-2xl border border-stone-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Total Sesi Batin</p>
            <p className="text-lg font-bold text-emerald-300">{userProfile.totalReflections || 12} Sesi</p>
          </div>
        </div>

        <div className="bg-stone-900/80 p-4 rounded-2xl border border-stone-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Tergabung Sejak</p>
            <p className="text-xs font-semibold text-stone-300 mt-0.5">{userProfile.registeredDate || 'Agustus 2026'}</p>
          </div>
        </div>

        <div className="bg-stone-900/80 p-4 rounded-2xl border border-stone-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Status Lisensi</p>
            <p className="text-xs font-semibold text-purple-300 mt-0.5">
              {demoState?.isDemoActive ? `Demo (${demoState.timeRemaining.formatted})` : 'Akses Penuh'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Profile Form */}
      <div className="bg-stone-900/90 p-6 md:p-8 rounded-3xl border border-stone-800 shadow-xl space-y-8">
        {/* Section 1: Avatar Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Pilih Simbol Jiwa (Avatar)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {AVATAR_PRESETS.map((item) => {
              const Icon = item.icon;
              const isSelected = avatar === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAvatar(item.id)}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    isSelected
                      ? `bg-gradient-to-r ${item.color} ring-2 ring-emerald-500/50 shadow-lg scale-[1.02]`
                      : 'bg-stone-800/50 border-stone-700/60 text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                  }`}
                >
                  <div className={`p-2 rounded-xl bg-stone-900/80 border border-stone-700`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Personal Information */}
        <div className="space-y-4 pt-4 border-t border-stone-800/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
            <User className="w-4 h-4 text-sky-400" />
            <span>Identitas & Bio Refleksi</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-400 block mb-1.5">
                Nama Panggilan / Nama Pengguna
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Dinda / Budi"
                className="w-full bg-stone-800 border border-stone-700 rounded-xl p-3 text-xs sm:text-sm text-stone-100 outline-none focus:border-emerald-500 transition shadow-inner"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-400 block mb-1.5">
                Alamat Email Terdaftar
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@anda.com"
                className="w-full bg-stone-800 border border-stone-700 rounded-xl p-3 text-xs sm:text-sm text-stone-100 outline-none focus:border-emerald-500 transition shadow-inner"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-400 block mb-1.5">
              Afirmasi Batin / Catatan Jiwa Hari Ini
            </label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tuliskan kata mutiara atau pengingat lembut untuk hatimu..."
              className="w-full bg-stone-800 border border-stone-700 rounded-xl p-3 text-xs sm:text-sm text-stone-100 outline-none focus:border-emerald-500 transition shadow-inner"
            />
          </div>
        </div>

        {/* Section 3: AI Coach Tone & Voice Preference */}
        <div className="space-y-4 pt-4 border-t border-stone-800/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>Karakter Suara & Gaya Pendamping AI (LEGA Coach)</span>
          </h3>

          {/* Voice Character Cards */}
          <div>
            <label className="text-xs font-semibold text-stone-400 block mb-2">
              Pilihan Suara Pemandu Audio AI (Klik Play untuk Sampel):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {VOICE_CHARACTERS.map((v) => {
                const isSelected = selectedVoice === v.name;
                const isPlayingThis = activeVoicePreview === v.name;
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVoice(v.name)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/60 ring-1 ring-emerald-500/40 shadow-lg'
                        : 'bg-stone-800/40 border-stone-700/60 hover:bg-stone-800/80 text-stone-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                            {v.badge}
                          </span>
                          <span className="text-xs font-bold text-stone-100">{v.name}</span>
                        </div>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-stone-400 mt-1 line-clamp-2">{v.description}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-700/40 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-stone-400 truncate max-w-[140px]">
                        {v.tone}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreviewVoice(v.name);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition ${
                          isPlayingThis
                            ? 'bg-amber-500 text-stone-950 animate-pulse'
                            : 'bg-stone-700 hover:bg-stone-600 text-stone-200'
                        }`}
                      >
                        {isPlayingThis ? (
                          <>
                            <Square className="w-2.5 h-2.5 fill-current" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span>Dengarkan</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-400 block mb-1.5">
                Gaya Nada Pendamping LEGA AI
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl p-3 text-xs sm:text-sm text-stone-100 outline-none focus:border-emerald-500 transition"
              >
                <option value="tenang">Tenang, Menyejukkan & Damai</option>
                <option value="hangat">Hangat, Merangkul & Empatik</option>
                <option value="fokus">Fokus, Jelas & Objektif</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-400 block mb-1.5">
                Fokus Kebutuhan Emosi Utama
              </label>
              <select
                value={primaryFocus}
                onChange={(e) => setPrimaryFocus(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl p-3 text-xs sm:text-sm text-stone-100 outline-none focus:border-emerald-500 transition"
              >
                {EMOTION_FOCUS_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Goals & Daily Routine */}
        <div className="space-y-4 pt-4 border-t border-stone-800/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Niat Refleksi & Rutinitas Batin</span>
          </h3>

          <div>
            <label className="text-xs font-semibold text-stone-400 block mb-1.5">
              Niat / Sasaran Utama Refleksi Diri
            </label>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={3}
              placeholder="Contoh: Belajar melepaskan hal di luar kendali, tidak mudah cemas di malam hari..."
              className="w-full bg-stone-800 border border-stone-700 rounded-xl p-3 text-xs sm:text-sm text-stone-100 outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-400 block mb-1.5">
                Waktu Pengingat Harian (Jam Refleksi)
              </label>
              <input
                type="time"
                value={dailyReminder}
                onChange={(e) => setDailyReminder(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl p-3 text-xs sm:text-sm text-stone-100 outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-stone-800/50 rounded-xl border border-stone-700/60">
              <div>
                <p className="text-xs font-semibold text-stone-200">Musik Relaksasi Alam Otomatis</p>
                <p className="text-[11px] text-stone-400">Putar lanskap alam di latar belakang setiap sesi</p>
              </div>
              <input
                type="checkbox"
                checked={enableSoundscapes}
                onChange={(e) => setEnableSoundscapes(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/60 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{saved ? '✓ Profil Berhasil Disimpan!' : 'Simpan Perubahan Profil'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full sm:w-auto px-6 py-3.5 bg-stone-800 hover:bg-rose-950/50 border border-stone-700 hover:border-rose-800/60 text-stone-300 hover:text-rose-300 font-semibold rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 active:scale-95"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Keluar & Kembali ke Landing Page</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <LogOut className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-stone-100">
                Konfirmasi Keluar Aplikasi
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Apakah Anda yakin ingin keluar dari sesi saat ini? Semua progres dan preferensi Anda telah tersimpan dengan aman, dan Anda akan dialihkan kembali ke Landing Page.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 rounded-xl text-xs sm:text-sm font-semibold transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteLogout}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-lg shadow-rose-950/50 flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Ya, Keluar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
