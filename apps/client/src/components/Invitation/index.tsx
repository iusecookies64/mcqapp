import { useEffect } from "react";
import WebSocketManager from "../../services/websocket";
import { InvitationResponse, SocketMessage } from "@mcqapp/types";
import { SocketMessageType } from "../../services/websocket";
import { toast } from "react-toastify";
import Button from "../Button";
import Icon, { IconList } from "../Icon";
import { useNavigate } from "react-router-dom";

export const Invitation = () => {
  const handlerId = "invitationHandler";
  const navigate = useNavigate();
  const handler = (event: MessageEvent) => {
    const data = JSON.parse(event.data) as SocketMessage;
    if (data.type === SocketMessageType.INVITATION) {
      const payload = data.payload as InvitationResponse;
      showInvitation(payload);
    }
  };
  const showInvitation = (payload: InvitationResponse) => {
    toast(
      <div className="flex justify-between items-center gap-2">
        <div>{payload.username} is inviting you to play</div>
        <Button
          size="sm"
          onClick={() => navigate(`/game?gameid=${payload.game_id}`)}
        >
          <Icon icon={IconList.check} />
        </Button>
      </div>,
      {
        position: "top-center",
        autoClose: 5000,
        className: "bg-secondary dark:bg-dark-secondary",
      }
    );
  };

  useEffect(() => {
    WebSocketManager.getInstance().addHandler({
      id: handlerId,
      handler,
    });

    return () => WebSocketManager.getInstance().removeHandler(handlerId);
  }, []);

  return <></>;
};
