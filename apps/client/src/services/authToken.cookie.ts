import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const setAccessToken = (accessToken: string, expiresIn: number) => {
  cookies.set("access_token", accessToken, {
    path: "/",
    expires: new Date(new Date().getTime() + expiresIn * 60 * 1000),
  });
};

export const SetRefreshToken = (refreshToken: string) => {
  return cookies.set("refresh_token", refreshToken, {
    path: "/",
    expires: new Date(new Date().getTime() + 10000 * 60 * 1000),
  });
};

export const GetAccessToken = (): string => {
  return cookies.get("access_token");
};

export const GetRefreshToken = (): string => {
  return cookies.get("refresh_token");
};

export const ClearAll = () => {
  cookies.remove("access_token", { path: "/" });
  cookies.remove("refresh_token", { path: "/" });
};
