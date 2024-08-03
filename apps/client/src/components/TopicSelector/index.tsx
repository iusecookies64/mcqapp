import { useTopics } from "../../hooks/useTopics";
import DropDown from "../DropDown";
import { Topic } from "@mcqapp/types";
import "./style.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";

type Props = {
  currentTopic: Topic | null;
  setCurrentTopic: (value: Topic) => void;
  error?: string;
};

const TopicSelector = ({ currentTopic, setCurrentTopic, error }: Props) => {
  const { topics } = useTopics();
  const [userTopics, setUserTopics] = useState<Topic[]>([]);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (topics) {
      setUserTopics(topics.filter((t) => t.created_by === user?.user_id));
    }
  }, [user, topics]);

  return (
    <DropDown
      label="Topic"
      placeholder="Select A Topic"
      value={currentTopic}
      labelKey={"title"}
      idKey={"topic_id"}
      options={userTopics}
      onChange={setCurrentTopic}
      error={error}
    />
  );
};

export default TopicSelector;
