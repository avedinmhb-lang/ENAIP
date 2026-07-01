import React, { useState, useEffect } from 'react';
import { Exam, UserProfile, ExamAttempt } from '../types';
import { staticCilsExam } from '../data/staticExam';
import {
  Award,
  BookOpen,
  Calendar,
  ChevronRight,
  Cpu,
  GraduationCap,
  History,
  Info,
  Layers,
  ListOrdered,
  Play,
  Plus,
  RefreshCw,
  Sparkles,
  Trophy,
  Volume2
} from 'lucide-react';

interface DashboardProps {
  profile: UserProfile;
  attempts: ExamAttempt[];
  onSelectExam: (exam: Exam) => void;
  onSelectSavedAttempt: (attempt: ExamAttempt) => void;
}

export default function Dashboard({ profile, attempts, onSelectExam, onSelectSavedAttempt }: DashboardProps) {
  const [loadingAiExam, setLoadingAiExam] = useState(false);
  const [loadingProgressText, setLoadingProgressText] = useState('');
  const [customExams, setCustomExams] = useState<Exam[]>([]);

  // Load any previously generated AI exams from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cils_ai_generated_exams');
    if (saved) {
      try {
        setCustomExams(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const generateNewAiExam = async () => {
    setLoadingAiExam(true);
    setLoadingProgressText('Connessione all\'IA in corso...');

    const tips = [
      'Scrittura dei dialoghi d\'ascolto in corso...',
      'Progettazione delle domande a scelta multipla e vero/falso...',
      'Generazione del testo per la comprensione scritta...',
      'Creazione dei test grammaticali con lacune...',
      'Selezione della traccia di scrittura adatta al tuo livello...',
      'Quasi completato! Ottimizzazione del test in corso...',
    ];

    let tipIndex = 0;
    const interval = setInterval(() => {
      if (tipIndex < tips.length) {
        setLoadingProgressText(tips[tipIndex]);
        tipIndex++;
      }
    }, 2500);

    try {
      const res = await fetch('/api/gemini/generate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          difficulty: profile.difficulty,
          explanatoryLanguage: profile.language,
        }),
      });

      clearInterval(interval);

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Errore di comunicazione con il server.');
      }

      const examData: Exam = await res.json();
      const updatedExams = [examData, ...customExams];
      setCustomExams(updatedExams);
      localStorage.setItem('cils_ai_generated_exams', JSON.stringify(updatedExams));
      onSelectExam(examData);
    } catch (e: any) {
      clearInterval(interval);
      console.error(e);
      alert('Sfortunatamente si è verificato un errore durante la generazione del test IA: ' + (e.message || e));
    } finally {
      setLoadingAiExam(false);
    }
  };

  const getBestScore = () => {
    if (attempts.length === 0) return 0;
    const scores = attempts.map((a) => a.score.totalScore || 0);
    return Math.max(...scores);
  };

  return (
    <div className="space-y-8 select-none">
      {/* Welcome Banner in Clean Minimalism */}
      <div className="relative overflow-hidden bg-slate-900 text-white rounded-2xl p-8 border border-slate-800 shadow-md">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Simulatore intelligente pronto</span>
          </span>
          <h1 className="text-2xl font-bold font-sans tracking-tight">Preparazione Esame Cittadinanza Italiana (CILS B1)</h1>
          <p className="text-xs text-slate-300 leading-relaxed font-light">
            Benvenuto nel simulatore intelligente e completo per la preparazione all'esame CILS B1 di cittadinanza italiana. Questo sistema è conforme alla struttura ufficiale delle prove d'esame e ti guiderà nello sviluppo di tutte le abilità linguistiche necessarie.
          </p>
        </div>
        {/* Abstract subtle shapes in background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-slate-500/10 rounded-full blur-2xl"></div>
      </div>

      {/* Stats Summary Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="bg-amber-50 text-amber-600 p-3 rounded-xl border border-amber-100">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Miglior Punteggio</p>
            <h4 className="text-base font-bold text-slate-800 font-mono mt-0.5">{getBestScore().toFixed(1)} <span className="text-xs text-slate-400 font-normal">/ 76</span></h4>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl border border-blue-100">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Esami Completati</p>
            <h4 className="text-base font-bold text-slate-800 font-mono mt-0.5">{attempts.length} <span className="text-xs text-slate-400 font-normal"> test</span></h4>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="bg-purple-50 text-purple-600 p-3 rounded-xl border border-purple-100">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Difficoltà Predefinita</p>
            <h4 className="text-xs font-bold text-slate-800 mt-1">
              {profile.difficulty === 'easy' ? 'Facile' : profile.difficulty === 'medium' ? 'Medio B1' : 'Difficile B2'}
            </h4>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="bg-green-50 text-green-600 p-3 rounded-xl border border-green-100">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lingua Spiegazioni</p>
            <h4 className="text-xs font-bold text-slate-800 mt-1">
              {profile.language === 'fa' ? 'Persiano (FA)' : profile.language === 'en' ? 'English (EN)' : 'Italiano (IT)'}
            </h4>
          </div>
        </div>
      </div>

      {/* Main Core Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 columns: Exam lists */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base font-bold text-slate-900 font-sans tracking-tight">Esami Disponibili</h3>
            {/* Generate AI test button */}
            <button
              onClick={generateNewAiExam}
              disabled={loadingAiExam}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm shadow-indigo-600/15 cursor-pointer"
            >
              {loadingAiExam ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Preparazione domande...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>Genera esame intelligente con IA</span>
                </>
              )}
            </button>
          </div>

          {loadingAiExam && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4">
              <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 animate-bounce">
                <Cpu className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">L'intelligenza artificiale sta generando nuove domande...</h4>
                <p className="text-xs text-slate-500">{loadingProgressText}</p>
              </div>
              <div className="w-48 bg-slate-100 h-1.5 rounded-full mx-auto overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full animate-pulse" style={{ width: '70%' }}></div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* 1. Official Exam */}
            <div className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-6 transition-all hover:shadow-md group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 uppercase tracking-wider">
                  Esame Benchmark Ufficiale
                </span>
                <h4 className="text-base font-bold text-slate-950 font-sans group-hover:text-indigo-600 transition-colors">
                  {staticCilsExam.title}
                </h4>
                <p className="text-xs text-slate-500">Conforme alla struttura ufficiale con 4 sezioni: Ascolto, Lettura e Grammatica, Scrittura, e Parlato con traccia audio.</p>
              </div>
              <button
                onClick={() => onSelectExam(staticCilsExam)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-5 rounded-xl flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer border border-slate-800"
              >
                <span>Inizia Esercitazione</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>

            {/* 2. Custom generated exams */}
            {customExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-6 transition-all hover:shadow-md group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 uppercase tracking-wider">
                      Esame IA personalizzato
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded uppercase font-mono">
                      {exam.difficulty}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-950 font-sans group-hover:text-indigo-600 transition-colors">
                    {exam.title}
                  </h4>
                  <p className="text-xs text-slate-500">Domande completamente nuove, varie e standardizzate generate dal motore IA.</p>
                </div>
                <button
                  onClick={() => onSelectExam(exam)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <span>Inizia Esame</span>
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 column: Study History */}
        <div className="space-y-6">
          <h3 className="text-base font-bold text-slate-900 font-sans flex items-center gap-2 tracking-tight">
            <History className="w-4.5 h-4.5 text-slate-600" />
            <span>Cronologia e Risultati</span>
          </h3>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            {attempts.length === 0 ? (
              <div className="text-center py-8 text-slate-400 space-y-2">
                <Calendar className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">Nessun risultato registrato. Inizia il tuo primo esame!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {attempts.map((att) => (
                  <div
                    key={att.id}
                    onClick={() => onSelectSavedAttempt(att)}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-between gap-2"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-slate-800 truncate max-w-[140px]">
                        {att.examId === 'cils_b1_cittadinanza_standard' ? 'Esame Standard' : 'Esame IA Personalizzato'}
                      </h5>
                      <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">{att.date}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-indigo-600 font-mono">
                        {(att.score.totalScore || 0).toFixed(1)} / 76
                      </span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">Vedi dettagli</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-[11px] text-slate-500 leading-relaxed select-text">
              <div className="flex items-center gap-1.5 text-slate-700 font-bold mb-1">
                <Info className="w-3.5 h-3.5 text-indigo-600" />
                <span>Metodologia di correzione e punteggio (CILS):</span>
              </div>
              <p>• Le sezioni di ascolto e lettura vengono corrette istantaneamente in modo automatico (max 36 punti).</p>
              <p>• Le prove di scrittura e parlato vengono valutate dall'IA in base ai criteri ufficiali dell'esame CILS (max 40 punti).</p>
              <p>• Per superare l'esame reale è necessario un punteggio minimo di 11 punti in ciascuna abilità.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
