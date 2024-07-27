import { config } from "dotenv";
config();
import { WebSocketServer } from "ws";
import extractAuthUser from "./auth/auth";
import url from "url";
import UserManager from "./UserManager";
import { User } from "./User";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, req) => {
  const token = url.parse(req.url || "", true).query.token as string;
  const userData = extractAuthUser(token);
  if (userData) {
    const user = new User(userData, ws);
    console.log("user came", user.user_id, user.username);
    UserManager.getInstance().addUser(user);
  }
});
