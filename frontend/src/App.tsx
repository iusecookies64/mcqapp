import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { Tooltip } from "react-tooltip";
import { NavBar } from "./components/navbar/NavBar";
import { Outlet } from "react-router-dom";
import "./App.css";
import { Icon, IconList } from "./components/Icon/Icon";
import { Logout } from "./components/logout/Logout";
import { Notifications } from "./components/notification/Notification";
import { CreateContest } from "./components/create-contest/CreateContest";
import { useRecoilValue } from "recoil";
import { userDataAtom } from "./atoms/userAtom";

function App() {
  const userData = useRecoilValue(userDataAtom);
  return (
    <div className="app">
      <NavBar />
      <Outlet />
      {userData.user_id && (
        <div className="app-options">
          <Logout />
          <Notifications />
          <CreateContest />
          <Icon icon={IconList.gear} toolTip="User Settings" />
        </div>
      )}
      <ToastContainer
        position="top-center"
        pauseOnHover
        autoClose={5000}
        hideProgressBar
        newestOnTop={true}
        closeOnClick
        rtl={false}
        theme="dark"
      />
      <Tooltip id="my-tooltip" />
    </div>
  );
}

export default App;
