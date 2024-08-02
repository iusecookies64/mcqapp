import { PastGame } from "@mcqapp/types";
import { atom } from "recoil";

export const pastGamesAtom = atom<PastGame[] | null>({
  key: "pastGamesAtom",
  default: null,
});
