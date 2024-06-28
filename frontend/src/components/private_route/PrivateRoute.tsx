import { ReactNode } from "react";
import { useRecoilValue } from "recoil";
import { userDataAtom } from "../../atoms/userAtom";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const userData = useRecoilValue(userDataAtom);
  return userData.user_id ? children : <Navigate to={"/signin"} />;
};
