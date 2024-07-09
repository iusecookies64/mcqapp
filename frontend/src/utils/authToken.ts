import { redirect } from "react-router-dom";
import api from "./api";

export const getAuthorizationToken = () => localStorage.getItem("authToken");

export const removeAuthorizationToken = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("tokenExpiration");
};

export const setAuthorizationToken = (token: string, hours: number) => {
  localStorage.setItem("authToken", token);
  // storing expiration time
  const expirationTime = new Date();
  expirationTime.setHours(expirationTime.getHours() + hours);
  localStorage.setItem("tokenExpiration", expirationTime.toISOString());
};

export const getTokenDuration = (): number => {
  const storedExpirationTime = localStorage.getItem("tokenExpiration");
  if (!storedExpirationTime) {
    return -1;
  }
  const expirationTime = new Date(storedExpirationTime);
  // if stored string was manipulated and is invalid
  if (isNaN(expirationTime.getTime())) {
    return -1;
  }

  const currentTime = new Date();

  return expirationTime.getTime() - currentTime.getTime();
};

export const verifyAuthToken = async () => {
  try {
    const token = getAuthorizationToken();
    const response = await api.post("/users/verify-token", { token });
    return response.data.data;
  } catch (err) {
    return redirect("/signin");
  }
};
