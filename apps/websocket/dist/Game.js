"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupGame = exports.DuelGame = void 0;
class DuelGame {
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new DuelGame();
        }
    }
}
exports.DuelGame = DuelGame;
class GroupGame {
    constructor() {
        this.gameId = 0;
        this.users = [];
    }
}
exports.GroupGame = GroupGame;
