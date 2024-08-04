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

export type User = {
  user_id: number;
  username: string;
};

export type SignupResponse = ApiResponse;

export interface SigninResponse extends ApiResponse {
  data: {
    access_token: string;
    refresh_token: string;
    expiresIn: number;
    user: User;
  };
}

export interface ProtectedResponse extends ApiResponse {
  data: User;
}

export interface RefreshTokenReponse extends ApiResponse {
  data: {
    access_token: string;
    expiresIn: number;
    username: string;
  };
}

export interface GetMatchingUsersResponse extends ApiResponse {
  data: {
    username: string;
    user_id: number;
  }[];
}

export interface CreateQuestionResponse extends ApiResponse {
  data: Question;
}
export type UpdateQuestionResponse = ApiResponse;
export type DeleteQuestionResponse = ApiResponse;

export type Question = {
  question_id: number;
  created_by: number;
  topic_id: number;
  statement: string;
  answer: number;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  difficulty: number;
  time_limit: number;
  created_at?: string;
};

export type Topic = {
  topic_id?: number;
  created_by: number;
  title: string;
};

export type Game = {
  game_id: string;
  topic_id: number;
  player_ids: number[];
  question_ids: number[];
};

export type Response = {
  response_id?: number;
  game_id: string;
  user_id: number;
  question_id: number;
  response: number;
  is_correct: boolean;
};

export type Participant = {
  game_id?: string;
  user_id: number;
  username: string;
  score: number;
};

export interface GetUserQuestionsResponse extends ApiResponse {
  data: Question[];
}

export interface CreateTopicResponse extends ApiResponse {
  data: Topic;
}

export type UpdateTopicResponse = ApiResponse;

export type DeleteTopicResponse = ApiResponse;

export interface GetTopicsResponse extends ApiResponse {
  data: Topic[];
}

export type PastGame = {
  game_id: string;
  created_at: string;
  title: string;
  participants: Participant[];
  questions: Question[];
  responses: Response[];
};

export interface PastGameResponse extends ApiResponse {
  data: PastGame[];
}

export enum SocketMessageType {
  INIT_GAME = "initialize_game",
  INIT_CUSTOM_GAME = "initialize_custom_game",
  START_GAME = "start_game",
  JOIN_GAME = "join_game",
  GAME_NOT_FOUND = "game_not_found",
  LEAVE_GAME = "leave_game",
  NEW_USER = "new_user",
  GAME_CREATED = "game_created",
  CUSTOM_GAME_CREATED = "custom_game_created",
  GAME_STARTED = "game_started",
  GAME_JOINED = "game_joined",
  GET_NEXT_QUESTION = "get_next_question",
  NEXT_QUESTION = "next_question",
  USER_LEFT = "user_left",
  USER_DISCONNECTED = "user_disconnected",
  USER_RECONNECTED = "user_reconnected",
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

export type Host = {
  username: string;
  user_id: number;
};

export type NewHostResponse = Host;

export type GameCreatedResponse = {
  game_id: string;
  is_random: boolean;
  is_custom: boolean;
  host: Host;
};

export type CustomGameCreatedResponse = GameCreatedResponse;

export type GameStartedResponse = {
  question: Question;
  questionStartTime: number;
};

export type UserSubmitResponse = {
  user_id: number;
  username: string;
  question_id: number;
  is_correct: boolean;
  score: number;
};

export type Player = {
  user_id: number;
  username: string;
  score: number;
};

export type NewUserResponse = Player;

export type UserLeftResponse = {
  user_id: number;
  username: string;
};

export type UserDisconnectedResponse = UserLeftResponse;

export type UserReconnectedResponse = UserDisconnectedResponse;

export type JoinGameResponse = {
  game_id: string;
  is_random: boolean;
  is_custom: boolean;
  host: Host;
  players: Player[];
};

export type InvitationResponse = {
  game_id: string;
  username: string;
  user_id: number;
};

export type NextQuestionResponse = GameStartedResponse;
