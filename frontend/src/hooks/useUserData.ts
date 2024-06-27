import { useEffect, useState } from "react";
import api from "../utils/api";
import { errorHandler } from "../utils/errorHandler";
import { useRecoilState } from "recoil";
import { userDataAtom } from "../atoms/userAtom";

export const useUserData = () => {
  const [userData, setUserData] = useRecoilState(userDataAtom);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (userData.user_id === 0) {
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
    isLoading,
    error,
  };
};
