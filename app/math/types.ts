export interface Triangle {
  a?: number;
  b?: number;
  c?: number;
  alpha?: number; // radians
  beta?: number;  // radians
  gamma?: number; // radians
}

export interface TriangleSolution {
  triangle: Triangle;
  valid: boolean;
  error?: string;
  ambiguous?: boolean;
  solutions?: Triangle[];
}

export type QuestionType = 'multiple-choice' | 'numerical' | 'open';

export interface Choice {
  id: string;
  text: string;
}

export interface SolutionStep {
  title: string;
  content: string;
  formula?: string;
  result?: string;
}

export interface Problem {
  id: string;
  level: number;
  type: QuestionType;
  question: string;
  hint?: string;
  choices?: Choice[];
  correctAnswer: string | number;
  tolerance?: number;
  solution: SolutionStep[];
  points: number;
  triangleData?: Triangle;
  diagramType?: 'right' | 'general' | 'none';
}

export interface LevelProgress {
  level: number;
  completed: boolean;
  score: number;
  maxScore: number;
  attempts: number;
}

export interface AppProgress {
  levels: Record<number, LevelProgress>;
  finalTestCompleted: boolean;
  finalTestScore: number;
  finalTestMaxScore: number;
}

export interface TestResult {
  problemId: string;
  userAnswer: string;
  correct: boolean;
  points: number;
  earned: number;
}
