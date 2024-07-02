import { atom } from "recoil";
import { QuestionWithOptions } from "../types/models";

export const questionsAtom = atom<QuestionWithOptions[]>({
  key: "questionAtom",
  default: [],
});
