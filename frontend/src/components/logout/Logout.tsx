import { Icon, IconList } from "../Icon/Icon";
import { useUser } from "../../hooks/useUser";

export const Logout = () => {
  const { logout } = useUser();
  return <Icon icon={IconList.exit} toolTip="Logout" onClick={logout} />;
};
