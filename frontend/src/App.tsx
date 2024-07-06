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
import { Routes, Route, Navigate } from "react-router-dom";
import { Signin } from "./pages/Signin/Signin.tsx";
import { Signup } from "./pages/Signup/Signup.tsx";
import { Contests } from "./pages/Contests/Contests.tsx";
import { CompileContest } from "./pages/CompileContest/CompileContest.tsx";
import { Lobby } from "./pages/Lobby/Lobby.tsx";
import { PrivateRoute } from "./components/private_route/PrivateRoute.tsx";
import { useUser } from "./hooks/useUser.ts";
import { Loader } from "./components/loader/Loader.tsx";
import { DisplayError } from "./components/display_error/DisplayError.tsx";

const App = () => {
  // defining all the paths
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <PrivateRoute>
              <Contests />
            </PrivateRoute>
          }
        />
        <Route
          path="/compile-contest"
          element={
            <PrivateRoute>
              <CompileContest />
            </PrivateRoute>
          }
        />
        <Route
          path="/lobby"
          element={
            <PrivateRoute>
              <Lobby />
            </PrivateRoute>
          }
        />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
};

function Layout() {
  // first we try to initialize user and then render layout
  const { userData, isLoading, error } = useUser(true);
  return (
    <div className="app">
      {!isLoading && !error && (
        <>
          <NavBar />
          <div className="w-full h-full flex justify-between">
            <Outlet />
            {userData.user_id && (
              <div className="app-options">
                <Logout />
                <Notifications />
                <CreateContest />
                <Icon icon={IconList.gear} toolTip="User Settings" />
              </div>
            )}
          </div>
          <ToastContainer
            position="top-center"
            pauseOnHover
            autoClose={3000}
            hideProgressBar
            newestOnTop={true}
            closeOnClick
            rtl={false}
            theme="dark"
          />
          <Tooltip id="my-tooltip" />
        </>
      )}
      {isLoading && <Loader />}
      {error && <DisplayError errorMessage="Something Went Wrong" />}
    </div>
  );
}

export default App;
