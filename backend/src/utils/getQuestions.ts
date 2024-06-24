import {
  OptionsTable,
  QuestionTable,
  QuestionWithOptions,
} from "../types/models";
import client from "../models";

export const getQuestions = async (
  contest_id: number
): Promise<QuestionWithOptions[]> => {
  // fetching all questions
  const getQuestionsQuery = `SELECT * FROM questions WHERE contest_id=$1`;
  const questionQueryResult = await client.query(getQuestionsQuery, [
    contest_id,
  ]);

  const questions: QuestionWithOptions[] = [];
  // for each question fetching its options
  const getOptionsQuery = `SELECT * FROM options WHERE question_id=$1`;
  questionQueryResult.rows.forEach(async (question) => {
    const optionQueryResult = await client.query(getOptionsQuery, [
      question.question_id,
    ]);
    questions.push({
      question,
      options: optionQueryResult.rows,
    });
  });

  return questions;
};
