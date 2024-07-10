import axios, { AxiosError, AxiosResponse } from "axios";
import { GetAccessToken, setAccessToken } from "./authToken.cookie";
import { RequestMethods } from "../types/requests";
import { redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { ClearAll } from "../services/authToken.cookie";

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

// function to handle repetitive task of setting isLoading, error
export const sendRequest = (
  method: RequestMethods,
  url: string,
  data: object,
  responseHandler: (response: AxiosResponse) => void,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // setting error and loading states
  setIsLoading(true);
  setError(false);

  // sending request based on method type
  if (method !== "post") {
    api[method](url).then(
      (response) => {
        responseHandler(response);
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
        setError(true);
        errorHandler(err);
      }
    );
  } else {
    api.post(url, data).then(
      (response) => {
        responseHandler(response);
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
        setError(true);
        setTimeout(() => setError(false), 5000);
        errorHandler(err);
      }
    );
  }
};

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

export default api;
