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

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();

  const signup = (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(false);
    api.post("/users/signup", { username, email, password }).then(
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

  const signin = (username: string, password: string) => {
    setIsLoading(true);
    setError(false);
    api.post("/users/signin", { username, password }).then(
      (response) => {
        // storing token in local storage
        setAccessToken(response.data.access_token, response.data.expiresIn);
        SetRefreshToken(response.data.refresh_token);
        setIsLoading(false);
        toast.success(response.data.message);
        navigate("/active-contests");
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
