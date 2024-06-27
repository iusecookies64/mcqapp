import { useRecoilState } from "recoil";
import { notificationAtom } from "../atoms/notificationAtom";
import { useEffect, useState } from "react";
import { sendRequest } from "../utils/sendRequest";
import { RequestMethods } from "../types/requests";

export const useNotification = () => {
  const [notifications, setNotifications] = useRecoilState(notificationAtom);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const fetchNotifications = () => {
    sendRequest(
      RequestMethods.get,
      "/invitation/all-invitations",
      {},
      (response) => {
        setNotifications(response.data.data);
      },
      setIsLoading,
      setError
    );
  };

  useEffect(() => {
    if (notifications === null) {
      fetchNotifications();
    }
  }, []);

  return {
    notifications,
    isLoading,
    error,
  };
};
