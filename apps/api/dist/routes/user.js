"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const middlewares_1 = __importDefault(require("../middlewares"));
const router = (0, express_1.Router)();
router.post("/signup", userController_1.Signup);
router.post("/signin", userController_1.Signin);
router.get("/protected", middlewares_1.default, userController_1.Protected);
router.get("/refreshtoken", userController_1.refreshToken);
exports.default = router;
