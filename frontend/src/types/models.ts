export type User = {
  user_id: number;
  username: string;
  email: string;
  password: string;
};

export type Contest = {
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

export type Question = {
  question_id: number;
  contest_id: number;
  title: string;
  answer: string;
  difficulty: 1 | 2 | 3;
};

export type Options = {
  option_id: number;
  question_id: number;
  title: string;
};

export type QuestionWithOptions = {
  question: Question;
  options: Options[];
};

export type Participants = {
  contest_id: number;
  user_id: number;
  score: number;
};

export type Response = {
  response_id: number;
  question_id: number;
  user_id: number;
  response: string;
  is_correct: boolean;
};

export type Invitations = {
  invitation_id: number;
  contest_id: number;
  username: number;
};
