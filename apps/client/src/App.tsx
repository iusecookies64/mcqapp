import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { Tooltip } from "react-tooltip";
import { NavBar } from "./components/Navbar/index.tsx";
import { Navigate, Outlet, RouterProvider } from "react-router-dom";
import "./App.css";
import { Signin } from "./pages/Signin/Signin.tsx";
import { Signup } from "./pages/Signup/Signup.tsx";
import { createBrowserRouter } from "react-router-dom";
import { Protected } from "./services/auth.ts";
import { RecoilRoot } from "recoil";
import PlayOptions from "./pages/PlayGame/PlayOptions.tsx";
import MyQuestions from "./pages/MyQuestions/MyQuestions.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    loader: Protected,
    id: "root",
    children: [
      {
        index: true,
        element: <PlayOptions />,
      },
      {
        path: "/my-questions",
        element: <MyQuestions />,
      },
      {
        path: "*",
        element: <Navigate to={"/"} />,
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
    <div className="app">
      <NavBar />
      <Outlet />
    </div>
  );
}

export default App;
