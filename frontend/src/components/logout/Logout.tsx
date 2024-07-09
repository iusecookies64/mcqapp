import { useUser } from "../../hooks/useUser";

export const Logout = () => {
  const { logout } = useUser();
  return (
    <div
      className="h-10 w-10 p-2 flex justify-center items-center rounded-full cursor-pointer hover:bg-opacity-25 dark:hover:bg-opacity-25 hover:bg-gray dark:hover:bg-white"
      data-tooltip-id="my-tooltip"
      data-tooltip-content="Logout"
      onClick={logout}
    >
      <i className="fa-solid fa-right-from-bracket"></i>
    </div>
  );
};
