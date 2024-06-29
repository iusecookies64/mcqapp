import { atom } from "recoil";
import { QuestionWithOptions } from "../types/models";

export const questionsAtom = atom<{
  contest_id: number;
  questions: QuestionWithOptions[];
}>({
  key: "questionAtom",
  default: {
    contest_id: 0,
    questions: [],
  },
});
