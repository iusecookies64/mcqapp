import { asyncErrorHandler } from "../utils/asyncErrorHandler";
import { CreateContestRequest, PublishContestBody } from "../types/requests";
import client from "../models";
import { CustomRequest } from "../middlewares";
import { manager } from "./gameController";

const createContestQuery = `
INSERT INTO contests (created_by, title, max_participants, start_time, end_time, duration, invite_only)
VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
`;

export const CreateContest = asyncErrorHandler(
  async (req: CreateContestRequest, res) => {
    const {
      created_by,
      title,
      max_participants,
      start_time,
      duration,
      invite_only,
    } = req.body.contest;

    // calculating end_time from start_time + duration
    const endTime = new Date(start_time);
    endTime.setMinutes(endTime.getMinutes() + duration);
    // end time in iso string
    const end_time = endTime.toISOString();

    const queryResult = await client.query(createContestQuery, [
      created_by,
      title,
      max_participants,
      start_time,
      end_time,
      duration,
      invite_only,
    ]);

    res.status(200).json({
      message: "Contest Created Successfully",
      data: queryResult.rows[0],
      status: "success",
    });
  }
);

const updateContestQuery = `
UPDATE contests 
SET title=$1,
    max_participants=$2,
    start_time=$3,
    end_time=$4
    duration=$5,
    invite_only=$6,
WHERE contest_id=$7
RETURNING *
`;

export const UpdateContest = asyncErrorHandler(
  async (req: CreateContestRequest, res) => {
    const {
      title,
      max_participants,
      start_time,
      duration,
      invite_only,
      contest_id,
    } = req.body.contest;

    // calculating end_time from start_time + duration
    const endTime = new Date(start_time);
    endTime.setMinutes(endTime.getMinutes() + duration);
    // end time in iso string
    const end_time = endTime.toISOString();

    const queryResult = await client.query(updateContestQuery, [
      title,
      max_participants,
      start_time,
      end_time,
      duration,
      invite_only,
      contest_id,
    ]);

    res.status(200).json({
      message: "Contest Updated Successfully",
      data: queryResult.rows[0],
      status: "success",
    });
  }
);

const publishContestQuery = `
UPDATE contests SET published=$1 WHERE contest_id=$2 AND created_by=$3
`;

export const PublishContest = asyncErrorHandler(async (req, res) => {
  const { contest_id, publish } = req.body as PublishContestBody;
  const { user_id } = req as CustomRequest;
  if (publish) {
    await client.query(publishContestQuery, [true, contest_id, user_id]);
    res.status(200).json({
      message: "Contest Published Successfully",
      status: "success",
    });
  } else {
    // this request is to draft a published contest
    await client.query(publishContestQuery, [false, contest_id, user_id]);
    res.status(200).json({
      message: "Contest Drafted Successfully",
      status: "success",
    });
  }
});

const getUpcomingContestsQuery = `
SELECT 
  contests.contest_id,
  contests.created_by,
  contests.title,
  contests.max_participants,
  contests.start_time,
  contests.duration,
  contests.invite_only,
  contests.published,
  users.username
FROM
  contests
JOIN
  users ON contests.created_by = users.user_id
WHERE
  contests.end_time > NOW() AND contests.invite_only = FALSE

UNION

SELECT
  contests.contest_id,
  contests.created_by,
  contests.title,
  contests.max_participants,
  contests.start_time,
  contests.duration,
  contests.invite_only,
  contests.published,
  users.username
FROM
  contests
JOIN
  participants ON participants.contest_id = contests.contest_id
JOIN
  users ON contests.created_by = users.user_id
WHERE
  participants.user_id = $1 AND contests.end_time > NOW()
`;

export const GetUpcomingContests = asyncErrorHandler(async (req, res) => {
  const { user_id, username } = req as CustomRequest;
  const queryResult = await client.query(getUpcomingContestsQuery, [user_id]);
  res.status(200).json({
    message: "All Upcoming Contests",
    status: "success",
    data: queryResult.rows,
  });
});

const getPastContestsQuery = `
SELECT
  contests.contest_id,
  contests.created_by,
  contests.title,
  contests.max_participants,
  contests.start_time,
  contests.duration,
  contests.invite_only,
  contests.published,
  users.username
FROM
  contests
JOIN
  participants ON participants.contest_id = contests.contest_id
JOIN
  users ON contests.created_by = users.user_id
WHERE
  participants.user_id = $1 AND contest.start
`;

export const GetPastContests = asyncErrorHandler(async (req, res) => {
  const { user_id, username } = req as CustomRequest;
  const queryResult = await client.query(getPastContestsQuery, [user_id]);
  res.status(200).json({
    message: "All Past Contests",
    status: "success",
    data: queryResult.rows,
  });
});

const getMyContestsQuery = `
SELECT * FROM contests WHERE created_by=$1
`;

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

export const GetParticipant = asyncErrorHandler(async (req, res) => {
  const { contest_id } = req.body;
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
