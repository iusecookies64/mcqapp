import { useState } from "react";
import { UpdateQuestionData } from "../../hooks/useCompileContest";
import { UpdateQuestionForm } from "../../pages/CompileContest/components/UpdateQuestionForm";
import { QuestionWithOptions } from "../../types/models";
import { Button } from "../Button";
import { Icon, IconList } from "../Icon";
import "./QuestionCard.styles.css";
import { Modal } from "../Modal";
import { Expandable } from "../Expandable";
import { Reorder, useDragControls } from "framer-motion";

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

export const QuestionCardDraggable = ({ question }: Props) => {
  const controls = useDragControls();
  return (
    <Reorder.Item
      key={question.question_id}
      value={question}
      className="question-card-draggable-container"
      dragListener={false}
      dragControls={controls}
    >
      <div key={question.question_id} className="question-container-draggable">
        <div>
          <div className="question-labels">Question:</div>
          <div className="text-[16px] pl-2">{question.title}</div>
        </div>
      </div>
      <div
        className="h-full flex-grow flex items-center pointer-events-auto"
        onPointerDown={(e) => controls.start(e)}
      >
        <Icon
          icon={IconList.grip}
          className="h-8 w-8 dark:text-gray-light cursor-pointer active:cursor-grab"
        />
      </div>
    </Reorder.Item>
  );
};

export const QuestionCard = ({
  question,
  updateQuestion,
  deleteQuestion,
  isLoading,
  error,
}: Props) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  return (
    <div key={question.question_id} className="question-card-container">
      <div key={question.question_id} className="question-container">
        <div>
          <div className="question-labels">Question:</div>
          <div className="text-[16px] pl-2">{question.title}</div>
        </div>
        <Expandable>
          <div className="question-labels">Options:</div>
          <div className="question-options">
            {question.options.map((option, indx) => (
              <div key={indx}>
                {indx + 1}) {option.title}
              </div>
            ))}
          </div>
          <div className="question-answer">
            <div className="question-labels">Answer:</div>
            <div className="pl-2">{question.answer}</div>
          </div>
        </Expandable>
        <div className="w-full pr-8 pb-3 flex justify-end gap-3 absolute bottom-0">
          <Button
            variant="alert"
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
    </div>
  );
};
