import React, { useState, useEffect } from 'react';
import { UserProfile, Exam, ExamAttempt } from './types';
import ProfilePanel from './components/ProfilePanel';
import Dashboard from './components/Dashboard';
import ExamWorkspace from './components/ExamWorkspace';
import ScoreReport from './components/ScoreReport';
import { staticCilsExam } from './data/staticExam';
import { Award, GraduationCap, RefreshCw, Layers } from 'lucide-react';

export default function App() {
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'exam' | 'report'>('dashboard');
  const [selectedExam, setSelectedExam] = useState<Exam>(staticCilsExam);
  const [selectedAttempt, setSelectedAttempt] = useState<ExamAttempt | null>(null);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [customExams, setCustomExams] = useState<Exam[]>([]);

  // Load user attempts & custom exams
  useEffect(() => {
    const savedAttempts = localStorage.getItem('cils_user_attempts');
    if (savedAttempts) {
      try {
        setAttempts(JSON.parse(savedAttempts));
      } catch (e) {
        console.error(e);
      }
    }

    const savedExams = localStorage.getItem('cils_ai_generated_exams');
    if (savedExams) {
      try {
        setCustomExams(JSON.parse(savedExams));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleProfileSelect = (profile: UserProfile) => {
    setCurrentProfile(profile);
  };

  const handleProfileUpdate = (profile: UserProfile) => {
    setCurrentProfile(profile);
  };

  const handleStartExam = (exam: Exam) => {
    setSelectedExam(exam);
    setActiveView('exam');
  };

  const handleFinishExam = (attempt: ExamAttempt) => {
    const updatedAttempts = [attempt, ...attempts];
    setAttempts(updatedAttempts);
    localStorage.setItem('cils_user_attempts', JSON.stringify(updatedAttempts));

    // Update profile completed counts
    if (currentProfile) {
      const updatedProfile = {
        ...currentProfile,
        completedExamsCount: currentProfile.completedExamsCount + 1,
      };
      setCurrentProfile(updatedProfile);

      // Persist profile update
      const savedProfiles = localStorage.getItem('cils_user_profiles');
      if (savedProfiles) {
        try {
          const parsed = JSON.parse(savedProfiles);
          const newList = parsed.map((p: UserProfile) => (p.id === updatedProfile.id ? updatedProfile : p));
          localStorage.setItem('cils_user_profiles', JSON.stringify(newList));
        } catch (e) {
          console.error(e);
        }
      }
    }

    setSelectedAttempt(attempt);
    setActiveView('report');
  };

  const handleSelectSavedAttempt = (attempt: ExamAttempt) => {
    setSelectedAttempt(attempt);
    setActiveView('report');
  };

  const handleBackToMenu = () => {
    setActiveView('dashboard');
    setSelectedAttempt(null);
  };

  // Merge static exam with any generated exams
  const allExams = [staticCilsExam, ...customExams];

  return (
    <div id="main-container" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased font-sans">
      {/* Top Navigation Bar in Clean Minimalism */}
      <header id="top-nav" className="sticky top-0 z-50 h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          {/* Visual Italian Flag Mini Icon */}
          <div className="flex w-6 h-4.5 rounded overflow-hidden shadow-xs border border-slate-200 shrink-0">
            <div className="w-1/3 bg-[#009246] h-full"></div>
            <div className="w-1/3 bg-[#f1f2f1] h-full"></div>
            <div className="w-1/3 bg-[#ce2b37] h-full"></div>
          </div>
          <span className="font-sans font-bold text-lg tracking-tight text-slate-900 flex items-center gap-2">
            <span>CILS B1 Cittadinanza</span>
            <span className="text-[10px] font-normal bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
              Exam Engine v2.5
            </span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">Simulatore Esame Cittadinanza Italiana</span>
          </span>
        </div>
      </header>

      {/* Main Core Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Right Column: User Profile Configurations */}
          {activeView !== 'exam' && (
            <div className="lg:col-span-1 space-y-6">
              <ProfilePanel
                currentProfile={currentProfile}
                onProfileSelect={handleProfileSelect}
                onProfileUpdate={handleProfileUpdate}
              />
            </div>
          )}

          {/* Left/Main Column: Core Views */}
          <div className={`${activeView === 'exam' || !currentProfile ? 'lg:col-span-4' : 'lg:col-span-3'} space-y-8`}>
            {activeView === 'dashboard' && currentProfile && (
              <Dashboard
                profile={currentProfile}
                attempts={attempts.filter((a) => a.profileId === currentProfile.id)}
                onSelectExam={handleStartExam}
                onSelectSavedAttempt={handleSelectSavedAttempt}
              />
            )}

            {activeView === 'exam' && currentProfile && (
              <ExamWorkspace
                exam={selectedExam}
                profile={currentProfile}
                onFinish={handleFinishExam}
                onBackToMenu={handleBackToMenu}
              />
            )}

            {activeView === 'report' && selectedAttempt && (
              <ScoreReport
                attempt={selectedAttempt}
                exams={allExams}
                onBackToMenu={handleBackToMenu}
              />
            )}

          </div>
        </div>
      </main>

      {/* Humble Elegant Minimal Footer */}
      <footer id="app-footer" className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500 font-light select-none">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Simulatore CILS Cittadinanza B1. Tutte le risorse sono gratuite e supportate dall'IA.</p>
          <div className="flex items-center gap-3 font-medium text-indigo-600">
            <span>Esame a 4 Abilità con Audio</span>
            <span>•</span>
            <span>Valutazione Descrittiva Intelligente</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
