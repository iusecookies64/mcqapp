import {
  UpdateContestBody,
  useMyContestList,
} from "../../../hooks/useMyContestList";
import { Modal } from "../../../components/Modal";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Input } from "../../../components/Input";
import { Button } from "@mcqapp/ui";
import { toast } from "react-toastify";
import { Loader } from "../../../components/Loader";
import { DisplayInfo } from "../../../components/DisplayInfo";
import Switch from "react-switch";

type UpdateContestModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  contest_id: number;
};

export const UpdateContestModal = ({
  isOpen,
  setIsOpen,
  contest_id,
}: UpdateContestModalProps) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <UpdateContestForm contest_id={contest_id} setIsModalOpen={setIsOpen} />
    </Modal>
  );
};

type Props = {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  contest_id: number;
};

const UpdateContestForm = ({ contest_id, setIsModalOpen }: Props) => {
  const { updateContest, isLoadingCud, errorCud, myContests } =
    useMyContestList(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    watch,
  } = useForm<UpdateContestBody>({
    defaultValues: myContests.find((c) => c.contest_id === contest_id),
  });

  // function to handle submit
  const onSubmit: SubmitHandler<UpdateContestBody> = (data) => {
    // passing data and on success which closes modal on success
    updateContest(data, () => {
      toast.success("Contest Updated Successfully");
      setIsModalOpen(false);
    });
  };
  return (
    <div className="w-96 relative">
      <div className="text-2xl font-semibold text-center mb-3">
        Update Contest
      </div>
      <form
        className={`flex flex-col gap-5 w-full ${
          (isLoadingCud || errorCud) && "invisible"
        }`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          inputLabel="Title"
          placeholder="My First Contest"
          inputType="text"
          register={register("title", { required: true })}
          error={errors.title}
          errorMessage="Title is required"
        />
        <Input
          inputLabel="Maximum Number Of Participants"
          placeholder="eg. 10"
          inputType="number"
          register={register("max_participants", {
            required: true,
            min: 5,
            max: 100,
            valueAsNumber: true,
          })}
          error={errors.max_participants}
          errorMessage="Number of Participants must >= 5 and <= 100"
        />
        <Input
          inputLabel="Duration In Minutes"
          placeholder="eg. 30"
          inputType="number"
          register={register("duration", {
            required: true,
            min: 1,
            max: 60,
            valueAsNumber: true,
          })}
          error={errors.duration}
          errorMessage="Minimum duration is 10 minutes and Maximum is 60 minutes"
        />
        <Controller
          name="is_locked"
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium">Is Locked</div>
              <Switch onChange={onChange} checked={value} />
            </div>
          )}
        />
        {watch("is_locked") && (
          <Input
            inputLabel="Room Password"
            inputType="text"
            placeholder="eg. 123456"
            register={register("password", { required: true })}
          />
        )}
        <Button variant="secondary" className="mt-4" type="submit">
          Update
        </Button>
      </form>
      {isLoadingCud && <Loader />}
      {errorCud && (
        <DisplayInfo
          type="error"
          message="Error Creating Contest, Please Try Again Later!"
        />
      )}
    </div>
  );
};
