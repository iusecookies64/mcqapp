import "./NavBar.style.css";
import { NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "../Theme";
import { Logout } from "../Logout";

export const NavBar = () => {
  const navigate = useNavigate();
  return (
    <div className="navbar">
      <div className="title" onClick={() => navigate("/")}>
        MCQ Battle
      </div>
      <ul className="flex gap-12 text-lg font-medium">
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
            to="/past-games"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Past Games
          </NavLink>
        </li>
      </ul>
      <div className="flex gap-6 items-center">
        <ThemeToggle />
        <Logout />
      </div>
    </div>
  );
};
