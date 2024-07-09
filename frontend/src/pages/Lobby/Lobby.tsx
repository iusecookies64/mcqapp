import { useSearchParams } from "react-router-dom";
import "./Lobby.style.css";
import { CountdownState, useLobby } from "../../hooks/useLobby";
import { useEffect, useState } from "react";
import { Button } from "../../components/button/Button";
import { toast } from "react-toastify";
import { Loader } from "../../components/loader/Loader";
import { Modal } from "../../components/modal/Modal";
import { Input } from "../../components/input/Input";
import Countdown from "react-countdown";
import { DisplayError } from "../../components/display_error/DisplayError";

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

  useEffect(() => {
    console.log("isLocked", isLocked, "joined", joined);
    if (!isLocked || joined) {
      setIsPasswordModalOpen(false);
    } else if (isLocked && !joined) {
      setIsPasswordModalOpen(true);
    }
  }, [joined, isLocked]);

  return (
    <div className="lobby-container">
      {joined &&
        !isHost &&
        countdownState === CountdownState.ended &&
        questions.length && (
          <div className="questions-container">
            <div className="flex flex-col p-4 rounded-lg gap-6 bg-gray-light w-full">
              <div className="text-xl font-medium">
                Question {questionNumber + 1}
              </div>
              <div>Q. {questions[questionNumber].title}</div>
              <div>
                {questions[questionNumber].options.map((option) => (
                  <div
                    onClick={() => {
                      const question_id = questions[questionNumber].question_id;
                      //if already answered we dont submit
                      if (response[question_id]) {
                        toast.error("Question Answered");
                      } else {
                        submitResponse(question_id, option.title);
                      }
                    }}
                  >
                    {option.title}
                  </div>
                ))}
                {response[questions[questionNumber].question_id] && (
                  <div>
                    Response:
                    {response[questions[questionNumber].question_id].response}
                  </div>
                )}
              </div>
            </div>
            <div className="w-full flex justify-between">
              <Button
                variant="secondary"
                onClick={() =>
                  setQuestionNumber((currNumber) => Math.max(currNumber - 1, 0))
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

      {joined && isHost && (
        <div>
          <div>You are the host, click below to start the contest</div>
          <Button variant="secondary" onClick={startGame}>
            Start
          </Button>
        </div>
      )}

      {joined && !isHost && countdownState === CountdownState.notStarted && (
        <div className="w-full text-center">
          Waiting For Host To Start The Contest
        </div>
      )}
      {joined && countdownState === CountdownState.started && (
        <Countdown
          date={Date.now() + 10000}
          onComplete={() => setCountdownState(CountdownState.ended)}
        />
      )}
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

      {error && <DisplayError errorMessage={error} />}

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
          {isLoading && <Loader />}
        </div>
      </Modal>
    </div>
  );
};
