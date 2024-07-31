import { Topic } from "@mcqapp/types";
import { atom } from "recoil";

export const topicsAtom = atom<Topic[] | null>({
  key: "topicAtom",
  default: null,
});

export const selectedTopicAtom = atom<Topic | null>({
  key: "selectedTopicAtom",
  default: null,
});
