import { GetAccessToken } from "./authToken.cookie";

const BASE_URL = import.meta.env.VITE_APP_WS_URL;

type WSMessageHandler = {
  id: string;
  handler: (event: MessageEvent) => void;
};

export enum SocketMessageType {
  INIT_GAME = "initialize_game",
  INIT_CUSTOM_GAME = "initialize_custom_game",
  START_GAME = "start_game",
  JOIN_GAME = "join_game",
  GAME_NOT_FOUND = "game_not_found",
  LEAVE_GAME = "leave_game",
  NEW_USER = "new_user",
  GAME_CREATED = "game_created",
  CUSTOM_GAME_CREATED = "custom_game_created",
  GAME_STARTED = "game_started",
  GAME_JOINED = "game_joined",
  GET_NEXT_QUESTION = "get_next_question",
  NEXT_QUESTION = "next_question",
  USER_LEFT = "user_left",
  USER_DISCONNECTED = "user_disconnected",
  USER_RECONNECTED = "user_reconnected",
  GAME_ENDED = "game_ended",
  NEW_HOST = "new_host",
  SUBMIT_RESPONSE = "submit_response",
  USER_RESPONSE = "user_response",
  SEND_INVITATTION = "send_invitation",
  INVITATION = "invitation",
}

class WebSocketManager {
  private static instance: WebSocketManager | null = null;
  private socket: WebSocket | null = null;
  private timer: NodeJS.Timeout | null = null;
  private tryReconnectIn: number = 2000;
  private messageHandlers: WSMessageHandler[] = [];
  private pendingMessages: string[] = [];
  private constructor() {
    this.connect();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new WebSocketManager();
    }

    return this.instance;
  }

  private connect() {
    const token = GetAccessToken();
    const socket = new WebSocket(BASE_URL + `?token=${token}`);
    socket.onopen = () => {
      this.socket = socket;
      // sending pending messages
      this.pendingMessages.forEach((message) => this.sendMessage(message));
      this.pendingMessages = [];
      // removing timer if there is any
      if (this.timer) clearInterval(this.timer);
      // adding onmessage handler
      this.socket.onmessage = (event) => {
        this.onMessage(event);
      };
      // adding handler for on close
      this.socket.onclose = () => {
        this.socket = null;
        // on close start a timer that reconnects every 2s
        this.timer = setInterval(() => {
          this.connect();
        }, this.tryReconnectIn);
      };
    };
  }
  private onMessage(event: MessageEvent) {
    this.messageHandlers.forEach((h) => h.handler(event));
  }

  addHandler(handler: WSMessageHandler) {
    this.messageHandlers.push(handler);
  }

  removeHandler(id: string) {
    this.messageHandlers = this.messageHandlers.filter((h) => h.id !== id);
  }

  sendMessage(data: string) {
    if (this.socket) {
      this.socket.send(data);
    } else {
      this.pendingMessages.push(data);
    }
  }
}

export default WebSocketManager;
