import { WebSocket } from "ws";
import { userJwtClaims } from "./auth/auth";

export class User {
  socket: WebSocket;
  user_id: number;
  username: string;

  constructor(userDetails: userJwtClaims, socket: WebSocket) {
    this.user_id = userDetails.user_id;
    this.username = userDetails.username;
    this.socket = socket;
  }

  emit(message: string) {
    this.socket.send(message);
  }
}
