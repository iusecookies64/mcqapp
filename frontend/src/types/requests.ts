import { Question, Options } from "./models";

export enum RequestMethods {
  post = "post",
  get = "get",
  delete = "delete",
}

export type SignupRequest = {
  username: string;
  email: string;
  password: string;
};

export type SigninRequest = {
  username: string;
  password: string;
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

export type CreateQuestionRequest = {
  question: Question;
  options: Options[];
};

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
