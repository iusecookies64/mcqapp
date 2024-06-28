import { Icon, IconList } from "../Icon/Icon";
import { useSetRecoilState } from "recoil";
import { userDataAtom } from "../../atoms/userAtom";
import { removeAuthorizationToken } from "../../utils/authToken";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
  const setUserData = useSetRecoilState(userDataAtom);
  const navigate = useNavigate();
  const logout = () => {
    removeAuthorizationToken();
    setUserData({ user_id: 0, username: "" });
    navigate("/signin");
  };
  return <Icon icon={IconList.exit} toolTip="Logout" onClick={logout} />;
};
