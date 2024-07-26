"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(userDetails, socket) {
        this.user_id = userDetails.user_id;
        this.username = userDetails.username;
        this.socket = socket;
    }
    emit(message) {
        this.socket.send(message);
    }
}
exports.User = User;
