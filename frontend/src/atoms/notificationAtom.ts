import { atom } from "recoil";

export type Notification = {
  invitation_id: number;
  contest_id: number;
  title: number;
  created_by: number;
  username: string;
};

export const notificationAtom = atom<Notification[] | null>({
  key: "notificationAtom",
  default: null,
});
