import { WebSocketServer } from "ws";
import extractAuthUser from "./auth/auth";
import url from "url";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, req) => {
  const token = url.parse(req.url || "", true).query.token as string;
  const userData = extractAuthUser(token);
  if (userData) {
  }
});
