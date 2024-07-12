import { asyncErrorHandler } from "../utils/asyncErrorHandler";
import client from "../models";
import {
  CreateQuestionData,
  ReorderOptionsData,
  ReorderQuestionsData,
  UpdateQuestionData,
} from "../types/requests";
import { OptionsTable } from "../types/models";
import CustomError from "../utils/CustomError";
import { getQuestions } from "../utils/getQuestions";
import { CustomRequest } from "../middlewares";
import { manager } from "./gameController";

const createQuestionQuery = `
INSERT INTO questions (contest_id, title, answer, difficulty, question_number) VALUES ($1, $2, $3, $4, $5) RETURNING *
`;
const createOptionsQuery = `
INSERT INTO options (question_id, title, option_number) VALUES ($1, $2, $3) RETURNING *
`;

export const CreateQuestion = asyncErrorHandler(async (req, res) => {
  const { contest_id, title, answer, difficulty, options, question_number } =
    req.body as CreateQuestionData;

  // checking if answer exist as one of the option
  const answerIndex = options.findIndex((option) => option.title == answer);
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
    question_number,
  ]);

  const question_id = queryResult.rows[0].question_id;
  // inserting all of the options for this question
  const insertedOptions: OptionsTable[] = [];
  await Promise.all(
    options.map(async (option) => {
      const queryResult = await client.query(createOptionsQuery, [
        question_id,
        option.title,
        option.option_number,
      ]);
      insertedOptions.push(queryResult.rows[0]);
    })
  );
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
  await Promise.all(
    options.map(async (option) => {
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
          option.option_number,
        ]);
      }
      updatedOptions.push(queryResult.rows[0]);
    })
  );
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

// handler for when the request for reordering questions come
const updateQuestionNumber = `UPDATE questions SET question_number=$1 WHERE question_id=$2`;
export const ReorderQuestions = asyncErrorHandler(async (req, res) => {
  const order = req.body as ReorderQuestionsData;
  await Promise.all(
    order.map(async (question) => {
      await client.query(updateOptionQuery, [
        question.question_number,
        question.question_id,
      ]);
    })
  );

  res.json({
    message: "Order Updated Successfully",
    status: "success",
  });
});

// handler for when options of a question are reordered
const updateOptionNumber = `UPDATE options SET option_number=$1 WHERE option_id=$2`;
export const ReorderOptions = asyncErrorHandler(async (req, res) => {
  const order = req.body as ReorderOptionsData;

  await Promise.all(
    order.map(async (option) => {
      await client.query(updateOptionNumber, [
        option.option_number,
        option.option_id,
      ]);
    })
  );

  res.json({
    message: "Options Reordered Successfully",
    status: "success",
  });
});

// handler for deleting a question
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
