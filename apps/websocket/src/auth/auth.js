"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = require("jsonwebtoken");
var JWT_SECRET = "123456";
var extractAuthUser = function (token) {
    try {
        var decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return decoded;
    }
    catch (err) {
        return null;
    }
};
exports.default = extractAuthUser;
