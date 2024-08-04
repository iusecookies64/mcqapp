"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = __importDefault(require("../middlewares"));
const questionController_1 = require("../controllers/questionController");
const isUserCreatedContest_1 = require("../middlewares/isUserCreatedContest");
const router = (0, express_1.Router)();
router.get("/my-questions", middlewares_1.default, questionController_1.GetUserQuestions);
router.post("/create", middlewares_1.default, isUserCreatedContest_1.isUserCreatedContest, questionController_1.CreateQuestion);
router.post("/update", middlewares_1.default, isUserCreatedContest_1.isUserCreatedContest, questionController_1.UpdateQuestion);
router.post("/delete", middlewares_1.default, isUserCreatedContest_1.isUserCreatedContest, questionController_1.DeleteQuestion);
exports.default = router;
