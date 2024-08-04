"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
// adding env variables to node process
(0, dotenv_1.config)();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const users_1 = __importDefault(require("./routes/users"));
const games_1 = __importDefault(require("./routes/games"));
const questions_1 = __importDefault(require("./routes/questions"));
const topics_1 = __importDefault(require("./routes/topics"));
const errorController_1 = require("./controllers/errorController");
const CustomError_1 = __importDefault(require("./utils/CustomError"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = require("express-rate-limit");
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 60 * 1000, // 1 min window
    limit: 20, // 20 requests per window
});
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use(limiter);
app.use(express_1.default.json()); // req.body parser
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static("./public"));
app.use("/users", users_1.default);
app.use("/games", games_1.default);
app.use("/questions", questions_1.default);
app.use("/topics", topics_1.default);
app.all("*", (req, res, next) => {
    throw new CustomError_1.default("Oops! Error 404 Not Found", 404);
});
app.use(errorController_1.GlobalErrorHandler);
app.listen(port, () => {
    console.log("Server Up And Running On Port", port);
});
