import { useEffect, useState } from "react";
import { Options, QuestionWithOptions } from "../types/models";
import { useRecoilState } from "recoil";
import { questionsAtom } from "../atoms/questionAtom";
import { sendRequest } from "../services/api";
import { RequestMethods } from "../types/requests";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export type CreateQuestionData = {
  contest_id: number;
  title: string;
  difficulty: 1 | 2 | 3;
  question_number: number;
  options: { title: string; option_number: number }[];
  answer: string;
};

export type UpdateQuestionData = {
  contest_id: number;
  question_id: number;
  title: string;
  answer: string;
  difficulty: 1 | 2 | 3;
  options: Options[];
};

export const useCompileContest = (contest_id: number) => {
  const [contestQuestions, setContestQuestions] = useRecoilState(questionsAtom);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();

  const updateQuestion = (
    updatedQuestionData: UpdateQuestionData,
    onSuccess: () => void
  ) => {
    sendRequest(
      RequestMethods.post,
      `/question/update?contest_id=${contest_id}`,
      updatedQuestionData,
      () => {
        setContestQuestions((prevQuestions) => {
          const newList = prevQuestions.map((question) => {
            if (question.question_id === updatedQuestionData.question_id) {
              return {
                ...updatedQuestionData,
                question_number: question.question_number,
              };
            } else {
              return question;
            }
          });
          return newList;
        });
        toast.success("Question Updated");
        onSuccess();
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
      `/question/create?contest_id=${contest_id}`,
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
        toast.success("Question Deleted");
      },
      setIsLoading,
      setError
    );
  };

  const reorderQuestions = () => {
    const data = contestQuestions.map((question, indx) => {
      return { question_id: question.question_id, question_number: indx + 1 };
    });
    console.log(data);
    sendRequest(
      RequestMethods.post,
      `/question/reorder-questions?contest_id=${contest_id}`,
      data,
      () => {
        // on success we update the number locally
        setContestQuestions((questions) => {
          const newList = questions.map((question, indx) => ({
            ...question,
            question_number: indx + 1,
          }));
          return newList;
        });

        toast.success("Questions Reordered");
      },
      setIsLoading,
      setError
    );
  };

  const fetchContestQuestions = (contest_id: number) => {
    sendRequest(
      RequestMethods.get,
      `/question/getAllQuestions?contest_id=${contest_id}`,
      {},
      (response) => {
        const questions = response.data.data as QuestionWithOptions[];
        questions.sort((a, b) => a.question_number - b.question_number);
        console.log(questions);
        setContestQuestions(questions);
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
    setContestQuestions,
    isLoading,
    error,
    fetchContestQuestions,
    updateQuestion,
    createQuestion,
    deleteQuestion,
    reorderQuestions,
  };
};
