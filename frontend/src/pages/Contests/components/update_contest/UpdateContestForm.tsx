import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { UpdateContestData } from "../../../../hooks/useContestList";
import { Input } from "../../../../components/input/Input";
import { Button } from "../../../../components/button/Button";
import { toast } from "react-toastify";
import { Loader } from "../../../../components/loader/Loader";
import { DisplayError } from "../../../../components/display_error/DisplayError";
import { Contest } from "../../../../types/models";
import { getTimeDetails } from "../../../../utils/getTimeDetails";
import Switch from "react-switch";

type FormData = {
  contest_id: number;
  title: string;
  max_participants: number;
  start_date: string;
  start_time: string;
  duration: number;
  invite_only: boolean;
};

type Props = {
  updateFunction: (
    contestData: UpdateContestData,
    onSuccess: () => void
  ) => void;
  isLoading: boolean;
  queryError: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  contestDetails: Contest;
};

export const UpdateContestForm = ({
  updateFunction,
  queryError,
  isLoading,
  setIsModalOpen,
  contestDetails,
}: Props) => {
  const timeDetails = getTimeDetails(contestDetails.start_time);
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<FormData>({
    defaultValues: {
      title: contestDetails.title,
      max_participants: contestDetails.max_participants,
      start_date: timeDetails.start_date,
      start_time: timeDetails.start_time,
      duration: contestDetails.duration,
      invite_only: contestDetails.invite_only,
    },
  });

  // function to handle submit
  const onSubmit: SubmitHandler<FormData> = (data) => {
    try {
      // combining contest start date and time
      const startDate = new Date(data.start_date);
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

      const createContestData: UpdateContestData = {
        contest_id: data.contest_id,
        title: data.title,
        max_participants: data.max_participants,
        start_time: startDate.toISOString(),
        duration: data.duration,
        invite_only: data.invite_only,
      };

      // passing data and on success which closes modal on success
      updateFunction(createContestData, () => {
        toast.success("Contest Created Successfully");
        setIsModalOpen(false);
      });
    } catch (err) {
      toast.error("Something Went Wrong, Please Try Again!");
    }
  };

  return (
    <div className="w-96 relative">
      <div className="text-lg font-medium">Update Contest Data</div>
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
        <Controller
          name="invite_only"
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium">Invite Only</div>
              <Switch onChange={onChange} checked={value} />
            </div>
          )}
        />
        {/* <Input
          inputLabel="Invite Only"
          placeholder="Yes or No"
          inputType="text"
          register={register("invite_only", { required: true })}
          error={errors.invite_only}
        /> */}
        <Button className="mt-4" type="submit">
          Update
        </Button>
      </form>
      {isLoading && <Loader />}
      {queryError && (
        <DisplayError errorMessage="Error Creating Contest, Please Try Again Later!" />
      )}
    </div>
  );
};
