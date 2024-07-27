"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@mcqapp/types");
const postgres_1 = __importDefault(require("./db/postgres"));
const validations_1 = require("@mcqapp/validations");
const crypto_1 = require("crypto");
const redis_1 = __importDefault(require("./db/redis"));
const PubSubManager_1 = __importDefault(require("./PubSubManager"));
class GameManager {
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new GameManager();
        }
        return this.instance;
    }
    getGameState(game_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield redis_1.default.get("game_state:" + game_id);
                if (data) {
                    const game = JSON.parse(data);
                    return game;
                }
                else {
                    return null;
                }
            }
            catch (err) {
                console.log("Error getting object from redis");
                console.log(err);
                return null;
            }
        });
    }
    setGameState(game_id, game) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield redis_1.default.set("game_state:" + game_id, JSON.stringify(game));
            }
            catch (err) {
                console.log("Error Setting Game State in redis");
                console.log(err);
            }
        });
    }
    deleteGameState(game_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield redis_1.default.del("game_state:" + game_id);
            }
            catch (err) {
                console.log("Error deleting game state");
                console.log(err);
            }
        });
    }
    getGamePlayers(game_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield redis_1.default.hGetAll("game_players:" + game_id);
                const players = Object.values(data).map((v) => JSON.parse(v));
                return players;
            }
            catch (err) {
                console.log("Error getting game players");
                console.log(err);
            }
        });
    }
    setGamePlayers(game_id, players) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {};
                players.forEach((p) => {
                    data[p.username] = JSON.stringify(p);
                });
                yield redis_1.default.hSet("game_players:" + game_id, data);
            }
            catch (err) {
                console.log("Error setting game players");
                console.log(err);
            }
        });
    }
    getGamePlayer(game_id, username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield redis_1.default.hGet("game_players:" + game_id, username);
                if (data) {
                    return JSON.parse(data);
                }
            }
            catch (err) {
                console.log("Error getting game player");
                console.log(err);
            }
        });
    }
    deleteGamePlayers(game_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield redis_1.default.del("game_players:" + game_id);
            }
            catch (err) {
                console.log("Error deleting game players");
                console.log(err);
            }
        });
    }
    getWaitingGameId(topic_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield redis_1.default.get("waiting_list:" + topic_id);
                return data;
            }
            catch (err) {
                console.log("Error getting value from redis");
                console.log(err);
                return null;
            }
        });
    }
    setWaitingGameId(topic_id, game_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield redis_1.default.set("waiting_list:" + topic_id, game_id);
        });
    }
    deleteWaitingGameId(topid_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield redis_1.default.del("waiting_list:" + topid_id);
        });
    }
    addHandlers(user) {
        user.socket.on("message", (message) => {
            try {
                const { type, payload } = JSON.parse(message.toString());
                // if message to initialize a game
                if (type === types_1.SocketMessageType.INIT_GAME) {
                    const { success, data } = validations_1.InitGameInput.safeParse(payload);
                    if (success) {
                        // if correct input we create a game
                        this.createGame(data, user);
                    }
                }
                // if message to join a game
                if (type === types_1.SocketMessageType.JOIN_GAME) {
                    const { success, data } = validations_1.JoinGameInput.safeParse(payload);
                    if (success)
                        this.addUserToGame(user, data.game_id);
                }
                // if message to leave a game
                if (type === types_1.SocketMessageType.LEAVE_GAME) {
                    const { success, data } = validations_1.LeaveGameInput.safeParse(payload);
                    if (success)
                        this.removeUserFromGame(user, data.game_id);
                }
                // if message to get next question
                if (type === types_1.SocketMessageType.NEXT_QUESTION) {
                    const { success, data } = validations_1.NextQuestionInput.safeParse(payload);
                    if (success)
                        this.getNextQuestion(user, data.game_id);
                }
                // if message to submit response
                if (type === types_1.SocketMessageType.SUBMIT_RESPONSE) {
                    const { success, data } = validations_1.SubmitResponseInput.safeParse(payload);
                    if (success)
                        this.submitResponse(user, data);
                }
            }
            catch (err) {
                console.log("Error adding handlers to the user");
                console.log(err);
            }
        });
    }
    createGame(data, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (data.is_random) {
                    // checking if a game with same topic is in waiting list
                    const game_id = yield this.getWaitingGameId(data.topic_id);
                    if (game_id) {
                        this.addUserToGame(user, game_id);
                        // we also delete game if from waiting list
                        this.deleteWaitingGameId(data.topic_id);
                        return;
                    }
                }
                // getting random questions for game
                const questions = yield this.getRandomQuestions(data.topic_id);
                if (!questions)
                    throw Error("Error getting questions");
                // creating a game with these questions and adding user to game players
                const game = {
                    game_id: (0, crypto_1.randomUUID)(),
                    questions: questions,
                    response: [],
                    currQuestionNumber: 1,
                    currQuestionStartTime: Date.now(),
                    isStarted: false,
                };
                const players = [
                    {
                        user_id: user.user_id,
                        username: user.username,
                        score: 0,
                        isHost: true,
                    },
                ];
                // storing game state in redis
                yield this.setGameState(game.game_id, game);
                // storing players list in redis
                yield this.setGamePlayers(game.game_id, players);
                // if game is random we store it in waiting list
                yield this.setWaitingGameId(data.topic_id, game.game_id);
                // subscribing user to game_id channel
                PubSubManager_1.default.getInstance().subscribe(user.user_id, game.game_id);
                // adding leave handler if user connection breaks
                user.socket.on("close", () => {
                    this.removeUserFromGame(user, game.game_id);
                });
                // letting user know game created successfully
                const payload = {
                    game_id: game.game_id,
                };
                user.emit(JSON.stringify({
                    type: types_1.SocketMessageType.GAME_CREATED,
                    payload,
                }));
            }
            catch (err) {
                console.log("Error creating game");
                console.log(err);
            }
        });
    }
    addUserToGame(user, game_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // getting gameState from redis
                const players = yield this.getGamePlayers(game_id);
                const game = yield this.getGameState(game_id);
                if (!players)
                    throw Error("No Player Exists");
                if (!game)
                    throw Error("No Game Exists");
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
                PubSubManager_1.default.getInstance().publish(game_id, JSON.stringify({
                    type: types_1.SocketMessageType.NEW_USER,
                    payload: {
                        user_id: user.user_id,
                        username: user.username,
                    },
                }));
                // subscribing user to game_id channel
                PubSubManager_1.default.getInstance().subscribe(user.user_id, game_id);
                // sending user the participants in this room
                const payload = {
                    game_id,
                    players,
                };
                user.emit(JSON.stringify({
                    type: types_1.SocketMessageType.GAME_PLAYERS,
                    payload,
                }));
                // if game started sending curr question
                if (game.isStarted) {
                    const payload = {
                        question: game.questions[game.currQuestionNumber - 1],
                        questionStartTime: game.currQuestionStartTime,
                    };
                    user.emit(JSON.stringify({
                        type: types_1.SocketMessageType.GAME_STARTED,
                        payload,
                    }));
                }
                else if (players.length >= 2) {
                    // game not started, if participants >= 2 then we start the game
                    this.startGame({ gameState: game });
                }
            }
            catch (err) {
                console.log("Error joining User");
                console.log(err);
            }
        });
    }
    removeUserFromGame(user, game_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // getting gameState from redis
                const players = yield this.getGamePlayers(game_id);
                if (!players)
                    throw Error("No Player Exists");
                let isHost = false;
                const remainingPlayers = players.filter((p) => {
                    if (p.user_id === user.user_id && p.isHost) {
                        isHost = true;
                    }
                    return p.user_id !== user.user_id;
                });
                // no one left so we delete game
                if (remainingPlayers.length === 0) {
                    yield this.deleteGamePlayers(game_id);
                    yield this.deleteGameState(game_id);
                    return;
                }
                // unsubscribing user from game_id channel
                PubSubManager_1.default.getInstance().unsubscribe(user.user_id, game_id);
                // publishing user left in game_id channel
                PubSubManager_1.default.getInstance().publish(game_id, JSON.stringify({
                    type: types_1.SocketMessageType.USER_LEFT,
                    payload: { user_id: user.user_id, username: user.username },
                }));
                // if player was host
                if (isHost) {
                    const payload = {
                        user_id: remainingPlayers[0].user_id,
                        username: remainingPlayers[0].username,
                    };
                    PubSubManager_1.default.getInstance().publish(game_id, JSON.stringify({ type: types_1.SocketMessageType.NEW_HOST, payload }));
                    remainingPlayers[0].isHost = true;
                }
                // saving new players list in redis
                yield this.setGamePlayers(game_id, remainingPlayers);
            }
            catch (err) {
                console.log("Error removing User");
                console.log(err);
            }
        });
    }
    startGame({ game_id, gameState, }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const game = gameState || (yield this.getGameState(game_id || ""));
                if (game) {
                    game.currQuestionNumber = 1;
                    game.currQuestionStartTime = Date.now();
                    game.isStarted = true;
                    // publishing the game started with first question in the room
                    const payload = {
                        question: game.questions[game.currQuestionNumber - 1],
                        questionStartTime: game.currQuestionStartTime,
                    };
                    PubSubManager_1.default.getInstance().publish(game.game_id, JSON.stringify({
                        type: types_1.SocketMessageType.GAME_STARTED,
                        payload,
                    }));
                    // storing game state in redis
                    this.setGameState(game.game_id, game);
                }
            }
            catch (err) {
                console.log("Error starting the game");
                console.log(err);
            }
        });
    }
    submitResponse(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // getting game data
                const game = yield this.getGameState(data.game_id);
                if (game) {
                    const currQuestion = game.questions[game.currQuestionNumber - 1];
                    const questionStartTime = game.currQuestionStartTime;
                    // if question expired or response not same as current question we return
                    if (this.isQuestionExpired(questionStartTime, currQuestion.time_limit) ||
                        currQuestion.question_id !== data.question_id) {
                        return;
                    }
                    let is_correct = false;
                    if (data.response === currQuestion.answer) {
                        is_correct = true;
                        // updating user score
                        const player = yield this.getGamePlayer(data.game_id, user.username);
                        if (player) {
                            player.score += currQuestion.difficulty * 50;
                            yield this.setGamePlayers(data.game_id, [player]);
                        }
                    }
                    // publish correct answer by user in game_id channel
                    const payload = {
                        user_id: user.user_id,
                        username: user.username,
                        question_id: data.question_id,
                        is_correct,
                    };
                    PubSubManager_1.default.getInstance().publish(data.game_id, JSON.stringify({
                        type: types_1.SocketMessageType.User_Response,
                        payload,
                    }));
                }
            }
            catch (err) {
                console.log("Error in submitResponse");
                console.log(err);
            }
        });
    }
    getNextQuestion(user, game_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // getting game state
                const game = yield this.getGameState(game_id);
                if (game) {
                    // current question time expired then we send the next question
                    const questionStartTime = game.currQuestionStartTime;
                    const questionTimeLimit = game.questions[game.currQuestionNumber - 1].time_limit;
                    // question expired so we increase question number
                    if (this.isQuestionExpired(questionStartTime, questionTimeLimit)) {
                        game.currQuestionNumber += 1;
                        game.currQuestionStartTime = Date.now();
                        // updating game state in redis
                        yield this.setGameState(game.game_id, game);
                    }
                    // if this is the last question then we send game ended
                    if (game.questions.length === game.currQuestionNumber) {
                        this.gameEnded(user);
                        return;
                    }
                    const payload = {
                        question: game.questions[game.currQuestionNumber - 1],
                        questionStartTime: game.currQuestionStartTime,
                    };
                    user.emit(JSON.stringify({
                        type: types_1.SocketMessageType.NEXT_QUESTION,
                        payload,
                    }));
                }
            }
            catch (err) {
                console.log("Error in getNextQuestion");
                console.log(err);
            }
        });
    }
    gameEnded(user) {
        user.emit(JSON.stringify({ type: types_1.SocketMessageType.GAME_ENDED }));
    }
    isQuestionExpired(start_time, durationInSec) {
        const end_time = start_time + durationInSec * 1000;
        if (Date.now() > end_time)
            return true;
        else
            return false;
    }
    getRandomQuestions(topic_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getRandomQuestionsIds = "SELECT question_id FROM questions WHERE topic_id=$1 AND created_by=1 ORDER BY RANDOM() LIMIT 10;";
                const getQuestionsQuery = "SELECT * FROM questions WHERE question_id = ANY($1);";
                const result = yield postgres_1.default.query(getRandomQuestionsIds, [topic_id]);
                const result2 = yield postgres_1.default.query(getQuestionsQuery, [
                    result.rows.map((r) => r.question_id),
                ]);
                return result2.rows;
            }
            catch (err) {
                console.log("Error getting random questions");
            }
        });
    }
}
GameManager.instance = null;
exports.default = GameManager;
