"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameManager_1 = __importDefault(require("./GameManager"));
const PubSubManager_1 = __importDefault(require("./PubSubManager"));
class UserManager {
    constructor() {
        this.users = new Map();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new UserManager();
        }
        return this.instance;
    }
    getUser(user_id) {
        return this.users.get(user_id);
    }
    addUser(user) {
        this.users.set(user.user_id, user);
        // adding all the socket handlers
        GameManager_1.default.getInstance().addHandlers(user);
        // subscribing to all messages in user.user_id channel
        PubSubManager_1.default.getInstance().subscribe(user.user_id, `user.${user.user_id}`);
        user.socket.on("close", () => {
            PubSubManager_1.default.getInstance().userLeft(user.user_id); // unsubscribe user from all channels
        });
    }
}
UserManager.instance = null;
exports.default = UserManager;
