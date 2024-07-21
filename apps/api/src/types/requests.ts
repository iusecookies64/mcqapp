import { Request, Response } from "express";
import { ContestTable, OptionsTable, QuestionTable } from "./models";

export interface SignupRequest extends Request {
  body: {
    username: string;
    email: string;
    password: string;
  };
}

export interface SigninRequest extends Request {
  body: {
    username: string;
    password: string;
  };
}

export type CreateContestBody = {
  created_by: number;
  title: string;
  max_participants: number;
  duration: number;
  is_locked: boolean;
  password: string;
};

export type UpdateContestBody = {
  title: string;
  max_participants: number;
  is_locked: boolean;
  password: string;
  duration: number;
  contest_id: number;
};

export type PublishContestBody = {
  contest_id: number;
  publish: boolean;
};

export type GetParticipantsBody = {
  contest_id: number;
};

export type CreateQuestionData = {
  contest_id: number;
  title: string;
  question_number: number;
  difficulty: 1 | 2 | 3;
  options: { title: string; option_number: number }[];
  answer: string;
};

export type UpdateQuestionData = {
  contest_id: number;
  question_id: number;
  title: string;
  difficulty: 1 | 2 | 3;
  question_number: number;
  options: OptionsTable[];
  answer: string;
};

export type ReorderQuestionsData = {
  question_id: number;
  question_number: number;
}[];

export type ReorderOptionsData = { option_id: number; option_number: number }[];

export type SendInviteBody = {
  contest_id: number;
  users: string[];
};

export type AcceptInviteBody = {
  invitation_id: number;
};

export type EnterContestRequest = {
  contest_id: number;
  user_id: number;
  username: string;
  password: string;
};

export type StartContestRequest = {
  contest_id: number;
  user_id: number;
};

export type SubmitResponseRequest = {
  contest_id: number;
  user_id: number;
  question_id: number;
  username: string;
  response: string;
};
