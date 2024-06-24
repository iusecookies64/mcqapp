import { Socket } from "socket.io/dist/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { manager } from "./gameController";
import { EnterContestRequest, SubmitResponseRequest } from "../types/requests";

export const SocketHandler = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
): void => {
  socket.on(
    "Enter Contest",
    async ({ contest_id, user_id }: EnterContestRequest) => {
      // checking if user is a valid participant
      if (manager.isValidParticipant(contest_id, user_id)) {
        socket.join(contest_id.toString());
        // getting all questions
        socket.emit("Questions", manager.getAllQuestions(contest_id));
        // sending scores
        socket.emit("Scores", manager.getScores(contest_id));
      }
    }
  );
  socket.on("Submit Response", async (req: SubmitResponseRequest) => {
    const result = manager.submitResponse(
      req.contest_id,
      req.user_id,
      req.username,
      req.question_id,
      req.response
    );
    socket.emit("Submission Result", result);
    if (result === true) {
      // result is correct so emitting updated scores in room
      socket
        .to(req.contest_id.toString())
        .emit("Scores", manager.getScores(req.contest_id));
    }
  });
};
