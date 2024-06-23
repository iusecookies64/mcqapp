import { Router } from "express";
import authorizeUser from "../middlewares";
import { ContestTable, OptionsTable, QuestionTable } from "../types/models";
import client from "../models";
import { CreateContestRequest, CreateQuestionRequest } from "../types/requests";
const router = Router();

const createContestQuery = `
INSERT INTO contests (created_by, title, max_participants, start_time, duration, invite_only)
VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
`;

router.post(
  "/create",
  authorizeUser,
  async (req: CreateContestRequest, res) => {
    try {
      const {
        created_by,
        title,
        max_participants,
        start_time,
        duration,
        invite_only,
      } = req.body.contest;

      const queryResult = await client.query(createContestQuery, [
        created_by,
        title,
        max_participants,
        start_time,
        duration,
        invite_only,
      ]);

      res.status(200).json({
        message: "Contest Created Successfully",
        contest: queryResult.rows[0],
        success: true,
      });
    } catch (err) {
      res.status(400).json({
        message: "Invalid Request",
        success: false,
      });
    }
  }
);

const updateContestQuery = `
UPDATE contests 
SET title=$1,
    max_participants=$2,
    start_time=$3,
    duration=$4,
    invite_only=$5,
WHERE contest_id=$6
RETURNING *
`;

router.post(
  "/update",
  authorizeUser,
  async (req: CreateContestRequest, res) => {
    try {
      const {
        title,
        max_participants,
        start_time,
        duration,
        invite_only,
        contest_id,
      } = req.body.contest;

      const queryResult = await client.query(createContestQuery, [
        title,
        max_participants,
        start_time,
        duration,
        invite_only,
        contest_id,
      ]);

      res.status(200).json({
        message: "Contest Updated Successfully",
        contest: queryResult.rows[0],
        success: true,
      });
    } catch (err) {
      res.status(400).json({
        message: "Invalid Request",
        success: false,
      });
    }
  }
);

export default router;
