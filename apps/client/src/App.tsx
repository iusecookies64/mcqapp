import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { Tooltip } from "react-tooltip";
import { NavBar } from "./components/Navbar/index.tsx";
import { Navigate, Outlet, RouterProvider } from "react-router-dom";
import "./App.css";
import { Signin } from "./pages/Signin/Signin.tsx";
import { Signup } from "./pages/Signup/Signup.tsx";
import { Contests } from "./pages/MyContests/MyContests.tsx";
import { CompileContest } from "./pages/CompileContest/CompileContest.tsx";
import { Lobby } from "./pages/Lobby/Lobby.tsx";
import { createBrowserRouter } from "react-router-dom";
import ActiveContests from "./pages/ActiveContests/ActiveContests.tsx";
import { Protected } from "./services/auth.ts";
import { RecoilRoot } from "recoil";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    loader: Protected,
    id: "root",
    children: [
      {
        path: "/my-contests",
        element: <Contests />,
      },
      {
        path: "/active-contests",
        element: <ActiveContests />,
      },
      {
        path: "lobby",
        element: <Lobby />,
      },
      {
        path: "compile-contest",
        element: <CompileContest />,
      },
      {
        index: true,
        element: <Navigate to={"/active-contests"} />,
      },
    ],
  },
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

const App = () => {
  return (
    <RecoilRoot>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        pauseOnHover
        autoClose={3000}
        hideProgressBar
        newestOnTop={true}
        closeOnClick
        rtl={false}
        theme="dark"
      />
      <Tooltip id="my-tooltip" />
    </RecoilRoot>
  );
};

function Layout() {
  return (
    <div className="bg-slate-900">
      <NavBar />
      <Outlet />
    </div>
  );
}

export default App;
