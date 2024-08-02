import { NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "../Theme";
import { Logout } from "../Logout";
import "./style.css";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { Invitation } from "../Invitation";

export const NavBar = () => {
  const navigate = useNavigate();
  const { user, setUser, isLoading } = useContext(AuthContext);
  return (
    <div className="w-full border-b border-border flex justify-center">
      <div className="navbar">
        <div className="title" onClick={() => navigate("/")}>
          MCQ BATTLE
        </div>
        {user && (
          <ul className="flex gap-12">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Play Game
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/my-questions"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                My Questions
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/my-topics"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                My Topics
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/past-games"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Past Games
              </NavLink>
            </li>
          </ul>
        )}
        <div className="flex gap-6 items-center">
          <ThemeToggle />
          {user && <Logout setUser={setUser} />}
        </div>
      </div>
      {user && !isLoading && <Invitation />}
    </div>
  );
};
