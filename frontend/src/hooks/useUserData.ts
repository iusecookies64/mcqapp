import { useEffect, useState } from "react";
import { User } from "../types/models";
import api from "../utils/api";
import { errorHandler } from "../utils/errorHandler";

export const useUserData = () => {
  const [userData, setUserData] = useState<User>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    api.get("/user-data").then(
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
  }, []);

  return {
    userData,
    isLoading,
    error,
  };
};
