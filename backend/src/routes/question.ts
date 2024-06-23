import { Router } from "express";
import authorizeUser from "../middlewares";
import { OptionsTable } from "../types/models";
import client from "../models";
import { CreateQuestionRequest } from "../types/requests";
const router = Router();

const createQuestionQuery = `
INSERT INTO questions (contest_id, title, answer, difficulty) VALUES ($1, $2, $3, $4) RETURNING *
`;
const createOptionsQuery = `
INSERT INTO options (question_id, title) VALUES ($1, $2) RETURNING *
`;

router.post(
  "/create",
  authorizeUser,
  async (req: CreateQuestionRequest, res) => {
    try {
      const { contest_id, title, answer, difficulty } = req.body.question;
      const options = req.body.options;

      // checking if answer exist as one of the option
      const answerIndex = options.findIndex((option) => option.title == answer);
      if (answerIndex == -1) throw Error;

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
          option.title,
        ]);
        insertedOptions.push(queryResult.rows[0]);
      });
      // commit transaction
      await client.query("COMMIT");

      res.status(200).json({
        message: "Question Added Successfully",
        question: {
          ...queryResult.rows[0],
          options: insertedOptions,
        },
        success: true,
      });
    } catch (err) {
      // error occurrend so we rollback transaction
      await client.query("ROLLBACK");
      res.status(400).json({
        message: "Invalid Request",
        success: false,
      });
    }
  }
);

const updateQuestionQuery = `
UPDATE questions 
SET title=$1,
    answer=$2,
    difficulty=$3
WHERE question_id=$4
RETURNING *
`;

const updateOptionQuery = `
UPDATE options SET title=$1 WHERE option_id=$2 RETURNING *
`;

router.post(
  "/update",
  authorizeUser,
  async (req: CreateQuestionRequest, res) => {
    try {
      const { question_id, title, answer, difficulty } = req.body.question;
      const options = req.body.options;

      // checking if answer exist as one of the option
      const answerIndex = options.findIndex(
        (option) => option.title === answer
      );
      if (answerIndex == -1) throw Error;

      // begin transaction
      await client.query("BEGIN");

      // adding question to database
      const updatedQuestion = await client.query(updateQuestionQuery, [
        title,
        answer,
        difficulty,
        question_id,
      ]);

      // inserting all of the options for this question
      const updatedOptions: OptionsTable[] = [];
      options.forEach(async (option) => {
        const queryResult = await client.query(updateOptionQuery, [
          option.title,
          option.option_id,
        ]);
        updatedOptions.push(queryResult.rows[0]);
      });
      // commit transaction
      await client.query("COMMIT");

      res.status(200).json({
        message: "Question Updated Successfully",
        success: true,
        question: {
          ...updatedQuestion.rows[0],
          options: updatedOptions,
        },
      });
    } catch (err) {
      res.status(500).json({
        message: "Invalid Request",
        success: false,
      });
    }
  }
);
export default router;
