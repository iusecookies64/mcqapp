"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameManager_1 = __importDefault(require("./GameManager"));
const SubscriptionManager_1 = __importDefault(require("./SubscriptionManager"));
class UserManager {
    constructor() {
        this.users = [];
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new UserManager();
        }
        return this.instance;
    }
    getUser(user_id) {
        return this.users.find((u) => u.user_id === user_id);
    }
    addUser(user) {
        this.users.push(user);
        // adding all the socket handlers
        GameManager_1.default.getInstance().addHandlers(user);
        user.socket.on("close", () => {
            SubscriptionManager_1.default.getInstance().userLeft(user.user_id);
        });
    }
}
UserManager.instance = null;
exports.default = UserManager;
