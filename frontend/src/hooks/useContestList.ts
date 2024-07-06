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
import { toast } from "react-toastify";
import { sortByTime } from "../utils/sortByTime";

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

// taking fetch as argument for components that doesn't use contest list, only use create, update, delete functions
export const useContestList = (fetch = true) => {
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
    onSuccess: (resonse: AxiosResponse) => void
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
        onSuccess(response);
      },
      setIsLoadingCud,
      setErrorCud
    );
  };

  const updateContest = (
    updatedData: UpdateContestData,
    onSuccess: () => void
  ) => {
    const index = myContests.findIndex(
      (contest) => contest.contest_id === updatedData.contest_id
    );
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

  const publishContest = (contest_id: number, publish: boolean) => {
    sendRequest(
      RequestMethods.post,
      `/contest/publish`,
      { contest_id, publish },
      () => {
        toast.success(
          `Contest ${publish ? "Published" : "Unpublished"} Successfully`
        );
        // updating my contest list on success
        const indx = myContests.findIndex(
          (contest) => contest.contest_id === contest_id
        );
        if (indx !== -1) {
          setMyContests((prevList) => {
            const updatedList = [...prevList];
            updatedList.splice(indx, 1, {
              ...prevList[indx],
              published: publish,
            });
            return updatedList;
          });
        }
      },
      setIsLoadingCud,
      setErrorCud
    );
  };

  const joinContest = (contest_id: number) => {
    sendRequest(
      RequestMethods.get,
      `/contest/join?contest_id=${contest_id}`,
      {},
      () => {
        toast.success("Contest Joined Successfully");
        // updating the upcoming and participated contest list
        const indx = upcomingContests.findIndex(
          (contest) => contest.contest_id === contest_id
        );
        if (indx !== -1) {
          const contestData = upcomingContests[indx];
          const newParticipatedContest = [...participatedContests];
          newParticipatedContest.push(contestData);
          newParticipatedContest.sort((a, b) =>
            sortByTime(a.start_time, b.start_time)
          );
          setParticipatedContests(newParticipatedContest);
        }
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
        // sorting the list
        const list = response.data.data as Contest[];
        list.sort((a, b) => sortByTime(a.start_time, b.start_time));
        setContestList(response.data.data || []);
      },
      setIsLoadingList,
      setErrorLoadingList
    );
  };

  const fetchAllContests = () => {
    fetchContestList(ContestURL.upcomingContests, setUpcomingContests);
    fetchContestList(ContestURL.myContests, setMyContests);
    fetchContestList(ContestURL.participatedContests, setParticipatedContests);
  };

  useEffect(() => {
    if (contestsFetched === false && fetch !== false) {
      fetchAllContests();
      setContestFetched(true);
    }
  }, [contestsFetched]);

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
    publishContest,
    joinContest,
  };
};
