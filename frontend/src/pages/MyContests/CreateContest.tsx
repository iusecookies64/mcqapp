import { useState } from "react";
import { Modal } from "../../components/modal/Modal";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Input } from "../../components/input/Input";
import { Button } from "../../components/button/Button";
import { toast } from "react-toastify";
import { Loader } from "../../components/loader/Loader";
import { DisplayError } from "../../components/display_error/DisplayError";
import Switch from "react-switch";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import { AxiosResponse } from "axios";
import { CreateContestBody } from "../../hooks/useMyContestList";
import { User } from "../../types/models";
import { Icon, IconList } from "../../components/Icon/Icon";

type CreateContestProps = {
  createContest: (
    contestData: CreateContestBody,
    onSuccess: (resonse: AxiosResponse) => void
  ) => void;
  isLoading: boolean;
  error: boolean;
};

const CreateContest = ({
  createContest,
  isLoading,
  error,
}: CreateContestProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  return (
    <div>
      <Button
        variant="secondary"
        className="flex gap-2 items-center"
        onClick={() => setIsModalOpen(true)}
      >
        <div>New</div>
        <Icon icon={IconList.plus} />
      </Button>
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        <CreateContestForm
          createFunction={createContest}
          isLoading={isLoading}
          queryError={error}
          setIsModalOpen={setIsModalOpen}
        />
      </Modal>
    </div>
  );
};

type Props = {
  createFunction: (
    contestData: CreateContestBody,
    onSuccess: (res: AxiosResponse) => void
  ) => void;
  isLoading: boolean;
  queryError: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateContestForm = ({
  createFunction,
  queryError,
  isLoading,
  setIsModalOpen,
}: Props) => {
  const userData = useRouteLoaderData("root") as User;
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    watch,
  } = useForm<CreateContestBody>({
    defaultValues: {
      created_by: userData.user_id,
      is_locked: false,
      password: "",
    },
  });

  // function to handle submit
  const onSubmit: SubmitHandler<CreateContestBody> = (data) => {
    // passing data and on success which closes modal on success
    createFunction(data, (res: AxiosResponse) => {
      toast.success("Contest Created Successfully");
      setIsModalOpen(false);
      // navigate to contest compile
      navigate(`/compile-contest?contest-id=${res.data.data.contest_id}`);
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
            min: 10,
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

export default CreateContest;
