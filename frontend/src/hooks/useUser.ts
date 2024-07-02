import { useEffect, useState } from "react";
import api from "../utils/api";
import { errorHandler } from "../utils/errorHandler";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userDataAtom } from "../atoms/userAtom";
import {
  getAuthorizationToken,
  removeAuthorizationToken,
  setAuthorizationToken,
} from "../utils/authToken";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { notificationAtom } from "../atoms/notificationAtom";
import { contestsFetchedAtom } from "../atoms/contestAtom";

export const useUser = (fetch = false) => {
  const setNotifications = useSetRecoilState(notificationAtom);
  const setContestsFetched = useSetRecoilState(contestsFetchedAtom);
  const [userData, setUserData] = useRecoilState(userDataAtom);
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
        setAuthorizationToken(response.data.token);
        setIsLoading(false);
        toast.success(response.data.message);
        // setting user data
        setUserData({
          user_id: response.data.user_id,
          username: response.data.username,
        });
      },
      (err) => {
        errorHandler(err);
        setIsLoading(false);
        setError(true);
      }
    );
  };

  const logout = () => {
    removeAuthorizationToken();
    setNotifications(null);
    setContestsFetched(false);
    setUserData({ user_id: 0, username: "" });
    navigate("/signin");
  };

  useEffect(() => {
    // if user info not available and auth token available then get user info
    if (userData.user_id === 0 && getAuthorizationToken() && fetch) {
      setIsLoading(true);
      api.get("/users/user-info").then(
        (response) => {
          setUserData(response.data);
          setIsLoading(false);
        },
        (err) => {
          errorHandler(err);
          setIsLoading(false);
          setError(true);
        }
      );
    }
  }, []);

  return {
    userData,
    setUserData,
    signup,
    signin,
    logout,
    isLoading,
    error,
  };
};
