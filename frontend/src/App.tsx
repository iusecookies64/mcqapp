import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { Tooltip } from "react-tooltip";
import { NavBar } from "./components/navbar/NavBar";
import { Outlet } from "react-router-dom";
import "./App.css";
import { Icon, IconList } from "./components/Icon/Icon";
import { Logout } from "./components/logout/Logout";
import { Notifications } from "./components/notification/Notification";

function App() {
  return (
    <div className="app">
      <NavBar />
      <Outlet />
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
      <div className="app-options">
        <Logout />
        <Notifications />
        <Icon icon={IconList.plus} toolTip="Create New Contest" />
        <Icon icon={IconList.gear} toolTip="User Settings" />
      </div>
    </div>
  );
}

export default App;
