import { Participant, Response, UserSubmitResponse } from "@mcqapp/types";
import "./style.css";
import { useEffect, useState } from "react";

type Props = {
  players: Participant[];
  responses: UserSubmitResponse[] | Response[];
  in_game: boolean;
};

export const Leaderboard = ({ players, responses, in_game }: Props) => {
  const [sortedPlayers, setSortedPlayers] = useState<Participant[]>([]);

  useEffect(() => {
    setSortedPlayers(players.map((p) => p).sort((a, b) => b.score - a.score));
  }, [players]);

  return (
    <div className="leaderboard">
      <div className="leaderboard-title">Leaderboard</div>
      <div>
        {sortedPlayers.map((player) => {
          const currResponse = responses.find(
            (r) => r.user_id === player.user_id
          );
          if (currResponse && in_game) {
            return (
              <div
                key={player.user_id}
                className={`leaderboard-item ${
                  currResponse?.is_correct
                    ? "correct-response"
                    : "wrong-response"
                }`}
              >
                <div>{player.username}</div>
                <div>{player.score}</div>
              </div>
            );
          }
          return (
            <div key={player.user_id} className="leaderboard-item">
              <div>{player.username}</div>
              <div>{player.score}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
