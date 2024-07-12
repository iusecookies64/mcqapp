import { useNavigate, useSearchParams } from "react-router-dom";
import {
  UpdateQuestionData,
  useCompileContest,
} from "../../hooks/useCompileContest";
import { QuestionWithOptions } from "../../types/models";
import { Button } from "../../components/Button/Button";
import { useState } from "react";
import { CreateQuestionForm } from "./components/CreateQuestionForm";
import "./CompileContest.style.css";
import { useMyContestList } from "../../hooks/useMyContestList";
import { UpdateContestModal } from "./components/UpdateContestForm";
import { Modal } from "../../components/Modal/Modal";
import QuestionCard from "../../components/questionCard/QuestionCard";

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
  const { publishContest } = useMyContestList(false);

  const [isQuestionModalOpen, setIsQuestionModalOpen] =
    useState<boolean>(false);
  const [isContestModalOpen, setIsContestModalOpen] = useState<boolean>(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <div className="compile-contest-container">
      <div className="flex gap-4">
        <Button variant="secondary" onClick={() => setIsContestModalOpen(true)}>
          Update Metadata
        </Button>
        <Button variant="secondary" onClick={() => setIsPublishModalOpen(true)}>
          Publish
        </Button>
        <Button
          variant="secondary"
          onClick={() => setIsQuestionModalOpen(true)}
        >
          Add Question
        </Button>
      </div>
      <DisplayQuestion
        updateQuestion={updateQuestion}
        questions={contestQuestions}
        deleteQuestion={deleteQuestion}
        isLoading={isLoading}
        error={error}
      />
      <CreateQuestionForm
        contest_id={contest_id}
        createQuestionHandler={createQuestion}
        isOpen={isQuestionModalOpen}
        setIsOpen={setIsQuestionModalOpen}
        isLoading={isLoading}
        error={error}
      />
      <UpdateContestModal
        isOpen={isContestModalOpen}
        setIsOpen={setIsContestModalOpen}
        contest_id={contest_id}
      />
      <Modal setIsOpen={setIsPublishModalOpen} isOpen={isPublishModalOpen}>
        {(onClose) => (
          <div className="py-3 px-6 flex flex-col gap-8">
            <div>Are you sure you want to publish the contest?</div>
            <div className="w-full flex justify-between">
              <Button onClick={() => onClose()} variant="tertiary">
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  publishContest(contest_id, () => navigate("/my-contests"));
                }}
              >
                Publish
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const DisplayQuestion = ({
  questions,
  updateQuestion,
  isLoading,
  error,
  deleteQuestion,
}: {
  questions: QuestionWithOptions[];
  updateQuestion: (
    updatedQuestionData: UpdateQuestionData,
    onSuccess: () => void
  ) => void;
  deleteQuestion: (question_id: number) => void;
  isLoading: boolean;
  error: boolean;
}) => {
  return (
    <div className="display-questions-container">
      <div className="text-2xl font-semibold mb-4">Contest Questions</div>
      <div className="flex flex-row flex-wrap gap-4">
        {questions.map((question) => (
          <QuestionCard
            question={question}
            updateQuestion={updateQuestion}
            deleteQuestion={deleteQuestion}
            isLoading={isLoading}
            error={error}
          />
        ))}
      </div>
      {questions.length === 0 ? "No Questions Added Yet" : null}
    </div>
  );
};
