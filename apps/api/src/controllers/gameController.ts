import client from "../db/postgres";
import { scheduleJob } from "node-schedule";
import redisClient from "../db/redis";
import { getQuestions } from "../utils/getQuestions";
import {
  GameState,
  GameStateFields,
  ActiveGamesType,
} from "../types/gameState";
import {
  CONTEST_ENDED,
  ERROR_JOINING,
  INCORRECT_ANSWER,
  ROOM_FULL,
} from "../types/consts";
import { QuestionWithOptions, ResponseTable } from "../types/models";

type JoinContestPayload = {
  title: string;
  created_by: number;
  created_by_username: string;
  duration: number;
  max_participants: number;
  questions: QuestionWithOptions[];
  start_time: number;
  scores: { username: string; score: number }[];
  response: ResponseTable[];
};

export const addContestToRedis = async (contest_id: number): Promise<void> => {
  try {
    // initializing default game state
    const contestData: GameState = {
      contest_id,
      created_by: 0,
      created_by_username: "",
      duration: 0,
      title: "",
      is_locked: false,
      password: "",
      curr_participants: 0,
      max_participants: 0,
      start_time: 0, // initializing with 0 so that we know it contest is not started yet
      answers: {},
      difficulty: {},
      questions: [],
      scores: {},
      response: [],
    };

    // getting contest details
    const getContestDetailsQuery = `SELECT c.*, u.username FROM contests c JOIN users u ON u.user_id = c.created_by WHERE contest_id=$1`;
    const contestQueryResult = await client.query(getContestDetailsQuery, [
      contestData.contest_id,
    ]);
    contestData.created_by = contestQueryResult.rows[0].created_by;
    contestData.created_by_username = contestQueryResult.rows[0].username;
    contestData.duration = contestQueryResult.rows[0].duration;
    contestData.is_locked = contestQueryResult.rows[0].is_locked;
    contestData.password = contestQueryResult.rows[0].password;
    contestData.title = contestQueryResult.rows[0].title;
    contestData.max_participants = contestQueryResult.rows[0].max_participants;

    // getting all questions
    contestData.questions = await getQuestions(contestData.contest_id);

    // for each question adding its answer to answers
    contestData.questions.forEach((question) => {
      contestData.answers[question.question_id] = question.answer;
      contestData.difficulty[question.question_id] = question.difficulty;
      // removing the answer from the questions list so it doesn't reach client
      question.answer = "";
    });

    // storing contestData in redis
    await setContestData(contest_id, contestData);
  } catch (err) {
    console.log("Error adding contest to redis");
    console.log(err);
  }
};

export const getContestDataAll = async (
  contest_id: number
): Promise<GameState | null> => {
  try {
    const result = await redisClient.hGetAll("contest:" + contest_id);
    const gameState: GameState = {
      contest_id,
      created_by: parseInt(result.created_by),
      created_by_username: result.created_by_username,
      duration: parseInt(result.duration),
      title: result.title,
      is_locked: result.is_locked === "true" ? true : false,
      password: result.password,
      curr_participants: parseInt(result.curr_participants),
      max_participants: parseInt(result.max_participants),
      start_time: parseInt(result.start_time),
      answers: JSON.parse(result.answers),
      difficulty: JSON.parse(result.difficulty),
      questions: JSON.parse(result.questions),
      scores: JSON.parse(result.scores),
      response: JSON.parse(result.response),
    };
    return gameState;
  } catch (err) {
    console.log("Error getting contest details", contest_id);
    console.log(err);
    return null;
  }
};

export const getContestData = async (
  contest_id: number,
  keys: (keyof GameState)[]
) => {
  const queryResult = await redisClient.hmGet("contest:" + contest_id, keys);
  const obj: Record<string, any> = {};
  keys.forEach((key, indx) => {
    if (
      key === "title" ||
      key === "created_by_username" ||
      key === "password"
    ) {
      obj[key] = queryResult[indx];
    } else {
      obj[key] = JSON.parse(queryResult[indx]);
    }
  });
  return obj;
};

export const setContestData = async (
  contest_id: number,
  fields: GameStateFields
) => {
  try {
    const formattedFields: Record<string, any> = {};
    Object.entries(fields).forEach(([key, value]) => {
      if (typeof value !== "string") {
        formattedFields[key] = JSON.stringify(value);
      } else {
        formattedFields[key] = value;
      }
    });
    await redisClient.hSet("contest:" + contest_id, formattedFields);
  } catch (err) {
    console.log("Error setting contest data");
    console.log(err);
  }
};

export const getAllContestIds = async (): Promise<number[] | null> => {
  const allContest = await redisClient.keys("contest:*");
  if (!allContest) return [];
  return allContest.map((contest) => parseInt(contest.replace("contest:", "")));
};

export const removeFinishedContests = async (): Promise<void> => {
  try {
    const allContestIds = await getAllContestIds();
    if (allContestIds === null) return;

    allContestIds.forEach(async (contest_id) => {
      // checking if game ended
      const ended = await isEnded(contest_id);
      if (!ended) return;

      // contest ended so getting all of the game state
      const gameState = await getContestDataAll(contest_id);
      if (!gameState) {
        return;
      }
      // pushing gameState in db and then deleting it from redis
      await pushInDB(gameState);
      console.log("removing", contest_id);
      await redisClient.del("contest:" + contest_id);
    });
  } catch (err) {
    console.log("Error removing finished games");
    console.log(err);
  }
};

export const pushInDB = async (gameState: GameState): Promise<void> => {
  try {
    // updating contests table
    const updateContestQuery = `UPDATE contests SET is_ended=TRUE, number_of_participants=$1 WHERE contest_id=$2`;
    await client.query(updateContestQuery, [
      gameState.curr_participants,
      gameState.contest_id,
    ]);

    // updating participants score
    const updateParticipants = `INSERT INTO participants (contest_id, user_id, score) VALUES ($1, $2, $3)`;
    for (const [user_id, { score }] of Object.entries(gameState.scores)) {
      await client.query(updateParticipants, [
        gameState.contest_id,
        user_id,
        score,
      ]);
    }

    const insertResponse = `INSERT INTO response (question_id, user_id, response, is_correct) VALUES ($1, $2, $3, $4)`;
    // inserting response
    gameState.response.forEach(async (response) => {
      await client.query(insertResponse, [
        response.question_id,
        response.user_id,
        response.response,
        response.is_correct,
      ]);
    });
  } catch (err) {
    console.log(
      "Error pushing game state in db",
      gameState.contest_id,
      gameState.title
    );
    console.log(err);
  }
};

export const getActiveContests = async (): Promise<ActiveGamesType[]> => {
  try {
    const allContestIds = await getAllContestIds();
    if (allContestIds === null) return [];

    const result: ActiveGamesType[] = [];
    await Promise.all(
      allContestIds.map(async (contest_id) => {
        // getting contest data
        const data = await getContestData(contest_id, [
          "start_time",
          "created_by_username",
          "title",
          "duration",
          "curr_participants",
          "max_participants",
          "is_locked",
          "password",
        ]);
        const start_time = data.start_time as GameState["start_time"];
        const username =
          data.created_by_username as GameState["created_by_username"];
        const title = data.title as GameState["title"];
        const duration = data.duration as GameState["duration"];
        const curr_participants =
          data.curr_participants as GameState["curr_participants"];
        const max_participants =
          data.max_participants as GameState["max_participants"];
        const is_locked = data.is_locked as GameState["is_locked"];
        const password = data.password as GameState["password"];

        // checking if contest started or not
        const started = await isStarted(start_time, duration);
        if (started) return;

        result.push({
          contest_id,
          username,
          title,
          duration,
          curr_participants,
          max_participants,
          is_locked,
          password,
        });
      })
    );

    return result;
  } catch (err) {
    console.log("Error getting all active contests");
    console.log(err);
    return [];
  }
};

// to check if contest details are in redis
export const isPresentInRedis = async (
  contest_id: number
): Promise<boolean> => {
  // returns 1 if present otherwise not present
  const result = await redisClient.exists("contest:" + contest_id);
  return result !== 0;
};

// takes contest_id or start_time, duration as input
export const isStarted = async (
  x: number,
  duration: number = 0
): Promise<boolean> => {
  if (duration === 0) {
    // function call with contest_id
    const contest_id = x;
    const data = await getContestData(contest_id, ["start_time", "duration"]);
    // fetching its start time and duration
    const start_time = data.start_time as GameState["start_time"];
    const duration = data.duration as GameState["duration"];
    if (!start_time) return false;

    const currentTime = Date.now();
    return currentTime >= start_time;
  } else {
    // function call with start time and duration
    const start_time = x;
    if (!start_time) return false;

    const currentTime = Date.now();
    return currentTime >= start_time;
  }
};

export const setStarted = async (contest_id: number) => {
  await setContestData(contest_id, { start_time: Date.now() });
};

export const isEnded = async (
  x: number,
  duration: number = 0
): Promise<boolean> => {
  if (duration === 0) {
    // req with contest_id
    const contest_id = x;
    const data = await getContestData(contest_id, ["start_time", "duration"]);
    const start_time = data.start_time as GameState["start_time"];
    const duration = data.duration as GameState["duration"];

    // start time not set yet, return false
    if (!start_time) return false;

    const currentTime = Date.now();
    return currentTime >= start_time + duration * 60 * 1000;
  } else {
    const start_time = x;
    // start time not set yet, return false
    if (!start_time) return false;

    //
    const currentTime = Date.now();
    return currentTime >= start_time + duration * 60 * 1000;
  }
};

export const addParticipant = async (
  contest_id: number,
  user_id: number,
  username: string
): Promise<boolean> => {
  try {
    const data = await getContestData(contest_id, ["scores"]);
    const scores = data.scores as GameState["scores"];
    scores[user_id] = { username, score: 0 };
    await setContestData(contest_id, {
      scores: scores,
      curr_participants: Object.keys(scores).length,
    });
    return true;
  } catch (err) {
    console.log("Error Adding Participant");
    console.log(err);
    return false;
  }
};

export const removeParticipant = async (
  contest_id: number,
  user_id: number
) => {
  try {
    const data = await getContestData(contest_id, ["scores"]);
    const scores = data.scores as GameState["scores"];
    delete scores[user_id];
    await setContestData(contest_id, { scores: scores });
  } catch (err) {
    console.log("Error removing participant");
    console.log(err);
  }
};

export const checkPassword = async (
  contest_id: number,
  user_password: string
): Promise<boolean> => {
  try {
    const { is_locked, password }: GameStateFields = await getContestData(
      contest_id,
      ["password", "is_locked"]
    );

    if (!is_locked) return true;
    return password === user_password;
  } catch (err) {
    console.log("Error checking password");
    console.log(err);
    return false;
  }
};

export const isParticipantPresent = async (
  contest_id: number,
  user_id: number
): Promise<boolean> => {
  try {
    const data = await getContestData(contest_id, ["scores"]);
    const scores = data.scores as GameState["scores"];
    const indx = Object.keys(scores).findIndex((u) => u === user_id.toString());
    if (indx === -1) return false;
    else return true;
  } catch (err) {
    console.log("Error checking isParticipantPresent");
    console.log(err);
    return false;
  }
};

export const isOwner = async (
  contest_id: number,
  user_id: number
): Promise<boolean> => {
  try {
    const data = await getContestData(contest_id, ["created_by"]);
    const created_by = data.created_by as GameState["created_by"];
    return user_id === created_by;
  } catch (err) {
    console.log("Error in isOwner");
    console.log(err);
    return false;
  }
};

// checks response and if correct returns new score
export const submitResponse = async (
  contest_id: number,
  user_id: number,
  username: string,
  question_id: number,
  userResponse: string
): Promise<number> => {
  try {
    const data = await getContestData(contest_id, [
      "answers",
      "difficulty",
      "scores",
      "response",
      "start_time",
      "duration",
    ]);
    const answers = data.answers as GameState["answers"];
    const difficulty = data.difficulty as GameState["difficulty"];
    const scores = data.scores as GameState["scores"];
    const response = data.response as GameState["response"];
    const start_time = data.start_time as GameState["start_time"];
    const duration = data.duration as GameState["duration"];

    const started = await isStarted(start_time, duration);
    const ended = await isEnded(start_time, duration);
    // if contest not started or ended we return INCORRECT_ANSWER
    if (!started || ended) return INCORRECT_ANSWER;

    // if this user not exist in scores list, then is an invalid participant
    if (!scores[user_id]) return INCORRECT_ANSWER;

    // if question_id not present in the list, then false submission
    if (!answers[question_id] || !difficulty[question_id])
      return INCORRECT_ANSWER;

    // checking if user already answered this question
    if (
      response.find(
        (r) => r.question_id === question_id && r.user_id === user_id
      )
    )
      return INCORRECT_ANSWER;

    // if answer correct update the score and return new score
    if (answers[question_id] === userResponse) {
      const points_scored = 50 * difficulty[question_id];
      scores[user_id].score += points_scored;
      response.push({
        question_id,
        user_id,
        response: userResponse,
        is_correct: true,
      });
      await setContestData(contest_id, { scores, response });
      return points_scored;
    } else {
      response.push({
        question_id,
        user_id,
        response: userResponse,
        is_correct: false,
      });
      await setContestData(contest_id, { scores, response });
      return INCORRECT_ANSWER;
    }
  } catch (err) {
    console.log("Error checking the response");
    console.log(err);
    return INCORRECT_ANSWER;
  }
};

export const getScores = async (
  contest_id: number
): Promise<GameState["scores"] | null> => {
  try {
    const data = await getContestData(contest_id, ["scores"]);
    return data.scores as GameState["scores"];
  } catch (err) {
    console.log("Error getting scores");
    console.log(err);
    return null;
  }
};

export const getAllQuestions = async (
  contest_id: number
): Promise<GameState["questions"] | null> => {
  try {
    const data = await getContestData(contest_id, ["questions"]);
    return data.questions as GameState["questions"];
  } catch (err) {
    console.log("Error getting questions");
    console.log(err);
    return null;
  }
};

export const getAllUserResponse = async (
  contest_id: number,
  user_id: number
): Promise<GameState["response"] | null> => {
  try {
    const data = await getContestData(contest_id, ["response"]);
    const response = data.response as GameState["response"];
    return response.filter((r) => r.user_id === user_id);
  } catch (err) {
    console.log("Error getting user response");
    console.log(err);
    return null;
  }
};

export const joinUserAndGetPayload = async (
  contest_id: number,
  user_id: number,
  username: string
): Promise<JoinContestPayload | string> => {
  try {
    const contestData = await getContestDataAll(contest_id);
    if (!contestData) throw Error("No Contest Found");
    // checking if new user that is not owner joining and room full
    if (
      user_id !== contestData.created_by &&
      !contestData.scores[user_id] &&
      contestData.curr_participants >= contestData.max_participants
    )
      return ROOM_FULL;

    // checking if contest has ended
    const ended = await isEnded(contestData.start_time, contestData.duration);
    if (ended) return CONTEST_ENDED;

    // if user not the owner so we add it to scores record
    if (contestData.created_by != user_id) {
      contestData.scores[user_id] = { username, score: 0 };
      contestData.curr_participants++;
      // updating scores and curr_participants in redis
      await setContestData(contest_id, {
        scores: contestData.scores,
        curr_participants: contestData.curr_participants,
      });
    }

    const started = await isStarted(
      contestData.start_time,
      contestData.duration
    );

    // questions and response are sent if contest started
    const payload: JoinContestPayload = {
      title: contestData.title,
      created_by: contestData.created_by,
      created_by_username: contestData.created_by_username,
      duration: contestData.duration,
      max_participants: contestData.max_participants,
      questions: started ? contestData.questions : [],
      start_time: contestData.start_time,
      scores: Object.entries(contestData.scores).map(
        ([id, { username, score }]) => ({ username, score })
      ),
      response: started
        ? contestData.response.filter((r) => r.user_id === user_id)
        : [],
    };

    return payload;
  } catch (err) {
    console.log("Error getting contest meta data");
    console.log(err);
    return ERROR_JOINING;
  }
};

// scheduling a job to remove finished games from redis every 5 minutes
scheduleJob(`*/5 * * * * *`, removeFinishedContests);
