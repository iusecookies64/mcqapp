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
exports.GameState = void 0;
const models_1 = __importDefault(require("../models"));
const getQuestions_1 = require("./getQuestions");
class GameState {
    constructor(contest_id) {
        // importing
        this.contest_id = contest_id;
        this.created_by = 1; // default values
        this.created_by_username = "";
        this.title = "My Contest";
        this.max_participants = 100;
        this.is_locked = false;
        this.password = "";
        this.start_time = Date.now();
        this.is_started = false;
        this.duration = 10;
        this.answers = new Map();
        this.difficulty = new Map();
        this.participants = new Map();
        this.questions = [];
        this.scores = new Map();
        this.response = [];
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // fetching contest details
                const getContestDetailsQuery = `SELECT c.*, u.username FROM contests c JOIN users u ON u.user_id = c.created_by WHERE contest_id=$1`;
                const contestQueryResult = yield models_1.default.query(getContestDetailsQuery, [
                    this.contest_id,
                ]);
                this.created_by = contestQueryResult.rows[0].created_by;
                this.created_by_username = contestQueryResult.rows[0].username;
                this.duration = contestQueryResult.rows[0].duration;
                this.is_locked = contestQueryResult.rows[0].is_locked;
                this.password = contestQueryResult.rows[0].password;
                this.title = contestQueryResult.rows[0].title;
                this.max_participants = contestQueryResult.rows[0].max_participants;
                // getting all questions
                this.questions = yield (0, getQuestions_1.getQuestions)(this.contest_id);
                // for each question adding its answer to answers
                this.questions.forEach((question) => {
                    this.answers.set(question.question_id, question.answer);
                    this.difficulty.set(question.question_id, question.difficulty);
                    // removing the answer from the questions list so it doesn't reach client
                    question.answer = "";
                });
                return true;
            }
            catch (err) {
                console.log(err);
                return false;
            }
        });
    }
    getReductionFactor() {
        const currentTime = Date.now();
        const timeElapsed = currentTime - this.start_time;
        const durationInMs = this.duration * 60 * 1000;
        // percentage of total duration finished
        const factor = timeElapsed / durationInMs;
        return factor;
    }
    submitResponse(username, user_id, question_id, response) {
        // if contest ended return false
        if (this.isEnded())
            return false;
        if (this.answers.get(question_id) === response) {
            this.response.push({ question_id, user_id, response, is_correct: true });
            const difficulty = this.difficulty.get(question_id) || 1;
            const score = Math.floor(50 * (1 - this.getReductionFactor()) * difficulty);
            this.scores.set(username, (this.scores.get(username) || 0) + score);
            return true;
        }
        else {
            this.response.push({ question_id, user_id, response, is_correct: false });
            return false;
        }
    }
    getScores() {
        const result = [];
        this.scores.forEach((value, key) => {
            result.push({ username: key, score: value });
        });
        return result;
    }
    getQuestions() {
        return this.questions;
    }
    getAllResponse() {
        return this.response;
    }
    isEnded() {
        if (!this.is_started)
            return false;
        const currentTime = Date.now();
        return currentTime >= this.start_time + this.duration * 60 * 1000;
    }
    isContestStarted() {
        return this.is_started;
    }
    setStarted() {
        this.is_started = true;
        this.start_time = Date.now();
    }
    // called when a participant joins the room
    addParticipant(username, user_id) {
        // if owner joining, then we don't add as participant
        if (user_id === this.created_by) {
            return;
        }
        this.participants.set(user_id, username);
        this.scores.set(username, 0);
    }
    // called when a participant leaves the room
    removeParticipant(user_id, username) {
        this.participants.delete(user_id);
        this.scores.delete(username);
    }
    checkPassword(password) {
        return this.password === password;
    }
    isFull() {
        return this.participants.size >= this.max_participants;
    }
    isParticipantPresent(user_id) {
        return this.participants.has(user_id);
    }
    isOwner(user_id) {
        return this.created_by === user_id;
    }
    getDuration() {
        return this.duration;
    }
    getContestData() {
        return {
            contest_id: this.contest_id,
            created_by: this.created_by,
            created_by_username: this.created_by_username,
            title: this.title,
            duration: this.duration,
            max_participants: this.max_participants,
        };
    }
    pushInDB() {
        return __awaiter(this, void 0, void 0, function* () {
            // updating contest
            const updateContestQuery = `UPDATE contests SET isEnded=TRUE, number_of_participants=$1 WHERE contest_id=$2`;
            yield models_1.default.query(updateContestQuery, [
                this.participants.size,
                this.contest_id,
            ]);
            // updating participants score
            const updateParticipants = `INSERT INTO participants (contest_id, user_id, score) VALUES ($1, $2, $3)`;
            for (const [user_id, username] of this.participants) {
                yield models_1.default.query(updateParticipants, [
                    this.contest_id,
                    user_id,
                    this.scores.get(username),
                ]);
            }
            const insertResponse = `INSERT INTO response (question_id, user_id, response, is_correst) VALUES ($1, $2, $3, $4)`;
            // inserting response
            this.response.forEach((response) => __awaiter(this, void 0, void 0, function* () {
                yield models_1.default.query(insertResponse, [
                    response.question_id,
                    response.user_id,
                    response.response,
                    response.is_correct,
                ]);
            }));
        });
    }
}
exports.GameState = GameState;
