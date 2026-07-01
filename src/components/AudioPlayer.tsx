import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, Info, CheckCircle2 } from 'lucide-react';

interface AudioPlayerProps {
  transcript: string;
}

export default function AudioPlayer({ transcript }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [selectedRate, setSelectedRate] = useState(0.85); // slightly slower is ideal for learning Italian
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
      setVoiceAvailable(true);
    }
    return () => {
      stopAudio();
    };
  }, []);

  const startAudio = (rateOverride?: number) => {
    if (!synthRef.current) return;

    let rate = selectedRate;
    if (typeof rateOverride === 'number' && !isNaN(rateOverride)) {
      rate = rateOverride;
    }

    // If it's currently paused and no rate change, resume
    if (isPaused && rateOverride === undefined) {
      synthRef.current.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    // Cancel anything currently playing first
    synthRef.current.cancel();

    const cleanText = transcript
      .replace(/Dialogo \d+:/g, '')
      .replace(/Testo \w+:/g, '')
      .replace(/[A-Z]:/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'it-IT';
    utterance.rate = rate;

    // Try to find a native Italian voice
    const voices = synthRef.current.getVoices();
    const italianVoice = voices.find((v) => v.lang.startsWith('it-IT'));
    if (italianVoice) {
      utterance.voice = italianVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const pauseAudio = () => {
    if (synthRef.current && isPlaying) {
      synthRef.current.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const stopAudio = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 p-2.5 rounded-xl text-blue-700">
          <Volume2 className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Simulatore Audio dell'Esame (Italian Voice Simulation)</h4>
          <p className="text-xs text-slate-500">Usa i controlli sottostanti per ascoltare il brano audio.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Speed rate adjustment */}
        <div className="flex items-center gap-1.5 mr-2">
          <span className="text-xs text-slate-500 font-medium">Velocità di lettura:</span>
          <select
            value={selectedRate}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setSelectedRate(val);
              if (isPlaying || isPaused) {
                if (synthRef.current) {
                  synthRef.current.cancel();
                }
                setTimeout(() => {
                  startAudio(val);
                }, 100);
              }
            }}
            className="text-xs bg-white border border-slate-200 rounded-md py-1 px-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700"
          >
            <option value="0.7">Lento (0.7x)</option>
            <option value="0.85">Didattico (0.85x)</option>
            <option value="1.0">Normale (1.0x)</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          {isPlaying ? (
            <button
              onClick={pauseAudio}
              className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-2 rounded-lg flex items-center justify-center transition-all"
              title="Pause"
            >
              <Pause className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => startAudio()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-1.5 px-4 rounded-lg flex items-center gap-1.5 text-xs transition-all shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isPaused ? 'Riprendi' : 'Riproduci Audio'}</span>
            </button>
          )}

          {(isPlaying || isPaused) && (
            <button
              onClick={stopAudio}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 p-2 rounded-lg flex items-center justify-center transition-all"
              title="Stop"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
