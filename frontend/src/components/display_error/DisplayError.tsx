import { Icon, IconList } from "../Icon/Icon";

export const DisplayError = ({ errorMessage }: { errorMessage: string }) => {
  return (
    <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center">
      <div className="flex flex-col gap-4 items-center ">
        <div className="h-24 w-24 flex justify-center items-center rounded-[50%] bg-red text-5xl">
          <Icon icon={IconList.error} />
        </div>
        <div className="font-medium">{errorMessage}</div>
      </div>
    </div>
  );
};
