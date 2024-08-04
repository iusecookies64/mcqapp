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
exports.GetTopics = exports.DeleteTopic = exports.UpdateTopic = exports.CreateTopic = void 0;
const validations_1 = require("@mcqapp/validations");
const asyncErrorHandler_1 = require("../utils/asyncErrorHandler");
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const postgres_1 = __importDefault(require("../db/postgres"));
const types_1 = require("@mcqapp/types");
const createTopicQuery = `INSERT INTO topics (title, created_by) VALUES ($1, $2) RETURNING *;`;
exports.CreateTopic = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, data } = validations_1.CreateTopicInput.safeParse(req.body);
    const { user_id } = req;
    if (!success)
        throw new CustomError_1.default("Invalid Input", types_1.StatusCodes.InvalidInput);
    const result = yield postgres_1.default.query(createTopicQuery, [data.title, user_id]);
    const response = {
        message: "Topic Created Successfully",
        status: "success",
        data: result.rows[0],
    };
    res.json(response);
}));
const updateTopicQuery = `UPDATE topics SET title=$1 WHERE topic_id=$2 AND created_by=$3;`;
exports.UpdateTopic = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, data } = validations_1.UpdateTopicInput.safeParse(req.body);
    const { user_id } = req;
    if (!success)
        throw new CustomError_1.default("Invalid Input", types_1.StatusCodes.InvalidInput);
    yield postgres_1.default.query(updateTopicQuery, [
        data.new_title,
        data.topic_id,
        user_id,
    ]);
    const response = {
        message: "Topic Updated Successfully",
        status: "success",
    };
    res.json(response);
}));
const deleteTopicQuery = `DELETE FROM topics WHERE topic_id=$1 AND created_by=$2;`;
exports.DeleteTopic = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, data } = validations_1.DeleteTopicInput.safeParse(req.body);
    const { user_id } = req;
    if (!success)
        throw new CustomError_1.default("Invalid Input", types_1.StatusCodes.InvalidInput);
    yield postgres_1.default.query(deleteTopicQuery, [data.topic_id, user_id]);
    const response = {
        message: "Topic Deleted Successfully",
        status: "success",
    };
    res.json(response);
}));
const getAllTopics = `SELECT * FROM topics WHERE created_by = ANY($1);`;
exports.GetTopics = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req;
    const result = yield postgres_1.default.query(getAllTopics, [[1, user_id]]);
    const response = {
        message: "All Topics",
        status: "success",
        data: result.rows,
    };
    res.json(response);
}));
