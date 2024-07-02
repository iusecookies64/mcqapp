import { useSearchParams } from "react-router-dom";
import { useCompileContest } from "../../hooks/useCompileContest";
import { QuestionWithOptions } from "../../types/models";

export const CompileContest = () => {
  const [searchParams] = useSearchParams();
  const {
    contestQuestions,
    isLoading,
    error,
    setRefreshContestData,
    updateQuestion,
    createQuestion,
    deleteQuestion,
  } = useCompileContest(parseInt(searchParams.get("contest-id") || "0"));
  return (
    <div className="compile-contest-container">
      <div>Questions</div>
      <div>
        {contestQuestions.map((question) => (
          <DisplayQuestion question={question} />
        ))}
      </div>
    </div>
  );
};

export const DisplayQuestion = (question: QuestionWithOptions) => {
  return (
    <div>
      <div>{question.question.title}</div>
      <div>
        {question.options.map((option) => (
          <div>{option.title}</div>
        ))}
      </div>
      <div>Answer: {question.question.answer}</div>
    </div>
  );
};
