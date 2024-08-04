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
exports.GetMatchingUsers = exports.refreshToken = exports.Protected = exports.Signin = exports.Signup = void 0;
const asyncErrorHandler_1 = require("../utils/asyncErrorHandler");
const verifyToken_1 = require("../utils/verifyToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const postgres_1 = __importDefault(require("../db/postgres"));
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const validations_1 = require("@mcqapp/validations");
const types_1 = require("@mcqapp/types");
const saltRounds = parseInt(process.env.SALT || "0") || 10;
const jwtSecret = process.env.SECRET || "123456";
// function to handle signup requests
const createUserQuery = `
INSERT INTO users (username, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5);
`;
exports.Signup = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, data } = validations_1.SignupInput.safeParse(req.body);
    if (!success)
        throw new CustomError_1.default("Invalid Input", types_1.StatusCodes.InvalidInput);
    const { password, email, username, last_name, first_name } = data;
    // converting password to hash value
    const hash = yield bcrypt_1.default.hash(password, saltRounds);
    const result = yield postgres_1.default.query(createUserQuery, [
        username,
        first_name,
        last_name,
        email,
        hash,
    ]);
    const response = {
        message: "Account Created Successfully",
        status: "success",
        data: null,
    };
    res.json(response);
}));
// function to handle signin requests
const expiresIn = 60000;
const getUserQuery = `Select * FROM users WHERE username=$1`;
exports.Signin = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, data } = validations_1.SigninInput.safeParse(req.body);
    if (!success)
        throw new CustomError_1.default("Invalid Input", types_1.StatusCodes.InvalidInput);
    const { username, password } = data;
    const queryResult = yield postgres_1.default.query(getUserQuery, [username]);
    // if user not found
    if (queryResult.rowCount === 0)
        throw new CustomError_1.default("Username Not Found", types_1.StatusCodes.NotFound);
    const userObject = queryResult.rows[0];
    // if user found compare password with hashed password
    const comparisionResult = yield bcrypt_1.default.compare(password, userObject.password);
    if (comparisionResult === false)
        throw new CustomError_1.default("Incorrect Password", types_1.StatusCodes.Unauthorized);
    // valid password so we return an auth token to user
    const payload = {
        username,
        user_id: userObject.user_id,
    };
    const access_token = jsonwebtoken_1.default.sign(payload, jwtSecret, { expiresIn });
    const refresh_token = jsonwebtoken_1.default.sign(payload, jwtSecret);
    const response = {
        message: "Sign In Successfull",
        status: "success",
        data: {
            access_token,
            refresh_token,
            expiresIn,
            user: queryResult.rows[0],
        },
    };
    res.status(200).json(response);
}));
exports.Protected = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // request reaches here after passing through auth middleware
    const { username, user_id } = req;
    const response = {
        message: "Valid Token",
        status: "success",
        data: {
            username,
            user_id,
        },
    };
    res.json(response);
}));
exports.refreshToken = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refresh_token } = req.cookies;
    if (!refresh_token)
        throw new CustomError_1.default("INVALID_TOKEN", 401);
    const decoded = yield (0, verifyToken_1.VerifyToken)(refresh_token);
    const payload = {
        user_id: decoded.user_id,
        username: decoded.username,
    };
    const access_token = jsonwebtoken_1.default.sign(payload, jwtSecret, { expiresIn });
    const response = {
        message: "New Access Token",
        status: "success",
        data: {
            access_token,
            username: decoded.username,
            expiresIn,
        },
    };
    res.json(response);
}));
const getMatchingUsersQuery = "SELECT * FROM users WHERE username LIKE $1";
exports.GetMatchingUsers = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, data } = validations_1.GetMatchingUsersInput.safeParse(req.body);
    if (success) {
        // adding % to match all string that starts with searchString
        const result = yield postgres_1.default.query(getMatchingUsersQuery, [
            data.searchString + "%",
        ]);
        const response = {
            message: "All Matching Users",
            status: "success",
            data: result.rows.map((r) => ({
                username: r.username,
                user_id: r.user_id,
            })),
        };
        res.json(response);
    }
    else {
        res.json([]);
    }
}));
