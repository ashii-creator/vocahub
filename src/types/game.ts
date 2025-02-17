export interface Word {
  id: string;
  word: string;
  definition: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category?: string;
}

export interface GameState {
  score: number;
  level: number;
  lives: number;
  currentWord?: Word;
}

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'admin_pending';
  score: number;
  achievements: string[];
}