import { useForm, SubmitHandler } from "react-hook-form";
import { CreateContestData } from "../../hooks/useContestList";
import { Input } from "../input/Input";
import { Button } from "../button/Button";
import { useRecoilValue } from "recoil";
import { userDataAtom } from "../../atoms/userAtom";
import { toast } from "react-toastify";
import { Loader } from "../loader/Loader";
import { DisplayError } from "../display_error/DisplayError";

type Props = {
  createFunction: (
    contestData: CreateContestData,
    onSuccess: () => void
  ) => void;
  isLoading: boolean;
  queryError: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type FormData = {
  created_by: number;
  title: string;
  max_participants: number;
  start_date: Date;
  start_time: string;
  duration: number;
  invite_only: boolean;
};

export const CreateContestForm = ({
  createFunction,
  queryError,
  isLoading,
  setIsModalOpen,
}: Props) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>();
  const userData = useRecoilValue(userDataAtom);

  // function to handle submit
  const onSubmit: SubmitHandler<FormData> = (data) => {
    // combining contest start date and time
    const startDate = data.start_date;
    const time = data.start_time.split(":").map((item) => parseInt(item));
    startDate.setHours(time[0]);
    startDate.setMinutes(time[1]);

    // checking if current date and time is atleast after 1 minutes in future
    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + 1);

    if (startDate < currentDate) {
      toast.error(
        "Start Date And Time must be atleast 1 minute after current time"
      );
      return;
    }

    const createContestData: CreateContestData = {
      created_by: userData.user_id,
      title: data.title,
      max_participants: data.max_participants,
      start_time: startDate.toISOString(),
      duration: data.duration,
      invite_only: data.invite_only,
    };

    // passing data and on success which closes modal on success
    createFunction(createContestData, () => {
      toast.success("Contest Created Successfully");
      setIsModalOpen(false);
    });
  };
  return (
    <div className="w-96 relative">
      <form
        className={`flex flex-col gap-5 w-full ${
          (isLoading || queryError) && "invisible"
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
            max: 20,
            valueAsNumber: true,
          })}
          error={errors.max_participants}
          errorMessage="Number of Participants must >= 5 and <= 20"
        />
        <div className="flex gap-2 justify-between">
          <Input
            inputType="date"
            inputLabel="Start Date"
            className="none"
            register={register("start_date", {
              required: true,
              valueAsDate: true,
            })}
          />
          <Input
            inputLabel="Start Time"
            inputType="time"
            register={register("start_time", { required: true })}
          />
        </div>
        <Input
          inputLabel="Duration In Minutes"
          placeholder="eg. 30"
          inputType="number"
          register={register("duration", {
            required: true,
            min: 10,
            max: 60,
            valueAsNumber: true,
          })}
          error={errors.duration}
          errorMessage="Minimum duration is 10 minutes and Maximum is 60 minutes"
        />
        <Input
          inputLabel="Invite Only"
          placeholder="Yes or No"
          inputType="text"
          register={register("invite_only", { required: true })}
          error={errors.invite_only}
        />
        <Button className="mt-4" type="submit">
          Create
        </Button>
      </form>
      {isLoading && <Loader />}
      {queryError && (
        <DisplayError errorMessage="Error Creating Contest, Please Try Again Later!" />
      )}
    </div>
  );
};
