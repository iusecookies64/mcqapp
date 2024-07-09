import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { sendRequest } from "../utils/sendRequest";
import { RequestMethods } from "../types/requests";
import { SetterOrUpdater } from "recoil";
import { Contest } from "../types/models";
import api from "../utils/api";

export enum ContestURL {
  activeContests = "/contest/active-contests",
  myContests = "/contest/my-contests",
  createContest = "/contest/create",
  updateContest = "/contest/update",
}

export type CreateContestBody = {
  created_by: number;
  title: string;
  max_participants: number;
  duration: number;
  is_locked: boolean;
  password: string;
};

export type UpdateContestBody = {
  title: string;
  max_participants: number;
  is_locked: boolean;
  password: string;
  duration: number;
  contest_id: number;
};

// taking fetch as argument for components that doesn't use contest list, only use create, update, delete functions
export const useAllContests = () => {
  const [activeContests, setActiveContests] = useState<Contest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // contest list loading
  const [error, setError] = useState<boolean>(false);

  const fetchContestList = (
    url: string,
    setContestList: SetterOrUpdater<Contest[]>
  ) => {
    sendRequest(
      RequestMethods.get,
      url,
      {},
      (response: AxiosResponse) => {
        setContestList(response.data.data || []);
      },
      setIsLoading,
      setError
    );
  };

  useEffect(() => {
    // fetching active contests
    fetchContestList(ContestURL.activeContests, setActiveContests);

    // polling for new contest every 10 seconds
    const timer = setInterval(() => {
      // fetching active contests this way to not change loading state
      api.get(ContestURL.activeContests).then((response) => {
        setActiveContests(response.data.data);
      });
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  return {
    activeContests,
    isLoading,
    error,
  };
};
