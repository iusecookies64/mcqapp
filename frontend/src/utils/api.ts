import axios from "axios";
import { getAuthorizationToken } from "./authToken";

export const api = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
    Authorization: getAuthorizationToken() || "",
  },
});

export default api;
