import {
  GameCreatedResponse,
  GameStartedResponse,
  InvitationResponse,
  JoinGameResponse,
  NewHostResponse,
  NextQuestionResponse,
  Question,
  Response,
  SocketMessage,
  SocketMessageType,
  UserSubmitResponse,
} from "@mcqapp/types";
import { User } from "./User";
import client from "./db/postgres";
import {
  InitGameBody,
  InitGameInput,
  JoinGameInput,
  LeaveGameInput,
  NextQuestionInput,
  SendInvitationBody,
  SendInvitationInput,
  SubmitResponseBody,
  SubmitResponseInput,
} from "@mcqapp/validations";
import { randomUUID } from "crypto";
import redisClient from "./db/redis";
import { userJwtClaims } from "./auth/auth";
import PubSubManager from "./PubSubManager";

type GameState = {
  game_id: string;
  questions: Question[];
  response: Response[];
  currQuestionNumber: number;
  currQuestionStartTime: number;
  isStarted: boolean;
};

type GamePlayer = userJwtClaims & { score: number; isHost: boolean };

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
      const data = await redisClient.get("game_state:" + game_id);
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
      await redisClient.set("game_state:" + game_id, JSON.stringify(game));
    } catch (err) {
      console.log("Error Setting Game State in redis");
      console.log(err);
    }
  }

  private async deleteGameState(game_id: string) {
    try {
      await redisClient.del("game_state:" + game_id);
    } catch (err) {
      console.log("Error deleting game state");
      console.log(err);
    }
  }

  private async getGamePlayers(game_id: string) {
    try {
      const data = await redisClient.hGetAll("game_players:" + game_id);
      const players = Object.values(data).map((v) => JSON.parse(v));
      return players as GamePlayer[];
    } catch (err) {
      console.log("Error getting game players");
      console.log(err);
    }
  }

  private async setGamePlayers(game_id: string, players: GamePlayer[]) {
    try {
      const data: Record<string, string> = {};
      players.forEach((p) => {
        data[p.username] = JSON.stringify(p);
      });

      await redisClient.hSet("game_players:" + game_id, data);
    } catch (err) {
      console.log("Error setting game players");
      console.log(err);
    }
  }

  private async getGamePlayer(game_id: string, username: string) {
    try {
      const data = await redisClient.hGet("game_players:" + game_id, username);
      if (data) {
        return JSON.parse(data) as GamePlayer;
      }
    } catch (err) {
      console.log("Error getting game player");
      console.log(err);
    }
  }

  private async deleteGamePlayers(game_id: string) {
    try {
      await redisClient.del("game_players:" + game_id);
    } catch (err) {
      console.log("Error deleting game players");
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

  private async deleteWaitingGameId(topid_id: number) {
    await redisClient.del("waiting_list:" + topid_id);
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
          const { success, data } = JoinGameInput.safeParse(payload);
          if (success) this.addUserToGame(user, data.game_id);
        }

        // if message to leave a game
        if (type === SocketMessageType.LEAVE_GAME) {
          const { success, data } = LeaveGameInput.safeParse(payload);
          if (success) this.removeUserFromGame(user, data.game_id);
        }

        // if message to get next question
        if (type === SocketMessageType.GET_NEXT_QUESTION) {
          const { success, data } = NextQuestionInput.safeParse(payload);
          if (success) this.getNextQuestion(user, data.game_id);
        }

        // if message to submit response
        if (type === SocketMessageType.SUBMIT_RESPONSE) {
          const { success, data } = SubmitResponseInput.safeParse(payload);
          if (success) this.submitResponse(user, data);
        }

        // if message to send a user invite
        if (type === SocketMessageType.SEND_INVITATTION) {
          const { success, data } = SendInvitationInput.safeParse(payload);
          if (success) this.sendInvite(user, data);
        }
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
          // we also delete game if from waiting list
          this.deleteWaitingGameId(data.topic_id);
          return;
        }
      }

      // getting random questions for game
      const questions = await this.getRandomQuestions(data.topic_id);
      if (!questions) throw Error("Error getting questions");

      // creating a game with these questions and adding user to game players
      const game: GameState = {
        game_id: randomUUID(),
        questions: questions,
        response: [],
        currQuestionNumber: 1,
        currQuestionStartTime: Date.now(),
        isStarted: false,
      };
      const players: GamePlayer[] = [
        {
          user_id: user.user_id,
          username: user.username,
          score: 0,
          isHost: true,
        },
      ];

      // storing game state in redis
      await this.setGameState(game.game_id, game);
      // storing players list in redis
      await this.setGamePlayers(game.game_id, players);

      // if game is random we store it in waiting list
      await this.setWaitingGameId(data.topic_id, game.game_id);

      // subscribing user to game_id channel
      PubSubManager.getInstance().subscribe(user.user_id, game.game_id);

      // adding leave handler if user connection breaks
      user.socket.on("close", () => {
        this.removeUserFromGame(user, game.game_id);
      });

      // letting user know game created successfully
      const payload: GameCreatedResponse = {
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
      const players = await this.getGamePlayers(game_id);
      const game = await this.getGameState(game_id);
      if (!players) throw Error("No Player Exists");
      if (!game) throw Error("No Game Exists");

      // if user is joining this game for the first time
      if (!players.find((p) => p.user_id === user.user_id)) {
        // adding user to list of players
        players.push({
          user_id: user.user_id,
          username: user.username,
          score: 0,
          isHost: false,
        });
        // updating players list in redis
        this.setGamePlayers(game_id, players);
      }

      // letting other people in this room know
      PubSubManager.getInstance().publish(
        game_id,
        JSON.stringify({
          type: SocketMessageType.NEW_USER,
          payload: {
            user_id: user.user_id,
            username: user.username,
          },
        })
      );

      // subscribing user to game_id channel
      PubSubManager.getInstance().subscribe(user.user_id, game_id);

      // sending user the participants in this room
      const payload: JoinGameResponse = {
        game_id,
        players,
      };
      user.emit(
        JSON.stringify({
          type: SocketMessageType.GAME_PLAYERS,
          payload,
        })
      );

      // if game started sending curr question
      if (game.isStarted) {
        const payload: GameStartedResponse = {
          question: game.questions[game.currQuestionNumber - 1],
          questionStartTime: game.currQuestionStartTime,
        };

        user.emit(
          JSON.stringify({
            type: SocketMessageType.GAME_STARTED,
            payload,
          })
        );
      } else if (players.length >= 2) {
        // game not started, if participants >= 2 then we start the game
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
      const players = await this.getGamePlayers(game_id);
      if (!players) throw Error("No Player Exists");

      let isHost = false;
      const remainingPlayers = players.filter((p) => {
        if (p.user_id === user.user_id && p.isHost) {
          isHost = true;
        }
        return p.user_id !== user.user_id;
      });

      // no one left so we delete game
      if (remainingPlayers.length === 0) {
        await this.deleteGamePlayers(game_id);
        await this.deleteGameState(game_id);
        return;
      }

      // unsubscribing user from game_id channel
      PubSubManager.getInstance().unsubscribe(user.user_id, game_id);

      // publishing user left in game_id channel
      PubSubManager.getInstance().publish(
        game_id,
        JSON.stringify({
          type: SocketMessageType.USER_LEFT,
          payload: { user_id: user.user_id, username: user.username },
        })
      );

      // if player was host
      if (isHost) {
        const payload: NewHostResponse = {
          user_id: remainingPlayers[0].user_id,
          username: remainingPlayers[0].username,
        };
        PubSubManager.getInstance().publish(
          game_id,
          JSON.stringify({ type: SocketMessageType.NEW_HOST, payload })
        );
        remainingPlayers[0].isHost = true;
      }

      // saving new players list in redis
      await this.setGamePlayers(game_id, remainingPlayers);
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
        const payload: GameStartedResponse = {
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

  private async submitResponse(user: User, data: SubmitResponseBody) {
    try {
      // getting game data
      const game = await this.getGameState(data.game_id);
      if (game) {
        const currQuestion = game.questions[game.currQuestionNumber - 1];
        const questionStartTime = game.currQuestionStartTime;
        // if question expired or response not same as current question we return
        if (
          this.isQuestionExpired(questionStartTime, currQuestion.time_limit) ||
          currQuestion.question_id !== data.question_id
        ) {
          return;
        }

        let is_correct = false;
        if (data.response === currQuestion.answer) {
          is_correct = true;
          // updating user score
          const player = await this.getGamePlayer(data.game_id, user.username);
          if (player) {
            player.score += currQuestion.difficulty * 50;
            await this.setGamePlayers(data.game_id, [player]);
          }
        }

        // publish correct answer by user in game_id channel
        const payload: UserSubmitResponse = {
          user_id: user.user_id,
          username: user.username,
          question_id: data.question_id,
          is_correct,
        };
        PubSubManager.getInstance().publish(
          data.game_id,
          JSON.stringify({
            type: SocketMessageType.USER_RESPONSE,
            payload,
          })
        );
      }
    } catch (err) {
      console.log("Error in submitResponse");
      console.log(err);
    }
  }

  private async getNextQuestion(user: User, game_id: string) {
    try {
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

        const payload: NextQuestionResponse = {
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
    } catch (err) {
      console.log("Error in getNextQuestion");
      console.log(err);
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

  private async sendInvite(user: User, data: SendInvitationBody) {
    try {
      const payload: InvitationResponse = {
        game_id: data.game_id,
        topic: data.topic,
        user_id: user.user_id,
        username: user.username,
      };
      PubSubManager.getInstance().publish(
        `user.${data.user_id}`,
        JSON.stringify({
          type: SocketMessageType.INVITATION,
          payload,
        })
      );
    } catch (err) {
      console.log("Error sending invitation");
      console.log(err);
    }
  }
}
