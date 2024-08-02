import { PastGame, PastGameResponse } from "@mcqapp/types";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "../../components/Button";
import { useRecoilState } from "recoil";
import { pastGamesAtom } from "../../atoms/gamesAtom";
import api, { apiConfig, errorHandler } from "../../services/api";
import { toast } from "react-toastify";
import { Loader } from "../../components/Loader";
import { Modal } from "../../components/Modal";
import { QuestionCard } from "../../components/QuestionCard";
import { Leaderboard } from "../../components/Leaderboard";

export const PastGames = () => {
  const [pastGames, setPastGames] = useRecoilState(pastGamesAtom);
  const [searchParams] = useSearchParams();
  const [performanceModal, setPerformanceModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<PastGame | null>(null);

  useEffect(() => {
    if (searchParams.get("refresh") === "true" || !pastGames) {
      api[apiConfig.getPastGames.type](apiConfig.getPastGames.endpoint)
        .then((response) => {
          const { data } = response.data as PastGameResponse;
          setPastGames(
            data.sort(
              (a, b) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            )
          );
        })
        .catch((err) => {
          toast.error("Error getting past games");
          errorHandler(err);
        });
    }
  }, [searchParams, pastGames, setPastGames]);

  if (!pastGames) return <Loader />;

  return (
    <div className="w-full h-full flex flex-col gap-3 p-3">
      <div className="text-xl font-medium">Past Games</div>
      <div className="flex flex-col gap-3">
        {pastGames.map((g) => (
          <PastGameCard
            key={g.game_id}
            game={g}
            onEnter={() => {
              setSelectedGame(g);
              setPerformanceModal(true);
            }}
          />
        ))}
      </div>
      {selectedGame && (
        <GamePerformanceModal
          game={selectedGame}
          isOpen={performanceModal}
          setIsOpen={setPerformanceModal}
        />
      )}
    </div>
  );
};

type PastGameCardProps = {
  game: PastGame;
  onEnter: () => void;
};

const PastGameCard = ({ game, onEnter }: PastGameCardProps) => {
  return (
    <div className="flex gap-3 max-w-screen-lg items-center justify-between bg-secondary dark:bg-dark-secondary border border-border rounded-xl p-3">
      <div className="flex justify-around items-center gap-3">
        <div>
          <span className="text-text-secondary dark:text-dark-text-secondary">
            Topic:
          </span>{" "}
          {game.title}
        </div>
        <div className="text-text-secondary dark:text-dark-text-secondary">
          |
        </div>
        <div>
          <span className="text-text-secondary dark:text-dark-text-secondary">
            Played On
          </span>
          : {new Date(game.created_at).toDateString()}
        </div>
        <div className="text-text-secondary dark:text-dark-text-secondary">
          |
        </div>
        <div>
          <span className="text-text-secondary dark:text-dark-text-secondary">
            Participants:
          </span>{" "}
          {game.participants.length}
        </div>
        <div className="text-text-secondary dark:text-dark-text-secondary">
          |
        </div>
        <div>
          <span className="text-text-secondary dark:text-dark-text-secondary">
            Questions:
          </span>{" "}
          {game.questions.length}
        </div>
      </div>
      <div className="">
        <Button onClick={onEnter}>Enter</Button>
      </div>
    </div>
  );
};

type GamePerformanceModalProps = {
  game: PastGame;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const GamePerformanceModal = ({
  game,
  isOpen,
  setIsOpen,
}: GamePerformanceModalProps) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="h-[80vh] w-[80vw] overflow-y-scroll flex flex-col gap-3">
        <div className="w-full text-center text-lg font-bold">
          Game Performance
        </div>
        <div className="overflow-y-scroll flex gap-3 justify-start">
          <div className="w-full">
            <div className="font-medium">Game Questions</div>
            {game.questions.map((q, indx) => (
              <QuestionCard
                key={q.question_id}
                question={q}
                response={game.responses.find(
                  (r) => r.question_id === q.question_id
                )}
                index={indx}
                isLoading={false}
              />
            ))}
          </div>
          <div className="mt-6 h-full">
            <Leaderboard
              players={game.participants}
              responses={game.responses}
              in_game={false}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
