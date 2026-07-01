export type Difficulty = 'easy' | 'medium' | 'hard';
export type ExplanatoryLanguage = 'fa' | 'en' | 'it';

export interface UserProfile {
  id: string;
  name: string;
  difficulty: Difficulty;
  language: ExplanatoryLanguage;
  completedExamsCount: number;
  joinedAt: string;
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'cloze';

export interface BaseQuestion {
  id: string;
  text: string;
  type: QuestionType;
  explanation?: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice';
  options: string[]; // typically A, B, C or specific words
  correctAnswer: string; // e.g., 'A', 'B', 'C'
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true_false';
  correctAnswer: boolean; // true = Vero, false = Falso
}

export interface ClozeQuestion extends BaseQuestion {
  type: 'cloze';
  options: string[]; // typically A, B, C for that gap
  correctAnswer: string; // e.g., 'A', 'B', 'C'
}

export type Question = MultipleChoiceQuestion | TrueFalseQuestion | ClozeQuestion;

export interface ListeningSection {
  title: string;
  instructions: string;
  timeLimitMinutes: number;
  prova1: {
    instructions: string;
    audioTranscript: string;
    questions: MultipleChoiceQuestion[];
  };
  prova2: {
    instructions: string;
    audioTranscript: string;
    questions: TrueFalseQuestion[];
  };
}

export interface ReadingSection {
  title: string;
  instructions: string;
  timeLimitMinutes: number;
  prova1: {
    title: string;
    text: string;
    questions: TrueFalseQuestion[];
  };
  prova2: {
    title: string;
    textWithGaps: string;
    questions: ClozeQuestion[]; // 1 to 6 gaps
  };
}

export interface WritingSection {
  title: string;
  instructions: string;
  timeLimitMinutes: number;
  prompt: string;
  minWords: number;
  maxWords: number;
}

export interface SpeakingSection {
  title: string;
  instructions: string;
  timeLimitMinutes: number;
  prova1RoleplayPrompt: string;
  prova2MonologuePrompt: string;
}

export interface Exam {
  id: string;
  title: string;
  isAiGenerated: boolean;
  difficulty: Difficulty;
  listening: ListeningSection;
  reading: ReadingSection;
  writing: WritingSection;
  speaking: SpeakingSection;
}

export interface ExamAttempt {
  id: string;
  profileId: string;
  examId: string;
  date: string;
  answers: {
    listeningProva1: Record<string, string>; // questionId -> selectedOption
    listeningProva2: Record<string, boolean>; // questionId -> bool
    readingProva1: Record<string, boolean>; // questionId -> bool
    readingProva2: Record<string, string>; // questionId -> selectedOption
    writingText: string;
    speakingTranscript: string;
  };
  score: {
    listeningScore: number; // max 18
    readingScore: number; // max 18
    writingScore?: number; // max 20, graded by AI
    speakingScore?: number; // max 20, graded by AI
    totalScore?: number; // max 76
    isGraded: boolean;
    feedback?: {
      writingFeedback?: string;
      speakingFeedback?: string;
      generalSuggestions?: string;
    };
  };
}
