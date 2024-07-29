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

export interface CreateQuestionResponse extends ApiResponse {
  data: Question;
}
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
  SUBMIT_RESPONSE = "submit_response",
  USER_RESPONSE = "user_response",
  SEND_INVITATTION = "send_invitation",
  INVITATION = "invitation",
}

export interface SocketMessage {
  type: SocketMessageType;
  payload: any;
}

export type NewUserResponse = {
  user_id: number;
  username: string;
  score: 0;
};

export type NewHostResponse = {
  user_id: number;
  username: string;
};

export type GameCreatedResponse = {
  game_id: string;
};

export type GameStartedResponse = {
  question: Question;
  questionStartTime: number;
};

export type UserSubmitResponse = {
  user_id: number;
  username: string;
  question_id: number;
  is_correct: boolean;
};

export type JoinGameResponse = {
  game_id: string;
  players: {
    user_id: number;
    username: string;
    score: number;
    isHost: boolean;
  }[];
};

export type InvitationResponse = {
  game_id: string;
  topic: string;
  username: string;
  user_id: number;
};

export type NextQuestionResponse = GameStartedResponse;
