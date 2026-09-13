export interface StudentActivation {
  studentName: string;
  code: string;
  activatedAt: number; // timestamp
  expiresAt: number;   // timestamp (180 days)
  deviceId: string;
}

export interface GeneratedCodeRecord {
  id: string;
  studentName: string;
  code: string;
  createdAt: number;
  durationDays: number;
}

export type SectionId = 
  | 'dialogues'
  | 'vocabulary'
  | 'game'
  | 'song'
  | 'behavior'
  | 'exercises'
  | 'worksheets';

export interface SectionMeta {
  id: SectionId;
  number: number;
  titleArabic: string;
  titleEnglish: string;
  iconName: string;
  badge: string;
}

export interface DialogueExchange {
  speaker: 'teacher' | 'student';
  speakerArabic: string;
  textEnglish: string;
  textArabic: string;
  targetObject: string;
  targetArabic: string;
  imageIcon: string;
}

export interface VocabWord {
  id: string;
  word: string;
  arabic: string;
  phonetic: string;
  category: string;
  icon: string;
  exampleSentence: string;
  exampleArabic: string;
}

export interface SongVerse {
  englishLines: string[];
  arabicLines: string[];
  highlightWord?: string;
  audioPrompt: string;
}

export interface GoodBadItem {
  id: string;
  title: string;
  titleArabic: string;
  description: string;
  isGood: boolean;
  icon: string;
  feedbackArabic: string;
}

export interface MatchingPair {
  id: string;
  word: string;
  arabic: string;
  targetMatchId: string;
  icon: string;
}

export interface CircleQuestion {
  id: string;
  promptEnglish: string;
  promptArabic: string;
  targetWord: string;
  options: {
    id: string;
    label: string;
    labelArabic: string;
    icon: string;
    isCorrect: boolean;
  }[];
}

export interface CurriculumWorksheet {
  id: number;
  title: string;
  titleArabic: string;
  unit: string;
  pageNumber: number;
  description: string;
  objectives: string[];
  exercises: {
    number: number;
    titleEnglish: string;
    titleArabic: string;
    instructions: string;
    modelAnswers: {
      question: string;
      answer: string;
      arabicHint?: string;
    }[];
  }[];
}
