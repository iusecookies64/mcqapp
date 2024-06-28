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
  const [isLoadingList, setIsLoadingList] = useState<boolean>(false); // contest list loading
  const [errorLoadingList, setErrorLoadingList] = useState<boolean>(false);
  const [isLoadingCud, setIsLoadingCud] = useState<boolean>(false); // loading for create, update, delete (Cud)
  const [errorCud, setErrorCud] = useState<boolean>(false);

  const createContest = (
    contestData: CreateContestData,
    onSuccess: () => void
  ) => {
    sendRequest(
      RequestMethods.post,
      ContestURL.createContest,
      contestData,
      (response: AxiosResponse) => {
        // on success updating contest list
        setMyContests((prevList) => {
          if (prevList) return [...prevList, response.data.data];
          else return [response.data.data];
        });

        // on success calling onSuccess funtion
        onSuccess();
      },
      setIsLoadingCud,
      setErrorCud
    );
  };

  const updateContest = (
    updatedData: UpdateContestData,
    index: number,
    onSuccess: () => void
  ) => {
    sendRequest(
      RequestMethods.post,
      ContestURL.upcomingContests,
      updatedData,
      (response) => {
        // on success updating contest list
        setMyContests((prevList) => {
          if (prevList) {
            prevList[index] = response.data.data;
            return [...prevList];
          } else {
            return [];
          }
        });

        // on success calling onSuccess
        onSuccess();
      },
      setIsLoadingCud,
      setErrorCud
    );
  };

  const deleteContest = (
    contest_id: number,
    index: number,
    onSuccess: () => void
  ) => {
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

        // on success calling onSuccess
        onSuccess();
      },
      setIsLoadingCud,
      setErrorCud
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
      setIsLoadingList,
      setErrorLoadingList
    );
  };

  const fetchAllContests = () => {
    fetchContestList(ContestURL.upcomingContests, setUpcomingContests);
    fetchContestList(ContestURL.participatedContests, setParticipatedContests);
    fetchContestList(ContestURL.myContests, setMyContests);
  };

  useEffect(() => {
    if (contestsFetched === false) {
      fetchAllContests();
      setContestFetched(true);
    }
  }, []);

  return {
    upcomingContests,
    participatedContests,
    myContests,
    isLoadingList,
    errorLoadingList,
    isLoadingCud,
    errorCud,
    createContest,
    updateContest,
    deleteContest,
  };
};
