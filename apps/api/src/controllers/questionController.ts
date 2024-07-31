import { asyncErrorHandler } from "../utils/asyncErrorHandler";
import client from "../db/postgres";
import CustomError from "../utils/CustomError";
import { CustomRequest } from "../middlewares";
import {
  CreateQuestionInput,
  DeleteQuestionInput,
  UpdateQuestionInput,
} from "@mcqapp/validations";
import {
  CreateQuestionResponse,
  DeleteQuestionResponse,
  GetUserQuestionsResponse,
  StatusCodes,
  UpdateQuestionResponse,
} from "@mcqapp/types";

const createQuestionQuery = `
INSERT INTO questions (created_by, topic_id, statement, answer, option1, option2, option3, option4, difficulty, time_limit) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
`;
export const CreateQuestion = asyncErrorHandler(async (req, res) => {
  const { success, data, error } = CreateQuestionInput.safeParse(req.body);
  const { user_id } = req as CustomRequest;
  if (error) console.log(error);
  if (!success)
    throw new CustomError("Invalid Input", StatusCodes.InvalidInput);

  // adding question to database
  const result = await client.query(createQuestionQuery, [
    user_id,
    data.topic_id,
    data.statement,
    data.answer,
    data.option1,
    data.option2,
    data.option3,
    data.option4,
    data.difficulty,
    data.time_limit,
  ]);

  const response: CreateQuestionResponse = {
    message: "Question Added Successfully",
    status: "success",
    data: result.rows[0],
  };

  res.status(200).json(response);
});

const updateQuestionQuery = `
UPDATE questions 
SET
  topic_id=$1,
  statement=$2,
  answer=$3,
  option1=$4,
  option2=$5,
  option3=$6,
  option4=$7,
  difficulty=$8,
  time_limit=$9
WHERE question_id=$10 AND created_by=$11
`;

export const UpdateQuestion = asyncErrorHandler(async (req, res) => {
  const { success, data } = UpdateQuestionInput.safeParse(req.body);
  const { user_id } = req as CustomRequest;
  if (!success)
    throw new CustomError("Invalid Input", StatusCodes.InvalidInput);

  // updating question in database
  await client.query(updateQuestionQuery, [
    data.topic_id,
    data.statement,
    data.answer,
    data.option1,
    data.option2,
    data.option3,
    data.option4,
    data.difficulty,
    data.time_limit,
    data.question_id,
    user_id,
  ]);

  const response: UpdateQuestionResponse = {
    message: "Question Updated Successfully",
    status: "success",
  };

  res.json(response);
});

// handler for deleting a question
const deleteQuestionQuery = `DELETE FROM questions WHERE question_id=$1 AND created_by=$2`;
export const DeleteQuestion = asyncErrorHandler(async (req, res) => {
  const { success, data } = DeleteQuestionInput.safeParse(req.body);

  if (!success)
    throw new CustomError("Invalid Input", StatusCodes.InvalidInput);

  const { user_id } = req as CustomRequest;

  // deleting question
  await client.query(deleteQuestionQuery, [data.question_id, user_id]);

  const response: DeleteQuestionResponse = {
    message: "Question Deleted Successfully",
    status: "success",
  };

  res.status(200).json(response);
});

// sending questions to user for who created contest
const getUserQuestionsQuery = `SELECT * FROM questions WHERE created_by=$1`;
export const GetUserQuestions = asyncErrorHandler(async (req, res) => {
  const { user_id } = req as CustomRequest;
  const result = await client.query(getUserQuestionsQuery, [user_id]);
  const response: GetUserQuestionsResponse = {
    message: "All questions fetched successfully",
    status: "success",
    data: result.rows,
  };
  res.status(200).json(response);
});
