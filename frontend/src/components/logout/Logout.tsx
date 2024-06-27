import { Icon, IconList } from "../Icon/Icon";
import { useSetRecoilState } from "recoil";
import { tokenAtom, userDataAtom } from "../../atoms/userAtom";
import { removeAuthorizationToken } from "../../utils/authToken";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
  const setTokenState = useSetRecoilState(tokenAtom);
  const setUserData = useSetRecoilState(userDataAtom);
  const navigate = useNavigate();
  const logout = () => {
    removeAuthorizationToken();
    setTokenState("");
    setUserData({ user_id: 0, username: "" });
    navigate("/signin");
  };
  return <Icon icon={IconList.exit} toolTip="Logout" onClick={logout} />;
};
