import { Controller, useForm, useFieldArray } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { UpdateQuestionData } from "../../../hooks/useCompileContest";
import { Loader } from "../../../components/Loader";
import { DisplayInfo } from "../../../components/DisplayInfo";
import { Button } from "../../../components/Button";
import "./styles.css";
import { toast } from "react-toastify";
import { Textarea } from "../../../components/TextArea";
import { Icon, IconList } from "../../../components/Icon";
import { DifficultySelector } from "./CreateQuestionForm";

type UpdateQuestionFormProps = {
  questionData: UpdateQuestionData;
  updateQuestionHandler: (
    question: UpdateQuestionData,
    onSuccess: () => void
  ) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  error: boolean;
};

export const UpdateQuestionForm = ({
  questionData,
  updateQuestionHandler,
  isOpen,
  setIsOpen,
  isLoading,
  error,
}: UpdateQuestionFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateQuestionData>({
    defaultValues: {
      contest_id: questionData.contest_id,
      title: questionData.title,
      answer: questionData.answer,
      difficulty: questionData.difficulty,
      question_id: questionData.question_id,
      options: questionData.options,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });
  const onSubmit = (data: UpdateQuestionData) => {
    if (data.options.length < 2) return;
    // answer must be one of the options
    const indx = data.options.findIndex(
      (option) => option.title === data.answer
    );
    if (indx == -1) {
      toast.error("Answer must be one of the option");
    } else {
      updateQuestionHandler(data, () => {
        toast.success("Question Updated");
        setIsOpen(false);
      });
    }
  };
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="min-w-[400px]">
        <div className="text-center text-xl font-medium mb-3">
          Update Question
        </div>
        <form
          className={`flex flex-col gap-3 max-h-[500px] overflow-y-scroll px-4 ${
            (isLoading || error) && "invisible"
          }`}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Textarea
            inputLabel="Question Title"
            placeholder="eg. What is 2+2?"
            register={register("title", { required: true })}
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
                register={register(`options.${indx}.title`, {
                  required: true,
                  maxLength: 500,
                })}
                error={errors.options?.[indx]?.title}
                errorMessage="Option Cannot Be Empty"
              />
              <Button
                variant="alert"
                size="sm"
                onClick={() => remove(indx)}
                tooltip="Delete Option"
              >
                <Icon icon={IconList.trash} />
              </Button>
            </div>
          ))}
          {fields.length < 2 ? (
            <div className="text-sm text-red font-medium text-center">
              Minimum 2 Options Required
            </div>
          ) : null}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              append({
                option_id: 0,
                question_id: questionData.question_id,
                option_number: fields.length + 1,
                title: `Option ${fields.length + 1}`,
              })
            }
            className="w-min text-nowrap"
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
          <Button type="submit">Submit</Button>
        </form>
        {isLoading && <Loader />}
        {error && (
          <DisplayInfo type="error" message="Error Updating Question" />
        )}
      </div>
    </Modal>
  );
};
