import { CreateContestData } from "../../hooks/useContestList";

type Props = {
  createFunction: (contestData: CreateContestData) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
};

export const CreateContest = ({
  createFunction,
  setIsLoading,
  isLoading,
}: Props) => {
  return (
    <div>
      <form></form>
    </div>
  );
};
