import {
  OptionsTable,
  QuestionTable,
  QuestionWithOptions,
  ResponseTable,
} from "./models";

export interface GameStateType {
  contest_id: number;
  created_by: number;
  start_time: Date;
  end_time: Date;
  duration: number;
  answers: Map<number, string>; // to quickly check for response
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
  isStarted(): boolean;
  pushInDB(): Promise<void>;
  isValidParticipant(user_id: number): boolean;
}
