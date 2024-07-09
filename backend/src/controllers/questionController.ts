import { asyncErrorHandler } from "../utils/asyncErrorHandler";
import client from "../models";
import { CreateQuestionData, UpdateQuestionData } from "../types/requests";
import { OptionsTable } from "../types/models";
import CustomError from "../utils/CustomError";
import { getQuestions } from "../utils/getQuestions";
import { CustomRequest } from "../middlewares";
import { manager } from "./gameController";

const createQuestionQuery = `
INSERT INTO questions (contest_id, title, answer, difficulty) VALUES ($1, $2, $3, $4) RETURNING *
`;
const createOptionsQuery = `
INSERT INTO options (question_id, title) VALUES ($1, $2) RETURNING *
`;

export const CreateQuestion = asyncErrorHandler(async (req, res) => {
  const { contest_id, title, answer, difficulty, options } =
    req.body as CreateQuestionData;

  const { user_id } = req as CustomRequest;

  // checking if answer exist as one of the option
  const answerIndex = options.findIndex((option) => option == answer);
  if (answerIndex == -1)
    throw new CustomError("Answer must be among options", 403);

  // begin transaction
  await client.query("BEGIN");

  // adding question to database
  const queryResult = await client.query(createQuestionQuery, [
    contest_id,
    title,
    answer,
    difficulty,
  ]);

  const question_id = queryResult.rows[0].question_id;
  // inserting all of the options for this question
  const insertedOptions: OptionsTable[] = [];
  options.forEach(async (option) => {
    const queryResult = await client.query(createOptionsQuery, [
      question_id,
      option,
    ]);
    insertedOptions.push(queryResult.rows[0]);
  });
  // commit transaction
  await client.query("COMMIT");

  res.status(200).json({
    message: "Question Added Successfully",
    data: {
      ...queryResult.rows[0],
      options: insertedOptions,
    },
    success: true,
  });
});

const updateQuestionQuery = `
UPDATE questions 
SET title=$1,
    answer=$2,
    difficulty=$3
WHERE question_id=$4 AND contest_id=$5
RETURNING *
`;

const updateOptionQuery = `
UPDATE options SET title=$1 WHERE option_id=$2 RETURNING *
`;

export const UpdateQuestion = asyncErrorHandler(async (req, res) => {
  const { contest_id, question_id, title, answer, difficulty, options } =
    req.body as UpdateQuestionData;
  const { user_id } = req as CustomRequest;

  // checking if answer exist as one of the option
  const answerIndex = options.findIndex((option) => option.title === answer);
  if (answerIndex == -1)
    throw new CustomError("Answer must be among options", 403);

  // begin transaction
  await client.query("BEGIN");

  // adding question to database
  const updatedQuestion = await client.query(updateQuestionQuery, [
    title,
    answer,
    difficulty,
    question_id,
    contest_id,
  ]);

  // inserting all of the options for this question
  const updatedOptions: OptionsTable[] = [];
  options.forEach(async (option) => {
    // if option already existed
    let queryResult;
    if (option.option_id) {
      queryResult = await client.query(updateOptionQuery, [
        option.title,
        option.option_id,
      ]);
    } else {
      queryResult = await client.query(createOptionsQuery, [
        question_id,
        option.title,
      ]);
    }
    updatedOptions.push(queryResult.rows[0]);
  });
  // commit transaction
  await client.query("COMMIT");

  res.status(200).json({
    message: "Question Updated Successfully",
    success: true,
    data: {
      ...updatedQuestion.rows[0],
      options: updatedOptions,
    },
  });
});

const deleteQuestionQuery = `DELETE FROM questions WHERE question_id=$1 AND contest_id=$2`;
export const DeleteQuestion = asyncErrorHandler(async (req, res) => {
  const question_id = parseInt(req.query.question_id as string);
  const contest_id = parseInt(req.query.contest_id as string);
  const user_id = (req as CustomRequest).user_id;

  // deleting question
  await client.query(deleteQuestionQuery, [question_id, contest_id]);

  res.status(200).json({
    message: "Question Deleted Successfully",
    status: "success",
  });
});

// sending questions to user for who created contest
export const GetContestQuestions = asyncErrorHandler(async (req, res) => {
  const contest_id = parseInt(req.query.contest_id as string);

  const questions = await getQuestions(contest_id);
  res.status(200).json({
    message: "All questions fetched successfully",
    status: "success",
    data: questions,
  });
});

const getResponseQuery = `SELECT * FROM response WHERE question_id=$1 AND user_id=$2`;
export const GetResponse = asyncErrorHandler(async (req, res) => {
  // checking if contest response are still in manager
  const { question_id, contest_id } = req.body;
  const { user_id } = req as CustomRequest;
  if (manager.isPresent(contest_id)) {
    const userResponse = manager
      .getAllResponse(contest_id)
      .filter((response) => response.user_id == user_id);
    res.status(200).json({
      message: "All user response",
      status: "success",
      data: userResponse,
    });
  } else {
    const queryResult = await client.query(getResponseQuery, [
      question_id,
      user_id,
    ]);
    res.status(200).json({
      message: "All user response",
      status: "success",
      data: queryResult.rows,
    });
  }
});
