import { Contest } from "../../types/models";

type Props = {
  details: Contest;
};

export const ContestItem = ({ details }: Props) => {
  return (
    <div className="flex gap-3">
      <div>{details.created_by}</div>
      <div>{details.title}</div>
      <div>{details.max_participants}</div>
      <div>{details.start_time}</div>
      <div>{details.duration}</div>
    </div>
  );
};
