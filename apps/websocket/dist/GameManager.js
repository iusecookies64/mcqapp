"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GameManager {
    constructor() {
        this.duelGames = new Map();
        this.groupGames = new Map();
        this.duelGamesWaiting = new Map();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new GameManager();
        }
        return this.instance;
    }
    addHandlers(user) { }
}
GameManager.instance = null;
exports.default = GameManager;
