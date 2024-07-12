import { useState } from "react";
import { UpdateQuestionData } from "../../hooks/useCompileContest";
import { UpdateQuestionForm } from "../../pages/CompileContest/components/UpdateQuestionForm";
import { QuestionWithOptions } from "../../types/models";
import { Button } from "../Button/Button";
import { Icon, IconList } from "../Icon/Icon";
import "./QuestionCard.styles.css";
import { Modal } from "../Modal/Modal";

type Props = {
  question: QuestionWithOptions;
  updateQuestion: (
    updatedQuestionData: UpdateQuestionData,
    onSuccess: () => void
  ) => void;
  deleteQuestion: (question_id: number) => void;
  isLoading: boolean;
  error: boolean;
};

const QuestionCard = ({
  question,
  updateQuestion,
  deleteQuestion,
  isLoading,
  error,
}: Props) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  return (
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
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsDeleteModalOpen(true)}
          tooltip="Delete"
        >
          <Icon icon={IconList.trash} />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setIsUpdateModalOpen(true);
          }}
          tooltip="Edit"
        >
          <Icon icon={IconList.pen} />
        </Button>
      </div>
      <UpdateQuestionForm
        setIsOpen={setIsUpdateModalOpen}
        isOpen={isUpdateModalOpen}
        updateQuestionHandler={updateQuestion}
        isLoading={isLoading}
        error={error}
        questionData={question}
      />
      <Modal setIsOpen={setIsDeleteModalOpen} isOpen={isDeleteModalOpen}>
        {(onClose) => {
          return (
            <div className="max-w-md flex flex-col gap-6 p-6">
              <div>Are you sure you want to delete the question?</div>
              <div className="w-full flex justify-between items-center">
                <Button variant="tertiary">Cancel</Button>
                <Button
                  variant="alert"
                  onClick={() => {
                    deleteQuestion(question.question_id);
                    onClose();
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          );
        }}
      </Modal>
    </div>
  );
};

export default QuestionCard;
