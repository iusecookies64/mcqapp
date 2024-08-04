import { useRecoilState } from "recoil";
import { selectedTopicAtom } from "../../atoms/topicsAtom";
import TopicSelector from "../../components/TopicSelector";
import { useMyQuestions } from "../../hooks/useMyQuestions";
import "./CreateCustomGame.style.css";
import { useEffect, useState } from "react";
import {
  CustomGameCreatedResponse,
  Question,
  SocketMessage,
} from "@mcqapp/types";
import { QuestionCardSelect } from "../../components/QuestionCard";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import DisplayInfo from "../../components/DisplayInfo";
import WebSocketManager, { SocketMessageType } from "../../services/websocket";
import { InitCustomGameBody } from "@mcqapp/validations";

export const CreateCustomGame = () => {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useRecoilState(selectedTopicAtom);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const { myQuestions } = useMyQuestions();
  const [selectedQuestionsIds, setSelectedQuestionIds] = useState<number[]>([]);

  const selectQuestion = (question_id: number) => {
    setSelectedQuestionIds((prev) => [...prev, question_id]);
  };
  const unSelectQuestion = (question_id: number) => {
    setSelectedQuestionIds((prev) => prev.filter((id) => id !== question_id));
  };

  const createGameHandler = () => {
    if (selectedTopic?.topic_id && myQuestions && selectedQuestionsIds.length) {
      const selectedQuestions = myQuestions.filter(
        (q) =>
          q.question_id &&
          selectedQuestionsIds.find((id) => id === q.question_id)
      );

      const payload: InitCustomGameBody = {
        topic_id: selectedTopic.topic_id,
        questions: selectedQuestions,
      };
      console.log("payload is ", payload);
      WebSocketManager.getInstance().sendMessage(
        JSON.stringify({
          type: SocketMessageType.INIT_CUSTOM_GAME,
          payload,
        })
      );
    } else {
      console.log("not sending request");
    }
  };

  useEffect(() => {
    const id = "handlerCustomGameCreated";
    WebSocketManager.getInstance().addHandler({
      id,
      handler: (event) => {
        const data = JSON.parse(event.data) as SocketMessage;
        console.log(data);
        if (data.type === SocketMessageType.CUSTOM_GAME_CREATED) {
          const payload = data.payload as CustomGameCreatedResponse;
          navigate(`/game?gameid=${payload.game_id}`);
        }
      },
    });

    return () => WebSocketManager.getInstance().removeHandler(id);
  }, [navigate]);

  useEffect(() => {
    if (myQuestions) {
      setFilteredQuestions(
        myQuestions.filter((q) => q.topic_id === selectedTopic?.topic_id)
      );
    }
  }, [myQuestions, selectedTopic]);

  return (
    <div className="create-custom-game-container">
      <div className="w-full max-w-96">
        <TopicSelector
          currentTopic={selectedTopic}
          setCurrentTopic={setSelectedTopic}
        />
      </div>
      <div className="w-full flex flex-col gap-3">
        <div className="w-full flex justify-between items-center">
          <div className="text-lg font-medium p-3">
            Choose Questions For Game
          </div>
          <div className="flex gap-3 justify-end p-3">
            <Button variant="tertiary" onClick={() => navigate("/")}>
              Go Back
            </Button>
            <Button onClick={createGameHandler}>Create Game</Button>
          </div>
        </div>
        <div className="w-full h-full min-h-96 relative flex flex-col gap-3">
          {filteredQuestions.map((question) => (
            <QuestionCardSelect
              key={question.question_id}
              question={question}
              selectQuestion={selectQuestion}
              unSelectQuestion={unSelectQuestion}
            />
          ))}
          {filteredQuestions.length === 0 && (
            <DisplayInfo type="info" message="No Questions Added" />
          )}
        </div>
      </div>
    </div>
  );
};
