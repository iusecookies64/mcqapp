import { Icon, IconList } from "../Icon/Icon";
import { useSetRecoilState } from "recoil";
import { tokenAtom } from "../../atoms/userAtom";
import { removeAuthorizationToken } from "../../utils/authToken";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
  const setTokenState = useSetRecoilState(tokenAtom);
  const navigate = useNavigate();
  const logout = () => {
    removeAuthorizationToken();
    setTokenState("");
    navigate("/signin");
  };
  return <Icon icon={IconList.exit} toolTip="Logout" onClick={logout} />;
};
