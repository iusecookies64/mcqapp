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

export interface CreateContestRequest extends Request {
  body: {
    contest: ContestTable;
  };
}

export interface CreateQuestionRequest extends Request {
  body: {
    question: QuestionTable;
    options: OptionsTable[];
  };
}

export interface SendInviteRequest extends Request {
  body: {
    contest_id: Number;
    user_id: Number;
  };
}

export interface AcceptInvitationRequest extends Request {
  body: {
    contest_id: Number;
    user_id: Number;
  };
}
