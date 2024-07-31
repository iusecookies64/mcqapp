import DropDown from "../../components/DropDown";
import { useEffect, useState } from "react";
import { useMyQuestions } from "../../hooks/useMyQuestions";
import { Question } from "@mcqapp/types";
import "./MyQuestions.style.css";
import Icon, { IconList } from "../../components/Icon";
import Button from "../../components/Button";
import { Modal } from "../../components/Modal";
import TopicSelector from "../../components/TopicSelector";
import { useRecoilState } from "recoil";
import { selectedTopicAtom } from "../../atoms/topicsAtom";
import { toast } from "react-toastify";
import { CreateQuestionModal, UpdateQuestionModal } from "./QuestionModals";

const sorts = [
  { id: 1, label: "From Latest to Oldest" },
  { id: 2, label: "From Oldest to Latest" },
];

const MyQuestions = () => {
  const {
    myQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    isLoadingAction,
    isLoadingQuestion,
    error,
  } = useMyQuestions();
  const [selectedTopic, setSelectedTopic] = useRecoilState(selectedTopicAtom);
  const [sort, setSort] = useState(sorts[0]);
  const [filteredList, setFilteredList] = useState<Question[]>([]);
  const [updateQuestionModal, setUpdateQuestionModal] = useState(false);
  const [createQuestionModal, setCreateQuestionModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question>();
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    if (myQuestions && selectedTopic) {
      setFilteredList(
        myQuestions.filter((q) => q.topic_id === selectedTopic.topic_id)
      );
    }
  }, [myQuestions, selectedTopic]);

  return (
    <div className="my-questions-container">
      <div className="w-full flex justify-start gap-3">
        <TopicSelector
          currentTopic={selectedTopic}
          setCurrentTopic={setSelectedTopic}
        />
        <DropDown
          className="min-w-96"
          label="Sort By"
          placeholder="Select A Sort Option"
          value={sort}
          options={sorts}
          idKey={"id"}
          labelKey={"label"}
          onChange={setSort}
        />
        <Button
          className="flex justify-between items-center gap-2 py-2"
          tooltip="Create a new question"
          onClick={() => setCreateQuestionModal(true)}
        >
          <Icon icon={IconList.plus} /> <span>New Question</span>
        </Button>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 items-center">
        {filteredList.map((question, index) => (
          <QuestionCard
            isLoading={isLoadingQuestion}
            key={question.question_id}
            index={index}
            question={question}
            setDeleteModal={setDeleteModal}
            setUpdateModal={setUpdateQuestionModal}
            setSelectedQuestion={setSelectedQuestion}
          />
        ))}
      </div>
      <UpdateQuestionModal
        question={selectedQuestion}
        isLoading={isLoadingAction}
        error={error}
        updateQuestion={updateQuestion}
        isOpen={updateQuestionModal}
        setIsOpen={setUpdateQuestionModal}
      />
      <CreateQuestionModal
        createQuestion={createQuestion}
        isLoading={isLoadingAction}
        error={error}
        isOpen={createQuestionModal}
        setIsOpen={setCreateQuestionModal}
      />
      <Modal isOpen={deleteModal} setIsOpen={setDeleteModal}>
        <div>
          <div className="text-xl">Delete Question</div>
          <div className="p-6">
            Are you sure you want to delete this question?
          </div>
          <div className="w-full flex justify-end gap-3">
            <Button variant="tertiary">Cancel</Button>
            <Button
              variant="alert"
              onClick={() => {
                if (selectedQuestion?.question_id) {
                  deleteQuestion(
                    { question_id: selectedQuestion.question_id },
                    () => {
                      toast.success("Question Deleted");
                      setDeleteModal(false);
                    }
                  );
                }
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

type QuestionCardProps = {
  question: Question;
  setUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedQuestion: React.Dispatch<
    React.SetStateAction<Question | undefined>
  >;
  setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  index: number;
  isLoading: boolean;
};

const QuestionCard = ({
  question,
  setUpdateModal,
  setDeleteModal,
  setSelectedQuestion,
  index,
}: QuestionCardProps) => {
  return (
    <div className="questions-card-container delay-100">
      <div className="questions-card-header">
        <div className="text-lg">Question {index + 1}</div>
        <div className="flex gap-1 items-center">
          <span className="text-[14px]">Difficulty:</span>
          {question.difficulty === 1 && (
            <div className="text-[14px] font-bold text-green-500 dark:text-green-600">
              Easy
            </div>
          )}
          {question.difficulty === 2 && (
            <div className="text-[14px] font-bold text-yellow-500">Medium</div>
          )}
          {question.difficulty === 3 && (
            <div className="text-[14px] font-bold text-red-500">Hard</div>
          )}
        </div>
        <div className="flex gap-3 items-center">
          <Button
            size="sm"
            tooltip="Edit Question"
            onClick={() => {
              setSelectedQuestion(question);
              setUpdateModal(true);
            }}
          >
            <Icon icon={IconList.pen} />
          </Button>
          <Button
            variant="alert"
            size="sm"
            tooltip="Delete Question"
            onClick={() => {
              setSelectedQuestion(question);
              setDeleteModal(true);
            }}
          >
            <Icon icon={IconList.trash} />
          </Button>
        </div>
      </div>
      <div className="p-3 flex flex-col gap-1">
        <div className="text-sm text-slate-400 font-medium">Question</div>
        <div className="question-statement">{question.statement}</div>
      </div>
      <div className="options-container">
        <div className={question.answer === 1 ? "correct-answer" : ""}>
          A) {question.option1}
        </div>
        <div className={question.answer === 2 ? "correct-answer" : ""}>
          B) {question.option2}
        </div>
        <div className={question.answer === 3 ? "correct-answer" : ""}>
          C) {question.option3}
        </div>
        <div className={question.answer === 4 ? "correct-answer" : ""}>
          D) {question.option4}
        </div>
      </div>
    </div>
  );
};

export default MyQuestions;
