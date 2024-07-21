import { useAuth } from "../../hooks/useAuth";
import { Icon, IconList } from "../Icon";

export const Logout = () => {
  const { logout } = useAuth();
  return (
    <div
      className="h-10 w-10 flex justify-center items-center rounded-full cursor-pointer hover:bg-opacity-25 dark:hover:bg-opacity-25 hover:bg-gray dark:hover:bg-white"
      data-tooltip-id="my-tooltip"
      data-tooltip-content="Logout"
      onClick={logout}
    >
      <Icon icon={IconList.exit} className="h-6 w-6" />
    </div>
  );
};
