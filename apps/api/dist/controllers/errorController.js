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
exports.GlobalErrorHandler = void 0;
const postgres_1 = __importDefault(require("../db/postgres"));
const devErrors = (res, err) => {
    res.status(err.statusCode || 500).json({
        status: err.status,
        message: err.message,
        stacktrace: err.stack,
        err: err,
    });
};
const prodErros = (res, err) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    else if (err.code === "23505") {
        res.status(403).json({
            message: "Username already exist",
            status: "fail",
        });
    }
    else {
        res.status(500).json({
            message: "Something Went Wrong! Please Try Again",
            status: "error",
        });
    }
};
const GlobalErrorHandler = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // rolling back if error occurred in middle of any transaction
    yield postgres_1.default.query("ROLLBACK");
    if (process.env.NODE_ENV === "development") {
        devErrors(res, err);
    }
    else if (process.env.NODE_ENV === "production") {
        prodErros(res, err);
    }
});
exports.GlobalErrorHandler = GlobalErrorHandler;
