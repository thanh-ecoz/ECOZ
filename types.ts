export enum GameState {
  MENU,
  PLAYING,
  FINISHED,
}

export interface Animal {
  id: string;
  name: string; // English name
  vietnameseName: string;
  emoji: string;
  color: string;
}

export interface Question {
  targetAnimal: Animal;
  options: Animal[]; // 4 options including target
  riddleText?: string;
}

export type AudioStatus = 'idle' | 'loading' | 'playing' | 'error';
