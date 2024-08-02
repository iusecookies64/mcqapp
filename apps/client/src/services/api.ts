import axios, { AxiosError, AxiosResponse } from "axios";
import { GetAccessToken, setAccessToken } from "./authToken.cookie";
import { redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { ClearAll } from "./authToken.cookie";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // Get the auth token from wherever you have it stored (e.g., localStorage)
    const token = GetAccessToken();

    // If the token exists, set it in the headers
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let refreshTokenPromise: Promise<AxiosResponse> | null = null;

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (err: AxiosError) => {
    const originalRequest = err.config;

    // if error is due to invalid token first time
    if (
      err.response?.status === 401 &&
      originalRequest &&
      // @ts-expect-error: adding property to the object
      !originalRequest._retry
    ) {
      // checking if a request for new token sent already
      if (!refreshTokenPromise) {
        // sending request for new access token
        refreshTokenPromise = axios.get("/token");
      }
      const response = await refreshTokenPromise;
      const newToken = response.data.access_token;
      setAccessToken(newToken, response.data.expiresIn);
      // marking as retry for original request
      // @ts-expect-error: adding property to the object
      originalRequest._retry = true;
      originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

      // resetting refreshTokenPromise
      refreshTokenPromise = null;

      // resending original request with new token
      return api(originalRequest);
    }

    // this means either error not 401 or  refresh token also got error
    return Promise.reject(err);
  }
);

export const errorHandler = (err: AxiosError) => {
  if (err.status === 401) {
    // token is invalid so we delete token and redirect to signin
    ClearAll();
    redirect("/signin");
  } else {
    const response = err.response as AxiosResponse;
    // notifying error to user
    toast.error(response.data.message);
  }
};

enum Method {
  get = "get",
  post = "post",
}

export const apiConfig = {
  signin: { type: Method.post, endpoint: "/users/signin" },
  signup: { type: Method.post, endpoint: "/users/signup" },
  protected: { type: Method.get, endpoint: "/users/protected" },
  usersSearch: { type: Method.post, endpoing: "/users/users-search" },
  createQuestion: { type: Method.post, endpoint: "/questions/create" },
  updateQuestion: { type: Method.post, endpoint: "/questions/update" },
  deleteQuestion: { type: Method.post, endpoint: "/questions/delete" },
  getMyQuestions: { type: Method.get, endpoint: "/questions/my-questions" },
  getTopics: { type: Method.get, endpoint: "/topics/all" },
  createTopic: { type: Method.post, endpoint: "/topics/create" },
  upadteTopic: { type: Method.post, endpoint: "/topics/update" },
  deleteTopic: { type: Method.post, endpoint: "/topics/delete" },
  getPastGames: { type: Method.get, endpoint: "/games/past-games" },
};

export type apiConfigType = typeof apiConfig;

export default api;
