import React, { useState } from 'react';
import { User, Save, Flame, Calendar, Award } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  onUpdateProfile,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [goal, setGoal] = useState(userProfile.reflectionGoal);
  const [tone, setTone] = useState<'hangat' | 'tenang' | 'fokus'>(userProfile.preferredTone);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdateProfile({
      ...userProfile,
      name,
      reflectionGoal: goal,
      preferredTone: tone,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6 text-stone-100">
      <div className="space-y-1">
        <h2 className="text-xl md:text-2xl font-bold text-stone-100 flex items-center gap-2">
          <User className="w-6 h-6 text-emerald-400" />
          <span>Profil & Preferensi Pengguna</span>
        </h2>
        <p className="text-xs md:text-sm text-stone-400">
          Atur sasaran refleksi dan preferensi komunikasi pendamping AI LEGA.
        </p>
      </div>

      <div className="bg-stone-900/90 p-6 md:p-8 rounded-3xl border border-stone-800 space-y-6 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-stone-400 block mb-1">
              Nama Pengguna
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl p-3 text-xs text-stone-100 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-400 block mb-1">
              Nada Pendamping LEGA AI
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl p-3 text-xs text-stone-100 outline-none"
            >
              <option value="tenang">Tenang & Damai</option>
              <option value="hangat">Hangat & Empatik</option>
              <option value="fokus">Fokus & Objektif</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-stone-400 block mb-1">
            Niat / Tujuan Refleksi Diri Utama
          </label>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={3}
            className="w-full bg-stone-800 border border-stone-700 rounded-xl p-3 text-xs text-stone-100 outline-none focus:border-emerald-500"
          />
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-950/40"
        >
          <Save className="w-4 h-4" />
          <span>{saved ? '✓ Profile Tersimpan!' : 'Simpan Perubahan'}</span>
        </button>
      </div>
    </div>
  );
};
