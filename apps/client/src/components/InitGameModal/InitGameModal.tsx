import { Topic } from "@mcqapp/types";
import { useEffect, useState } from "react";
import { useTopics } from "../../hooks/useTopics";
import { useNavigate } from "react-router-dom";
import { Modal } from "../Modal";
import Button from "../Button";
import DropDown from "../DropDown";

type InitGameModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  createGame: (topic: Topic, is_random: boolean) => void;
  is_random_game: boolean | null;
};

export const InitGameModal = ({
  isOpen,
  setIsOpen,
  createGame,
  is_random_game,
}: InitGameModalProps) => {
  const modes = [
    { value: 1, label: "Play Vs Random" },
    { value: 2, label: "Play Vs Friends" },
  ];
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [adminTopics, setAdminTopics] = useState<Topic[]>([]);
  const [selectedMode, setSelectedMode] = useState<(typeof modes)[0]>(
    is_random_game ? modes[0] : modes[1]
  );
  const [selectTopicError, setSelectTopicError] = useState<string>("");
  const { topics } = useTopics();
  const navigate = useNavigate();

  useEffect(() => {
    if (topics) {
      setAdminTopics(topics.filter((t) => t.created_by === 1));
    }
  }, [topics]);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} isClosable={false}>
      <div className="topic-selector-modal">
        <div className="text-lg">Select A Topic</div>
        <div className="topics-list-container">
          {adminTopics &&
            adminTopics.map((topic) => (
              <div
                key={topic.topic_id}
                onClick={() => {
                  setSelectedTopic(topic);
                  setSelectTopicError("");
                }}
                className={
                  selectedTopic?.topic_id === topic.topic_id
                    ? "selected-topic"
                    : ""
                }
              >
                {topic.title}
              </div>
            ))}
        </div>
        {selectTopicError && (
          <div className="text-sm text-red-400 dark:text-red-600">
            {selectTopicError}
          </div>
        )}
        <DropDown
          value={selectedMode}
          options={modes}
          labelKey={"label"}
          idKey={"value"}
          onChange={setSelectedMode}
          placeholder="Selece A Mode"
        />
        <div className="w-full flex justify-end gap-3">
          <Button variant="tertiary" onClick={() => navigate("/")}>
            Go Back
          </Button>
          <Button
            onClick={() => {
              if (selectedTopic) {
                createGame(
                  selectedTopic,
                  selectedMode.value === modes[0].value
                );
              } else {
                setSelectTopicError("Select A Topic First");
              }
            }}
          >
            Play
          </Button>
        </div>
      </div>
    </Modal>
  );
};
