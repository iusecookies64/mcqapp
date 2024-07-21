import { useEffect, useState } from "react";
import { QuestionWithOptions, ResponseTable, User } from "../types/models";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { useRouteLoaderData } from "react-router-dom";
import {
  CONTEST_STARTED,
  ERROR_JOINING,
  INCORRECT_PASSWORD,
  JOIN_ROOM,
  JOINED_SUCCESSFULLY,
  START_GAME,
  SUBMISSION_RESULT,
  SUBMIT_RESPONSE,
  UPDATE_SCORES,
  USER_JOINED,
  USER_LEFT,
} from "../types/consts";

export enum CountdownState {
  notStarted,
  started,
  ended,
}

type JoinContestPayload = {
  title: string;
  created_by: number;
  created_by_username: string;
  duration: number;
  max_participants: number;
  questions: QuestionWithOptions[];
  start_time: number;
  scores: { username: string; score: number }[];
  response: ResponseTable[];
};

type ContestDataLobby = {
  title: string;
  created_by: number;
  created_by_username: string;
  duration: number;
  max_participants: number;
  start_time: number;
};

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const socket = io(BASE_API_URL);

export const useLobby = (contest_id: number) => {
  const userData = useRouteLoaderData("root") as User;
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([]);
  const [response, setResponse] = useState<ResponseTable[]>([]);
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
  const [contestData, setContestData] = useState<ContestDataLobby>();
  const [isHost, setIsHost] = useState(false);

  const submitResponse = (question_id: number, response: string) => {
    if (socket) {
      setIsLoading(true);
      socket.emit(SUBMIT_RESPONSE, {
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
      socket.emit(JOIN_ROOM, { contest_id, ...userData, password });
    }
  };

  const startGame = () => {
    if (socket) {
      socket.emit(START_GAME, { contest_id, ...userData });
    }
  };

  useEffect(() => {
    // setting all the event handlers
    socket.on(ERROR_JOINING, (error: string) => {
      setError(error);
      setIsLoading(false);
    });

    socket.on(INCORRECT_PASSWORD, () => {
      toast.error(INCORRECT_PASSWORD);
      setIsLoading(false);
      setIsLocked(true);
    });

    socket.on(JOINED_SUCCESSFULLY, (data: JoinContestPayload) => {
      if (data.created_by === userData.user_id) {
        setIsHost(true);
      }
      setContestData({
        title: data.title,
        created_by: data.created_by,
        created_by_username: data.created_by_username,
        duration: data.duration,
        max_participants: data.max_participants,
        start_time: data.start_time,
      });
      setQuestions(
        data.questions.sort((a, b) => a.question_number - b.question_number)
      );
      setResponse(data.response);
      setLeaderboard(data.scores);
      if (data.start_time) {
        setCountdownState(CountdownState.ended);
      }
      setJoined(true);
      setIsLoading(false);
    });

    socket.on(CONTEST_STARTED, (data: QuestionWithOptions[]) => {
      setCountdownState(CountdownState.started);
      setContestData((prev) => {
        if (prev) {
          return { ...prev, start_time: Date.now() };
        } else {
          return prev;
        }
      });
      setQuestions(data.sort((a, b) => a.question_number - b.question_number));
    });

    socket.on(USER_JOINED, ({ username }: { username: string }) => {
      toast.info(username + " Joined the room");
      setLeaderboard((prev) => [{ username, score: 0 }, ...prev]);
    });

    socket.on(USER_LEFT, (username: string) => {
      toast.info(username + " Left The Room");
      setLeaderboard((prev) => prev.filter((u) => u.username !== username));
    });

    socket.on(
      SUBMISSION_RESULT,
      ({ is_correct, question_id, response, points_scored }) => {
        if (is_correct) {
          toast.success("Correct Answer");
        } else {
          toast.info("Wrong Answer");
        }
        setResponse((prevResponse) => [
          { is_correct, question_id, response, user_id: userData.user_id },
          ...prevResponse,
        ]);
        if (is_correct) {
          // update the leaderboard
          setLeaderboard((prev) =>
            prev.map((u) => {
              if (u.username === userData.username) {
                u.score += points_scored;
              }
              return u;
            })
          );
        }
        setIsLoading(false);
      }
    );

    socket.on(
      UPDATE_SCORES,
      ({
        username,
        points_scored,
      }: {
        username: string;
        points_scored: number;
      }) => {
        setLeaderboard((prev) =>
          prev.map((u) => {
            if (u.username === username) {
              u.score += points_scored;
            }
            return u;
          })
        );
      }
    );

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
