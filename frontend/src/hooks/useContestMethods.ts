import { useEffect, useState } from "react";
import { QuestionWithOptions } from "../types/models";
import api from "../utils/api";
import { errorHandler } from "../utils/errorHandler";
import { AxiosResponse } from "axios";

enum RequestMethod {
  post = "post",
  get = "get",
  delete = "delete",
}

export const useContestMethods = (contest_id: number) => {
  const [contestQuestions, setContestQuestions] = useState<
    QuestionWithOptions[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [refreshContestData, setRefreshContestData] = useState<number>();

  const sendRequest = (
    method: RequestMethod,
    url: string,
    data: object,
    responseHandler: (response: AxiosResponse) => void
  ) => {
    setIsLoading(true);
    if (method !== "post") {
      api[method](url).then(
        (response) => {
          responseHandler(response);
          setIsLoading(false);
        },
        (err) => {
          setIsLoading(false);
          setError(true);
          errorHandler(err);
        }
      );
    } else {
      api.post(url, data).then(
        (response) => {
          responseHandler(response);
          setIsLoading(false);
        },
        (err) => {
          setIsLoading(false);
          setError(true);
          errorHandler(err);
        }
      );
    }
  };

  const updateQuestion = (
    updatedQuestionData: QuestionWithOptions,
    indx: number
  ) => {
    sendRequest(
      RequestMethod.post,
      "/question/update",
      updatedQuestionData,
      () => {
        setContestQuestions((oldQuestionsArray) => {
          const updatedQuestionsArray = oldQuestionsArray;
          updatedQuestionsArray[indx] = updatedQuestionData;
          return [...updatedQuestionsArray];
        });
        setIsLoading(false);
      }
    );
  };

  const createQuestion = (questionData: QuestionWithOptions) => {
    sendRequest(RequestMethod.post, "/question/create", questionData, () => {
      setContestQuestions((prevQuestions) => {
        return [...prevQuestions, questionData];
      });
      setIsLoading(false);
    });
  };

  const deleteQuestion = (
    { question_id, contest_id }: { question_id: number; contest_id: number },
    indx: number
  ) => {
    sendRequest(
      RequestMethod.delete,
      `/question/delete?question_id=${question_id}&contest_id=${contest_id}`,
      {},
      () => {
        setContestQuestions((prevQuestions) => {
          return prevQuestions.splice(indx, 1);
        });
      }
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
