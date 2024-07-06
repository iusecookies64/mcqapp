import { useSearchParams } from "react-router-dom";
import "./Lobby.style.css";
import { useLobby } from "../../hooks/useLobby";
import { useState } from "react";
import { Button } from "../../components/button/Button";
import { toast } from "react-toastify";
import { Loader } from "../../components/loader/Loader";

export const Lobby = () => {
  const [searchParams] = useSearchParams();
  const [questionNumber, setQuestionNumber] = useState(0);
  const {
    questions,
    response,
    leaderboard,
    notStarted,
    isLoading,
    submitResponse,
  } = useLobby(parseInt(searchParams.get("contest-id") || ""));
  return (
    <div className="lobby-container">
      {!notStarted && !isLoading && (
        <>
          {questions.length !== 0 && (
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
          <div className="live-leaderboard">
            <div className="text-xl text-center rounded-t-xl font-medium bg-gray-light dark:bg-gray-dark py-4">
              Leaderboard
            </div>
            <div className="scores-container">
              {leaderboard.map((item) => (
                <div className="flex justify-between">
                  <div>{item.username}</div>
                  <div>{item.score}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {notStarted && (
        <div className="w-full text-center">
          Contest Not Started Yet, If Started Then Reload
        </div>
      )}
      {isLoading && <Loader />}
    </div>
  );
};
