import { useState } from "react";
import api from "../services/api";
import { errorHandler } from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  ClearAll,
  SetRefreshToken,
  setAccessToken,
} from "../services/authToken.cookie";
import { SigninBody, SignupBody } from "@mcqapp/validations";
import { SigninResponse } from "@mcqapp/types";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();

  const signup = (data: SignupBody) => {
    setIsLoading(true);
    setError(false);
    api.post("/users/signup", data).then(
      (response) => {
        setIsLoading(false);
        toast.success(response.data.message);
        navigate("/signin");
      },
      (err) => {
        setIsLoading(false);
        setError(true);
        setTimeout(() => setError(false), 5000);
        errorHandler(err);
      }
    );
  };

  const signin = (data: SigninBody) => {
    setIsLoading(true);
    setError(false);
    api.post("/users/signin", data).then(
      (response) => {
        const { message, data } = response.data as SigninResponse;
        // storing token in local storage
        setAccessToken(data.access_token, data.expiresIn);
        SetRefreshToken(data.refresh_token);
        setIsLoading(false);
        toast.success(message);
        navigate("/");
      },
      (err) => {
        errorHandler(err);
        setIsLoading(false);
        setError(true);
        setTimeout(() => setError(false), 5000);
      }
    );
  };

  const logout = () => {
    ClearAll();
    navigate("/signin");
  };

  return {
    signup,
    signin,
    logout,
    isLoading,
    error,
  };
};
