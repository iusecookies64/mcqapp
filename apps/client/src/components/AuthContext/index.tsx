import { User } from "@mcqapp/types";
import { createContext, useEffect, useState } from "react";
import { Protected } from "../../services/auth";

export const AuthContext = createContext<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>> | null;
}>({
  user: null,
  setUser: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>({
    user_id: 0,
    username: "test",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const data = await Protected();
      setUser(data);
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
