import { useNavigate, useSearchParams } from "react-router-dom";
import {
  UpdateQuestionData,
  useCompileContest,
} from "../../hooks/useCompileContest";
import { QuestionWithOptions } from "../../types/models";
import { Button } from "../../components/Button";
import { useState } from "react";
import { CreateQuestionForm } from "./components/CreateQuestionForm";
import "./CompileContest.style.css";
import { useMyContestList } from "../../hooks/useMyContestList";
import { UpdateContestModal } from "./components/UpdateContestForm";
import { Modal } from "../../components/Modal";
import {
  QuestionCard,
  QuestionCardDraggable,
} from "../../components/QuestionCard";
import { Reorder } from "framer-motion";
import { DisplayInfo } from "../../components/DisplayInfo";

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
    setContestQuestions,
    reorderQuestions,
  } = useCompileContest(contest_id);
  const { publishContest } = useMyContestList(false);

  const [isQuestionModalOpen, setIsQuestionModalOpen] =
    useState<boolean>(false);
  const [isContestModalOpen, setIsContestModalOpen] = useState<boolean>(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
  const [isReorder, setIsReorder] = useState<boolean>(false);
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
      <div className="flex justify-between my-4">
        <div className="text-2xl font-semibold">Contest Questions</div>
        {isReorder ? (
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={() => {
              reorderQuestions();
              if (contestQuestions.length) setIsReorder(false);
            }}
          >
            Save
          </Button>
        ) : (
          <Button
            variant="tertiary"
            size="sm"
            type="button"
            onClick={() => {
              if (contestQuestions.length) setIsReorder(true);
            }}
          >
            Reorder
          </Button>
        )}
      </div>
      {isReorder ? (
        <DisplayQuestionDraggable
          updateQuestion={updateQuestion}
          questions={contestQuestions}
          setQuestions={setContestQuestions}
          deleteQuestion={deleteQuestion}
          isLoading={isLoading}
          error={error}
        />
      ) : (
        <DisplayQuestion
          updateQuestion={updateQuestion}
          questions={contestQuestions}
          deleteQuestion={deleteQuestion}
          isLoading={isLoading}
          error={error}
        />
      )}
      <CreateQuestionForm
        contest_id={contest_id}
        question_number={contestQuestions.length + 1}
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

const DisplayQuestionDraggable = ({
  questions,
  setQuestions,
  updateQuestion,
  isLoading,
  error,
  deleteQuestion,
}: {
  questions: QuestionWithOptions[];
  setQuestions: React.Dispatch<React.SetStateAction<QuestionWithOptions[]>>;
  updateQuestion: (
    updatedQuestionData: UpdateQuestionData,
    onSuccess: () => void
  ) => void;
  deleteQuestion: (question_id: number) => void;
  isLoading: boolean;
  error: boolean;
}) => {
  return (
    <Reorder.Group
      axis="y"
      values={questions}
      onReorder={setQuestions}
      className="flex flex-row flex-wrap gap-6 select-none overflow-y-scroll h-full px-3 relative"
    >
      {questions.map((question) => (
        <QuestionCardDraggable
          key={question.question_id}
          question={question}
          updateQuestion={updateQuestion}
          deleteQuestion={deleteQuestion}
          isLoading={isLoading}
          error={error}
        />
      ))}
      {questions.length === 0 && (
        <DisplayInfo
          type="info"
          message="No Questions Added Yet, Click Add Question"
        />
      )}
    </Reorder.Group>
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
    <div className="flex flex-row flex-wrap gap-6 select-none overflow-x-hidden overflow-y-scroll h-full px-3 relative">
      {questions.map((question) => (
        <QuestionCard
          key={question.question_id}
          question={question}
          updateQuestion={updateQuestion}
          deleteQuestion={deleteQuestion}
          isLoading={isLoading}
          error={error}
        />
      ))}
      {questions.length === 0 && (
        <DisplayInfo
          type="info"
          message="No Questions Added Yet, Click Add Question"
        />
      )}
    </div>
  );
};
