import { Socket } from "socket.io/dist/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { manager } from "./gameController";
import {
  EnterContestRequest,
  StartContestRequest,
  SubmitResponseRequest,
} from "../types/requests";

export const SocketHandler = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
): void => {
  socket.on(
    "Join Room",
    ({ contest_id, user_id, username, password }: EnterContestRequest) => {
      // checking if req from already participant (in case of rejoining)
      // or if request from owner of contest, we directly join them
      if (
        manager.isParticipantPresent(contest_id, user_id) ||
        manager.isOwner(contest_id, user_id)
      ) {
        socket.join(contest_id.toString());
        socket.emit("Joined Successfully", manager.getContestData(contest_id));
        socket.emit("Scores", manager.getScores(contest_id));
        return;
      }

      // if contest started then no joining
      if (manager.isStarted(contest_id)) {
        socket.emit("Error Joining", { error: "Already Started" });
        return;
      }

      // if room full return
      if (manager.isFull(contest_id)) {
        socket.emit("Error Joining", { error: "Room Full" });
        return;
      }
      // if request with no password (usually first time) and lobby locked
      if (!password && manager.isLocked(contest_id)) {
        socket.emit("Room Locked");
        return;
      }

      // if lobby locked and password not correct
      if (!manager.checkPassword(contest_id, password)) {
        socket.emit("Incorrect Password");
        return;
      }

      // we can add user safely
      manager.addParticipant(contest_id, user_id, username);
      // checking if user is a valid participant
      socket.join(contest_id.toString());
      // emitting new user in room via scores list
      socket.emit("Joined Successfully", manager.getContestData(contest_id));
      socket
        .to(contest_id.toString())
        .emit("Scores", manager.getScores(contest_id));

      socket.emit("Scores", manager.getScores(contest_id));
    }
  );

  socket.on(
    "Leave Room",
    ({ contest_id, user_id, username }: EnterContestRequest) => {
      manager.removeParticipant(contest_id, user_id, username);
      socket
        .to(contest_id.toString())
        .emit("Scores", manager.getScores(contest_id));
    }
  );

  // when owner starts game
  socket.on("Start Game", (req: StartContestRequest) => {
    // checking if request coming from owner
    if (manager.isOwner(req.contest_id, req.user_id)) {
      manager.setStarted(req.contest_id);
      // emitting show countdown to all participants
      socket.to(req.contest_id.toString()).emit("Start Countdown");

      // giving all questions to the participants
      socket
        .to(req.contest_id.toString())
        .emit("Questions", manager.getAllQuestions(req.contest_id));

      // starting timer for contest end event
      setTimeout(() => {
        socket.to(req.contest_id.toString()).emit("Contest Ended");
      }, manager.getDuration(req.contest_id) * 60 * 1000);
    }
  });

  socket.on("Submit Response", async (req: SubmitResponseRequest) => {
    const result = manager.submitResponse(
      req.contest_id,
      req.user_id,
      req.username,
      req.question_id,
      req.response
    );
    socket.emit("Submission Result", {
      isCorrect: result,
      question_id: req.question_id,
      response: req.response,
    });
    if (result === true) {
      // result is correct so emitting updated scores in room
      socket.emit("Scores", manager.getScores(req.contest_id));
      socket
        .to(req.contest_id.toString())
        .emit("Scores", manager.getScores(req.contest_id));
    }
  });
};
