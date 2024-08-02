import { useRecoilState } from "recoil";
import { selectedTopicAtom } from "../../atoms/topicsAtom";
import TopicSelector from "../../components/TopicSelector";
import { useMyQuestions } from "../../hooks/useMyQuestions";
import { useTopics } from "../../hooks/useTopics";
import "./CreateCustomGame.style.css";
import { useEffect, useState } from "react";
import { Question } from "@mcqapp/types";
export const CreateCustomGame = () => {
  const [selectedTopic, setSelectedTopic] = useRecoilState(selectedTopicAtom);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const { myQuestions } = useMyQuestions();

  useEffect(() => {
    if (myQuestions) {
      setFilteredQuestions(
        myQuestions.filter((q) => q.topic_id === selectedTopic?.topic_id)
      );
    }
  }, [myQuestions, selectedTopic]);

  return (
    <div className="create-custom-game-container">
      <div>
        <TopicSelector
          currentTopic={selectedTopic}
          setCurrentTopic={setSelectedTopic}
        />
      </div>
      <div>
        <div>Choose Questions For Game</div>
        <div></div>
      </div>
    </div>
  );
};
