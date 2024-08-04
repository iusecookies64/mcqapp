"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = __importDefault(require("../middlewares"));
const topicController_1 = require("../controllers/topicController");
const router = (0, express_1.Router)();
router.post("/create", middlewares_1.default, topicController_1.CreateTopic);
router.post("/update", middlewares_1.default, topicController_1.UpdateTopic);
router.post("/delete", middlewares_1.default, topicController_1.DeleteTopic);
router.get("/all", middlewares_1.default, topicController_1.GetTopics);
exports.default = router;
