import { atom } from "recoil";
import { Contest } from "../types/models";

export const contestsFetchedAtom = atom<boolean>({
  key: "contestsFetched",
  default: false,
});

export const upcomingContestsAtom = atom<Contest[]>({
  key: "upcomingContests",
  default: [],
});

export const participatedContestsAtom = atom<Contest[]>({
  key: "participatedContests",
  default: [],
});

export const myContestsAtom = atom<Contest[]>({
  key: "myContests",
  default: [],
});
