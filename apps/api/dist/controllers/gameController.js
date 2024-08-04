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
exports.GetPastGames = void 0;
const postgres_1 = __importDefault(require("../db/postgres"));
const asyncErrorHandler_1 = require("../utils/asyncErrorHandler");
const getPastGamesQuery = `
SELECT
    g.game_id,
    g.created_at,
    t.title,
    array_agg(DISTINCT jsonb_build_object('game_id', p.game_id, 'user_id', p.user_id, 'username', p.username, 'score', p.score)) AS participants,
    array_agg(DISTINCT jsonb_build_object('question_id', q.question_id, 'statement', q.statement, 'answer', q.answer, 'option1', q.option1, 'option2', q.option2, 'option3', q.option3, 'option4', q.option4, 'difficulty', q.difficulty, 'time_limit', q.time_limit)) AS questions,
    COALESCE(
        array_agg(DISTINCT jsonb_build_object('response_id', r.response_id, 'game_id', r.game_id, 'question_id', r.question_id, 'user_id', r.user_id, 'response', r.response, 'is_correct', r.is_correct)) FILTER (WHERE r.response_id IS NOT NULL),
        ARRAY[]::jsonb[]
    ) AS responses
FROM
    games g
    JOIN topics t ON g.topic_id = t.topic_id
    JOIN participants p ON g.game_id = p.game_id
    JOIN questions q ON q.question_id = ANY(g.question_ids)
    LEFT JOIN responses r ON r.game_id = g.game_id AND r.user_id = p.user_id
WHERE
    p.user_id = $1
GROUP BY
    g.game_id, t.title;
`;
exports.GetPastGames = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req;
    const result = yield postgres_1.default.query(getPastGamesQuery, [user_id]);
    const response = {
        message: "All Past Games",
        status: "success",
        data: result.rows,
    };
    res.json(response);
}));
