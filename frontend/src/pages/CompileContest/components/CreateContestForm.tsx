import { Controller, useForm } from "react-hook-form";
import { Input } from "../../../components/input/Input";
import { Modal } from "../../../components/modal/Modal";
import { CreateQuestionData } from "../../../hooks/useCompileContest";
import { Loader } from "../../../components/loader/Loader";
import { DisplayError } from "../../../components/display_error/DisplayError";
import { Button } from "../../../components/button/Button";
import { useState } from "react";
import "./styles.css";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";

type CreateQuestionFormProps = {
  contest_id: number;
  createQuestionHandler: (
    question: CreateQuestionData,
    onSuccess: (response: AxiosResponse) => void
  ) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  error: boolean;
};

export const CreateQuestionForm = ({
  contest_id,
  createQuestionHandler,
  isOpen,
  setIsOpen,
  isLoading,
  error,
}: CreateQuestionFormProps) => {
  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateQuestionData>({
    defaultValues: {
      contest_id: contest_id,
      title: "",
      difficulty: 1,
      options: [],
      answer: "",
    },
  });
  const [options, setOptions] = useState<string[]>([]);
  const onSubmit = (data: CreateQuestionData) => {
    // answer must be one of the options
    const indx = data.options.findIndex((option) => option === data.answer);
    if (indx == -1) {
      toast.error("Answer one of the option");
    } else {
      createQuestionHandler(data, () => {
        toast.success("Question Created");
        setIsOpen(false);
      });
    }
  };
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="">
        <div className="text-center text-xl font-medium mb-3">Add Question</div>
        <form
          className={`flex flex-col gap-3 max-h-[500px] overflow-y-scroll px-4 ${
            (isLoading || error) && "invisible"
          }`}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            inputLabel="Question Title"
            inputType="text"
            placeholder="eg. What is 2+2?"
            register={register("title", { required: true })}
            error={errors.title}
            errorMessage="Question Title is Required"
          />
          <div className="text-sm font-medium">Options</div>
          {options.map((option, indx) => (
            <Input
              key={indx}
              inputLabel={`Option ${indx + 1}`}
              inputType="text"
              value={option}
              onChange={(e) => {
                const newOptionValue = e.target.value;
                setOptions((prevOptions) => {
                  prevOptions[indx] = newOptionValue;
                  setValue("options", prevOptions);
                  return [...prevOptions];
                });
              }}
            />
          ))}
          {options.length === 0 && (
            <div className="text-center text-sm">No Options Added</div>
          )}
          <Button
            onClick={() => {
              setOptions((prevOptions) => [...prevOptions, ""]);
            }}
            className="bg-transparent bg-slate-400 px-2 py-1 w-24 text-sm"
          >
            Add Option
          </Button>
          <Input
            inputLabel="Answer"
            inputType="text"
            placeholder="eg. 4"
            register={register("answer", { required: true })}
            error={errors.title}
            errorMessage="Answer is required"
          />
          <Controller
            name="difficulty"
            control={control}
            render={({ field: { onChange, value } }) => (
              <DifficultySelector onChange={onChange} value={value} />
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
        {isLoading && <Loader />}
        {error && <DisplayError errorMessage="Error Creating Question" />}
      </div>
    </Modal>
  );
};

const DifficultySelector = ({
  onChange,
  value,
}: {
  onChange: (selected: number) => void;
  value: number;
}) => {
  return (
    <div className="difficulty-selector">
      <div className="text-sm font-medium">Difficulty</div>
      <div className="flex justify-around">
        <div
          className={`difficulty-tab difficulty-tab-1 ${
            value === 1 && "selected-1"
          }`}
          onClick={() => onChange(1)}
        >
          Easy
        </div>
        <div
          className={`difficulty-tab difficulty-tab-2 ${
            value === 2 && "selected-2"
          }`}
          onClick={() => onChange(2)}
        >
          Medium
        </div>
        <div
          className={`difficulty-tab difficulty-tab-3 ${
            value === 3 && "selected-3"
          }`}
          onClick={() => onChange(3)}
        >
          Hard
        </div>
      </div>
    </div>
  );
};
