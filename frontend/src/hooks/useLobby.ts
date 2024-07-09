import { useEffect, useState } from "react";
import { QuestionWithOptions, User } from "../types/models";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { useRouteLoaderData } from "react-router-dom";

type Response = {
  question_id: number;
  isCorrect: boolean;
  response: string;
};

export enum CountdownState {
  notStarted,
  started,
  ended,
}

export type ContestDataForLobby = {
  contest_id: number;
  created_by: number;
  created_by_username: string;
  title: string;
  duration: number;
  max_participants: number;
};

const socket = io("http://localhost:3000");

export const useLobby = (contest_id: number) => {
  const userData = useRouteLoaderData("root") as User;
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([]);
  const [response, setResponse] = useState<Record<number, Response>>({});
  const [leaderboard, setLeaderboard] = useState<
    { username: string; score: number }[]
  >([]);
  // const [socket, setSocket] = useState<Socket>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [joined, setJoined] = useState(false);
  const [countdownState, setCountdownState] = useState<CountdownState>(
    CountdownState.notStarted
  );
  const [contestData, setContestData] = useState<ContestDataForLobby>();
  const [isHost, setIsHost] = useState(false);

  const submitResponse = (question_id: number, response: string) => {
    if (socket) {
      setIsLoading(true);
      socket.emit("Submit Response", {
        question_id,
        contest_id,
        response,
        ...userData,
      });
    }
  };

  const joinRoom = (password: string) => {
    if (socket) {
      setIsLoading(true);
      socket.emit("Join Room", { contest_id, ...userData, password });
    }
  };

  const startGame = () => {
    if (socket) {
      socket.emit("Start Game", { contest_id, ...userData });
    }
  };

  useEffect(() => {
    // setting all the event handlers
    socket.on("Error Joining", (data) => {
      setError(data.error);
      setIsLoading(false);
    });

    socket.on("Room Locked", () => {
      setIsLocked(true);
      setIsLoading(false);
    });

    socket.on("Incorrect Password", () => {
      toast.error("Incorrect Password");
      setIsLoading(false);
    });

    socket.on("Joined Successfully", (data: ContestDataForLobby) => {
      if (data.created_by === userData.user_id) {
        setIsHost(true);
      }
      setContestData(data);
      setJoined(true);
      setIsLoading(false);
    });

    socket.on("Start Countdown", () =>
      setCountdownState(CountdownState.started)
    );

    socket.on("Questions", (questions) => {
      setIsLoading(false);
      setQuestions(questions);
    });

    socket.on("Scores", (scores) => setLeaderboard(scores));

    socket.on("Submission Result", ({ isCorrect, question_id, response }) => {
      if (isCorrect) {
        toast.success("Correct Answer");
      } else {
        toast.info("Wrong Answer");
      }
      setResponse((prevResponse) => {
        prevResponse[question_id] = { question_id, isCorrect, response };
        return { ...prevResponse };
      });
      setIsLoading(false);
    });

    return () => {
      socket.removeAllListeners();
    };
  }, []);

  // calling join room for the first time
  useEffect(() => {
    joinRoom("");
  }, []);

  return {
    contestData,
    isHost,
    questions,
    response,
    leaderboard,
    error,
    isLoading,
    isLocked,
    countdownState,
    joined,
    startGame,
    joinRoom,
    setCountdownState,
    submitResponse,
  };
};
