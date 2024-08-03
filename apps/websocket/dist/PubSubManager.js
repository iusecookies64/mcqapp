"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const UserManager_1 = __importDefault(require("./UserManager"));
const REDIS_STRING = process.env.REDIS_STRING;
class PubSubManager {
    constructor() {
        this.subscriptions = new Map();
        this.reverseSubscriptions = new Map();
        this.publishClient = (0, redis_1.createClient)({ url: REDIS_STRING });
        this.subscribeClient = (0, redis_1.createClient)({ url: REDIS_STRING });
        this.publishClient.connect();
        this.subscribeClient.connect();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new PubSubManager();
        }
        return this.instance;
    }
    subscribe(user_id, channel) {
        var _a, _b;
        // checking if user already subscribed
        if ((_a = this.subscriptions.get(user_id)) === null || _a === void 0 ? void 0 : _a.find((c) => c === channel)) {
            return;
        }
        // user not subscribed so we subscribe it
        this.subscriptions.set(user_id, (this.subscriptions.get(user_id) || []).concat(channel));
        this.reverseSubscriptions.set(channel, (this.reverseSubscriptions.get(channel) || []).concat(user_id));
        if (((_b = this.reverseSubscriptions.get(channel)) === null || _b === void 0 ? void 0 : _b.length) === 1) {
            // this is the first time someone is subscibing to this channel
            this.reverseSubscriptions.set(channel, [user_id]);
            this.subscribeClient.subscribe(channel, (message) => {
                var _a;
                (_a = this.reverseSubscriptions.get(channel)) === null || _a === void 0 ? void 0 : _a.forEach((user_id) => {
                    var _a;
                    (_a = UserManager_1.default.getInstance().getUser(user_id)) === null || _a === void 0 ? void 0 : _a.emit(message);
                });
            });
        }
    }
    unsubscribe(user_id, channel) {
        var _a, _b, _c, _d;
        // removing channel from list of subscribed channels
        this.subscriptions.set(user_id, ((_a = this.subscriptions.get(user_id)) === null || _a === void 0 ? void 0 : _a.filter((c) => c !== channel)) || []);
        if (((_b = this.subscriptions.get(user_id)) === null || _b === void 0 ? void 0 : _b.length) === 0) {
            this.subscriptions.delete(user_id);
        }
        // removing user from reverseSubscriptions of channel
        this.reverseSubscriptions.set(channel, ((_c = this.reverseSubscriptions.get(channel)) === null || _c === void 0 ? void 0 : _c.filter((u) => u !== user_id)) || []);
        // if this was the last user interested in this channel unsubscribe
        if (((_d = this.reverseSubscriptions.get(channel)) === null || _d === void 0 ? void 0 : _d.length) === 0) {
            this.reverseSubscriptions.delete(channel);
            this.subscribeClient.unsubscribe(channel);
        }
    }
    publish(channel, message) {
        this.publishClient.publish(channel, message);
    }
    userLeft(user_id) {
        var _a;
        (_a = this.subscriptions
            .get(user_id)) === null || _a === void 0 ? void 0 : _a.forEach((channel) => this.unsubscribe(user_id, channel));
    }
}
PubSubManager.instance = null;
exports.default = PubSubManager;
