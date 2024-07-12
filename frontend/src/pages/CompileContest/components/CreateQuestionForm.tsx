import { Controller, useForm, useFieldArray } from "react-hook-form";
import { Modal } from "../../../components/Modal/Modal";
import { CreateQuestionData } from "../../../hooks/useCompileContest";
import { Loader } from "../../../components/Loader/Loader";
import { DisplayError } from "../../../components/DisplayInfo/DisplayInfo";
import { Button } from "../../../components/Button/Button";
import "./styles.css";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Textarea } from "../../../components/TextArea/Textarea";
import { Icon, IconList } from "../../../components/Icon/Icon";

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
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateQuestionData>({
    defaultValues: {
      contest_id: contest_id,
      title: "",
      difficulty: 1,
      options: ["Option 1", "Option 2"],
      answer: "",
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });
  const onSubmit = (data: CreateQuestionData) => {
    if (data.options.length < 2) {
      return;
    }
    // answer must be one of the options
    const indx = data.options.findIndex((option) => option === data.answer);
    if (indx == -1) {
      toast.error("Answer must be one of the option");
    } else {
      createQuestionHandler(data, () => {
        // on success we reset the form fields
        reset();
        toast.success("Question Created");
        setIsOpen(false);
      });
    }
  };
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="min-w-[400px]">
        <div className="text-center text-xl font-medium mb-3">Add Question</div>
        <form
          className={`flex flex-col gap-3 max-h-[500px] overflow-y-scroll px-4 ${
            (isLoading || error) && "invisible"
          }`}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Textarea
            inputLabel="Question Title"
            placeholder="eg. What is 2+2?"
            register={register("title", { required: true, maxLength: 500 })}
            error={errors.title}
            errorMessage="Question Title is Required"
          />
          {fields.map((field, indx) => (
            <div
              className="w-full flex gap-4 justify-between items-end"
              key={field.id}
            >
              <Textarea
                inputLabel={`Option ${indx + 1}`}
                placeholder="eg. 4"
                defaultValue=""
                register={register(`options.${indx}`, {
                  required: true,
                  maxLength: 500,
                })}
                error={errors.options?.[indx]}
                errorMessage="Option Cannot Be Empty"
              />
              <Icon
                onClick={() => remove(indx)}
                icon={IconList.trash}
                variant="xsmall"
                className="flex-shrink-0"
                toolTip="Delete Option"
              />
            </div>
          ))}
          {fields.length < 2 ? (
            <div className="text-sm text-red-600 font-medium text-center">
              Minimum 2 Options Required
            </div>
          ) : null}
          <Button
            type="button"
            onClick={() => append(`Option ${fields.length + 1}`)}
            className="bg-transparent bg-slate-400 px-2 py-1 w-24 text-sm"
          >
            Add Option
          </Button>
          <Textarea
            inputLabel="Answer"
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
          <Button variant="secondary" type="submit">
            Submit
          </Button>
        </form>
        {isLoading && <Loader />}
        {error && <DisplayError errorMessage="Error Creating Question" />}
      </div>
    </Modal>
  );
};

export const DifficultySelector = ({
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
