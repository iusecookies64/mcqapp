import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { Navigate } from "react-router-dom";
import { Loader } from "../Loader";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useContext(AuthContext);
  if (user) {
    return children;
  } else if (isLoading) {
    return <Loader />;
  } else {
    return <Navigate to={"/signin"} />;
  }
};
