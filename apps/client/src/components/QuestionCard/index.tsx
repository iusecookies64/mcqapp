import { Question, Response, UserSubmitResponse } from "@mcqapp/types";
import Button from "../Button";
import Icon, { IconList } from "../Icon";
import { useEffect, useRef, useState } from "react";
import { Loader } from "../Loader";
import Countdown from "react-countdown";
import "./QuestionCard.styles.css";

type QuestionCardProps = {
  question: Question;
  setUpdateModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedQuestion?: React.Dispatch<
    React.SetStateAction<Question | undefined>
  >;
  setDeleteModal?: React.Dispatch<React.SetStateAction<boolean>>;
  index: number;
  isLoading: boolean;
  response?: Response;
};

export const QuestionCard = ({
  question,
  setUpdateModal,
  setDeleteModal,
  setSelectedQuestion,
  index,
  response,
}: QuestionCardProps) => {
  return (
    <div className="questions-card-container self-stretch">
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
        {!response && (
          <div className="flex gap-3 items-center">
            <Button
              size="sm"
              tooltip="Edit Question"
              onClick={() => {
                if (setSelectedQuestion) setSelectedQuestion(question);
                if (setUpdateModal) setUpdateModal(true);
              }}
            >
              <Icon icon={IconList.pen} />
            </Button>
            <Button
              variant="alert"
              size="sm"
              tooltip="Delete Question"
              onClick={() => {
                if (setSelectedQuestion) setSelectedQuestion(question);
                if (setDeleteModal) setDeleteModal(true);
              }}
            >
              <Icon icon={IconList.trash} />
            </Button>
          </div>
        )}
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
      {response && (
        <div className="flex gap-3 items-center">
          <div>Response:</div>
          <div
            className={
              response.response === question.answer
                ? "correct-user-response"
                : "wrong-user-response"
            }
          >
            {response.response == 1 && <div>A</div>}
            {response.response == 2 && <div>B</div>}
            {response.response == 3 && <div>C</div>}
            {response.response == 4 && <div>D</div>}
          </div>
        </div>
      )}
    </div>
  );
};

type GameQuestionCardProps = {
  question: Question;
  start_time: number;
  getNextQuestion: () => void;
  response?: UserSubmitResponse;
  loadingResponse: boolean;
  submitResponse: (response: number) => void;
};

export const GameQuestionCard = ({
  question,
  start_time,
  getNextQuestion,
  response,
  submitResponse,
  loadingResponse,
}: GameQuestionCardProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  const onCompleteHandler = () => {
    // adding exit from bottom animation class
    if (nodeRef.current) {
      nodeRef.current.classList.add("exit-animation");
    }
    // calling getNextQuestion
    getNextQuestion();
  };
  return (
    <div
      ref={nodeRef}
      key={question.question_id}
      className="questions-card-container"
      style={{ animationFillMode: "forwards" }}
    >
      <div className="questions-card-header">
        <div className="text-lg">Question</div>
        <div className="flex gap-3">
          <span>Time Left:</span>
          <Countdown
            date={start_time + question.time_limit * 1000}
            onComplete={onCompleteHandler}
          />
        </div>
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
      </div>
      <div className="p-3 flex flex-col gap-1">
        <div className="text-sm text-slate-400 font-medium">Question</div>
        <div className="question-statement">{question.statement}</div>
      </div>
      <div className="options-container-game">
        <div
          onClick={() => {
            if (!response) setSelectedOption(1);
          }}
          className={`${selectedOption === 1 && "selected-option"} ${
            selectedOption === 1 &&
            response &&
            (response.is_correct ? "correct-answer" : "wrong-answer")
          }`}
        >
          A) {question.option1}
        </div>
        <div
          onClick={() => {
            if (!response) setSelectedOption(2);
          }}
          className={`${selectedOption === 2 && "selected-option"} ${
            selectedOption === 2 &&
            response &&
            (response.is_correct ? "correct-answer" : "wrong-answer")
          }`}
        >
          B) {question.option2}
        </div>
        <div
          onClick={() => {
            if (!response) setSelectedOption(3);
          }}
          className={`${selectedOption === 3 && "selected-option"} ${
            selectedOption === 3 &&
            response &&
            (response.is_correct ? "correct-answer" : "wrong-answer")
          }`}
        >
          C) {question.option3}
        </div>
        <div
          onClick={() => {
            if (!response) setSelectedOption(4);
          }}
          className={`${selectedOption === 4 && "selected-option"} ${
            selectedOption === 4 &&
            response &&
            (response.is_correct ? "correct-answer" : "wrong-answer")
          }`}
        >
          D) {question.option4}
        </div>
      </div>
      <div className="p-3 flex justify-end">
        <Button
          variant={
            !response ? "primary" : response.is_correct ? "success" : "alert"
          }
          className="relative"
          onClick={() => {
            if (!response && selectedOption) {
              submitResponse(selectedOption);
            }
          }}
        >
          {!loadingResponse && !response && "Submit"}
          {loadingResponse && <Loader height={25} width={25} strokeWidth={5} />}
          {!loadingResponse && response && response.is_correct && (
            <Icon icon={IconList.check} />
          )}
          {!loadingResponse && response && !response.is_correct && (
            <Icon icon={IconList.xmark} />
          )}
        </Button>
      </div>
    </div>
  );
};

type QuestionCardSelectProps = {
  question: Question;
  selectQuestion: (question_id: number) => void;
  unSelectQuestion: (question_id: number) => void;
};

export const QuestionCardSelect = ({
  question,
  selectQuestion,
  unSelectQuestion,
}: QuestionCardSelectProps) => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (question.question_id) {
      if (isChecked) {
        selectQuestion(question.question_id);
      } else {
        unSelectQuestion(question.question_id);
      }
    }
  }, [isChecked, question]);

  return (
    <div
      className="w-full flex gap-3 items-center p-3 rounded-xl bg-secondary dark:bg-dark-secondary border border-border cursor-pointer"
      onClick={() => setIsChecked((prev) => !prev)}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => setIsChecked((prev) => !prev)}
        className="cursor-pointer"
      />
      <div>Q) {question.statement}</div>
    </div>
  );
};
