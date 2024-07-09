import { ContestTable, QuestionWithOptions, ResponseTable } from "./models";

export type ContestDataForLobby = {
  contest_id: number;
  created_by: number;
  created_by_username: string;
  title: string;
  duration: number;
  max_participants: number;
};

export interface GameStateType {
  contest_id: number;
  created_by: number;
  created_by_username: string;
  duration: number;
  title: string;
  is_locked: boolean;
  max_participants: number;
  password: string;
  is_started: boolean;
  start_time: number;
  answers: Map<number, string>; // to quickly check for response
  difficulty: Map<number, number>; // question difficulty
  participants: Map<number, string>; // to quickly check if a user is participant or not
  questions: QuestionWithOptions[]; // to send to users that join the contest
  scores: Map<string, number>; // live scores
  response: ResponseTable[]; // all responses made by users during contest
  init(): Promise<boolean>; // to initialize game state
  submitResponse(
    username: string,
    user_id: number,
    question_id: number,
    response: string
  ): boolean; // returns true if response was correct
  getReductionFactor(): number; // reduction factor to reduce score of a question based on time elapsed
  getScores(): { username: string; score: number }[];
  getQuestions(): QuestionWithOptions[];
  getAllResponse(): ResponseTable[];
  isEnded(): boolean;
  isContestStarted(): boolean;
  setStarted(): void;
  pushInDB(): Promise<void>;
  addParticipant(username: string, user_id: number): void;
  removeParticipant(user_id: number, username: string): void;
  checkPassword(password: string): boolean;
  isFull(): boolean;
  isParticipantPresent(user_id: number): boolean;
  isOwner(user_id: number): boolean;
  getDuration(): number;
  getContestData(): ContestDataForLobby;
}
