import { Icon, IconList } from "../Icon/Icon";

export const DisplayError = ({ errorMessage }: { errorMessage: string }) => {
  return (
    <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center">
      <div className="flex flex-col gap-4 items-center ">
        <Icon icon={IconList.error} variant="large" />
        <div className="font-medium">{errorMessage}</div>
      </div>
    </div>
  );
};
