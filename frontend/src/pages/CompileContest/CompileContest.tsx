import { useNavigate, useSearchParams } from "react-router-dom";
import {
  UpdateQuestionData,
  useCompileContest,
} from "../../hooks/useCompileContest";
import { QuestionWithOptions } from "../../types/models";
import { Button } from "../../components/button/Button";
import { useState } from "react";
import { CreateQuestionForm } from "./components/CreateQuestionForm";
import "./CompileContest.style.css";
import { Icon, IconList } from "../../components/Icon/Icon";
import { useMyContestList } from "../../hooks/useMyContestList";
import { UpdateContestModal } from "./components/UpdateContestForm";
import { UpdateQuestionForm } from "./components/UpdateQuestionForm";
import { Modal } from "../../components/modal/Modal";

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
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsContestModalOpen(true)}
        >
          Update Metadata
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsPublishModalOpen(true)}
        >
          Publish
        </Button>
        <Button
          variant="secondary"
          size="sm"
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
  const [isModalOpen, setIsModelOpen] = useState(false);
  const [questionData, setQuestionData] = useState<QuestionWithOptions>();
  return (
    <div className="display-questions-container">
      <div className="text-2xl font-semibold mb-4">Contest Questions</div>
      <div className="flex flex-row flex-wrap gap-4">
        {questions.map((question) => (
          <div key={question.question_id} className="question-container">
            <div className="question-title">
              <span className="question-labels">Question:</span>{" "}
              {question.title}
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
              <Button
                variant="secondary"
                size="sm"
                onClick={() => deleteQuestion(question.question_id)}
                tooltip="Delete"
              >
                <Icon icon={IconList.trash} />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setQuestionData(question);
                  setIsModelOpen(true);
                }}
                tooltip="Edit"
              >
                <Icon icon={IconList.pen} />
              </Button>
            </div>
          </div>
        ))}
        {questions.length === 0 ? "No Questions Added Yet" : null}
      </div>
      {questionData && (
        <UpdateQuestionForm
          setIsOpen={setIsModelOpen}
          isOpen={isModalOpen}
          updateQuestionHandler={updateQuestion}
          isLoading={isLoading}
          error={error}
          questionData={questionData}
        />
      )}
    </div>
  );
};
