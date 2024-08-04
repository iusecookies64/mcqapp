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
exports.GetUserQuestions = exports.DeleteQuestion = exports.UpdateQuestion = exports.CreateQuestion = void 0;
const asyncErrorHandler_1 = require("../utils/asyncErrorHandler");
const postgres_1 = __importDefault(require("../db/postgres"));
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const validations_1 = require("@mcqapp/validations");
const types_1 = require("@mcqapp/types");
const createQuestionQuery = `
INSERT INTO questions (created_by, topic_id, statement, answer, option1, option2, option3, option4, difficulty, time_limit) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
`;
exports.CreateQuestion = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, data, error } = validations_1.CreateQuestionInput.safeParse(req.body);
    const { user_id } = req;
    if (error)
        console.log(error);
    if (!success)
        throw new CustomError_1.default("Invalid Input", types_1.StatusCodes.InvalidInput);
    // adding question to database
    const result = yield postgres_1.default.query(createQuestionQuery, [
        user_id,
        data.topic_id,
        data.statement,
        data.answer,
        data.option1,
        data.option2,
        data.option3,
        data.option4,
        data.difficulty,
        data.time_limit,
    ]);
    const response = {
        message: "Question Added Successfully",
        status: "success",
        data: result.rows[0],
    };
    res.status(200).json(response);
}));
const updateQuestionQuery = `
UPDATE questions 
SET
  topic_id=$1,
  statement=$2,
  answer=$3,
  option1=$4,
  option2=$5,
  option3=$6,
  option4=$7,
  difficulty=$8,
  time_limit=$9
WHERE question_id=$10 AND created_by=$11
`;
exports.UpdateQuestion = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, data } = validations_1.UpdateQuestionInput.safeParse(req.body);
    const { user_id } = req;
    if (!success)
        throw new CustomError_1.default("Invalid Input", types_1.StatusCodes.InvalidInput);
    // updating question in database
    yield postgres_1.default.query(updateQuestionQuery, [
        data.topic_id,
        data.statement,
        data.answer,
        data.option1,
        data.option2,
        data.option3,
        data.option4,
        data.difficulty,
        data.time_limit,
        data.question_id,
        user_id,
    ]);
    const response = {
        message: "Question Updated Successfully",
        status: "success",
    };
    res.json(response);
}));
// handler for deleting a question
const deleteQuestionQuery = `DELETE FROM questions WHERE question_id=$1 AND created_by=$2`;
exports.DeleteQuestion = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, data } = validations_1.DeleteQuestionInput.safeParse(req.body);
    if (!success)
        throw new CustomError_1.default("Invalid Input", types_1.StatusCodes.InvalidInput);
    const { user_id } = req;
    // deleting question
    yield postgres_1.default.query(deleteQuestionQuery, [data.question_id, user_id]);
    const response = {
        message: "Question Deleted Successfully",
        status: "success",
    };
    res.status(200).json(response);
}));
// sending questions to user for who created contest
const getUserQuestionsQuery = `SELECT * FROM questions WHERE created_by=$1`;
exports.GetUserQuestions = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req;
    const result = yield postgres_1.default.query(getUserQuestionsQuery, [user_id]);
    const response = {
        message: "All questions fetched successfully",
        status: "success",
        data: result.rows,
    };
    res.status(200).json(response);
}));
