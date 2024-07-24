export const TRUE = "true";
export const FALSE = "false";
export const CONTEST_QUESTIONS = "Contest Questions";
export const USER_RESPONSE = "User Response";
export const SCORES = "Scores";
export const JOINED_SUCCESSFULLY = "Joined Successfully";
export const ROOM_LOCKED = "Room Locked";
export const INCORRECT_PASSWORD = "Incorrect Password";
export const ROOM_FULL = "Room Full";
export const ERROR_JOINING = "Error Joining";
export const USER_JOINED = "User Joined";
export const USER_LEFT = "User Left";
export const HOST_JOINED = "Host Joined";
export const INCORRECT_ANSWER = 0;
export const UPDATE_SCORES = "Update Scores";
export const START_GAME = "Start Game";
export const SUBMIT_RESPONSE = "Submit Response";
export const SUBMISSION_RESULT = "Submission Result";
export const LEAVE_ROOM = "Leave Room";
export const JOIN_ROOM = "Join Room";
export const CONTEST_ENDED = "Contest Ended";
export const CONTEST_STARTED = "Contest Started";

export enum StatusCodes {
  Success = 200,
  InvalidInput = 422,
  BadRequest = 400,
  Unauthorized = 401,
  AccessForbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
}

export interface ApiResponse {
  message: string;
  status: "success" | "fail" | "error";
  data?: any;
}

export type SignupResponse = ApiResponse;

export interface SigninResponse extends ApiResponse {
  data: {
    access_token: string;
    refresh_token: string;
    expiresIn: number;
  };
}

export interface ProtectedResponse extends ApiResponse {
  data: {
    username: string;
  };
}

export interface RefreshTokenReponse extends ApiResponse {
  data: {
    access_token: string;
    expiresIn: number;
    username: string;
  };
}

export type CreateQuestionResponse = ApiResponse;
export type UpdateQuestionResponse = ApiResponse;
export type DeleteQuestionResponse = ApiResponse;

export type Question = {
  topics: string[];
  statement: string;
  answer: number;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  difficulty: number;
  time_limit: number;
  question_id: number;
};

export interface GetUserQuestionsResponse extends ApiResponse {
  data: Question[];
}
