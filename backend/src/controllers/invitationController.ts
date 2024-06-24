import { asyncErrorHandler } from "../utils/asyncErrorHandler";
import { SendInviteRequest } from "../types/requests";
import { CustomRequest } from "../middlewares";
import client from "../models";
import { AcceptInvitationRequest } from "../types/requests";
import { isContestFull } from "../utils/isContestFull";
import CustomError from "../utils/CustomError";

const checkContestQuery = `
SELECT 1 FROM contests WHERE contest_id=$1 AND created_by=$2
`;

const createInviteQuery = `
INSERT INTO invitations (contest_id, user_id) VALUES ($1, $2)
`;

export const SendInvite = asyncErrorHandler(
  async (req: SendInviteRequest, res) => {
    const contest_id = req.body.contest_id;
    const user_id = req.body.user_id; // request to user_id
    const owner_id = (req as CustomRequest).user_id; // user sending the invite, property added by middleware

    // checking if contest.created_by is same as owner_id
    const queryResult = await client.query(checkContestQuery, [
      contest_id,
      owner_id,
    ]);

    if (queryResult.rowCount === 0)
      throw new CustomError("Invalid Request", 401);

    // request coming from right user, so we add this db
    await client.query(createInviteQuery, [contest_id, user_id]);

    res.status(200).json({
      message: "Invite Sent Successfully",
      status: "success",
    });
  }
);

const checkInvitationQuery = `
SELECT 1 FROM invitations WHERE contest_id=$1 AND user_id=$2
`;

const createParticipantQuery = `
INSERT INTO participants (contest_id, user_id) VALUES ($1, $2)
`;

const deleteInvitationQuery = `
DELETE FROM invitations WHERE contest_id=$1 AND user_id=$2
`;

export const AcceptInvite = asyncErrorHandler(
  async (req: AcceptInvitationRequest, res) => {
    const { contest_id, user_id } = req.body;
    const request_from_user_id = (req as CustomRequest).user_id;
    // checking if requst coming from user same as user that got invite
    if (user_id !== request_from_user_id)
      throw new CustomError("Invalid Request", 401);

    // checking if such an invitation exist or not
    const inviteExistQueryResult = await client.query(checkInvitationQuery, [
      contest_id,
      user_id,
    ]);
    if (inviteExistQueryResult.rowCount === 0)
      throw new CustomError("No Such Invitation Exist", 404);

    // if invitation exist then we check if contest has space remaining
    const isFull = await isContestFull(contest_id);

    // if room full we return room full
    if (isFull) {
      throw new CustomError("Room Full", 403);
    } else {
      // starting transaction
      await client.query("BEGIN");
      // adding current user to participants
      await client.query(createParticipantQuery, [contest_id, user_id]);
      // removing the invitation
      await client.query(deleteInvitationQuery, [contest_id, user_id]);
      // closing transactions
      await client.query("COMMIT");

      res.status(200).json({
        message: "Contest Joined Successfully",
        status: "success",
      });
    }
  }
);

export const DeleteInvite = asyncErrorHandler(
  async (req: AcceptInvitationRequest, res) => {
    const { contest_id, user_id } = req.body;
    await client.query(deleteInvitationQuery, [contest_id, user_id]);
    res.status(200).json({
      message: "Invite Rejected",
      status: "success",
    });
  }
);

const getAllInvitationsQuery = `
SELECT 
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
  invitations.user_id = $1
`;

export const GetAllInvitations = asyncErrorHandler(async (req, res) => {
  const user_id = (req as CustomRequest).user_id;
  // getting all invitations for the user
  const queryResult = await client.query(getAllInvitationsQuery, [user_id]);

  res.status(200).json({
    message: "All Invitations Fetched Successfully",
    status: "success",
    data: queryResult.rows,
  });
});
