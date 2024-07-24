import { Question } from "@mcqapp/types";
import { User } from "./User";

export class DuelGame {
  gameId: number;
  player1: User;
  player2: User;
  question: Question[];
  currQuestionNumber;
  currQuestionStartTime: Date;
  responses: Response[];
}

export class GroupGame {
  gameId: number = 0;
  users: User[] = [];
}
