import React, { useState, useEffect, useRef } from 'react';
import { Exam, UserProfile, ExamAttempt, Difficulty, ExplanatoryLanguage } from '../types';
import {
  Timer,
  BookOpen,
  Volume2,
  FileText,
  Mic,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Languages,
  Sparkles,
  Award,
  ChevronDown,
  Volume1,
  MessageCircle,
  Cpu,
  BadgeAlert,
  GraduationCap
} from 'lucide-react';
import AudioPlayer from './AudioPlayer';

interface ExamWorkspaceProps {
  exam: Exam;
  profile: UserProfile;
  onFinish: (attempt: ExamAttempt) => void;
  onBackToMenu: () => void;
}

export default function ExamWorkspace({ exam, profile, onFinish, onBackToMenu }: ExamWorkspaceProps) {
  // Navigation tabs: 'listening' | 'reading' | 'writing' | 'speaking'
  const [activeSection, setActiveSection] = useState<'listening' | 'reading' | 'writing' | 'speaking'>('listening');

  // Answers State
  const [listeningProva1Answers, setListeningProva1Answers] = useState<Record<string, string>>({});
  const [listeningProva2Answers, setListeningProva2Answers] = useState<Record<string, boolean>>({});
  const [readingProva1Answers, setReadingProva1Answers] = useState<Record<string, boolean>>({});
  const [readingProva2Answers, setReadingProva2Answers] = useState<Record<string, string>>({});
  const [writingText, setWritingText] = useState('');
  const [speakingText, setSpeakingText] = useState('');

  // Section-specific timer state
  const [sectionTimeRemaining, setSectionTimeRemaining] = useState<Record<'listening' | 'reading' | 'writing' | 'speaking', number>>(() => ({
    listening: exam.listening.timeLimitMinutes * 60,
    reading: exam.reading.timeLimitMinutes * 60,
    writing: exam.writing.timeLimitMinutes * 60,
    speaking: exam.speaking.timeLimitMinutes * 60,
  }));
  const [timerActive, setTimerActive] = useState(true);
  const [unlimitedTime, setUnlimitedTime] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Keep track of locked sections (time expired)
  const [lockedSections, setLockedSections] = useState<Record<'listening' | 'reading' | 'writing' | 'speaking', boolean>>({
    listening: false,
    reading: false,
    writing: false,
    speaking: false,
  });

  // Track if a banner/notification is active for expired time
  const [expiryNotification, setExpiryNotification] = useState<string | null>(null);

  const secondsRemaining = sectionTimeRemaining[activeSection];

  // UI States
  const [showTranscripts, setShowTranscripts] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState('');
  const [submittingWriting, setSubmittingWriting] = useState(false);
  const [submittingSpeaking, setSubmittingSpeaking] = useState(false);
  const [writingGrade, setWritingGrade] = useState<{ score: number; feedback: string } | null>(null);
  const [speakingGrade, setSpeakingGrade] = useState<{ score: number; feedback: string } | null>(null);

  // Self Grading / Submission status
  const [graded, setGraded] = useState(false);
  const [listeningScore, setListeningScore] = useState(0);
  const [readingScore, setReadingScore] = useState(0);
  const [showAnswerKeys, setShowAnswerKeys] = useState(false);

  const sectionsOrder: Array<'listening' | 'reading' | 'writing' | 'speaking'> = ['listening', 'reading', 'writing', 'speaking'];

  const handlePrevSection = () => {
    const currentIndex = sectionsOrder.indexOf(activeSection);
    if (currentIndex > 0) {
      setActiveSection(sectionsOrder[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextSection = () => {
    const currentIndex = sectionsOrder.indexOf(activeSection);
    if (currentIndex < sectionsOrder.length - 1) {
      setActiveSection(sectionsOrder[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Initialize timer whenever exam changes
  useEffect(() => {
    setSectionTimeRemaining({
      listening: exam.listening.timeLimitMinutes * 60,
      reading: exam.reading.timeLimitMinutes * 60,
      writing: exam.writing.timeLimitMinutes * 60,
      speaking: exam.speaking.timeLimitMinutes * 60,
    });
    setLockedSections({
      listening: false,
      reading: false,
      writing: false,
      speaking: false,
    });
    setExpiryNotification(null);
    setTimerActive(true);
  }, [exam]);

  // Timer Tick
  useEffect(() => {
    if (timerActive && !unlimitedTime && secondsRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setSectionTimeRemaining((prev) => ({
          ...prev,
          [activeSection]: Math.max(0, prev[activeSection] - 1),
        }));
      }, 1000);
    } else if (secondsRemaining === 0 && !unlimitedTime && !lockedSections[activeSection]) {
      // Section time expired!
      // 1. Lock current section
      setLockedSections((prev) => ({
        ...prev,
        [activeSection]: true,
      }));

      // 2. Automatically save progress / trigger grading if relevant
      if (activeSection === 'listening' || activeSection === 'reading') {
        // Automatically grade the objective tasks so progress is recorded
        handleGradeObjectiveTasks();
      }

      // 3. Inform user elegantly
      const sectionNameIt = 
        activeSection === 'listening' ? 'Ascolto' :
        activeSection === 'reading' ? 'Lettura' :
        activeSection === 'writing' ? 'Scrittura' : 'Parlato';
      setExpiryNotification(`Il tempo per la sezione ${sectionNameIt} è scaduto. Le tue risposte sono state salvate e questa sezione è stata bloccata.`);

      // 4. Try to switch to the next unlocked section, otherwise auto-submit exam if all sections are completed/locked!
      const sectionsOrder: Array<'listening' | 'reading' | 'writing' | 'speaking'> = ['listening', 'reading', 'writing', 'speaking'];
      const currentIndex = sectionsOrder.indexOf(activeSection);
      let nextSection: 'listening' | 'reading' | 'writing' | 'speaking' | null = null;
      
      for (let i = currentIndex + 1; i < sectionsOrder.length; i++) {
        const s = sectionsOrder[i];
        if (sectionTimeRemaining[s] > 0 && !lockedSections[s]) {
          nextSection = s;
          break;
        }
      }

      if (nextSection) {
        setActiveSection(nextSection);
      } else {
        // No remaining section with time! Auto-submit the final exam
        handleFinalSubmit();
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [secondsRemaining, timerActive, unlimitedTime, activeSection, lockedSections, sectionTimeRemaining]);

  // Format seconds to MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Web Speech API - Speech-To-Text simulation for Italian
  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecordingError('Il tuo browser non supporta il riconoscimento vocale. Usa Google Chrome.');
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = 'it-IT';
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      setIsRecording(true);
      setRecordingError('');
    };

    rec.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSpeakingText((prev) => (prev ? prev + ' ' + transcript : transcript));
    };

    rec.onerror = (event: any) => {
      setRecordingError('Si è verificato un errore. Riprova: ' + event.error);
    };

    rec.onend = () => {
      setIsRecording(false);
    };

    rec.start();
  };

  // Helper to calculate objective scores
  const calculateObjectiveScores = () => {
    // 1. Listening Prova 1 (Max 6 or 4 depending on test)
    let lis1 = 0;
    exam.listening.prova1.questions.forEach((q) => {
      const sel = listeningProva1Answers[q.id];
      if (sel && sel.toUpperCase().startsWith(q.correctAnswer.toUpperCase())) {
        lis1 += 1.5; // CILS calculation standard
      }
    });

    // 2. Listening Prova 2 (Max 12 or 6)
    let lis2 = 0;
    exam.listening.prova2.questions.forEach((q) => {
      const sel = listeningProva2Answers[q.id];
      if (sel !== undefined && sel === q.correctAnswer) {
        lis2 += 1.0;
      }
    });

    // 3. Reading Prova 1 (Max 12 or 6)
    let read1 = 0;
    exam.reading.prova1.questions.forEach((q) => {
      const sel = readingProva1Answers[q.id];
      if (sel !== undefined && sel === q.correctAnswer) {
        read1 += 1.0;
      }
    });

    // 4. Reading Prova 2 (Cloze - Max 6 or 4)
    let read2 = 0;
    exam.reading.prova2.questions.forEach((q) => {
      const sel = readingProva2Answers[q.id];
      if (sel && sel.toUpperCase().startsWith(q.correctAnswer.toUpperCase())) {
        read2 += 1.5;
      }
    });

    const lScore = parseFloat((lis1 + lis2).toFixed(1));
    const rScore = parseFloat((read1 + read2).toFixed(1));

    return { lScore, rScore };
  };

  // Grade Objective Tasks
  const handleGradeObjectiveTasks = () => {
    const { lScore, rScore } = calculateObjectiveScores();
    setListeningScore(lScore);
    setReadingScore(rScore);
    setGraded(true);
    setShowAnswerKeys(true);
  };

  // Ask AI to Grade Writing
  const handleGradeWritingWithAI = async () => {
    if (!writingText.trim()) return;
    setSubmittingWriting(true);
    setWritingGrade(null);

    try {
      const res = await fetch('/api/gemini/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'writing',
          prompt: exam.writing.prompt,
          submissionText: writingText,
          explanatoryLanguage: profile.language,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setWritingGrade(data);
      } else {
        alert(data.error || 'Si è verificato un errore.');
      }
    } catch (e) {
      console.error(e);
      alert('Errore di connessione con il server.');
    } finally {
      setSubmittingWriting(false);
    }
  };

  // Ask AI to Grade Speaking
  const handleGradeSpeakingWithAI = async () => {
    if (!speakingText.trim()) return;
    setSubmittingSpeaking(true);
    setSpeakingGrade(null);

    try {
      const res = await fetch('/api/gemini/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'speaking',
          prompt: exam.speaking.prova1RoleplayPrompt + '\n' + exam.speaking.prova2MonologuePrompt,
          submissionText: speakingText,
          explanatoryLanguage: profile.language,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSpeakingGrade(data);
      } else {
        alert(data.error || 'Si è verificato un errore.');
      }
    } catch (e) {
      console.error(e);
      alert('Errore di connessione con il server.');
    } finally {
      setSubmittingSpeaking(false);
    }
  };

  const handleFinalSubmit = () => {
    const { lScore, rScore } = calculateObjectiveScores();
    setListeningScore(lScore);
    setReadingScore(rScore);
    setGraded(true);
    setShowAnswerKeys(true);

    const attempt: ExamAttempt = {
      id: 'attempt_' + Date.now(),
      profileId: profile.id,
      examId: exam.id,
      date: new Date().toLocaleDateString('fa-IR'),
      answers: {
        listeningProva1: listeningProva1Answers,
        listeningProva2: listeningProva2Answers,
        readingProva1: readingProva1Answers,
        readingProva2: readingProva2Answers,
        writingText,
        speakingTranscript: speakingText,
      },
      score: {
        listeningScore: lScore,
        readingScore: rScore,
        writingScore: writingGrade?.score,
        speakingScore: speakingGrade?.score,
        totalScore: (lScore || 0) + (rScore || 0) + (writingGrade?.score || 0) + (speakingGrade?.score || 0),
        isGraded: true,
        feedback: {
          writingFeedback: writingGrade?.feedback,
          speakingFeedback: speakingGrade?.feedback,
          generalSuggestions: 'Eccellente! La pratica costante è la chiave per superare l\'esame CILS.',
        },
      },
    };

    onFinish(attempt);
  };

  // Count words
  const getWordCount = (text: string) => {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  };

  return (
    <div className="space-y-8">
      {/* Test Title Bar in Clean Minimalism */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div>
          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
            {exam.isAiGenerated ? 'Generato dall\'IA (AI Exam)' : 'Esame Ufficiale di Simulazione (CILS Standard)'}
          </span>
          <h2 className="text-xl font-bold font-sans text-slate-900 mt-2 tracking-tight">{exam.title}</h2>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 font-medium">
            <span>Difficoltà: {exam.difficulty === 'easy' ? 'Facile' : exam.difficulty === 'medium' ? 'Medio B1' : 'Difficile B2'}</span>
            <span>•</span>
            <span>Lingua Analisi: {profile.language === 'fa' ? 'Persiano' : profile.language === 'en' ? 'English' : 'Italiano'}</span>
          </p>
        </div>

        {/* Timer Control panel */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl">
          <div className="flex items-center gap-2">
            <Timer className={`w-4.5 h-4.5 ${secondsRemaining < 120 && !unlimitedTime ? 'text-rose-500 animate-bounce' : 'text-slate-500'}`} />
            <span className={`text-base font-mono font-bold ${secondsRemaining < 120 && !unlimitedTime ? 'text-rose-500 font-extrabold' : 'text-slate-800'}`}>
              {unlimitedTime ? '∞' : formatTime(secondsRemaining)}
            </span>
          </div>

          <div className="border-l border-slate-200 h-6 mx-1"></div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimerActive(!timerActive)}
              className="text-xs bg-white border border-slate-200 hover:bg-slate-100 px-2 py-1.5 rounded-lg text-slate-600 font-bold transition-colors cursor-pointer"
            >
              {timerActive ? 'Pausa Timer' : 'Avvia'}
            </button>
            <button
              onClick={() => setUnlimitedTime(!unlimitedTime)}
              className={`text-xs px-2 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                unlimitedTime ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Senza limite di tempo
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation for Sections */}
      <div className="flex flex-wrap border-b border-slate-200 gap-1">
        {(['listening', 'reading', 'writing', 'speaking'] as const).map((sect) => {
          const isLocked = lockedSections[sect];
          const timeText = unlimitedTime ? '∞' : formatTime(sectionTimeRemaining[sect]);
          return (
            <button
              key={sect}
              onClick={() => setActiveSection(sect)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs transition-all cursor-pointer ${
                activeSection === sect
                  ? 'border-indigo-600 text-indigo-600 font-bold bg-indigo-50/20'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              {sect === 'listening' && <Volume2 className="w-4 h-4 text-indigo-600" />}
              {sect === 'reading' && <BookOpen className="w-4 h-4 text-indigo-600" />}
              {sect === 'writing' && <FileText className="w-4 h-4 text-indigo-600" />}
              {sect === 'speaking' && <Mic className="w-4 h-4 text-indigo-600" />}
              
              <span>
                {sect === 'listening' ? '1. Ascolto (Ascolto)' :
                 sect === 'reading' ? '2. Comprensione della Lettura (Lettura)' :
                 sect === 'writing' ? '3. Produzione Scritta (Scrittura)' :
                 '4. Produzione Orale (Parlato)'}
              </span>

              {isLocked ? (
                <span className="bg-rose-50 text-rose-600 border border-rose-100 px-1.5 py-0.5 rounded text-[9px] font-sans font-bold">
                  Bloccato
                </span>
              ) : (
                <span className="bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold">
                  {timeText}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {expiryNotification && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-900 text-xs animate-fade-in relative">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Tempo scaduto per questa sezione!</p>
            <p className="mt-1 text-amber-800 select-text leading-relaxed">{expiryNotification}</p>
          </div>
          <button 
            onClick={() => setExpiryNotification(null)}
            className="absolute top-3 left-3 text-amber-600 hover:text-amber-800 font-bold text-xs cursor-pointer"
          >
            Chiudi
          </button>
        </div>
      )}

      {/* Dynamic Section Contents */}
      <div id="section-contents" className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-sm">
        {/* LISTENING SECTION */}
        {activeSection === 'listening' && (
          <div className="space-y-8">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold font-sans text-slate-800 flex items-center gap-2">
                <Volume2 className="text-blue-600 w-5 h-5" />
                <span>{exam.listening.title}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-2">{exam.listening.instructions}</p>
            </div>

            {/* AI Audio simulation player */}
            <AudioPlayer transcript={exam.listening.prova1.audioTranscript + '\n' + exam.listening.prova2.audioTranscript} />

            {/* Trancript Panel Toggle */}
            <div>
              <button
                onClick={() => setShowTranscripts(!showTranscripts)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{showTranscripts ? "Nascondi trascrizione dell'audio" : "Mostra trascrizione dell'audio (Trascrizione / Help)"}</span>
              </button>
              {showTranscripts && (
                <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-150 text-slate-700 text-sm font-mono leading-relaxed max-h-72 overflow-y-auto whitespace-pre-line select-text">
                  {exam.listening.prova1.audioTranscript}
                  <br />
                  <br />
                  <span className="font-bold block border-t border-slate-200 pt-3">Prova 2</span>
                  {exam.listening.prova2.audioTranscript}
                </div>
              )}
            </div>

            {/* Prova 1 */}
            <div className="space-y-5 pt-4">
              <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-emerald-600">
                <h4 className="text-sm font-bold text-slate-700">Ascolto - Prova n. 1</h4>
                <p className="text-xs text-slate-500 mt-1">{exam.listening.prova1.instructions}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {exam.listening.prova1.questions.map((q, idx) => (
                  <div key={q.id} className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm space-y-4">
                    <p className="text-sm font-semibold text-slate-800">{q.text}</p>
                    <div className="space-y-2">
                      {q.options.map((opt) => (
                        <label
                          key={opt}
                          className={`flex items-start gap-3 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                            listeningProva1Answers[q.id] === opt.substring(0, 1)
                              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
                              : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-600'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`l1_${q.id}`}
                            value={opt.substring(0, 1)}
                            checked={listeningProva1Answers[q.id] === opt.substring(0, 1)}
                            onChange={(e) =>
                              setListeningProva1Answers({ ...listeningProva1Answers, [q.id]: e.target.value })
                            }
                            className="mt-0.5 accent-emerald-600"
                            disabled={showAnswerKeys || lockedSections.listening}
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>

                    {showAnswerKeys && (
                      <div className="mt-2 text-xs p-3 bg-slate-50 rounded-lg border border-slate-150 space-y-1">
                        <p className="font-semibold text-slate-700">
                          Risposta corretta: <span className="text-emerald-700 font-mono font-bold">{q.correctAnswer}</span>
                        </p>
                        <p className="text-slate-500 text-[11px] leading-relaxed select-text">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Prova 2 */}
            <div className="space-y-5 pt-8 border-t border-slate-100">
              <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-emerald-600">
                <h4 className="text-sm font-bold text-slate-700">Ascolto - Prova n. 2</h4>
                <p className="text-xs text-slate-500 mt-1">{exam.listening.prova2.instructions}</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                      <th className="p-3 text-left">Affermazioni</th>
                      <th className="p-3 text-center w-24">VERO</th>
                      <th className="p-3 text-center w-24">FALSO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exam.listening.prova2.questions.map((q, idx) => (
                      <tr key={q.id} className="border-b border-slate-100 hover:bg-slate-50/50" dir="ltr">
                        <td className="p-3 font-medium text-slate-800 text-left select-text">{q.text}</td>
                        <td className="p-3 text-center">
                          <input
                            type="radio"
                            name={`l2_${q.id}`}
                            checked={listeningProva2Answers[q.id] === true}
                            onChange={() => !lockedSections.listening && setListeningProva2Answers({ ...listeningProva2Answers, [q.id]: true })}
                            className="accent-emerald-600 w-4 h-4"
                            disabled={showAnswerKeys || lockedSections.listening}
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="radio"
                            name={`l2_${q.id}`}
                            checked={listeningProva2Answers[q.id] === false}
                            onChange={() => !lockedSections.listening && setListeningProva2Answers({ ...listeningProva2Answers, [q.id]: false })}
                            className="accent-rose-600 w-4 h-4"
                            disabled={showAnswerKeys || lockedSections.listening}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {showAnswerKeys && (
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h5 className="font-bold text-xs text-slate-700">Spiegazioni dettagliate per la prova 2 d'ascolto:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                    {exam.listening.prova2.questions.map((q) => (
                      <div key={q.id} className="p-2.5 bg-white border border-slate-150 rounded-lg">
                        <span className="font-semibold text-slate-700 block truncate">{q.text}</span>
                        <span className="text-emerald-700 font-bold">[{q.correctAnswer ? 'VERO' : 'FALSO'}]</span> -{' '}
                        <span className="text-slate-500 select-text">{q.explanation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sezioni Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-150 mt-8">
                <button
                  type="button"
                  onClick={handlePrevSection}
                  disabled={activeSection === 'listening'}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Precedente (قبلی)</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextSection}
                  disabled={activeSection === 'speaking'}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                >
                  <span>Successivo (بعدی)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* READING SECTION */}
        {activeSection === 'reading' && (
          <div className="space-y-8">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold font-sans text-slate-800 flex items-center gap-2">
                <BookOpen className="text-emerald-600 w-5 h-5" />
                <span>{exam.reading.title}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-2">{exam.reading.instructions}</p>
            </div>

            {/* Prova 1 */}
            <div className="space-y-5">
              <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-emerald-600">
                <h4 className="text-sm font-bold text-slate-700">Comprensione della lettura - Prova n. 1</h4>
                <p className="text-xs text-slate-500 mt-1">Leggi attentamente il testo e indica se le affermazioni sono vere o false.</p>
              </div>

              <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 select-text">
                <h4 className="text-base font-bold text-slate-800 mb-3 text-center">{exam.reading.prova1.title}</h4>
                <div className="text-sm text-slate-700 leading-relaxed space-y-4 whitespace-pre-line">
                  {exam.reading.prova1.text}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                      <th className="p-3 text-left">Affermazioni relative al testo</th>
                      <th className="p-3 text-center w-24">VERO</th>
                      <th className="p-3 text-center w-24">FALSO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exam.reading.prova1.questions.map((q) => (
                      <tr key={q.id} className="border-b border-slate-100 hover:bg-slate-50/50" dir="ltr">
                        <td className="p-3 font-medium text-slate-800 text-left select-text">{q.text}</td>
                        <td className="p-3 text-center">
                          <input
                            type="radio"
                            name={`r1_${q.id}`}
                            checked={readingProva1Answers[q.id] === true}
                            onChange={() => !lockedSections.reading && setReadingProva1Answers({ ...readingProva1Answers, [q.id]: true })}
                            className="accent-emerald-600 w-4 h-4"
                            disabled={showAnswerKeys || lockedSections.reading}
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="radio"
                            name={`r1_${q.id}`}
                            checked={readingProva1Answers[q.id] === false}
                            onChange={() => !lockedSections.reading && setReadingProva1Answers({ ...readingProva1Answers, [q.id]: false })}
                            className="accent-rose-600 w-4 h-4"
                            disabled={showAnswerKeys || lockedSections.reading}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {showAnswerKeys && (
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h5 className="font-bold text-xs text-slate-700">Spiegazioni dettagliate della sezione lettura:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                    {exam.reading.prova1.questions.map((q) => (
                      <div key={q.id} className="p-2.5 bg-white border border-slate-150 rounded-lg">
                        <span className="font-semibold text-slate-700 block truncate">{q.text}</span>
                        <span className="text-emerald-700 font-bold">[{q.correctAnswer ? 'VERO' : 'FALSO'}]</span> -{' '}
                        <span className="text-slate-500 select-text">{q.explanation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Prova 2 */}
            <div className="space-y-5 pt-8 border-t border-slate-100">
              <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-emerald-600">
                <h4 className="text-sm font-bold text-slate-700">Comprensione della lettura e riflessione grammaticale - Prova n. 2</h4>
                <p className="text-xs text-slate-500 mt-1">Completa il testo. Per ogni spazio vuoto, seleziona la parola corretta tra le opzioni proposte.</p>
              </div>

              <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 leading-relaxed text-sm text-slate-700 select-text whitespace-pre-line">
                <h4 className="text-base font-bold text-slate-800 mb-3 text-center">{exam.reading.prova2.title}</h4>
                {exam.reading.prova2.textWithGaps}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exam.reading.prova2.questions.map((q) => (
                  <div key={q.id} className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800 mb-3">{q.text}</p>
                      <div className="grid grid-cols-3 gap-2">
                        {q.options.map((opt) => (
                          <button
                            key={opt}
                            disabled={showAnswerKeys || lockedSections.reading}
                            onClick={() => !lockedSections.reading && setReadingProva2Answers({ ...readingProva2Answers, [q.id]: opt.substring(0, 1) })}
                            className={`text-xs py-2 px-1 rounded-lg border font-medium transition-all ${
                              readingProva2Answers[q.id] === opt.substring(0, 1)
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {showAnswerKeys && (
                      <div className="mt-3 text-[11px] p-2.5 bg-slate-50 rounded-lg border border-slate-150">
                        <p className="font-semibold text-slate-700">
                          Risposta corretta: <span className="text-emerald-700 font-bold">{q.correctAnswer}</span>
                        </p>
                        <p className="text-slate-500 mt-0.5 select-text">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sezioni Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-150 mt-8">
              <button
                type="button"
                onClick={handlePrevSection}
                disabled={activeSection === 'listening'}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Precedente (قبلی)</span>
              </button>
              <button
                type="button"
                onClick={handleNextSection}
                disabled={activeSection === 'speaking'}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
              >
                <span>Successivo (بعدی)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* WRITING SECTION */}
        {activeSection === 'writing' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold font-sans text-slate-800 flex items-center gap-2">
                <FileText className="text-amber-600 w-5 h-5" />
                <span>{exam.writing.title}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-2">{exam.writing.instructions}</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 select-text">
              <h4 className="text-sm font-bold text-slate-800 mb-2">Traccia (Prompt):</h4>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{exam.writing.prompt}</p>
              <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-500">
                <span>Limite di parole consentite:</span>
                <span className="bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-mono">
                  {exam.writing.minWords} - {exam.writing.maxWords} parole
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">Digita qui la tua produzione scritta in italiano:</label>
              <textarea
                value={writingText}
                onChange={(e) => setWritingText(e.target.value)}
                rows={8}
                placeholder={lockedSections.writing ? "La sezione scrittura è bloccata e non può essere modificata." : "Scrivi qui il tuo testo in italiano..."}
                className="w-full text-sm border border-slate-200 rounded-xl p-4 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-mono leading-relaxed disabled:bg-slate-50"
                disabled={submittingWriting || lockedSections.writing}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs font-medium text-slate-500">
                  Conteggio parole:{' '}
                  <span
                    className={`font-mono font-bold ${
                      getWordCount(writingText) >= exam.writing.minWords && getWordCount(writingText) <= exam.writing.maxWords
                        ? 'text-emerald-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {getWordCount(writingText)} parole
                  </span>
                </div>
                <button
                  onClick={handleGradeWritingWithAI}
                  disabled={submittingWriting || !writingText.trim() || lockedSections.writing}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  {submittingWriting ? (
                    <>
                      <Cpu className="w-4 h-4 animate-spin" />
                      <span>Correzione con IA in corso...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Valuta e correggi con IA (AI Evaluate)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {writingGrade && (
              <div className="bg-gradient-to-br from-indigo-50/70 to-blue-50/50 border border-indigo-100 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-indigo-100 pb-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="text-indigo-600 w-5 h-5" />
                    <h4 className="font-sans text-sm font-bold text-indigo-900">Risultato della correzione IA (Produzione Scritta)</h4>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white border border-indigo-200 px-3 py-1.5 rounded-xl">
                    <span className="text-xs text-slate-500 font-medium">Punteggio conseguito:</span>
                    <span className="text-base font-bold text-indigo-700 font-mono">{writingGrade.score}</span>
                    <span className="text-xs text-slate-400 font-medium">/ ۲۰</span>
                  </div>
                </div>
                <div className="text-xs text-slate-700 leading-relaxed select-text space-y-2 prose prose-slate max-w-none">
                  {/* Explanations rendering */}
                  <div className="whitespace-pre-line text-sm">{writingGrade.feedback}</div>
                </div>
              </div>
            )}

            {/* Sezioni Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-150 mt-8">
              <button
                type="button"
                onClick={handlePrevSection}
                disabled={activeSection === 'listening'}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Precedente (قبلی)</span>
              </button>
              <button
                type="button"
                onClick={handleNextSection}
                disabled={activeSection === 'speaking'}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
              >
                <span>Successivo (بعدی)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SPEAKING SECTION */}
        {activeSection === 'speaking' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold font-sans text-slate-800 flex items-center gap-2">
                <Mic className="text-indigo-600 w-5 h-5" />
                <span>{exam.speaking.title}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-2">{exam.speaking.instructions}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 select-text">
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Ruolo interattivo</span>
                <h4 className="text-xs font-bold text-slate-800 mt-1.5 mb-2">Prova 1: Interazione</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{exam.speaking.prova1RoleplayPrompt}</p>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 select-text">
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Monologo personale</span>
                <h4 className="text-xs font-bold text-slate-800 mt-1.5 mb-2">Prova 2: Monologo</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{exam.speaking.prova2MonologuePrompt}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-600">Digita o registra il testo del tuo discorso orale:</label>
                <button
                  type="button"
                  onClick={startSpeechRecognition}
                  disabled={lockedSections.speaking}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 ${
                    isRecording
                      ? 'bg-rose-100 text-rose-700 animate-pulse border border-rose-200'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isRecording ? 'Registrazione in corso (italiano)...' : 'Dettatura vocale intelligente (Speech to Text)'}</span>
                </button>
              </div>

              {recordingError && <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2 rounded-lg">{recordingError}</p>}

              <textarea
                value={speakingText}
                onChange={(e) => setSpeakingText(e.target.value)}
                rows={6}
                placeholder={lockedSections.speaking ? "La sezione di produzione orale è bloccata e non può essere modificata." : "Digita qui la trascrizione del tuo discorso o usa la registrazione vocale..."}
                className="w-full text-sm border border-slate-200 rounded-xl p-4 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-mono leading-relaxed disabled:bg-slate-50"
                disabled={submittingSpeaking || lockedSections.speaking}
              />

              <div className="flex justify-end">
                <button
                  onClick={handleGradeSpeakingWithAI}
                  disabled={submittingSpeaking || !speakingText.trim() || lockedSections.speaking}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  {submittingSpeaking ? (
                    <>
                      <Cpu className="w-4 h-4 animate-spin" />
                      <span>Analisi di accento e grammatica in corso...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Analizza pronuncia e valuta con IA</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {speakingGrade && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="text-indigo-600 w-5 h-5" />
                    <h4 className="font-sans text-xs font-bold text-slate-800">Risultato dell'analisi del discorso IA (Produzione Orale)</h4>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
                    <span className="text-xs text-slate-500 font-medium">Punteggio:</span>
                    <span className="text-sm font-bold text-indigo-600 font-mono">{speakingGrade.score}</span>
                    <span className="text-xs text-slate-400 font-medium">/ ۲۰</span>
                  </div>
                </div>
                <div className="text-xs text-slate-600 leading-relaxed select-text space-y-2 max-w-none">
                  <div className="whitespace-pre-line">{speakingGrade.feedback}</div>
                </div>
              </div>
            )}

            {/* Sezioni Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-150 mt-8">
              <button
                type="button"
                onClick={handlePrevSection}
                disabled={activeSection === 'listening'}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Precedente (قبلی)</span>
              </button>
              <button
                type="button"
                onClick={handleNextSection}
                disabled={activeSection === 'speaking'}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
              >
                <span>Successivo (بعدی)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main grading and final submission footer */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div>
          <h4 className="text-base font-bold tracking-tight">Completa l'Esame e Registra i Risultati</h4>
          <p className="text-xs text-slate-400 mt-1">Dopo aver completato tutte le sezioni, premi il pulsante per ricevere il tuo rapporto di valutazione finale.</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {!graded ? (
            <button
              onClick={handleGradeObjectiveTasks}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Valuta sezioni a risposta multipla (Listening & Reading)
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-mono">
              <span>Ascolto: <strong className="text-indigo-300">{listeningScore}</strong></span>
              <span>•</span>
              <span>Lettura: <strong className="text-indigo-300">{readingScore}</strong></span>
            </div>
          )}

          <button
            onClick={handleFinalSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-6 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm shadow-indigo-600/30 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Invia l'esame e vedi il rapporto</span>
          </button>
        </div>
      </div>
    </div>
  );
}
