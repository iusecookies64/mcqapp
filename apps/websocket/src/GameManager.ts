import {
  GameCreatedBody,
  GameStartedBody,
  NewHostBody,
  NewUserBody,
  NextQuestionBody,
  Question,
  Response,
  SocketMessage,
  SocketMessageType,
} from "@mcqapp/types";
import { User } from "./User";
import client from "./db/postgres";
import { InitGameBody, InitGameInput } from "@mcqapp/validations";
import { randomUUID } from "crypto";
import redisClient from "./db/redis";
import { userJwtClaims } from "./auth/auth";
import PubSubManager from "./PubSubManager";

type GameState = {
  game_id: string;
  questions: Question[];
  response: Response[];
  players: (userJwtClaims & { score: number })[];
  currQuestionNumber: number;
  currQuestionStartTime: number;
  isStarted: boolean;
  isDuel: boolean;
  host: userJwtClaims;
};

export default class GameManager {
  private static instance: GameManager | null = null;

  private constructor() {}

  static getInstance(): GameManager {
    if (!this.instance) {
      this.instance = new GameManager();
    }

    return this.instance;
  }

  private async getGameState(game_id: string): Promise<GameState | null> {
    try {
      const data = await redisClient.get("game:" + game_id);
      if (data) {
        const game: GameState = JSON.parse(data) as GameState;
        return game;
      } else {
        return null;
      }
    } catch (err) {
      console.log("Error getting object from redis");
      console.log(err);
      return null;
    }
  }

  private async setGameState(game_id: string, game: GameState) {
    try {
      await redisClient.set("game:" + game_id, JSON.stringify(game));
    } catch (err) {
      console.log("Error Setting Game State in redis");
      console.log(err);
    }
  }

  private async deleteGameState(game_id: string) {
    try {
      await redisClient.del("game:" + game_id);
    } catch (err) {
      console.log("Error deleting game state");
      console.log(err);
    }
  }

  private async getWaitingGameId(topic_id: number): Promise<string | null> {
    try {
      const data = await redisClient.get("waiting_list:" + topic_id);
      return data;
    } catch (err) {
      console.log("Error getting value from redis");
      console.log(err);
      return null;
    }
  }

  private async setWaitingGameId(topic_id: number, game_id: string) {
    await redisClient.set("waiting_list:" + topic_id, game_id);
  }

  public addHandlers(user: User) {
    user.socket.on("message", (message) => {
      try {
        const { type, payload } = JSON.parse(
          message.toString()
        ) as SocketMessage;

        // if message to initialize a game
        if (type === SocketMessageType.INIT_GAME) {
          const { success, data } = InitGameInput.safeParse(payload);

          if (success) {
            // if correct input we create a game
            this.createGame(data, user);
          }
        }

        // if message to join a game
        if (type === SocketMessageType.JOIN_GAME) {
          if (payload.game_id) {
            this.addUserToGame(user, payload.game_id);
          }
        }

        // if message to leave a game
        if (type === SocketMessageType.LEAVE_GAME) {
          if (payload.game_id) {
            this.removeUserFromGame(user, payload.game_id);
          }
        }

        // if message to get next question
        if (type === SocketMessageType.NEXT_QUESTION) {
          if (payload.game_id) {
            this.getNextQuestion(user, payload.game_id);
          }
        }

        // if message to submit response
        if(type === SocketMessageType.)
      } catch (err) {
        console.log("Error adding handlers to the user");
        console.log(err);
      }
    });
  }

  private async createGame(data: InitGameBody, user: User) {
    try {
      if (data.is_random) {
        // checking if a game with same topic is in waiting list
        const game_id = await this.getWaitingGameId(data.topic_id);
        if (game_id) {
          this.addUserToGame(user, game_id);
          return;
        }
      }

      // getting random questions for game
      const questions = await this.getRandomQuestions(data.topic_id);
      if (!questions) throw Error("Error getting questions");

      // creating a game with these questions and adding user to game players
      const game: GameState = {
        game_id: randomUUID(),
        players: [{ user_id: user.user_id, username: user.username, score: 0 }],
        questions: questions,
        response: [],
        currQuestionNumber: 1,
        currQuestionStartTime: Date.now(),
        isStarted: false,
        isDuel: data.is_duel,
        host: { user_id: user.user_id, username: user.username },
      };

      // storing game in redis
      await this.setGameState(game.game_id, game);

      // if game is random we store it in waiting list
      await this.setWaitingGameId(data.topic_id, game.game_id);

      // subscribing user to game_id channel
      PubSubManager.getInstance().subscribe(user.user_id, game.game_id);

      // adding leave handler if user connection breaks
      user.socket.on("close", () => {
        this.removeUserFromGame(user, game.game_id);
      });

      // letting user know game created successfully
      const payload: GameCreatedBody = {
        game_id: game.game_id,
      };
      user.emit(
        JSON.stringify({
          type: SocketMessageType.GAME_CREATED,
          payload,
        })
      );
    } catch (err) {
      console.log("Error creating game");
      console.log(err);
    }
  }

  private async addUserToGame(user: User, game_id: string) {
    try {
      // getting gameState from redis
      const game = await this.getGameState(game_id);
      if (!game) throw Error("Game Doesnt Exist");

      // if user is joining this game for the first time
      if (!game.players.find((p) => p.user_id === user.user_id)) {
        // adding user to list of users
        game.players.push({
          user_id: user.user_id,
          username: user.username,
          score: 0,
        });
        // updating game state in redis
        this.setGameState(game.game_id, game);
      }

      // subscribing user to game_id channel
      PubSubManager.getInstance().subscribe(user.user_id, game.game_id);

      // letting other people in this room know
      PubSubManager.getInstance().publish(
        game.game_id,
        JSON.stringify({
          type: SocketMessageType.NEW_USER,
          payload: {
            user_id: user.user_id,
            username: user.username,
          },
        })
      );

      // sending user the participants in this room
      user.emit(
        JSON.stringify({
          type: SocketMessageType.GAME_PLAYERS,
          payload: game.players,
        })
      );

      // if game started sending curr question
      if (game.isStarted) {
        const payload: GameStartedBody = {
          question: game.questions[game.currQuestionNumber - 1],
          questionStartTime: game.currQuestionStartTime,
        };

        user.emit(
          JSON.stringify({
            type: SocketMessageType.GAME_STARTED,
            payload,
          })
        );
      }

      // if game not started and this is a duel game then we start the game
      if (game.isDuel && !game.isStarted) {
        this.startGame({ gameState: game });
      }
    } catch (err) {
      console.log("Error joining User");
      console.log(err);
    }
  }

  private async removeUserFromGame(user: User, game_id: string) {
    try {
      // getting gameState from redis
      const game = await this.getGameState(game_id);
      if (!game) throw Error("Game Not Exist");

      // removing user from players list if game not started
      let isHostUpdated = false;
      if (!game.isStarted) {
        game.players = game.players.filter((p) => p.user_id !== user.user_id);
        // if no players left we delete game from redis
        if (game.players.length === 0) {
          this.deleteGameState(game_id);
          return;
        }

        // if this user was host then updating host to first player
        if (game.host.user_id === user.user_id) {
          game.host = game.players[0];
          isHostUpdated = true;
        }
        // uddating game state in redis
        this.setGameState(game.game_id, game);
      }

      // unsubscribing user from game_id channel
      PubSubManager.getInstance().unsubscribe(user.user_id, game.game_id);

      // publishing user left in game_id channel
      PubSubManager.getInstance().publish(
        game.game_id,
        JSON.stringify({
          type: SocketMessageType.USER_LEFT,
          payload: { user_id: user.user_id, username: user.username },
        })
      );

      // if host changed publishing in game_id channel new host
      if (isHostUpdated) {
        const payload: NewHostBody = {
          user_id: game.players[0].user_id,
          username: game.players[0].username,
        };
        PubSubManager.getInstance().publish(
          game_id,
          JSON.stringify({ type: SocketMessageType.NEW_HOST, payload })
        );
      }
    } catch (err) {
      console.log("Error removing User");
      console.log(err);
    }
  }

  private async startGame({
    game_id,
    gameState,
  }: {
    game_id?: string;
    gameState?: GameState;
  }) {
    try {
      const game = gameState || (await this.getGameState(game_id || ""));
      if (game) {
        game.currQuestionNumber = 1;
        game.currQuestionStartTime = Date.now();
        game.isStarted = true;
        // publishing the game started with first question in the room
        const payload: GameStartedBody = {
          question: game.questions[game.currQuestionNumber - 1],
          questionStartTime: game.currQuestionStartTime,
        };
        PubSubManager.getInstance().publish(
          game.game_id,
          JSON.stringify({
            type: SocketMessageType.GAME_STARTED,
            payload,
          })
        );
        // storing game state in redis
        this.setGameState(game.game_id, game);
      }
    } catch (err) {
      console.log("Error starting the game");
      console.log(err);
    }
  }

  private async getNextQuestion(user: User, game_id: string) {
    // getting game state
    const game = await this.getGameState(game_id);
    if (game) {
      // current question time expired then we send the next question
      const questionStartTime = game.currQuestionStartTime;
      const questionTimeLimit =
        game.questions[game.currQuestionNumber - 1].time_limit;

      // question expired so we increase question number
      if (this.isQuestionExpired(questionStartTime, questionTimeLimit)) {
        game.currQuestionNumber += 1;
        game.currQuestionStartTime = Date.now();
        // updating game state in redis
        await this.setGameState(game.game_id, game);
      }

      // if this is the last question then we send game ended
      if (game.questions.length === game.currQuestionNumber) {
        this.gameEnded(user);
        return;
      }

      const payload: NextQuestionBody = {
        question: game.questions[game.currQuestionNumber - 1],
        questionStartTime: game.currQuestionStartTime,
      };

      user.emit(
        JSON.stringify({
          type: SocketMessageType.NEXT_QUESTION,
          payload,
        })
      );
    }
  }

  private gameEnded(user: User) {
    user.emit(JSON.stringify({ type: SocketMessageType.GAME_ENDED }));
  }

  private isQuestionExpired(
    start_time: number,
    durationInSec: number
  ): boolean {
    const end_time = start_time + durationInSec * 1000;
    if (Date.now() > end_time) return true;
    else return false;
  }

  private async getRandomQuestions(
    topic_id: number
  ): Promise<Question[] | undefined> {
    try {
      const getRandomQuestionsIds =
        "SELECT question_id FROM questions WHERE topic_id=$1 AND created_by=1 ORDER BY RANDOM() LIMIT 10;";
      const getQuestionsQuery =
        "SELECT * FROM questions WHERE question_id = ANY($1);";
      const result = await client.query(getRandomQuestionsIds, [topic_id]);
      const result2 = await client.query(getQuestionsQuery, [
        result.rows.map((r) => r.question_id),
      ]);

      return result2.rows;
    } catch (err) {
      console.log("Error getting random questions");
    }
  }
}
