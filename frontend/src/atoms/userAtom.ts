import { atom, selector } from "recoil";
import { getAuthorizationToken } from "../utils/authToken";
import axios from "axios";

export const tokenAtom = atom({
  key: "tokenAtom",
  default: getAuthorizationToken(),
});

export const userNameState = selector({
  key: "userAtom",
  get: async ({ get }) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/users/user-info",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: get(tokenAtom),
          },
        }
      );
      return {
        username: response.data.username,
        user_id: response.data.user_id,
      };
    } catch (err) {
      return null;
    }
  },
});
