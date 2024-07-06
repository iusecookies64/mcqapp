import { useEffect, useState } from "react";
import { QuestionWithOptions } from "../types/models";
import { Socket, io } from "socket.io-client";
import { useRecoilValue } from "recoil";
import { userDataAtom } from "../atoms/userAtom";
import { toast } from "react-toastify";

type Response = {
  question_id: number;
  isCorrect: boolean;
  response: string;
};

export const useLobby = (contest_id: number) => {
  const userData = useRecoilValue(userDataAtom);
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([]);
  const [response, setResponse] = useState<Record<number, Response>>({});
  const [leaderboard, setLeaderboard] = useState<
    { username: string; score: number }[]
  >([]);
  const [notStarted, setNotStarted] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submitResponse = (question_id: number, response: string) => {
    if (socket) {
      setIsLoading(true);
      socket.emit("Submit Response", {
        question_id,
        contest_id,
        response,
        ...userData,
      });
    } else {
      console.log("socket dead");
    }
  };

  useEffect(() => {
    setSocket(() => {
      setIsLoading(true);
      const socket = io("http://localhost:3000");
      socket.on("connect", () => {
        socket.emit("Enter Contest", { user_id: userData.user_id, contest_id });
      });
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
      socket.on("Not Started", () => {
        setIsLoading(false);
        setNotStarted(true);
      });
      return socket;
    });
  }, [contest_id]);

  return {
    questions,
    response,
    leaderboard,
    notStarted,
    isLoading,
    submitResponse,
  };
};
