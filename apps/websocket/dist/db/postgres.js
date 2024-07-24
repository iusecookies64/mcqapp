"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const client = new pg_1.Client({
    connectionString: process.env.DB_STRING,
});
client.connect((err) => {
    if (err) {
        console.log("error connecting to db");
    }
    else {
        console.log("Connected to db successfully");
    }
});
exports.default = client;
