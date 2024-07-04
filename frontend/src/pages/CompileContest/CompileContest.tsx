import { useSearchParams } from "react-router-dom";
import { useCompileContest } from "../../hooks/useCompileContest";
import { QuestionWithOptions } from "../../types/models";
import { Button } from "../../components/button/Button";
import { useState } from "react";
import { CreateQuestionForm } from "./components/CreateContestForm";
import "./CompileContest.style.css";
import { Icon, IconList } from "../../components/Icon/Icon";
import { SendInvitesModal } from "./components/SendInvitesModal";

export const CompileContest = () => {
  const [searchParams] = useSearchParams();
  const contest_id = parseInt(searchParams.get("contest-id") || "0");
  const {
    contestQuestions,
    isLoading,
    error,
    updateQuestion,
    createQuestion,
    deleteQuestion,
  } = useCompileContest(contest_id);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSendInvitesModalOpen, setIsSendInvitesModelOpen] =
    useState<boolean>(false);
  return (
    <div className="compile-contest-container">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-medium">Contest Questions</div>
        <div className="flex gap-2">
          <Button
            className="dark:bg-sky-600 scale-90"
            onClick={() => setIsSendInvitesModelOpen(true)}
          >
            Send Invites
          </Button>
          <Button
            className="dark:bg-sky-600 scale-90"
            onClick={() => setIsModalOpen(true)}
          >
            Add Question
          </Button>
        </div>
      </div>
      <DisplayQuestion
        updateQuestion={updateQuestion}
        questions={contestQuestions}
        deleteQuestion={deleteQuestion}
      />
      <CreateQuestionForm
        contest_id={contest_id}
        createQuestionHandler={createQuestion}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        isLoading={isLoading}
        error={error}
      />
      <SendInvitesModal
        isOpen={isSendInvitesModalOpen}
        setIsOpen={setIsSendInvitesModelOpen}
        contest_id={contest_id}
      />
    </div>
  );
};

const DisplayQuestion = ({
  questions,
  updateQuestion,
  deleteQuestion,
}: {
  questions: QuestionWithOptions[];
  updateQuestion: (updatedQuestionData: QuestionWithOptions) => void;
  deleteQuestion: (question_id: number) => void;
}) => {
  return (
    <div className="display-questions">
      {questions.map((question) => (
        <div key={question.question_id} className="question-container">
          <div className="question-title">
            <span className="question-labels">Question:</span> {question.title}
          </div>
          <span className="question-labels">Options:</span>
          <div className="question-options">
            {question.options.map((option, indx) => (
              <div key={indx}>
                {indx + 1}) {option.title}
              </div>
            ))}
          </div>
          <div className="question-answer">
            <span className="question-labels">Answer:</span> {question.answer}
          </div>
          <div className="w-full pr-8 pb-3 flex justify-end gap-3 absolute bottom-0">
            <Icon
              variant="xsmall"
              icon={IconList.trash}
              toolTip="Delete Question"
              onClick={() => deleteQuestion(question.question_id)}
            />
            <Icon
              variant="xsmall"
              icon={IconList.pen}
              toolTip="Edit Question"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
