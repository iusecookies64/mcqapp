import { useTopics } from "../../hooks/useTopics";
import DropDown from "../DropDown";
import { Topic } from "@mcqapp/types";
import "./style.css";

type Props = {
  currentTopic: Topic | null;
  setCurrentTopic: (value: Topic) => void;
  error?: string;
};

const TopicSelector = ({ currentTopic, setCurrentTopic, error }: Props) => {
  const { topics } = useTopics();
  return (
    <DropDown
      label="Topic"
      placeholder="Select A Topic"
      value={currentTopic}
      labelKey={"title"}
      idKey={"topic_id"}
      options={topics || []}
      onChange={setCurrentTopic}
      error={error}
    />
  );
};

export default TopicSelector;
