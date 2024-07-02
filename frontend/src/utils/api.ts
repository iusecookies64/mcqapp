import axios from "axios";
import { getAuthorizationToken } from "./authToken";

export const api = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // Get the auth token from wherever you have it stored (e.g., localStorage)
    const token = getAuthorizationToken();

    // If the token exists, set it in the headers
    if (token) {
      config.headers["Authorization"] = token;
    }

    return config;
  },
  (error) => {
    // Handle the error
    return Promise.reject(error);
  }
);

export default api;
