import { Oval } from "react-loader-spinner";

type Props = {
  height?: number;
  width?: number;
  color?: string;
  secondaryColor?: string;
};

export const Loader = ({
  height = 80,
  width = 80,
  color = "#6200EE",
  secondaryColor = "black",
}: Props) => {
  return (
    <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center">
      <Oval
        height={height}
        width={width}
        visible={true}
        color={color}
        secondaryColor={secondaryColor}
      />
    </div>
  );
};
