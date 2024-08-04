"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gameController_1 = require("../controllers/gameController");
const middlewares_1 = __importDefault(require("../middlewares"));
const router = (0, express_1.Router)();
router.get("/past-games", middlewares_1.default, gameController_1.GetPastGames);
exports.default = router;
