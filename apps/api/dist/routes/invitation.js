"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = __importDefault(require("../middlewares"));
const invitationController_1 = require("../controllers/invitationController");
const router = (0, express_1.Router)();
router.post("/send-invite", middlewares_1.default, invitationController_1.SendInvite);
router.post("/accept-invite", middlewares_1.default, invitationController_1.AcceptInvite);
router.post("/delete", middlewares_1.default, invitationController_1.DeleteInvite);
router.get("/all-invitations", middlewares_1.default, invitationController_1.GetAllInvitations);
exports.default = router;
