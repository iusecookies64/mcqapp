import { redirect } from "react-router-dom";
import api from "./api";
import { toast } from "react-toastify";

export const Protected = async () => {
  try {
    const response = await api.get("/users/protected");
    return response.data.data;
  } catch (err) {
    toast.info("Session Expired, Signin Again");
    return redirect("/signin");
  }
};
