import { asyncErrorHandler } from "../utils/asyncErrorHandler";
import {
  CreateContestBody,
  PublishContestBody,
  UpdateContestBody,
  GetParticipantsBody,
} from "../types/requests";
import client from "../models";
import { CustomRequest } from "../middlewares";
import { manager } from "./gameController";
import { ContestTable } from "../types/models";

const createContestQuery = `
INSERT INTO contests (created_by, title, max_participants, is_locked, password, duration)
VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
`;

export const CreateContest = asyncErrorHandler(async (req, res) => {
  const { created_by, title, max_participants, is_locked, password, duration } =
    req.body as CreateContestBody;

  const queryResult = await client.query(createContestQuery, [
    created_by,
    title,
    max_participants,
    is_locked,
    password,
    duration,
  ]);

  res.status(200).json({
    message: "Contest Created Successfully",
    data: { ...queryResult.rows[0] },
    status: "success",
  });
});

const updateContestQuery = `
UPDATE contests 
SET title=$1,
    max_participants=$2,
    is_locked=$3,
    password=$4,
    duration=$5
WHERE contest_id=$6
RETURNING *
`;

export const UpdateContest = asyncErrorHandler(async (req, res) => {
  const { title, max_participants, is_locked, password, duration, contest_id } =
    req.body as UpdateContestBody;

  const queryResult = await client.query(updateContestQuery, [
    title,
    max_participants,
    is_locked,
    password,
    duration,
    contest_id,
  ]);

  res.status(200).json({
    message: "Contest Updated Successfully",
    data: queryResult.rows[0],
    status: "success",
  });
});

const deleteContest =
  "DELETE FROM contests WHERE contest_id=$1 AND created_by=$2 AND published=FALSE";

export const DeleteContest = asyncErrorHandler(async (req, res) => {
  const { contest_id } = req.query;
  const { user_id } = req as CustomRequest;

  // deleting contest
  await client.query(deleteContest, [contest_id, user_id]);

  res.status(200).json({
    message: "Contest Deleted",
    status: "success",
  });
});

const publishContestQuery = `
UPDATE contests SET published=TRUE WHERE contest_id=$1 AND created_by=$2
`;

export const PublishContest = asyncErrorHandler(async (req, res) => {
  const contest_id = parseInt((req.query.contest_id as string) || "");
  const { user_id } = req as CustomRequest;
  await client.query(publishContestQuery, [contest_id, user_id]);

  // adding contest to manager
  manager.addContest(contest_id);

  res.status(200).json({
    message: "Contest Published Successfully",
    status: "success",
  });
});

export const GetActiveContests = asyncErrorHandler(async (req, res) => {
  // getting all active games from games manager
  const result = manager.getActiveContests();
  res.status(200).json({
    message: "All Active Contests",
    status: "success",
    data: result,
  });
});

const getMyContestsQuery = `SELECT * FROM contests WHERE contests.created_by=$1`;
export const GetMyContests = asyncErrorHandler(async (req, res) => {
  const { user_id } = req as CustomRequest;
  const queryResult = await client.query(getMyContestsQuery, [user_id]);
  res.status(200).json({
    message: "All User Created Contests",
    status: "success",
    data: queryResult.rows,
  });
});

const getParticipantsQuery = `
SELECT
  participants.score
  users.username
FROM 
  participants
JOIN
  users ON participants.user_id = users.user_id
WHERE
  participants.contest_id=$1
`;

export const GetParticipants = asyncErrorHandler(async (req, res) => {
  const { contest_id } = req.body as GetParticipantsBody;
  const { user_id } = req as CustomRequest;
  // checking if contest are still in manager, then scores are not updated
  if (manager.isPresent(contest_id)) {
    const scores = manager.getScores(contest_id);
    res.status(200).json({
      message: "All participants score",
      status: "success",
      data: scores,
    });
  } else {
    const queryResult = await client.query(getParticipantsQuery, [contest_id]);
    res.status(200).json({
      message: "All participants score",
      status: "success",
      data: queryResult.rows,
    });
  }
});
