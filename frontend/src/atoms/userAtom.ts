import { atom } from "recoil";
import { getAuthorizationToken } from "../utils/authToken";

export const tokenAtom = atom({
  key: "tokenAtom",
  default: getAuthorizationToken(),
});

export const userDataAtom = atom<{ username: string; user_id: number }>({
  key: "userDataAtom",
  default: {
    user_id: 0,
    username: "",
  },
});
