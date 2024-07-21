import { atom } from "recoil";
import { Contest } from "../types/models";

export const myContestsAtom = atom<Contest[]>({
  key: "myContests",
  default: [],
});
