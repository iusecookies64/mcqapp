import { Socket } from "socket.io/dist/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import * as Contest from "./gameController";
import {
  EnterContestRequest,
  StartContestRequest,
  SubmitResponseRequest,
} from "../types/requests";
import {
  CONTEST_QUESTIONS,
  ERROR_JOINING,
  HOST_JOINED,
  INCORRECT_ANSWER,
  INCORRECT_PASSWORD,
  JOINED_SUCCESSFULLY,
  ROOM_LOCKED,
  SCORES,
  START_GAME,
  SUBMIT_RESPONSE,
  UPDATE_SCORES,
  USER_JOINED,
} from "../types/consts";

export const SocketHandler = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
): void => {
  socket.on(
    "Join Room",
    async ({
      contest_id,
      user_id,
      username,
      password,
    }: EnterContestRequest) => {
      // checking if password is correct, in case the room is not locked this will return true
      const isPasswordCorrect = await Contest.checkPassword(
        contest_id,
        password
      );
      if (!isPasswordCorrect) {
        socket.emit(INCORRECT_PASSWORD);
        return;
      }
      // trying to join in the user
      const payload = await Contest.joinUserAndGetPayload(
        contest_id,
        user_id,
        username
      );

      // if string is returned then there is error
      if (typeof payload === "string") {
        socket.emit(ERROR_JOINING, payload);
        return;
      }

      // otherwise joining room successful and we return the payload
      socket.join(contest_id.toString());
      socket.emit(JOINED_SUCCESSFULLY, payload);
      // emitting user joined in the room
      if (user_id === payload.created_by) {
        socket.to(contest_id.toString()).emit(HOST_JOINED, { username });
      } else {
        socket.to(contest_id.toString()).emit(USER_JOINED, { username });
      }
    }
  );

  socket.on(
    "Leave Room",
    async ({ contest_id, user_id }: EnterContestRequest) => {
      const isStarted = await Contest.isStarted(contest_id);
      // we only remove user if contest not started
      if (!isStarted) {
        await Contest.removeParticipant(contest_id, user_id);
        socket
          .to(contest_id.toString())
          .emit("Scores", Contest.getScores(contest_id));
      }
    }
  );

  // when owner starts game
  socket.on(
    START_GAME,
    async ({ contest_id, user_id }: StartContestRequest) => {
      // checking if request coming from owner
      const isOwner = await Contest.isOwner(contest_id, user_id);
      if (isOwner) {
        Contest.setStarted(contest_id);
        // emitting show countdown to all participants
        socket.to(contest_id.toString()).emit("Start Countdown");

        // giving all questions to the participants
        socket
          .to(contest_id.toString())
          .emit("Questions", Contest.getAllQuestions(contest_id));
      }
    }
  );

  socket.on(SUBMIT_RESPONSE, async (req: SubmitResponseRequest) => {
    const result = await Contest.submitResponse(
      req.contest_id,
      req.user_id,
      req.username,
      req.question_id,
      req.response
    );
    socket.emit("Submission Result", {
      isCorrect: result === INCORRECT_ANSWER ? false : true,
      question_id: req.question_id,
      response: req.response,
      points_scored: result,
    });
    if (result !== INCORRECT_ANSWER) {
      socket
        .to(req.contest_id.toString())
        .emit(UPDATE_SCORES, { username: req.username, points_scored: result });
    }
  });
};
