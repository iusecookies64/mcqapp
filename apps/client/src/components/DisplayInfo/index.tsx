import { Icon, IconList } from "../Icon";

type Props = {
  message: string;
  type: "error" | "info";
};

const DisplayInfo = ({ message, type }: Props) => {
  return (
    <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center">
      <div className="flex flex-col gap-4 items-center ">
        {type === "error" && (
          <div className="h-24 w-24 flex justify-center items-center rounded-[50%] bg-red-600 text-5xl">
            <Icon icon={IconList.error} />
          </div>
        )}
        {type === "info" && (
          <div className="h-24 w-24 flex justify-center items-center rounded-[50%] bg-sky-600 text-5xl">
            <Icon icon={IconList.info} />
          </div>
        )}
        <div className="font-medium">{message}</div>
      </div>
    </div>
  );
};

export default DisplayInfo;
