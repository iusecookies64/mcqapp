import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { Tooltip } from "react-tooltip";
import { NavBar } from "./components/Navbar/index.tsx";
import { Navigate, Outlet, RouterProvider } from "react-router-dom";
import "./App.css";
import { Signin } from "./pages/Signin/Signin.tsx";
import { Signup } from "./pages/Signup/Signup.tsx";
import { createBrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import PlayOptions from "./pages/PlayGame/PlayOptions.tsx";
import MyQuestions from "./pages/MyQuestions/MyQuestions.tsx";
import { AuthProvider } from "./components/AuthContext/index.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute/index.tsx";
import { Game } from "./pages/Game/Game.tsx";
import { MyTopics } from "./pages/MyTopics/MyTopics.tsx";
import { CreateCustomGame } from "./pages/CreateCustomGame/CreateCustomGame.tsx";
import { PastGames } from "./pages/PastGames/PastGames.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    id: "root",
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <PlayOptions />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-questions",
        element: (
          <ProtectedRoute>
            <MyQuestions />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-topics",
        element: (
          <ProtectedRoute>
            <MyTopics />
          </ProtectedRoute>
        ),
      },
      {
        path: "/custom-game",
        element: (
          <ProtectedRoute>
            <CreateCustomGame />
          </ProtectedRoute>
        ),
      },
      {
        path: "/game",
        element: (
          <ProtectedRoute>
            <Game />
          </ProtectedRoute>
        ),
      },
      {
        path: "/past-games",
        element: (
          <ProtectedRoute>
            <PastGames />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <Navigate to={"/"} />,
      },
      {
        path: "/signin",
        element: <Signin />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
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
    <AuthProvider>
      <div className="app">
        <NavBar />
        <div className="outlet-container">
          <Outlet />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
