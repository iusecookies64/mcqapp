export type UserTable = {
  user_id: number;
  username: string;
  email: string;
  password: string;
};

export type ContestTable = {
  contest_id: number;
  created_by: number;
  title: string;
  is_locked: boolean;
  is_ended: boolean;
  password: string;
  max_participants: number;
  duration: number;
  published: boolean;
};

export type QuestionTable = {
  question_id: number;
  contest_id: number;
  title: string;
  answer: string;
  difficulty: 1 | 2 | 3;
};

export type OptionsTable = {
  option_id: number;
  question_id: number;
  option_number: number;
  title: string;
};

export type QuestionWithOptions = {
  contest_id: number;
  question_id: number;
  title: string;
  question_number: number;
  answer: string;
  difficulty: 1 | 2 | 3;
  options: OptionsTable[];
};

export type ParticipantsTable = {
  contest_id: number;
  user_id: number;
  score: number;
};

export type ResponseTable = {
  question_id: number;
  user_id: number;
  response: string;
  is_correct: boolean;
};
