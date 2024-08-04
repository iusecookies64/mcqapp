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
exports.getQuestions = void 0;
const postgres_1 = __importDefault(require("../db/postgres"));
const getQuestions = (contest_id) => __awaiter(void 0, void 0, void 0, function* () {
    // fetching all questions
    const getQuestionsQuery = `SELECT * FROM questions WHERE contest_id=$1`;
    const questionQueryResult = yield postgres_1.default.query(getQuestionsQuery, [
        contest_id,
    ]);
    const questions = [];
    const getOptionsQuery = `SELECT * FROM options WHERE question_id=$1`;
    // asynchronously getting all the options for each question
    yield Promise.all(questionQueryResult.rows.map((question) => __awaiter(void 0, void 0, void 0, function* () {
        const optionQueryResult = yield postgres_1.default.query(getOptionsQuery, [
            question.question_id,
        ]);
        questions.push(Object.assign(Object.assign({}, question), { options: optionQueryResult.rows }));
    })));
    return questions;
});
exports.getQuestions = getQuestions;
