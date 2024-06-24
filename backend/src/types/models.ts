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
  max_participants: number;
  start_time: Date;
  end_time: Date;
  duration: number;
  invite_only: boolean;
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
  title: string;
};

export type QuestionWithOptions = {
  question: QuestionTable;
  options: OptionsTable[];
};

export type ParticipantsTable = {
  contest_id: number;
  user_id: number;
  score: number;
};

export type ResponseTable = {
  response_id: number;
  question_id: number;
  user_id: number;
  response: string;
  is_correct: boolean;
};

export type InvitationsTable = {
  invitation_id: number;
  contest_id: number;
  user_id: number;
};
