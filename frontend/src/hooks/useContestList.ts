import { useEffect, useState } from "react";
import { Contest } from "../types/models";
import api from "../utils/api";
import { errorHandler } from "../utils/errorHandler";
import { AxiosResponse } from "axios";

export enum ContestType {
  upcomingContests = "/upcoming-contests",
  pastContests = "/past-contests",
  myContests = "/my-contests",
}

export type CreateContestData = {
  created_by: number;
  title: string;
  max_participants: number;
  start_time: string;
  duration: number;
  invite_only: boolean;
};

export type UpdateContestData = {
  title: string;
  max_participants: number;
  start_time: string;
  duration: number;
  invite_only: boolean;
  contest_id: number;
};

enum RequestMethod {
  post = "post",
  get = "get",
  delete = "delete",
}

export const useContestList = (contest: ContestType) => {
  const [contestList, setContestList] = useState<Contest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [refreshContestList, setRefreshContestList] = useState<number>(0);

  const sendRequest = (
    method: RequestMethod,
    url: string,
    data: object,
    responseHandler: (response: AxiosResponse) => void
  ) => {
    setIsLoading(true);
    if (method !== "post") {
      api[method](url).then(
        (response) => {
          responseHandler(response);
          setIsLoading(false);
        },
        (err) => {
          setIsLoading(false);
          setError(true);
          errorHandler(err);
        }
      );
    } else {
      api.post(url, data).then(
        (response) => {
          responseHandler(response);
          setIsLoading(false);
        },
        (err) => {
          setIsLoading(false);
          setError(true);
          errorHandler(err);
        }
      );
    }
  };

  const createContest = (contestData: CreateContestData) => {
    sendRequest(
      RequestMethod.post,
      "/contest/create",
      contestData,
      (response: AxiosResponse) => {
        setContestList((prevList) => {
          return [...prevList, response.data.data];
        });
        setIsLoading(false);
      }
    );
  };

  const updateContest = (updatedData: UpdateContestData, index: number) => {
    sendRequest(
      RequestMethod.post,
      "/contest/create",
      updatedData,
      (response) => {
        setContestList((prevList) => {
          prevList[index] = response.data.data;
          return [...prevList];
        });
        setIsLoading(false);
      }
    );
  };

  const deleteContest = (contest_id: number, index: number) => {
    sendRequest(
      RequestMethod.delete,
      `/contest/delete/${contest_id}`,
      {},
      () => {
        setContestList((prevList) => {
          prevList.splice(index, 1);
          return [...prevList];
        });
        setIsLoading(false);
      }
    );
  };

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    api.get(contest).then(
      (response) => {
        setContestList(response.data);
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
        setError(true);
        errorHandler(err);
      }
    );
  }, [refreshContestList, contest]);

  return {
    contestList,
    isLoading,
    error,
    setRefreshContestList,
    createContest,
    updateContest,
    deleteContest,
  };
};
