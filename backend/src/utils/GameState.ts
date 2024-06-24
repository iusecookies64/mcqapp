import client from "../models";
import { GameStateType } from "../types/gameState";
import { QuestionTable, ResponseTable, OptionsTable } from "../types/models";
import { getQuestions } from "./getQuestions";

export class GameState implements GameStateType {
  contest_id: number;
  created_by: number;
  start_time: Date;
  end_time: Date;
  duration: number;
  answers: Map<number, string>; // to quickly check for response
  participants: Map<number, string>; // to quickly check if a user is participant or not
  questions: { question: QuestionTable; options: OptionsTable[] }[]; // to send to users that join the contest
  scores: Map<string, number>; // live scores
  response: ResponseTable[]; // all responses made by users during contest
  constructor(contest_id: number) {
    // importing
    this.contest_id = contest_id;
    this.created_by = 1; // default values
    this.start_time = new Date();
    this.end_time = new Date();
    this.duration = 10;
    this.answers = new Map<number, string>();
    this.participants = new Map<number, string>();
    this.questions = [];
    this.scores = new Map<string, number>();
    this.response = [];

    this.init();
  }
  async init(): Promise<boolean> {
    try {
      // fetching contest details
      const getContestDetailsQuery = `SELECT * FROM contests WHERE contest_id=$1`;
      const contestQueryResult = await client.query(getContestDetailsQuery, [
        this.contest_id,
      ]);
      this.created_by = contestQueryResult.rows[0].created_by;
      this.start_time = new Date(contestQueryResult.rows[0].start_time);
      this.end_time = new Date(contestQueryResult.rows[0].end_time);
      this.duration = contestQueryResult.rows[0].duration;

      // getting all questions
      this.questions = await getQuestions(this.contest_id);

      // for each question adding its answer to answers
      this.questions.forEach(({ question }) => {
        this.answers.set(question.question_id, question.answer);
      });

      // getting all participants
      const getParticipantsQuery = `
        SELECT 
            participants.user_id, 
            users.username 
        FROM 
            participants
        JOIN
            users ON participants.user_id=users.user_id
        WHERE 
            participants.contest_id=$1
      `;
      const participantsQueryResult = await client.query(getParticipantsQuery, [
        this.contest_id,
      ]);
      participantsQueryResult.rows.forEach((participant) => {
        this.participants.set(participant.user_id, participant.username);
        this.scores.set(participant.username, 0);
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  getReductionFactor(): number {
    const startTime = new Date(this.start_time).getMilliseconds();
    const currentTime = Date.now();
    const timeElapsed = currentTime - startTime;
    const durationInMs = this.duration * 60 * 1000;
    // percentage of total duration finished
    const factor = timeElapsed / durationInMs;

    return factor;
  }

  submitResponse(
    username: string,
    user_id: number,
    question_id: number,
    response: string
  ): boolean {
    // if contest ended return false
    if (this.isEnded()) return false;
    // checking if user_id is a participant or not
    if (
      this.participants.has(user_id) &&
      this.answers.get(question_id) === response
    ) {
      let score = 50 + 50 * this.getReductionFactor();
      this.scores.set(username, (this.scores.get(username) || 0) + score);
      return true;
    } else {
      return false;
    }
  }

  getScores(): { username: string; score: number }[] {
    const result: { username: string; score: number }[] = [];
    this.scores.forEach((value, key) => {
      result.push({ username: key, score: value });
    });
    return result;
  }

  getQuestions(): { question: QuestionTable; options: OptionsTable[] }[] {
    return this.questions;
  }

  getAllResponse(): ResponseTable[] {
    return this.response;
  }

  isEnded(): boolean {
    const currentTime = Date.now();
    return currentTime > this.end_time.getMilliseconds();
  }

  async pushInDB(): Promise<void> {
    const updateParticipants = `UPDATE participants SET score=$1 WHERE contest_id=$2 AND user_id=$3`;
    // updating participants score
    for (const [user_id, username] of this.participants) {
      await client.query(updateParticipants, [
        this.scores.get(username),
        this.contest_id,
        user_id,
      ]);
    }

    const insertResponse = `INSERT INTO response (question_id, user_id, response, is_correst) VALUES ($1, $2, $3, $4)`;
    // inserting response
    this.response.forEach(async (response) => {
      await client.query(insertResponse, [
        response.question_id,
        response.user_id,
        response.response,
        response.is_correct,
      ]);
    });
  }

  isValidParticipant(user_id: number): boolean {
    return this.participants.has(user_id);
  }
}
