import { useContext, useEffect, useState } from "react";
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
import { AuthContext } from "../components/AuthContext";

export const useMyQuestions = () => {
  const { user } = useContext(AuthContext);
  const [myQuestions, setMyQuestions] = useRecoilState(questionsAtom);
  const [isLoadingAction, setIsLoadingAction] = useState<boolean>(false);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const handleError = (err: AxiosError) => {
    setIsLoadingAction(false);
    setError(true);
    setIsLoadingQuestion(false);
    setTimeout(() => setError(false), 5000);
    errorHandler(err);
  };

  const updateQuestion = (data: UpdateQuestionBody, onSuccess?: () => void) => {
    setIsLoadingAction(true);
    setError(false);
    api[apiConfig.updateQuestion.type](apiConfig.updateQuestion.endpoint, data)
      .then(() => {
        if (user) {
          setMyQuestions((prev) => {
            if (!prev) return prev;
            return prev.map((question) => {
              if (question.question_id !== data.question_id) return question;
              return {
                ...data,
                created_by: user.user_id,
              };
            });
          });
        }
        setIsLoadingAction(false);
        if (onSuccess) onSuccess();
      })
      .catch(handleError);
  };

  const createQuestion = (
    questionData: CreateQuestionBody,
    onSuccess?: () => void
  ) => {
    setIsLoadingAction(true);
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
        setIsLoadingAction(false);
        if (onSuccess) onSuccess();
      })
      .catch(handleError);
  };

  const deleteQuestion = (data: DeleteQuestionBody, onSuccess?: () => void) => {
    setIsLoadingAction(true);
    setError(false);
    api[apiConfig.deleteQuestion.type](apiConfig.deleteQuestion.endpoint, data)
      .then(() => {
        // on success removing question from my questions list
        setMyQuestions((prev) => {
          if (prev) {
            return prev.filter((q) => q.question_id !== data.question_id);
          } else {
            return prev;
          }
        });
        setIsLoadingAction(false);
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
          setIsLoadingQuestion(false);
        })
        .catch(handleError);
    } else {
      setIsLoadingQuestion(false);
    }
  }, []);

  return {
    myQuestions,
    isLoadingQuestion,
    isLoadingAction,
    error,
    updateQuestion,
    createQuestion,
    deleteQuestion,
  };
};
