import { GameState } from "../utils/GameState";
import {
  QuestionTable,
  OptionsTable,
  ResponseTable,
  QuestionWithOptions,
} from "../types/models";
import client from "../models";
import { scheduleJob } from "node-schedule";

class GameManager {
  private activeGames: Map<number, GameState> = new Map<number, GameState>();
  private period1 = 5; // every 5 minutes fetch upcoming contests and put in manager
  private period2 = 7; // every 7 minutes remove finished contests from manager

  constructor() {
    this.activeGames = new Map<number, GameState>();

    // Bind the methods to ensure 'this' context is correct
    this.getUpcomingGames = this.getUpcomingGames.bind(this);
    this.removeFinishedGames = this.removeFinishedGames.bind(this);

    scheduleJob(`*/10 * * * * *`, this.getUpcomingGames);
    scheduleJob(`*/14 * * * * *`, this.removeFinishedGames);
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

  async getUpcomingGames(): Promise<void> {
    const queryUpcomingContests = `
      SELECT contest_id FROM contests WHERE start_time < NOW() + INTERVAL '20 minutes'
    `;
    const queryResult = await client.query(queryUpcomingContests);
    // pushing all upcoming games to active
    queryResult.rows.forEach(({ contest_id }) => {
      // checking if games already in activeGames
      if (this.activeGames.has(contest_id)) return;
      // pushing contest to activeGames
      const gameState = new GameState(contest_id);
      this.activeGames.set(contest_id, gameState);
    });
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
      this.activeGames.get(contest_id)?.isStarted()
    ) {
      return true;
    } else {
      return false;
    }
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

  isValidParticipant(contest_id: number, user_id: number): boolean {
    return (
      this.activeGames.get(contest_id)?.isValidParticipant(user_id) || false
    );
  }

  updateContestData(contest_id: number): void {
    // reinitializing if contest was in game state already
    this.activeGames.get(contest_id)?.init();
  }
}

export const manager = new GameManager();
