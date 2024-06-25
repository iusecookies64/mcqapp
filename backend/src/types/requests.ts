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
  start_time: string;
  duration: number;
  invite_only: boolean;
};

export type UpdateContestBody = {
  title: string;
  max_participants: number;
  start_time: string;
  duration: number;
  invite_only: boolean;
  contest_id: number;
};

export type PublishContestBody = {
  contest_id: number;
  publish: boolean;
};

export type GetParticipantsBody = {
  contest_id: number;
};

export interface CreateQuestionRequest extends Request {
  body: {
    question: QuestionTable;
    options: OptionsTable[];
  };
}

export type SendInviteBody = {
  contest_id: number;
  to_username: string;
};

export type AcceptInviteBody = {
  invitation_id: number;
};

export type EnterContestRequest = {
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
