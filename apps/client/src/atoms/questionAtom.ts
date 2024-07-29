import { atom } from "recoil";
import { Question } from "@mcqapp/types";

export const questionsAtom = atom<Question[] | null>({
  key: "questionAtom",
  default: null,
});
