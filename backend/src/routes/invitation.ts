import { Router } from "express";
import authorizeUser, { CustomRequest } from "../middlewares";
import { AcceptInvitationRequest, SendInviteRequest } from "../types/requests";
import client from "../models";
import { isContestFull } from "../utils";
const router = Router();

const checkContestQuery = `
SELECT 1 FROM contests WHERE contest_id=$1 AND created_by=$2
`;

const createInviteQuery = `
INSERT INTO invitations (contest_id, user_id) VALUES ($1, $2)
`;

router.post(
  "/send-invite",
  authorizeUser,
  async (req: SendInviteRequest, res) => {
    try {
      const contest_id = req.body.contest_id;
      const user_id = req.body.user_id; // request to user_id
      // added by authorizeUser middleware
      const owner_id = (req as CustomRequest).user_id; // user sending the invite

      // checking if contest.created_by is same as owner_id
      const queryResult = await client.query(checkContestQuery, [
        contest_id,
        owner_id,
      ]);

      if (queryResult.rowCount === 0) throw Error;

      // request is sent by contest owner
      await client.query(createInviteQuery, [contest_id, user_id]);

      res.status(200).json({
        message: "Invite Sent Successfully",
        success: true,
      });
    } catch (err) {
      res.status(401).json({
        message: "Unauthorized Request",
        success: true,
      });
    }
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

router.post(
  "/accept-invite",
  authorizeUser,
  async (req: AcceptInvitationRequest, res) => {
    try {
      const { contest_id, user_id } = req.body;
      // checking if such an invitation exist or not
      const inviteExistQueryResult = await client.query(checkInvitationQuery, [
        contest_id,
        user_id,
      ]);
      if (inviteExistQueryResult.rowCount === 0) throw Error;

      // if invitation exist then we check if contest has space remaining
      const isFull = await isContestFull(contest_id);

      // if room full we return room full
      if (isFull) {
        res.status(403).json({
          message: "Contest Room Full",
          success: false,
        });
      } else {
        // starting transaction
        await client.query("BEGIN");
        // adding current user to participants
        await client.query(createParticipantQuery, [contest_id, user_id]);
        res.status(200).json({
          message: "Contest Joined Successfully",
          success: true,
        });
        // removing the invitation
        await client.query(deleteInvitationQuery, [contest_id, user_id]);
        // closing transactions
        await client.query("COMMIT");
      }
    } catch (err) {
      // rolling back in case error in one of the request
      await client.query("ROLLBACK");
      res.status(400).json({
        message: "Invalid Request",
        success: false,
      });
    }
  }
);

router.post(
  "/delete",
  authorizeUser,
  async (req: AcceptInvitationRequest, res) => {
    const { contest_id, user_id } = req.body;
    await client.query(deleteInvitationQuery, [contest_id, user_id]);
  }
);

export default router;
