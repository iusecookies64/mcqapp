export type UserTable = {
  user_id: Number;
  username: string;
  email: string;
  password: string;
};

export type ContestTable = {
  contest_id: Number;
  created_by: Number;
  title: string;
  max_participants: Number;
  start_time: Date;
  duration: Number;
  invite_only: Boolean;
  published: Boolean;
};

export type QuestionTable = {
  question_id: Number;
  contest_id: Number;
  title: string;
  answer: string;
  difficulty: 1 | 2 | 3;
};

export type OptionsTable = {
  option_id: Number;
  question_id: Number;
  title: string;
};

export type ParticipantsTable = {
  contest_id: Number;
  user_id: Number;
  score: Number;
};

export type ResponseTable = {
  response_id: Number;
  question_id: Number;
  user_id: Number;
  response: string;
  is_correct: Boolean;
};

export type InvitationsTable = {
  invitation_id: Number;
  contest_id: Number;
  user_id: Number;
};
