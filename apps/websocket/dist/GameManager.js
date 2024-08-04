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
                    if (success)
                        this.createGame(data, user);
                }
                if (type === types_1.SocketMessageType.INIT_CUSTOM_GAME) {
                    const { success, data } = validations_1.InitCustomGameInput.safeParse(payload);
                    if (success)
                        this.createCustomGame(data, user);
                }
                if (type === types_1.SocketMessageType.START_GAME) {
                    const { success, data } = validations_1.StartGameInput.safeParse(payload);
                    if (success)
                        this.startGame({ game_id: data.game_id });
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
                if (type === types_1.SocketMessageType.GET_NEXT_QUESTION) {
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
                // if message to send a user invite
                if (type === types_1.SocketMessageType.SEND_INVITATTION) {
                    const { success, data } = validations_1.SendInvitationInput.safeParse(payload);
                    if (success)
                        this.sendInvite(user, data);
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
                    topic_id: data.topic_id,
                    questions: questions,
                    response: [],
                    currQuestionNumber: 1,
                    currQuestionStartTime: Date.now(),
                    created_at: Date.now(),
                    isStarted: false,
                    is_random: data.is_random,
                    is_custom: false,
                    host: {
                        user_id: user.user_id,
                        username: user.username,
                    },
                    is_ended: false,
                };
                const players = [
                    {
                        user_id: user.user_id,
                        username: user.username,
                        score: 0,
                    },
                ];
                // storing game state in redis
                yield this.setGameState(game.game_id, game);
                // storing players list in redis
                yield this.setGamePlayers(game.game_id, players);
                if (data.is_random) {
                    // if game is random we store it in waiting list
                    yield this.setWaitingGameId(data.topic_id, game.game_id);
                }
                // subscribing user to game_id channel
                PubSubManager_1.default.getInstance().subscribe(user.user_id, game.game_id);
                // adding leave handler if user connection breaks
                user.socket.on("close", () => {
                    this.removeUserFromGame(user, game.game_id);
                });
                // letting user know game created successfully
                const payload = {
                    game_id: game.game_id,
                    is_random: data.is_random,
                    is_custom: false,
                    host: {
                        user_id: user.user_id,
                        username: user.username,
                    },
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
    createCustomGame(data, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const game = {
                game_id: (0, crypto_1.randomUUID)(),
                topic_id: data.topic_id,
                questions: data.questions,
                response: [],
                currQuestionNumber: 1,
                currQuestionStartTime: Date.now(),
                created_at: Date.now(),
                isStarted: false,
                is_random: false,
                is_custom: true,
                host: {
                    user_id: user.user_id,
                    username: user.username,
                },
                is_ended: false,
            };
            // storing game state in redis
            yield this.setGameState(game.game_id, game);
            // adding leave handler if user connection breaks
            user.socket.on("close", () => {
                this.removeUserFromGame(user, game.game_id);
            });
            // letting user know game created successfully
            const payload = {
                game_id: game.game_id,
                is_random: game.is_random,
                is_custom: game.is_custom,
                host: game.host,
            };
            user.emit(JSON.stringify({
                type: types_1.SocketMessageType.CUSTOM_GAME_CREATED,
                payload,
            }));
        });
    }
    addUserToGame(user, game_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // getting gameState from redis
                let players = yield this.getGamePlayers(game_id);
                const game = yield this.getGameState(game_id);
                if (!players)
                    players = [];
                if (!game) {
                    user.emit(JSON.stringify({
                        type: types_1.SocketMessageType.GAME_NOT_FOUND,
                    }));
                    return;
                }
                // if user already in player list or this is custom game and user is host then we emit user reconnected
                if (players.find((p) => p.user_id === user.user_id) ||
                    (game.is_custom && user.user_id === game.host.user_id)) {
                    const payload = {
                        user_id: user.user_id,
                        username: user.username,
                    };
                    PubSubManager_1.default.getInstance().publish(game_id, JSON.stringify({
                        type: types_1.SocketMessageType.USER_RECONNECTED,
                        payload,
                    }));
                }
                else {
                    // adding user to list of players
                    players.push({
                        user_id: user.user_id,
                        username: user.username,
                        score: 0,
                    });
                    // updating players list in redis
                    yield this.setGamePlayers(game_id, players);
                    const response = {
                        user_id: user.user_id,
                        username: user.username,
                        score: 0,
                    };
                    // letting other people in this room know
                    PubSubManager_1.default.getInstance().publish(game_id, JSON.stringify({
                        type: types_1.SocketMessageType.NEW_USER,
                        payload: response,
                    }));
                }
                // subscribing user to game_id channel
                PubSubManager_1.default.getInstance().subscribe(user.user_id, game_id);
                // adding leave handler if user connection breaks
                user.socket.on("close", () => {
                    this.removeUserFromGame(user, game.game_id);
                });
                // sending user the participants in this room
                const payload = {
                    game_id,
                    is_random: game.is_random,
                    is_custom: game.is_custom,
                    host: game.host,
                    players,
                };
                user.emit(JSON.stringify({
                    type: types_1.SocketMessageType.GAME_JOINED,
                    payload,
                }));
                // if game started sending curr question
                if (game.isStarted) {
                    const payload = {
                        question: Object.assign(Object.assign({}, game.questions[game.currQuestionNumber - 1]), { answer: 0 }),
                        questionStartTime: game.currQuestionStartTime,
                    };
                    user.emit(JSON.stringify({
                        type: types_1.SocketMessageType.GAME_STARTED,
                        payload,
                    }));
                }
                else if (players.length === 2 && game.is_random) {
                    // game not started, if participants >= 2 then we start the game after 10s
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        yield this.startGame({ gameState: game });
                        // since we are starting the game, we delete it from the waiting list
                        yield this.deleteWaitingGameId(game.topic_id);
                    }), 10000);
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
                const game = yield this.getGameState(game_id);
                if (!players)
                    throw Error("No Player Exists");
                if (!game)
                    throw Error("No Player Exists");
                // unsubscribing user from game_id channel
                PubSubManager_1.default.getInstance().unsubscribe(user.user_id, game_id);
                // if game started or user host of custom game we only emit user disconnected and not remove them from players list
                if (game.isStarted ||
                    (game.is_custom && user.user_id === game.host.user_id)) {
                    const payload = {
                        user_id: user.user_id,
                        username: user.username,
                    };
                    PubSubManager_1.default.getInstance().publish(game_id, JSON.stringify({
                        type: types_1.SocketMessageType.USER_DISCONNECTED,
                        payload,
                    }));
                    return;
                }
                const remainingPlayers = players.filter((p) => p.user_id !== user.user_id);
                const payload = {
                    user_id: user.user_id,
                    username: user.username,
                };
                // publishing user left in game_id channel
                PubSubManager_1.default.getInstance().publish(game_id, JSON.stringify({
                    type: types_1.SocketMessageType.USER_LEFT,
                    payload,
                }));
                // if player was host and after he left other players remain then we update the host
                if (user.user_id === game.host.user_id && remainingPlayers.length) {
                    game.host = {
                        user_id: remainingPlayers[0].user_id,
                        username: remainingPlayers[0].username,
                    };
                    const payload = game.host;
                    PubSubManager_1.default.getInstance().publish(game_id, JSON.stringify({ type: types_1.SocketMessageType.NEW_HOST, payload }));
                    // updating game state in redis
                    yield this.setGameState(game_id, game);
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
    startGame(_a) {
        return __awaiter(this, arguments, void 0, function* ({ game_id, gameState, }) {
            try {
                const game = gameState || (yield this.getGameState(game_id || ""));
                if (game) {
                    game.currQuestionNumber = 1;
                    game.currQuestionStartTime = Date.now();
                    game.isStarted = true;
                    // publishing the game started with first question in the room
                    const payload = {
                        question: Object.assign(Object.assign({}, game.questions[game.currQuestionNumber - 1]), { answer: 0 }),
                        questionStartTime: game.currQuestionStartTime,
                    };
                    PubSubManager_1.default.getInstance().publish(game.game_id, JSON.stringify({
                        type: types_1.SocketMessageType.GAME_STARTED,
                        payload,
                    }));
                    // storing game state in redis
                    yield this.setGameState(game.game_id, game);
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
                    // if question expired or response not same as current question or user already answered this we return
                    if (this.isQuestionExpired(questionStartTime, currQuestion.time_limit) ||
                        currQuestion.question_id !== data.question_id ||
                        game.response.find((r) => r.question_id === data.question_id && r.user_id === user.user_id) ||
                        (game.is_custom && game.host.user_id === user.user_id)) {
                        return;
                    }
                    let is_correct = false, new_score = 0;
                    if (data.response === currQuestion.answer) {
                        is_correct = true;
                        // updating user score
                        const player = yield this.getGamePlayer(data.game_id, user.username);
                        if (player) {
                            player.score += currQuestion.difficulty * 50;
                            new_score = player.score;
                            yield this.setGamePlayers(data.game_id, [player]);
                        }
                    }
                    // publish correct answer by user in game_id channel
                    const payload = {
                        user_id: user.user_id,
                        username: user.username,
                        question_id: data.question_id,
                        is_correct,
                        score: new_score,
                    };
                    PubSubManager_1.default.getInstance().publish(data.game_id, JSON.stringify({
                        type: types_1.SocketMessageType.USER_RESPONSE,
                        payload,
                    }));
                    game.response.push({
                        game_id: game.game_id,
                        user_id: user.user_id,
                        question_id: data.question_id,
                        is_correct,
                        response: data.response,
                    });
                    yield this.setGameState(data.game_id, game);
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
                    // if game endee then we send game ended
                    if (game.is_ended) {
                        this.emitGameEnded(user);
                        return;
                    }
                    // current question time expired then we send the next question
                    const questionStartTime = game.currQuestionStartTime;
                    const questionTimeLimit = game.questions[game.currQuestionNumber - 1].time_limit;
                    // question expired so we increase question number
                    if (this.isQuestionExpired(questionStartTime, questionTimeLimit)) {
                        // if this is the last question then we send game ended
                        if (game.questions.length === game.currQuestionNumber) {
                            game.is_ended = true;
                            yield this.setGameState(game_id, game);
                            yield this.pushToDb(game);
                            this.emitGameEnded(user);
                            return;
                        }
                        else {
                            game.currQuestionNumber += 1;
                            game.currQuestionStartTime = Date.now();
                            // updating game state in redis
                            yield this.setGameState(game.game_id, game);
                        }
                    }
                    // sending next question and removing answer from object
                    const payload = {
                        question: Object.assign(Object.assign({}, game.questions[game.currQuestionNumber - 1]), { answer: 0 }),
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
    emitGameEnded(user) {
        user.emit(JSON.stringify({ type: types_1.SocketMessageType.GAME_ENDED }));
    }
    pushToDb(game) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const players = yield this.getGamePlayers(game.game_id);
                if (!players)
                    throw Error("No player in this game?");
                // starting transaction
                postgres_1.default.query("BEGIN");
                // pushing game into db
                const question_ids = game.questions
                    .map((q) => q.question_id)
                    .filter((id) => id !== undefined);
                const gameBody = {
                    game_id: game.game_id,
                    topic_id: game.topic_id,
                    player_ids: players.map((p) => p.user_id),
                    question_ids,
                };
                const insertGameQuery = `INSERT INTO games (game_id, topic_id, player_ids, question_ids) VALUES ($1, $2, $3, $4);`;
                yield postgres_1.default.query(insertGameQuery, [
                    gameBody.game_id,
                    gameBody.topic_id,
                    gameBody.player_ids,
                    gameBody.question_ids,
                ]);
                // pushing participants into db
                const insertParticipantQuery = `INSERT INTO participants (game_id, user_id, username, score) VALUES ($1, $2, $3, $4);`;
                yield Promise.all(players.map((player) => __awaiter(this, void 0, void 0, function* () {
                    yield postgres_1.default.query(insertParticipantQuery, [
                        gameBody.game_id,
                        player.user_id,
                        player.username,
                        player.score,
                    ]);
                })));
                // if custom game adding host as a participant so that they can also check this game
                if (game.is_custom) {
                    yield postgres_1.default.query(insertParticipantQuery, [
                        gameBody.game_id,
                        game.host.user_id,
                        game.host.username,
                        0,
                    ]);
                }
                // pushing user responses to the db
                const insertResponseQuery = `INSERT INTO responses (game_id, user_id, question_id, response, is_correct) VALUES ($1, $2, $3, $4, $5);`;
                yield Promise.all(game.response.map((response) => __awaiter(this, void 0, void 0, function* () {
                    yield postgres_1.default.query(insertResponseQuery, [
                        response.game_id,
                        response.user_id,
                        response.question_id,
                        response.response,
                        response.is_correct,
                    ]);
                })));
                postgres_1.default.query("COMMIT;");
                // deleting game state and players from redis
                yield this.deleteGamePlayers(game.game_id);
                yield this.deleteGameState(game.game_id);
            }
            catch (err) {
                postgres_1.default.query("ROLLBACK;");
                console.log("Error pushing game to db");
                console.log(err);
            }
        });
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
    sendInvite(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = {
                    game_id: data.game_id,
                    user_id: user.user_id,
                    username: user.username,
                };
                // sending invitation to all the users
                data.user_ids.forEach((user_id) => {
                    PubSubManager_1.default.getInstance().publish(`user.${user_id}`, JSON.stringify({
                        type: types_1.SocketMessageType.INVITATION,
                        payload,
                    }));
                });
            }
            catch (err) {
                console.log("Error sending invitation");
                console.log(err);
            }
        });
    }
}
GameManager.instance = null;
exports.default = GameManager;
