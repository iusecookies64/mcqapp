import { useState } from "react";
import api, { apiConfig } from "../services/api";
import { errorHandler } from "../services/api";
import {
  ClearAll,
  SetRefreshToken,
  setAccessToken,
} from "../services/authToken.cookie";
import { SigninBody, SignupBody } from "@mcqapp/validations";
import { SigninResponse, User } from "@mcqapp/types";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const signup = (data: SignupBody, onSuccess?: () => void) => {
    setIsLoading(true);
    setError(false);
    api[apiConfig.signup.type](apiConfig.signup.endpoint, data).then(
      () => {
        setIsLoading(false);
        if (onSuccess) onSuccess();
      },
      (err) => {
        setIsLoading(false);
        setError(true);
        setTimeout(() => setError(false), 5000);
        errorHandler(err);
      }
    );
  };

  const signin = (data: SigninBody, onSuccess: (data: User) => void) => {
    setIsLoading(true);
    setError(false);
    api[apiConfig.signin.type](apiConfig.signin.endpoint, data).then(
      (response) => {
        const { data } = response.data as SigninResponse;
        // storing token in local storage
        setAccessToken(data.access_token, data.expiresIn);
        SetRefreshToken(data.refresh_token);
        setIsLoading(false);
        onSuccess(data.user);
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
    ClearAll(); // clearing all cookies
  };

  return {
    signup,
    signin,
    logout,
    isLoading,
    error,
  };
};
