import { GameState } from "../utils/GameState";
import {
  QuestionTable,
  OptionsTable,
  ResponseTable,
  QuestionWithOptions,
  ContestTable,
} from "../types/models";
import client from "../models";
import { scheduleJob } from "node-schedule";
import { ContestDataForLobby } from "../types/gameState";

type ActiveGamesType = {
  contest_id: number;
  username: string;
  title: string;
  curr_participants: number;
  max_participants: number;
  is_locked: boolean;
  password: string;
  duration: number;
};

class GameManager {
  private activeGames: Map<number, GameState> = new Map<number, GameState>();

  constructor() {
    this.activeGames = new Map<number, GameState>();

    // Bind the methods to ensure 'this' context is correct
    this.removeFinishedGames = this.removeFinishedGames.bind(this);

    // every 5 minutes remove all finished contests
    scheduleJob(`*/5 * * * *`, this.removeFinishedGames);
  }

  async removeFinishedGames(): Promise<void> {
    const unfinishedGames = new Map<number, GameState>();

    for (const [contest_id, gameState] of this.activeGames.entries()) {
      if (!gameState.isEnded()) {
        unfinishedGames.set(contest_id, gameState);
      } else {
        // game finished so we push it in db
        gameState.pushInDB();
      }
    }
    this.activeGames = unfinishedGames;
  }

  getActiveContests(): ActiveGamesType[] {
    const result: ActiveGamesType[] = [];

    for (const [contest_id, gameState] of this.activeGames.entries()) {
      if (gameState.is_started || gameState.isEnded() || gameState.isFull())
        continue;

      result.push({
        contest_id,
        title: gameState.title,
        username: gameState.created_by_username,
        curr_participants: gameState.participants.size,
        max_participants: gameState.max_participants,
        is_locked: gameState.is_locked,
        password: gameState.password,
        duration: gameState.duration,
      });
    }
    return result;
  }

  addContest(contest_id: number): void {
    const gameState = new GameState(contest_id);
    this.activeGames.set(contest_id, gameState);
  }

  // to check if contest details are in manager
  isPresent(contest_id: number): boolean {
    return this.activeGames.has(contest_id);
  }

  isStarted(contest_id: number): boolean {
    if (
      this.isPresent(contest_id) &&
      this.activeGames.get(contest_id)?.isContestStarted()
    ) {
      return true;
    } else {
      return false;
    }
  }

  setStarted(contest_id: number): void {
    this.activeGames.get(contest_id)?.setStarted();
  }

  addParticipant(
    contest_id: number,
    user_id: number,
    username: string
  ): boolean {
    return (
      this.activeGames.get(contest_id)?.addParticipant(username, user_id) ||
      false
    );
  }

  removeParticipant(
    contest_id: number,
    user_id: number,
    username: string
  ): void {
    this.activeGames.get(contest_id)?.removeParticipant(user_id, username);
  }

  isLocked(contest_id: number): boolean {
    return this.activeGames.get(contest_id)?.is_locked || false;
  }

  checkPassword(contest_id: number, password: string): boolean {
    return this.activeGames.get(contest_id)?.checkPassword(password) || false;
  }

  isFull(contest_id: number): boolean {
    if (this.activeGames.get(contest_id)) {
      return this.activeGames.get(contest_id)?.isFull() || false;
    } else {
      return true;
    }
  }

  isParticipantPresent(contest_id: number, user_id: number): boolean {
    return (
      this.activeGames.get(contest_id)?.isParticipantPresent(user_id) || false
    );
  }

  isOwner(contest_id: number, user_id: number): boolean {
    return this.activeGames.get(contest_id)?.isOwner(user_id) || false;
  }

  getDuration(contest_id: number): number {
    return this.activeGames.get(contest_id)?.getDuration() || 10;
  }

  getContestData(contest_id: number): ContestDataForLobby | undefined {
    return this.activeGames.get(contest_id)?.getContestData();
  }

  submitResponse(
    contest_id: number,
    user_id: number,
    username: string,
    question_id: number,
    response: string
  ): boolean {
    return (
      this.activeGames
        .get(contest_id)
        ?.submitResponse(username, user_id, question_id, response) || false
    );
  }

  getScores(contest_id: number): { username: string; score: number }[] {
    return this.activeGames.get(contest_id)?.getScores() || [];
  }

  getAllQuestions(contest_id: number): QuestionWithOptions[] {
    return this.activeGames.get(contest_id)?.getQuestions() || [];
  }

  getAllResponse(contest_id: number): ResponseTable[] {
    return this.activeGames.get(contest_id)?.getAllResponse() || [];
  }

  updateContestData(contest_id: number): void {
    // reinitializing if contest was in game state already
    this.activeGames.get(contest_id)?.init();
  }
}

export const manager = new GameManager();
