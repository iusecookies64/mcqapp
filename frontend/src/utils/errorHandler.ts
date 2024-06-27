import { AxiosError } from "axios";
import { removeAuthorizationToken } from "./authToken";
import { redirect } from "react-router-dom";
import { ApiResponse } from "../types/response";
import { toast } from "react-toastify";

export const errorHandler = (err: AxiosError) => {
  const data = err.response?.data as ApiResponse;
  if (data?.message === "INVALID_TOKEN") {
    // token is invalid so we delete token and redirect to signin
    removeAuthorizationToken();
    redirect("/signin");
  } else {
    // notifying error to user
    toast.error(data?.message);
  }
};
