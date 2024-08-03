import { config } from "dotenv";
config();
import { WebSocketServer } from "ws";
import extractAuthUser from "./auth/auth";
import url from "url";
import UserManager from "./UserManager";
import { User } from "./User";

const PORT = process.env.PORT || "3001";

const wss = new WebSocketServer({ port: parseInt(PORT) });

wss.on("connection", (ws, req) => {
  const token = url.parse(req.url || "", true).query.token as string;
  try {
    const userData = extractAuthUser(token);
    if (userData?.user_id && userData.username) {
      const user = new User(userData, ws);
      UserManager.getInstance().addUser(user);
    }
  } catch (err) {}
});
