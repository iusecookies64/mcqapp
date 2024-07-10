import { useSearchParams } from "react-router-dom";
import "./Lobby.style.css";
import { CountdownState, useLobby } from "../../hooks/useLobby";
import { useEffect, useState } from "react";
import { Button } from "../../components/button/Button";
import { toast } from "react-toastify";
import { Loader } from "../../components/loader/Loader";
import { Modal } from "../../components/modal/Modal";
import { Input } from "../../components/input/Input";
import { DisplayError } from "../../components/display_error/DisplayError";
import AnimatedCountdown from "../../components/animate_countdown/AnimatedCountdown";
import Countdown from "react-countdown";
import { Icon, IconList } from "../../components/Icon/Icon";

export const Lobby = () => {
  const [searchParams] = useSearchParams();
  const [questionNumber, setQuestionNumber] = useState(0);
  const {
    contestData,
    isHost,
    questions,
    response,
    leaderboard,
    error,
    isLoading,
    isLocked,
    countdownState,
    joined,
    joinRoom,
    setCountdownState,
    submitResponse,
    startGame,
  } = useLobby(parseInt(searchParams.get("contest-id") || ""));

  const [isPasswordModalOpen, setIsPasswordModalOpen] =
    useState<boolean>(false);
  const [password, setPassword] = useState("");

  const [completedModal, setCompletedModal] = useState(false);

  useEffect(() => {
    if (!isLocked || joined) {
      setIsPasswordModalOpen(false);
    } else if (isLocked && !joined) {
      setIsPasswordModalOpen(true);
    }
  }, [joined, isLocked]);

  return (
    <div className="lobby-container">
      <div className="w-full h-full flex flex-col p-6">
        {joined && contestData && (
          <div className="flex justify-between items-center">
            <div className="flex gap-6">
              <div>Title: {contestData?.title}</div>
              <div>Host:{contestData?.created_by_username}</div>
              <div>Max Participants: {contestData?.max_participants}</div>
              <div>Duration: {contestData?.duration}min</div>
            </div>
            {countdownState === CountdownState.ended && !isHost && (
              <div>
                Time Remaining:{" "}
                <Countdown
                  date={Date.now() + contestData.duration * 60 * 1000}
                  onComplete={() => setCompletedModal(true)}
                />
              </div>
            )}
          </div>
        )}
        {joined &&
          !isHost &&
          countdownState === CountdownState.ended &&
          questions.length && (
            <div className="questions-container">
              <div className="flex flex-col p-8 rounded-lg gap-6 bg-gray-light dark:bg-gray-dark w-full">
                <div className="text-xl font-medium">
                  Question {questionNumber + 1}
                </div>
                <div>Q. {questions[questionNumber].title}</div>
                <div className="options-container">
                  {questions[questionNumber].options.map((option, indx) => (
                    <div
                      className="option"
                      onClick={() => {
                        const question_id =
                          questions[questionNumber].question_id;
                        //if already answered we dont submit
                        if (response[question_id]) {
                          toast.error("Question Answered");
                        } else {
                          submitResponse(question_id, option.title);
                        }
                      }}
                    >
                      {indx + 1}. {option.title}
                    </div>
                  ))}
                </div>
                {response[questions[questionNumber].question_id] && (
                  <div className="flex gap-2">
                    <div>
                      Response:{" "}
                      {response[questions[questionNumber].question_id].response}
                    </div>
                    {response[questions[questionNumber].question_id]
                      .isCorrect ? (
                      <Icon
                        className="text-lg text-light-green dark:text-green"
                        icon={IconList.check}
                      />
                    ) : (
                      <Icon
                        className="text-lg text-light-red dark:text-red"
                        icon={IconList.xmark}
                      />
                    )}
                  </div>
                )}
              </div>
              <div className="w-full flex justify-between">
                <Button
                  variant="secondary"
                  onClick={() =>
                    setQuestionNumber((currNumber) =>
                      Math.max(currNumber - 1, 0)
                    )
                  }
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    setQuestionNumber((currNumber) =>
                      Math.min(currNumber + 1, questions.length - 1)
                    )
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}

        {joined &&
          isHost &&
          countdownState === CountdownState.ended &&
          contestData && (
            <div className="w-full h-full flex items-center justify-center gap-6">
              Time Remaining:{" "}
              <Countdown
                date={Date.now() + contestData.duration * 60 * 1000}
                onComplete={() => setCompletedModal(true)}
              />
            </div>
          )}

        {joined && isHost && countdownState === CountdownState.notStarted && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-6">
            <div>You are the host, click to start the contest</div>
            <Button
              variant="secondary"
              onClick={() => {
                startGame();
                setCountdownState(CountdownState.started);
              }}
            >
              Start
            </Button>
          </div>
        )}

        {joined && !isHost && countdownState === CountdownState.notStarted && (
          <div className="w-full h-full flex items-center justify-center">
            Waiting For Host To Start The Contest
          </div>
        )}

        {joined && countdownState === CountdownState.started && (
          <AnimatedCountdown
            timeInSec={10}
            onComplete={() => setCountdownState(CountdownState.ended)}
          />
        )}
        {isLoading && <Loader />}
        {error && <DisplayError errorMessage={error} />}
      </div>
      {joined && (
        <div className="live-leaderboard">
          <div className="text-xl text-center rounded-t-xl font-medium bg-gray-light dark:bg-gray-dark py-4">
            {countdownState === CountdownState.ended
              ? "Leaderboard"
              : "Participants"}
          </div>
          <div className="scores-container">
            {leaderboard.map((item) => (
              <div key={item.username} className="flex justify-between">
                <div>{item.username}</div>
                <div>{item.score}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Modal isOpen={isPasswordModalOpen} setIsOpen={setIsPasswordModalOpen}>
        <div className="w-[300px] relative">
          <div className={`flex flex-col gap-6 ${isLoading && "invisible"}`}>
            <Input
              inputType="text"
              inputLabel="Room Password"
              placeholder="eg. 1234446"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="secondary"
              onClick={() => {
                joinRoom(password);
              }}
            >
              Enter
            </Button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={completedModal} setIsOpen={setCompletedModal}>
        <div className="py-4 text-center">Contest Has Ended</div>
      </Modal>
    </div>
  );
};
