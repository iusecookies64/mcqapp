import DropDown, { DropdownOption } from "../../components/DropDown";
import { useState } from "react";
import { useMyQuestions } from "../../hooks/useMyQuestions";
import { Question } from "@mcqapp/types";
import { DeleteQuestionBody, UpdateQuestionBody } from "@mcqapp/validations";
import "./MyQuestions.style.css";
import Input from "../../components/Input";
import { Textarea } from "../../components/TextArea";

const topics = [
  { id: Math.random(), label: "Common Sense" },
  { id: Math.random(), label: "Javascript" },
  { id: Math.random(), label: "Data Structure & Algorithms" },
  { id: Math.random(), label: "Operating Systems" },
  { id: Math.random(), label: "Networks" },
  { id: Math.random(), label: "Database Managment" },
  { id: Math.random(), label: "Common Sense" },
  { id: Math.random(), label: "Javascript" },
  { id: Math.random(), label: "Data Structure & Algorithms" },
  { id: Math.random(), label: "Operating Systems" },
  { id: Math.random(), label: "Networks" },
  { id: Math.random(), label: "Database Managment" },
  { id: Math.random(), label: "Common Sense" },
  { id: Math.random(), label: "Javascript" },
  { id: Math.random(), label: "Data Structure & Algorithms" },
  { id: Math.random(), label: "Operating Systems" },
  { id: Math.random(), label: "Networks" },
  { id: Math.random(), label: "Database Managment" },
];

const sorts = [
  { id: Math.random(), label: "From Latest to Oldest" },
  { id: Math.random(), label: "From Oldest to Latest" },
];

const MyQuestions = () => {
  const [topic, setTopic] = useState<DropdownOption>(topics[0]);
  const [sort, setSort] = useState<DropdownOption>(sorts[0]);
  const {
    myQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    isLoading,
    error,
  } = useMyQuestions();

  return (
    <div className="w-full h-full p-4 overflow-hidden">
      <div className="flex justify-center gap-1">
        <DropDown
          className="min-w-96"
          label="Topic"
          value={topic}
          options={topics}
          onChange={setTopic}
        />
        <DropDown
          className="min-w-96"
          label="Sort By"
          value={sort}
          options={sorts}
          onChange={setSort}
        />
      </div>
      <div className="h-full w-full flex flex-col items-center overflow-x-hidden overflow-y-auto mt-3">
        {myQuestions &&
          myQuestions.map((question, index) => (
            <QuestionCard
              key={question.question_id}
              index={index}
              question={question}
              updateQuestion={updateQuestion}
              deleteQuestion={deleteQuestion}
            />
          ))}
      </div>
    </div>
  );
};

type QuestionCardProps = {
  question: Question;
  index: number;
  updateQuestion: (
    updatedQuestionData: UpdateQuestionBody,
    onSuccess?: () => void
  ) => void;
  deleteQuestion: (data: DeleteQuestionBody, onSuccess?: () => void) => void;
};

const QuestionCard = ({
  question,
  updateQuestion,
  deleteQuestion,
  index,
}: QuestionCardProps) => {
  return (
    <div className="questions-card-container delay-100">
      <div className="questions-card-header">
        <div className="text-lg">Question {index + 1}</div>
        {question.difficulty === 1 && (
          <div className="badge badge-easy">Easy</div>
        )}
        {question.difficulty === 2 && (
          <div className="badge badge-medium">Meduim</div>
        )}
        {question.difficulty === 3 && (
          <div className="badge badge-hard">Hard</div>
        )}
      </div>
      <form>
        <fieldset disabled={true}>
          <div className="question-statement">
            <Textarea inputLabel="Question" value={question.statement} />
          </div>
          <div>
            <div>{question.option1}</div>
            <div>{question.option2}</div>
            <div>{question.option3}</div>
            <div>{question.option4}</div>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default MyQuestions;
