import React, { useState, useEffect } from 'react';
import { UserProfile, Difficulty, ExplanatoryLanguage } from '../types';
import { User, LogIn, Plus, Award, Settings, CheckCircle2 } from 'lucide-react';

interface ProfilePanelProps {
  currentProfile: UserProfile | null;
  onProfileSelect: (profile: UserProfile) => void;
  onProfileUpdate: (profile: UserProfile) => void;
}

export default function ProfilePanel({
  currentProfile,
  onProfileSelect,
  onProfileUpdate,
}: ProfilePanelProps) {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [newName, setNewName] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  // Load profiles from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cils_user_profiles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfiles(parsed);
        if (parsed.length > 0 && !currentProfile) {
          onProfileSelect(parsed[0]);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      // Create a default guest profile
      const defaultProfile: UserProfile = {
        id: 'guest_' + Date.now(),
        name: 'Utente Ospite (Guest)',
        difficulty: 'medium',
        language: 'it',
        completedExamsCount: 0,
        joinedAt: new Date().toISOString(),
      };
      const initial = [defaultProfile];
      localStorage.setItem('cils_user_profiles', JSON.stringify(initial));
      setProfiles(initial);
      onProfileSelect(defaultProfile);
    }
  }, []);

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newProf: UserProfile = {
      id: 'user_' + Date.now(),
      name: newName.trim(),
      difficulty: 'medium',
      language: 'it',
      completedExamsCount: 0,
      joinedAt: new Date().toISOString(),
    };

    const updated = [...profiles, newProf];
    setProfiles(updated);
    localStorage.setItem('cils_user_profiles', JSON.stringify(updated));
    onProfileSelect(newProf);
    setNewName('');
    setShowCreate(false);
  };

  const handleUpdateDifficulty = (diff: Difficulty) => {
    if (!currentProfile) return;
    const updated = { ...currentProfile, difficulty: diff };
    onProfileUpdate(updated);
    updateProfileInList(updated);
  };

  const handleUpdateLanguage = (lang: ExplanatoryLanguage) => {
    if (!currentProfile) return;
    const updated = { ...currentProfile, language: lang };
    onProfileUpdate(updated);
    updateProfileInList(updated);
  };

  const updateProfileInList = (updated: UserProfile) => {
    const list = profiles.map((p) => (p.id === updated.id ? updated : p));
    setProfiles(list);
    localStorage.setItem('cils_user_profiles', JSON.stringify(list));
  };

  return (
    <div id="profile-panel" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-sans text-base font-bold text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600" />
          <span>Profilo Utente | Profile</span>
        </h3>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nuovo Utente</span>
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreateProfile} className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <label className="block text-xs font-semibold text-slate-600 mb-2">Inserisci il tuo nome o username:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Es: Mario Rossi"
              className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
            >
              Crea
            </button>
          </div>
        </form>
      )}

      {currentProfile ? (
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-700 border border-indigo-100">
              <LogIn className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Utente Attivo</p>
              <h4 className="text-sm font-bold text-slate-900 truncate mt-0.5">{currentProfile.name}</h4>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className="inline-flex items-center text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded font-mono">
                  {currentProfile.difficulty === 'easy' ? 'Facile (Easy)' : currentProfile.difficulty === 'medium' ? 'Medio (Medium)' : 'Difficile (Hard)'}
                </span>
                <span className="inline-flex items-center text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded font-mono">
                  {currentProfile.language === 'fa' ? 'Persiano (FA)' : currentProfile.language === 'en' ? 'English (EN)' : 'Italiano (IT)'}
                </span>
              </div>
            </div>
          </div>

          {profiles.length > 1 && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Cambia Utente (Switch User)</label>
              <div className="flex flex-wrap gap-1.5">
                {profiles
                  .filter((p) => p.id !== currentProfile.id)
                  .map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onProfileSelect(p)}
                      className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg font-medium transition-all"
                    >
                      {p.name}
                    </button>
                  ))}
              </div>
            </div>
          )}

          <div className="border-t border-slate-200 pt-5 space-y-4">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Preferenze di Studio (Study Preferences)</span>
            </h5>

            {/* Difficulty Level Selector */}
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-slate-600">Livello di Difficoltà (Difficulty):</span>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleUpdateDifficulty(level)}
                    className={`text-xs font-bold py-1.5 px-2 rounded-md transition-all ${
                      currentProfile.difficulty === level
                        ? 'bg-white text-indigo-600 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {level === 'easy' ? 'Facile' : level === 'medium' ? 'Medio' : 'Difficile'}
                  </button>
                ))}
              </div>
            </div>

            {/* Explanatory Language Selector */}
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-slate-600">Lingua Risposte e Spiegazioni (Explanation):</span>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg">
                {(['fa', 'en', 'it'] as ExplanatoryLanguage[]).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleUpdateLanguage(lang)}
                    className={`text-xs font-bold py-1.5 px-2 rounded-md transition-all ${
                      currentProfile.language === lang
                        ? 'bg-white text-indigo-600 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {lang === 'fa' ? 'Persiano' : lang === 'en' ? 'English' : 'Italiano'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-slate-400 text-xs">Caricamento profilo in corso...</div>
      )}
    </div>
  );
}
