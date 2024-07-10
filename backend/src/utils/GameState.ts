import client from "../models";
import { ContestDataForLobby, GameStateType } from "../types/gameState";
import {
  QuestionTable,
  ResponseTable,
  OptionsTable,
  QuestionWithOptions,
  ContestTable,
} from "../types/models";
import { getQuestions } from "./getQuestions";

export class GameState implements GameStateType {
  contest_id: number;
  created_by: number;
  created_by_username: string;
  title: string;
  is_locked: boolean;
  password: string;
  max_participants: number;
  is_started: boolean;
  start_time: number;
  duration: number;
  answers: Map<number, string>; // to quickly check for response
  difficulty: Map<number, number>;
  participants: Map<number, string>; // to quickly check if a user is participant or not
  questions: QuestionWithOptions[]; // to send to users that join the contest
  scores: Map<string, number>; // live scores
  response: ResponseTable[]; // all responses made by users during contest
  constructor(contest_id: number) {
    // importing
    this.contest_id = contest_id;
    this.created_by = 1; // default values
    this.created_by_username = "";
    this.title = "My Contest";
    this.max_participants = 100;
    this.is_locked = false;
    this.password = "";
    this.start_time = Date.now();
    this.is_started = false;
    this.duration = 10;
    this.answers = new Map<number, string>();
    this.difficulty = new Map<number, number>();
    this.participants = new Map<number, string>();
    this.questions = [];
    this.scores = new Map<string, number>();
    this.response = [];

    this.init();
  }
  async init(): Promise<boolean> {
    try {
      // fetching contest details
      const getContestDetailsQuery = `SELECT c.*, u.username FROM contests c JOIN users u ON u.user_id = c.created_by WHERE contest_id=$1`;
      const contestQueryResult = await client.query(getContestDetailsQuery, [
        this.contest_id,
      ]);
      this.created_by = contestQueryResult.rows[0].created_by;
      this.created_by_username = contestQueryResult.rows[0].username;
      this.duration = contestQueryResult.rows[0].duration;
      this.is_locked = contestQueryResult.rows[0].is_locked;
      this.password = contestQueryResult.rows[0].password;
      this.title = contestQueryResult.rows[0].title;
      this.max_participants = contestQueryResult.rows[0].max_participants;

      // getting all questions
      this.questions = await getQuestions(this.contest_id);

      // for each question adding its answer to answers
      this.questions.forEach((question) => {
        this.answers.set(question.question_id, question.answer);
        this.difficulty.set(question.question_id, question.difficulty);
        // removing the answer from the questions list so it doesn't reach client
        question.answer = "";
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  getReductionFactor(): number {
    const currentTime = Date.now();
    const timeElapsed = currentTime - this.start_time;
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

    if (this.answers.get(question_id) === response) {
      this.response.push({ question_id, user_id, response, is_correct: true });
      const difficulty = this.difficulty.get(question_id) || 1;
      const score = Math.floor(
        50 * (1 - this.getReductionFactor()) * difficulty
      );
      this.scores.set(username, (this.scores.get(username) || 0) + score);
      return true;
    } else {
      this.response.push({ question_id, user_id, response, is_correct: false });
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

  getQuestions(): QuestionWithOptions[] {
    return this.questions;
  }

  getAllResponse(): ResponseTable[] {
    return this.response;
  }

  isEnded(): boolean {
    if (!this.is_started) return false;
    const currentTime = Date.now();
    return currentTime >= this.start_time + this.duration * 60 * 1000;
  }

  isContestStarted(): boolean {
    return this.is_started;
  }

  setStarted(): void {
    this.is_started = true;
    this.start_time = Date.now();
  }

  // called when a participant joins the room
  addParticipant(username: string, user_id: number): void {
    // if owner joining, then we don't add as participant
    if (user_id === this.created_by) {
      return;
    }
    this.participants.set(user_id, username);
    this.scores.set(username, 0);
  }

  // called when a participant leaves the room
  removeParticipant(user_id: number, username: string): void {
    this.participants.delete(user_id);
    this.scores.delete(username);
  }

  checkPassword(password: string): boolean {
    return this.password === password;
  }

  isFull(): boolean {
    return this.participants.size >= this.max_participants;
  }

  isParticipantPresent(user_id: number): boolean {
    return this.participants.has(user_id);
  }

  isOwner(user_id: number): boolean {
    return this.created_by === user_id;
  }

  getDuration(): number {
    return this.duration;
  }

  getContestData(): ContestDataForLobby {
    return {
      contest_id: this.contest_id,
      created_by: this.created_by,
      created_by_username: this.created_by_username,
      title: this.title,
      duration: this.duration,
      max_participants: this.max_participants,
    };
  }

  async pushInDB(): Promise<void> {
    // updating contest
    const updateContestQuery = `UPDATE contests SET isEnded=TRUE, number_of_participants=$1 WHERE contest_id=$2`;
    await client.query(updateContestQuery, [
      this.participants.size,
      this.contest_id,
    ]);

    // updating participants score
    const updateParticipants = `INSERT INTO participants (contest_id, user_id, score) VALUES ($1, $2, $3)`;
    for (const [user_id, username] of this.participants) {
      await client.query(updateParticipants, [
        this.contest_id,
        user_id,
        this.scores.get(username),
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
}
