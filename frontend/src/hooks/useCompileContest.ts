import { useEffect, useState } from "react";
import { QuestionWithOptions } from "../types/models";
import { useRecoilState } from "recoil";
import { questionsAtom } from "../atoms/questionAtom";
import { sendRequest } from "../utils/sendRequest";
import { RequestMethods } from "../types/requests";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

export type CreateQuestionData = {
  contest_id: number;
  title: string;
  difficulty: 1 | 2 | 3;
  options: string[];
  answer: string;
};

export const useCompileContest = (contest_id: number) => {
  const [contestQuestions, setContestQuestions] = useRecoilState(questionsAtom);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();

  const updateQuestion = (updatedQuestionData: QuestionWithOptions) => {
    sendRequest(
      RequestMethods.post,
      "/question/update",
      updatedQuestionData,
      () => {
        setContestQuestions((prevQuestions) => {
          const indx = prevQuestions.findIndex(
            (q) => q.question_id === updatedQuestionData.question_id
          );
          if (indx === -1) return [...prevQuestions];
          prevQuestions[indx] = updatedQuestionData;
          return [...prevQuestions];
        });
      },
      setIsLoading,
      setError
    );
  };

  const createQuestion = (
    questionData: CreateQuestionData,
    onSuccess: (response: AxiosResponse) => void
  ) => {
    sendRequest(
      RequestMethods.post,
      "/question/create",
      questionData,
      (response) => {
        setContestQuestions((prevQuestions) => {
          return [...prevQuestions, response.data.data];
        });
        // calling onSuccess
        onSuccess(response);
      },
      setIsLoading,
      setError
    );
  };

  const deleteQuestion = (question_id: number) => {
    sendRequest(
      RequestMethods.delete,
      `/question/delete?question_id=${question_id}&contest_id=${contest_id}`,
      {},
      () => {
        setContestQuestions((prevQuestions) => {
          const newArray = [...prevQuestions];
          const indx = newArray.findIndex((q) => q.question_id === question_id);
          if (indx !== -1) newArray.splice(indx, 1);
          return newArray;
        });
      },
      setIsLoading,
      setError
    );
  };

  const fetchContestQuestions = (contest_id: number) => {
    sendRequest(
      RequestMethods.get,
      `/question/${contest_id}`,
      {},
      (response) => {
        setContestQuestions(response.data.data);
      },
      setIsLoading,
      setError
    );
  };

  // fetching contest questions
  useEffect(() => {
    // if invalid contest_id
    if (contest_id === 0) navigate("/");
    // if contest questions is empty or prev fetched questions is different from current then we fetchContestQuestions
    if (
      !contestQuestions.length ||
      contestQuestions[0].contest_id !== contest_id
    ) {
      fetchContestQuestions(contest_id);
    }
  }, [contest_id]);

  return {
    contestQuestions,
    isLoading,
    error,
    fetchContestQuestions,
    updateQuestion,
    createQuestion,
    deleteQuestion,
  };
};
