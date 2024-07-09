import { useState } from "react";
import api from "../utils/api";
import { errorHandler } from "../utils/errorHandler";
import {
  removeAuthorizationToken,
  setAuthorizationToken,
} from "../utils/authToken";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const useUser = () => {
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
        setAuthorizationToken(response.data.token, response.data.expiresIn);
        setIsLoading(false);
        toast.success(response.data.message);
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
    removeAuthorizationToken();
    navigate("/");
  };

  return {
    signup,
    signin,
    logout,
    isLoading,
    error,
  };
};
