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
exports.GetAllInvitations = exports.DeleteInvite = exports.AcceptInvite = exports.SendInvite = void 0;
const asyncErrorHandler_1 = require("../utils/asyncErrorHandler");
const models_1 = __importDefault(require("../models"));
const isContestFull_1 = require("../utils/isContestFull");
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const checkContestQuery = `
SELECT 1 FROM contests WHERE contest_id=$1 AND created_by=$2
`;
const createInviteQuery = `
INSERT INTO invitations (contest_id, username) VALUES ($1, $2)
`;
exports.SendInvite = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contest_id, users } = req.body; // request to user_id
    const owner_id = req.user_id; // user sending the invite, property added by middleware
    // checking if contest.created_by is same as owner_id
    const queryResult = yield models_1.default.query(checkContestQuery, [
        contest_id,
        owner_id,
    ]);
    if (queryResult.rowCount === 0)
        throw new CustomError_1.default("Invalid Request", 401);
    // request coming from right user, so we add this db
    yield Promise.all(users.map((user) => models_1.default.query(createInviteQuery, [contest_id, user])));
    res.status(200).json({
        message: "Invite Sent Successfully",
        status: "success",
    });
}));
const checkInvitationQuery = `
SELECT * FROM invitations WHERE invitation_id=$1
`;
const createParticipantQuery = `
INSERT INTO participants (contest_id, user_id) VALUES ($1, $2)
`;
const deleteInvitationQuery = `
DELETE FROM invitations WHERE invitation_id=$1
`;
exports.AcceptInvite = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { invitation_id } = req.body;
    const request_from_username = req.username;
    const user_id = req.user_id;
    // checking if such an invitation exist or not
    const inviteExistQueryResult = yield models_1.default.query(checkInvitationQuery, [
        invitation_id,
    ]);
    if (inviteExistQueryResult.rowCount === 0)
        throw new CustomError_1.default("No Invitation Exist", 404);
    const { contest_id, username } = inviteExistQueryResult.rows[0];
    // checking if requst coming from user same as user that got invite
    if (request_from_username !== username)
        throw new CustomError_1.default("Invalid Request", 401);
    // if invitation exist then we check if contest has space remaining
    const isFull = yield (0, isContestFull_1.isContestFull)(contest_id);
    // if room full we return room full
    if (isFull) {
        throw new CustomError_1.default("Room Full", 403);
    }
    else {
        // starting transaction
        yield models_1.default.query("BEGIN");
        // adding current user to participants
        yield models_1.default.query(createParticipantQuery, [contest_id, user_id]);
        // removing the invitation
        yield models_1.default.query(deleteInvitationQuery, [invitation_id]);
        // closing transactions
        yield models_1.default.query("COMMIT");
        res.status(200).json({
            message: "Contest Joined Successfully",
            status: "success",
        });
    }
}));
exports.DeleteInvite = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { invitation_id } = req.body;
    yield models_1.default.query(deleteInvitationQuery, [invitation_id]);
    res.status(200).json({
        message: "Invite Rejected",
        status: "success",
    });
}));
const getAllInvitationsQuery = `
SELECT 
  invitations.invitation_id,
  invitations.contest_id,
  contests.title,
  contests.created_by,
  users.username
FROM 
  invitations
INNER JOIN
  contests ON invitations.contest_id = contests.contest_id
INNER JOIN
  users ON contests.created_by = users.user_id
WHERE
  invitations.username = $1
`;
exports.GetAllInvitations = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.username;
    // getting all invitations for the user
    const queryResult = yield models_1.default.query(getAllInvitationsQuery, [username]);
    res.status(200).json({
        message: "All Invitations Fetched Successfully",
        status: "success",
        data: queryResult.rows,
    });
}));
