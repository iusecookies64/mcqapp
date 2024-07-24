import { DuelGame, GroupGame } from "./Game";

export default class GameManager {
  public instance: GameManager | null = null;
  private onGoingDuelGames: Map<string, DuelGame>;
  private onGoingGroupGames: Map<string, GroupGame>;
  private randomGamesWaiting: Map<string, Game> = new Map<string, Game>(); // games where lobby is created

  private constructor() {}

  getInstance(): GameManager {
    if (!this.instance) {
      this.instance = new GameManager();
    }

    return this.instance;
  }
}
