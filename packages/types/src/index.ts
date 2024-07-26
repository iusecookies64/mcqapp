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
  question_id?: number;
  created_by: number;
  topic_id: number;
  statement: string;
  answer?: number;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  difficulty: number;
  time_limit: number;
};

export type Response = {
  response_id?: number;
  game_id: number;
  user_id: number;
  question_id: number;
  response: number;
};

export type Topic = {
  topic_id?: number;
  title: string;
};

export interface GetUserQuestionsResponse extends ApiResponse {
  data: Question[];
}

export enum SocketMessageType {
  INIT_GAME = "initialize_game",
  JOIN_GAME = "join_game",
  LEAVE_GAME = "leave_game",
  NEW_USER = "new_user",
  GAME_CREATED = "game_created",
  GAME_STARTED = "game_started",
  GAME_PLAYERS = "game_players",
  GET_NEXT_QUESTION = "get_next_question",
  NEXT_QUESTION = "next_question",
  USER_LEFT = "user_left",
  GAME_ENDED = "game_ended",
  NEW_HOST = "new_host",
}

export interface SocketMessage {
  type: SocketMessageType;
  payload: any;
}

export type JoinGameBody = {
  game_id: string;
};

export type LeaveGameBody = JoinGameBody;

export type GetNextQuestionBody = JoinGameBody;

export type NewUserBody = {
  user_id: number;
  username: string;
  score: 0;
};

export type NewHostBody = {
  user_id: number;
  username: string;
};

export type GameCreatedBody = {
  game_id: string;
};

export type GameStartedBody = {
  question: Question;
  questionStartTime: number;
};

export type NextQuestionBody = GameStartedBody;
