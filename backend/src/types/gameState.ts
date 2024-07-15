import { QuestionWithOptions, ResponseTable } from "./models";

export type ActiveGamesType = {
  contest_id: number;
  username: string;
  title: string;
  curr_participants: number;
  max_participants: number;
  is_locked: boolean;
  password: string;
  duration: number;
};

export type GameState = {
  contest_id: number;
  created_by: number;
  created_by_username: string;
  duration: number;
  title: string;
  is_locked: boolean;
  password: string;
  curr_participants: number;
  max_participants: number;
  start_time: number;
  answers: Record<number, string>;
  difficulty: Record<number, number>;
  questions: QuestionWithOptions[];
  scores: Record<string, { username: string; score: number }>;
  response: ResponseTable[];
};

export type GameStateFields = {
  contest_id?: number;
  created_by?: number;
  created_by_username?: string;
  duration?: number;
  title?: string;
  is_locked?: boolean;
  password?: string;
  curr_participants?: number;
  max_participants?: number;
  start_time?: number;
  answers?: Record<number, string>;
  difficulty?: Record<number, number>;
  questions?: QuestionWithOptions[];
  scores?: Record<string, { username: string; score: number }>;
  response?: ResponseTable[];
};
