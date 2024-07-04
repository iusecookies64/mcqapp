import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { CreateContestData } from "../../hooks/useContestList";
import { Input } from "../input/Input";
import { Button } from "../button/Button";
import { useRecoilValue } from "recoil";
import { userDataAtom } from "../../atoms/userAtom";
import { toast } from "react-toastify";
import { Loader } from "../loader/Loader";
import { DisplayError } from "../display_error/DisplayError";
import Switch from "react-switch";
import { useNavigate } from "react-router-dom";
import { AxiosResponse } from "axios";

type Props = {
  createFunction: (
    contestData: CreateContestData,
    onSuccess: (res: AxiosResponse) => void
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
  const userData = useRecoilValue(userDataAtom);
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<FormData>({ defaultValues: { created_by: userData.user_id } });

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
      created_by: data.created_by,
      title: data.title,
      max_participants: data.max_participants,
      start_time: startDate.toISOString(),
      duration: data.duration,
      invite_only: data.invite_only,
    };

    // passing data and on success which closes modal on success
    createFunction(createContestData, (res: AxiosResponse) => {
      toast.success("Contest Created Successfully");
      setIsModalOpen(false);
      // navigate to contest compile
      navigate(`/compile-contest?contest-id=${res.data.contest_id}`);
    });
  };
  return (
    <div className="w-96 relative">
      <div className="text-2xl font-semibold text-center mb-3">
        Create Contest
      </div>
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
