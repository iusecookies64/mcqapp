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
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const verifyToken_1 = require("../utils/verifyToken");
const asyncErrorHandler_1 = require("../utils/asyncErrorHandler");
const jwtPassword = process.env.SECRET || "123456";
const queryString = `
SELECT * FROM users WHERE username=$1 AND user_id=$2
`;
const authorizeUser = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    if (!token)
        throw new CustomError_1.default("INVALID_TOKEN", 401);
    // token exist so we check if it valid
    const payload = yield (0, verifyToken_1.VerifyToken)(token);
    // adding username and user_id to req, as it might be useful later on
    req.user_id = payload.user_id;
    req.username = payload.username;
    next();
}));
exports.default = authorizeUser;
