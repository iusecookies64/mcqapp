import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { questionsAtom } from "../atoms/questionAtom";
import {
  CreateQuestionBody,
  DeleteQuestionBody,
  UpdateQuestionBody,
} from "@mcqapp/validations";
import api, { apiConfig, errorHandler } from "../services/api";
import {
  CreateQuestionResponse,
  GetUserQuestionsResponse,
} from "@mcqapp/types";
import { AxiosError } from "axios";

export const useMyQuestions = () => {
  const [myQuestions, setMyQuestions] = useRecoilState(questionsAtom);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const handleError = (err: AxiosError) => {
    setIsLoading(false);
    setError(true);
    errorHandler(err);
  };

  const updateQuestion = (
    updatedQuestionData: UpdateQuestionBody,
    onSuccess?: () => void
  ) => {
    setIsLoading(true);
    setError(false);
    api[apiConfig.updateQuestion.type](
      apiConfig.updateQuestion.endpoint,
      updatedQuestionData
    )
      .then(() => {
        setIsLoading(false);
        if (onSuccess) onSuccess();
      })
      .catch(handleError);
  };

  const createQuestion = (
    questionData: CreateQuestionBody,
    onSuccess?: () => void
  ) => {
    setIsLoading(true);
    setError(false);
    api[apiConfig.createQuestion.type](
      apiConfig.createQuestion.endpoint,
      questionData
    )
      .then((response) => {
        const { data } = response.data as CreateQuestionResponse;
        setMyQuestions((prevList) => {
          if (prevList) return [...prevList, data];
          else return [data];
        });
        setIsLoading(false);
        if (onSuccess) onSuccess();
      })
      .catch(handleError);
  };

  const deleteQuestion = (data: DeleteQuestionBody, onSuccess?: () => void) => {
    setIsLoading(true);
    setError(false);
    api[apiConfig.deleteQuestion.type](apiConfig.deleteQuestion.endpoint, data)
      .then(() => {
        setIsLoading(false);
        if (onSuccess) onSuccess();
      })
      .catch(handleError);
  };

  // fetching contest questions
  useEffect(() => {
    if (!myQuestions) {
      api[apiConfig.getMyQuestions.type](apiConfig.getMyQuestions.endpoint)
        .then((response) => {
          const { data } = response.data as GetUserQuestionsResponse;
          setMyQuestions(data);
        })
        .catch(handleError);
    }
  }, []);

  return {
    myQuestions,
    isLoading,
    error,
    updateQuestion,
    createQuestion,
    deleteQuestion,
  };
};
