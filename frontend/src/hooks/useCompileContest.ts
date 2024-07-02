import { useEffect, useState } from "react";
import { QuestionWithOptions } from "../types/models";
import api from "../utils/api";
import { errorHandler } from "../utils/errorHandler";
import { useRecoilState } from "recoil";
import { questionsAtom } from "../atoms/questionAtom";
import { sendRequest } from "../utils/sendRequest";
import { RequestMethods } from "../types/requests";

export const useCompileContest = (contest_id: number) => {
  const [contestQuestions, setContestQuestions] = useRecoilState(questionsAtom);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [refreshContestData, setRefreshContestData] = useState<number>();

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

  const createQuestion = (questionData: QuestionWithOptions) => {
    sendRequest(
      RequestMethods.post,
      "/question/create",
      questionData,
      () => {
        setContestQuestions((prevQuestions) => {
          return [...prevQuestions, questionData];
        });
      },
      setIsLoading,
      setError
    );
  };

  const deleteQuestion = ({
    question_id,
    contest_id,
  }: {
    question_id: number;
    contest_id: number;
  }) => {
    sendRequest(
      RequestMethods.delete,
      `/question/delete?question_id=${question_id}&contest_id=${contest_id}`,
      {},
      () => {
        setContestQuestions((prevQuestions) => {
          const indx = prevQuestions.findIndex(
            (q) => q.question_id === question_id
          );
          if (indx === -1) return prevQuestions;
          else return prevQuestions.splice(indx, 1);
        });
      },
      setIsLoading,
      setError
    );
  };

  // fetching contest questions
  useEffect(() => {
    setIsLoading(true);
    setError(false);
    api.get(`/question/${contest_id}`).then(
      (response) => {
        setContestQuestions(response.data.data);
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
        setError(true);
        errorHandler(err);
      }
    );
  }, [refreshContestData, contest_id]);

  return {
    contestQuestions,
    isLoading,
    error,
    setRefreshContestData,
    updateQuestion,
    createQuestion,
    deleteQuestion,
  };
};
