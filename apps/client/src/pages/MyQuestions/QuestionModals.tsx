import { Controller, useForm } from "react-hook-form";
import DisplayInfo from "../../components/DisplayInfo";
import { Loader } from "../../components/Loader";
import Input from "../../components/Input";
import DropDown from "../../components/DropDown";
import { Textarea } from "../../components/TextArea";
import TopicSelector from "../../components/TopicSelector";
import { Modal } from "../../components/Modal";
import { CreateQuestionBody, UpdateQuestionBody } from "@mcqapp/validations";
import { Question, Topic } from "@mcqapp/types";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import "./MyQuestions.style.css";
import { toast } from "react-toastify";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { selectedTopicAtom, topicsAtom } from "../../atoms/topicsAtom";

type createQuestionModalProps = {
  isLoading: boolean;
  error: boolean;
  createQuestion: (
    updatedQuestionData: CreateQuestionBody,
    onSuccess?: () => void
  ) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CreateQuestionModal = ({
  createQuestion,
  isLoading,
  isOpen,
  setIsOpen,
  error,
}: createQuestionModalProps) => {
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateQuestionBody>();
  const setGlobalSelectedTopic = useSetRecoilState(selectedTopicAtom);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const difficultyOptions = [
    { value: 1, label: "Easy" },
    { value: 2, label: "Medium" },
    { value: 3, label: "Hard" },
  ];
  const [selectedDifficulty, setDifficulty] = useState<{
    value: number;
    label: string;
  } | null>(null);

  const submitHandler = handleSubmit((data) => {
    createQuestion(data, () => {
      toast.success("Question Created!");
      setGlobalSelectedTopic(selectedTopic);
      reset();
      setIsOpen(false);
    });
  });

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} onClose={() => reset()}>
      <div className="flex flex-col min-w-[700px]">
        <div className="text-lg mb-3">Create New Question</div>
        <form className="flex flex-col gap-3" onSubmit={submitHandler}>
          <Controller
            control={control}
            name="topic_id"
            rules={{ required: "Topic Is Required" }}
            render={({ field: { onChange } }) => (
              <TopicSelector
                currentTopic={selectedTopic}
                setCurrentTopic={(topic) => {
                  setSelectedTopic(topic);
                  onChange(topic.topic_id);
                }}
                error={errors.topic_id?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="statement"
            rules={{ required: "Statement cannot be empty" }}
            render={({ field: { onChange, value } }) => (
              <Textarea
                value={value}
                onChange={onChange}
                inputLabel="Question"
                placeholder="What is 2 + 2?"
                error={errors.statement}
                errorMessage={errors.statement?.message}
              />
            )}
          />
          <div className="grid grid-cols-2 gap-3">
            <Controller
              control={control}
              name="option1"
              rules={{ required: "Option Is Required" }}
              render={({ field: { onChange, value } }) => (
                <Textarea
                  inputLabel="Option A"
                  placeholder="Enter Option A"
                  value={value}
                  onChange={onChange}
                  error={errors.option1}
                  errorMessage={errors.option1?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="option2"
              rules={{ required: "Option Is Required" }}
              render={({ field: { onChange, value } }) => (
                <Textarea
                  inputLabel="Option B"
                  placeholder="Enter Option B"
                  value={value}
                  onChange={onChange}
                  error={errors.option1}
                  errorMessage={errors.option2?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="option3"
              rules={{ required: "Option Is Required" }}
              render={({ field: { onChange, value } }) => (
                <Textarea
                  inputLabel="Option C"
                  placeholder="Enter Option C"
                  value={value}
                  onChange={onChange}
                  error={errors.option1}
                  errorMessage={errors.option3?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="option4"
              rules={{ required: "Option Is Required" }}
              render={({ field: { onChange, value } }) => (
                <Textarea
                  inputLabel="Option D"
                  placeholder="Enter Option D"
                  value={value}
                  onChange={onChange}
                  error={errors.option1}
                  errorMessage={errors.option4?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="difficulty"
              rules={{ required: "Select A Difficulty" }}
              render={({ field: { onChange } }) => (
                <div className="flex flex-col gap-1">
                  <div className="text-sm text-text-secondary dark:text-dark-text-secondary">
                    Difficulty
                  </div>
                  <DropDown
                    value={selectedDifficulty}
                    options={difficultyOptions}
                    idKey={"value"}
                    labelKey={"label"}
                    placeholder="Select Difficulty"
                    onChange={(value) => {
                      setDifficulty(value);
                      onChange(value.value);
                    }}
                    error={errors.difficulty?.message}
                  />
                </div>
              )}
            />
            <Input
              inputLabel="Time Limit"
              inputType="number"
              placeholder="30s"
              register={register("time_limit", {
                required: "Time limit ranges from 10s to 120s",
                valueAsNumber: true,
                min: 10,
                max: 120,
              })}
              error={errors.time_limit}
              errorMessage={errors.time_limit?.message}
              className="p-2"
            />
          </div>
          <Controller
            control={control}
            name="answer"
            rules={{ required: "Answer is required" }}
            render={({ field: { value, onChange } }) => (
              <div className="flex flex-col gap-1">
                <div className="text-sm text-text-secondary dark:text-dark-text-secondary">
                  Answer
                </div>
                <div className="flex gap-3">
                  <div
                    className={`option-button ${
                      value === 1 && "correct-answer"
                    }`}
                    onClick={() => onChange(1)}
                  >
                    A
                  </div>
                  <div
                    className={`option-button ${
                      value === 2 && "correct-answer"
                    }`}
                    onClick={() => onChange(2)}
                  >
                    B
                  </div>
                  <div
                    className={`option-button ${
                      value === 3 && "correct-answer"
                    }`}
                    onClick={() => onChange(3)}
                  >
                    C
                  </div>
                  <div
                    className={`option-button ${
                      value === 4 && "correct-answer"
                    }`}
                    onClick={() => onChange(4)}
                  >
                    D
                  </div>
                </div>
              </div>
            )}
          />
          <div className="flex justify-end gap-3 mt-3">
            <Button
              type="button"
              variant="tertiary"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="relative">
              {isLoading && <Loader height={25} width={25} strokeWidth={5} />}
              <div className={isLoading ? "invisible" : ""}>Create</div>
            </Button>
          </div>
        </form>
        {error && (
          <DisplayInfo
            type="error"
            message="Error Creating Question, Try Again"
          />
        )}
      </div>
    </Modal>
  );
};

type UpdateQuestionProps = {
  question: Question | undefined;
  isLoading: boolean;
  error: boolean;
  updateQuestion: (
    updatedQuestionData: UpdateQuestionBody,
    onSuccess?: () => void
  ) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UpdateQuestionModal = ({
  question,
  isLoading,
  error,
  updateQuestion,
  isOpen,
  setIsOpen,
}: UpdateQuestionProps) => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Question>({
    values: question,
  });
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const topics = useRecoilValue(topicsAtom);
  const difficultyOptions = [
    { value: 1, label: "Easy" },
    { value: 2, label: "Medium" },
    { value: 3, label: "Hard" },
  ];
  const [selectedDifficulty, setDifficulty] = useState<{
    value: number;
    label: string;
  }>(difficultyOptions[0]);

  useEffect(() => {
    if (question) {
      const topic = topics?.find((t) => t.topic_id === question.topic_id);
      if (topic) {
        setSelectedTopic(topic);
      }
    }
  }, [question, topics]);

  useEffect(() => {
    if (question) {
      setDifficulty(difficultyOptions[question.difficulty - 1]);
    }
  }, [question]);

  const submitHandler = handleSubmit((data) => {
    if (!selectedTopic?.topic_id) return;
    if (!data.answer) return;
    if (!question || !question.question_id) return;
    updateQuestion(
      {
        topic_id: selectedTopic.topic_id,
        question_id: question.question_id,
        statement: data.statement,
        option1: data.option1,
        option2: data.option2,
        option3: data.option3,
        option4: data.option4,
        answer: data.answer,
        time_limit: data.time_limit,
        difficulty: data.difficulty,
      },
      () => {
        toast.success("Question Updated!");
        setIsOpen(false);
      }
    );
  });

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="flex flex-col min-w-[700px]">
        <div className="text-lg mb-3">Update Question</div>
        <form className="flex flex-col gap-3" onSubmit={submitHandler}>
          <Controller
            control={control}
            name="topic_id"
            rules={{ required: "Topic Is Required" }}
            render={({ field: { onChange } }) => (
              <TopicSelector
                currentTopic={selectedTopic}
                setCurrentTopic={(topic) => {
                  setSelectedTopic(topic);
                  onChange(topic.topic_id);
                }}
                error={errors.topic_id?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="statement"
            rules={{ required: "Statement cannot be empty" }}
            render={({ field: { onChange, value } }) => (
              <Textarea
                value={value}
                onChange={onChange}
                inputLabel="Question"
                placeholder="What is 2 + 2?"
                error={errors.statement}
                errorMessage={errors.statement?.message}
              />
            )}
          />
          <div className="grid grid-cols-2 gap-3">
            <Controller
              control={control}
              name="option1"
              rules={{ required: "Option Is Required" }}
              render={({ field: { onChange, value } }) => (
                <Textarea
                  inputLabel="Option A"
                  placeholder="Enter Option A"
                  value={value}
                  onChange={onChange}
                  error={errors.option1}
                  errorMessage={errors.option1?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="option2"
              rules={{ required: "Option Is Required" }}
              render={({ field: { onChange, value } }) => (
                <Textarea
                  inputLabel="Option B"
                  placeholder="Enter Option B"
                  value={value}
                  onChange={onChange}
                  error={errors.option2}
                  errorMessage={errors.option2?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="option3"
              rules={{ required: "Option Is Required" }}
              render={({ field: { onChange, value } }) => (
                <Textarea
                  inputLabel="Option C"
                  placeholder="Enter Option C"
                  value={value}
                  onChange={onChange}
                  error={errors.option3}
                  errorMessage={errors.option3?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="option4"
              rules={{ required: "Option Is Required" }}
              render={({ field: { onChange, value } }) => (
                <Textarea
                  inputLabel="Option D"
                  placeholder="Enter Option D"
                  value={value}
                  onChange={onChange}
                  error={errors.option4}
                  errorMessage={errors.option4?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="difficulty"
              rules={{ required: "Select A Difficulty" }}
              render={({ field: { onChange } }) => (
                <div className="flex flex-col gap-1">
                  <div className="text-sm text-text-secondary dark:text-dark-text-secondary">
                    Difficulty
                  </div>
                  <DropDown
                    value={selectedDifficulty}
                    options={difficultyOptions}
                    idKey={"value"}
                    labelKey={"label"}
                    placeholder="Select Difficulty"
                    onChange={(value) => {
                      setDifficulty(value);
                      onChange(value.value);
                    }}
                    error={errors.difficulty?.message}
                  />
                </div>
              )}
            />
            <Input
              inputLabel="Time Limit"
              inputType="number"
              placeholder="30s"
              register={register("time_limit", {
                required: "Time limit ranges from 10s to 120s",
                valueAsNumber: true,
                min: 10,
                max: 120,
              })}
              error={errors.time_limit}
              errorMessage={errors.time_limit?.message}
              className="p-2"
            />
          </div>
          <Controller
            control={control}
            name="answer"
            rules={{ required: "Answer is required" }}
            render={({ field: { value, onChange } }) => (
              <div className="flex flex-col gap-1">
                <div className="text-sm text-text-secondary dark:text-dark-text-secondary">
                  Answer
                </div>
                <div className="flex gap-3">
                  <div
                    className={`option-button ${
                      value === 1 && "correct-answer"
                    }`}
                    onClick={() => onChange(1)}
                  >
                    A
                  </div>
                  <div
                    className={`option-button ${
                      value === 2 && "correct-answer"
                    }`}
                    onClick={() => onChange(2)}
                  >
                    B
                  </div>
                  <div
                    className={`option-button ${
                      value === 3 && "correct-answer"
                    }`}
                    onClick={() => onChange(3)}
                  >
                    C
                  </div>
                  <div
                    className={`option-button ${
                      value === 4 && "correct-answer"
                    }`}
                    onClick={() => onChange(4)}
                  >
                    D
                  </div>
                </div>
              </div>
            )}
          />
          <div className="flex justify-end gap-3 mt-3">
            <Button
              type="button"
              variant="tertiary"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="relative">
              {isLoading && <Loader height={25} width={25} strokeWidth={5} />}
              <div className={isLoading ? "invisible" : ""}>Update</div>
            </Button>
          </div>
        </form>
        {error && (
          <DisplayInfo
            type="error"
            message="Error Creating Question, Try Again"
          />
        )}
      </div>
    </Modal>
  );
};
