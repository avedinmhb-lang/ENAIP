import React from 'react';
import { ExamAttempt, Exam } from '../types';
import { staticCilsExam } from '../data/staticExam';
import { Award, Calendar, Check, Clipboard, List, Trophy, ArrowRight, BookOpen, Volume2, FileText, Mic, AlertCircle } from 'lucide-react';

interface ScoreReportProps {
  attempt: ExamAttempt;
  exams: Exam[];
  onBackToMenu: () => void;
}

export default function ScoreReport({ attempt, exams, onBackToMenu }: ScoreReportProps) {
  // Find associated exam title
  const associatedExam = exams.find((e) => e.id === attempt.examId) || staticCilsExam;

  // CILS passing threshold is typically 11 points out of 20 (or equivalent ratio)
  // For standard: Listening max 18, Reading max 18, Writing max 20, Speaking max 20. Total max 76.
  // Proportional score calculations
  const listeningPassed = attempt.score.listeningScore >= 10;
  const readingPassed = attempt.score.readingScore >= 10;
  const writingPassed = attempt.score.writingScore !== undefined ? attempt.score.writingScore >= 11 : true;
  const speakingPassed = attempt.score.speakingScore !== undefined ? attempt.score.speakingScore >= 11 : true;

  const totalScore = attempt.score.totalScore || 0;
  const passedExam = listeningPassed && readingPassed && writingPassed && speakingPassed && totalScore >= 44;

  return (
    <div className="space-y-8 select-none">
      {/* Report Header Banner in Clean Minimalism */}
      <div className="rounded-2xl p-8 text-white relative overflow-hidden shadow-md bg-slate-900 border border-slate-800">
        <div className="relative z-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-white/10 border border-white/20 px-3 py-1 rounded-full uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-indigo-300" />
            <span>Rapporto finale emesso il: {attempt.date}</span>
          </span>
          <h2 className="text-2xl font-bold font-sans tracking-tight">Rapporto di Valutazione Finale dell'Esame</h2>
          <p className="text-xs text-slate-300 font-light">
            {associatedExam.title} • Livello di difficoltà: {associatedExam.difficulty === 'easy' ? 'Facile' : associatedExam.difficulty === 'medium' ? 'Medio B1' : 'Difficile B2'}
          </p>
        </div>
        {/* Background visual cue */}
        <div className="absolute top-1/2 right-10 transform -translate-y-1/2 opacity-5 pointer-events-none">
          <Award className="w-48 h-48" />
        </div>
      </div>

      {/* Grid: Big Score Circle & Skill-by-Skill bar breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Big Score Summary card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Punteggio Totale Conseguito</span>
          <div className="relative flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-40 h-40 transform -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke={passedExam ? '#6366f1' : '#64748b'}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={439.8}
                strokeDashoffset={439.8 - (439.8 * totalScore) / 76}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold font-mono text-slate-800">{totalScore.toFixed(1)}</span>
              <span className="text-xs text-slate-400 font-medium">su 76 punti</span>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className={`text-sm font-bold ${passedExam ? 'text-indigo-600' : 'text-slate-700'}`}>
              {passedExam ? 'Idoneo (Superato)' : 'Non Idoneo (Riprova)'}
            </h4>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed select-text">
              {passedExam
                ? 'Congratulazioni! I tuoi punteggi in tutte le abilità superano la soglia minima per il CILS B1.'
                : 'Per superare l\'esame è necessario ottenere un punteggio minimo in ogni sezione (almeno 11/20 per scritto/parlato, 10/18 per ascolto/lettura) e un totale di almeno 44 punti.'}
            </p>
          </div>
        </div>

        {/* Skill-by-Skill Section Scores */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 justify-between flex flex-col">
          <h3 className="text-xs font-bold text-slate-400 font-sans uppercase tracking-widest pb-3 border-b border-slate-200">Dettagli dei Punteggi per Abilità</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Listening */}
            <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-indigo-600" />
                  <span>1. Ascolto (Ascolto)</span>
                </span>
                <span className="font-mono font-bold text-slate-800">{attempt.score.listeningScore} / 18</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${(attempt.score.listeningScore / 18) * 100}%` }}></div>
              </div>
              <span className={`text-[10px] font-bold block ${listeningPassed ? 'text-indigo-600' : 'text-rose-500'}`}>
                {listeningPassed ? '✓ Superato (Pass)' : '✗ Sotto la soglia minima'}
              </span>
            </div>

            {/* Reading */}
            <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>2. Comprensione della Lettura (Lettura)</span>
                </span>
                <span className="font-mono font-bold text-slate-800">{attempt.score.readingScore} / 18</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${(attempt.score.readingScore / 18) * 100}%` }}></div>
              </div>
              <span className={`text-[10px] font-bold block ${readingPassed ? 'text-indigo-600' : 'text-rose-500'}`}>
                {readingPassed ? '✓ Superato (Pass)' : '✗ Sotto la soglia minima'}
              </span>
            </div>

            {/* Writing */}
            <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-4.5 h-4.5 text-indigo-600" />
                  <span>3. Produzione Scritta (Scrittura)</span>
                </span>
                <span className="font-mono font-bold text-slate-800">
                  {attempt.score.writingScore !== undefined ? `${attempt.score.writingScore} / 20` : 'Non valutato'}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${((attempt.score.writingScore || 0) / 20) * 100}%` }}></div>
              </div>
              <span className={`text-[10px] font-bold block ${writingPassed ? 'text-indigo-600' : 'text-rose-500'}`}>
                {attempt.score.writingScore !== undefined
                  ? writingPassed
                    ? '✓ Superato (Pass)'
                    : '✗ Sotto la soglia minima'
                  : 'Usa il pulsante di valutazione IA durante l\'esame per valutare la produzione scritta.'}
              </span>
            </div>

            {/* Speaking */}
            <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-indigo-600" />
                  <span>4. Produzione Orale (Parlato)</span>
                </span>
                <span className="font-mono font-bold text-slate-800">
                  {attempt.score.speakingScore !== undefined ? `${attempt.score.speakingScore} / 20` : 'Non valutato'}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${((attempt.score.speakingScore || 0) / 20) * 100}%` }}></div>
              </div>
              <span className={`text-[10px] font-bold block ${speakingPassed ? 'text-indigo-600' : 'text-rose-500'}`}>
                {attempt.score.speakingScore !== undefined
                  ? speakingPassed
                    ? '✓ Superato (Pass)'
                    : '✗ Sotto la soglia minima'
                  : 'Usa il pulsante di valutazione IA durante l\'esame per valutare la produzione orale.'}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              onClick={onBackToMenu}
              className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white py-2 px-4 rounded-lg flex items-center gap-1 transition-all border border-slate-800 cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Torna alla Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Submissions Detail Panels for Review */}
      <div className="space-y-6">
        <h3 className="text-base font-bold text-slate-900 font-sans tracking-tight">Revisione Dettagliata delle Prove Scritte e Orali (Detailed Review)</h3>

        {/* Writing review */}
        {attempt.answers.writingText && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 pb-2.5 border-b border-slate-200">
              <FileText className="w-4.5 h-4.5 text-indigo-600" />
              <span>Il tuo testo inviato per la Produzione Scritta (Your Essay)</span>
            </h4>
            <blockquote className="p-4 bg-slate-50 border-r-4 border-indigo-600 rounded-xl text-xs font-mono text-slate-700 leading-relaxed whitespace-pre-line select-text">
              {attempt.answers.writingText}
            </blockquote>

            {attempt.score.feedback?.writingFeedback ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 select-text">
                <h5 className="text-xs font-bold text-slate-900">Analisi grammaticale e suggerimenti correttivi dell'IA:</h5>
                <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line prose max-w-none">
                  {attempt.score.feedback.writingFeedback}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400">L'analisi dell'IA non è disponibile per questa sezione.</p>
            )}
          </div>
        )}

        {/* Speaking review */}
        {attempt.answers.speakingTranscript && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 pb-2.5 border-b border-slate-200">
              <Mic className="w-4.5 h-4.5 text-indigo-600" />
              <span>Trascrizione del tuo discorso registrato (Your Speaking Audio)</span>
            </h4>
            <blockquote className="p-4 bg-slate-50 border-r-4 border-indigo-600 rounded-xl text-xs font-mono text-slate-700 leading-relaxed whitespace-pre-line select-text">
              {attempt.answers.speakingTranscript}
            </blockquote>

            {attempt.score.feedback?.speakingFeedback ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 select-text">
                <h5 className="text-xs font-bold text-slate-900">Analisi della pronuncia, dell'accento e della struttura dell'IA:</h5>
                <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line prose max-w-none">
                  {attempt.score.feedback.speakingFeedback}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400">L'analisi dell'IA non è disponibile per questa sezione.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
