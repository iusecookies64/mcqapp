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
import useDebounce from "../../hooks/useDebounce";
import Input from "../../components/Input";
import { QuestionCard } from "../../components/QuestionCard";

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
  const [searchedValue, setSearchedValue] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchedValue);
  const [updateQuestionModal, setUpdateQuestionModal] = useState(false);
  const [createQuestionModal, setCreateQuestionModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question>();
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    if (myQuestions && selectedTopic) {
      const filteredListTemp = myQuestions.filter(
        (q) =>
          q.topic_id === selectedTopic.topic_id &&
          q.statement.toLowerCase().includes(debouncedSearchValue)
      );
      filteredListTemp.sort((a, b) => {
        if (sort.id === sorts[0].id) {
          return (
            new Date(b.created_at || "").getTime() -
            new Date(a.created_at || "").getTime()
          );
        } else {
          return (
            new Date(a.created_at || "").getTime() -
            new Date(b.created_at || "").getTime()
          );
        }
      });
      setFilteredList(filteredListTemp);
    }
  }, [myQuestions, selectedTopic, debouncedSearchValue, sort]);

  const DeleteQuestionHandler = () => {
    if (selectedQuestion?.question_id) {
      deleteQuestion({ question_id: selectedQuestion.question_id }, () => {
        toast.success("Question Deleted");
        setDeleteModal(false);
      });
    }
  };

  return (
    <div className="my-questions-container">
      <div className="w-full grid grid-cols-4 gap-3">
        <Input
          placeholder="Search Question"
          inputType="text"
          value={searchedValue}
          onChange={(e) => setSearchedValue(e.target.value)}
        />
        <TopicSelector
          currentTopic={selectedTopic}
          setCurrentTopic={setSelectedTopic}
        />
        <DropDown
          label="Sort By"
          placeholder="Select A Sort Option"
          value={sort}
          options={sorts}
          idKey={"id"}
          labelKey={"label"}
          onChange={setSort}
        />
        <Button
          className="flex justify-between items-center gap-2 py-2 justify-self-start"
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
            <Button variant="alert" onClick={DeleteQuestionHandler}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyQuestions;
