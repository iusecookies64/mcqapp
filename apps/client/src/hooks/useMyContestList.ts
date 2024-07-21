import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { sendRequest } from "../services/api";
import { RequestMethods } from "../types/requests";
import { SetterOrUpdater, useRecoilState } from "recoil";
import { myContestsAtom } from "../atoms/contestAtom";
import { Contest } from "../types/models";
import { toast } from "react-toastify";

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
export const useMyContestList = (fetch: boolean) => {
  const [myContests, setMyContests] = useRecoilState(myContestsAtom);
  const [isLoadingList, setIsLoadingList] = useState<boolean>(false); // contest list loading
  const [errorLoadingList, setErrorLoadingList] = useState<boolean>(false);
  const [isLoadingCud, setIsLoadingCud] = useState<boolean>(false); // loading for create, update, delete (Cud)
  const [errorCud, setErrorCud] = useState<boolean>(false);

  const createContest = (
    contestData: CreateContestBody,
    onSuccess: (resonse: AxiosResponse) => void
  ) => {
    sendRequest(
      RequestMethods.post,
      ContestURL.createContest,
      contestData,
      (response: AxiosResponse) => {
        // on success updating contest list
        setMyContests((prevList) => {
          return [...prevList, response.data.data];
        });

        // on success calling onSuccess funtion
        onSuccess(response);
      },
      setIsLoadingCud,
      setErrorCud
    );
  };

  const updateContest = (
    updatedData: UpdateContestBody,
    onSuccess: () => void
  ) => {
    const index = myContests.findIndex(
      (contest) => contest.contest_id === updatedData.contest_id
    );
    sendRequest(
      RequestMethods.post,
      ContestURL.updateContest,
      updatedData,
      (response) => {
        // on success updating contest list
        setMyContests((prevList) => {
          const newList = [...prevList];
          if (index !== -1) {
            newList.splice(index, 1, response.data.data);
            return [...newList];
          } else {
            return [...newList, response.data.data];
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

  const publishContest = (contest_id: number, onSuccess: () => void) => {
    sendRequest(
      RequestMethods.post,
      `/contest/publish?contest_id=${contest_id}`,
      {},
      () => {
        toast.success(`Game Published Successfully`);
        // updating my contest list on success
        const indx = myContests.findIndex(
          (contest) => contest.contest_id === contest_id
        );
        if (indx !== -1) {
          setMyContests((prevList) => {
            const updatedList = prevList.map((contest) => {
              if (contest.contest_id === contest_id) {
                return { ...contest, published: true };
              } else {
                return contest;
              }
            });
            return updatedList;
          });
        }
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

  useEffect(() => {
    // if no fetch required
    if (!fetch) return;
    // fetching my-contests
    fetchContestList(ContestURL.myContests, setMyContests);
  }, [setMyContests]);

  return {
    myContests,
    isLoadingList,
    errorLoadingList,
    isLoadingCud,
    errorCud,
    createContest,
    updateContest,
    deleteContest,
    publishContest,
  };
};
