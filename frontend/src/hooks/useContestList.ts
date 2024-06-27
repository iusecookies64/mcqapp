import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { sendRequest } from "../utils/sendRequest";
import { RequestMethods } from "../types/requests";
import { SetterOrUpdater, useRecoilState } from "recoil";
import {
  upcomingContestsAtom,
  participatedContestsAtom,
  myContestsAtom,
  contestsFetchedAtom,
} from "../atoms/contestAtom";
import { Contest } from "../types/models";

export enum ContestURL {
  upcomingContests = "/contest/upcoming-contests",
  participatedContests = "/contest/participated-contests",
  myContests = "/contest/my-contests",
  createContest = "/contest/create",
  updateContest = "/contest/update",
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

export const useContestList = () => {
  const [upcomingContests, setUpcomingContests] =
    useRecoilState(upcomingContestsAtom);
  const [participatedContests, setParticipatedContests] = useRecoilState(
    participatedContestsAtom
  );
  const [myContests, setMyContests] = useRecoilState(myContestsAtom);
  const [contestsFetched, setContestFetched] =
    useRecoilState(contestsFetchedAtom);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const createContest = (contestData: CreateContestData) => {
    sendRequest(
      RequestMethods.post,
      ContestURL.createContest,
      contestData,
      (response: AxiosResponse) => {
        setMyContests((prevList) => {
          if (prevList) return [...prevList, response.data.data];
          else return [response.data.data];
        });
      },
      setIsLoading,
      setError
    );
  };

  const updateContest = (updatedData: UpdateContestData, index: number) => {
    sendRequest(
      RequestMethods.post,
      ContestURL.upcomingContests,
      updatedData,
      (response) => {
        setMyContests((prevList) => {
          if (prevList) {
            prevList[index] = response.data.data;
            return [...prevList];
          } else {
            return [];
          }
        });
      },
      setIsLoading,
      setError
    );
  };

  const deleteContest = (contest_id: number, index: number) => {
    sendRequest(
      RequestMethods.delete,
      `/contest/delete/${contest_id}`,
      {},
      () => {
        setMyContests((prevList) => {
          if (prevList) {
            prevList.splice(index, 1);
            return [...prevList];
          } else {
            return [];
          }
        });
      },
      setIsLoading,
      setError
    );
  };

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
    if (contestsFetched === false) {
      fetchContestList(ContestURL.upcomingContests, setUpcomingContests);
      fetchContestList(
        ContestURL.participatedContests,
        setParticipatedContests
      );
      fetchContestList(ContestURL.myContests, setMyContests);
      setContestFetched(true);
    }
  }, []);

  return {
    upcomingContests,
    participatedContests,
    myContests,
    isLoading,
    error,
    createContest,
    updateContest,
    deleteContest,
  };
};
