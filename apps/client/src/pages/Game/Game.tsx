import { useNavigate, useSearchParams } from "react-router-dom";
import "./Game.style.css";
import { useContext, useEffect, useState } from "react";
import WebSocketManager, { SocketMessageType } from "../../services/websocket";
import {
  GameCreatedResponse,
  GameStartedResponse,
  GetMatchingUsersResponse,
  Host,
  JoinGameResponse,
  NewHostResponse,
  NewUserResponse,
  NextQuestionResponse,
  Player,
  Question,
  SocketMessage,
  Topic,
  UserDisconnectedResponse,
  UserLeftResponse,
  UserReconnectedResponse,
  UserSubmitResponse,
} from "@mcqapp/types";
import {
  GetMatchingUsersBody,
  InitGameBody,
  JoinGameBody,
  NextQuestionBody,
  SendInvitationBody,
  StartGameBody,
  SubmitResponseBody,
} from "@mcqapp/validations";
import { Loader } from "../../components/Loader";
import { toast } from "react-toastify";
import { AuthContext } from "../../components/AuthContext";
import { GameQuestionCard } from "../../components/QuestionCard";
import { Modal } from "../../components/Modal";
import { InitGameModal } from "../../components/InitGameModal/InitGameModal";
import useDebounce from "../../hooks/useDebounce";
import api, { apiConfig, errorHandler } from "../../services/api";
import Input from "../../components/Input";
import Icon, { IconList } from "../../components/Icon";
import Button from "../../components/Button";
import { Leaderboard } from "../../components/Leaderboard";

export const Game = () => {
  const gameid = "gameid";
  const handlerId = "GameSocketHandler";
  const { user } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currGameId, setCurrGameId] = useState<string | null>(null);
  const [topicSelectorModal, setTopicSelectorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isRandom, setIsRandom] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [gameJoined, setGameJoined] = useState(false);
  const [currQuestion, setCurrQuestion] = useState<Question | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(
    null
  );
  const [currQuestionResponses, setCurrQuestionResponses] = useState<
    UserSubmitResponse[]
  >([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [host, setHost] = useState<Host | null>(null);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [gameEndedModal, setGameEndedModal] = useState(false);
  const [sendInviteModal, setSendInviteModal] = useState(false);

  const createGame = (topic: Topic, is_random: boolean) => {
    if (topic.topic_id) {
      setIsLoading(true);
      const payload: InitGameBody = {
        topic_id: topic.topic_id,
        is_random,
      };
      WebSocketManager.getInstance().sendMessage(
        JSON.stringify({
          type: SocketMessageType.INIT_GAME,
          payload,
        })
      );
    }
  };

  const getNextQuestion = () => {
    if (currGameId) {
      const payload: NextQuestionBody = {
        game_id: currGameId,
      };
      setTimeout(() => {
        WebSocketManager.getInstance().sendMessage(
          JSON.stringify({
            type: SocketMessageType.GET_NEXT_QUESTION,
            payload,
          })
        );
      }, 1000);
    }
  };

  const submitResponse = (response: number) => {
    if (isCustom && host?.user_id === user?.user_id) return;
    if (currQuestion?.question_id && currGameId) {
      setLoadingResponse(true);
      const payload: SubmitResponseBody = {
        question_id: currQuestion.question_id,
        game_id: currGameId,
        response,
      };

      WebSocketManager.getInstance().sendMessage(
        JSON.stringify({
          type: SocketMessageType.SUBMIT_RESPONSE,
          payload,
        })
      );
    }
  };

  const sendInvites = (user_ids: number[]) => {
    if (currGameId) {
      const payload: SendInvitationBody = {
        game_id: currGameId,
        user_ids,
      };
      WebSocketManager.getInstance().sendMessage(
        JSON.stringify({
          type: SocketMessageType.SEND_INVITATTION,
          payload,
        })
      );
    }
  };

  const startGame = () => {
    if (currGameId) {
      const payload: StartGameBody = {
        game_id: currGameId,
      };
      WebSocketManager.getInstance().sendMessage(
        JSON.stringify({
          type: SocketMessageType.START_GAME,
          payload,
        })
      );
    }
  };

  // if there is a game id then we try to join that game
  useEffect(() => {
    const game_id = searchParams.get(gameid);
    if (game_id) {
      setIsLoading(true);
      const payload: JoinGameBody = {
        game_id,
      };
      WebSocketManager.getInstance().sendMessage(
        JSON.stringify({
          type: SocketMessageType.JOIN_GAME,
          payload,
        })
      );
    }
  }, []);

  useEffect(() => {
    // checking if gameid not present in params, then show topic modal
    if (!searchParams.get(gameid)) {
      setTopicSelectorModal(true);
    } else {
      setTopicSelectorModal(false);
    }
  }, [searchParams]);

  useEffect(() => {
    WebSocketManager.getInstance().addHandler({
      id: handlerId,
      handler: (event: MessageEvent) => {
        const data = JSON.parse(event.data) as SocketMessage;

        if (data.type === SocketMessageType.GAME_CREATED) {
          const payload = data.payload as GameCreatedResponse;
          setSearchParams({ gameid: payload.game_id });
          setCurrGameId(payload.game_id);
          setIsRandom(payload.is_random);
          setIsCustom(payload.is_custom);
          setHost(payload.host);
          // if not custom game, then adding current user as a player in the game
          if (!payload.is_custom) {
            if (user) {
              setPlayers(() => [
                {
                  ...user,
                  score: 0,
                },
              ]);
            }
          }
          setGameJoined(true);
          setIsLoading(false);
        }

        if (data.type === SocketMessageType.GAME_JOINED) {
          const payload = data.payload as JoinGameResponse;
          setSearchParams({ gameid: payload.game_id });
          setCurrGameId(payload.game_id);
          setPlayers(payload.players);
          setIsRandom(payload.is_random);
          setIsCustom(payload.is_custom);
          setHost(payload.host);
          setGameJoined(true);
          setIsLoading(false);
        }

        if (data.type === SocketMessageType.GAME_NOT_FOUND) {
          setTopicSelectorModal(true);
        }

        if (data.type === SocketMessageType.GAME_STARTED) {
          const payload = data.payload as GameStartedResponse;
          setIsLoading(false);
          setIsStarted(true);
          setCurrQuestion(payload.question);
          setQuestionStartTime(payload.questionStartTime);
        }

        if (data.type === SocketMessageType.GAME_ENDED) {
          setGameEndedModal(true);
        }

        if (data.type === SocketMessageType.NEW_USER) {
          const payload = data.payload as NewUserResponse;
          if (payload.user_id === user?.user_id) return;
          setPlayers((prev) => [...prev, payload]);
          toast.info(`${payload.username} Joined The Game`);
        }

        if (data.type === SocketMessageType.USER_LEFT) {
          const payload = data.payload as UserLeftResponse;
          setPlayers((prev) =>
            prev.filter((p) => p.user_id !== payload.user_id)
          );
          toast.info(`${payload.username} left`);
        }

        if (data.type === SocketMessageType.NEW_HOST) {
          const payload = data.payload as NewHostResponse;
          setHost(payload);
          toast.info(`${payload.username} is the new host`);
        }

        if (data.type === SocketMessageType.USER_RESPONSE) {
          const payload = data.payload as UserSubmitResponse;
          setCurrQuestionResponses((prev) => [...prev, payload]);
          // if correct we update the players score list
          if (payload.is_correct) {
            setPlayers((prev) => {
              const newList = prev.map((p) => {
                if (p.user_id === payload.user_id) {
                  p.score = payload.score;
                }
                return p;
              });
              return newList;
            });
          }
          // if response for current users submission then we show an animated response
          if (payload.user_id === user?.user_id) {
            // showAnimatedResponse();
            setLoadingResponse(false);
          }
        }

        if (data.type === SocketMessageType.NEXT_QUESTION) {
          const payload = data.payload as NextQuestionResponse;
          // setting show card to false for 200ms for animation
          setLoadingResponse(false);
          setCurrQuestion(payload.question);
          setQuestionStartTime(payload.questionStartTime);
          setCurrQuestionResponses([]);
        }

        if (data.type === SocketMessageType.USER_DISCONNECTED) {
          const payload = data.payload as UserDisconnectedResponse;
          toast.info(`${payload.username} disconnected`);
        }

        if (data.type === SocketMessageType.USER_RECONNECTED) {
          const payload = data.payload as UserReconnectedResponse;
          if (payload.user_id !== user?.user_id) {
            toast.info(`${payload.username} reconnected`);
          }
        }
      },
    });
    return () => WebSocketManager.getInstance().removeHandler(handlerId);
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div className="game-container">
      {gameJoined && (
        <div className="p-3">
          <div className="flex justify-between p-3 items-center">
            {host && <div>Host: {host.username}</div>}
            {(isCustom || !isRandom) && host?.user_id === user?.user_id && (
              <Button onClick={() => setSendInviteModal(true)}>
                Send Invites
              </Button>
            )}
          </div>
          <div className="flex gap-3 min-h-96">
            <div className="game-main-section">
              {isStarted && currQuestion && questionStartTime && (
                <GameQuestionCard
                  key={currQuestion.question_id}
                  question={currQuestion}
                  start_time={questionStartTime}
                  getNextQuestion={getNextQuestion}
                  loadingResponse={loadingResponse}
                  submitResponse={submitResponse}
                  response={currQuestionResponses.find(
                    (r) => r.user_id === user?.user_id
                  )}
                />
              )}
              {!isStarted && isRandom && (
                <div>Waiting for the game to start</div>
              )}
              {!isStarted &&
                (!isRandom || isCustom) &&
                host?.user_id !== user?.user_id && (
                  <div>Waiting for the host to start the game</div>
                )}
              {!isStarted &&
                (!isRandom || isCustom) &&
                host?.user_id === user?.user_id && (
                  <div className="flex flex-col justify-center items-center gap-3">
                    <div>You Are The Host, Click Start To Start The Game</div>
                    <Button onClick={startGame}>Start</Button>
                  </div>
                )}
            </div>
            <Leaderboard
              players={players}
              responses={currQuestionResponses}
              in_game={true}
            />
          </div>
        </div>
      )}
      <InitGameModal
        isOpen={topicSelectorModal}
        setIsOpen={setTopicSelectorModal}
        createGame={createGame}
        is_random_game={
          searchParams.get("is_random") === "false" ? false : true
        }
      />
      <GameEndedModal isOpen={gameEndedModal} setIsOpen={setGameEndedModal} />
      <SendInviteModal
        isOpen={sendInviteModal}
        setIsOpen={setSendInviteModal}
        sendInvites={sendInvites}
      />
    </div>
  );
};

type SendInviteModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sendInvites: (number: number[]) => void;
};

type SearchUser = {
  username: string;
  user_id: number;
};

const SendInviteModal = ({
  isOpen,
  setIsOpen,
  sendInvites,
}: SendInviteModalProps) => {
  const [matchingUsersList, setMatchingUsersList] = useState<SearchUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<SearchUser[]>([]);
  const [searchedString, setSearchedString] = useState<string>("");
  const debouncedSearchString = useDebounce(searchedString);
  const selectUser = (user: SearchUser) => {
    setSelectedUsers((prev) => [...prev, user]);
  };
  const removeUser = (user_id: number) => {
    setSelectedUsers((prev) => prev.filter((p) => p.user_id !== user_id));
  };

  useEffect(() => {
    if (debouncedSearchString) {
      const body: GetMatchingUsersBody = {
        searchString: debouncedSearchString,
      };
      api[apiConfig.usersSearch.type](apiConfig.usersSearch.endpoing, body)
        .then((response) => {
          const { data } = response.data as GetMatchingUsersResponse;
          setMatchingUsersList(data);
        })
        .catch((err) => {
          console.log("Error getting matching users");
          errorHandler(err);
        });
    }
    // send a request to get matching users
  }, [debouncedSearchString]);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="flex flex-col gap-3 min-w-96">
        <div>Send Invites</div>
        <div className="relative">
          <Input
            inputType="text"
            value={searchedString}
            onChange={(e) => setSearchedString(e.target.value)}
            placeholder="Enter your friends username"
          />
          <div className="bg-primary dark:bg-dark-primary absolute top-full left-0 w-full">
            {matchingUsersList
              .filter(
                (u) => !selectedUsers.find((uu) => uu.user_id === u.user_id)
              )
              .map((u) => (
                <div
                  key={u.user_id}
                  className="p-3 hover:bg-secondary dark:hover:bg-dark-secondary cursor-pointer"
                  onClick={() => selectUser(u)}
                >
                  {u.username}
                </div>
              ))}
          </div>
        </div>
        <div className="min-h-72 max-h-96 overflow-y-hidden">
          {selectedUsers.map((u) => (
            <div key={u.user_id} className="flex justify-between p-3">
              <div>{u.username}</div>
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => removeUser(u.user_id)}
              >
                <Icon icon={IconList.xmark} />
              </Button>
            </div>
          ))}
        </div>
        <div className="w-full flex justify-end">
          <Button
            onClick={() => {
              sendInvites(selectedUsers.map((u) => u.user_id));
              setIsOpen(false);
            }}
          >
            Send
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const GameEndedModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  return (
    <Modal isClosable={false} isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="min-w-72 flex flex-col gap-3">
        <div className="text-2xl font-meduim p-3 text-center">
          Game has ended
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="tertiary" onClick={() => navigate("/")}>
            Go Back
          </Button>
          <Button onClick={() => navigate("/past-games?refresh=true")}>
            See Performance
          </Button>
        </div>
      </div>
    </Modal>
  );
};
