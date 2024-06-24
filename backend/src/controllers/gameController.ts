import { GameState } from "../utils/GameState";
import { QuestionTable, OptionsTable, ResponseTable } from "../types/models";
import client from "../models";
import { scheduleJob } from "node-schedule";

class GameManager {
  private activeGames: Map<number, GameState>;
  private upcoming_games_fetching_period = 5; // every 5 minutes fetch upcoming contests and put in manager
  private finished_games_removing_period = 7; // every 7 minutes remove finished contests from manager

  constructor() {
    this.activeGames = new Map<number, GameState>();

    scheduleJob("*/5 * * * *", this.getUpcomingGames);
    scheduleJob("*/7 * * * *", this.removeFinishedGames);
  }

  async removeFinishedGames(): Promise<void> {
    const unfinishedGames = new Map<number, GameState>();
    for (const [contest_id, gameState] of this.activeGames) {
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
      SELECT contest_id FROM contests WHERE start_time < NOW() + INTERVAL $1
    `;
    const queryResult = await client.query(queryUpcomingContests, [
      `${2 * this.upcoming_games_fetching_period} minutes`,
    ]);
    // pushing all upcoming games to active
    queryResult.rows.forEach(({ contest_id }) => {
      // checking if games already in activeGames
      if (this.activeGames.has(contest_id)) return;
      // pushing contest to activeGames
      const gameState = new GameState(contest_id);
      this.activeGames.set(contest_id, gameState);
    });
  }

  // to check if contest details are still in manager
  isPresent(contest_id: number): boolean {
    return this.activeGames.has(contest_id);
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

  getAllQuestions(
    contest_id: number
  ): { question: QuestionTable; options: OptionsTable[] }[] {
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
}

export const manager = new GameManager();
